#!/bin/bash

# 准备执行时的错误处理
set -e

# 创建一个唯一的子目录
WORK_DIR="/tmp/web-deploy-$$"
mkdir -p "$WORK_DIR"
cd "$WORK_DIR"

# 复制必要的文件到临时目录
cp /app/index.js "$WORK_DIR"
cp /app/package.json "$WORK_DIR"
cp /app/start.sh "$WORK_DIR"

# 安装依赖并启动服务
npm install
node index.js
