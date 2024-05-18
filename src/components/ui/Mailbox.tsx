import React, { useState, useEffect } from "react";
import { useData } from "../context/DataContext";
import { useFriend } from "../context/FriendContext";
import Modal from "helpers/Modal";
import { useCurrUser } from "../context/UserContext";

const Mailbox = () => {
  const { data, setData } = useData();
  const { currUser } = useCurrUser();
  const { acceptRequest, declineRequest } = useFriend();
  const [notificationCount, setNotificationCount] = useState(0);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentRequestIndex, setCurrentRequestIndex] = useState(0);

  useEffect(() => {
    setNotificationCount(data.friendRequests.length);
  }, [data.friendRequests]);

  const handleMailboxClick = () => {
    if (data.friendRequests && data.friendRequests.length > 0) {
      setModalOpen(true);
      setCurrentRequestIndex(0); // Always start with the first unresolved request
    }
  };

  const handleAccept = () => {
    processRequest("ACCEPTED");
  };

  const handleDecline = () => {
    processRequest("DECLINED");
  };

  const processRequest = (status) => {
    const request = {
      ...data.friendRequests[currentRequestIndex],
      status: status
    };

    if (status === "ACCEPTED") {
      acceptRequest(request, currUser);
    } else if (status === "DECLINED") {
      declineRequest(request, currUser);
    }

    // Update the friendRequests array by removing the processed request
    const updatedRequests = data.friendRequests.filter((_, index) => index !== currentRequestIndex);
    setData({ ...data, friendRequests: updatedRequests });

    setModalOpen(false); // Close modal after handling a request
  };

  return (
    <div className="mailbox-icon-container" onClick={handleMailboxClick}>
      {notificationCount > 0 && (
        <span className="mailbox-notification">{notificationCount}</span>
      )}
      <Modal isOpen={isModalOpen && data.friendRequests && data.friendRequests.length > 0} onClose={() => setModalOpen(false)}>
        {data.friendRequests.length > 0 && (
          <div>
            <p>{data.friendRequests[currentRequestIndex].senderName} wants to add you as a friend!</p>
            <button onClick={handleAccept}>Accept</button>
            <button onClick={handleDecline}>Decline</button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Mailbox;