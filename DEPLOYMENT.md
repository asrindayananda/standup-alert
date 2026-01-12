# Deployment Guide

This guide covers deploying the Standup Alert application to production.

## Architecture Overview

```
┌─────────────────┐
│  Mobile App     │
│  (iOS/Android)  │
└────────┬────────┘
         │
         │ HTTPS
         ▼
┌─────────────────┐      ┌─────────────────┐
│  Backend API    │◄────►│  MySQL Database │
│  (Node.js)      │      │                 │
└────────┬────────┘      └─────────────────┘
         │
         │ HTTPS
         ▼
┌─────────────────┐
│  Admin Web      │
│  (React)        │
└─────────────────┘
```

## Prerequisites

- Production server (Linux recommended)
- Node.js v20+
- MySQL 8.0+
- SSL certificate for HTTPS
- Domain names configured

## 1. Database Setup

### Create Database and User

```sql
CREATE DATABASE standup_alert;
CREATE USER 'standupuser'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON standup_alert.* TO 'standupuser'@'localhost';
FLUSH PRIVILEGES;
```

### Import Schema

```bash
mysql -u standupuser -p standup_alert < backend/src/config/schema.sql
```

### Create Admin User

```sql
USE standup_alert;
INSERT INTO users (email, password, name, is_admin) 
VALUES (
  'admin@yourcompany.com', 
  '$2a$10$YourHashedPasswordHere',  -- Use bcrypt to hash
  'Admin User', 
  TRUE
);
```

## 2. Backend API Deployment

### Using PM2 (Recommended)

```bash
cd backend
npm install --production
npm install -g pm2

# Create .env file
cp .env.example .env
# Edit .env with production values

# Start with PM2
pm2 start src/server.js --name standup-api
pm2 save
pm2 startup
```

### Environment Variables (.env)

```env
PORT=3000
NODE_ENV=production

DB_HOST=localhost
DB_USER=standupuser
DB_PASSWORD=your_production_password
DB_NAME=standup_alert

JWT_SECRET=your_very_secure_random_secret_key_change_this
```

### Using Docker (Alternative)

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["node", "src/server.js"]
```

```bash
docker build -t standup-api .
docker run -d -p 3000:3000 --env-file .env standup-api
```

### Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name api.yourcompany.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

## 3. Admin Web Deployment

### Build for Production

```bash
cd admin-web
npm install
npm run build
```

### Deploy to Nginx

```nginx
server {
    listen 80;
    server_name admin.yourcompany.com;
    root /var/www/standup-admin/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

```bash
sudo mkdir -p /var/www/standup-admin
sudo cp -r admin-web/build/* /var/www/standup-admin/
sudo chown -R www-data:www-data /var/www/standup-admin
```

### Update API URL

Before building, update `admin-web/src/services/api.ts`:

```typescript
const API_URL = 'https://api.yourcompany.com/api';
```

## 4. Mobile App Deployment

### iOS (App Store)

1. Update API URL in `StandupAlertApp/src/services/api.ts`:
```typescript
const API_URL = 'https://api.yourcompany.com/api';
```

2. Build for release:
```bash
cd StandupAlertApp/ios
xcodebuild -workspace StandupAlertApp.xcworkspace \
           -scheme StandupAlertApp \
           -configuration Release \
           -archivePath ./build/StandupAlertApp.xcarchive \
           archive
```

3. Submit to App Store Connect

### Android (Google Play)

1. Update API URL in `StandupAlertApp/src/services/api.ts`

2. Generate signing key:
```bash
keytool -genkeypair -v -storetype PKCS12 \
        -keystore standup-release-key.keystore \
        -alias standup-key-alias \
        -keyalg RSA -keysize 2048 -validity 10000
```

3. Build release APK:
```bash
cd StandupAlertApp/android
./gradlew assembleRelease
```

4. Upload to Google Play Console

## 5. SSL/HTTPS Setup

### Using Let's Encrypt (Free)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourcompany.com
sudo certbot --nginx -d admin.yourcompany.com
```

## 6. Monitoring Setup

### PM2 Monitoring

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### Database Backups

```bash
# Create backup script
cat > /usr/local/bin/backup-standup-db.sh << 'EOF'
#!/bin/bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
mysqldump -u standupuser -p standup_alert > /backups/standup_alert_$TIMESTAMP.sql
find /backups -name "standup_alert_*.sql" -mtime +7 -delete
EOF

chmod +x /usr/local/bin/backup-standup-db.sh

# Add to crontab (daily at 2 AM)
0 2 * * * /usr/local/bin/backup-standup-db.sh
```

### Application Monitoring

Consider integrating:
- **Sentry** for error tracking
- **New Relic** or **DataDog** for APM
- **CloudWatch** for AWS deployments
- **Uptime Robot** for availability monitoring

## 7. Security Checklist

- [ ] Use HTTPS everywhere
- [ ] Strong JWT secret (64+ characters)
- [ ] Database user with minimal privileges
- [ ] Enable firewall (ufw/iptables)
- [ ] Regular security updates
- [ ] Rate limiting on API endpoints
- [ ] Input validation and sanitization
- [ ] Secure password storage (bcrypt)
- [ ] Environment variables not in code
- [ ] Regular database backups

## 8. Scaling Considerations

### Horizontal Scaling

```
┌───────────┐
│ Load      │
│ Balancer  │
└─────┬─────┘
      │
   ┌──┴──┐
   │     │
┌──▼─┐ ┌─▼──┐
│API │ │API │
│ 1  │ │ 2  │
└──┬─┘ └─┬──┘
   │     │
   └──┬──┘
      │
   ┌──▼──┐
   │MySQL│
   └─────┘
```

### Database Optimization

```sql
-- Add indexes for common queries
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_points_user ON points(user_id);
CREATE INDEX idx_history_user_date ON standup_history(user_id, completed_at);
```

## 9. Post-Deployment

### Verify Deployments

```bash
# Test API health
curl https://api.yourcompany.com/health

# Test admin web
curl https://admin.yourcompany.com

# Test API endpoints
curl -X POST https://api.yourcompany.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test"}'
```

### Create First Users

1. Register via mobile app or API
2. Promote to admin via SQL:
```sql
UPDATE users SET is_admin = TRUE WHERE email = 'admin@yourcompany.com';
```

## 10. Maintenance

### Update Application

```bash
# Pull latest changes
git pull origin main

# Backend
cd backend
npm install --production
pm2 restart standup-api

# Admin web
cd ../admin-web
npm install
npm run build
sudo cp -r build/* /var/www/standup-admin/
```

### Monitor Logs

```bash
# PM2 logs
pm2 logs standup-api

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

## Support

For issues or questions:
- Check logs first
- Review API documentation
- Ensure all services are running
- Verify database connectivity
