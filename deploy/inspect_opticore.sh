#!/usr/bin/env bash
# inspect_opticore.sh — READ-ONLY probe to discover how opticore feeds data.
#
# SAFETY: this only READS. It does not modify, restart, or write to opticore,
# and it deliberately AVOIDS printing secret values (tokens/passwords) — it
# shows variable NAMES and connection patterns, not their values. Run it and
# paste the output back; that's enough to wire OpticoreFeedSource read-only.
#
# Usage:  bash deploy/inspect_opticore.sh [/path/to/opticore]
#         (if no path given, it tries to auto-detect)

OPTI="${1:-}"
echo "================ opticore feed inspector (read-only) ================"

# ---- 1. locate the project ----
if [ -z "$OPTI" ]; then
  for c in /opt/opticore /root/opticore /home/*/opticore /srv/opticore ./opticore; do
    [ -d "$c" ] && OPTI="$c" && break
  done
fi
if [ -z "$OPTI" ] || [ ! -d "$OPTI" ]; then
  echo "!! opticore dir not found. Re-run as: bash deploy/inspect_opticore.sh /path/to/opticore"
  echo "   (find it with:  sudo find / -iname '*opticore*' -maxdepth 5 2>/dev/null )"
else
  echo "project dir : $OPTI"
fi
echo

# ---- 2. how does it run? (systemd + processes + cwd) ----
echo "---- services / processes ----"
systemctl list-units --type=service 2>/dev/null | grep -i 'optic\|fyers\|feed' || echo "(no matching systemd service)"
ps -eo pid,cmd 2>/dev/null | grep -iE 'optic|fyers|versova' | grep -v grep | grep -v inspect_opticore || echo "(no matching process)"
echo

# ---- 3. what is it LISTENING on / connected to? (reveals WS/socket feeds) ----
echo "---- listening sockets (ss) ----"
(command -v ss >/dev/null && ss -ltnp 2>/dev/null | head -40) || (command -v netstat >/dev/null && netstat -ltnp 2>/dev/null | head -40) || echo "(ss/netstat unavailable)"
echo

# ---- 4. how does the CODE publish/expose data? (patterns, not secrets) ----
if [ -n "$OPTI" ] && [ -d "$OPTI" ]; then
  echo "---- feed/publish patterns in code (filename:line) ----"
  grep -rInE \
    'redis|publish|pubsub|zmq|zeromq|websockets?\.serve|websocket|socket\.io|kafka|produce|mqtt|\.bind\(|\.send\(|asyncio|queue|on_message|on_ticks|depth|snapshot|orderbook|order_book|bid|ask|versova|fyers' \
    "$OPTI" --include='*.py' 2>/dev/null \
    | grep -viE 'token|secret|password|passwd|app_id|appid|api_key|apikey|access_token|client_id' \
    | head -60 || echo "(no matches)"
  echo
  echo "---- config FILE NAMES present (values NOT printed) ----"
  ls -1 "$OPTI" 2>/dev/null | grep -iE '\.env|config|settings|\.ini|\.ya?ml|\.toml|\.json' || echo "(none at top level)"
  echo
  echo "---- env/config KEY NAMES only (values redacted) ----"
  for f in "$OPTI"/.env "$OPTI"/*.env "$OPTI"/config* "$OPTI"/settings*; do
    [ -f "$f" ] || continue
    echo "  [$f]"
    grep -oE '^[[:space:]]*[A-Za-z0-9_]+[[:space:]]*[:=]' "$f" 2>/dev/null | sed 's/[:=]//' | sed 's/^/    /'
  done
fi
echo

# ---- 5. if it uses Redis, list ACTIVE channels (read-only) + sample one message ----
if command -v redis-cli >/dev/null 2>&1; then
  echo "---- redis active pub/sub channels (read-only) ----"
  redis-cli PUBSUB CHANNELS '*' 2>/dev/null | head -30 || echo "(redis not responding / no channels)"
  echo
  echo "NOTE: to capture a SAMPLE MESSAGE shape from a channel (read-only, ~5s),"
  echo "      run this with the channel name from above:"
  echo '        timeout 5 redis-cli SUBSCRIBE <channel_name>'
else
  echo "(redis-cli not installed — if opticore uses ZMQ/WS instead, the code patterns above will show it)"
fi
echo "================ end (paste everything above) ================"
