import { Achievement, AchievementsCollection } from "./models/Achievements";
import { Icon, IconsCollection } from "./models/Icons";

export type User = {
  password: string;
  username: string;
  id: number;
  creation_date: Date;
  status: string;
  birthday: Date;
  currIcon: Icon;
  achievements: AchievementsCollection;
  icons: IconsCollection;
  //if works add banner and properly do the rest.


};
