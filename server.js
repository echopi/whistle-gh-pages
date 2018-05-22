'use strict';

const Koa = require('koa');
const Router = require('koa-router');
const path = require('path');
const fs = require('fs');
const { execFile, spawn } = require('child_process');

const app = new Koa();
const router = new Router();
const port = process.env.PORT || 3000

router.get('/', (ctx, next) => {
  ctx.body = 'Hello Koa';
});

router.get('/api/book/build', (ctx, next) => {
  const cmdFile = path.join(__dirname, '../whistle/docs/script/build-book.sh');
  if (!fs.existsSync(cmdFile)) {
    ctx.staus = 404;
  } else {
    spawnCmd(cmdFile);
    ctx.status = 201;
  }
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(port);
console.log('listening on port ' + port)





function spawnCmd(fileSh) {
  const cmd = spawn('/bin/bash', [`${fileSh}`]);

  cmd.stdout.on('data', function (data) {
    console.log('stdout: ' + data.toString());
  });
  
  cmd.stderr.on('data', function (data) {
    console.log('stderr: ' + data.toString());
  });
  
  cmd.on('exit', function (code) {
    console.log('child process exited with code ' + code.toString());
  });
};
