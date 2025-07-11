#!/bin/bash

# Git hooksディレクトリを設定
git config core.hooksPath .githooks

echo "Git hooks have been configured."
echo "Now 'git pull' will automatically trigger builds!"