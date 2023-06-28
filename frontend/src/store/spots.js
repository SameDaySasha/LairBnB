
// Action types
const SET_SPOTS = 'spots/setSpots';

const setSpots = (spots) => {
    return {
      type: SET_SPOTS,
      payload: spots // This should match what you're using in your reducer
    };
  };

// Thunk action creator
export const fetchSpots = () => async (dispatch) => {
  const response = await fetch('/api/spots');
  const spots = await response.json();
  console.log("This is the console log from the thunk +++++")
  console.log(spots)
  dispatch(setSpots(spots));
  
  return response;
};

// Initial state
const initialState = {};

// Reducer
const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
      case SET_SPOTS:
        return {...state, ...action.payload} // Use action.payload instead of action.spots
      default:
        return state;
    }
  };
  

export default spotsReducer;
