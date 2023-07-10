import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { createSpot } from "../../store/spots"; // Import your createSpot thunk action
import './CreateSpotForm.css';

function CreateSpotForm() {
  // Use the useDispatch hook to get the dispatch function
  const dispatch = useDispatch();

  // Use the useHistory hook to get the history object
  const history = useHistory();

  // Initialize your state variables using the useState hook
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrls, setImageUrls] = useState(["", "", "", "", ""]); // For the image URLs
  const [errors, setErrors] = useState([]); // For validation errors

  // Create a handleSubmit function that will be called when the form is submitted
  const handleSubmit = async (e) => {
    e.preventDefault();
    const spot = {
        // Other properties...
        images: imageUrls.filter(url => url !== ""), // Only include URLs that are not empty
      };
      
    // Clear previous errors
    setErrors([]);

    // Perform form validation here...
    // If any field is empty, add an error to the errors array
    if (!address || !city || !state || !country || !name || !description || !price) {
      setErrors(prevErrors => [...prevErrors, "All fields are required"]);
      return;
    }

    // If the description is less than 30 characters, add an error to the errors array
    if (description.length < 30) {
      setErrors(prevErrors => [...prevErrors, "Description needs 30 or more characters"]);
      return;
    }

    // Dispatch the createSpot action with the form data
    const newSpot = await dispatch(createSpot({
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
      images: imageUrls,
    }));

    if (newSpot) {
      // If the spot was successfully created, redirect to its detail page
      history.push(`/spots/${newSpot.id}`);
    } else {
      // If there was an error, add it to the errors array
      setErrors(prevErrors => [...prevErrors, "An error occurred while creating the spot"]);
    }
  };

  // In your component's return statement, create the form with the necessary inputs and labels
  return (
    <form onSubmit={handleSubmit}>
      <h1>Create a New Spot</h1>
  
      {/* Display validation errors */}
      {errors.map((error, idx) => <p key={idx}>{error}</p>)}
  
      <label>
        Address:
        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
      </label>
  
      <label>
        City:
        <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />
      </label>
  
      <label>
        State:
        <input type="text" value={state} onChange={(e) => setState(e.target.value)} />
      </label>
  
      <label>
        Country:
        <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} />
      </label>
  
      <label>
        Name of your spot:
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </label>
  
      <label>
        Description:
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </label>
  
      <label>
        Price per night (USD):
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
      </label>
  
      <label>
        Preview Image URL:
        <input type="text" value={imageUrls[0]} onChange={(e) => setImageUrls([e.target.value, ...imageUrls.slice(1)])} />
      </label>
  
      {/* Repeat for other image URL inputs... */}
  
      <button type="submit">Create Spot</button>
    </form>
  );
  
}

export default CreateSpotForm;
