import { useContext, useState } from 'react';
import styles from './create-user-styles.css'; // Import CSS module
import axios from 'axios';
import { Link } from 'react-router-dom';
import { TokenContext } from '../../context/TokenContext';


const UserRegister = () => {

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

    const validateForm = event =>{
        validateUsername(username);
        validateFname(fname);
        validateLname(lname);
        validateEmail(email);
        validatePassword1(password1);
        validatePassword2(password2);
        validatePhone(phone);
        if (usernameError || fnError || lnError || emailError || p1Error || p2Error || phoneError) {
            setFormerror(true); 
        }
        else{
            setFormerror(false);
            const payload = {
                "username": username,
                "first_name": fname,
                "last_name": lname,
                "email": email,
                "password":password1,
                "password2":password2,
                "phone":phone,
                "location":location,
                "preferences": additional_preferences
            }

            axios.post('http://127.0.0.1:8000/api/seeker/', payload)
            .then(response => {
                setFormerror(false);
            })
            .catch(error => {
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
            <div className="subtitle">
            Are you a shelter looking to put up pets for adoption?{' '}
            <Link to="/shelter-register" className="redlink">Create An Account For Your Shelter</Link>
            </div>
            <div className="mb-4 subtitle w-100">
            Looking to adopt a pet? Create a user below:
            </div>
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
                    autoComplete="given-name"
                    onChange={event =>validateFname(event.target.value)} 
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
                    autoComplete="family-name"
                    onChange={event =>validateLname(event.target.value)} 
                    onClick={event =>validateLname(event.target.value)} 
                />
                </div>
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
                Additional Preferences
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
            <div className="input-group mb-3">
            <label htmlFor="inputGroupFile01" className="w-100 mb-2">
                Upload a Profile Picture (Optional)
            </label>
            <input
                type="file"
                className="form-control"
                id="inputGroupFile01"
            />
            </div>
            <div className="input-group mb-3">
            <button
                type="submit"
                className="btn btn-primary w-100 fs-6"
                onClick={()=>validateForm()}
                >
                Sign Up
            </button>
            {formError?<ul>{Object.keys(requestMessage).map(message=><li key={message}>{message}: {requestMessage[message]}</li>)}</ul>:<></>}
            </div>
            <small>Already have an account? <Link to='/' className="redlink">Log In</Link></small>
        </div>
        </div>        
    )
}


export default UserRegister;