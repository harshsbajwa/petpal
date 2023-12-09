import axios from "axios";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import AddPet from "../AddPet";

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
    const [ pets, setPets ] = useState([]);

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

    const validateForm = event =>{
        validateUsername(username);
        validateEmail(email);
        validatePassword1(password1);
        validatePassword2(password2);
        validateShelterName(shelter);
        validatePhone(phone);
        if (usernameError || emailError || p1Error || p2Error || phoneError || shelterError) {
            setFormerror(true); 
        }
        else{
            setFormerror(false);
            const payload = {
                "username": username,
                "email": email,
                "password":password1,
                "password2":password2,
                "shelter_name":shelter,
                "phone":phone,
                "location":location,
                "mission": additional_preferences
            }
            let token = "";

            axios.post('http://127.0.0.1:8000/api/shelter/', payload)
            .then(response => {
                setFormerror(false);
                axios.post('http://127.0.0.1:8000/api/token/', {
                    "username":username,
                    "password":password1
                })
                .then(response => {
                    token = response.data.access
                    console.log(token);
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
                            ).then(console.log).catch(console.log);
                        } 
                        
                    }
                })
                .catch(error => {
                    setFormerror(true);
                    console.log(token)
                    console.log("created shelter but couldn't log in")
                    return false;
                });
                
            })
            .catch(error => {
                return false;
                setFormerror(true);
                setRequestMessage(error.response.data)
                console.log(error.response.data)
            });
            
            




        }
    }
    
    return(
        <div className="d-flex justify-content-center align-items-center min-vh-100">
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
                        onChange={(event)=>validateUsername(event.target.value)} 
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
                        onChange={event =>validateEmail(event.target.value)} 
                        onClick={event =>validateEmail(event.target.value)} 
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="passwordInput" className="form-label">
                        Password
                        </label>
                        <input
                        type="password"
                        className={p1Error?"form-control error-label":"form-control"}
                        id="passwordInput"
                        name="password"
                        onChange={event =>validatePassword1(event.target.value)} 
                        onClick={event =>validatePassword1(event.target.value)} 
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="cpasswordInput" className="form-label">
                        Confirm Password
                        </label>
                        <input
                        type="password"
                        className={p2Error?"form-control error-label":"form-control"}
                        id="cpasswordInput"
                        name="cpassword"
                        onChange={event =>validatePassword2(event.target.value)} 
                        onClick={event =>validatePassword2(event.target.value)} 
                        />
                    </div>
                </div>
                <div className="right col-md-6">
                    <div className="mb-3 pr-0">
                        <label htmlFor="shelterName" className="form-label">Shelter Name</label>
                        <input type="sname" className={shelterError?"form-control error-label":"form-control"} id="shelterName" name="sname" autoComplete="name" 
                        onChange={event=>validateShelterName(event.target.value)}
                        onClick={event=>validateShelterName(event.target.value)}
                        />
                    </div>
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
                        onChange={event =>validatePhone(event.target.value)} 
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
                        onChange={(event)=>setLocation(event.target.value)} 
                        onClick={(event)=>setLocation(event.target.value)} 
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleFormControlTextarea1" className="mb-2">
                            Missions Statement
                        </label>
                        <textarea
                        className="form-control preferences"
                        onChange={(event)=>setAP(event.target.value)} 
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
                <div className="input-group mb-3">
                <button
                    type="submit"
                    className="btn btn-primary w-100 fs-6"
                    onClick={()=>validateForm()}
                    >
                    Login
                </button>
                {formError?<ul>{Object.keys(requestMessage).map(message=><li key={message}>{message}: {requestMessage[message]}</li>)}</ul>:<></>}
                </div>
            <small>Already have an account? <Link to='/' className="redlink">Log In</Link></small>
        </div>
    </div>     
    )
}

export default ShelterRegister;