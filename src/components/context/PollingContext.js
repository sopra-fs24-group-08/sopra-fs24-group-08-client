import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { api, handleError } from "helpers/api";
import PropTypes from "prop-types";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PollingContext = createContext();

export const usePolling = () => useContext(PollingContext);

export const PollingProvider = ({ children }) => {
  const [data, setData] = useState(null); 
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    let activeTimerId = null;
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("id");
      console.log(`Now the logged-in user is ${userId}`);
      if (userId === null || token === null) return;
      try {
        const response = await api.get(`/users/${userId}/polling`, {headers: {Authorization: `Bearer ${token}`}, signal:signal});
        setData(response.data);
        console.log(response);
        clearTimeout(activeTimerId);
        activeTimerId = setTimeout(fetchData, 10000);

      } catch (error) {
        console.log(error.name);
        if (error.name === "CanceledError"){
          console.log("Request canceled", error.message);
        }
        else if (error.response.status === 408){
          console.error(`Long-polling Message: \n${handleError(error)}`, error);
          clearTimeout(activeTimerId);
          activeTimerId = setTimeout(fetchData, 10000);
        }
        else {
          alert(
            `Something went wrong during the Long-polling: \n${handleError(error)}`
          );
        }
      }
    };

    fetchData();

    return () => {
      console.log(`Stopping polling due to cleanup ${Number(activeTimerId)}`);
      clearTimeout(activeTimerId);
      controller.abort();
      setData(null);
    };
  }, [currentUserId]);

  // deal with friend adding request
  const FriendAddingRequestActions = (para) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("id");
    const acceptFriendRequest = async() => {
      const requestBody = para.request;
      requestBody.status = "ACCEPTED";
      try{
        const response = await api.post(`/users/${userId}/friendresponse`, requestBody, {headers: {Authorization: `Bearer ${token}`}});
        toast.dismiss();
        toast(`you add ${para.request.senderName} as a friend!`);
      }catch(error){
        alert(
          `Something went wrong during accept friend request: \n${handleError(error)}`
        );
      }
    };
  
    const declineFriendRequest = async() => {
      const requestBody = para.request;
      requestBody.status = "DECLINED";
      try{
        const response = await api.post(`/users/${userId}/friendresponse`, requestBody, {headers: {Authorization: `Bearer ${token}`}});
        toast(`you declined ${para.request.senderName}'s friend request!`);
      }catch(error){
        alert(
          `Something went wrong during decline a friend request: \n${handleError(error)}`
        );
      }
    };

    return (
      <div>
        <p>{para.request.senderName} wants to be your friend!</p>
        <button onClick={acceptFriendRequest}>Accept</button>
        <button onClick={declineFriendRequest}>Decline</button>
      </div>
    );
  };

  const GameInvitationRequestActions = (para) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("id");
    const acceptFriendRequest = async() => {
      const requestBody = para.request;
      requestBody.status = "ACCEPTED";
      try{
        const response = await api.post(`/game/${userId}/invitationresponse`, requestBody, {headers: {Authorization: `Bearer ${token}`}});
        toast.dismiss();
        toast(`you accepted ${para.request.senderName}'s game invitation!`);
      }catch(error){
        alert(
          `Something went wrong during accept friend request: \n${handleError(error)}`
        );
      }
    };
  
    const declineFriendRequest = async() => {
      const requestBody = para.request;
      requestBody.status = "DECLINED";
      try{
        const response = await api.post(`/game/${userId}/invitationresponse`, requestBody, {headers: {Authorization: `Bearer ${token}`}});
        toast(`you declined ${para.request.senderName}'s game invitation!`);
      }catch(error){
        alert(
          `Something went wrong during decline a friend request: \n${handleError(error)}`
        );
      }
    };
    
    return (
      <div>
        <p>There is a game invitation from {para.request.senderName}!</p>
        <button onClick={acceptFriendRequest}>Accept</button>
        <button onClick={declineFriendRequest}>Decline</button>
      </div>
    );
  };

  useEffect(() => {
    if (data === null) return;
    data.forEach(requestDTO => {
      if (requestDTO.requestType === "FRIENDADDING"){
        if (requestDTO.status === "PENDING"){
          toast(<FriendAddingRequestActions request = {requestDTO} />, {
            position: "top-right",
            autoClose: false,  
            closeOnClick: true, 
            draggable: true
          });  
        } else {
          if (requestDTO.status === "ACCEPTED"){
            toast(`you have added ${requestDTO.receiverName} as a friend!`);
            setData(null);
          }else if (requestDTO.status === "DECLINED"){
            toast(`${requestDTO.receiverName} declined your friend request!`);
            setData(null);
          }
        }
      }else if (requestDTO.requestType === "GAMEINVITATION"){
        if (requestDTO.status === "PENDING"){
          toast(<GameInvitationRequestActions request = {requestDTO} />, {
            position: "top-right",
            autoClose: false,  
            closeOnClick: true, 
            draggable: true
          });  
        } else {
          if (requestDTO.status === "ACCEPTED"){
            toast(`${requestDTO.receiverName} accepted your game invitation!`);
            setData(null);
          }else if (requestDTO.status === "DECLINED"){
            toast(`${requestDTO.receiverName} declined your game invitation!`);
            setData(null);
          }
        }
      }
    });
  }, [data])

  return (
    <PollingContext.Provider value={{ data, currentUserId, setCurrentUserId}}>
      {children}
    </PollingContext.Provider>
  );
};

PollingProvider.propTypes = {
  children: PropTypes.node,
};