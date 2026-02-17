# Production Deployment Guide - VPS with Docker & Nginx

## 📋 Prerequisites

VPS Requirements:
- Ubuntu 20.04+ atau Debian 11+
- Minimal 2GB RAM
- Minimal 20GB Storage
- Docker & Docker Compose installed
- Domain name pointing to VPS IP

## 🚀 Quick Start Deployment

### 1. Install Docker & Docker Compose (if not installed)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Verify installation
docker --version
docker-compose --version
```

### 2. Upload Project to VPS

```bash
# On your local machine, create archive
cd rectifier-monitoring
tar -czf rectifier-monitoring-deploy.tar.gz .

# Upload to VPS
scp rectifier-monitoring-deploy.tar.gz user@your-vps-ip:/home/user/

# On VPS, extract
ssh user@your-vps-ip
mkdir -p ~/rectifier-monitoring
cd ~/rectifier-monitoring
tar -xzf ~/rectifier-monitoring-deploy.tar.gz
```

### 3. Configure Environment Variables

```bash
cd ~/rectifier-monitoring

# Create .env file for backend
cp backend/.env.example backend/.env

# Edit backend .env
nano backend/.env
```

**Important values to change:**

```env
DEBUG=False
SECRET_KEY=your-very-secure-random-secret-key-here
ALLOWED_HOSTS=your-domain.com,www.your-domain.com,your-vps-ip

POSTGRES_DB=rectifier_db
POSTGRES_USER=rectifier_user
POSTGRES_PASSWORD=your-secure-database-password

MQTT_BROKER=broker.emqx.io
MQTT_TOPIC=rectifier/data

CORS_ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com
```

**Generate SECRET_KEY:**
```bash
python3 -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
```

**Configure Frontend:**

```bash
# Edit frontend environment
nano frontend-nextjs/.env.production
```

```env
NEXT_PUBLIC_API_URL=https://your-domain.com/api
```

### 4. Configure Nginx

```bash
# Edit nginx config
nano nginx/conf.d/default.conf
```

Change `server_name`:
```nginx
server_name your-domain.com www.your-domain.com;
```

### 5. Build and Run

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# Check logs
docker-compose logs -f

# Check running containers
docker ps
```

Expected output:
```
rectifier_nginx       running
rectifier_frontend    running
rectifier_backend     running
rectifier_redis       running
rectifier_db          running
```

### 6. Initial Setup

```bash
# Create Django superuser
docker-compose exec backend python manage.py createsuperuser

# Verify services
curl http://localhost/api/rectifier/dashboard/
```

### 7. Setup SSL with Let's Encrypt (Optional but Recommended)

```bash
# Stop nginx temporarily
docker-compose stop nginx

# Get SSL certificate
docker-compose run --rm certbot certonly --webroot \
  --webroot-path /var/www/certbot \
  -d your-domain.com \
  -d www.your-domain.com \
  --email your-email@example.com \
  --agree-tos \
  --no-eff-email

# Edit nginx config to enable HTTPS
nano nginx/conf.d/default.conf
```

Uncomment HTTPS server block and update domain names.

```bash
# Restart nginx
docker-compose start nginx

# Verify SSL auto-renewal
docker-compose run --rm certbot renew --dry-run
```

---

## 🔧 Management Commands

### Start/Stop Services

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Restart specific service
docker-compose restart backend

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Database Management

```bash
# Run migrations
docker-compose exec backend python manage.py migrate

# Create backup
docker-compose exec db pg_dump -U rectifier_user rectifier_db > backup.sql

# Restore backup
docker-compose exec -T db psql -U rectifier_user rectifier_db < backup.sql

# Access database shell
docker-compose exec db psql -U rectifier_user -d rectifier_db
```

### Django Management

```bash
# Access Django shell
docker-compose exec backend python manage.py shell

# Create superuser
docker-compose exec backend python manage.py createsuperuser

# Collect static files
docker-compose exec backend python manage.py collectstatic --noinput

# View Django logs
docker-compose logs -f backend
```

### MQTT Testing

```bash
# Check if MQTT client is running
docker-compose logs backend | grep MQTT

# Expected:
# ✓ MQTT Client started successfully
# Connected to MQTT Broker: broker.emqx.io
```

