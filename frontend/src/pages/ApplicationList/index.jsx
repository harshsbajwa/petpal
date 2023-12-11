import React, { useEffect, useState, useContext } from 'react';
import axios, { all } from 'axios';
import { Link } from 'react-router-dom';
import { TokenContext } from '../../context/TokenContext';
import './styles.css';

const ApplicationList = () => {
    const [applications, setApplications] = useState([]);
    const { token } = useContext(TokenContext);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [sortOrder, setSortOrder] = useState('created_at');

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [applicationsPerPage] = useState(2);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                console.log(token);

                let url = 'http://localhost:8000/api/applications/?page=';
                url += currentPage; 
                url += searchTerm.length != 0 ? `&search=${searchTerm}` : "";
                url += filterStatus.length != 0 ? `&status=${filterStatus}` : "";
                url += sortOrder.length != 0 ? `&ordering=${sortOrder}` : "";
                url += `&perpage=${applicationsPerPage}`;
                
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                console.log("rd: " + response.data.results);
                setApplications(response.data.results);
                console.log(applications)

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
    }, [searchTerm, filterStatus, setSortOrder, currentPage, token]);

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
            <div class="text-center mt-4">
                { currentPage > 1 
                    ? <button class="btn btn-primary m-2" onClick={()=>{setCurrentPage(currentPage - 1)}} >Previous Page</button>
                    : <></> }
                { currentPage <= totalPages && currentPage > 1
                    ? <button class="btn btn-primary m-2" onClick={()=>{setCurrentPage(currentPage + 1)}} >Next Page</button>
                    : <></> }
                <p>Page {currentPage} out of {totalPages}.</p>
            </div>
        </div>
    );
};

export default ApplicationList;
