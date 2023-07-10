import { csrfFetch } from "./csrf";

// Action types
const SET_SPOTS = 'spots/setSpots';
const SET_SPOT_DETAILS = 'spots/setSpotDetails';
const ADD_SPOT = 'spots/addSpot'; // New action type

// Action creators
const setSpots = (spots) => {
  return {
    type: SET_SPOTS,
    payload: spots,
  };
};

const setSpotDetails = (details) => {
  return {
    type: SET_SPOT_DETAILS,
    payload: details,
  };
};

const addSpot = (spot) => { // New action creator
  return {
    type: ADD_SPOT,
    payload: spot,
  };
};

// Thunk action creators
export const fetchSpots = () => async (dispatch) => {
  const response = await fetch('/api/spots');
  const spots = await response.json();

  dispatch(setSpots(spots));
  return response;
};

export const getOneSpot = (id) => async (dispatch) => {
  const response = await fetch(`/api/spots/${id}`);
  const details = await response.json();
  dispatch(setSpotDetails(details));
  return response;
};

export const createSpot = (spot) => async (dispatch) => {
  const response =await csrfFetch('/api/spots', {
    method: 'POST',
    // headers: {
    //   'Content-Type': 'application/json',
    // },
    body: JSON.stringify(spot),
  });

  if (response.ok) {
    const newSpot = await response.json();
    dispatch(addSpot(newSpot));
    return newSpot; // Return the new spot data
  } else {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }
};


// Initial state
const initialState = {};

// Reducer
const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SPOTS:
      return {...state, ...action.payload};
    case SET_SPOT_DETAILS:
      return {...state, spotDetails: action.payload};
    case ADD_SPOT: // New case
      return {...state, [action.payload.id]: action.payload};
    default:
      return state;
  }
};

export default spotsReducer;
