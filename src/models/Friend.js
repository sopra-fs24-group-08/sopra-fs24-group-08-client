class Friend {
  constructor(data = {}) {
    this.id = null;
    this.username = null;
    Object.assign(this, data);
  }}