import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { postReview } from '../../store/reviews';
import { useModal } from "../../context/Modal";
import './ReviewForm.css'; // we'll add some styles here later

function ReviewForm({ spotId,onReviewSubmit }) {
  const { closeModal } = useModal();
  const dispatch = useDispatch();
  const [review, setReview] = useState('');
  const [stars, setStars] = useState(0);
  const [errors, setErrors] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newReview = await dispatch(postReview(spotId, review, stars));
    if (newReview) {
      onReviewSubmit(newReview); // call the onReviewSubmit function after a new review is submitted
    }
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <h1>How was your stay?</h1>
      <ul>
        {errors && errors?.map((error, idx) => <li key={idx}>{error}</li>)}
      </ul>
      <label>
        Leave your review here...
        <textarea
          className="review-textarea"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          required
        />
      </label>
      <label>
        Stars
        <input
          className="stars-input"
          type="number"
          value={stars}
          onChange={(e) => setStars(e.target.value)}
          required
          min="1"
          max="5"
        />
      </label>
      <button type="submit">Submit Your Review</button>
    </form>
  );
}

export default ReviewForm;
