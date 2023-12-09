import React from 'react';
import  { useContext, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { createRoot } from 'react-dom/client';
// import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './style.css'; // Import your custom CSS
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ajax } from '../../ajax';
import { TokenContext } from '../../context/TokenContext';
import { IsShelterContext } from '../../context/IsShelterContext';

const Shelterdetail = () => {
    var ajaxflag = 0;
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [locationAppended, setLocationAppended] = useState(false);
    const [responseData, setResponseData] = useState(null);
    const {token, setToken} = useContext(TokenContext);
    const {isShelter, setIsShelter} = useContext(IsShelterContext);

    const access_token = "Bearer " + token;
    
    const headers = {
        Authorization: access_token,
        'Content-Type': 'application/json', // Adjust content type as needed
      };
    






    function handle_update(){

    }

    
    if(ajaxflag == 0){
    //Need to change this from one to the shelter's id
        ajax('/api/shelter/1/',{     //for now can do /?page=2 to view the second page etc
            method: "GET",
            headers: headers,
        })
        .then(request => request.json())
        .then(json =>{
            console.log(json)
            ajaxflag = 1;
            
        var mydiv = document.getElementById('HomeSearch');
        mydiv.className = "text-center container mt4";
        mydiv.style.marginTop = '3rem';
        var locationdiv = document.createElement('h3');
        var missiondiv = document.createElement('h3');
        var phonediv = document.createElement('h3');
        var shelterdiv = document.createElement('h3');

        if(json.shelter.shelter_name !== null){
            shelterdiv.textContent = 'Shelter: ' + json.shelter.shelter_name;
            mydiv.append(shelterdiv);
        }
        if(json.shelter.location !== null){
            locationdiv.textContent = 'Location: ' + json.shelter.location;
            mydiv.append(locationdiv);
        }
        if(json.shelter.mission !== null){
            missiondiv.textContent = 'Mission: ' + json.shelter.mission;
            mydiv.append(missiondiv);
        }
        if(json.shelter.phone !== null){
            phonediv.textContent = 'Phone: ' + json.shelter.phone;
            mydiv.append(phonediv);
        }




        //now for petlistings
        json.petslistings.forEach(item => {

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
    }

    


    
      return (
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
                      <a href="my-applications.html" className="nav-link">My Applications</a>
                    </li>
                    </ul>
                    <div className="dropdown profile-box">
                      <button type="button" className="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown">
                        Profile
                      </button>
                      <ul className="dropdown-menu dropdown-menu-lg-end">
                        <li className="profile-name">JimmyBobJoe</li>
                        <li className="profile-type">Seeker</li>
                        <li><a className="dropdown-item profile-edit" href="UserAccountUpdate.html">Edit</a></li>
                        <li><a className="dropdown-item profile-edit sign-out" href="landing-page.html">Sign Out</a></li>
                      </ul>
                    </div>
                  </div>
                  
                </div>
              </nav>
          </div>
    
          <div className="container mt-4" id="HomeSearch">
            <h1>Shelter Detail Page</h1>

    
    
    
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
      );


    }

    export default Shelterdetail;