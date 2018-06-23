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
import firebase from 'react-native-firebase'

export default class LoginScreen extends React.Component {
  state = { email1: "", password1: "", errorMessage: null };
  handleLogin = () => {
    const { email1, pasword1 } = this.state
    firebase
      .auth()
      .signInWithEmailAndPassword(email1, password1)
      .then(() => this.props.navigation.navigate('FeedScreen'))
      .catch(error => this.setState({ errorMessage: error.message }))
  }
  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <Text>LoginScreen</Text>
        {this.state.errorMessage && (
          <Text style={{ color: "red" }}>{this.state.errorMessage}</Text>
        )}
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={require("FieldsReact/app/images/fields_logo_green.png")}
          />
        </View>

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

        <Text
          style={styles.text}
          onPress={() => this.props.navigation.navigate("SignUpScreen")}
        >
          {dont_have_an_account}
        </Text>
      </KeyboardAvoidingView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    padding: 20,
    backgroundColor: "white"
  },
  textInput: {
    height: 40,
    marginTop: 8,
    backgroundColor: "#e2e2e2",
    paddingHorizontal: 8
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
  }
});
