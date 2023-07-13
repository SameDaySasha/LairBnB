import { csrfFetch } from "./csrf";

// Action types
const SET_REVIEWS = 'reviews/setReviews';
const ADD_REVIEW = 'reviews/addReview'; // <-- new action type

// Action creators
const setReviews = (reviews) => {
  return {
    type: SET_REVIEWS,
    payload: reviews,
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


export const postReview = (spotId, review, stars) => async (dispatch) => { // <-- new thunk action creator
  // console.log('THIS IS THE SPOT ID =======>    ' + spotId)
  // console.log('THIS IS THE REVIEW =======>    ' + review)
  // console.log('THIS IS THE STARS =======>    ' + stars)
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
    return response;
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
    default:
      return state;
  }
};

export default reviewsReducer;
