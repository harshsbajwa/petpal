import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams, useHistory, Link, useLocation } from 'react-router-dom';
import { TokenContext } from '../../context/TokenContext';
import './styles.css';

const ApplicationList = () => {
    const [applications, setApplications] = useState([]);

    const {token, setToken} = useContext(TokenContext);

    const URL = 'http://localhost:8000/api/applications/'
    const accessToken = `Bearer ${token}`;
    const payload = {
        headers: {
            Authorization: accessToken,
            'Content-Type': 'application/json',
        },
    };

    useEffect(() => {
        axios.get(URL, payload)
        .then(response => setApplications(response.data))
        .catch(error => console.error('Error fetching applications: ', error));
    }, []);

    return (
        <div class="container mt-5" style={{backgroundColor:"salmon", textAlign:'center'}}>
          <div class="form-container">
            <h1 className='app-list-title'>Application List</h1>
            <ul>
                {applications.map(application => (
                    <Link to={`/application/application=${application.id}&shelter=${application.shelter}&seeker=${application.pet_seeker}&pet=${application.pet_listing}`} key={application.id}>
                        <h2>{application.form.firstName} {application.form.lastName}</h2>
                        <p>Email: {application.form.email}</p>
                    </Link>
                ))}
            </ul>
          </div>
        </div>
    );
};

export default ApplicationList;
