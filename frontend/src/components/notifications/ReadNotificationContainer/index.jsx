import React, { useState, useEffect } from 'react';
import NotificationComponent from './NotificationComponent';

const ReadNotificationContainer = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('notifications/read/');
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Read Notifications</h2>
      {notifications.map((notification) => (
        <NotificationComponent key={notification.id} notification={notification} />
      ))}
    </div>
  );
};

export default ReadNotificationContainer;