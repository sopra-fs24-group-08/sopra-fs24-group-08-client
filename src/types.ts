import { Achievement, AchievementsCollection } from "./models/Achievements";
import { Icon, IconsCollection } from "./models/Icon";
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

export type Player = {
  id: number;
  username: string;
  currIcon: Icon;
}

export type Result = {
  gameId: number;
  winnerId : number;
  winnerUsername: string;
  loserId: number;
  loserUsername: string;
}

