// Action types
const SET_SPOTS = 'spots/setSpots';
const SET_SPOT_DETAILS = 'spots/setSpotDetails'; // New action type

// Action creators
const setSpots = (spots) => {
  return {
    type: SET_SPOTS,
    payload: spots,
  };
};

const setSpotDetails = (details) => { // New action creator
  return {
    type: SET_SPOT_DETAILS,
    payload: details,
  };
};

// Thunk action creators
export const fetchSpots = () => async (dispatch) => {
  const response = await fetch('/api/spots');
  const spots = await response.json();

  dispatch(setSpots(spots));
  return response;
};

export const getOneSpot = (id) => async (dispatch) => { // New thunk action creator
  const response = await fetch(`/api/spots/${id}`);
  const details = await response.json();
  console.log("This is the console log from the thunk +++++")
  console.log(details)
  dispatch(setSpotDetails(details));
  return response;
};

// Initial state
const initialState = {};

// Reducer
const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SPOTS:
      return {...state, ...action.payload};
    case SET_SPOT_DETAILS:
      return {...state, spotDetails: action.payload}; // New case
    default:
      return state;
  }
};

export default spotsReducer;
