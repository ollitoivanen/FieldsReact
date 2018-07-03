import React from "react";
import {
  StyleSheet,
  Platform,
  Image,
  Text,
  View,
  TextInput,
  Button
} from "react-native";
import firebase from "react-native-firebase";
import { NavigationActions, StackActions } from "react-navigation";
import BottomBarFeed from "FieldsReact/app/components/BottomBar/BottomBarFeed.js";

export default class FeedScreen extends React.Component {
  static navigationOptions = {
    header: null
  };
  state = { currentUser: null };
  updateTextInput(value) {
    this.setState({ textInput: value });
  }

  constructor() {
    super();
  }
  componentDidMount() {
    const { currentUser } = firebase.auth();
    this.setState({ currentUser });
  }
  render() {
    
    const { currentUser } = this.state;
    return (
      <View style={styles.container}>
        <BottomBarFeed navigation={this.props.navigation}/>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  }
});
