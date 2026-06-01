#!/usr/bin/env bash
# Deploy the order-flow engine as a systemd service in its OWN venv under
# /opt/orderflow-engine. Isolated from opticore — it never touches opticore's
# files; it only reuses opticore's live feed at runtime (see orderflow-engine.env).
#
# Run ON THE VPS, from a checkout of this repo:
#   sudo bash deploy/deploy.sh
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/orderflow-engine}"
SERVICE="orderflow-engine"
SRC_DIR="$(cd "$(dirname "$0")/.." && pwd)"   # repo root
HERE="$(cd "$(dirname "$0")" && pwd)"          # deploy/

echo "==> deploying to $APP_DIR (service: $SERVICE)"

# 1. service user (system, no login, no home) — no-op if it exists
id orderflow &>/dev/null || useradd --system --no-create-home --shell /usr/sbin/nologin orderflow

# 2. sync engine code
mkdir -p "$APP_DIR"
rm -rf "$APP_DIR/engine"
cp -r "$SRC_DIR/engine" "$APP_DIR/engine"

# 3. venv + deps
if [ ! -d "$APP_DIR/venv" ]; then
  python3 -m venv "$APP_DIR/venv"
fi
"$APP_DIR/venv/bin/pip" install --upgrade pip
"$APP_DIR/venv/bin/pip" install -r "$APP_DIR/engine/requirements.txt"

# 4. env file — never clobber an existing one
if [ ! -f "$APP_DIR/orderflow-engine.env" ]; then
  cp "$HERE/orderflow-engine.env.example" "$APP_DIR/orderflow-engine.env"
  echo "==> wrote default env to $APP_DIR/orderflow-engine.env (edit it: set FEED_SOURCE=opticore + integration vars)"
fi

# 5. data dir + ownership
mkdir -p "$APP_DIR/data"
chown -R orderflow:orderflow "$APP_DIR"

# 6. systemd
cp "$HERE/orderflow-engine.service" "/etc/systemd/system/$SERVICE.service"
systemctl daemon-reload
systemctl enable --now "$SERVICE"

echo "==> done. status:"
systemctl --no-pager status "$SERVICE" || true
echo
echo "Next:"
echo "  - tail logs:   journalctl -u $SERVICE -f"
echo "  - it starts in FEED_SOURCE=sim (smoke test). Edit the env -> opticore -> restart."
echo "  - expose ws via nginx TLS (see deploy/README.md), then point the frontend at wss://.../feed"
