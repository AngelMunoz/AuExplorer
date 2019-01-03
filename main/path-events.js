const { stat, readdir } = require('fs').promises;
const { ipcMain } = require('electron');

ipcMain.on('get:home', function (event) {
  const home = process.env.HOME;
  event.sender.send('get:home:ans', home);
});

ipcMain.on('list:files', async function (event, path) {
  const files = await readdir(path)
  const filesP = files
    .filter(f => !f.startsWith('ntuser') && !f.startsWith('NTUSER'))
    .map(f => stat(`${path}/${f}`)
      .then(stats => Object.assign({}, stats, { filename: f }))
    );
  const resolved = await Promise.all(filesP);
  event.sender.send('list:files:ans', resolved);
});