import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import AddPet from "../AddPet";
import { TokenContext } from "../../context/TokenContext";
import MainComponent from '../../components/PetlistingPaginationComponent/MainComponent';
import ShelterNavComponent from "../../components/ShelterNavComponent";

const ShelterRegister = () => {
    const [username, setUsername] = useState("");
    const [usernameError, setUsernameerror] = useState(false);
    const [email, setEmail] = useState("");
    const [emailError, setEmailerror] = useState(false);
    const [password1, setP1] = useState("");
    const [p1Error, setP1error] = useState(false);
    const [password2, setP2] = useState("");
    const [p2Error, setP2error] = useState(false);
    const [shelter, setShelter] = useState("");
    const [shelterError, setShelterError] = useState(false);
    const [phone, setPhone] = useState("");
    const [phoneError, setPhoneerror] = useState(false);
    const [formError, setFormerror] = useState(false);
    const [requestMessage, setRequestMessage] = useState({});
    const [additional_preferences, setAP] = useState("");
    const [location, setLocation] = useState("");

    const [showPopup, setShowPopup] = useState(false);
    let [ pets, setPets ] = useState([]);

    const {token, setToken} = useContext(TokenContext);
    const [originalUser, setOriginalUser] = useState("");

    const [userData, setUserData] = useState({
        username: "",
        email: "",
    });
    const [prefilledData, setPrefilledData] = useState({
        shelter_name:"",
        phone: "",
        location: "",
        mission: ""
    });

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    const addPet = (newPet) => {
        setPets([...pets, newPet])
    }
    

    const validateUsername = event => {
        const value = event;
        setUsername(value)
        if (/\W/.test(value) || value.length < 1){
            setUsernameerror(true);
        }
        else{
            setUsernameerror(false);
        }
    }

    const validateEmail = event =>{
        console.log(pets);
        const value = event;
        setEmail(value);
        let emailRegex = /^(?!.*\.\.)(?!.*_)[a-zA-Z0-9_.%+!-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;  
        if (value === ""){
            setEmailerror(true);
        }
        else if (!emailRegex.test(value)){
            setEmailerror(true);
        }
        else {
            setEmailerror(false);
        }
    }

    const validatePassword1 = event =>{
        const value = event;
        setP1(value);
        //tests whether is Username is not at least six characters long and only consist of letters (lowercase or uppercase), digits, and underscore
        if (!(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/.test(value))){
            setP1error(true);
        }
        else {
            setP1error(false);
        }
    }

    const validatePassword2 = event =>{
        const value = event;
        setP2(value);
        let input1= password1;
        //tests whether is Username is not at least six characters long and only consist of letters (lowercase or uppercase), digits, and underscore
        if (!(input1 === value) || value.length === 0){
            setP2error(true);
        }
        else {
            setP2error(false);
        }
    }

    const validateShelterName = event =>{
        const value = event;
        setShelter(value)
        if (/\W/.test(value) || value.length < 1){
            setShelterError(true);
        }
        else{
            setShelterError(false);
        }
    }

    const validatePhone = event =>{
        const value = event;
        setPhone(value);
        //tests whether is Username is not at least six characters long and only consist of letters (lowercase or uppercase), digits, and underscore
        let phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
        if (value === ""){
            setPhoneerror(false);
        }
        else if (!phoneRegex.test(value)){
            setPhoneerror(true);
        }
        else {
            setPhoneerror(false);
        }

    }

   
    useEffect(() => {
      const fetchData = async () => {
          try {
              if (!token) return;
  
              const config = {
                  headers: { Authorization: `Bearer ${token}` }
              };
  
              const response = await axios.patch('http://127.0.0.1:8000/api/user/', "{}", config);
              const { user, shelter_name, phone, location, mission } = response.data;

              setUserData(user);
              setPrefilledData({ shelter_name, phone, location, mission });
  
              setUsername(user.username);
              setOriginalUser(user.username);
              setEmail(user.email);
              setShelter(shelter_name);
              setPhone(phone);
              setLocation(location);
              setAP(mission);
          } catch (error) {
              console.error("Error fetching data:", error);
          }
      };
  
      fetchData();
  }, [token]);


  const validateForm = event =>{
      const config = {
          headers: { Authorization: `Bearer ${token}` }
      };
      setFormerror(false);
      let payload = {
          "user": {
              "username": username===""?username:userData.username,
              "email": email===""?email:userData.email,
          },
          "shelter_name":shelter===""?shelter:prefilledData.shelter_name,
          "phone":phone===""?phone:prefilledData.phone,
          "location":location===""?location:prefilledData.location,
          "mission": additional_preferences===""?additional_preferences:prefilledData.mission
      }
      if (username === originalUser){
          payload = {
              "user": {
                  "email": email===""?email:userData.email,
              },
              "shelter_name":shelter===""?shelter:prefilledData.shelter_name,
              "phone":phone===""?phone:prefilledData.phone,
              "location":location===""?location:prefilledData.location,
              "mission": additional_preferences===""?additional_preferences:prefilledData.mission
          }
      }
      

      console.log(payload);
      axios.patch('http://127.0.0.1:8000/api/user/', payload, config)
      .then(response => {
          setFormerror(false);
          if (pets != []){
              const config = {
                  headers: { Authorization: `Bearer ${token}` }
              };
              for (const i in pets) {
                  const petsPayload = {
                      "name": pets[i].name,
                      "about": pets[i].about,
                      "breed": pets[i].breed,
                      "age": pets[i].age,
                      "gender": pets[i].gender,
                      "size": pets[i].size,
                      "status": pets[i].status
                    };
                  console.log(typeof(petsPayload))
                  console.log(typeof(pets))
                  axios.post( 
                    'http://127.0.0.1:8000/user/petlistings/',
                    petsPayload,
                    config
                  ).then(pets=[]).catch(console.log);
              } 
              
              
          }
          })
          .catch(error => {
              setFormerror(true);
              console.log(token)
              console.log("created shelter but couldn't log in")
              return false;
      })
      .catch(error => {
          setFormerror(true);
          setRequestMessage(error.response.data)
          console.log(error.response.data)
      });
  }
    
    return(
        <>
        <ShelterNavComponent />
        <div className="d-flex justify-content-center align-items-center min-vh-100 mt-5 mb-5">
        <div className="border bg-white shadow box-area row">
            <div className="title w-100">PetPal</div>
            <div className="subtitle">Are you looking to adopt a pet? <Link to="/seeker-register" className="redlink">Create A Seeker Account</Link></div>
            <div className="mb-4 subtitle w-100">Looking to put pets up for adoption? Create a Shelter Account below:</div>
                <div className="left col-md-6">
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">
                        Username
                        </label>
                        <input
                        type="text"
                        className={usernameError?"form-control error-label":"form-control"}
                        id="username"
                        name="username"
                        value={userData.username}
                        onChange={(event)=>{
                          setUserData({ ...userData, username: event.target.value });
                          validateUsername(event.target.value);}
                        } 
                        onClick={(event)=>validateUsername(event.target.value)} 
                        />
                    </div>                
                    <div className="mb-3">
                        <label htmlFor="emailInput" className="form-label">
                        Email address
                        </label>
                        <input
                        type="email"
                        className={emailError?"form-control error-label":"form-control"}
                        id="emailInput"
                        name="email"
                        value={userData.email}
                        onChange={event =>{
                          setUserData({ ...userData, email: event.target.value });
                          validateEmail(event.target.value);} 
                        }
                        onClick={event =>validateEmail(event.target.value)} 
                        />
                    </div>
                    <div className="mb-3 pr-0">
                        <label htmlFor="shelterName" className="form-label">Shelter Name</label>
                        <input type="sname" className={shelterError?"form-control error-label":"form-control"} id="shelterName" name="sname" autoComplete="name" 
                        value={userData.shelter_name}
                        onChange={event =>{
                          setUserData({ ...userData, shelter_name: event.target.value });
                          validateEmail(event.target.value);} 
                        }
                        onClick={event=>validateShelterName(event.target.value)}
                        />
                    </div>
                    </div>
                <div className="right col-md-6">
                    <div className="mb-3">
                        <label htmlFor="phone" className="form-label">
                        Phone Number
                        </label>
                        <input
                        className={phoneError?"form-control error-label":"form-control"}
                        id="phone"
                        placeholder="888-888-8888"
                        title="XXX-XXX-XXXX"
                        required
                        pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                        value={prefilledData.phone}
                        onChange={event =>{
                          setPrefilledData({ ...prefilledData, phone: event.target.value });
                          validatePhone(event.target.value);}} 
                        onClick={event =>validatePhone(event.target.value)} 
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="addressLine" className="form-label">
                        Street Address
                        </label>
                        <input
                        type="text"
                        className="form-control"
                        id="addressLine"
                        name="addressLine"
                        value={prefilledData.location}
                        onChange={(event)=>{
                            setPrefilledData({ ...prefilledData, location: event.target.value });
                            setLocation(event.target.value);}} 
                        onClick={(event)=>setLocation(event.target.value)} 
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleFormControlTextarea1" className="mb-2">
                            Missions Statement
                        </label>
                        <textarea
                        className="form-control preferences"
                        value={prefilledData.mission}
                        onChange={(event)=>{
                          setPrefilledData({ ...prefilledData, mission: event.target.value });
                          setAP(event.target.value);}} 
                        onClick={(event)=>setAP(event.target.value)} 
                        id="exampleFormControlTextarea1"
                        rows="2"
                        ></textarea>
                    </div>     
                </div>
                <div className="mb-2"> 
                    <label htmlFor="addPet" className="w-100 mb-2"> Add a Pet Available for Adoption</label>

                        <button type="button" className="btn btn-secondary mb-2" id="addPet"
                        onClick={()=>togglePopup()}>Add Pet</button>
                    {showPopup && (
                        <div className="popup-overlay" onClick={togglePopup}>
                        <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                                <AddPet togglePopup={togglePopup} addPet={addPet}/>
                        </div>
                        </div>
                    )}

                </div> 
                <MainComponent addedpets={pets} />
                <div className="input-group mb-3">
                <button
                    type="submit"
                    className="btn btn-primary w-100 fs-6"
                    onClick={()=>{validateForm()}}
                    >
                    Update
                </button>
                {formError?<ul>{Object.keys(requestMessage).map(message=><li key={message}>{message}: {requestMessage[message]}</li>)}</ul>:<></>}
                </div>
        </div>
    </div>     
    </>
    )
}

export default ShelterRegister;