//I am getting the unread notifications only 

import React, { useState, useEffect } from 'react';
import NotificationComponent from './NotificationComponent';

const UpdateNotificationContainer = (user) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('notifications/unread/');
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchData();
  }, []);

  const handleUpdate = (notification) => {
    try {
        const response = await fetch(`notifications/${notification.id}/`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
            //'Content-Type': 'application/json',           
          },
          body: JSON.stringify({ is_read: isRead }),
        });
  
        if (response.ok) {
          const updatedNotifications = notifications.map((notification) =>
            notification.id === notification.id ? { ...notification, is_read: isRead } : notification
          );
          setNotifications(updatedNotifications);
        } else {
          console.error('Failed to update notification:', response.statusText);
        }
      } catch (error) {
        console.error('Error updating notification:', error);
      }
  }

  return (
    <div>
      <h2>Notifications</h2>
      {notifications.map((notification) => (
        <NotificationComponent key={notification.id} notification={notification}
        onUpdate={(notification) => handleUpdate(notification)} />
      ))}
    </div>
  );
};

export default UpdateNotificationContainer;