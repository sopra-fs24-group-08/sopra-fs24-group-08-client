import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWebSocket } from "../../helpers/webSocket";
import { toast } from "react-toastify";
import PropTypes from 'prop-types';
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
        localStorage.setItem('token', user.token);
        localStorage.setItem("currUser", JSON.stringify(user));
        localStorage.setItem("id", user.id);
        localStorage.setItem("test", user);
        setAuth({ currUser: JSON.stringify(user), token: user.token, id: user.id });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('currUser');
        localStorage.removeItem('id');
        setAuth({ currUser: null, token: null, id: null });
        toast.dismiss();
    };

    const handleFriendRequest = (request) => {
        console.log("Handling friend request:", request);
        const message = `${request.senderName} wants to be your friend!`;
        toast.info(<ToastRequest
          message={message}
          onAccept={() => acceptFriendRequest(request)}
          onDecline={() => declineFriendRequest(request)}
          toastId={`friend-request-${request.id}`}
        />, {
            position: "top-right",
            autoClose: false,
            closeOnClick: true,
            draggable: true,
            toastId: `friend-request-${request.id}`
        });
    };

    const handleGameInvitation = (invitation) => {
        console.log("Handling game invitation:", invitation);
        const message = `${invitation.senderName} invites you for a game!`;
        toast.info(<ToastRequest
          message={message}
          onAccept={() => acceptGameInvitation(invitation)}
          onDecline={() => declineGameInvitation(invitation)}
        />, {
            position: "top-right",
            autoClose: false,
            closeOnClick: true,
            draggable: true,
            toastId: `game-invitation-${invitation.gameId}`
        });
    };


    const acceptGameInvitation = (invitation) => {
        invitation.status = "ACCEPTED"
        websocket.send(`/app/game/${gameId}/accept`, {}, JSON.stringify(invitation));
        toast.dismiss(`game-invitation-${gameId}`);
    };

    const declineGameInvitation = (invitation) => {
        invitation.status = "DECLINED"
        websocket.send(`/app/game/${gameId}/decline`, {}, JSON.stringify(invitation));
        toast.dismiss(`game-invitation-${gameId}`);
    };

    const acceptFriendRequest = (request) => {
        request.status = "ACCEPTED"
        websocket.send(`/app/${auth.id}/friend-requests/respond`, {}, JSON.stringify(request));
        toast.dismiss(`friend-request-${requestId}`);
        toast.success("Friend request accepted!");
    };

    const declineFriendRequest = (request) => {
        request.status = "DECLINED"
        websocket.send(`/app/${auth.id}/friend-requests/respond`, {}, JSON.stringify({ request }));
        toast.dismiss(`friend-request-${requestId}`);
        toast.error("Friend request declined.");
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
