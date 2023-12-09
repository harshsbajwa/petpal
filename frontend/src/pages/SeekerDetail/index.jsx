import React, { useContext, useEffect, useState } from 'react';
import { TokenContext } from '../../context/TokenContext';
import { Link } from 'react-router-dom';
import axios from 'axios';

const SeekerDetail = () => {
    const {token, setToken} = useContext(TokenContext);
    const [response, setResponse] = useState([]);


    

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!token) return; // Do not make the request if token is not available

                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };

                // Your payload for the PATCH request
                const payload = {
                    // Include your data to be patched/updated
                };

                // Make a PATCH request using axios
                const response = await axios.patch('http://127.0.0.1:8000/api/user/', payload, config);
                setResponse(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData(); // Call the fetchData function
    }, [token]);

    const renderDetails = (data) => {
        return (
            <ul>
                {Object.keys(data).map((key) => {
                    if (typeof data[key] === 'object') {
                        return (
                            <li key={key}>
                                {key}:
                                <ul>
                                    {Object.keys(data[key]).map((subKey) => (
                                        <li key={subKey}>
                                            {subKey}: {data[key][subKey]}
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        );
                    } else {
                        return (
                            <li key={key}>
                                {key}: {data[key]}
                            </li>
                        );
                    }
                })}
            </ul>
        );
    };

    return (
        <div className="container justify-content-center align-items-center">
            <div className="row">{renderDetails(response)}</div>
            <Link to="/seeker/update/" className="btn btn-primary">
                Change Details
            </Link>
        </div>
    );
};

export default SeekerDetail;