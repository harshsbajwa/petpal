import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PetListingDetails = () => {
  const { pk } = useParams();
  const [petData, setPetData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPetData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/user/petlistings/${pk}/`);
        setPetData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching pet data:', error);
        setLoading(false);
      }
    };

    fetchPetData();
  }, [pk]);

  return (
    <div className="d-flex align-items-center">
        <div className="border bg-white shadow landing-box-area m-2 w-100">
      <h1>Pet Listing Details</h1>
      {loading ? (
        <p>Loading...</p>
      ) : petData ? (
        <div>
          <p>Name: {petData.name}</p>
          <p>About: {petData.about}</p>
          <p>Breed: {petData.breed}</p>
          <p>Age: {petData.age}</p>
          <p>Gender: {petData.gender}</p>
          <p>Size: {petData.size}</p>
          <p>Status: {petData.status}</p>
        </div>
      ) : (
        <p>No data found for this pet ID.</p>
      )}
        </div>
    </div>
  );
};

export default PetListingDetails;