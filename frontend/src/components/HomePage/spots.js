// Import required modules and components
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom/cjs/react-router-dom.min';
import { fetchSpots } from '../../store/spots';

// Define the Spots component
function Spots() {
  // Get the dispatch function from the Redux store
  const dispatch = useDispatch();

  // Fetch spots when the component mounts or when the dispatch function changes
  useEffect(() => {
    dispatch(fetchSpots());
  }, [dispatch]);

  // Get the spots data from the Redux store
  const spots = useSelector(state => state.homePage.Spots);

  // Check if spots data is not available yet
  if (!spots) {
    // Show a loading message if spots are not yet available
    return (
      <div>Loading...</div>
    );
  }

  // Define a function to calculate the average rating of a spot
  const avgRating = (spot) => {
    if (spot.avgRating) {
      // Return the average rating if it exists
      return spot.avgRating.toFixed(2);
    } else {
      // Return "New!" if no average rating is available
      return "New!";
    }
  }

  // Render the spots data
  return (
    <div className='spotTileWireFrameContainer'>
      {/* Iterate over each spot and create a tile */}
      {spots.map(spot => (
        // Define a tile for each spot, with a unique key and name as a tooltip
        <div className='spotTileWireFrame' title={spot.name} key={spot.id}>
          {/* Link to the spot details page */}
          <NavLink to={`/spots/${spot.id}`}>
            {/* Display the spot's preview image */}
            <img className='previewImage' src={spot.previewImage}></img>
            {/* Display the spot's city and state */}
            <div className='spotDetailContainer'>
  <div className="spotTitleAndRating">
    <p>{spot.city}, {spot.state}</p>
    <p>★ {avgRating(spot)}</p>
   <p className="spotPrice">${spot.price} per night</p>
  </div>
</div>

          </NavLink>
        </div>
      ))}
    </div>
  );
}

// Export the Spots component as the default export
export default Spots;
