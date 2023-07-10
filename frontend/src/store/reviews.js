// Action types
const SET_REVIEWS = 'reviews/setReviews';
const SET_REVIEW_SUMMARY = 'reviews/setReviewSummary'; // <-- new action type

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

  if(response.ok){
    const data = await response.json();
    dispatch(setReviews(data.Reviews));
  }
}



// Initial state
const initialState = {
  reviews: [],
  reviewSummary: {
    averageRating: 0,
    reviewCount: 0,
  },
};

// Reducer
const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_REVIEWS:
      return { ...state, reviews: action.payload };
    case SET_REVIEW_SUMMARY: // <-- handle new action
      return { ...state, reviewSummary: action.payload };
    default:
      return state;
  }
};

export default reviewsReducer;
