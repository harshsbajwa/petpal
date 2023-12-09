import { Link } from "react-router-dom";
import NotifDropdownComponent from "../NotifDropdownComponent";

const SeekerNavComponent = () => {
    return (
        <>
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
                        <NotifDropdownComponent />
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
        </>
    )
    
}
export default SeekerNavComponent;