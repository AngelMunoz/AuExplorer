const { stat, readdir, access } = require('fs').promises;
const { F_OK } = require('fs').constants;
const { ipcMain } = require('electron');
const convert = require('convert-units');
const opn = require('opn');

ipcMain.on('get:home', function(event) {
  const home = process.env.HOME;
  event.sender.send('get:home:ans', home);
});

ipcMain.on('list:files', async function(event, path) {
  const files = await readdir(path)
  const filesP = files
    // .filter(f => !f.startsWith('ntuser') && !f.startsWith('NTUSER'))
    .map(f => stat(`${path}/${f}`)
      .then(stats => Object.assign(
        {},
        stats,
        {
          name: f,
          type: stats.isDirectory() ? 'Directory' : stats.isFile() ? 'File' : '',
          size: convert(stats.size).from('b').toBest()
        })
      )
      .catch(console.error)
    );
  const resolved = await Promise.all(filesP);
  event.sender.send('list:files:ans', resolved);
});

ipcMain.on('open:file', async function(event, arg) {
  console.log(arg);
  await opn(arg);
});

ipcMain.on('check:exists', async function(event, arg) {
  try {
    await access(arg, F_OK);
    const stats = await stat(arg);
    event.sender.send('check:exists:ans', true, { ...stats, isFile: stats.isFile() }, arg);
  } catch (error) {
    event.sender.send('check:exists:ans', false);
  }
})