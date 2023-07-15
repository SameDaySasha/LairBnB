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
    <>
      <h1 className="ManageSpotsHeading">Manage Spots</h1>
      <div className="spotTileWireFrameContainer">
        {Object.values(spots).map(spot => (
          <div className="spotTileWireFrame" title={spot.name} key={spot.id}>
            <NavLink to={`/spots/${spot.id}`}>
              <img className="previewImage" src={spot.previewImage} alt="" />
              <div className='spotDetailContainer'>
  <div className="spotTitleAndRating">
    <p>{spot.city}, {spot.state}</p>
    <p>★ {spot.avgRating.toFixed(2) || 'New!'}</p>
  
  </div>
   <p className="spotPrice">${spot.price} per night</p>
</div>
            </NavLink>
            <div className="button-container">
              <button className="update-button" onClick={() => handleUpdateClick(spot.id)}>Update</button>
              <button className="delete-button" onClick={() => handleDeleteClick(spot.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default ManageSpots;
