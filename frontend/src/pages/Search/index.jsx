import React from 'react';
import ReactDOM from 'react-dom/client';
import { createRoot } from 'react-dom/client';
// import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './style.css'; // Import your custom CSS
import { useNavigate, Link } from 'react-router-dom';
import { useState, useContext } from 'react';
import { ajax } from '../../ajax';
import { TokenContext } from '../../context/TokenContext';
import { IsShelterContext } from '../../context/IsShelterContext';
import ListShelter from '../ListShelter';




const Search = () => {

    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [selectedStatus, setSelectedStatus] = useState('Any');
    const [selectedSort, setSelectedSort] = useState('None');
    const [selectedBreed, setSelectedBreed] = useState('Any');
    const [selectedAge, setSelectedAge] = useState('Any');
    const [responseData, setResponseData] = useState(null);
    const {token, setToken} = useContext(TokenContext);
    const {isShelter, setIsShelter} = useContext(IsShelterContext);

    const access_token = "Bearer " + token;
    console.log("this is the token"+token);
    const headers = {
        Authorization: access_token,
        'Content-Type': 'application/json', // Adjust content type as needed
      };

    var page = 1;

    function handle_submit(event) {
        //first we're gonna build the url based on the selected sorts and filters
        var questionmarkflag = 0;
        var ajaxurl=`/user/petlistings/results/`;
        if(selectedStatus !== 'Any'){
            if(questionmarkflag === 0){
                ajaxurl = ajaxurl + `?`;
                questionmarkflag = 1;
            }else{
                ajaxurl = ajaxurl + `&`;
            }
            ajaxurl= ajaxurl + `status=${selectedStatus}`;
        }
        if(selectedBreed !== 'Any'){
            if(questionmarkflag === 0){
                ajaxurl = ajaxurl + `?`;
                questionmarkflag = 1;
            }else{
                ajaxurl = ajaxurl + `&`;
            }
            ajaxurl= ajaxurl + `breed=${selectedBreed}`;
        }
        if(selectedAge !== 'Any'){
            if(questionmarkflag === 0){
                ajaxurl = ajaxurl + `?`;
                questionmarkflag = 1;
            }else{
                ajaxurl = ajaxurl + `&`;
            }
            ajaxurl= ajaxurl + `age=${selectedAge}`;
        }
        if(selectedSort !== 'None'){
            if(questionmarkflag === 0){
                ajaxurl = ajaxurl + `?`;
                questionmarkflag = 1;
            }else{
                ajaxurl = ajaxurl + `&`;;
            }
            ajaxurl= ajaxurl + `ordering=${selectedSort}`;
        }
        console.log(ajaxurl);

        ajax(ajaxurl, {     //for now can do /?page=2 to view the second page etc
            method: "GET",
            headers: headers,
        })
        .then(request => request.json())
        .then(json => {
            console.log(json) //
            console.log(json.results[0])

            //need to clear the div here to avoid previous results from showing up
            document.getElementById('display').replaceChildren(<div></div>);
            document.getElementById('display').firstChild.remove();

            json.results.forEach(item => {

            const outerDiv = document.createElement('div');
            outerDiv.className = 'card';
            outerDiv.style.width = '17rem';

            //need to use the image

            //this makes the card with the name and about 
            const firstcardbody = document.createElement('div');
            firstcardbody.className = 'card-body';
            const firsth = document.createElement('h5');
            firsth.textContent = 'Name: ' + item.name;
            const firstp = document.createElement('p');
            firstp.textContent = 'About: ' + item.about;

            //
            const ulist = document.createElement('ul');
            ulist.className = 'list-group list-group-flush';
            const firstli = document.createElement('li');
            firstli.className = "list-group-item";
            firstli.textContent = 'Breed: ' + item.breed;
            const secondli = document.createElement('li');
            secondli.className = "list-group-item";
            secondli.textContent = 'Age: ' + item.age;
            const thirdli = document.createElement('li');
            thirdli.className = "list-group-item";
            thirdli.textContent = 'Gender: ' + item.gender;
            const fourthli = document.createElement('li');
            fourthli.className = "list-group-item";
            fourthli.textContent = 'Size: ' + item.size;
            const fifthli = document.createElement('li');
            fifthli.className = "list-group-item";
            fifthli.textContent = 'Status: ' + item.status;
            ulist.append(firstli, secondli, thirdli, fourthli, fifthli);

            const secondcardbody = document.createElement('div');
            secondcardbody.className = 'card-body';
            secondcardbody.id = "centredcardbody";
            const responsivediv = document.createElement('div');
            responsivediv.id = "responsiveflex";
            const detailsbutton = document.createElement('a');
            detailsbutton.className = "btn btn-danger";
            detailsbutton.id = "detailsbtn";
            detailsbutton.href="pet-detail-page-error.html";
            detailsbutton.textContent = "Details";
            const adoptbutton = document.createElement('a');
            adoptbutton.className = "btn btn-danger";
            adoptbutton.id = "adoptbtn";
            adoptbutton.href="pet-adoption-page-error.html";
            adoptbutton.textContent = "Adopt";
            
            responsivediv.append(detailsbutton)
            responsivediv.append(adoptbutton);
            secondcardbody.append(responsivediv);

            firstcardbody.append(firsth, firstp);
            outerDiv.append(firstcardbody, ulist, secondcardbody);
            document.getElementById('display').append(outerDiv);

            //Now make a bunch of buttons for pagination
            // const paginationdiv = document.getElementById('paginationdiv');
            // while(json.next !== null){
            //     const pagebutton = document.createElement('button');
            //     pagebutton.className = 'btn btn-danger';
            //     pagebutton.textContent = page;
            //     paginationdiv.append(pagebutton);
            //     page++;
            //     console.log(page);
            // }
            
            // handle_submit();

            })

        })

        .catch(error => {
            setError(error);
        });

        event.preventDefault();
    }

  return (
    <>
    <div>
      <div className="header">
        {/* Your Navbar */}
        <nav className="navbar navbar-expand-lg">
            <div className="container-fluid nav-container">
              <a href="#" className="navbar-brand">PetPal</a>
              <button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#nav">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="nav">
                <ul className="navbar-nav">
                <li className="nav-item">
                  <a href="#" className="nav-link active">Home</a>
                </li>
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#">Notifications</a>
                  <ul className="dropdown-menu">
                    <li className="dropdown-item">Notification 1</li>
                    <li className="dropdown-item">Notification 2</li>
                    <li className="dropdown-item">Notification 3</li>
                  </ul>
                </li>
                <li className="nav-item">
                  <Link to="/applications" className='nav-link'>Applications</Link>
                </li>
                </ul>
                <div className="dropdown profile-box">
                  <button type="button" className="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown">
                    Profile
                  </button>
                  <ul className="dropdown-menu dropdown-menu-lg-end">
                    <li className="profile-name">JimmyBobJoe</li>
                    <li className="profile-type">Seeker</li>
                    <li><Link to="/seeker/detail" className="dropdown-item profile-edit">Edit</Link></li>
                    <li><a className="dropdown-item profile-edit sign-out" href="landing-page.html">Sign Out</a></li>
                  </ul>
                </div>
              </div>
              
            </div>
          </nav>
      </div>

      <div className="container mt-4" id="HomeSearch">
        <h1>Search</h1>

        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search for pets..."
            aria-label="Search for pets"
            aria-describedby="search-button"
          />



          <div className="input-group-append">
            <a
              className="btn btn-danger btn-lg"
              type="button"
              id="search-button"
              onClick={handle_submit}
            >
              Search
            </a>
          </div>
        </div>

        {/**/}
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
                setSelectedStatus('available');
                console.log('Selected Status:', selectedStatus);
                }}
                >Available
                </a>
            </li>
            <li>
              <a 
              className="dropdown-item" 
              onClick={() => {
                setSelectedStatus('pending');
                console.log('Selected Status:', selectedStatus);
                }}
                >Pending
                </a>
            </li>
            <li>
              <a 
              className="dropdown-item" 
              onClick={() => {
                setSelectedStatus('adopted');
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

        




        

        

        {/* Repeat the structure for other filters... */}

        
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
        {/**/}




      </div>

      {/* The results div */}
      <div className="container mt-4" name="results-placeholder" id='display'> 
      
      </div>

      <div id='paginationdiv'></div>

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
