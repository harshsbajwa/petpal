import React, { useState, useEffect } from 'react';
import NotificationComponent from './NotificationComponent';

const DeleteNotificationContainer = (user, notification) => {
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

  const handleDelete = (notification) => {
    if (user) {
        try {
            let deleteId = notification.id;
            await fetch(`notifications/deletion/${notification.id}/`, {
                method: 'DELETE',
              });
            
              setNotifications((oldNotifs) =>
              oldNotifs.filter(
                (notification) => notification.id !== deleteId
              )
            );
        
        }
        catch (error) {
            console.error('Error deleting notification:', error);
          }
    }
  }

  return (
    <div>
      {notifications.map((notification) => (
        <NotificationComponent
          key={notification.id}
          notification={notification}
          onDelete={() => handleDelete(notification)}
        />
      ))}
    </div>
  );
};

export default DeleteNotificationContainer;
