import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import firebase from "react-native-firebase";


const initialState = {
  userData: {}
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_USER_DATA":
      return { ...state, userData: action.value };
    default:
      return state;
  }
};

const store = createStore(reducer, applyMiddleware(thunkMiddleware));
export { store };

//
// Action Creators
//
const setUserData = userData => {
  return {
    type: "GET_USER_DATA",
    value: userData
  };
};

const getUserData = () => {
  return function(dispatch) {
    firebase
      .firestore()
      .collection("Users")
      .doc('tFMg4khdxYPvBalFe6JlYGWwnX82')
      .get()
      .then(function(doc) {
        var userData = doc.data();

        var actionSetUserData = setUserData(userData);
        dispatch(actionSetUserData);
      });
  };
};

export { setUserData, getUserData };
