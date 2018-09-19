import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
  Geolocation,
  Platform,
  AsyncStorage
} from "react-native";
import firebase from "react-native-firebase";

import { connect } from "react-redux";
import { getUserData } from "FieldsReact/app/redux/app-redux.js";

import { favorite_fields, no_favorite_fields } from "../../strings/strings";
import FieldSearchItem from "FieldsReact/app/components/FieldSearchItem/FieldSearchItem";
import TeamSearchItem from "FieldsReact/app/components/TeamSearchItem/TeamSearchItem";
import UserSearchItem from "FieldsReact/app/components/UserSearchItem/UserSearchItem";
import I18n from "FieldsReact/i18n";

import Permissions from "react-native-permissions";
import RNAndroidLocationEnabler from "react-native-android-location-enabler";

const mapStateToProps = state => {
  return {
    userData: state.userData,
    userHomeArea: state.userHomeArea
  };
};
const mapDispatchToProps = dispatch => {
  return {
    getUserData: () => dispatch(getUserData())
  };
};

class FavoriteFieldsScreen extends Component {
  /* getDistanceFromLatLonInKm = () => {
    deg2rad = deg => {
      return deg * (Math.PI / 180);
    };

    var { params } = this.props.navigation.state;

    var lat1 = params.lt;
    var lon1 = params.ln;

    var lat2 = this.state.userLatitude;
    var lon2 = this.state.userLongitude;

    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);

    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    console.warn(d)


    return d;
    //console.warn(d)
  };*/

  loadFavoriteFields(noAsync) {
    const ref = firebase.firestore().collection("Users");
    var { params } = this.props.navigation.state;

    var serializedData;

    if (noAsync == true) {
      let newFavoriteFields = [];

      const query = ref.doc(firebase.auth().currentUser.uid).collection("FF");
      query.get().then(
        function(doc) {
          doc.forEach(doc => {
            firebase
              .firestore()
              .collection("Fields")
              .doc(doc.id)
              .get()
              .then(invDoc => {
                const id = doc.id;
                newFavoriteFields.push({
                  key: id,
                  id: id,
                  fN: invDoc.data().fN,
                  fIm: invDoc.data().fIm
                });
                this.setState({ newFavoriteFields: newFavoriteFields });
                const alreadyVisited = [];
                serializedData = JSON.stringify(
                  this.state.newFavoriteFields,
                  function(key, value) {
                    if (typeof value == "object") {
                      if (alreadyVisited.indexOf(value.key) >= 0) {
                        // do something other that putting the reference, like
                        // putting some name that you can use to build the
                        // reference again later, for eg.
                        return value.key;
                      }
                      alreadyVisited.push(value.name);
                    }
                    return value;
                  }
                );
                this.storeData(serializedData);
              });
          });
        }.bind(this)
      );
    } else {
      let newFavoriteFields = [];

      var favoriteFields = this.state.favoriteFields;
      console.warn(favoriteFields, this.state.favoriteFields)
      favoriteFields.forEach(favoriteFields => {
        firebase
          .firestore()
          .collection("Fields")
          .doc(favoriteFields.id)
          .get()
          .then(doc => {
            var id = doc.id;
            const co = doc.data().co;
            var d = this.getDistanceFromLatLonInKm(co.latitude, co.longitude);

            newFavoriteFields.push({
              key: id,
              id: id,
              fN: doc.data().fN,
              // d: d,
              // fI: ,

              fIm: doc.data().fIm
            });
          })
          .then(() => {
            if (newFavoriteFields.length == this.state.favoriteFields.length) {
              const alreadyVisited = [];
              serializedData = JSON.stringify(newFavoriteFields, function(
                key,
                value
              ) {
                if (typeof value == "object") {
                  if (alreadyVisited.indexOf(value.key) >= 0) {
                    // do something other that putting the reference, like
                    // putting some name that you can use to build the
                    // reference again later, for eg.
                    return value.key;
                  }
                  alreadyVisited.push(value.name);
                }
                return value;
              });
              this.storeData(serializedData);
              this.setState({ refreshing: false });
            }
          });
      });
      // newFavoriteFields.sort((a, b) => parseFloat(a.d) - parseFloat(b.d));
    }
  }

  storeData = async data => {
    try {
      await AsyncStorage.setItem("favoriteFields", data).then(
        this.retrieveData()
      );
    } catch (error) {
      // Error saving data
    }
  };

