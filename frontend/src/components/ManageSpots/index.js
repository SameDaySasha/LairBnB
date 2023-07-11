import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { fetchUserSpots } from '../../store/spots';

function ManageSpots() {
  const dispatch = useDispatch();

  // Select userSpots from the state
  const spots = useSelector(state => state.spots.userSpots|| {});

  useEffect(() => {
    dispatch(fetchUserSpots());
  }, [dispatch]);

  // If there are no spots, render a message and a link to create a new spot

  // If there are spots, render them
  return (
    <div className='spotTileWireFrameContainer'>
      {Object.values(spots).map(spot => (
        <div className='spotTileWireFrame' title={spot.name} key={spot.id}>
          <NavLink to={`/spots/${spot.id}`}>
            <img className='previewImage' src={spot.previewImage}></img>
            <p>{spot.city}, {spot.state}</p>
            <p>${spot.price} night</p>
            <p>★ {spot.avgRating || "New!"}</p>
          </NavLink>
          <button>Update</button>
          <button>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default ManageSpots;
