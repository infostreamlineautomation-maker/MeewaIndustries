# MEEWA B2B Platform - Production Deployment (Hostinger)

This guide covers the deployment of your platform to a Hostinger VPS. This is meant for your full production environment once the demo phase is complete.

## Architecture
- **VPS Server**: Hostinger Ubuntu Server (e.g., Ubuntu 22.04 LTS).
- **Database**: PostgreSQL running in a Docker container (or locally on the VPS).
- **Backend API**: FastAPI running in a Docker container (or via systemd).
- **Frontend & Admin**: Hosted statically (via Vercel for ease of updates) OR served via Nginx on the VPS. *This guide assumes you want to keep using Vercel for the frontends, as it offers the best performance for Next.js out of the box.*

---

## Step 1: Provision the VPS
1. Purchase and set up an Ubuntu VPS on Hostinger.
2. Obtain the IP address and root password.
3. SSH into your server:
   ```bash
   ssh root@your_vps_ip
   ```
4. Update the system packages:
   ```bash
   apt update && apt upgrade -y
   ```

---

## Step 2: Install Docker and Docker Compose
Docker ensures your backend and database run in an isolated, reproducible environment.

1. Install Docker:
   ```bash
   apt install docker.io -y
   systemctl start docker
   systemctl enable docker
   ```
2. Install Docker Compose:
   ```bash
   apt install docker-compose -y
   ```

---

## Step 3: Clone Your Codebase
1. Generate an SSH key on your server and add it to your GitHub account.
2. Clone your backend repository into a dedicated directory:
   ```bash
   mkdir /var/www
   cd /var/www
   git clone git@github.com:yourusername/meewa-backend.git
   cd meewa-backend
   ```

---

## Step 4: Configure Production `.env`
Create a `.env` file in the root of your cloned repository on the VPS.

```bash
nano .env
```

Paste your production credentials:
```env
# Use the local PostgreSQL container we will spin up
DATABASE_URL=postgresql+psycopg://meewa_user:securepassword@db:5432/meewa_prod

# We can keep using Cloudinary for production media, or switch to local storage backed by the VPS disk.
STORAGE_PROVIDER=cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Security
SECRET_KEY=generate_a_very_long_secure_random_string_here
CORS_ORIGINS=https://your-production-domain.com
ADMIN_CORS_ORIGINS=https://admin.your-production-domain.com
```

---

## Step 5: Run the Backend & Database via Docker
Create a `docker-compose.yml` file in your repository:

```yaml
version: '3.8'

services:
  db:
    image: postgres:15
    restart: always
    environment:
      POSTGRES_USER: meewa_user
      POSTGRES_PASSWORD: securepassword
      POSTGRES_DB: meewa_prod
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: .
    restart: always
    command: uvicorn main:app --host 0.0.0.0 --port 8000
    env_file:
      - .env
    ports:
      - "8000:8000"
    depends_on:
      - db

volumes:
  postgres_data:
```

*(Note: We will help you write the `Dockerfile` for the backend when you are ready for this phase).*

Start the services:
```bash
docker-compose up -d
```

---

## Step 6: Setup Nginx Reverse Proxy & SSL (HTTPS)
You need to map your domain (e.g., `api.yourdomain.com`) to port 8000 on the VPS and secure it with SSL.

1. Install Nginx and Certbot:
   ```bash
   apt install nginx certbot python3-certbot-nginx -y
   ```
2. Create an Nginx config file:
   ```bash
   nano /etc/nginx/sites-available/meewa-api
   ```
3. Add the proxy configuration:
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;

       location / {
           proxy_pass http://localhost:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```
4. Enable the site and restart Nginx:
   ```bash
   ln -s /etc/nginx/sites-available/meewa-api /etc/nginx/sites-enabled/
   nginx -t
   systemctl restart nginx
   ```
5. Apply SSL (HTTPS):
   ```bash
   certbot --nginx -d api.yourdomain.com
   ```

---

## Step 7: Update Frontends
Once the VPS API is live and secured with HTTPS, update your Vercel Environment Variables (`NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_ADMIN_API_URL`) to point to `https://api.yourdomain.com`.
