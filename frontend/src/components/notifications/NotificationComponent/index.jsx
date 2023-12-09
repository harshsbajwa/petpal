//to render notification content
import React from 'react';

const NotificationComponent = ({ notification }) => {
    return (
        <div>
            <h6>{notification.sender}</h6>
            <p>{notification.message}</p>
        </div>
    )
}

export default NotificationComponent;