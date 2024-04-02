import React from "react";
import { api } from "helpers/api"; // Ensure this is correctly imported
import { useNavigate } from "react-router-dom"; // Used for redirecting after logout
import "../../styles/ui/LogoutButton.scss";
import { Button } from "./Button";

const LogoutButton = () => {
  const navigate = useNavigate(); // Hook for navigation

  const handleClick = async () => {
    const token = localStorage.getItem("token");
    const user  = JSON.parse(localStorage.getItem("currUser"))
    const id = user.id

    if (id && token) {
      try {

        await api.put(`/users/${id}/logout`, null, {
          headers: { "Authorization": token }
        });
        localStorage.clear();
        //sessionStorage.clear(); ask TA local or session route and then change
        navigate("/login");
      } catch (error) {
        console.error("Logout failed:", error);
        alert("Logout failed. Please try again.");
      }
    } else {
      console.error("No user id or token found in local storage.");
    }
  };

  return (
    <Button   onClick={handleClick}>
      Logout
    </Button>
  );
};

export default LogoutButton;
