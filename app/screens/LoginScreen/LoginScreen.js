import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  TouchableOpacity,
  KeyboardAvoidingView,
  Image,
  ScrollView
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
import I18n from "FieldsReact/i18n";

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    firebase.analytics().setCurrentScreen("LoginScreen", "LoginScreen");
  }
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
        .then(() => {
          this.setState({ loading: false });
        })
        .then(() => {
          firebase.analytics().logEvent("success_login");
        })
        .then(() => this.props.navigation.navigate("LoadingScreen"))
        .catch(error => {
          firebase.analytics().logEvent("failed_login");

          this.setState({
            loading: false,
            errorMessage: [I18n.t("email_and_password_dont_match_any_users")]
          });
        });
    }
  };
  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.logoContainer}>
          <Image style={styles.logo} source={{ uri: "f_logo_white_bg" }} />
        </View>
        <View style={styles.paddingContainer}>
          <Text style={styles.text2}>{I18n.t("welcome_back")}</Text>
          <TextInput
            underlineColorAndroid="rgba(0,0,0,0)"
            style={styles.textInput}
            autoCapitalize="none"
            placeholder={I18n.t("email")}
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
            placeholder={I18n.t("password")}
            onChangeText={password1 => this.setState({ password1 })}
            value={this.state.password1}
            ref={input1 => (this.passwordInput = input1)}
          />
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={this.handleLogin}
          >
            <Text style={styles.buttonText}>{I18n.t("login")}</Text>
          </TouchableOpacity>
          {this.state.errorMessage && (
            <Text style={styles.error}>{this.state.errorMessage}</Text>
          )}
          <View style={styles.indicatorContainer} />

          <Loader loading={this.state.loading} />

          <Text
            style={styles.text}
            onPress={() =>
              this.props.navigation.navigate("ForgotPasswordScreen")
            }
          >
            {I18n.t("forgot_password")}
          </Text>
          <Text
            style={styles.text3}
            onPress={() => this.props.navigation.navigate("SignUpScreen")}
          >
            {I18n.t("dont_have_an_account")}
          </Text>
        </View>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1
  },
  paddingContainer: {
    padding: 20
  },
  textInput: {
    height: 60,
    marginTop: 12,
    paddingHorizontal: 8,
    backgroundColor: "#efeded",
    borderRadius: 10,
    fontWeight: "bold",
    fontSize: 20
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
    marginBottom: 16,
    color: "#bcbcbc",
    textAlign: "center",
    justifyContent: "flex-start"
  },
  text2: {
    marginTop: 16,
    color: "#919191",
    marginBottom: 16,
    fontWeight: "bold",
    textAlign: "center"
  },

  text3: {
    marginTop: 16,
    color: "#bcbcbc",
    textAlign: "center",
    justifyContent: "flex-end"
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
    alignItems: "flex-end"
  }
});
