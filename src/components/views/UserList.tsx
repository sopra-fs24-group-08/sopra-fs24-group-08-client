import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { useNavigate, useParams } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/UserList.scss";
import { User } from "types";
import { useCurrUser } from "../context/UserContext";



const UserList = () => {
  const navigate = useNavigate();
  const {currUser } = useCurrUser();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setLoading] = useState(false);

  // Function to fetch user data
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/users", {headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}});
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", handleError(error));
      setLoading(false);
    }
  };

  // Initial data fetch on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Function to navigate to user profile
  const navigateToUserProfile = (id) => {
    navigate(`/users/${id}`);
  };

  // Function to go back
  const goBack = () => {
    navigate(-1);
  };

  const doAddFriend = async(receiverId) => {
    const myId = localStorage.getItem("id");
    const token = localStorage.getItem("token");
    const requestType = "FRIENDADDING";
    console.log(myId);
    console.log(token);
    try{
      const requestBody = JSON.stringify({ receiverId, requestType});
      const response = await api.post(`/users/${myId}/friends/add`,requestBody, {headers: {Authorization: `Bearer ${currUser.token}`}});
      console.log("You have a new message!");
    }catch(error){
      alert(`Something went wrong with friend request: \n${handleError(error)}`);
    }
  };


  // Define content based on loading state and users, perhaps we could query
  // userlist / friendlist together and somehow pass a boolean in each user object, so that the add button only gets displayed for non friends
  let content = isLoading ? <Spinner /> : (
    <ul className="game user-list">
      {users.map((user) => (
        <li key={user.id}>
          <div className="player container">
            <Button width="500px" onClick={() => navigateToUserProfile(user.id)}>
              {user.username}
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );

  return (  //TODO add some better scss stuff
    <BaseContainer className="game container">
      <h2>Users Overview</h2>
      <p className="game paragraph">Select a user to view their profile.</p>
      {content}
      <Button width="500px" onClick={fetchUsers} className="game username-button-container">
        Refresh
      </Button>
      <Button width="500px" onClick={goBack} className="game username-button-container">
        Back
      </Button>
    </BaseContainer>
  );
};



export default UserList;
