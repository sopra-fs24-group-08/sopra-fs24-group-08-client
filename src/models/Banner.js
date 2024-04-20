class Banner {
  constructor(data = {}) {
    this.id = null;
    this.name = null;
    this.imageUrl = null;
    Object.assign(this, data);
  }
}