import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { postReview } from '../../store/reviews';
import { useModal } from "../../context/Modal";
import './ReviewForm.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';

function ReviewForm({ spotId,onReviewSubmit }) {
  const { closeModal } = useModal();
  const dispatch = useDispatch();
  const [review, setReview] = useState('');
  const [stars, setStars] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [errors, setErrors] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newReview = await dispatch(postReview(spotId, review, stars));
    if (newReview) {
      onReviewSubmit(newReview); // call the onReviewSubmit function after a new review is submitted
    }
  };

  const handleMouseOver = (newHoverRating) => {
    setHoverRating(newHoverRating);
  };

  const handleMouseOut = () => {
    setHoverRating(0);
  };

  const handleClick = (newRating) => {
    setStars(newRating);
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <h1>How was your stay?</h1>
      <ul>
        {errors && errors?.map((error, idx) => <li key={idx}>{error}</li>)}
      </ul>
      <label>
        <textarea
          className="review-textarea"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          required
          placeholder="Leave your review here..."
        />
      </label>
      <label>
        Stars
        {[1, 2, 3, 4, 5].map((star) => (
          <FontAwesomeIcon
            key={star}
            icon={star <= (hoverRating || stars) ? solidStar : regularStar}
            onMouseOver={() => handleMouseOver(star)}
            onMouseOut={handleMouseOut}
            onClick={() => handleClick(star)}
          />
        ))}
      </label>
      <button type="submit" disabled={review.length < 10}>Submit Your Review</button>
    </form>
  );
}

export default ReviewForm;
