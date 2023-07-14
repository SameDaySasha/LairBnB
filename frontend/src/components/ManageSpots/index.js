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
    dispatch(fetchUserSpots());
  }, [dispatch]);

  const handleUpdateClick = id => {
    history.push(`/spots/update/${id}`);
  };

  return (
    <div className="spotTileWireFrameContainer">
      <h1 className="ManageSpotsHeading">Manage Spots</h1>
      {Object.values(spots).map(spot => (
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
      ))}
    </div>
  );
}

export default ManageSpots;
