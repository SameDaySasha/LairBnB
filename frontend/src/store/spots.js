import { csrfFetch } from "./csrf";

// Action types
const SET_SPOTS = 'spots/setSpots';
const SET_SPOT_DETAILS = 'spots/setSpotDetails';
const ADD_SPOT = 'spots/addSpot'; // Action type for adding a new spot
const SET_USER_SPOTS = 'spots/setUserSpots'; // Action type for setting user spots

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

const addSpot = (spot) => {
  return {
    type: ADD_SPOT,
    payload: spot,
  };
};

const setUserSpots = (spots) => { // Action creator for setting user spots
  return {
    type: SET_USER_SPOTS,
    payload: spots,
  };
};

// Thunk action creators
export const fetchSpots = () => async (dispatch) => {
  const response = await fetch('/api/spots');
  const spots = await response.json();
  dispatch(setSpots(spots));
  return response;
};

// Thunk action creators
export const fetchUserSpots = () => async (dispatch) => {
  const response = await csrfFetch('/api/user/spots', {
    method: 'GET',
  });
  if (response.ok) {
    const spots = await response.json();
    dispatch(setUserSpots(spots)); // Dispatch setUserSpots action
    return spots; // Return the spots data
  }
};

export const getOneSpot = (id) => async (dispatch) => {
  const response = await fetch(`/api/spots/${id}`);
  const details = await response.json();
  dispatch(setSpotDetails(details));
  return response;
};

export const createSpot = (spot) => async (dispatch) => {
  const response = await csrfFetch('/api/spots', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(spot),
  });

  if (response.ok) {
    const newSpot = await response.json();
    dispatch(addSpot(newSpot));
    return newSpot;
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
    case SET_USER_SPOTS:
      return {...state, userSpots: action.payload}; // Handle setUserSpots action
    case SET_SPOT_DETAILS:
      return {...state, spotDetails: action.payload};
    case ADD_SPOT:
      return {...state, [action.payload.id]: action.payload};
    default:
      return state;
  }
};

export default spotsReducer;