  retrieveData = async () => {
    const value = await AsyncStorage.getItem("favoriteFields");
    if (value !== null) {
      this.setState({ favoriteFields: JSON.parse(value) });
    } else {
      this.loadFavoriteFields(true);
    }
  };

  static navigationOptions = {
    header: null
  };

  handleRefresh = () => {
    this.setState({ refreshing: true }, () => {
      this.loadFavoriteFields(false);
    });
  };

  //Needed when there's hella favoriteFields ;)
  /*renderFooter = () => {

    return (
      <View
        style={{
          paddingVertical: 20,
         
        }}
      >
      <Text style={styles.addNewFieldText}>{load_other}</Text>
      </View>
    );
  };*/

  constructor(props) {
    super(props);
    firebase.analytics().setCurrentScreen("FavoriteFieldsScreen", "FavoriteFieldsScreen");

    var { params } = this.props.navigation.state;

    this.state = {
      favoriteFields: [],
      newFavoriteFields: [],

      refreshing: false
    };

    this.retrieveData();
  }
  getDistanceFromLatLonInKm = (lat, lng) => {
    deg2rad = deg => {
      return deg * (Math.PI / 180);
    };

    var { params } = this.props.navigation.state;

    var lat1 = lat;
    var lon1 = lng;

    var lat2 = this.state.userLatitude;
    var lon2 = this.state.userLongitude;

    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);

    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = Math.round(R * c * 10) / 10; // Distance in km
    return d;
  };

  render() {
    var { params } = this.props.navigation.state;

    const openFieldDetail = item => {
      var { params } = this.props.navigation.state;

      firebase
        .firestore()
        .collection("Fields")
        .doc(item.id)
        .get()
        .then(doc => {
          const id = doc.id;
          const { fN, fI, fT, gC, fAT, pH, fIm, co } = doc.data();
          var d = this.getDistanceFromLatLonInKm(co.latitude, co.longitude);
          d = d + "km";

          if (fIm === true) {
            this.props.navigation.navigate("DetailFieldScreen", {
              fieldName: fN,
              fieldID: id,
              fieldType: fT,
              goalCount: gC,
              accessType: fAT,
              peopleHere: pH,
              currentFieldID: this.props.userData.cFI,
              currentFieldName: this.props.userData.cFN,
              timestamp: this.props.userData.ts,
              trainingCount: this.props.userData.tC,
              reputation: this.props.userData.re,
              fIm: fIm,
              lt: co.latitude,
              ln: co.longitude,
              d: undefined
            });
          } else {
            this.props.navigation.navigate("DetailFieldScreen", {
              fieldName: fN,
              fieldID: id,
              fieldType: fT,
              goalCount: gC,
              accessType: fAT,
              peopleHere: pH,
              currentFieldID: this.props.userData.cFI,
              currentFieldName: this.props.userData.cFN,
              timestamp: this.props.userData.ts,
              trainingCount: this.props.userData.tC,
              reputation: this.props.userData.re,
              fIm: fIm,
              lt: co.latitude,
              ln: co.longitude,
              d: undefined
            });
          }
        });
    };

    if (this.state.favoriteFields.length === 0) {
      var list = (
        <View style={styles.locationBox}>
          <TouchableOpacity>
            <Text style={styles.locationText}>
              {I18n.t("no_favorite_fields")}
            </Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      var list = (
        <FlatList
          onRefresh={this.handleRefresh}
          refreshing={this.state.refreshing}
          style={{ marginBottom: 50 }}
          data={this.state.favoriteFields}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => openFieldDetail(item)}
            >
              <FieldSearchItem {...item} />
            </TouchableOpacity>
          )}
        />
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.backButtonContainer}>
          <TouchableOpacity
            style={styles.backButton}
            underlayColor="#bcbcbc"
            onPress={() => this.props.navigation.goBack()}
          >
            <Image style={styles.backButton} source={{ uri: "back_button" }} />
          </TouchableOpacity>
          <Text style={styles.teamName}>{I18n.t("favorite_fields")}</Text>
        </View>
        {list}
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FavoriteFieldsScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },

  backButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 10
  },
  backButton: {
    height: 48,
    width: 48,
    alignSelf: "center"
  },
  teamName: {
    fontWeight: "bold",
    fontSize: 20,
    alignSelf: "center",
    marginStart: 12
  },
  locationBox: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  },

  locationText: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
    color: "#e0e0e0",
    margin: 20
  }
});
