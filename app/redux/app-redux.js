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

const getUserAndTeamData = () => {
  return function(dispatch) {
    firebase
      .firestore()
      .collection("Users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then(function(doc) {
        //Checking the undefined stuff so no useless data is created. It's all about staying lean!
        if (doc.data().uTI !== undefined) {
          firebase
            .firestore()
            .collection("Teams")
            .doc(doc.data().uTI)
            .get()
            .then(function(teamDoc) {
              var usersTeamData1 = Object.assign(
                { id: teamDoc.id },
                teamDoc.data()
              );
              var usersTeamData = usersTeamData1;
              var undefinedOnes = [];
             
              if (doc.data().tC === undefined) {
                undefinedOnes.push({
                  tC: 0
                });
              }

              if (doc.data().cFI === undefined) {
                undefinedOnes.push({
                  cFI: "",
                  cFN: ""
                });
              }
              if (doc.data().fP === undefined) {
                undefinedOnes.push({
                  fP: false
                });
              }
              if (doc.data().hA === undefined) {
                undefinedOnes.push({
                  hA: ""
                });
              }

              if (doc.data().re === undefined) {
                undefinedOnes.push({
                  re: 0
                });
              }
              if (doc.data().ts === undefined) {
                undefinedOnes.push({
                  ts: null
                });
              }
              if (doc.data().uTI === undefined) {
                undefinedOnes.push({
                  uTI: undefined
                });
              }

              if (doc.data().uTN === undefined) {
                undefinedOnes.push({
                  uTN: undefined
                });
              }

              var userData = Object.assign(...undefinedOnes, doc.data());

              var actionSetUserData = setUserData(userData);
              dispatch(actionSetUserData);

              teamDoc.data();
              var actionSetUserTeamData = setUserTeamData(usersTeamData);
              dispatch(actionSetUserTeamData);
            });
        } else {
          var undefinedOnes = [];
          
          if (doc.data().tC === undefined) {
            undefinedOnes.push({
              tC: 0
            });
          }

          if (doc.data().cFI === undefined) {
            undefinedOnes.push({
              cFI: "",
              cFN: ""
            });
          }
          if (doc.data().fP === undefined) {
            undefinedOnes.push({
              fP: false
            });
          }
          if (doc.data().hA === undefined) {
            undefinedOnes.push({
              hA: ""
            });
          }

          if (doc.data().re === undefined) {
            undefinedOnes.push({
              re: 0
            });
          }
          if (doc.data().ts === undefined) {
            undefinedOnes.push({
              ts: null
            });
          }
          if (doc.data().uTI === undefined) {
            undefinedOnes.push({
              uTI: undefined
            });
          }

          if (doc.data().uTN === undefined) {
            undefinedOnes.push({
              uTN: undefined
            });
          }

          if (doc.data().pT === undefined) {
            undefinedOnes.push({
              pT: undefined
            });
          }

          var userData = Object.assign(...undefinedOnes, doc.data());

          var actionSetUserData = setUserData(userData);
          dispatch(actionSetUserData);
        }
      });
  };
};

const getUserData = () => {
  return function(dispatch) {
    firebase
      .firestore()
      .collection("Users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then(function(doc) {
        //Checking the undefined stuff so no useless data is created. It's all about staying lean!

        var undefinedOnes = [];
        if (doc.data().fC === undefined) {
          undefinedOnes.push({
            fC: 0
          });
        }
        if (doc.data().tC === undefined) {
          undefinedOnes.push({
            tC: 0
          });
        }

        if (doc.data().cFI === undefined) {
          undefinedOnes.push({
            cFI: "",
            cFN: ""
          });
        }
        if (doc.data().fP === undefined) {
          undefinedOnes.push({
            fP: false
          });
        }
        if (doc.data().hA === undefined) {
          undefinedOnes.push({
            hA: ""
          });
        }

        if (doc.data().re === undefined) {
          undefinedOnes.push({
            re: 0
          });
        }
        if (doc.data().ts === undefined) {
          undefinedOnes.push({
            ts: null
          });
        }
        if (doc.data().uTI === undefined) {
          undefinedOnes.push({
            uTI: undefined
          });
        }

        if (doc.data().uTN === undefined) {
          undefinedOnes.push({
            uTN: undefined
          });
        }


        if (doc.data().pT === undefined) {
          undefinedOnes.push({
            pT: undefined
          });
        }

        var userData = Object.assign(...undefinedOnes, doc.data());

        var actionSetUserData = setUserData(userData);
        dispatch(actionSetUserData);
      });
  };
};

export { setUserData, getUserData, setUserTeamData, getUserAndTeamData };
