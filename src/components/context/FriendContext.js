import React, { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useWebSocket } from "./WebSocketProvider";
import Modal from "helpers/Modal";

const FriendContext = createContext(null);

export const FriendProvider = ({ children }) => {
  const { send, subscribeUser, unsubscribeUser } = useWebSocket();
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({});

  const friendSubscribe = (currUser)=>{
    const friendTopic = `/topic/queue/${currUser.id}/notifications`;
    subscribeUser(friendTopic, (message) => {
      const data = JSON.parse(message.body);
      console.log("There's a new request!");
      setModalContent({ data, currUser });
      setModalOpen(true);
    });
    console.log("subscribe topic" + friendTopic);
  }
  

  const requestMessage = (requestType, senderName) => {
    if (requestType === "FRIENDADDING"){
      return `${senderName} wants to add you as a friend!`;
    }

    return `${senderName} invite you to a new game!`;
  }

  const resultMessage = (data, currUser) => {
    if (data.requestType === "FRIENDADDING"){
      if (data.senderId === currUser.id){
        return `${data.receiverName} ${data.status} your friend request.`
      }
      else{
        return `you ${data.status} ${data.receiverName}'s friend request.`
      }
    }
    else{
      if (data.senderId === currUser.id){
        return `${data.receiverName} ${data.status} your game invitation.`
      }
      else{
        return `you ${data.status} ${data.receiverName}'s game invitation.`
      }
    }
  }

  const NotifyRequest = ({ data, currUser }) => {

    if ("error" in data){
      return (
        <div>
          <p>{data.error}</p>
        </div>
      );
    }

    if (data.status === "PENDING"){
      return (
        <div>
          <p>{requestMessage(data.requestType, data.senderName)}</p>
          <button onClick={() => { acceptRequest(data, currUser); setModalOpen(false); }}>
            Accept
          </button>
          <button onClick={() => { declineRequest(data, currUser); setModalOpen(false); }}>
            Decline
          </button>
        </div>
      );
    }
    else{
      return (
        <div>
          <p>{resultMessage(data, currUser)}</p>
        </div>
      );
    }
  }
  
  const acceptRequest = async (data, currUser) => {
    data.status = "ACCEPTED";
    send(`/app/friend/result/${currUser.id}`, JSON.stringify(data));
    // if (data.requestType === "GAMEINVITATION"){

    // }
  }

  const declineRequest = async (data, currUser) => {
    data.status = "DECLINED";
    send(`/app/friend/result/${currUser.id}`, JSON.stringify(data));
  }

  const sendFriendRequest = async (receiverId, currUser) => {
    const request = {
      receiverId: receiverId,
      requestType: "FRIENDADDING",
    }
    send(`/app/friend/adding/${currUser.id}`, JSON.stringify(request))
  }

  const sendGameInvitation = async (receiverId, currUser) => {
    const request = {
      receiverId: receiverId,
      requestType: "GAMEINVITATION",
    }
    send(`/app/friend/invitation/${currUser.id}`, JSON.stringify(request))
  }

  return (
    <FriendContext.Provider value={{ friendSubscribe, sendFriendRequest, sendGameInvitation, acceptRequest,declineRequest }}>
      {children}
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        {modalContent.data && <NotifyRequest data={modalContent.data} currUser={modalContent.currUser} />}
      </Modal>
    </FriendContext.Provider>
  );
};

FriendProvider.propTypes = {
  children: PropTypes.node,
  closeToast: PropTypes.func,
  data: PropTypes.object,
  currUser: PropTypes.object
};

export const useFriend = () => useContext(FriendContext);
