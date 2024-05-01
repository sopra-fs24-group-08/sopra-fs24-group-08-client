import { api,} from "helpers/api";

const Refresh = async () => {
  try {
    const currUserString = sessionStorage.getItem("currUser");
    const user = JSON.parse(currUserString);
    const id = user.id;
    const response = await api.get(`/users/${id}`, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` }
    });
    sessionStorage.setItem("currUser",JSON.stringify(response.data));
  } catch (error) {

  }};

export default Refresh;