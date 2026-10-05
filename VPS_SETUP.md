# TRAVYN — GitHub + MongoDB + VPS

## Clone and install
```bash
git clone YOUR_GITHUB_REPOSITORY_URL travyn
cd travyn
npm install
```

## Configure MongoDB and admin
```bash
cp .env.example .env
nano .env
```

Set your MongoDB URI and admin password. Generate the token secret on the VPS:
```bash
openssl rand -hex 32
```
Paste the output into `ADMIN_TOKEN_SECRET`.

## Start
```bash
npm start
```

Health check:
```bash
curl http://127.0.0.1:3000/api/health
```

## Keep it running with PM2
```bash
npm install -g pm2
pm2 start server.js --name travyn
pm2 save
pm2 startup
```

The MongoDB `store` collection is created automatically. Admin changes are stored centrally in MongoDB and storefronts poll for changes every 5 seconds.

Never commit `.env`, real passwords, MongoDB credentials, or token secrets to GitHub.
