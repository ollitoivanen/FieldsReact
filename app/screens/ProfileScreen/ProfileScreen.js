import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import BottomBarProfile from "FieldsReact/app/components/BottomBar/BottomBarProfile.js";
import ProfileHeader from "FieldsReact/app/components/ProfileHeader/ProfileHeader.js";


export default class ProfileScreen extends Component {
    static navigationOptions = {
        header: null
      };
  render() {
    return (
      <View style={styles.container}>
      <ProfileHeader/>
      <View style={styles.navigationContainer}>
        <BottomBarProfile navigation={this.props.navigation} />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },

  profileGreenBackground: {
    backgroundColor: '#3bd774',
    height: 100,
    

  },

  navigationContainer: {
    bottom: 0,
    position: 'absolute',
    width: '100%',
    flex: 1

  }

  
});
