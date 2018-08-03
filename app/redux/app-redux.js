import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import firebase from "react-native-firebase";
import { NavigationActions, StackActions } from "react-navigation";

const initialState = {
  userData: {},
  usersTeamData: {}
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_USER_DATA":
      return { ...state, userData: action.value };
    case "GET_USER_TEAM_DATA":
      return { ...state, usersTeamData: action.value };

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

const setUserTeamData = usersTeamData => {
  return {
    type: "GET_USER_TEAM_DATA",
    value: usersTeamData
  };
};

const getUserData =() => {
  return function(dispatch) {
    firebase
      .firestore()
      .collection("Users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then(function(doc) {
        if (doc.data().userTeamID !== null) {
          firebase
            .firestore()
            .collection("Teams")
            .doc(doc.data().userTeamID)
            .get()
            .then(function(teamDoc) {
              var usersTeamData = teamDoc.data();
              var userData = doc.data();
              var actionSetUserTeamData = setUserTeamData(usersTeamData);
              var actionSetUserData = setUserData(userData);
              dispatch(actionSetUserTeamData);
              dispatch(actionSetUserData);
            });
        } else {
          var userData = doc.data();

          var actionSetUserData = setUserData(userData);
          dispatch(actionSetUserData).then();
        }
      });
  };
};

export { setUserData, getUserData, setUserTeamData };
