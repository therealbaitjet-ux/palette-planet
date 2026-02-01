# Deploying Brian Logo Gallery on a Mac mini

This guide covers a production-ready setup with Node.js, PM2, and Nginx on macOS, plus an optional Cloudflare Tunnel alternative.

## 1) Install Node.js, install dependencies, build, and start

```bash
brew install node
cd /path/to/Brian-Logo
npm install
npm run build
npm run start -- -p 3000
```

> The site will be available at `http://localhost:3000`.

## 2) Keep Next.js running with PM2

```bash
npm install -g pm2
pm2 start "npm run start -- -p 3000" --name brandgallery
pm2 save
pm2 startup
```

Follow PM2's printed instructions to enable the service at boot.

## 3) Install Nginx and configure reverse proxy

```bash
brew install nginx
```

Create a simple Nginx site config (for example in `/opt/homebrew/etc/nginx/servers/brandgallery.conf`):

```nginx
server {
  listen 80;
  server_name your-domain.com;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```

Reload Nginx:

```bash
sudo nginx -s reload
```

## 4) Router configuration + static LAN IP

- Assign a static LAN IP to the Mac mini using your router DHCP reservation settings.
- Forward external ports `80` and `443` to that static LAN IP.
- Ensure your domain’s DNS A record points to your public IP.

## 5) HTTPS options

### A) Let’s Encrypt (Certbot)

```bash
brew install certbot
sudo certbot --nginx -d your-domain.com
```

Certbot will automatically update your Nginx configuration with TLS settings and renew certificates.

### B) Cloudflare Tunnel (recommended if you can’t port-forward)

```bash
brew install cloudflared
cloudflared tunnel login
cloudflared tunnel create brandgallery
cloudflared tunnel route dns brandgallery your-domain.com
```

Create a config file (example: `~/.cloudflared/config.yml`):

```yaml
tunnel: brandgallery
credentials-file: /Users/your-user/.cloudflared/brandgallery.json

ingress:
  - hostname: your-domain.com
    service: http://localhost:3000
  - service: http_status:404
```

Start the tunnel:

```bash
cloudflared tunnel run brandgallery
```

## 6) Basic security checklist

- Enable the macOS firewall in System Settings > Network > Firewall.
- Keep macOS and Homebrew packages updated.
- Use strong passwords and 2FA for domain/DNS providers.
