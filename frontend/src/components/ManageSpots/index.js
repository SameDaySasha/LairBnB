import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { fetchUserSpots } from '../../store/spots';

function ManageSpots() {
  const dispatch = useDispatch();
  const spots = useSelector(state => Object.values(state.spots));
  console.log('ManageSpots spots', spots); // Add this line
  // const spots = useSelector(state => state.spots ? Object.values(state.spots) : []);

  useEffect(() => {
    dispatch(fetchUserSpots());
  }, [dispatch]);

  if (!spots.length) {
    return (
      <div>
        <h1>Manage Spots</h1>
        <p>No spots have been posted yet.</p>
        <NavLink to="/create-spot">Create a New Spot</NavLink>
      </div>
    );
  }

  return (
    <div>
      <h1>Manage Spots</h1>
      {spots.map(spot => (
        <div key={spot.id}>
          {/* Display spot details... */}
          <button>Update</button>
          <button>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default ManageSpots;
