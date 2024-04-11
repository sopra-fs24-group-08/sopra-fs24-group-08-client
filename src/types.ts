import { Achievement, AchievementsCollection } from "./models/Achievements";
import { Icon, IconsCollection } from "./models/Icons";
import { Banner} from "./models/Banner";
import { Friend} from "./models/Friend";

export type User = {
  password: string;
  username: string;
  id: number;
  creation_date: Date;
  status: string;
  birthday: Date;
  currIcon: Icon;
  achievements: Achievement[]; // Using an array of Achievement objects directly
  icons: Icon[]; // Using an array of Icon objects directly
  banners?: Banner[];
  friends?: Friend[];
  //if works add banner and properly do the rest.

};
