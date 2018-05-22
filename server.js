'use strict';

const Koa = require('koa');
const Router = require('koa-router');
const path = require('path');
const fs = require('fs');
const { execSync, spawn } = require('child_process');

const app = new Koa();
const router = new Router();
const port = process.env.PORT || 3000
const logger = getLogger();
const whistleRoot = path.join(__dirname, '../whistle');

// logger
app.logger = logger;

// router
router.get('/', (ctx, next) => {
  ctx.body = 'Hello Koa';
});

router.get('/api/whistle/docs/build', (ctx, next) => {
  const buildPath = 'docs/script/build-book.sh';
  const cmdFile = path.join(whistleRoot, buildPath);
  
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

app
  .use(router.routes())
  .use(router.allowedMethods());

// start server
app.listen(port);
app.logger.info(`[${new Date}] listening on port ${port}`);

function spawnCmd(fileSh) {
  const cmd = spawn('/bin/bash', [`${fileSh}`]);

  cmd.stdout.on('data', function (data) {
    console.log('stdout: ' + data.toString());
  });

  cmd.stderr.on('data', function (data) {
    console.log('stderr: ' + data.toString());
  });

  cmd.on('exit', function (code) {
    const exitInfo = `[${new Date}] child process exited, pid:${cmd.pid} ,code:${code.toString()}`;
    logger.error(exitInfo);
  });
}

function getLogger(filename) {
  const Logger = require('egg-logger').Logger;
  const FileTransport = require('egg-logger').FileTransport;
  const ConsoleTransport = require('egg-logger').ConsoleTransport;

  const logger = new Logger();
  logger.set('file', new FileTransport({
    file: path.join(__dirname, filename || 'logs/app.log'),
    level: 'INFO',
  }));
  logger.set('console', new ConsoleTransport({
    level: 'DEBUG',
  }));
  return logger;
}
