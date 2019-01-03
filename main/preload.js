const { ipcRenderer } = require('electron');
window.ipcRenderer = ipcRenderer;
window.PATH_DIVIDER = process.platform === 'win32' ? '\\' : '/';