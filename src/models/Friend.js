class Friend {
  constructor(data= {}) {
    this.id = null;
    this.username = null;
    this.status = null;
    Object.assign(this, data);
  }
}