//frontend/src/components/ReviewForm/index.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postReview } from '../../store/reviews'; // import your action creator for posting a review
import { useModal } from "../../context/Modal";
function ReviewForm({ spotId, }) {
  const { closeModal } = useModal();
  const dispatch = useDispatch();
  const [review, setReview] = useState('');
  const [stars, setStars] = useState(0);
  const [errors, setErrors] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    // dispatch your postReview action here
    const data = await dispatch(postReview(spotId, review, stars));
    if (!data.ok) {
      setErrors(data);
    } else {
      closeModal();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <ul>
        {errors && errors?.map((error, idx) => <li key={idx}>{error}</li>)}
      </ul>
      <label>
        Review
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          required
        />
      </label>
      <label>
        Stars
        <input
          type="number"
          value={stars}
          onChange={(e) => setStars(e.target.value)}
          required
        />
      </label>
      <button type="submit">Submit Your Review</button>
    </form>
  );
}

export default ReviewForm;

