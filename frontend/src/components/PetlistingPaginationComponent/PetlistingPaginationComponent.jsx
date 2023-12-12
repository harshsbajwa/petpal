import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { TokenContext } from '../../context/TokenContext';
import { Link, Navigate, useNavigate } from 'react-router-dom';

const CardComponent = (props) => {
  const [seekerId, setSeekerId] = useState(0);
  const [data, setData] = useState("");
  const [appId, setAppId] = useState(0);
  const { token, setToken } = useContext(TokenContext);

  const navigate = useNavigate();

  const createApp = async () => {
    try {
      if (!token) return;

      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      // First, create a seeker
      const seekerPayload = {}; // Add your seeker payload here
      try {
        const seekerResponse = await axios.patch(`http://127.0.0.1:8000/api/user/`, seekerPayload, config);
        setSeekerId(seekerResponse.data.id);

        // Then, create the application using the seekerId
        const payload = {
          "pet_seeker": seekerResponse.data.id,
          "pet_listing": props.pet.id,
          "shelter": props.pet.shelter,
          "form": {},
          "status": "pending"
        };

        const appResponse = await axios.post(`http://127.0.0.1:8000/api/applications/`, payload, config);
        setData(appResponse.data);
        setAppId(appResponse.data.id);

        // Update the UI or navigate after setting the seekerId and appId
        console.log(appResponse.data);
        navigate(`/application/application=${appResponse.data.id}&shelter=${props.pet.shelter}&seeker=${seekerResponse.data.id}&pet=${props.pet.id}`);
      } catch (error) {
        console.error("Error creating application:", error);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
 
    return (
      (props.name === "" || props.pet.name === props.name) && (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">{props.pet.name}</h5>
            <p className="card-text">About: {props.pet.about}</p>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">Gender: {props.pet.gender}</li>
              <li className="list-group-item">Size: {props.pet.size}</li>
              <li className="list-group-item">Breed: {props.pet.breed}</li>
              <li className="list-group-item">Age: {props.pet.age}</li>
              <li className="list-group-item">Status: {props.pet.status}</li>
              <button className="btn btn-primary" onClick={()=>{createApp()}}>Adopt</button>
              <button className="btn btn-primary mt-4" onClick={()=>{navigate(`/pet-listing/${props.pet.id}`)}}>Details</button>
            </ul>
          </div>
        </div>
  
      )
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

const PetlistingPaginationComponent = (props) => {
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
        if (currentPage > totalPages){setCurrentPage(1)};
        let ajaxurl = `http://localhost:8000/user/petlistings/results/?page=${currentPage}`;
        if(props.selectedStatus !== 'Any'){
    
            ajaxurl= ajaxurl + `&status=${props.selectedStatus}`
        }
        if(props.selectedBreed !== 'Any'){
            ajaxurl= ajaxurl + `&breed=${props.selectedBreed}`;
        }
        if(props.selectedAge !== 'Any'){
            ajaxurl= ajaxurl + `&age=${props.selectedAge}`;
        }
        if(props.selectedSort !== 'None'){
            ajaxurl= ajaxurl + `&ordering=${props.selectedSort}`;
        }
        const response = await axios.get(ajaxurl, config);
        setData(response.data);
        // Assuming you get total pages information from the API
        // Replace 10 with the actual number of items per page in your API
        console.log("this is what the reqest is getting"+response.data)
        setTotalPages(Math.ceil(response.data.count/2));
        if(props.name != ""){
            setCurrentPage(1);
            setTotalPages(1);
        }
      } catch (error) {
        setData({});
        setTotalPages(0);
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [currentPage, props.addedpets, totalPages]);

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mt-3 mb-3">
    <h1>Pet Listings</h1>
    <div className="card-container">
      {data.results && data.results.length > 0 ? (
        props.addedpets.length === 0?data.results.map((item, index) => (
          <CardComponent key={index} pet={item} name={props.name}/>)): [...props.addedpets, ...data.results].map((item, index) => (
            <CardComponent key={index} pet={item} name={props.name} />
        ))
      ) : (
        <p>No Results For This Filter</p>
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

export default PetlistingPaginationComponent;