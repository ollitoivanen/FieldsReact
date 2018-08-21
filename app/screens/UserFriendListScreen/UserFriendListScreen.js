import React, { Component } from "react";
import { StyleSheet, View, Text, FlatList, AsyncStorage, TouchableOpacity, Image } from "react-native";
import UserFriendListItem from "FieldsReact/app/components/UserFriendListItem/UserFriendListItem"; // we'll create this next
import {
   friends
  } from "../../strings/strings";
  import firebase from "react-native-firebase";


export default class UserFriendListScreen extends Component {
    static navigationOptions = {
        header: null
      };
  constructor(props) {
    super(props);
    this.retrieveData();
    this.state = {
      friends: []
    };
  }

  retrieveData = async () => {
    var { params } = this.props.navigation.state;

    const value = await AsyncStorage.getItem("friends");
    if (value !== null) {
      let friendArray = JSON.parse(value);
      this.setState({ friends: friendArray });
    }
  };


  openDetailUser = (id) => {
      firebase.firestore().collection("Users").doc(id).get().then(doc=>{
        this.props.navigation.navigate("DetailProfileScreen", {
            uTI: doc.data().uTI,
            uTN: doc.data().uTN,
            un: doc.data().un,
            tC: doc.data().tC,
            cFI: doc.data().cFI,
            cFN: doc.data().cFN,
            ts: doc.data().ts,
            id: id
          })
      }).then(()=>{
          
      })


      
  }


  render() {
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
          <Text style={styles.teamName}>{friends}</Text>
        </View>
        <FlatList
          data={this.state.friends}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => this.openDetailUser(item.fI)
                
              }
            >
              <UserFriendListItem {...item} />
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },

  item: {
    width: "100%"
  },

  backButtonContainer: {
    flexDirection: "row",
    paddingVertical: 20,
    paddingHorizontal: 10
  },
  backButton: {
    height: 48,
    width: 48
  },

  teamName: {
    fontWeight: "bold",
    fontSize: 20,
    alignSelf: "center",
    marginStart: 12
  },
});