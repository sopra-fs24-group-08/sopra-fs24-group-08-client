import React  from 'react';
import { useNavigate } from 'react-router-dom';
import BaseContainer from '../ui/BaseContainer';
import Player from "../ui/Player";
import { useData} from '../context/DataContext';
import { Button } from 'components/ui/Button';

const UserList = () => {
  const navigate = useNavigate();
  const { data, refreshData } = useData();
  const { users } = data;

  let content = (
    <ul className="game user-list">
      {users.length > 0 ? users.map(user => (
        <li key={user.id}>
          <Player user={user} />
        </li>
      )) : <p>No users to display.</p>}
    </ul>
  );

  return (
    <BaseContainer className="game container">
      <h2>Users Overview</h2>
      <p className="game paragraph">Select a user to view their profile.</p>
      {content}
      <Button onClick={refreshData}>Refresh Users</Button>
      <Button onClick={() => navigate(-1)}>Back</Button>
    </BaseContainer>
  );
};

export default UserList;
