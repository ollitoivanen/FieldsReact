//making the exciting db calls here !!!!!
export const DATA_AVAILABLE = "DATA_AVAILABLE";

//Import the sample data
import Data from "../instructions.json";
import firebase from "react-native-firebase";

export function getData() {
  return dispatch => {
    //Make API Call
    //For this example, I will be using the sample data in the json file
    //delay the retrieval [Sample reasons only]
    setTimeout(() => {
      const data = Data.instructions;
      dispatch({ type: DATA_AVAILABLE, data: "toimii" });
    }, 2000);
  };

 
}

export const fetchToDos = () => async dispatch => {
    this.ref = firebase
    .firestore()
    .collection("Users")
    .doc(firebase.auth().currentUser.uid);
 
    this.ref.on("value", snapshot => {
      dispatch({
        type: DATA_AVAILABLE,
        data: snapshot.data().currentFieldID
      });
    });
  };

