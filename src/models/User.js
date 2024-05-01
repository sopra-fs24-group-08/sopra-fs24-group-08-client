/**
 * User model
 */
class User {
  constructor(data = {}) {
    this.id = null;
    this.username = null;
    this.token = null;
    this.status = null;
    this.birthday = null;
    this.creation_date = null;
    this.banners = [];
    this.achievements = [];
    this.friendList = [];
    this.icons = [];
    this.currIcon = {};
    Object.assign(this, data);
  }

  formatBirthday() {
    return this.birthday ? new Date(this.birthday).toLocaleDateString() : 'No birthday set';
  }
}

//Feel free to rename if it doesn't match something friends != friendList
//I'm aware that birthday and creation_date aren't on the rest specs ,
// would just be for more social features, delete if u want
export default User;
