import { useContext, useEffect, useState } from "react";
import { TokenContext } from '../../context/TokenContext';
import axios from "axios";
import ShelterCard from "./ShelterCard";

const ListShelter = () => {
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

                const response = await fetch(`http://127.0.0.1:8000/api/shelters/?page=${page}`, config);
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
        <div className="container mt-3">
            <div className="row justify-content-center text-center">
                <h1>Shelters</h1>
                {response.map((shelter, index) => (<div key={index} className="col-md-4 mb-3"><ShelterCard shelter={shelter}/> </div>)) }
                <div class="text-center mt-4">
                { page > 1 
                    ? <button class="btn btn-primary m-2" onClick={()=>{setPage(page - 1)}} >Previous Page</button>
                    : <></> }
                    { page < totalPages
                    ? <button class="btn btn-primary m-2" onClick={()=>{setPage(page + 1)}} >Next Page</button>
                    : <></> }
                    <p>Page {page} out of {totalPages}.</p>
                    
                    
                </div>
            </div>
        </div>
        </>
    )
}

export default ListShelter;