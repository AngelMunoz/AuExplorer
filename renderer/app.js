export class App {
  constructor() {
    this.message = "Hello world";
    this.menuOpen = false;
    ipcRenderer.on('get:home:ans', this.setHomePath.bind(this));
  }

  async activate() {
    const home = await localforage.getItem('home');
    if (!home) {
      ipcRenderer.send('get:home');
    }
  }

  configureRouter(config, router) {
    config.options.pushState = true;
    config.map([
      {
        route: ["", "home"],
        name: "home",
        moduleId: "pages/home.js",
        title: "Home",
        nav: true
      },
      {
        route: "contact",
        name: "contact",
        moduleId: "pages/contact.js",
        title: "Contact",
        nav: true
      }
    ]);
    this.router = router;
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  async setHomePath(event, path) {
    await localforage.setItem('home', path);
  }
}
