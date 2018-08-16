import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import { connect } from "react-redux";
import { getUserData } from "FieldsReact/app/redux/app-redux.js";
import {
    
    edit_profile,
    username,
    full_name,
    save
   } from "../../strings/strings";
import firebase from 'react-native-firebase';
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

 class EditProfileScreen extends Component{
    static navigationOptions = {
        header: null
      };
    constructor(props){
        super(props)
        this.state={
            username: this.props.userData.un,
            fullName: this.props.userData.fN
        }
    }
    usernameHandle = value => {
        const newText = value.replace(/\s/g, "");
        this.setState({ username: newText });
      };

      saveProfile = () => {
          if(this.state.username === this.props.userData.un ){
              this.props.navigation.goBack()
          }else if(this.state.username !== this.props.userData.un ){
            firebase.firestore().collection("Users").doc(firebase.auth().currentUser.uid).update({
                un: this.state.username
              
            }).then(()=>{
                this.props.getUserData()
            }).then(()=>{
                this.props.navigation.goBack()
            })
          
          
      }
    }
    
render(){
    
return (
<View style={styles.container}>
<View style={styles.backButtonContainer}>
          <TouchableOpacity
            style={styles.backButton}
            underlayColor="#bcbcbc"
            onPress={() => this.props.navigation.goBack()}
          >
            <Image
              style={styles.backButton}
              source={require("FieldsReact/app/images/BackButton/back_button.png")}
            />
          </TouchableOpacity>
          <Text style={styles.teamName}>{edit_profile}</Text>

         
        </View>

            <Text style={styles.headerText}>{username}</Text>
            <TextInput
              style={styles.textInput}
              maxLength={30}
              underlineColorAndroid="rgba(0,0,0,0)"
              placeholder={username}
              value={this.state.username}
              onChangeText={this.usernameHandle}
            />

            

            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => this.saveProfile()}
            >
              <Text style={styles.buttonText}>{save}</Text>
            </TouchableOpacity>
</View>
);
}
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(EditProfileScreen);
const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 10
},



teamName: {
    fontWeight: "bold",
    fontSize: 20,
    alignSelf: "center",
    marginStart: 12
  },

  backButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
   
  },
  backButton: {
    height: 48,
    width: 48,
    alignSelf: "center"
  },

  buttonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold"
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
  buttonContainer: {
    backgroundColor: "#3bd774",
    padding: 15,
    marginTop: 12,
    borderRadius: 10
  },
  headerText: {
    fontWeight: "bold",
    marginStart: 8,
    marginTop: 12
  },
});