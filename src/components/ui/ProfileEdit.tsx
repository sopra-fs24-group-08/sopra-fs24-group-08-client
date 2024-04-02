import React from "react";
import { Button } from "./Button";
import { useNavigate } from "react-router-dom";

interface ProfileEditProps {
  id: number; // should be getting id from Profile
}
const ProfileEdit: React.FC<ProfileEditProps> = ({ id }) => {
  const navigate = useNavigate();
  const currUserString = localStorage.getItem("currUser");
  const storedUser = JSON.parse(currUserString);

  React.useEffect(() => {
    // Get the current user from localStorage when the component mounts

  }, []);

  return (
    <div>
      {storedUser["id"].toString() === id && (
        <Button onClick={() => navigate("/profile/edit")}>
          Edit My Profile
        </Button>
      )}
    </div>
  )
};

export default ProfileEdit;
