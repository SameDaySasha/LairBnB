import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom/cjs/react-router-dom.min';
import { fetchSpots } from '../../store/spots';

function Spots() {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(fetchSpots());
  }, [dispatch]);

  const spots = useSelector(state => state.homePage.Spots);

  if (!spots) {
    return (
      <div>Loading...</div>
    );
  }

  const avgRating = (spot) => {
    if (spot.avgRating) {return spot.avgRating } else {return "New!"}
  }
 
  return (
    <div className='spotTileWireFrameContainer'>
      {spots.map(spot => (
        // 'title' attribute moved to the enclosing div
        <div className='spotTileWireFrame' title={spot.name} key={spot.id}> 
          <NavLink to={`/spots/${spot.id}`}>
            <img className='previewImage' src={spot.previewImage}></img>
            <p>{spot.city},{spot.state}</p>
            <p>${spot.price} night</p>
            <p>★ {avgRating(spot)}</p>
            {/* Render other spot data here */}
          </NavLink>
        </div>
      ))}
    </div>
  );
}

export default Spots;
