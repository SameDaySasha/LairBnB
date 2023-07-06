// Action types
const SET_REVIEWS = 'reviews/setReviews';

// Action creators
const setReviews = (reviews) => {
  return {
    type: SET_REVIEWS,
    payload: reviews,
  };
};

// Thunk action creators
export const fetchReviewsForSpot = (id) => async (dispatch) => {
  const response = await fetch(`/api/spots/${id}/reviews`);
  const reviewsData = await response.json();
  
  dispatch(setReviews(reviewsData.Reviews));
  return response;
};

// Initial state
const initialState = [];

// Reducer
const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_REVIEWS:
      return action.payload;
    default:
      return state;
  }
};

export default reviewsReducer;
