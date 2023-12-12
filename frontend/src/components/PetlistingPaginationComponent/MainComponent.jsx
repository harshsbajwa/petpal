import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { TokenContext } from '../../context/TokenContext';

const CardComponent = ({ pet }) => {
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">{pet.name}</h5>
        <p className="card-text">About: {pet.about}</p>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">Gender: {pet.gender}</li>
          <li className="list-group-item">Size: {pet.size}</li>
          <li className="list-group-item">Breed: {pet.breed}</li>
          <li className="list-group-item">Age: {pet.age}</li>
          <li className="list-group-item">Status: {pet.status}</li>
        </ul>
      </div>
    </div>
  );
};

const PaginationComponent = ({ currentPage, totalPages, goToPage }) => {
  return (
    <div className="pagination">
      {currentPage > 1 && (
        <button onClick={() => goToPage(currentPage - 1)}>Previous</button>
      )}
      <span>Page {currentPage} of {totalPages}</span>
      {currentPage < totalPages && (
        <button onClick={() => goToPage(currentPage + 1)}>Next</button>
      )}
    </div>
  );
};

const MainComponent = ({addedpets}) => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const {token, setToken} = useContext(TokenContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) return; // Do not make the request if token is not available

        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        const response = await axios.get(`http://127.0.0.1:8000/user/petlistings/results/?page=${currentPage}`, config);
        setData(response.data);
        // Assuming you get total pages information from the API
        // Replace 10 with the actual number of items per page in your API
        console.log(response.data)
        console.log(response.data.results[1].name)
        setTotalPages(Math.ceil(response.data.count/2));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [currentPage, addedpets]);

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mt-3 mb-3">
    <h1>Pet Listings</h1>
    <div className="card-container">
      {data.results && data.results.length > 0 ? (
        addedpets.length === 0?data.results.map((item, index) => (
          <CardComponent key={index} pet={item} />)): [...addedpets, ...data.results].map((item, index) => (
            <CardComponent key={index} pet={item} />
        ))
      ) : (
        <p>Loading...</p>
      )}
    </div>
    {currentPage > 1 
    ? <button class="btn btn-primary m-2" onClick={()=>{setCurrentPage(currentPage - 1)}} >Previous Page</button>
    : <></> }
    { currentPage < totalPages
    ? <button class="btn btn-primary m-2" onClick={()=>{setCurrentPage(currentPage + 1)}} >Next Page</button>
    : <></> }
    <p>Page {currentPage} out of {totalPages}.</p>
  </div>
  );
};

export default MainComponent;