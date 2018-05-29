'use strict';

const Koa = require('koa');
const Router = require('koa-router');
const path = require('path');
const fs = require('fs');
const { execSync, spawn } = require('child_process');



const app = new Koa();
const router = new Router();
const port = process.env.PORT || 6001;

const whistleRoot = path.join(__dirname, '../whistle');
const buildCmdPath = 'docs/script/build-book.sh';

// logger
app.logger = getAppLogger();

// router
router.get('/', (ctx, next) => {
  ctx.body = 'Hello Koa';
});
router.post('/api/whistle/build', (ctx, next) => {
  const cmdFile = path.join(whistleRoot, buildCmdPath);

  if (!fs.existsSync(cmdFile)) {
    return ctx.staus = 404;
  }
  try {
    spawnCmd(cmdFile);
  } catch (e) {
    ctx.status = 500;
    return;
  }
  ctx.status = 201;
});

// middleware
app
  .use(require('koa-static')(path.join(__dirname, 'logs')))
  .use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    app.logger.info(`[${new Date}] ${ctx.method} ${ctx.url} ${ctx.status} ${ms}ms`);
  })
  .use(router.routes())
  .use(router.allowedMethods());

// start server
app.listen(port);
app.logger.info(`[${new Date}] listening on port ${port}`);


function spawnCmd(fileSh) {
  const spawnProcess = spawn('/bin/bash', [`${fileSh}`]);

  spawnProcess.stdout.on('data', function (data) {
    console.log('stdout: ' + data.toString());
  });

  spawnProcess.stderr.on('data', function (data) {
    console.log('stderr: ' + data.toString());
  });

  spawnProcess.on('exit', function (code) {
    const info = `[${new Date}] child process exited, pid:${spawnProcess.pid} ,code:${code.toString()}`;
    app.logger.error(info);
  });
}

function getAppLogger(filename, file_level, console_level) {
  const Logger = require('egg-logger').Logger;
  const FileTransport = require('egg-logger').FileTransport;
  const ConsoleTransport = require('egg-logger').ConsoleTransport;
  const logger = new Logger();
  logger.set('file', new FileTransport({
    file: path.join(__dirname, filename || 'logs/app.log'),
    level: file_level || 'INFO',
  }));
  logger.set('console', new ConsoleTransport({
    level: console_level || 'DEBUG',
  }));
  return logger;
}
