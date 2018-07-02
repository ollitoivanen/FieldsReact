import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  TouchableHighlight
} from "react-native";
import {
  forgot_password_enter_email,
  email,
  send
} from "FieldsReact/app/strings/strings";
import firebase from "react-native-firebase";
import validator from "validator";
import { please_enter_valid_email } from "FieldsReact/app/strings/strings";

export default class ForgotPasswordScreen extends Component {
  static navigationOptions = {
    header: null
  };

  state = { email1: "" };

  sendMessage = () => {
    const { email1 } = this.state;
    if (!validator.isEmail(email1)) {
      this.setState({ errorMessage: [please_enter_valid_email] });
    } else {
      firebase.auth().sendPasswordResetEmail(email1);
    }
  };

  render() {
    const { goBack } = this.props.navigation.goBack;

    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.logo}
          underlayColor="#bcbcbc"
          onPress={() => this.props.navigation.navigate("LoginScreen")}
        >
          <Image
            style={styles.logo}
            source={require("FieldsReact/app/images/BackButton/back_button.png")}
          />
        </TouchableOpacity>
        <Text style={styles.text}>{forgot_password_enter_email}</Text>
        <TextInput
          value={this.state.email1}
          style={styles.textInput}
          underlineColorAndroid="rgba(0,0,0,0)"
          placeholder={email}
          autoCapitalize="none"
          returnKeyType="go"
          keyboardType="email-address"
          onChangeText={email1 => this.setState({ email1 })}
        />
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={this.sendMessage}
        >
          <Text style={styles.buttonText}>{send}</Text>
        </TouchableOpacity>
        {this.state.errorMessage && (
          <Text style={styles.error}>{this.state.errorMessage}</Text>
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    padding: 20,
    backgroundColor: "white",
    height: "100%",
    width: "100%",
    flex: 0
  },

  text: {
    marginTop: 32,
    textAlign: "center",
    fontWeight: "bold",
    color: "#919191"
  },
  textInput: {
    height: 40,
    marginTop: 24,
    backgroundColor: "#efeded",
    paddingHorizontal: 8,
    borderRadius: 10,
    fontWeight: "bold"
  },

  buttonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold"
  },

  buttonContainer: {
    backgroundColor: "#3bd774",
    padding: 15,
    marginTop: 32,
    borderRadius: 10
  },

  logo: {
    height: 48,
    width: 48
  },
  error: {
    marginTop: 8,
    color: "red",
    fontWeight: "bold"
  }
});
