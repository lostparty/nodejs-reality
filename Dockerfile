FROM node:latest

# 暴露端口
EXPOSE 3000

# 设置工作目录
WORKDIR /app

# 使用 root 用户
USER root

# 复制本地文件到容器
COPY . .

# 设置工作目录权限 
RUN chmod -R 777 /app

# 为脚本设置可执行权限
RUN chmod +x start.sh && \
    chmod +x begin.sh


# 安装依赖包及清理缓存
RUN apt-get update && \
    apt-get -y upgrade && \
    apt-get install -y sudo wget unzip procps && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# 赋予可执行权限
RUN chmod +x index.js

# 添加用户和组
RUN addgroup --gid 10086 group10086 && \
    adduser --disabled-password --no-create-home --uid 10086 --ingroup group10086 user10086 && \
    usermod -aG sudo user10086

# 配置 sudo 免密码
RUN echo 'user10086 ALL=(ALL:ALL) NOPASSWD: ALL' | sudo EDITOR='tee -a' visudo

# 变更文件所有权
RUN chown -R 10086:10086 /app

# 安装 Node.js 项目依赖
RUN npm install

# 切换到非 root 用户
USER 10086

# 启动应用程序
CMD ["bash", "begin.sh"]
