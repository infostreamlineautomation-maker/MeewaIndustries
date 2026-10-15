#!/usr/bin/env bash
# ==============================================================================
# MEEWA Industries - Automated Production Deployment Script
# ==============================================================================
# Usage:
#   bash deploy.sh                (Full deployment: pull, db sync, build & restart)
#   bash deploy.sh --quick        (Fast deploy: pull, db sync, restart without rebuild)
#   bash deploy.sh --backend-only (Update backend & DB only)
# ==============================================================================

set -e

# Styling
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 1. Resolve project root directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo -e "${BLUE}=====================================================${NC}"
echo -e "${GREEN}     MEEWA Industries - Server Deployment Script      ${NC}"
echo -e "${BLUE}=====================================================${NC}"
echo -e "Deployment started at: $(date)"
echo -e "Directory: ${SCRIPT_DIR}\n"

# Parse arguments
SKIP_BUILD=false
BACKEND_ONLY=false

for arg in "$@"; do
    case $arg in
        --quick|--skip-build)
            SKIP_BUILD=true
            ;;
        --backend-only)
            BACKEND_ONLY=true
            SKIP_BUILD=true
            ;;
    esac
done

# 2. Git Pull Latest Changes
log_info "Fetching latest changes from Git repository..."
if [ -d ".git" ]; then
    CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
    log_info "Active branch: ${CURRENT_BRANCH}"
    git pull origin "${CURRENT_BRANCH}"
    log_success "Git repository updated successfully."
else
    log_warn "Not a git repository or .git folder not found. Skipping git pull."
fi

# 3. Check for Docker Compose vs VPS Native Environment
USE_DOCKER=false
if command -v docker &> /dev/null && command -v docker-compose &> /dev/null || command -v docker &> /dev/null && docker compose version &> /dev/null; then
    # Check if docker containers are already actively running
    if docker ps --format '{{.Names}}' | grep -q -E "meewa|frontend_web|backend_api"; then
        USE_DOCKER=true
    fi
fi

if [ "$USE_DOCKER" = true ]; then
    log_info "Docker environment detected with active MEEWA containers."
    log_info "Rebuilding and restarting Docker containers..."
    
    if docker compose version &> /dev/null; then
        docker compose up -d --build
    else
        docker-compose up -d --build
    fi
    
    log_info "Running database schema creation & media library sync inside backend container..."
    if docker compose version &> /dev/null; then
        docker compose exec -T backend_api python -c "from database import engine, SessionLocal; import models; models.Base.metadata.create_all(bind=engine); from utils.media import sync_existing_media; from utils.storage import LOCAL_UPLOAD_DIR; db = SessionLocal(); print('Synced media items:', sync_existing_media(db, LOCAL_UPLOAD_DIR))" || log_warn "Container DB sync warning (non-fatal)."
    else
        docker-compose exec -T backend_api python -c "from database import engine, SessionLocal; import models; models.Base.metadata.create_all(bind=engine); from utils.media import sync_existing_media; from utils.storage import LOCAL_UPLOAD_DIR; db = SessionLocal(); print('Synced media items:', sync_existing_media(db, LOCAL_UPLOAD_DIR))" || log_warn "Container DB sync warning (non-fatal)."
    fi

    log_success "Docker deployment complete!"
    docker ps
    exit 0
fi

# 4. Native VPS Deployment (Python venv + Node.js)
log_info "Proceeding with Native VPS Deployment..."

# 4A. Backend Updates & Database Migrations
if [ -d "backend" ]; then
    log_info "Updating Backend..."
    cd backend

    # Ensure venv exists
    if [ ! -d "venv" ]; then
        log_info "Creating Python virtual environment in backend/venv..."
        python3 -m venv venv
    fi

    # Activate venv
    source venv/bin/activate
    
    log_info "Installing Python dependencies..."
    pip install -r requirements.txt --quiet
    
    log_info "Synchronizing database schema and Media Library assets..."
    python -c "from database import engine, SessionLocal; import models; models.Base.metadata.create_all(bind=engine); from utils.media import sync_existing_media; from utils.storage import LOCAL_UPLOAD_DIR; db = SessionLocal(); print('Synced media items:', sync_existing_media(db, LOCAL_UPLOAD_DIR))"
    
    # Run Alembic migrations if alembic is configured
    if [ -f "alembic.ini" ]; then
        log_info "Running Alembic migrations..."
        alembic upgrade head || log_warn "Alembic upgrade exited with status $? (continuing)."
    fi

    deactivate
    cd ..
    log_success "Backend dependencies and database synced successfully."
fi

# 4B. Frontend Build
if [ "$BACKEND_ONLY" = false ] && [ -d "frontend" ]; then
    if [ "$SKIP_BUILD" = false ]; then
        log_info "Building Public Frontend (Next.js)..."
        cd frontend
        npm install --prefer-offline --no-audit
        npm run build
        cd ..
        log_success "Public Frontend built successfully."
    else
        log_info "Skipping Public Frontend build (--skip-build requested)."
    fi
fi

# 4C. Admin Frontend Build
if [ "$BACKEND_ONLY" = false ] && [ -d "admin_frontend" ]; then
    if [ "$SKIP_BUILD" = false ]; then
        log_info "Building Admin Frontend (Next.js)..."
        cd admin_frontend
        npm install --prefer-offline --no-audit
        npm run build
        cd ..
        log_success "Admin Frontend built successfully."
    else
        log_info "Skipping Admin Frontend build (--skip-build requested)."
    fi
fi

# 5. Restart Running Services
log_info "Restarting services..."

# Check PM2
if command -v pm2 &> /dev/null; then
    PM2_RUNNING=$(pm2 list | grep -E "online|errored|stopped" || true)
    if [ -n "$PM2_RUNNING" ]; then
        log_info "Restarting PM2 processes..."
        pm2 restart all
        log_success "PM2 processes restarted."
    fi
fi

# Check Systemd Services
SYSTEMD_SERVICES=("meewa-backend" "meewa-admin-backend" "meewa-frontend" "meewa-admin-frontend" "meewa")
for service in "${SYSTEMD_SERVICES[@]}"; do
    if systemctl is-active --quiet "$service" 2>/dev/null || systemctl is-enabled --quiet "$service" 2>/dev/null; then
        log_info "Restarting systemd service: ${service}..."
        sudo systemctl restart "$service"
        log_success "Service ${service} restarted."
    fi
done

# Reload Nginx if active
if command -v nginx &> /dev/null; then
    if sudo nginx -t &> /dev/null; then
        log_info "Reloading Nginx configuration..."
        sudo systemctl reload nginx || sudo service nginx reload || true
        log_success "Nginx reloaded."
    else
        log_warn "Nginx configuration test failed. Skipping Nginx reload."
    fi
fi

echo -e "\n${BLUE}=====================================================${NC}"
log_success "MEEWA Platform deployed successfully!"
echo -e "${BLUE}=====================================================${NC}"
echo -e "Deployment completed at: $(date)\n"
