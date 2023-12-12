import React, { useContext, useEffect, useState } from 'react';
import { TokenContext } from '../../context/TokenContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SeekerNavComponent from '../../components/SeekerNavComponent';

const SeekerUpdate= () => {

    const [username, setUsername] = useState("");
    const [usernameError, setUsernameerror] = useState(false);
    const [fname, setFname] = useState("");
    const [fnError, setFnerror] = useState(false);
    const [lname, setLname] = useState("");
    const [lnError, setLnerror] = useState(false);
    const [email, setEmail] = useState("");
    const [emailError, setEmailerror] = useState(false);
    const [password1, setP1] = useState("");
    const [p1Error, setP1error] = useState(false);
    const [password2, setP2] = useState("");
    const [p2Error, setP2error] = useState(false);
    const [phone, setPhone] = useState("");
    const [phoneError, setPhoneerror] = useState(false);
    const [location, setLocation] = useState("");
    const [additional_preferences, setAP] = useState("");
    const [formError, setFormerror] = useState(false);
    const [requestMessage, setRequestMessage] = useState({});
    const {text, setText} = useContext(TokenContext);
    const [response, setResponse] = useState([]);
    const {token, setToken} = useContext(TokenContext);
    const [originalUser, setOriginalUser] = useState("");

    const [userData, setUserData] = useState({
        username: "",
        email: "",
        first_name: "",
        last_name: ""
    });
    const [prefilledData, setPrefilledData] = useState({
        phone: "",
        location: "",
        preferences: ""
    });

    const validateUsername = event => {
        console.log(text);
        const value = event;
        setUsername(value)
        if (/\W/.test(value) || value.length < 1){
            setUsernameerror(true);
        }
        else{
            setUsernameerror(false);
        }
    }
    const validateFname = event => {
        const value = event;
        setFname(value)
        if (/\W/.test(value) || value.length < 1){
            setFnerror(true);
        }
        else{
            setFnerror(false);
        }
    }
    const validateLname = event => {
        const value = event;
        setLname(value)
        if (/\W/.test(value) || value.length < 1){
            setLnerror(true);
        }
        else{
            setLnerror(false);
        }
    }

    const validateEmail = event =>{
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
                const { user, phone, location, preferences } = response.data;
    
                setUserData(user);
                setPrefilledData({ phone, location, preferences });
    
                setUsername(user.username);
                setOriginalUser(user.username);
                setEmail(user.email);
                setFname(user.first_name);
                setLname(user.last_name);
                setPhone(phone);
                setLocation(location);
                setAP(preferences);
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
                "first_name": fname===""?fname:userData.first_name,
                "last_name": lname===""?lname:userData.last_name,
                "email": email===""?email:userData.email,
            },
            "phone":phone===""?phone:prefilledData.phone,
            "location":location===""?location:prefilledData.location,
            "preferences": additional_preferences===""?additional_preferences:prefilledData.preferences
        }
        if (username === originalUser){
            payload = {
                "user": {
                    "first_name": fname===""?fname:userData.first_name,
                    "last_name": lname===""?lname:userData.last_name,
                    "email": email===""?email:userData.email,
                },
                "phone":phone===""?phone:prefilledData.phone,
                "location":location===""?location:prefilledData.location,
                "preferences": additional_preferences===""?additional_preferences:prefilledData.preferences
            }
        }
        
 
        console.log(payload);
        axios.patch('http://127.0.0.1:8000/api/user/', payload, config)
        .then(response => {
            setFormerror(false);

        })
        .catch(error => {
            setFormerror(true);
            setRequestMessage(error.response.data)
            console.log(error.response.data)
        });
    }

    return(
        <>
        <SeekerNavComponent />
        <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="border bg-white shadow box-area row">
            <div className="title w-100">Update Your Profile</div>
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
                <div className="row">
                <div className="mb-3 col-6 pr-0">
                <label htmlFor="firstName" className="form-label">
                    First Name
                </label>
                <input
                    type="text"
                    className={fnError?"form-control error-label":"form-control"}
                    id="firstName"
                    name="fname"
                    value={userData.first_name}
                    onChange={event =>{
                        setUserData({ ...userData, first_name: event.target.value });
                        validateFname(event.target.value);}} 
                    onClick={event =>validateFname(event.target.value)} 
                />
                </div>
                <div className="mb-3 col-6">
                <label htmlFor="lastName" className="form-label">
                    Last Name
                </label>
                <input
                    type="text"
                    className={lnError?"form-control error-label":"form-control"}
                    id="lastName"
                    name="lname"
                    value={userData.last_name}
                    onChange={event =>{
                        setUserData({ ...userData, last_name: event.target.value });
                        validateLname(event.target.value);} }
                    onClick={event =>validateLname(event.target.value)} 
                />
                </div>
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
                Additional Preferences
                </label>
                <textarea
                className="form-control preferences"
                onChange={(event)=>{
                    setPrefilledData({ ...prefilledData, preferences: event.target.value });
                    setAP(event.target.value);}} 
                onClick={(event)=>setAP(event.target.value)} 
                id="exampleFormControlTextarea1"
                value={prefilledData.preferences}
                rows="2"
                ></textarea>
            </div>
            </div>
            <div className="input-group mb-3">
            <label htmlFor="inputGroupFile01" className="w-100 mb-2">
                Change Profile Picture
            </label>
            <input
                type="file"
                className="form-control"
                id="inputGroupFile01"
            />
            </div>
            <div className="input-group mb-3">
            <Link
                type="submit"
                className="btn btn-primary w-100 fs-6"
                onClick={()=>validateForm()}
                to={"/search-page"}
                >
                Update
            </Link>
            </div>
        </div>
        </div>
        </>    
    )
}
export default SeekerUpdate;