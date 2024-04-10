class Achievement {
  constructor(id, title, description, requirements) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.requirements = requirements;
  }
}

class AchievementsCollection {
  constructor() {
    this.achievements = new Map();
  }

  addAchievement(achievement) {
    if (achievement instanceof Achievement) {
      this.achievements.set(achievement.id, achievement);
    } else {
      throw new Error('Only instances of Achievement can be added');
    }
  }

  getAchievementById(id) {
    return this.achievements.get(id);
  }

  loadAchievements(serverAchievements) {
    serverAchievements.forEach(sa => {
      const achievement = new Achievement(sa.id, sa.title, sa.description, sa.requirements);
      this.addAchievement(achievement);
      //add achievement icons as well?
    });
  }
}


export { Achievement, AchievementsCollection };
