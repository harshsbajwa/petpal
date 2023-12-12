import React from 'react';
import ReactDOM from 'react-dom/client';
import { createRoot } from 'react-dom/client';
// import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './style.css'; // Import your custom CSS
import { useNavigate, Link } from 'react-router-dom';
import { useState, useContext, useEffect} from 'react';
import { ajax } from '../../ajax';
import { TokenContext } from '../../context/TokenContext';
import { IsShelterContext } from '../../context/IsShelterContext';
import ListShelter from '../ListShelter';
import SeekerNavComponent from '../../components/SeekerNavComponent';
import PetlistingPaginationComponent from '../../components/PetlistingPaginationComponent/PetlistingPaginationComponent';

const Search = () => {

  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState('Any');
  const [selectedSort, setSelectedSort] = useState('None');
  const [selectedBreed, setSelectedBreed] = useState('Any');
  const [response, setResponse] = useState(null);
  const [selectedAge, setSelectedAge] = useState('Any');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState({search:'', page:1});
  const {token, setToken} = useContext(TokenContext);
  const {isShelter, setIsShelter} = useContext(IsShelterContext);
  const [url, setUrl] = useState("");

  const access_token = "Bearer " + token;
  console.log("this is the token"+token);
  const headers = {
      Authorization: access_token,
      'Content-Type': 'application/json', // Adjust content type as needed
    };

  var page = 1;
  

  return (
    <>
    <div>
      <SeekerNavComponent />

      <div className="container mt-4" id="HomeSearch">
        <h1>Search</h1>

        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search for pets..."
            aria-label="Search for pets"
            aria-describedby="search-button"
            id='searchinput'
            
          />
          <div className="input-group-append">
            <a
              className="btn btn-danger btn-lg"
              type="button"
              id="search-button"
              onClick={() =>{
                setSearch(document.getElementById('searchinput').value )
              }}
            >
              Search
            </a>
          </div>
        </div>
    <div id="sortandfilter">
      <div className="buttonholder">
        <h2 className="display-6">Filters:</h2>
        <div className="dropdown">
          <a className="btn btn-danger dropdown-toggle" role="button" data-bs-toggle="dropdown">
            Status
          </a>
          <ul className="dropdown-menu">
            <li>
              <a 
              className="dropdown-item" 
              onClick={() => {
                setSelectedStatus('Available');
                console.log('Selected Status:', selectedStatus);
                }}
                >Available
                </a>
            </li>
            <li>
              <a 
              className="dropdown-item" 
              onClick={() => {
                setSelectedStatus('Pending');
                console.log('Selected Status:', selectedStatus);
                }}
                >Pending
                </a>
            </li>
            <li>
              <a 
              className="dropdown-item" 
              onClick={() => {
                setSelectedStatus('Adopted');
                console.log('Selected Status:', selectedStatus);
                }}
                >Adopted
                </a>
            </li>
            <li>
              <a 
              className="dropdown-item" 
              onClick={() => {
                setSelectedStatus('Any');
                console.log('Selected Status:', selectedStatus);
                }}
                >Any
                </a>
            </li>
            
          </ul>
          <h5 id='centredcardbody'>  {selectedStatus}</h5>
        </div>
        <div className="dropdown">
          <a className="btn btn-danger dropdown-toggle" role="button" data-bs-toggle="dropdown">
            Breed
          </a>

          <ul className="dropdown-menu">
            <li>
              <input
                id='breedinput'
                type='text'
                >
                </input>
            </li>
            <div className="input-group-append" id='centredcardbody'>
            <a
              className="btn btn-danger btn-sml"
              type="button"
              onClick={() => {
                console.log(document.getElementById('breedinput').value);
                setSelectedBreed(document.getElementById('breedinput').value);
                if(document.getElementById('breedinput').value === ''){
                    setSelectedBreed('Any');
                }
                
              }}
            >
              Submit
            </a>
          </div>
          </ul>
          <h5 id='centredcardbody'>  {selectedBreed}</h5>
        </div> 




        <div className="dropdown">
          <a className="btn btn-danger dropdown-toggle" role="button" data-bs-toggle="dropdown">
            Age
          </a>

          <ul className="dropdown-menu">
            <li>
              <input
                id='ageinput'
                type='number'
                >
                </input>
            </li>
            <div className="input-group-append" id='centredcardbody'>
            <a
              className="btn btn-danger btn-sml"
              type="button"
              onClick={() => {
                console.log(document.getElementById('ageinput').value);
                setSelectedAge(document.getElementById('ageinput').value);
                if(document.getElementById('ageinput').value === ''){
                    setSelectedAge('Any');
                }
                
              }}
            >
              Submit
            </a>
          </div>
          </ul>
          <h5 id='centredcardbody'>  {selectedAge}</h5>
        </div>       
      </div>

      <div className="buttonholder">
        <h2 className="display-6" id="sorttag">
          Sort:
        </h2>

        <div className="dropdown">
          <a className="btn btn-danger dropdown-toggle" role="button" data-bs-toggle="dropdown">
            Sort
          </a>

          <ul className="dropdown-menu">
            <li>
              <a 
              className="dropdown-item"
              onClick={() => {
                setSelectedSort('name');
                console.log('Selected Sort:', selectedSort);
                }}
              >Name</a>
            </li>
            <li>
              <a 
              className="dropdown-item"
              onClick={() => {
                setSelectedSort('age');
                console.log('Selected Sort:', selectedSort);
                }}
              >Age</a>
            </li>
            <li>
              <a 
              className="dropdown-item"
              onClick={() => {
                setSelectedSort('None');
                console.log('Selected Sort:', selectedSort);
                }}
              >None</a>
            </li>
            
          </ul>

          <h5 id='centredcardbody'>  {selectedSort}</h5>
        </div>
      </div>
    </div>
  </div>
      <PetlistingPaginationComponent addedpets={[]} url={url} selectedStatus={selectedStatus} selectedBreed={selectedBreed} selectedAge={selectedAge} selectedSort={selectedSort} name={search}/>

      <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL"
        crossOrigin="anonymous"
      ></script>
    </div>
    <ListShelter />
    </> 
  );
};

export default Search;
