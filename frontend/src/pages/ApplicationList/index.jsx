import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { TokenContext } from '../../context/TokenContext';
import './styles.css';

const ApplicationList = () => {
    const [applications, setApplications] = useState([]);
    const { token } = useContext(TokenContext);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [sortOrder, setSortOrder] = useState('date');

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                console.log(token);
                const response = await axios.get('http://localhost:8000/api/applications/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                console.log("rd: " + response.data.results);
                setApplications(response.data.results);

                const applicationsWithDetails = await Promise.all(
                    response.data.results.map(async (application, index) => {
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
                            shelter_name: shelterResponse.data.shelter.shelter_name,
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

    const filteredApplications = [];
    for (let i = 0; i < applications.length; i++) {
        if ((searchTerm ? applications[i].pet_name.toLowerCase().includes(searchTerm) : true)
            && (filterStatus ? applications[i].status === filterStatus : true)) {
                filteredApplications.push(applications[i]);    
        }
    }
    const filteredAndSortedApplications = filteredApplications.sort((a, b) => {
        if (sortOrder === 'date') {
            return new Date(b.created_at) - new Date(a.created_at);
        } 
        else if (sortOrder === 'alphabetical') {
            return a.pet_name.localeCompare(b.pet_name);
        }
        return 0;
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [applicationsPerPage] = useState(2);
    const indexOfLastApplication = currentPage * applicationsPerPage;
    const indexOfFirstApplication = indexOfLastApplication - applicationsPerPage;
    const currentApplications = filteredAndSortedApplications.slice(indexOfFirstApplication, indexOfLastApplication);
    const paginate = pageNumber => setCurrentPage(pageNumber);
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredAndSortedApplications.length / applicationsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="container mt-5" style={{ backgroundColor: "salmon", textAlign: 'center' }}>
            <div className="form-container">
                <h1 className='app-list-title'>Application List</h1>
                <div className="filter-sort-controls">
                    <input
                        type="text"
                        placeholder="Search by pet name"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                    <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                        <option value="">All</option>
                        <option value="approved">Approved</option>
                        <option value="pending">Pending</option>
                        <option value="rejected">Rejected</option>
                    </select>
                    <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
                        <option value="date">Sort by Date</option>
                        <option value="alphabetical">Sort Alphabetically</option>
                    </select>
                </div>
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
            {pageNumbers.map(number => (
                <li key={number} className={number === currentPage ? 'active' : ''}>
                    <button onClick={() => paginate(number)}>{number}</button>
                </li>
            ))}
        </div>
    );
};

export default ApplicationList;
