import React, { Component } from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator } from "react-native";
import firebase from "react-native-firebase";
import { NavigationActions, StackActions } from "react-navigation";
import { connect } from "react-redux";
import { getUserData } from "FieldsReact/app/redux/app-redux.js";
import { getUserAndTeamData } from "../../redux/app-redux";
import I18n from "FieldsReact/i18n";
import * as RNIap from "react-native-iap";


const mapStateToProps = state => {
  return {
    userData: state.userData,
    usersTeamData: state.usersTeamData
  };
};
const mapDispatchToProps = dispatch => {
  return {
    getUserData: () => dispatch(getUserData()),
    getUserAndTeamData: () => dispatch(getUserAndTeamData())
  };
};

const gg = () => {
  startFeedScreen();
};

class LoadingScreen extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentWillMount() {
    const startFeed = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: "FeedScreen" })]
    });

    const startSignUp = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: "SignUpScreen" })]
    });

    const loadData = () => {
      this.props.getUserData();
    };

    firebase.auth().onAuthStateChanged(user => {
      user ? loadData() : this.props.navigation.dispatch(startSignUp);
    });
  }

  componentWillReceiveProps() {
    const startFeed = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: "FeedScreen" })]
    });
    this.props.navigation.dispatch(startFeed);
  }

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3bd774" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white"
  },
  logo: {
    width: 200,
    height: 200
  }
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoadingScreen);
