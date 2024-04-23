import React, { createContext, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify"; // assuming you're using react-toastify for notifications

const FriendRequestContext = createContext();

export const useFriendRequests = () => useContext(FriendRequestContext);

export const FriendRequestProvider = ({ children }) => {
    const { stompClient } = useAuth();

    useEffect(() => {
        const subscribeToFriendRequests = () => {
            stompClient.subscribe('/user/queue/friend-requests', (message) => {
                const request = JSON.parse(message.body);
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
            });
        };

        if (stompClient) {
            subscribeToFriendRequests();
        }

        return () => {
            if (stompClient) {
                stompClient.unsubscribe('/user/queue/friend-requests');
            }
        };
    }, [stompClient]);

    const sendFriendRequest = (recipientId) => {
        stompClient.send('/app/friend-requests/send', {}, JSON.stringify({ recipientId }));
    };

    const acceptFriendRequest = (requestId) => {
        stompClient.send('/app/friend-requests/respond', {}, JSON.stringify({ requestId, status: 'ACCEPTED' }));
        toast.dismiss(`friend-request-${requestId}`);
        toast.success("Friend request accepted!");
    };

    const declineFriendRequest = (requestId) => {
        stompClient.send('/app/friend-requests/respond', {}, JSON.stringify({ requestId, status: 'DECLINED' }));
        toast.dismiss(`friend-request-${requestId}`);
        toast.error("Friend request declined.");
    };

    return (
        <FriendRequestContext.Provider value={{ sendFriendRequest, acceptFriendRequest, declineFriendRequest }}>
            {children}
        </FriendRequestContext.Provider>
    );
};

