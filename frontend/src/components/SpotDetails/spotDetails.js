import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getOneSpot } from "../../store/spots";
import { fetchReviewsForSpot, deleteReview } from "../../store/reviews";
import './SpotDetails.css';
import OpenModalButton from '../OpenModalButton'; // import OpenModalButton
import ReviewForm from '../ReviewForm'; // import ReviewForm
import ConfirmDeleteModal from '../ConfirmDeleteModal'; // import ConfirmDeleteModal
import { useModal } from '../../context/Modal'; // import useModal hook

const SpotDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { setModalContent, closeModal } = useModal(); // get the closeModal function from the useModal hook // use the useModal hook to get the setModalContent function

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

  const handleDeleteReview = (reviewId) => {
    setModalContent(
      <ConfirmDeleteModal 
        onConfirm={() => {
          dispatch(deleteReview(reviewId));
          closeModal(); // close the modal after the review is deleted
        }}
        itemType="review"
      />
    );
  };
  
  // Check if the current user has already posted a review for this spot
  const userIsOwner = currentUser ? currentUser?.id === spot?.Owner?.id: null
  const userHasPostedReview = reviews.some(review => review.userId === currentUser?.id);

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
            {spot.numReviews > 0 && (
              <>
                <div className="dot">·</div>
                <div className="review-container">
                  <div className="review-count">{spot.numReviews === 1 ? `${spot.numReviews} review` : `${spot.numReviews} reviews`}</div>
                </div>
              </>
            )}
          </div>
          <div className="night-price">${spot.price} / night</div>
          <button className="reserve-button" onClick={handleReserveClick}>Reserve</button>
          {currentUser && !userIsOwner && !userHasPostedReview && (
             <OpenModalButton
             modalComponent={
               <ReviewForm 
                 spotId={spot.id} 
                 onReviewSubmit={(newReview) => {
                   // After submitting a new review, fetch the updated list of reviews and spot details
                   dispatch(fetchReviewsForSpot(spot.id));
                   dispatch(getOneSpot(id));
                   closeModal(); // close the modal after the review is posted
                 }}
               />
             }
             buttonText="Post Your Review"
           />
                                                 )}
        </div>
      </div>
      <div className="separator"></div> {/* Separator Line */}
      <div className="reviews-summary"> {/* New review summary section */}
        <div className="average-rating"> ★: {spot.avgStarRating ? spot.avgStarRating.toFixed(2) : "New!"}</div>
        {spot.numReviews > 0 && (
          <>
            <div className="dot">·</div>
            <div className="review-container">
              <div className="review-count">{spot.numReviews === 1 ? `${spot.numReviews} review` : `${spot.numReviews} reviews`}</div>
            </div>
          </>
        )}
      </div>
      {(reviews && reviews.length > 0) ? reviews.map(review => (
        <div key={review?.id} className="review">
          <h4 className="reviewer-name">{review.User?.firstName}</h4>
          <p className="review-date">{new Date(review?.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
          <p className="review-comment">{review?.review}</p>
          {currentUser?.id === review.userId && (
            <button onClick={() => handleDeleteReview(review.id)}>Delete</button>
          )}
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
