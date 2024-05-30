#!/bin/bash

# 创建一个唯一的子目录
WORK_DIR="/tmp/web-deploy-$$"
mkdir -p "$WORK_DIR"
cd "$WORK_DIR"

# 复制必要文件到临时目录
cp /app/index.js "$WORK_DIR"
cp /app/package.json "$WORK_DIR"
cp /app/start.sh "$WORK_DIR"

# 设置 FILE_PATH 为 WORK_DIR
export FILE_PATH="$WORK_DIR"

#begin
chmod +x start.sh
chmod +x index.js
npm install
node index.js
