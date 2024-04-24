import PropTypes from 'prop-types';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWebSocket } from "../../helpers/webSocket";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({ currUser: null, token: null, id: null });
    const websocket = useWebSocket();

    useEffect(() => {
        let friendRequestSub;
        let gameInvitationSub;

        const handleConnection = () => {
            if (auth.token && auth.id && !websocket.isConnected()) {
                console.log("Attempting to connect WebSocket with ID:", auth.id);
                websocket.connect(auth.id, auth.token);

                // Subscribe to friend requests
                friendRequestSub = websocket.subscribe("/user/queue/friend-requests",message => {
                    const request = JSON.parse(message.body);
                    handleFriendRequest(request);
                })

                // Subscribe to game invitations
                gameInvitationSub = websocket.subscribe(`/user/${auth.id}/game-invitations`, message => {
                    const invitation = JSON.parse(message.body);
                    handleGameInvitation(invitation);
                })
            }
        };

        handleConnection();

        return () => {
            if (websocket.isConnected()) {
                console.log("Disconnecting WebSocket");
                websocket.disconnect();
                if (friendRequestSub) {
                    friendRequestSub.unsubscribe();
                }
                if (gameInvitationSub) {
                    gameInvitationSub.unsubscribe();
                }
            }
        };
    }, [auth, websocket]);

    const login = (user) => {
        localStorage.setItem('token', user.token);
        localStorage.setItem("currUser", JSON.stringify(user));
        localStorage.setItem("id", user.id);
        setAuth({ currUser: JSON.stringify(user), token: user.token, id: user.id });

    };

    const logout = () => {
        websocket.disconnect();
        localStorage.removeItem('token');
        localStorage.removeItem('currUser');
        localStorage.removeItem('id');
        setAuth({ currUser: null, token: null, id: null });
        toast.dismiss();
    };

    const handleFriendRequest = (request) => {
        toast.info(`${request.senderName} wants to be your friend!`, {
            position: "top-right",
            autoClose: false,
            closeOnClick: true,
            draggable: true,
            toastId: `friend-request-${request.id}`,
            buttons: [
                {
                    label: "Accept",
                    onClick: () => acceptFriendRequest(request.id)
                },
                {
                    label: "Decline",
                    onClick: () => declineFriendRequest(request.id)
                }
            ]
        });
    };

    const handleGameInvitation = (invitation) => {
        // Handle game invitation using toast
        toast.info(`${invitation.senderName} invites you for a game!`, {
            position: "top-right",
            autoClose: false,
            closeOnClick: true,
            draggable: true,
            toastId: `game-invitation-${invitation.gameId}`,
            buttons: [
                {
                    label: "Accept",
                    onClick: () => acceptGameInvitation(invitation.gameId)
                },
                {
                    label: "Decline",
                    onClick: () => declineGameInvitation(invitation.gameId)
                }
            ]
        });
    };

    const acceptGameInvitation = (gameId) => {
        websocket.send(`/app/game/${gameId}/accept`, {}, {});
        toast.dismiss(`game-invitation-${gameId}`);
    };

    const declineGameInvitation = (gameId) => {
        websocket.send(`/app/game/${gameId}/decline`, {}, {});
        toast.dismiss(`game-invitation-${gameId}`);
    };

    const acceptFriendRequest = (requestId) => {
        websocket.send(`/app/friend-requests/respond`, {}, JSON.stringify({ requestId, status: 'ACCEPTED' }));
        toast.dismiss(`friend-request-${requestId}`);
        toast.success("Friend request accepted!");
    };

    const declineFriendRequest = (requestId) => {
        websocket.send(`/app/friend-requests/respond`, {}, JSON.stringify({ requestId, status: 'DECLINED' }));
        toast.dismiss(`friend-request-${requestId}`);
        toast.error("Friend request declined.");
    };


    return (
        <AuthContext.Provider value={{...auth, login, logout, websocket, acceptFriendRequest, declineFriendRequest, acceptGameInvitation, declineGameInvitation }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node
};

export const useAuth = () => useContext(AuthContext);
