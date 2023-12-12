import { Link, useNavigate } from "react-router-dom";
import NotifDropdownComponent from "../NotifDropdownComponent";
import Search from '../../pages/Search/index';
import { TokenContext } from "../../context/TokenContext";
import { IsShelterContext } from "../../context/IsShelterContext";
import { useContext, useEffect, useState } from "react";
import axios from "axios";

const ShelterNavComponent = () => {
    const {token, setToken} = useContext(TokenContext);
    const [username, setUsername] = useState("No User");
    const {isShelter, setIsShelter} = useContext(IsShelterContext);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!token) return;
    
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };
    
                const response = await axios.patch('http://127.0.0.1:8000/api/user/', "{}", config);
                const { user, phone, location, preferences } = response.data;
    
                setUsername(user.username);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
    
        fetchData();
    }, [token]);

    
    return (
        <>
            <div className="header">
                {/* Your Navbar */}
                <nav className="navbar navbar-expand-lg">
                    <div className="container-fluid nav-container">
                    <Link to={"/search-page"} className="navbar-brand">PetPal</Link>
                    <button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#nav">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="nav">
                        <ul className="navbar-nav">
                        <li className="nav-item">
                        <Link to={"/search-page"} className="nav-link active">Home</Link>
                        </li>
                        <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#">Notifications</a>
                        <NotifDropdownComponent />
                        </li>
                        <li className="nav-item">
                        <Link to="/shelter/mypets/" className='nav-link'>My Pets</Link>
                        </li>
                        </ul>
                        <div className="dropdown profile-box">
                        <button type="button" className="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown">
                            Profile
                        </button>
                        <ul className="dropdown-menu dropdown-menu-lg-end">
                            <li className="profile-name">{username}</li>
                            <li className="profile-type">{isShelter === true?"Shelter":"Seeker"}</li>
                            <Link className="dropdown-item profile-edit sign-out" onClick={()=>{setToken(""); window.location.reload();}} >Sign Out</Link>
                        </ul>
                        </div>
                    </div>
                    
                    </div>
                </nav>
            </div>
        </>
    )
    
}
export default ShelterNavComponent;