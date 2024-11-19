#!/usr/bin/env bash

# Funkcja do sprawdzania, czy program jest zainstalowany
check_command() {
  command -v "$1" >/dev/null 2>&1
}

# Sprawdzamy, czy Node.js jest zainstalowane
echo "Sprawdzam, czy Node.js jest zainstalowane..."
if ! check_command node; then
  echo "Node.js nie jest zainstalowane. Instaluję Node.js..."
  # Instalacja Node.js przy użyciu Homebrew
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  brew install node
else
  echo "Node.js jest już zainstalowane."
fi

# Sprawdzamy, czy npm jest zainstalowane
echo "Sprawdzam, czy npm jest zainstalowane..."
if ! check_command npm; then
  echo "npm nie jest zainstalowane. Instaluję npm..."
  brew install npm
else
  echo "npm jest już zainstalowane."
fi

# Sprawdzamy, czy zależności projektu są zainstalowane
echo "Sprawdzam, czy zależności projektu są zainstalowane..."
if [ ! -d "node_modules" ]; then
  echo "Zależności nie są zainstalowane. Instaluję zależności..."
  npm install
else
  echo "Zależności są już zainstalowane."
fi

# Uruchamiamy aplikację
echo "Uruchamiam aplikację..."
node ../app.js
