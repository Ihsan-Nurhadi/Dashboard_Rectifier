# 🚀 Quick Start - Production Deployment

## Prerequisites
- VPS with Ubuntu 20.04+
- Docker & Docker Compose installed
- Domain name pointing to your VPS IP

## 5-Minute Deployment

### 1. Upload to VPS

```bash
# On your local machine
scp rectifier-monitoring-production.tar.gz user@your-vps-ip:/home/user/

# On VPS
ssh user@your-vps-ip
mkdir -p ~/apps/rectifier
cd ~/apps/rectifier
tar -xzf ~/rectifier-monitoring-production.tar.gz
cd rectifier-monitoring
```

### 2. Configure

```bash
# Backend environment
cp backend/.env.example backend/.env
nano backend/.env
```

**Change these:**
```env
SECRET_KEY=generate-with-python-command-below
ALLOWED_HOSTS=your-domain.com,www.your-domain.com
POSTGRES_PASSWORD=your-secure-password
CORS_ALLOWED_ORIGINS=https://your-domain.com
```

**Generate SECRET_KEY:**
```bash
python3 -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
```

**Frontend environment:**
```bash
nano frontend-nextjs/.env.production
```

```env
NEXT_PUBLIC_API_URL=https://your-domain.com/api
```

**Nginx config:**
```bash
nano nginx/conf.d/default.conf
```

Change line 8:
```nginx
server_name your-domain.com www.your-domain.com;
```

### 3. Deploy

```bash
# One command deploy!
./deploy.sh

# Or manual:
docker-compose build
docker-compose up -d
```

### 4. Create Admin User

```bash
docker-compose exec backend python manage.py createsuperuser
```

### 5. Access

- **Dashboard**: http://your-domain.com
- **Admin**: http://your-domain.com/admin/
- **API**: http://your-domain.com/api/

---

## Setup SSL (Optional - 5 min)

```bash
# Get certificate
docker-compose run --rm certbot certonly --webroot \
  --webroot-path /var/www/certbot \
  -d your-domain.com \
  --email your-email@example.com \
  --agree-tos

# Edit nginx config to enable HTTPS
nano nginx/conf.d/default.conf
# Uncomment HTTPS server block (line 63-94)
# Change domain names

# Restart
docker-compose restart nginx
```

---

## Common Commands

```bash
# View logs
docker-compose logs -f

# Restart service
docker-compose restart backend

# Stop all
docker-compose down

# Update code
git pull  # or upload new files
docker-compose up -d --build

# Backup database
docker-compose exec db pg_dump -U rectifier_user rectifier_db > backup.sql
```

---

## Troubleshooting

**Service not starting:**
```bash
docker-compose logs service-name
docker-compose restart service-name
```

**Frontend can't reach backend:**
- Check CORS in backend/.env
- Check NEXT_PUBLIC_API_URL in frontend
- Check nginx proxy settings

**Database issues:**
```bash
# Check database
docker-compose exec db psql -U rectifier_user -d rectifier_db

# Reset (WARNING: deletes data!)
docker-compose down -v
docker-compose up -d
```

---

## What's Included

✅ **Backend**: Django + Gunicorn + PostgreSQL  
✅ **Frontend**: Next.js (standalone build)  
✅ **Database**: PostgreSQL 15  
✅ **Cache**: Redis 7  
✅ **Reverse Proxy**: Nginx  
✅ **SSL**: Certbot (Let's Encrypt)  
✅ **MQTT**: Auto-subscribe & save to DB  

---

## Architecture

```
Internet → Nginx (80/443)
    ├─→ Frontend (Next.js) :3000
    └─→ Backend (Django) :8000
            ├─→ PostgreSQL :5432
            ├─→ Redis :6379
            └─→ MQTT Client
```

---

## Performance

- Gunicorn: 3 workers (adjust in docker-compose.yml)
- Next.js: Standalone optimized build
- Static files: Cached by Nginx
- Database: PostgreSQL with indexes
- Auto-scaling: Add more workers as needed

---

That's it! Your dashboard is live! 🎉

For detailed docs, see **DEPLOYMENT.md**
