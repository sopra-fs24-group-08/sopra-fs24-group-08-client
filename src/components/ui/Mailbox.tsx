import React, { useState, useEffect } from "react";

const Mailbox = () => {
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const eventSource = new EventSource("neededURL");
    eventSource.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      if (newMessage.type === "NEW_MESSAGE") {
        setNotificationCount(prevCount => prevCount + 1);
      }
    };

    return () => eventSource.close();
  }, []);

  return (
    <div className="mailbox-icon-container">
      {notificationCount > 0 && (
        <span className="mailbox-notification">{notificationCount}</span>
      )}
    </div>
  );
};

export default Mailbox;
