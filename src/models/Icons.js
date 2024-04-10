class Icon {
  constructor(id, name, url) {
    this.id = id;
    this.name = name;
    this.url = url;
  }
}

class IconsCollection {
  constructor() {
    this.icons = new Map();
  }

  addIcon(icon) {
    if (icon instanceof Icon) {
      this.icons.set(icon.id, icon);
    } else {
      throw new Error('Only instances of Icon can be added');
    }
  }

  getIconById(id) {
    return this.icons.get(id);
  }

  loadIcons(serverIcons) {
    serverIcons.forEach(ic => {
      const icon = new Icon(ic.id, ic.name, ic.url);
      this.addIcon(icon);
    });
  }
}


export { Icon, IconsCollection };
