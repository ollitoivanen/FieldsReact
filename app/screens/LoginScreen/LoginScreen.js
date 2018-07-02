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
  dont_have_an_account,
  please_enter_valid_email,
  please_enter_password,
  email_and_password_dont_match_any_users,
  forgot_password
} from "FieldsReact/app/strings/strings";
import firebase from "react-native-firebase";
import validator from "validator";
import Loader from "FieldsReact/app/components/Loader/Loader.js";

export default class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null
  };
  state = { email1: "", password1: "", errorMessage: null, loading: false };
  handleLogin = () => {
    const { email1, password1 } = this.state;
    if (!validator.isEmail(this.state.email1)) {
      this.setState({ errorMessage: [please_enter_valid_email] });
    } else if (this.state.password1.length == 0) {
      this.setState({ errorMessage: [please_enter_password] });
    } else if (this.state.password1.length < 7) {
      this.setState({ errorMessage: [please_enter_password] });
    } else {
      this.setState({ loading: true });

      firebase
        .auth()
        .signInAndRetrieveDataWithEmailAndPassword(email1, password1)
        .then(() => this.props.navigation.navigate("FeedScreen"))
        .catch(error =>
          this.setState({
            errorMessage: [email_and_password_dont_match_any_users]
          })
        );
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={require("FieldsReact/app/images/FieldsLogo/fields_logo_green.png")}
          />
        </View>
        <Text style={styles.text2}>{welcome_back}</Text>
        <TextInput
          underlineColorAndroid="rgba(0,0,0,0)"
          style={styles.textInput}
          autoCapitalize="none"
          placeholder={email}
          returnKeyType="next"
          keyboardType="email-address"
          onChangeText={email1 => this.setState({ email1 })}
          value={this.state.email1}
          onSubmitEditing={() => this.passwordInput.focus()}
        />
        <TextInput
          underlineColorAndroid="rgba(0,0,0,0)"
          secureTextEntry
          style={styles.textInput}
          autoCapitalize="none"
          returnKeyType="go"
          placeholder={password}
          onChangeText={password1 => this.setState({ password1 })}
          value={this.state.password1}
          ref={input1 => (this.passwordInput = input1)}
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
        <View style={styles.indicatorContainer} />

        <Loader loading={this.state.loading} />

        <View style={styles.alreadyAccountCont}>
          <Text
            style={styles.text}
            onPress={() =>
              this.props.navigation.navigate("ForgotPasswordScreen")
            }
          >
            {forgot_password}
          </Text>
          <Text
            style={styles.text}
            onPress={() => this.props.navigation.navigate("SignUpScreen")}
          >
            {dont_have_an_account}
          </Text>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    padding: 20,
    backgroundColor: "white",
    flex: 1
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
    justifyContent: "flex-end"
  }
});
