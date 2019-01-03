export class Home {

  constructor() {
    this.path = '';
    ipcRenderer.on('list:files:ans', this.listFiles.bind(this));
  }

  async activate() {
    // ipcRenderer.send('files:list')
    const [home, currentPath] = await Promise.all([
      localforage.getItem('home'),
      localforage.getItem('currentPath')
    ]);
    if(!currentPath) {
      this.path = home;
    }
    ipcRenderer.send('list:files', this.path);
  }

  async listFiles(event, files) {
    console.log(files);
    this.files = files;
  }

  onFocus(event) {
    event.target.select();
  }
}
