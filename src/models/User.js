/**
 * User model
 */
class User {
  constructor(data = {}) {
    this.id = null;
    this.username = null;
    this.status = null;
    this.birthday = null;
    this.creation_date = null
    this.banners = [];
    this.achievements = [];
    this.friends = [];
    this.icons = [];
    Object.assign(this, data);

  }
}

export default User;
