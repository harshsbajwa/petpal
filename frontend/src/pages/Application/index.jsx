import React, { useEffect, useState, useContext, setState } from 'react';
import axios from 'axios';
import { useParams, useHistory, Link, useLocation } from 'react-router-dom';
import { TokenContext } from '../../context/TokenContext';
import './styles.css';
import { ajax } from '../../ajax';
import { IsShelterContext } from '../../context/IsShelterContext';

const Application = () => {
    const [post, setPost] = useState(null);
    const [error, setError] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const {isShelter, setIsShelter} = useContext(IsShelterContext);

    const { params } = useParams();
    const queryParams = new URLSearchParams(params);

    const applicationID = queryParams.get('application');
    const shelterID = queryParams.get('shelter');
    const seekerID = queryParams.get('seeker');
    const petID = queryParams.get('pet');

    const [formData, setFormData] = useState({
        firstName: null,
        lastName: null,
        email: null,
        phoneNumber: null,
        address1: null,
        address2: null,
        city: null,
        province: null,
        postalCode: null,
        isAdult: null,
        isEmployed: null,
        houseType: null,
        adtlInfo: null
    });

    const [emailError, setEmailError] = useState(null);
    const [phoneNumberError, setPhoneNumberError] = useState(null);
    const [provinceError, setProvinceError] = useState(null);
    const [postalCodeError, setPostalCodeError] = useState(null);

    const [newStatus, setNewStatus] = useState(null);
    const [applicationDenied, setApplicationDenied] = useState(false);

    const {token, setToken} = useContext(TokenContext);

    console.log("44: " + token);

    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        const getApplication = async () => {
            try {
                const response = await axios({
                    method: "GET",
                    url: `http://localhost:8000/api/application/${applicationID}/`,
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                setPost(response.data);
                setFormData(response.data.form);
                setIsSubmitted(true);
            } catch (error) {
                console.log(error);
            }
        };
        getApplication();
    }, [token, applicationID]);
    
    const validateEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setEmailError('Invalid email address');
        }
        else {
            setEmailError(null);
        }
    };

    const validatePhoneNumber = () => {
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(formData.phoneNumber)) {
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
        if (!validProvinceCodes.has(formData.province)) {
            setProvinceError('Invalid province code');
        }
        else {
            setProvinceError('');
        }
    };

    const validatePostalCode = () => {
        const postalCodeRegex = /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/;
        if (!postalCodeRegex.test(formData.postalCode)) {
            setPostalCodeError('Invalid postal code');
        }
        else {
            setPostalCodeError('');
        }
    };

    const handleFirstNameChange = (e) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            firstName: e.target.value,
        }));
    };

    const handleLastNameChange = (e) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            lastName: e.target.value,
        }));
    };

    const handleEmailChange = (e) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            email: e.target.value,
        }));
        setEmailError('');
    };

    const handlePhoneChange = (e) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            phoneNumber: e.target.value,
        }));
        setPhoneNumberError('');
    };

    const handleAddress1Change = (e) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            address1: e.target.value,
        }));
    };

    const handleAddress2Change = (e) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            address2: e.target.value,
        }));
    };

    const handleCityChange = (e) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            city: e.target.value,
        }));
    };

    const handleProvinceChange = (e) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            province: e.target.value,
        }));
        setProvinceError('');
    };

    const handlePostalCodeChange = (e) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            postalCode: e.target.value,
        }));
        setPostalCodeError('');
    };
    
    const handleIsAdultChange = (e) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            isAdult: e.target.value,
        }));
    };

    const handleIsEmployedChange = (e) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            isEmployed: e.target.value,
        }));
    };

    const handleHouseTypeChange = (e) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            houseType: e.target.value,
        }));
    };

    const handleAdtlInfoChange = (e) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            adtlInfo: e.target.value,
        }));
    };

    const handleStatusChange = (e) => {
        setNewStatus(e.target.value);
    };

    const handleUpdateStatus = async () => {
        try {
            const response = await axios.patch(
                `http://localhost:8000/api/application/${applicationID}/`,
                { newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmit = async (e) => {
        
        e.preventDefault();

        validateEmail();
        validatePhoneNumber();
        validatePostalCode();
        validateProvince();
        
        if (!emailError && !phoneNumberError && !postalCodeError && !provinceError) {
            
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
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                }
            )
            .then(response => {
                console.log(response.data);
                setIsSubmitted(true);
            });
        }
    };

    return (
        <div class="container mt-5">
            <div class="form-container">
                <form class="form-group" onSubmit={handleSubmit}>
                    <fieldset disabled={isSubmitted || applicationDenied}>
                    <h1> Pet Adoption Form </h1>
                    <div class="form-row">
                        <div class="form-group col-md-6 col-12">
                        <label for="" class="form-label">First Name</label>
                        <input type="text" class="form-control" value={formData.firstName} onChange={handleFirstNameChange} required />
                        </div>
                        <div class="form-group col-md-6 col-12">
                        <label for="" class="form-label">Last Name</label>
                        <input type="text" class="form-control" id="inputEmail4" value={formData.lastName} onChange={handleLastNameChange} required />
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group col-md-6 col-12">
                        <label for="" class="form-label">Email</label>
                        <input type="email" class="form-control" value={formData.email} onChange={handleEmailChange} required />
                        </div>
                        <div class="form-group col-md-6 col-12">
                        <label for="inputPassword4" class="form-label">Phone Number</label>
                        <input type="text" class="form-control" value={formData.phoneNumber} onChange={handlePhoneChange} required />
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group col-12">
                        <label for="inputAddress" class="form-label">Address</label>
                        <input type="text" class="form-control" id="inputAddress" value={formData.address1} onChange={handleAddress1Change} required/>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group col-12">
                        <label for="inputAddress2" class="form-label">Address 2</label>
                        <input type="text" class="form-control" id="inputAddress2" value={formData.address2} onChange={handleAddress2Change}/>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group col-md-6 col-12">
                        <label for="inputCity" class="form-label">City</label>
                        <input type="text" class="form-control" id="inputCity" value={formData.city} onChange={handleCityChange} required/>
                        </div>
                        <div class="form-group col-md-4 col-12">
                        <label for="inputState" class="form-label">Province</label>
                        <select id="inputState" class="form-select" value={formData.province || 'Select...'} onChange={handleProvinceChange} required>
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
                        <input type="text" class="form-control" id="inputPostalCode" value={formData.postalCode} onChange={handlePostalCodeChange} required />
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group col-12">
                        <div class="form-check mb-1 mt-1">
                            <input class="form-check-input" type="checkbox" id="gridCheck" checked={formData.isAdult} onChange={handleIsAdultChange} required />
                            <label class="form-check-label check" for="gridCheck"> 
                            I am over 18 years of age
                            </label>
                        </div>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group col-md-6 col-12">
                        <label for="inputState" class="form-label">Employment Status</label>
                        <select id="inputState" class="form-select" defaultValue={formData.isEmployed || 'Unemployed'} onChange={handleIsEmployedChange} required>
                            <option>Unemployed</option>
                            <option>Employed</option>
                        </select>
                        </div>
                        <div class="form-group col-md-6 col-12 mt-2">
                        <label for="inputTypeHome">What type of home do you live in?</label>
                        <input type="text" class="form-control" id="inputTypeHome" value={formData.houseType} onChange={handleHouseTypeChange} required />
                        </div>
                    </div>
                    <div class="form-group col-12 mt-1">
                        <label for="inputAddress" class="form-label">Additional Info:</label>
                        <input type="text" class="form-control" value={formData.adtlInfo} onChange={handleAdtlInfoChange} required />
                    </div>

                    <div className="form-row">
                        <div className="form-group col-12">
                            <button type="submit" className="btn btn-primary mt-3 col-12">
                                Submit
                            </button>
                        </div>
                    </div>

                    </fieldset>
                </form>

                <div className="form-row">
                        {!applicationDenied && isSubmitted && (
                            <div className="form-group col-12 mt-2">
                                <label htmlFor="inputStatus" className="form-label">Update Status:</label>
                                <select
                                    id="inputStatus"
                                    className="form-select"
                                    value={newStatus}
                                    onChange={handleStatusChange}
                                >
                                    <option value="">Select Status</option>
                                    {!isShelter && (
                                        <>
                                            <option value="withdrawn">Withdrawn</option>
                                        </>
                                    )}
                                    {isShelter && (
                                        <>
                                            <option value="accepted">Accepted</option>
                                            <option value="denied">Denied</option>
                                        </>
                                    )}
                                </select>
                                <button
                                    type="button"
                                    className="btn btn-secondary mt-2"
                                    onClick={handleUpdateStatus}
                                    disabled={!newStatus}
                                >
                                    Update Status
                                </button>
                            </div>
                        )}
                        {applicationDenied && (
                            <h1>Your application was denied.</h1>
                        )}
                    </div>

                <div className="form-group col-12">
                    <Link to="/applications">
                        <button className="btn btn-primary mt-3 col-12">View All Applications</button>
                    </Link>
                </div>

            </div>
        </div>
    )
}

export default Application;