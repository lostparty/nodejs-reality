const http = require('http');
const fs = require('fs');
const exec = require('child_process').exec;

// 从环境变量中获取 WORK_DIR
const WORK_DIR = process.env.WORK_DIR;
if (!WORK_DIR) {
    throw new Error('WORK_DIR 环境变量未定义');
}
const subtxt = `${WORK_DIR}/url.txt`;
const HTTP_PORT = process.env.HTTP_PORT || 3000;

// 使用工作目录生成 url.txt 文件
fs.writeFile(subtxt, '默认内容', 'utf8', (err) => {
    if (err) {
        console.error(`无法生成 url.txt: ${err}`);
        return;
    }
    console.log(`已在 ${WORK_DIR} 中生成 url.txt`);
    
    // 修改 start.sh 权限并运行
    fs.chmod(`${WORK_DIR}/start.sh`, 0o777, (err) => {
        if (err) {
            console.error(`无法设置 start.sh 的权限: ${err}`);
            return;
        }
        console.log(`已成功更改 start.sh 的权限`);
        const child = exec(`bash ${WORK_DIR}/start.sh`);
        child.stdout.on('data', (data) => {
            console.log(data);
        });
        child.stderr.on('data', (data) => {
            console.error(data);
        });
        child.on('close', (code) => {
            console.log(`子进程以代码 ${code} 退出`);
        });
    });

    // 创建 HTTP 服务器
    const server = http.createServer((req, res) => {
        if (req.url === '/') {
            res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('Hello world!');
        }
        // 获取 sub 路径
        if (req.url === '/sub') {
            fs.readFile(subtxt, 'utf8', (err, data) => {
                if (err) {
                    console.error(err);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: '读取 url.txt 时出错' }));
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
                    res.end(data);
                }
            });
        }
    });

    server.listen(HTTP_PORT, () => {
        console.log(`服务器运行在端口 ${HTTP_PORT}`);
    });
});
