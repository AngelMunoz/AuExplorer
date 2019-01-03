const Koa = require('koa');
const serve = require('koa-static');
const { resolve } = require('path');
const { spawn } = require('child_process');

const app = new Koa();
let elcProcess;

app.use(serve(`${__dirname}/node_modules`));
app.use(serve(`${__dirname}/renderer`));

const electron = process.platform === 'win32' ? resolve('node_modules/.bin', 'electron.cmd') : resolve('node_modules/.bin', 'electron');
const indexFile = resolve(__dirname, 'main/index.js');

app.listen(45789, '127.0.0.1', () => {
  elcProcess = spawn(electron, [indexFile], {});
  elcProcess.on('error', onElcError);
  elcProcess.stdout.on('data', onElcData);
  elcProcess.on('exit', onElcExit)
});

function onElcData(chunk) {
  process.stdout.write(`Electron: ${chunk}`)
}

function onElcError(err) {
  process.stderr.write(`Electron: ${err}`);
}

function onElcExit(code, signal) {
  console.log(code, signal);
  process.exit(code);
}
