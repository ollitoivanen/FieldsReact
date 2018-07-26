import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import firebase from "react-native-firebase";
import { getUserData } from "FieldsReact/app/redux/app-redux.js";
import { connect } from 'react-redux';




class testing extends Component {
    static navigationOptions = {
        header: null
      };
constructor(props){
    super(props);
    this.props.getUserData()
}

  render() {
    return (
      <View style={styles.container}>
        <Text>{this.props.userData.position}</Text>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    userData: state.userData
  };
};
const mapDispatchToProps = dispatch => {
  return {
    getUserData: () => dispatch(getUserData())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(testing);

const styles = StyleSheet.create({
  container: {}
});
