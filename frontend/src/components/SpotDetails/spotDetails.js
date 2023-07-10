import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getOneSpot } from "../../store/spots";
import { fetchReviewsForSpot } from "../../store/reviews";
import './SpotDetails.css';

const SpotDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOneSpot(id));
    dispatch(fetchReviewsForSpot(id));
  }, [dispatch, id]);

  const spot = useSelector((state) => state.homePage.spotDetails);
  const reviews = useSelector((state) => state.reviews.reviews);
  const currentUser = useSelector((state) => state.session.user); // get current user data

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
          <div className="ratings-container">
            <div className="average-rating"> ★: {spot.avgStarRating ? spot.avgStarRating.toFixed(2) : "New!"}</div>
            <div className="dot">.</div>
            <div className="review-container">
              <div className="review-count">{spot.numReviews === 1 ? `${spot.numReviews} review` : `${spot.numReviews} reviews`}</div>
            </div>
          </div>
          <div className="night-price">${spot.price} / night</div>
          <button className="reserve-button" onClick={handleReserveClick}>Reserve</button>
        </div>
      </div>
      {(reviews && reviews.length > 0) ? reviews.map(review => (
        <div key={review.id} className="review">
          <h4 className="reviewer-name">{review.User.firstName}</h4>
          <p className="review-date">{new Date(review.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
          <p className="review-comment">{review.review}</p>
        </div>
      )) : (
        currentUser && currentUser.id !== spot.Owner.id && (
          <p>Be the first to post a review!</p>
        )
      )}
    </div>
  );
};

export default SpotDetails;
