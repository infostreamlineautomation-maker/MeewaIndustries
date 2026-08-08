# Production Deployment Guide (Hostinger)

This guide covers deploying the full MEEWA application (Frontend, Admin Frontend, FastAPI Backend, and PostgreSQL) to a Hostinger VPS using Docker Compose and Nginx.

## 1. Initial VPS Setup

1. **Purchase & Setup VPS**: Buy a VPS on Hostinger. Ubuntu 22.04 or 24.04 LTS is recommended.
2. **Connect via SSH**: Connect to your server using `ssh root@<your_vps_ip>`.
3. **Update the System**:
   ```bash
   apt update && apt upgrade -y
   ```

## 2. Install Docker and Docker Compose

Run the following commands to install Docker:
```bash
# Install dependencies
apt install -y apt-transport-https ca-certificates curl software-properties-common

# Add Docker’s official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -

# Add Docker repository
add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

# Install Docker
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

## 3. Clone Repository and Configure

1. Clone your project to the VPS:
   ```bash
   git clone <your-repo-url> /opt/meewa
   cd /opt/meewa
   ```
2. **Environment Configuration**:
   - Create a `.env` file in the root directory (copy from `.env.example` if you have one).
   - Ensure you set strong passwords for `POSTGRES_USER`, `POSTGRES_PASSWORD`, and `POSTGRES_DB`.
   - Ensure the Next.js `.env` files point to the correct production domain.

## 4. Build and Run with Docker Compose

Your repository already contains a `docker-compose.yml` configured for all services.

1. Build and start the containers in detached mode:
   ```bash
   docker compose up -d --build
   ```
2. Check the logs to ensure everything started correctly:
   ```bash
   docker compose logs -f
   ```

## 5. Domain & Nginx Reverse Proxy

You can use the built-in Nginx container or a host-level Nginx to route traffic based on subdomains (e.g., `admin.meewa.com` and `meewa.com`).

If using host-level Nginx:
1. Install Nginx: `apt install nginx -y`
2. Create site configurations in `/etc/nginx/sites-available/` pointing to your Docker exposed ports.
   - Main site points to `localhost:3000`
   - Admin site points to `localhost:3001`
   - API points to `localhost:8000` (or proxy `/api` on main domain).
3. Enable sites and restart Nginx.

## 6. SSL Configuration (Let's Encrypt)

Secure your domain with free SSL certificates using Certbot.

1. Install Certbot:
   ```bash
   apt install -y certbot python3-certbot-nginx
   ```
2. Obtain and apply certificates for your domains:
   ```bash
   certbot --nginx -d meewa.com -d www.meewa.com -d admin.meewa.com
   ```
3. Certbot will automatically configure your Nginx files to serve traffic over HTTPS and set up auto-renewal.

Your production application is now fully deployed and secured on Hostinger!
