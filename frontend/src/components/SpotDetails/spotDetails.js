import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getOneSpot } from "../../store/spots";

const SpotDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOneSpot(id));
  }, [dispatch, id]);

  const spot = useSelector((state) => state.homePage.spotDetails);

  if (!spot) {
    return <div className="loading">Loading...</div>;
  }

  const handleReserveClick = () => {
    alert("Feature coming soon");
  };

  return (
    <div className="spot-details">
      <h1 className="spot-name">{spot.name}</h1>
      <h4 className="spot-location">{spot.city}, {spot.state}, {spot.country}</h4>
      <div className="spot-images">
        {spot.SpotImages && spot.SpotImages.map((image, index) => (
          <img 
            key={image.id} 
            src={image.url} 
            alt="Spot" 
            className={index === 0 ? 'large-image' : 'small-image'}
          />
        ))}
      </div>
      <div className="bottom-section">
        <div className="spot-description">
          <h3 className="host-name">Hosted by {spot.Owner.firstName}, {spot.Owner.lastName}</h3>
          <p>{spot.description}</p>
        </div>
        <div className="sidebar">
          <div className="average-rating">{spot.averageRating}</div>
          <div className="night-price">${spot.price} / night</div>
          <button className="reserve-button" onClick={handleReserveClick}>Book now</button>
        </div>
      </div>
    </div>
  );
};

export default SpotDetails;
