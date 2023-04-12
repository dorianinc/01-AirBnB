import { csrfFetch } from "./csrf";

//////////// Action Types //////////////////

export const LOAD_SPOTS = "spots/LOAD_SPOTS";
export const PREVIEW_SPOT = "spots/PREVIEW_SPOT";
export const CLEAR_SPOTS = "spots/CLEAR_SPOTS";
export const UPDATE_SPOT = "spots/UPDATE_SPOT";
export const DELETE_SPOT = "spots/DELETE_SPOT";

//////////// Action Creators ///////////////

export const loadSpotsAction = (spots) => ({
  type: LOAD_SPOTS,
  spots,
});

export const previewSpotAction = (spot) => ({
  type: PREVIEW_SPOT,
  spot,
});

export const updateSpotAction = (spot) => ({
  type: UPDATE_SPOT,
  spot,
});

export const deleteSpotAction = (spotId) => ({
  type: DELETE_SPOT,
  spotId,
});

export const clearSpotsAction = () => ({
  type: CLEAR_SPOTS,
});

//////////// Thunks //////////////////

// get all spots
export const loadSpotsThunk = () => async (dispatch) => {
  const res = await fetch("/api/spots");
  if (res.ok) {
    const data = await res.json();
    const allSpots = data.Spots;
    dispatch(loadSpotsAction(allSpots));
    return data;
  }
};

// get user's spots
export const loadUserSpotsThunk = (userId) => async (dispatch) => {
  console.log("dispatching thunk");
  const res = await fetch("/api/spots/current");
  if (res.ok) {
    const data = await res.json();
    dispatch(loadSpotsAction(data));
  }
};
// delete a spot
export const deleteSpotThunk = (spotId) => async (dispatch) => {
  console.log("before the fetch");
  const res = await csrfFetch(`/api/spots/${spotId}`, {
    method: "DELETE",
  });
  if (res.ok) {
    dispatch(deleteSpotAction(spotId));
  }
};

// get spot details of one spot
export const previewSpotThunk = (spotId) => async (dispatch) => {
  const res = await fetch(`/api/spots/${spotId}`);

  if (res.ok) {
    const data = await res.json();
    dispatch(previewSpotAction(data));
    return data;
  }
};
// post a spot
export const createSpotThunk = (spot) => async (dispatch) => {
  const res = await csrfFetch("/api/spots/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(spot),
  });
  if (res.ok) {
    const data = await res.json();
    return data;
  }
};

// post image to spot
export const addImageThunk = (spotId, imageObj) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/images`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(imageObj),
  });
  if (res.ok) {
    const data = await res.json();
    return data;
  }
};

// update a spot
export const updateSpotThunk = (spot, spotEdits) => async (dispatch) => {
  console.log("in updated spot thunk")
  const res = await csrfFetch(`/api/spots/${spot.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(spotEdits),
  });

  console.log("exiting ")

  if (res.ok) {
    const data = await res.json();
    console.log("data 👉", data)
    dispatch(updateSpotAction(data));
    return data;
  } else {
    const errors = await res.json();
    return errors;
  }
};

const spotsReducer = (state = {}, action) => {
  let newState;
  switch (action.type) {
    case LOAD_SPOTS:
      newState = { ...state };
      action.spots.forEach((spot) => {
        newState[spot.id] = spot;
      });
      return newState;
    case PREVIEW_SPOT:
      return { ...state, [action.spot.id]: action.spot };
    case UPDATE_SPOT:
      return { ...state, [action.spot.id]: action.spot };
    case DELETE_SPOT:
      newState = { ...state };
      delete newState[action.spotId];
      return newState;
    case CLEAR_SPOTS:
      return {};
    default:
      return state;
  }
};

export default spotsReducer;