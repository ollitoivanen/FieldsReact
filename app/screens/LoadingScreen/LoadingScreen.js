import React, { Component } from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator } from "react-native";
import firebase from "react-native-firebase";
import { NavigationActions, StackActions } from "react-navigation";
import { connect } from "react-redux";
import { getUserData } from "FieldsReact/app/redux/app-redux.js";
import { getUserAndTeamData } from "../../redux/app-redux";
import I18n from "FieldsReact/i18n";
import * as Animatable from "react-native-animatable";


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

class LoadingScreen extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    firebase.analytics().setCurrentScreen("LoadingScreen", "LoadingScreen");

    const startFeed = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: "FeedScreen" })]
    });

    const startSignUp = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: "SignUpScreen" })]
    });

    firebase.auth().onAuthStateChanged(user => {
      user ? this.loadData() : this.props.navigation.dispatch(startSignUp);
    });
  }

  componentWillReceiveProps() {
    const startFeed = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: "FeedScreen" })]
    });
    this.props.navigation.dispatch(startFeed);
  }

  loadData = () => {
    this.props.getUserData();
  };

  render() {
    return (
      <View style={styles.container}>
      <Animatable.Image style={styles.logo} animation={'fadeIn'} iterationCount={'infinite'} source={{uri: 'stribe_icon_activated'}}></Animatable.Image>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111111"
  },
  logo: {
    width: 50,
    height: 50
  }
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoadingScreen);
