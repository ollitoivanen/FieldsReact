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

export default class FeedScreen extends React.Component {
  state = { currentUser: null };
  updateTextInput(value) {
    this.setState({ textInput: value });
  }
  addTodo() {
    this.ref.add({
      title: this.state.textInput
    });
    this.setState({
      textInput: ""
    });
  }
  constructor() {
    super();
    this.ref = firebase.firestore().collection("todos");
    this.state = {
      textInput: ""
    };
  }
  componentDidMount() {
    const { currentUser } = firebase.auth();
    this.setState({ currentUser });
  }
  render() {
    const { currentUser } = this.state;
    return (
      <View style={styles.container}>
        <Text onPress={() => firebase.auth().signOut()}>
          Hi {currentUser && currentUser.email}!
        </Text>
        <TextInput
          placeholder={"add todo"}
          value={this.state.textInput}
          onChangeText={text => this.updateTextInput(text)}
        />
        <Button title={"send"} onPress={() => this.addTodo()} />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 200
  }
});
