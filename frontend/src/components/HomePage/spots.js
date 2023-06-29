import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom/cjs/react-router-dom.min';
import { fetchSpots } from '../../store/spots';

function Spots() {
  const dispatch = useDispatch();
  // Fetch spots when the component mounts
  useEffect(() => {
    dispatch(fetchSpots());
  }, [dispatch]);

  // Get spots from the Redux store
  const spots = useSelector(state => state.homePage.Spots);
  // Render a loading message if spots are not yet fetched
  if (!spots) {
    return (
      <div>Loading...</div>
    );
  }
  const avgRating = (spot) => {
    if (spot.avgRating) {return spot.avgRating } else {return "New!"}
  }
 
  // Render the spots
  return (
    <div className='spotTileWireFrameContainer'>
      {spots.map(spot => (
        <NavLink to={`/spots/${spot.id}`}className='spotTileWireFrame' key={spot.id}>
          <img className='previewImage' src={spot.previewImage}></img>
          <p>{spot.city},{spot.state}</p>
          <p>${spot.price} night</p>
          <p>★ {avgRating(spot)}</p>
          {/* Render other spot data here */}
        </NavLink>
      ))}
    </div>
  );
}

export default Spots;