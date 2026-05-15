# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout quirks (read first)

The file naming in this repo is unconventional and easy to get wrong:

- **`python`** (no extension) — this is the actual Streamlit application source (~325 lines). All app logic lives here.
- **`.py`** — a 1-byte placeholder file, **not** the app. The devcontainer's `postAttachCommand` runs `streamlit run .py`, so as currently configured the dev server starts an empty app. To run the real app you must either `streamlit run python` or copy/rename `python` → `.py` (or update `.devcontainer/devcontainer.json`).
- **`README.md`** contains only generic `git init` boilerplate; it is not project documentation.
- **`admin/`** does not exist in the repo — it is created at runtime by the app on first launch, along with the JSON files it manages.

## Running the app

```bash
pip install streamlit MetaTrader5
streamlit run python              # actual app
# or, matching the devcontainer:
streamlit run .py                 # empty app (placeholder)
```

There is no `requirements.txt`, no test suite, no linter configuration, and no build step. The devcontainer (`.devcontainer/devcontainer.json`) installs `streamlit` plus anything in `requirements.txt`/`packages.txt` if those files exist, and forwards port 8501.

## Architecture

Single-file Streamlit app that wraps the **MetaTrader5 (MT5)** Python API to provide a trading assistant dashboard. The app is procedural and re-runs top-to-bottom on every Streamlit interaction; persistence happens via JSON files and `st.session_state`.

### Persistence model

All admin/config state is stored as JSON files in an `admin/` directory created at runtime. The five files and their roles:

| File | Holds | Default created if missing |
|---|---|---|
| `admin/users.json` | List of allowed usernames | `["MADMAX47"]` |
| `admin/orb_time_ranges.json` | ORB strategy time windows (e.g. `"09:15-09:30"`) | 6 default 15-min windows starting 09:15 |
| `admin/credentials.json` | MT5 login id / server / password | empty strings |
| `admin/telegram_channels.json` | `{strategy_name: {token, channel}}` map | `{}` |
| `admin/global_settings.json` | `Default Risk (%)`, `Trading Mode` | `1.0`, `"Demo"` |

Reads/writes go through `load_json_file(path, default)` and `save_json_file(path, data)`. On startup the app `os.makedirs(ADMIN_DIR, exist_ok=True)` and seeds any missing file with its default — keep that bootstrap intact when modifying the persistence layer.

### Auth

Username-only login, no password. The entered name is matched case-insensitively against `users.json` and stored in `st.session_state["logged_in_user"]`. If not logged in, the script calls `st.stop()` before anything else renders. New users must be added by editing `users.json` (there's no in-app user management UI).

### Session state

Heavily used as a write-through cache over the JSON files. Keys initialized on each rerun: `mt5_logged_in`, `mt5_login_input`, `mt5_password`, `mt5_server`, `telegram_settings`, `global_settings`, `orb_ranges`. When adding new persisted settings, follow the same pattern: load from JSON at the top of the script, hydrate into `st.session_state` with an `if 'key' not in st.session_state` guard, and write back to JSON via `save_json_file` whenever the UI mutates it.

### MT5 integration

- `mt5.initialize(server=..., login=..., password=...)` is the login call; success is double-checked via `mt5.account_info()`.
- The **Live Price Watchlist** polls `mt5.symbol_info_tick(symbol)` for a hardcoded list of FX/metal symbols (note the trailing `.` on each symbol — broker-specific suffix) and re-runs via `time.sleep(rate); st.rerun()`.
- The **Live Open Positions Monitor** loops on `mt5.positions_get()` inside `placeholder.container()` with `time.sleep(refresh_rate)`. This is a blocking `while run_monitor:` loop — be aware it holds the Streamlit script thread, which is why the watchlist uses `st.rerun()` instead.
- `mt5.shutdown()` is wired to a button at the bottom.

### Strategies

The `strategies` list (`Mean Reversion`, `Range Breakout`, `Trend Following`, `MSS+BOS`, `BREAK & RETEST`, `EMA CROSS`, `ORB`) drives both the strategy selector and the Telegram-config selector. Only `ORB` has special UI (its own multiselect over `orb_ranges`); the other strategies share a generic timeframe multiselect (`M1`..`MN1`). None of them yet have execution logic — the app currently only handles config, login, and live monitoring.

## Conventions when editing

- Keep all logic in the `python` file unless explicitly splitting into modules; the devcontainer and any future deploy script assume the single-file layout.
- Credentials (including MT5 password and Telegram bot tokens) are written to `admin/*.json` in plaintext by design of the current app. Don't accidentally commit the `admin/` directory — it isn't in `.gitignore` today, so add an entry there before generating any real config.
- The `.gitignore` currently only ignores `.gitattributes`, which is unusual; preserve it unless the user asks otherwise.
