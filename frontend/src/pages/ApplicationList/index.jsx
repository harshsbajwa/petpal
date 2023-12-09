import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { TokenContext } from '../../context/TokenContext';
import './styles.css';

const ApplicationList = () => {
    const [applications, setApplications] = useState([]);
    const { token } = useContext(TokenContext);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/applications/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                setApplications(response.data);

                const applicationsWithDetails = await Promise.all(
                    response.data.map(async (application, index) => {
                        const petResponse = await axios.get(`http://localhost:8000/user/petlistings/${application.pet_listing}/`, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'application/json',
                            },
                        });
                        const shelterResponse = await axios.get(`http://localhost:8000/api/shelter/${application.shelter}/`, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'application/json',
                            },
                        });

                        return {
                            ...application,
                            pet_name: petResponse.data.name,
                            shelter_name: shelterResponse.data.name,
                            applicationNumber: index + 1,
                        };
                    })
                );

                setApplications(applicationsWithDetails);
            } catch (error) {
                console.error('Error fetching applications: ', error);
            }
        };

        fetchApplications();
    }, [token]);

    return (
        <div className="container mt-5" style={{ backgroundColor: "salmon", textAlign: 'center' }}>
            <div className="form-container">
                <h1 className='app-list-title'>Application List</h1>
                <ul>
                    {applications.map(application => (
                        <Link
                            to={`/application/application=${application.id}&shelter=${application.shelter}&seeker=${application.pet_seeker}&pet=${application.pet_listing}`}
                            key={application.id} className="application-preview">
                            <div className="preview-container">
                                <div className="preview-content">
                                    <p>Application #{application.applicationNumber}</p>
                                    <h3>Pet: {application.pet_name}</h3>
                                    <p>Shelter: {application.shelter_name}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ApplicationList;
