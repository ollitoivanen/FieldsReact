import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  TouchableOpacity,
  KeyboardAvoidingView,
  Image
} from "react-native";
import {
  email,
  password,
  welcome_back,
  login,
  dont_have_an_account
} from "FieldsReact/app/strings/strings";
import firebase from "react-native-firebase";

export default class LoginScreen extends React.Component {
  state = { email1: "", password1: "", errorMessage: null };
  handleLogin = () => {
    const { email1, password1 } = this.state;
    firebase
      .auth()
      .signInWithEmailAndPassword(email1, password1)
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
        <Text style={styles.text2}>{welcome_back}</Text>
        <TextInput
          underlineColorAndroid="rgba(0,0,0,0)"
          style={styles.textInput}
          autoCapitalize="none"
          placeholder={email}
          onChangeText={email1 => this.setState({ email1 })}
          value={this.state.email1}
        />
        <TextInput
          underlineColorAndroid="rgba(0,0,0,0)"
          secureTextEntry
          style={styles.textInput}
          autoCapitalize="none"
          placeholder={password}
          onChangeText={password1 => this.setState({ password1 })}
          value={this.state.password1}
        />
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={this.handleLogin}
        >
          <Text style={styles.buttonText}>{login}</Text>
        </TouchableOpacity>
        {this.state.errorMessage && (
          <Text style={styles.error}>{this.state.errorMessage}</Text>
        )}

        <View style={styles.alreadyAccountCont}>
          <Text
            style={styles.text}
            onPress={() => this.props.navigation.navigate("SignUpScreen")}
          >
            {dont_have_an_account}
          </Text>
        </View>
      </KeyboardAvoidingView>
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
  textInput: {
    height: 40,
    marginTop: 12,
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
  text2: {
    marginTop: 16,
    color: "#919191",
    marginBottom: 16,
    fontWeight: "bold",
    textAlign: "center"
  },
  buttonContainer: {
    backgroundColor: "#3bd774",
    padding: 15,
    marginTop: 16,
    borderRadius: 10
  },

  error: {
    marginTop: 8,
    color: "red",
    fontWeight: "bold"
  },

  alreadyAccountCont: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 16
  }
});
