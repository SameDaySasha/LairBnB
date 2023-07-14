import { csrfFetch } from "./csrf";

// Action types
const SET_SPOTS = 'spots/setSpots';
const SET_SPOT_DETAILS = 'spots/setSpotDetails';
const ADD_SPOT = 'spots/addSpot'; // Action type for adding a new spot
const SET_USER_SPOTS = 'spots/setUserSpots'; // Action type for setting user spots
const DELETE_SPOT = 'spots/deleteSpot';
const UPDATE_SPOT = 'spots/updateSpot';

// Action creators
const setSpots = (spots) => {
  return {
    type: SET_SPOTS,
    payload: spots,
  };
};
const updateSpotAction = (spot) => {
  return {
    type: UPDATE_SPOT,
    payload: spot,
  };
};

const deleteSpotAction = (id) => {
  return {
    type: DELETE_SPOT,
    id,
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

//////////////////////////////////////// Thunk action creators //////////////////////////////////

export const deleteSpot = (id) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${id}`, {
    method: 'DELETE',
  });

  if (response.ok) {
    dispatch(deleteSpotAction(id));
  } else {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }
};

export const updateSpot = (spot) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spot.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(spot),
  });

  if (response.ok) {
    const updatedSpot = await response.json();
    dispatch(updateSpotAction(updatedSpot));
    return updatedSpot;
  } else {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }
};

export const fetchSpots = () => async (dispatch) => {
  const response = await fetch('/api/spots');
  const spots = await response.json();
  dispatch(setSpots(spots));
  return response;
};

export const fetchUserSpots = () => async (dispatch) => {
  const response = await csrfFetch('/api/user/spots', {
    method: 'GET',
  });
  if (response.ok) {
    const spots = await response.json();
    dispatch(setUserSpots(spots.Spots)); // Dispatch setUserSpots action
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
    // grab data id, 
    //spot forEach images > data.id

    // use csrfetch to /api/spots/:spotId/images
    ///spots/:id/images is the route we are hitting with the forEach csrf 
    spot.images.forEach((imageUrl,i)  => {
      csrfFetch(`/api/spots/${newSpot.id}/images`,
      {
        method: 'POST',
       headers: {
      'Content-Type': 'application/json',
    },body: JSON.stringify({url:imageUrl,
    preview: i === 0 ? true: false }),
    })
    } )
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
    case DELETE_SPOT:
      const newState = { ...state };
      delete newState.userSpots[action.id];
      return newState;
      
    default:
      return state;
  }
};


export default spotsReducer;
