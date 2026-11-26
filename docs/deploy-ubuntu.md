# Ubuntu 24.04 无图形界面服务器部署指南

本文针对 **Ubuntu Server 24.04（无桌面）**，把舒美奇官网（Nuxt 4 + Nitro node-server）跑起来，并配上 HTTPS。

## 0. 先回答：需要 Apache 或 Nginx 吗？

**不需要 Apache，也不是必须装 Nginx。**

- 这个项目构建后是一个 Node 进程（`node .output/server/index.mjs`），它自己就能监听端口、渲染页面、处理 `/api/*`、`/uploads/*` 和静态资源。
- 但**建议在前面放一层 Nginx**（或 Caddy），负责：HTTPS 证书、gzip/brotli 压缩、静态资源缓存、上传大小限制、统一 80/443 入口。Node 只监听 `127.0.0.1:3000`，不直接暴露公网。
- **Apache 能用但没必要**：需要 `mod_proxy` + `mod_headers`，配置比 Nginx 啰嗦，性能也不占优。

| 方案 | 需要 Nginx？ | 适用 |
|---|---|---|
| `node .output/server/index.mjs` 直接跑 | 否 | 内网测试、临时演示（无 HTTPS） |
| Node + Nginx 反代 + certbot | 是 | **推荐**，正式对外 |
| Docker + Nginx（或 Caddy） | 是（或 Caddy） | 喜欢容器化、迁移方便 |

> 说明：域名如果继续走 Cloudflare 代理，源站仍然建议用 Nginx 终止 TLS，再由 Cloudflare 回源。

---

## 1. 前置条件

- Ubuntu 24.04，拥有 `sudo` 权限
- 已把域名 A 记录指向服务器公网 IP（如 `www.example.com`）
- 服务器安全组 / ufw 只放行 **22、80、443**，不要放行 3000

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl nginx sqlite3
```

---

## 2. 安装 Node.js 24（必须 ≥ 23.4）

Ubuntu 仓库自带的是 Node 18，**跑不起来**：项目用 `node:sqlite`，要求 Node ≥ 23.4（`package.json` 里 `engines.node` 已声明）。

```bash
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt install -y nodejs
node -v     # 期望 v24.x
npm -v
```

启用 yarn（项目锁定 yarn 1.22.22）：

```bash
sudo corepack enable
corepack prepare yarn@1.22.22 --activate
yarn -v
# 若系统没有 corepack：sudo npm i -g yarn@1.22.22
```

---

## 3. 拉代码并构建

建议用独立系统用户运行，数据放固定目录：

```bash
sudo useradd --system --create-home --home-dir /opt/sumaaz --shell /usr/sbin/nologin sumaaz
sudo -u sumaaz git clone https://github.com/Yu-SG/SUNMMA.git /opt/sumaaz/app
cd /opt/sumaaz/app

# 安装依赖并构建（构建阶段需要 devDependencies，不要设置 NODE_ENV=production）
sudo -u sumaaz yarn install --frozen-lockfile
sudo -u sumaaz yarn build
```

构建产物在 `/opt/sumaaz/app/.output`。

> 也可以在本地 `yarn build` 后，把 `.output/` 整个上传到服务器，省去服务器装依赖。Node 大版本要与构建时一致（≥23.4）。

---

## 4. 环境变量

在 `/opt/sumaaz/app/.env` 写入（权限 600，属主 sumaaz）：

```bash
ADMIN_PASSWORD=换成强密码
ADMIN_SECRET=用 openssl rand -hex 32 生成
NUXT_PUBLIC_SITE_URL=https://www.example.com
PORT=3000
HOST=127.0.0.1
CONTENT_DB_PATH=/opt/sumaaz/app/.data/content.db
UPLOAD_DIR=/opt/sumaaz/app/.data/uploads
TZ=Asia/Shanghai
```

| 变量 | 作用 |
|---|---|
| `ADMIN_PASSWORD` | `/admin` 登录密码，**必须改** |
| `ADMIN_SECRET` | 会话签名密钥，**必须换成随机串** |
| `NUXT_PUBLIC_SITE_URL` | canonical / sitemap / 分享图用的站点根地址 |
| `PORT` / `HOST` | 监听端口与地址（只监听本机，交给 Nginx） |
| `CONTENT_DB_PATH` | SQLite 文件位置，**必须在持久目录** |
| `UPLOAD_DIR` | 后台上传图片目录，**必须在持久目录** |
| `TZ` | 服务器时区，影响页面上的时间显示 |

```bash
sudo -u sumaaz mkdir -p /opt/sumaaz/app/.data
sudo chmod 600 /opt/sumaaz/app/.env
```

---

## 5. 用 systemd 托管进程

`/etc/systemd/system/sumaaz.service`：

```ini
[Unit]
Description=Sumaaz website (Nuxt/Nitro)
After=network.target

[Service]
Type=simple
User=sumaaz
Group=sumaaz
WorkingDirectory=/opt/sumaaz/app
EnvironmentFile=/opt/sumaaz/app/.env
ExecStart=/usr/bin/node .output/server/index.mjs
Restart=always
RestartSec=3
StandardOutput=append:/var/log/sumaaz.log
StandardError=append:/var/log/sumaaz.log

