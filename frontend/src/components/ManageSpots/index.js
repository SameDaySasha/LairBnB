import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useHistory } from 'react-router-dom';
import { fetchUserSpots, deleteSpot } from '../../store/spots';
import { useModal } from '../../context/Modal';
import ConfirmDeleteModal from '../ConfirmDeleteModal/index';
import './ManageSpots.css';

function ManageSpots() {
  const dispatch = useDispatch();
  const spots = useSelector(state => state.spots.userSpots || {});
  const { setModalContent } = useModal();
  const history = useHistory();
  const currentUser = useSelector(state => state.session.user); // get current user data

  const handleDeleteClick = id => {
    setModalContent(
      <ConfirmDeleteModal 
        onConfirm={async () => {
          await dispatch(deleteSpot(id));
          await dispatch(fetchUserSpots());
          setModalContent(null);
        }} 
      />
    );
  };

  useEffect(() => {
    // Only fetch spots if the user has spots
    if (currentUser.hasSpots) {
      dispatch(fetchUserSpots());
    }
  }, [dispatch, currentUser]);

  const handleUpdateClick = id => {
    history.push(`/spots/update/${id}`);
  };

  return (
    <div className="spotTileWireFrameContainer">
      <h1 className="ManageSpotsHeading">Manage Spots</h1>
      {Object.values(spots).length > 0 ? Object.values(spots).map(spot => (
        <div className="spotTileWireFrame" title={spot.name} key={spot.id}>
          <NavLink to={`/spots/${spot.id}`}>
            <img className="previewImage" src={spot.previewImage} alt="" />
            <p>{spot.city}, {spot.state}</p>
            <p>${spot.price} night</p>
            <p>★ {spot.avgRating || 'New!'}</p>
          </NavLink>
          <button onClick={() => handleUpdateClick(spot.id)}>Update</button>
          <button onClick={() => handleDeleteClick(spot.id)}>Delete</button>
        </div>
      )) : (
        <button className="newSpotButton">
        <NavLink to="/create-spot">Create a New Spot</NavLink>
      </button>
      )}
    </div>
  );
}

export default ManageSpots;
