#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
UI_DIR="$PROJECT_ROOT/ui"
VENV_DIR="$PROJECT_ROOT/.venv"

echo "[Grok'ed-Interpreter] Installing..."

# 1) Node 18 via nvm or brew
if ! command -v node >/dev/null 2>&1; then
  if command -v brew >/dev/null 2>&1; then
    brew install node@18
    brew link --force --overwrite node@18
  else
    export NVM_DIR="$HOME/.nvm"
    mkdir -p "$NVM_DIR"
    curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    # shellcheck disable=SC1090
    . "$NVM_DIR/nvm.sh"
    nvm install 18
    nvm use 18
  fi
else
  NODE_V=$(node -v || true)
  if [[ ! "$NODE_V" =~ ^v18\. ]]; then
    if command -v brew >/dev/null 2>&1; then
      brew install node@18
      brew link --force --overwrite node@18
    else
      export NVM_DIR="$HOME/.nvm"
      mkdir -p "$NVM_DIR"
      curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
      # shellcheck disable=SC1090
      . "$NVM_DIR/nvm.sh"
      nvm install 18
      nvm use 18
    fi
  fi
fi

echo "Node version: $(node -v)"

# 2) Python venv and package
python3 -m venv "$VENV_DIR" || true
# shellcheck disable=SC1090
source "$VENV_DIR/bin/activate"
pip install -U pip
pip install -U ".[server,ui]" -r "$PROJECT_ROOT/requirements.txt"

# 3) UI deps
cd "$UI_DIR"
npm install --legacy-peer-deps
npm install -D ajv@^8 ajv-keywords@^5 --no-audit

# 4) Run script
cd "$PROJECT_ROOT"
cat > start-grok-interpreter.command <<'EOF'
#!/usr/bin/env bash
set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/.venv/bin/activate"
python -m backend.server &
BACK_PID=$!
cd "$SCRIPT_DIR/ui"
npm start
kill $BACK_PID || true
EOF
chmod +x start-grok-interpreter.command

echo "Done. Double-click start-grok-interpreter.command to run."