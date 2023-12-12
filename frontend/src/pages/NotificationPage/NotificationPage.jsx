import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TokenContext } from "../../context/TokenContext";
import axios from "axios";

const NotificationPage = () =>{
    const {token, setToken} = useContext(TokenContext);
    const [response, setResponse] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();
    const [showRead, setShowRead] = useState(false);
    const [showUnread, setShowUnread] = useState(false);

    useEffect(() => {
        // Fetch data from the shelters API with the bearer token
        const fetchData = async () => {
            try {
                if (!token) return; // Do not make the request if token is not available

                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };

                let url = "";
                if (showRead === true){
                    url = `http://127.0.0.1:8000/notifications/read/?page=${page}`
                }
                else if (showUnread === true){
                    url =  `http://127.0.0.1:8000/notifications/unread/?page=${page}`
                }
                else {
                    url = `http://127.0.0.1:8000/notifications/?page=${page}`
                }

                const response = await fetch(url, config);
                const json = await response.json();
                setResponse(json.results); // Update state with shelters data
                setTotalPages(Math.ceil(json.count/2));
                if (page > totalPages){
                    setPage(1);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData(); // Call the fetchData function
    }, [page, token, showRead, showUnread]);

    const goToLink = (notification) =>{
        console.log(notification)
        if (notification.application != null){
            const fetchData = async () => {
                try {
                    if (!token) return; // Do not make the request if token is not available

                    const config = {
                        headers: { Authorization: `Bearer ${token}` }
                    };
                    const response = await axios.get(notification.application, config);
                    const response2 = await axios.patch(`http://127.0.0.1:8000/notifications/${notification.id}/`, {"is_read":"True"});
                    navigate(`/application/application=${response.data.id}&shelter=${response.data.shelter}&seeker=${response.data.pet_seeker}&pet=${response.data.pet_listing}`);

                }  
                catch (error){
                    console.error("Error fetching data:", error);
                } 
            }   
        fetchData();
        // else if (notification.comment != null){
        //     navigate(`/pet-listing/${notification.comment.}`)
        // }
        }
    }

    return(
        <>
        <div className="d-flex align-items-center">
            <div className="border bg-white shadow landing-box-area m-2 w-100">
                <h1>Notifications</h1>
                {response.map((notification, index) => (<li key={index} className={notification.is_read?"dropdown-item mb-1":"dropdown-item blue-text mb-1"} onClick={()=>{goToLink(notification)}}>{notification.message}</li>)) }
                <div className="mb-4">{ page > 1 
                    ? <button class="btn notif-btn" onClick={()=>{setPage(page - 1)}} >{"<"}</button>
                    : <></> }
                    { page < totalPages
                    ? <button class="btn notif-btn " onClick={()=>{setPage(page + 1)}} >{">"}</button>
                    : <></> }
                </div>
                <button class="btn notif-btn me-2" onClick={()=>{setShowRead(!showRead); setShowUnread(false)}}>Read</button>
                    <button class="btn notif-btn " onClick={()=>{setShowUnread(!showUnread); setShowRead(false)}}>Unread</button>
                <div className="">Page {page} out of {totalPages}.</div>            
            
            </div> 
        </div>
        
        </>
    )
}

export default NotificationPage;