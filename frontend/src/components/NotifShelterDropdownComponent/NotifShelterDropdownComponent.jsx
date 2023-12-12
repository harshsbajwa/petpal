import { useContext, useEffect, useState } from "react";
import { TokenContext } from "../../context/TokenContext";
import { useNavigate } from "react-router-dom";

const NotifShelterDropdownComponent = () => {
    const {token, setToken} = useContext(TokenContext);
    const [response, setResponse] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch data from the shelters API with the bearer token
        const fetchData = async () => {
            try {
                if (!token) return; // Do not make the request if token is not available

                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };

                const response = await fetch(`http://127.0.0.1:8000/notifications/?page=${page}`, config);
                const json = await response.json();
                setResponse(json.results); // Update state with shelters data
                setTotalPages(Math.ceil(json.count/2));
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData(); // Call the fetchData function
    }, [page, token]);

    return(
        <>
        <ul className="dropdown-menu">
        {response.map((notification, index) => (<li key={index} className={notification.is_read?"dropdown-item mb-1":"dropdown-item blue-text mb-1"}>{notification.message}</li>)) }
        <div className="notif-btn-div">{ page > 1 
            ? <button class="btn notif-btn" onClick={()=>{setPage(page - 1)}} >{"<"}</button>
            : <></> }
            { page < totalPages
            ? <button class="btn notif-btn " onClick={()=>{setPage(page + 1)}} >{">"}</button>
            : <></> }
            <button class="btn ml-2 " onClick={()=>{navigate('/notifications-shelter')}} >#</button>
        </div><div className="notif-btn-div">Page {page} out of {totalPages}.</div>
        </ul> 
                
        </>
    )
    
}

export default NotifShelterDropdownComponent;