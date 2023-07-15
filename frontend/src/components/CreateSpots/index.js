import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { createSpot } from "../../store/spots"; 
import './CreateSpotForm.css';

function CreateSpotForm() {
  const dispatch = useDispatch();
  const history = useHistory();

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrls, setImageUrls] = useState(["", "", "", "", ""]);
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const spot = {
        images: imageUrls.filter(url => url !== ""),
      };

   const validationErrors =[];

    if (!address || !city || !state || !country || !name || !description || !price) {
      if(!address){
        validationErrors.push('Address field must not be empty')
      }
      setErrors(validationErrors);
      return;
    }

    if (description.length < 30) {
      setErrors(prevErrors => [...prevErrors, "Description needs 30 or more characters"]);
      return;
    }
 // Check if at least one image URL is provided and it contains at least two characters
 const validImageUrls = imageUrls.filter(url => url.length >= 2);
 if (validImageUrls.length === 0) {
   setErrors(prevErrors => [...prevErrors, "At least one image URL must be provided"]);
   return;
 }

    
    const newSpot = await dispatch(createSpot({
      address,
      city,
      state,
      country,
      lat:+lat,
      lng:+lng,
      name,
      description,
      price,
      images: imageUrls.filter(url => url !== "")
    }));

    if (newSpot) {
      history.push(`/spots/${newSpot.id}`);
    } else {
      setErrors(prevErrors => [...prevErrors, "An error occurred while creating the spot"]);
    }
  };

  return (
    <form className="CreateSpotForm" onSubmit={handleSubmit}>
      <h1>Create a New Spot</h1>

      {/* Display validation errors */}
      {errors.map((error, idx) => <p key={idx}>{error}</p>)}

      <section>
        <h2>Where's your place located?</h2>
        <p>Guests will only get your exact address once they booked a reservation.</p>
        <div>
          <label>Country:</label>
          <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country" />
        </div>
        <div>
          <label>Street Address:</label>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street Address" />
        </div>
        <div>
          <label>City:</label>
          <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" />
        </div>
        <div>
          <label>State:</label>
          <input type="text" value={state} onChange={(e) => setState(e.target.value)} placeholder="State" />
        </div>
      </section>

      <section>
        <h2>Describe your place to guests</h2>
        <p>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</p>
        <div>
          <label>Description:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Please write at least 30 characters" />
        </div>
      </section>

      <section>
        <h2>Create a title for your spot</h2>
        <p>Catch guests' attention with a spot title that highlights what makes your place special.</p>
        <div>
          <label>Name of your spot:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name of your spot" />
        </div>
      </section>

      <section>
        <h2>Set a base price for your spot</h2>
        <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
        <div>
          <label>Price per night (USD):</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price per night (USD)" />
        </div>
      </section>

      <section>
        <h2>Liven up your spot with photos</h2>
        <p>Submit a link to at least one photo to publish your spot.</p>
        {imageUrls.map((url, index) => (
          <div key={index}>
            <label>Image URL {index + 1}:</label>
            <input
              type="text"
              value={url}
              onChange={(e) => {
                const newUrls = [...imageUrls];
                newUrls[index] = e.target.value;
                setImageUrls(newUrls);
              }}
              placeholder={index === 0 ? "Preview Image URL" : "Image URL"}
            />
          </div>
        ))}
      </section>

      <button type="submit">Create Spot</button>
    </form>
  );
}

export default CreateSpotForm;
