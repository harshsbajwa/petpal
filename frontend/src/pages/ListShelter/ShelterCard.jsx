import React from 'react';

const ShelterCard = ({ shelter }) => {
    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">{shelter.shelter_name}</h5>
                <h6 className="card-subtitle mb-2 text-muted">Location: {shelter.location}</h6>
                <p className="card-text">Mission: {shelter.mission}</p>
                <p className="card-text">Phone: {shelter.phone}</p>
                <p className="card-text">Email: {shelter.user.email}</p>
            </div>
        </div>
    );
};

export default ShelterCard;