[Install]
WantedBy=multi-user.target
```

```bash
sudo mkdir -p /var/log
sudo touch /var/log/sumaaz.log
sudo chown sumaaz:sumaaz /var/log/sumaaz.log
sudo systemctl daemon-reload
sudo systemctl enable --now sumaaz
sudo systemctl status sumaaz --no-pager
curl -I http://127.0.0.1:3000      # 期望 200
```

> 也可以用 pm2：`pm2 start .output/server/index.mjs --name sumaaz && pm2 save && pm2 startup`。systemd 更贴近系统，二选一即可。

---

## 6. Nginx 反向代理

`/etc/nginx/sites-available/sumaaz`：

```nginx
server {
    listen 80;
    server_name www.example.com example.com;

    # 后台上传单张 ≤ 8MB，这里留点余量，避免 413
    client_max_body_size 12m;

    gzip on;
    gzip_comp_level 5;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/javascript application/json image/svg+xml;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        # 关键：后台登录 Cookie 会据此判断是否加 Secure
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;
    }

    # 带哈希的构建产物，可长期缓存
    location /_nuxt/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 图片缓存一周
    location /images/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        expires 7d;
        add_header Cache-Control "public";
    }
}
```

启用并签发证书：

```bash
sudo ln -s /etc/nginx/sites-available/sumaaz /etc/nginx/sites-enabled/sumaaz
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d www.example.com -d example.com
```

`certbot` 会自动改写成 443 并配置 HTTP→HTTPS 跳转。到期前自动续期（`systemctl status certbot.timer` 确认）。

> **常见坑**：如果 Nginx 没传 `X-Forwarded-Proto`，后台“登录成功但刷新即退出”，因为 Secure Cookie 在 HTTP 下会被丢弃。

---

## 7. Apache（可选，不推荐）

非要使用 Apache 时，启用代理模块并配置：

```bash
sudo a2enmod proxy proxy_http headers ssl
```

```apache
<VirtualHost *:80>
    ServerName www.example.com
    ProxyPreserveHost On
    ProxyPass / http://127.0.0.1:3000/
    ProxyPassReverse / http://127.0.0.1:3000/
    RequestHeader set X-Forwarded-Proto "http"
    # 上传限制
    LimitRequestBody 12582912
</VirtualHost>
```

HTTPS 与 `X-Forwarded-Proto https` 的配置比 Nginx 繁琐，建议直接用 Nginx 或 Caddy。

---

## 8. 用 Docker 部署（可选）

仓库自带多阶段 `Dockerfile`（Node 24 + Nitro）。`docker-compose.yml`：

```yaml
services:
  web:
    build: .
    restart: always
    env_file: .env
    environment:
      PORT: 3000
      HOST: 0.0.0.0
    ports:
      - "127.0.0.1:3000:3000"   # 只让本机 Nginx 访问
    volumes:
      - ./data:/app/.data       # 内容库与上传图片，务必持久化
```

```bash
docker compose up -d --build
docker compose logs -f web
```

Nginx 配置与第 6 节一致，`proxy_pass` 仍指向 `127.0.0.1:3000`。

---

## 9. 数据、备份与恢复

需要持久化的只有两处：

- `CONTENT_DB_PATH`（默认 `.data/content.db`，另含 `-wal` / `-shm`）
- `UPLOAD_DIR`（默认 `.data/uploads`，后台上传的图片）

每日备份示例（`sudo crontab -e`）：

```bash
30 3 * * * cd /opt/sumaaz/app && sqlite3 .data/content.db ".backup '/opt/sumaaz/backup/content-$(date +\%F).db'" && tar czf /opt/sumaaz/backup/uploads-$(date +\%F).tgz .data/uploads
```

恢复：停服务 → 用备份覆盖 `.data/content.db` → 启服务。后台上传图片被删除时文件同步删除，因此只备份数据库不够，`uploads/` 也要一起备份。

---

## 10. 更新发布流程

```bash
cd /opt/sumaaz/app
sudo -u sumaaz git pull
sudo -u sumaaz yarn install --frozen-lockfile
sudo -u sumaaz yarn build
sudo systemctl restart sumaaz
```

页面内容（文案、产品、新闻）在后台 `/admin` 修改并保存即可生效，**不需要重新构建或重启**；只有代码改动才需要上面这几步。

---

## 11. 排查清单

| 现象 | 排查方向 |
|---|---|
| 访问 502 Bad Gateway | `systemctl status sumaaz`、端口是否为 3000、`curl 127.0.0.1:3000` |
| 后台登录后刷新退出 | Nginx 是否传 `X-Forwarded-Proto`；是否用 https 访问 |
| 上传图片 413 | `client_max_body_size` 小于图片体积（后台单张上限 8MB） |
| 启动报 `node:sqlite` 相关错误 | Node 版本低于 23.4 |
| 后台保存成功但内容没变 | 是否点了“保存”；浏览器强刷；是否命中 CDN 缓存 |
| 重启后内容丢失 | `.data` 没挂载/没写权限（属主应为运行用户） |
| 时区不对 | 环境变量 `TZ=Asia/Shanghai`，重启服务 |
| 构建失败 | 构建时不要设 `NODE_ENV=production`（会跳过 devDependencies，Vuetify 装不上） |

---

## 12. 上线检查单

- [ ] `node -v` ≥ 23.4
- [ ] `ADMIN_PASSWORD`、`ADMIN_SECRET` 已换成强随机值
- [ ] `NUXT_PUBLIC_SITE_URL` 是最终 https 域名
- [ ] `.data/` 在持久目录，属主与运行用户一致
- [ ] 3000 端口未对公网开放
- [ ] Nginx 传 `X-Forwarded-Proto`，`client_max_body_size ≥ 12m`
- [ ] 证书签发成功，`http → https` 跳转正常
- [ ] 首页、`/products`、`/about`、`/admin` 都能打开
- [ ] 后台保存一次内容，前台刷新可见
- [ ] 备份定时任务已配置，并演练过一次恢复
