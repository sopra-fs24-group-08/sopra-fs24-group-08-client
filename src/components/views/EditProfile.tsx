import {api, handleError} from "helpers/api";
import {useNavigate, useParams } from "react-router-dom";
import {Button} from "components/ui/Button";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/EditProfile.scss";
import { React,useState } from "react";
const EditProfile = () => {
  const navigate = useNavigate();

  const {current_username} = useParams();
  const {current_birthday} = useParams();
  const {creation_date} = useParams();
  const {status} = useParams();
  const {id} = useParams();

  const [username, setUsername] = useState(null);
  const [birthday, setBirthday] = useState(null);
  const [password, setPassword] = useState(null);

  const doEdit = async () => {
    try {
      const request_to = "/users/"+ String(id);
      const requestBody = JSON.stringify({username, birthday,password});
      await api.put(request_to, requestBody);
      const push_to = "/users/" + String(id);
      navigate(push_to);

    } catch (error) {
      alert(`Something went wrong during the editing: \n${handleError(error)}`);
    }
  }

  function userProfile (id) {
    let push_to = "/users/" + String(id);
    navigate(push_to);
  }

  let content;
  content = (
    <div className="editProfile text">
      <div className="editProfile text">
        username:
        <input
          className="editProfile input"
          placeholder={current_username}
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
      </div>
      <div className="editProfile text">
        password:
        <input
          className="editProfile input"
          placeholder="Enter new password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
      </div>
      <div className="editProfile text"> online status: {status}</div>
      <div className="editProfile text"> creation date: {creation_date} </div>

      <div className="editProfile text">
        birthday:
        <input
          className="editProfile input"
          type={"date"}
          placeholder={current_birthday}
          value={birthday}
          onChange={e => setBirthday(e.target.value)}
        />
      </div>
      <Button
        width="100%"
        onClick={() => doEdit()}
        className = "editProfile button-container"
      >
        Save
      </Button>
      <Button
        width="100%"
        onClick={() => userProfile(id)}
        className = "editProfile button-container"
      >
        Back
      </Button>
    </div>
  );

  return (
    <BaseContainer className="editProfile container">
      <h2>Edit Profile</h2>
      {content}
    </BaseContainer>
  );
}

export default EditProfile;