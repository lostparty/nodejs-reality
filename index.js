const http = require('http');
const fs = require('fs');
const exec = require('child_process').exec;

// 从环境变量中获取 WORK_DIR
const WORK_DIR = process.env.WORK_DIR;
const subtxt = `${WORK_DIR}/url.txt`;
const HTTP_PORT = process.env.HTTP_PORT || 3000;

// 运行 start.sh
fs.chmod(`${WORK_DIR}/start.sh`, 0o777, (err) => {
  if (err) {
      console.error(`Failed to set permissions for start.sh: ${err}`);
      return;
  }
  console.log(`Permissions for start.sh changed successfully`);
  const child = exec(`bash ${WORK_DIR}/start.sh`);
  child.stdout.on('data', (data) => {
      console.log(data);
  });
  child.stderr.on('data', (data) => {
      console.error(data);
  });
  child.on('close', (code) => {
      console.log(`Child process exited with code ${code}`);
      console.clear();
      console.log(`App is running`);
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
                res.end(JSON.stringify({ error: 'Error reading url.txt' }));
            } else {
                res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end(data);
            }
        });
    }
});

server.listen(HTTP_PORT, () => {
    console.log(`Server is running on port ${HTTP_PORT}`);
});
