import { useContext, useEffect, useState } from "react";
import { TokenContext } from "../../context/TokenContext";

const NotifDropdownComponent = () => {
    const {token, setToken} = useContext(TokenContext);
    const [response, setResponse] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

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

    // return (
    //     <ul className="dropdown-menu">
    //         <li className="dropdown-item">Notification 1</li>
    //         <li className="dropdown-item">Notification 2</li>
    //         <li className="dropdown-item">Notification 3</li>
    //     </ul>
    // )

    return(
        <>
        <ul className="dropdown-menu">
        {response.map((notification, index) => (<li key={index} className="dropdown-item">{notification.message}</li>)) }
        <div>{ page > 1 
            ? <button class="btn btn-primary m-2" onClick={()=>{setPage(page - 1)}} >{"<"}</button>
            : <></> }
            { page < totalPages
            ? <button class="btn btn-primary m-2 " onClick={()=>{setPage(page + 1)}} >{">"}</button>
            : <></> }
            <p>Page {page} out of {totalPages}.</p>
        </div>
        </ul> 
                
        </>
    )
    
}

export default NotifDropdownComponent;