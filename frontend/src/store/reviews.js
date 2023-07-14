import { csrfFetch } from "./csrf";

// Action types
const SET_REVIEWS = 'reviews/setReviews';
const ADD_REVIEW = 'reviews/addReview'; // <-- new action type
const DELETE_REVIEW = 'reviews/deleteReview';
// Action creators
const setReviews = (reviews) => {
  return {
    type: SET_REVIEWS,
    payload: reviews,
  };
};

const deleteReviewAction = (id) => {
  return {
    type: DELETE_REVIEW,
    id,
  };
};

const addReview = (review) => { // <-- new action creator
  return {
    type: ADD_REVIEW,
    payload: review,
  };
};

// Thunk action creators
export const fetchReviewsForSpot = (id) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${id}/reviews`);

  if(response.ok){
    const data = await response.json();
    // Sort the reviews in descending order of creation date
    const sortedReviews = data.Reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    dispatch(setReviews(sortedReviews));
  }
};
export const deleteReview = (id) => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/${id}`, {
    method: 'DELETE',
  });

  if (response.ok) {
    dispatch(deleteReviewAction(id));
  } else {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }
};

export const postReview = (spotId, review, stars) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ review, stars: +stars }),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(addReview(data));
    return data; // return the newly created review
  } else {
    const data = await response.json();
    console.log('THIS IS THE DATA FROM POSTREVIEW THUNK ======= > ' + data)
    if (data.errors) {
      return data.errors;
    }
  }
};


// Initial state
const initialState = {
  reviews: [],
};

// Reducer
const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_REVIEWS:
      return { ...state, reviews: action.payload };
    case ADD_REVIEW: // <-- handle new action
      return { ...state, reviews: [action.payload, ...state.reviews] };
      case DELETE_REVIEW:
        return { ...state, reviews: state.reviews.filter(review => review.id !== action.id) };
    default:
      return state;
  }
};

export default reviewsReducer;
