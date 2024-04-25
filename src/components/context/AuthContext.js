import React, { createContext, useContext, useState, useEffect } from "react";
import { useWebSocket } from "../../helpers/webSocket";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import ToastRequest from "../ui/ToastRequest";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({ currUser: null, token: null, id: null });
    const websocket = useWebSocket();

    useEffect(() => {
        const handleConnection = () => {
            if (auth.token && auth.id) {
                if (!websocket.isConnected()) {
                    websocket.connect(auth.id, auth.token, () => subscribeToEvents());
                } else {
                    subscribeToEvents();
                }
            }
        };

        const subscribeToEvents = () => {
            const friendRequestSub = websocket.subscribe(`/user/${auth.id}/friend-requests`, message => {
                const request = JSON.parse(message.body);
                handleFriendRequest(request);
            });

            const gameInvitationSub = websocket.subscribe(`/user/${auth.id}/game-invitations`, message => {
                const invitation = JSON.parse(message.body);
                handleGameInvitation(invitation);
            });

            return () => {
                if (friendRequestSub) {
                    friendRequestSub.unsubscribe();
                }
                if (gameInvitationSub) {
                    gameInvitationSub.unsubscribe();
                }
            };
        };

        handleConnection();

        return () => {
            websocket.disconnect();
        };
    }, [auth, websocket]);

    const login = (user) => {
        localStorage.setItem("token", user.token);
        localStorage.setItem("currUser", JSON.stringify(user));
        localStorage.setItem("id", user.id);
        localStorage.setItem("test", user);
        setAuth({ currUser: JSON.stringify(user), token: user.token, id: user.id });
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("currUser");
        localStorage.removeItem("id");
        //If we don't need localstorage for anything else -> use localStorage.clear()
        setAuth({ currUser: null, token: null, id: null });
        toast.dismiss();
    };

    const handleFriendRequest = (request) => {
        if (request.status === "PENDING") {
            // This is a new friend request
            const message = `${request.senderName} wants to be your friend!`;
            toast.info(<ToastRequest
              message={message}
              onAccept={() => acceptFriendRequest(request)}
              onDecline={() => declineFriendRequest(request)}
              toastId={`friend-request-${request.toastId}`}  // Assuming request.id is the unique identifier for the request
            />, {
                position: "top-right",
                autoClose: false,
                closeOnClick: true,
                draggable: true,
                toastId: `friend-request-${request.toastId}`
            });
        } else if (request.status === "ACCEPTED") {
            // This is an update to an existing request that has been accepted
            const message = `Your friend request to ${request.receiverName} has been accepted!`;
            toast.success(message, {
                position: "top-right",
                autoClose: 5000,  // Auto close after 5 seconds
                closeOnClick: true,
                draggable: true,
                toastId: `friend-request-update-${request.toastId}`
            });

        }
    };

    const handleGameInvitation = (invitation) => {
        console.log("Handling game invitation:", invitation);

        if (invitation.status === "PENDING") {
            const message = `${invitation.senderName} invites you for a game!`;
            toast.info(<ToastRequest
              message={message}
              onAccept={() => acceptGameInvitation(invitation)}
              onDecline={() => declineGameInvitation(invitation)}
              toastId={`game-invitation-${invitation.gameId}`}
            />, {
                position: "top-right",
                autoClose: false,
                closeOnClick: true,
                draggable: true,
                toastId: `game-invitation-${invitation.gameId}`
            });
        } else if (invitation.status === "ACCEPTED") {
            const message = `Your game invitation from ${invitation.senderName} has been accepted!`;
            toast.success(message, {
                position: "top-right",
                autoClose: 5000,
                closeOnClick: true,
                draggable: true,
                toastId: `game-invitation-update-${invitation.gameId}`
            });
        }
    };

    const acceptGameInvitation = (invitation) => {
        const response = {
            status: "ACCEPTED",
            senderId: invitation.senderId,
            receiverId: auth.id
        };
        websocket.send(`/app/game/${auth.id}/accept`, {}, JSON.stringify(response));
        toast.dismiss(`game-invitation-${response.id}`);
    };

    const declineGameInvitation = (invitation) => {
        const response = {
            status: "DECLINED",
            senderId: invitation.senderId,
            receiverId: auth.id
        };
        websocket.send(`/app/game/${auth.id}/decline`, {}, JSON.stringify(response));
        toast.dismiss(`game-invitation-${response.id}`);
    };

    const acceptFriendRequest = (request) => {
        const response = {
            status: "ACCEPTED",
            senderId: request.senderId,
            receiverId: auth.id,
        }
        websocket.send(`/app/${auth.id}/friend-requests/responds`, {}, JSON.stringify(response));
        toast.dismiss(`friend-request-${request.toastId}`);
        toast.success("Friend request accepted!");
    };

    const declineFriendRequest = (request) => {
        const response = {
            status: "DECLINED",
            senderId: request.senderId,
            receiverId: auth.id,
        }
        websocket.send(`/app/${auth.id}/friend-requests/responds`, {}, JSON.stringify(response));
        toast.dismiss(`friend-request-${request.toastId}`);
        toast.success("Friend request accepted!");
    };

    return (
      <AuthContext.Provider value={{ ...auth, login, logout, websocket }}>
          {children}
      </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node // Defining the type for 'children'
};

export const useAuth = () => useContext(AuthContext);
