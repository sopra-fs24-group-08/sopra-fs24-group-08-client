import { api,} from "helpers/api";
import ProfileEdit from "./ProfileEdit";

const Refresh = async () => {
  try {
    const currUserString = localStorage.getItem("currUser");
    const user = JSON.parse(currUserString);
    const id = user.id;
    const response = await api.get(`/users/${id}`, {
      headers: { "Authorization": localStorage.getItem("token") }
    });
    localStorage.setItem("currUser",JSON.stringify(response.data));
  } catch (error) {

  }};

export default Refresh;