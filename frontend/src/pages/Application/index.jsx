import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams, useHistory, Link, useLocation } from 'react-router-dom';
import { TokenContext } from '../../context/TokenContext';
import './styles.css';
import { ajax } from '../../ajax';

const Application = () => {
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [email, setEmail] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState(null);
    const [address1, setAddress1] = useState(null);
    const [address2, setAddress2] = useState(null);
    const [city, setCity] = useState(null);
    const [province, setProvince] = useState(null);
    const [postalCode, setPostalCode] = useState(null);
    const [isAdult, setIsAdult] = useState(null);
    const [isEmployed, setIsEmployed] = useState(null);
    const [houseType, setHouseType] = useState(null);
    const [adtlInfo, setAdtlInfo] = useState(null);

    const [emailError, setEmailError] = useState(null);
    const [phoneNumberError, setPhoneNumberError] = useState(null);
    const [provinceError, setProvinceError] = useState(null);
    const [postalCodeError, setPostalCodeError] = useState(null);

    const [post, setPost] = useState(null);
    const {token, setToken} = useContext(TokenContext);
    console.log("1st token: " + token);
    const [error, setError] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const { params } = useParams();
    const queryParams = new URLSearchParams(params);

    const applicationID = queryParams.get('application');
    const shelterID = queryParams.get('shelter');
    const seekerID = queryParams.get('seeker');
    const petID = queryParams.get('pet');

    const URL = `http://localhost:8000/api/application/${applicationID}/`;
    const accessToken = `Bearer ${token}`;

    useEffect(() => {
        axios.get(URL, { headers: {
            Authorization: accessToken,
            'Content-Type': 'application/json',
            }
        })
        .then((response) => {
            setPost(response.data);
            setFirstName(post.form.firstName);
            setLastName(post.form.lastName);
            setEmail(post.form.email);
            setPhoneNumber(post.form.phoneNumber);
            setAddress1(post.form.address1);
            setAddress2(post.form.address2);
            setCity(post.form.city);
            setProvince(post.form.province);
            setPostalCode(post.form.postalCode);
            setIsAdult(post.form.isAdult);
            setIsEmployed(post.form.isEmployed);
            setHouseType(post.form.houseType);
            setAdtlInfo(post.form.adtlInfo);
        })
    }, []);

    
    const validateEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError('Invalid email address');
        }
        else {
            setEmailError(null);
        }
    };

    const validatePhoneNumber = () => {
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phoneNumber)) {
            setPhoneNumberError('Invalid phone number');
        } 
        else {
            setPhoneNumberError('');
        }
    };

    const validateProvince = () => {
        const validProvinceCodes = new Set([
            'AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'
        ]);
        if (!validProvinceCodes.has(province)) {
            setProvinceError('Invalid province code');
        }
        else {
            setProvinceError('');
        }
    };

    const validatePostalCode = () => {
        const postalCodeRegex = /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/;
        if (!postalCodeRegex.test(postalCode)) {
            setPostalCodeError('Invalid postal code');
        }
        else {
            setPostalCodeError('');
        }
    };

    const handleFirstNameChange = (e) => {
        setFirstName(e.target.value);
    };

    const handleLastNameChange = (e) => {
        setLastName(e.target.value);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setEmailError('');
    };

    const handlePhoneChange = (e) => {
        setPhoneNumber(e.target.value);
        setPhoneNumberError('');
    };

    const handleAddress1Change = (e) => {
        setAddress1(e.target.value);
    };

    const handleAddress2Change = (e) => {
        setAddress2(e.target.value);
    };

    const handleCityChange = (e) => {
        setCity(e.target.value);
    };

    const handleProvinceChange = (e) => {
        setProvince(e.target.value);
        setProvinceError('');
    };

    const handlePostalCodeChange = (e) => {
        setPostalCode(e.target.value);
        setPostalCodeError('');
    };
    
    const handleIsAdultChange = (e) => {
        setIsAdult(e.target.value);
    };

    const handleIsEmployedChange = (e) => {
        setIsEmployed(e.target.value);
    };

    const handleHouseTypeChange = (e) => {
        setHouseType(e.target.value);
    };

    const handleAdtlInfoChange = (e) => {
        setAdtlInfo(e.target.value);
    };

    const handleSubmit = async (e) => {
        
        e.preventDefault();

        validateEmail();
        validatePhoneNumber();
        validatePostalCode();
        validateProvince();
        
        if (!emailError && !phoneNumberError && !postalCodeError && !provinceError) {

            const formData = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                phoneNumber: phoneNumber,
                address1: address1,
                address2: address2,
                city: city,
                province: province,
                postalCode: postalCode,
                isAdult: isAdult,
                isEmployed: isEmployed,
                houseType: houseType,
                adtlInfo: adtlInfo,
                isSubmitted: true
            };
            
            const jsondata = {
                "pet_seeker": seekerID,
                "pet_listing": petID,
                "shelter": shelterID,
                "form": formData,
                "status": "pending"
            };  

            const postURL = `http://localhost:8000/api/applications/`;
            axios.post(postURL,
                jsondata,
                {
                Authorization: accessToken,
                'Content-Type': 'application/json',
                }
            )
            .then(response => {
                console.log(response.data);
                setIsSubmitted(true);
            });
        }
    };

    const render = () => {
        <div class="container mt-5">
            <div class="form-container">
                <form class="form-group" onSubmit={handleSubmit}>
                    <fieldset disabled={isSubmitted}>
                    <h1> Pet Adoption Form </h1>
                    <div class="form-row">
                        <div class="form-group col-md-6 col-12">
                        <label for="" class="form-label">First Name</label>
                        <input type="text" class="form-control" value={firstName} onChange={handleFirstNameChange} required />
                        </div>
                        <div class="form-group col-md-6 col-12">
                        <label for="" class="form-label">Last Name</label>
                        <input type="text" class="form-control" id="inputEmail4" value={lastName} onChange={handleLastNameChange} required />
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group col-md-6 col-12">
                        <label for="" class="form-label">Email</label>
                        <input type="email" class="form-control" value={email} onChange={handleEmailChange} required />
                        </div>
                        <div class="form-group col-md-6 col-12">
                        <label for="inputPassword4" class="form-label">Phone Number</label>
                        <input type="text" class="form-control" value={phoneNumber} onChange={handlePhoneChange} required />
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group col-12">
                        <label for="inputAddress" class="form-label">Address</label>
                        <input type="text" class="form-control" id="inputAddress" value={address1} onChange={handleAddress1Change} required/>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group col-12">
                        <label for="inputAddress2" class="form-label">Address 2</label>
                        <input type="text" class="form-control" id="inputAddress2" value={address2} onChange={handleAddress2Change}/>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group col-md-6 col-12">
                        <label for="inputCity" class="form-label">City</label>
                        <input type="text" class="form-control" id="inputCity" value={city} onChange={handleCityChange} required/>
                        </div>
                        <div class="form-group col-md-4 col-12">
                        <label for="inputState" class="form-label">Province</label>
                        <select id="inputState" class="form-select" value={province || 'Select...'} onChange={handleProvinceChange} required>
                            <option>AB</option>
                            <option>BC</option>
                            <option>MB</option>
                            <option>NB</option>
                            <option>NL</option>
                            <option>NS</option>
                            <option>NT</option>
                            <option>NU</option>
                            <option>ON</option>
                            <option>PE</option>
                            <option>QC</option>
                            <option>SK</option>
                            <option>YT</option>
                        </select>
                        </div>
                        <div class="form-group col-md-2 col-12">
                        <label for="inputPostalCode" class="form-label">Postal Code</label>
                        <input type="text" class="form-control" id="inputPostalCode" value={postalCode} onChange={handlePostalCodeChange} required />
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group col-12">
                        <div class="form-check mb-1 mt-1">
                            <input class="form-check-input" type="checkbox" id="gridCheck" checked={isAdult} onChange={handleIsAdultChange} required />
                            <label class="form-check-label check" for="gridCheck"> 
                            I am over 18 years of age
                            </label>
                        </div>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group col-md-6 col-12">
                        <label for="inputState" class="form-label">Employment Status</label>
                        <select id="inputState" class="form-select" defaultValue={isEmployed || 'Unemployed'} onChange={handleIsEmployedChange} required>
                            <option>Unemployed</option>
                            <option>Employed</option>
                        </select>
                        </div>
                        <div class="form-group col-md-6 col-12 mt-2">
                        <label for="inputTypeHome">What type of home do you live in?</label>
                        <input type="text" class="form-control" id="inputTypeHome" value={houseType} onChange={handleHouseTypeChange} required />
                        </div>
                    </div>
                    <div class="form-group col-12 mt-1">
                        <label for="inputAddress" class="form-label">Additional Info:</label>
                        <input type="text" class="form-control" value={adtlInfo} onChange={handleAdtlInfoChange} required />
                    </div>

                    <div className="form-row">
                        <div className="form-group col-12">
                            <button type="submit" className="btn btn-primary mt-3">
                                Submit
                            </button>
                        </div>
                    </div>

                    </fieldset>
                </form>
            </div>
        </div>
    }
    return render();
}

export default Application;