# Deployment Guide
## Heart Disease Prediction System - Production Deployment

This guide covers deploying the Heart Disease Prediction System to your domain **jagritsharma.me**.

---

## 📋 Prerequisites

- Ubuntu/Debian server (20.04 LTS or higher recommended)
- Domain name: jagritsharma.me
- SSH access to server
- Sudo privileges

---

## 🚀 Deployment Steps

### Step 1: Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y python3 python3-pip python3-venv nodejs npm nginx git

# Install PM2 globally
sudo npm install -g pm2

# Install Certbot for SSL
sudo apt install -y certbot python3-certbot-nginx
```

### Step 2: Upload Project

```bash
# Create application directory
sudo mkdir -p /var/www/heart-disease
sudo chown $USER:$USER /var/www/heart-disease

# Upload project files
scp -r heart-disease-project/* user@jagritsharma.me:/var/www/heart-disease/

# Or clone from Git
cd /var/www/heart-disease
git clone <your-repo-url> .
```

### Step 3: Backend Setup

```bash
cd /var/www/heart-disease

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Train models
cd ml-pipeline
python train_model.py
cd ..

# Create environment file
cat > backend/.env << EOF
FLASK_ENV=production
SECRET_KEY=$(python3 -c 'import secrets; print(secrets.token_hex(32))')
JWT_SECRET_KEY=$(python3 -c 'import secrets; print(secrets.token_hex(32))')
DATABASE_URL=sqlite:///production.db
EOF
```

### Step 4: Frontend Setup

```bash
cd /var/www/heart-disease/frontend

# Install dependencies
npm install

# Create production env file
cat > .env.production << EOF
REACT_APP_API_URL=https://api.jagritsharma.me
EOF

# Build for production
npm run build
```

### Step 5: PM2 Configuration

Create PM2 ecosystem file:

```bash
cat > /var/www/heart-disease/deployment/pm2/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'heart-disease-backend',
    cwd: '/var/www/heart-disease/backend',
    script: 'run.py',
    interpreter: '/var/www/heart-disease/venv/bin/python',
    env: {
      FLASK_ENV: 'production'
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    error_file: '/var/www/heart-disease/logs/backend-error.log',
    out_file: '/var/www/heart-disease/logs/backend-out.log',
    log_file: '/var/www/heart-disease/logs/backend-combined.log',
    time: true
  }]
};
EOF
```

Start backend with PM2:

```bash
cd /var/www/heart-disease
pm2 start deployment/pm2/ecosystem.config.js
pm2 save
pm2 startup
```

### Step 6: NGINX Configuration

Create NGINX config:

```bash
sudo cat > /etc/nginx/sites-available/heart-disease << 'EOF'
# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name jagritsharma.me www.jagritsharma.me;
    return 301 https://$server_name$request_uri;
}

# Main application (Frontend)
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name jagritsharma.me www.jagritsharma.me;

    # SSL Configuration (will be added by Certbot)
    ssl_certificate /etc/letsencrypt/live/jagritsharma.me/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/jagritsharma.me/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Frontend
    root /var/www/heart-disease/frontend/build;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
}

# API Backend
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name api.jagritsharma.me;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/jagritsharma.me/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/jagritsharma.me/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Proxy to backend
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
}
EOF
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/heart-disease /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 7: SSL/HTTPS Setup

```bash
# Obtain SSL certificate
sudo certbot --nginx -d jagritsharma.me -d www.jagritsharma.me -d api.jagritsharma.me

# Test auto-renewal
sudo certbot renew --dry-run

# Auto-renewal is configured via cron/systemd
```

### Step 8: DNS Configuration

Add these DNS records to your domain:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | YOUR_SERVER_IP | 3600 |
| A | www | YOUR_SERVER_IP | 3600 |
| A | api | YOUR_SERVER_IP | 3600 |
| CNAME | * | jagritsharma.me | 3600 |

### Step 9: Firewall Configuration

```bash
# Allow HTTP, HTTPS, and SSH
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

---

## 🔒 Security Best Practices

### 1. Environment Variables

Store sensitive data in environment variables:

```bash
# Backend
export SECRET_KEY='your-secret-key'
export JWT_SECRET_KEY='your-jwt-secret'
export DATABASE_URL='postgresql://...'  # For production DB
```

### 2. Database Security

For production, use PostgreSQL:

```bash
# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Create database
sudo -u postgres createdb heart_disease
sudo -u postgres createuser heart_disease_user
sudo -u postgres psql -c "ALTER USER heart_disease_user WITH PASSWORD 'secure_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE heart_disease TO heart_disease_user;"

# Update DATABASE_URL in .env
DATABASE_URL=postgresql://heart_disease_user:secure_password@localhost/heart_disease
```

### 3. Rate Limiting

Add to NGINX config:

```nginx
# Define rate limit zone
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

# Apply to API location
location /api {
    limit_req zone=api burst=20 nodelay;
    # ... rest of config
}
```

### 4. Backup Strategy

```bash
# Automated backups
cat > /usr/local/bin/backup-heart-disease.sh << 'EOF'
#!/bin/bash
BACKUP_DIR=/var/backups/heart-disease
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup database
cp /var/www/heart-disease/backend/production.db $BACKUP_DIR/db_$DATE.db

# Backup models
tar -czf $BACKUP_DIR/models_$DATE.tar.gz /var/www/heart-disease/models/

# Keep only last 7 days
find $BACKUP_DIR -mtime +7 -delete
EOF

chmod +x /usr/local/bin/backup-heart-disease.sh

# Add to crontab (daily at 2 AM)
echo "0 2 * * * /usr/local/bin/backup-heart-disease.sh" | sudo crontab -
```

---

## 📊 Monitoring

### Check Application Status

```bash
# PM2 status
pm2 status

# View logs
pm2 logs heart-disease-backend

# NGINX status
sudo systemctl status nginx

# Check processes
ps aux | grep python
```

### Health Check

```bash
# Backend health
curl https://api.jagritsharma.me/health

# Frontend
curl https://jagritsharma.me
```

---

## 🔄 Updates and Maintenance

### Update Application

```bash
cd /var/www/heart-disease

# Pull latest code
git pull

# Update backend
source venv/bin/activate
pip install -r requirements.txt
pm2 restart heart-disease-backend

# Update frontend
cd frontend
npm install
npm run build
sudo systemctl reload nginx
```

### Restart Services

```bash
# Restart backend
pm2 restart heart-disease-backend

# Restart NGINX
sudo systemctl restart nginx

# Restart all services
pm2 restart all
sudo systemctl restart nginx
```

---

## 🐛 Troubleshooting

### Check Logs

```bash
# Backend logs
tail -f /var/www/heart-disease/logs/backend-combined.log

# NGINX logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# PM2 logs
pm2 logs
```

### Common Issues

**Port already in use:**
```bash
sudo lsof -i :5000
sudo kill -9 <PID>
```

**Permission denied:**
```bash
sudo chown -R $USER:$USER /var/www/heart-disease
```

**SSL certificate expired:**
```bash
sudo certbot renew
sudo systemctl reload nginx
```

---

## 📈 Performance Optimization

### 1. Enable Caching

Add to NGINX:

```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 2. Database Optimization

Use PostgreSQL with proper indexing:

```sql
CREATE INDEX idx_predictions_user ON predictions(user_id);
CREATE INDEX idx_predictions_timestamp ON predictions(timestamp);
CREATE INDEX idx_api_logs_endpoint ON api_logs(endpoint);
```

### 3. Gunicorn (Production WSGI)

```bash
pip install gunicorn

# Update PM2 config
script: '/var/www/heart-disease/venv/bin/gunicorn',
args: '-w 4 -b 0.0.0.0:5000 app:app'
```

---

## ✅ Post-Deployment Checklist

- [ ] Application accessible at jagritsharma.me
- [ ] API accessible at api.jagritsharma.me
- [ ] SSL certificate installed and working
- [ ] Backend running via PM2
- [ ] NGINX serving frontend
- [ ] Firewall configured
- [ ] DNS records propagated
- [ ] Backups configured
- [ ] Monitoring setup
- [ ] Health checks passing
- [ ] Logs rotating properly

---

## 🆘 Support

For deployment issues:
1. Check logs in `/var/www/heart-disease/logs/`
2. Verify NGINX config: `sudo nginx -t`
3. Check PM2 status: `pm2 status`
4. Review DNS settings
5. Verify SSL certificate: `sudo certbot certificates`

---

**🎉 Congratulations!** Your application is now live at https://jagritsharma.me
