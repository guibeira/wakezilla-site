#!/bin/sh
# Forwarder: wakezilla.dev/install.sh -> repo install scripts.
# Keeps the short install URL stable while the real scripts live in the repo.
set -e

UNIX_INSTALLER_URL="https://raw.githubusercontent.com/guibeira/wakezilla/main/install.sh"
WINDOWS_INSTALLER_URL="https://wakezilla.dev/install.ps1"

is_windows() {
  case "${OS:-}" in
    Windows_NT) return 0 ;;
  esac

  case "$(uname -s 2>/dev/null || true)" in
    CYGWIN*|MINGW*|MSYS*) return 0 ;;
    *) return 1 ;;
  esac
}

run_windows_installer() {
  if [ "$#" -gt 0 ]; then
    VERSION=$1
    export VERSION
  fi

  if command -v pwsh.exe >/dev/null 2>&1; then
    pwsh.exe -NoProfile -ExecutionPolicy Bypass -Command "irm $WINDOWS_INSTALLER_URL | iex"
    return
  fi

  if command -v powershell.exe >/dev/null 2>&1; then
    powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "irm $WINDOWS_INSTALLER_URL | iex"
    return
  fi

  cat >&2 <<'EOF'
Windows detected, but PowerShell was not found.
Run this in PowerShell instead:
  irm https://wakezilla.dev/install.ps1 | iex
EOF
  exit 1
}

if is_windows; then
  run_windows_installer "$@"
else
  curl -fsSL "$UNIX_INSTALLER_URL" | sh -s -- "$@"
fi
