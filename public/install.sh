#!/bin/sh
# Forwarder: wakezilla.dev/install.sh -> repo install.sh
# Keeps the short install URL stable while the real script lives in the repo.
set -e
curl -fsSL https://raw.githubusercontent.com/guibeira/wakezilla/main/install.sh | sh
