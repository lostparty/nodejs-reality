#!/bin/bash

# 创建一个唯一的子目录
WORK_DIR="/tmp/web-deploy-$$"
mkdir -p "$WORK_DIR"
cd "$WORK_DIR"

# 复制其他必要的文件到临时目录
cp /app/index.js "$WORK_DIR"
cp /app/package.json "$WORK_DIR"
cp /app/start.sh "$WORK_DIR"

# 运行 Node.js 脚本并传递 WORK_DIR 环境变量
WORK_DIR="$WORK_DIR" node "$WORK_DIR/index.js"
