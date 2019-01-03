export class Home {

  constructor() {
    this.path = '';
    this.home = '';
    this.enableBack = false;
    ipcRenderer.on('list:files:ans', this.listFiles.bind(this));
    ipcRenderer.on('check:exists:ans', this.checkExistsDone.bind(this))
  }

  async activate() {
    // ipcRenderer.send('files:list')
    const [home, currentPath] = await Promise.all([
      localforage.getItem('home'),
      localforage.getItem('currentPath')
    ]);
    this.home = home;
    if (!currentPath) {
      this.path = home;
    }
    ipcRenderer.send('list:files', this.path);
  }

  async listFiles(event, entries) {
    this.entries = entries;
  }

  onOpen(entry) {
    switch (entry.type) {
      case 'File':
        ipcRenderer.send('open:file', `${this.path}${PATH_DIVIDER}${entry.name}`);
        return;
      case 'Directory':
        this.switchAndSet(entry.name)
        return;
    }
  }

  onKeyup(event) {
    if (event.key === 'Enter') {
      ipcRenderer.send('check:exists', this.path);
      return;
    }
  }

  onFocus(event) {
    event.target.select();
  }

  checkExistsDone(event, exists, stats, path) {
    if (!exists) { alert('Nope!') }
    if (stats.isFile) {
      ipcRenderer.send('open:file', path);
      this.goBack(false);
      return;
    }
    ipcRenderer.send('list:files', this.path);
    this.enableBack = true;
  }

  switchAndSet(path) {
    this.path += `${PATH_DIVIDER}${path}`;
    ipcRenderer.send('list:files', this.path);
    this.enableBack = true;
  }

  goBack(withReload) {
    if (!this.enableBack) { return; }
    this.path = this.path.split(PATH_DIVIDER).reverse().slice(1).reverse().join(PATH_DIVIDER);
    if (this.path === '') {
      this.enableBack = false;
      this.path = this.home;
      withReload = true;
    }
    if (withReload) {
      ipcRenderer.send('list:files', this.path);
    }
  }
}
