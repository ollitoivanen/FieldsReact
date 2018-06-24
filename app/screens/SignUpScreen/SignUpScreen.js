import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView
} from "react-native";
import {
  email,
  password,
  welcome,
  signup,
  already_have_an_account,
  name
} from "FieldsReact/app/strings/strings";
import firebase from "react-native-firebase";

export default class SignUpScreen extends React.Component {
  state = { email1: "", password1: "", errorMessage: null };
  handleSignUp = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email1, this.state.password1)
      .then(() => this.props.navigation.navigate("FeedScreen"))
      .catch(error => this.setState({ errorMessage: error.message }));
  };
  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={require("FieldsReact/app/images/fields_logo_green.png")}
          />
        </View>

        <Text>{welcome}</Text>

        <TextInput
          underlineColorAndroid="rgba(0,0,0,0)"
          placeholder={email}
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={email1 => this.setState({ email1 })}
          value={this.state.email1}
        />
        <TextInput
          underlineColorAndroid="rgba(0,0,0,0)"
          secureTextEntry
          placeholder={password}
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={password1 => this.setState({ password1 })}
          value={this.state.password1}
        />
        {this.state.errorMessage && (
          <Text style={styles.error}>{this.state.errorMessage}</Text>
        )}
        <TouchableOpacity
          onPress={this.handleSignUp}
          style={styles.buttonContainer}
        >
          <Text style={styles.buttonText}>{signup}</Text>
        </TouchableOpacity>

        <Text
          style={styles.text}
          onPress={() => this.props.navigation.navigate("LoginScreen")}
        >
          {already_have_an_account}
        </Text>
      </KeyboardAvoidingView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    padding: 20,
    backgroundColor: "white",
    flex: 0
  },
  textInput: {
    height: 40,
    marginTop: 8,
    paddingHorizontal: 8,
    backgroundColor: "#e2e2e2"
  },
  buttonContainer: {
    backgroundColor: "#3bd774",
    padding: 15,
    marginTop: 10
  },

  buttonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold"
  },

  logo: {
    width: 200,
    height: 200
  },

  logoContainer: {
    alignItems: "center",
    justifyContent: "center"
  },

  
  text: {
    marginTop: 16,
    color: "#bcbcbc",
    textAlign: "center"
  },

  error: {
    marginTop: 8,
    color: 'red'
  }
});
