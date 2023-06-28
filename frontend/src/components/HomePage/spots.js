import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpots } from '../../store/spots';

function Spots() {
  const dispatch = useDispatch();

  // Fetch spots when the component mounts
  useEffect(() => {
    dispatch(fetchSpots());
  }, [dispatch]);

  // Get spots from the Redux store
  const spots = useSelector(state => state.homePage.Spots);
console.log(`frontend console log here :::::::: ${spots}`)
  // Render a loading message if spots are not yet fetched
  if (!spots) {
    return (
      <div>Loading...</div>
    );
  }

  // Render the spots
  return (
    <div>
      {spots.map(spot => (
        <div key={spot.id}>
          <h2>{spot.name}</h2>
          <p>{spot.description}</p>
          {/* Render other spot data here */}
        </div>
      ))}
    </div>
  );
}

export default Spots;