### Monitoring

```bash
# Check resource usage
docker stats

# Check container health
docker-compose ps

# Check disk usage
df -h
docker system df
```

---

## 🔒 Security Checklist

- [ ] Change all default passwords
- [ ] Set strong SECRET_KEY
- [ ] Set DEBUG=False in production
- [ ] Configure ALLOWED_HOSTS properly
- [ ] Enable SSL/HTTPS
- [ ] Setup firewall (UFW)
  ```bash
  sudo ufw allow 22/tcp   # SSH
  sudo ufw allow 80/tcp   # HTTP
  sudo ufw allow 443/tcp  # HTTPS
  sudo ufw enable
  ```
- [ ] Regular backups of database
- [ ] Keep Docker images updated
- [ ] Monitor logs for suspicious activity

---

## 🐛 Troubleshooting

### Service won't start

```bash
# Check logs
docker-compose logs service-name

# Rebuild image
docker-compose build --no-cache service-name
docker-compose up -d
```

### Database connection error

```bash
# Check if database is ready
docker-compose exec db pg_isready -U rectifier_user

# Reset database (WARNING: deletes all data)
docker-compose down -v
docker-compose up -d
docker-compose exec backend python manage.py migrate
```

### Frontend can't connect to backend

Check:
1. Backend is running: `curl http://localhost:8000/api/`
2. CORS settings in backend `.env`
3. Frontend `.env.production` has correct API URL
4. Nginx proxy settings

### SSL certificate issues

```bash
# Check certificate
docker-compose run --rm certbot certificates

# Force renewal
docker-compose run --rm certbot renew --force-renewal

# Check nginx config
docker-compose exec nginx nginx -t
```

### Out of disk space

```bash
# Clean Docker
docker system prune -a --volumes

# Check database size
docker-compose exec db psql -U rectifier_user -d rectifier_db -c "SELECT pg_size_pretty(pg_database_size('rectifier_db'));"
```

---

## 📊 Monitoring & Maintenance

### Setup Log Rotation

```bash
# Create log rotation config
sudo nano /etc/logrotate.d/docker-containers

# Add:
/var/lib/docker/containers/*/*.log {
  rotate 7
  daily
  compress
  missingok
  delaycompress
  copytruncate
}
```

### Backup Strategy

```bash
# Create backup script
nano backup.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/user/backups"

mkdir -p $BACKUP_DIR

# Backup database
docker-compose exec -T db pg_dump -U rectifier_user rectifier_db > $BACKUP_DIR/db_$DATE.sql

# Backup media files (if any)
tar -czf $BACKUP_DIR/media_$DATE.tar.gz -C /var/lib/docker/volumes media_volume

# Keep only last 7 days
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
```

```bash
chmod +x backup.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add line:
0 2 * * * /home/user/rectifier-monitoring/backup.sh >> /home/user/backup.log 2>&1
```

### Auto-update (optional)

```bash
# Create update script
nano update.sh
```

```bash
#!/bin/bash
cd /home/user/rectifier-monitoring

# Pull latest images
docker-compose pull

# Rebuild and restart
docker-compose up -d --build

# Clean old images
docker image prune -f

echo "Update completed: $(date)"
```

---

## 🌐 Access Points

After deployment:

- **Frontend Dashboard**: https://your-domain.com
- **Backend API**: https://your-domain.com/api/
- **Django Admin**: https://your-domain.com/admin/
- **API Docs**: https://your-domain.com/api/ (DRF browsable API)

---

## 📞 Support

If you encounter issues:

1. Check logs: `docker-compose logs -f`
2. Verify environment variables
3. Check nginx configuration: `docker-compose exec nginx nginx -t`
4. Ensure all containers are running: `docker-compose ps`
5. Check resource usage: `docker stats`

---

## 🚀 Performance Tips

1. **Enable Redis caching** for API responses
2. **Use CDN** for static files (optional)
3. **Setup monitoring** with Prometheus + Grafana (optional)
4. **Increase workers** if needed: edit `docker-compose.yml` gunicorn workers
5. **Database optimization**: Add indexes for frequently queried fields

---

Ready for production! 🎉
