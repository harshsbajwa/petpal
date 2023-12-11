import styles from './landing-styles.css'; // Import CSS module
import React, { useContext, useEffect } from 'react';
import { useState } from "react";
import axios from 'axios';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { TokenContext } from '../../context/TokenContext';
import { IsShelterContext } from '../../context/IsShelterContext';

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const {token, setToken} = useContext(TokenContext);
    const {isShelter, setIsShelter} = useContext(IsShelterContext);
    const navigate = useNavigate()

    const trylogin = () => {
        const payload = {username: username, password: password}
        axios.post('http://127.0.0.1:8000/api/token/', payload)
        .then(response => {
            setError(false);
            setToken(response.data.access);
            
        })
        .catch(error => {
            setError(true);
          });
    }

    const getUserType = () => {
        const config = {
            headers: { Authorization: `Bearer ${token}` }
            };
        if (token != null){
            axios.get('http://127.0.0.1:8000/api/seeker/dashboard/', config)
            .then(response => {
                setIsShelter(false);
                console.log("random");
            })
            .catch(error => {
                setIsShelter(true);
                return;
                })
        } 
    }

    useEffect(() => {
        getUserType();
    }, [token])
   
    useEffect(() => {
        console.log("this is the token for login " + token);
        console.log("isShelter is " + isShelter);
        if (isShelter === false) {navigate("/search-page")}
        else if (isShelter == true){
            navigate("/shelter-detail");
        };
    }, [isShelter])
    
    return(
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <div className="border bg-white shadow landing-box-area">
            <div className="title">PetPal</div>
            <div className="mb-4 subtitle">Welcome back!</div>
            <div className="mb-3">
                <label htmlFor="emailInput" className="form-label">Username</label>
                <input type="email" className={error?"form-control error-label": "form-control"} id="emailInput" name="email" required onChange={event=>setUsername(event.target.value)} />
            </div>
            <div className="mb-4">
                <label htmlFor="passwordInput" className="form-label">Password</label>
                <input type="password" className={error?"form-control error-label": "form-control"} id="passwordInput" name="password" required onChange={event=>setPassword(event.target.value)}/>
            </div>
            <div className="input-group mb-3">
                <button className="btn btn-primary w-100 fs-6" onClick={()=>trylogin()}>
                    Login
                </button>
            </div>
            {error ? <p className='redlink'>Username/Password not found</p> : <></>}
            <small>Don't have an account?  
                <Link to="/seeker-register" className="redlink"> Sign Up</Link>
            </small>
            </div>
        </div>
      );
    }

export default Login;