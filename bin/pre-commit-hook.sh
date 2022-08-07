#!/bin/bash

echo "set -e; composer run-script pre-commit" > .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
echo -e "\e[1m\e[32mPre-commit hook installed successfully\e[0m"
