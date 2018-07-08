import React from "react";
import {
  StyleSheet,
  Platform,
  Image,
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity
} from "react-native";
import firebase from "react-native-firebase";
import { NavigationActions, StackActions } from "react-navigation";

export default class FeedScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  getUserData = () => {
    this.ref.get().then(
      function(doc) {
        if (doc.exists) {
          this.setState({
            homeArea: doc.data().homeArea,
            loading: false
          });
        }
      }.bind(this)
    );
  };

  constructor() {
    super();
    this.state = {
      currentUser: null,
      homeArea: "",
      loading: true
    };
    this.ref = firebase
      .firestore()
      .collection("Users")
      .doc(firebase.auth().currentUser.uid);
  }
  componentWillMount() {
    const { currentUser } = firebase.auth();
    this.setState({ currentUser });
    this.getUserData();
  }
  render() {
    const { currentUser, loading } = this.state;

    if (loading == true) {
      return null;
    } else {
      return (
        <View style={styles.container}>
          <Text
            style={styles.container1}
            onPress={() => firebase.auth().signOut()}
          />
          <View style={styles.navigationContainer}>
            <TouchableOpacity
              style={styles.navigationItem}
              underlayColor="#bcbcbc"
            >
              <Image
                style={styles.navigationImage}
                source={require("FieldsReact/app/images/Home/home_green.png")}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.navigationItemGreen}
              onPress={() =>
                this.props.navigation.navigate("FieldSearchScreen", {
                  homeArea: this.state.homeArea
                })
              }
            >
              <Image
                style={styles.navigationImage}
                source={require("FieldsReact/app/images/Field/field_icon.png")}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.navigationItem}
              onPress={() => this.props.navigation.navigate("ProfileScreen")}
            >
              <Image
                style={styles.navigationImage}
                source={require("FieldsReact/app/images/Profile/profile.png")}
              />
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  }
}
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  },

  container1: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 60
  },
  navigationContainer: {
    backgroundColor: "white",
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end"
  },

  navigationItem: {
    flex: 1,
    height: 50,
    backgroundColor: "#f4fff8",
    alignItems: "center",
    justifyContent: "center"
  },

  navigationItemGreen: {
    flex: 1,
    height: 50,
    backgroundColor: "#3bd774",
    alignItems: "center",
    justifyContent: "center"
  },

  navigationImage: {
    height: 35,
    width: 35
  }
});
