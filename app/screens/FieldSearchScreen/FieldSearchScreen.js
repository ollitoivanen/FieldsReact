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
import { ButtonGroup } from "react-native-elements";

import { connect } from "react-redux";
import { getUserData } from "FieldsReact/app/redux/app-redux.js";

import {
  field_city_cap,
  field_name_cap,
  near_me,
  set,
  enter_home_city,
  add_home_city_placeholder,
  search_fields_near,
  add_new_field,
  start_training,
  enable_location_to_find_nearest_fields,
  load_other,
  no_fields_found_nearby
} from "../../strings/strings";
import FieldSearchItem from "FieldsReact/app/components/FieldSearchItem/FieldSearchItem"; // we'll create this next
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

class FieldSearchScreen extends Component {
  loadNearFields() {
    const ref = firebase.firestore().collection("Fields");
    var { params } = this.props.navigation.state;
    const fields = [];

    var serializedData;

    const southWest = new firebase.firestore.GeoPoint(
      this.state.userLatitude - 0.2,
      this.state.userLongitude - 0.2
    );
    const northEast = new firebase.firestore.GeoPoint(
      this.state.userLatitude + 0.2,
      this.state.userLongitude + 0.2
    );

    const query = ref
      .where("co", ">=", southWest)
      .where("co", "<=", northEast)
      .limit(10);

    query
      .get()
      .then(
        function(doc) {
          doc.forEach(doc => {
            const id = doc.id;
            const { fN, fI, fT, gC, fAT, pH, fIm, co } = doc.data();
            var d = this.getDistanceFromLatLonInKm(co.latitude, co.longitude);
            if (d < 50) {
              d = d + "km";

              if (fIm === true) {
                fields.push({
                  key: doc.id,
                  doc,
                  id,
                  fN,
                  fI,

                  fT,
                  gC,
                  fAT,
                  pH,
                  fIm,
                  lt: co.latitude,
                  ln: co.longitude,
                  d
                });
              } else {
                fields.push({
                  key: doc.id,
                  doc,
                  id,
                  fN,
                  fI,

                  fT,
                  gC,
                  fAT,
                  pH,
                  fIm,
                  lt: co.latitude,
                  ln: co.longitude,
                  d
                });
              }
            }
            //Sorting the results! cool 2018
            fields.sort((a, b) => parseFloat(a.d) - parseFloat(b.d));
          });
        }.bind(this)
      )
      .then(() => {
        const alreadyVisited = [];
        serializedData = JSON.stringify(fields, function(key, value) {
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
      })

      .then(() => {
        this.storeData(serializedData);
        this.setState({ refreshing: false });
      });
  }

  storeData = async data => {
    try {
      await AsyncStorage.setItem("nearFields", data).then(this.retrieveData());
    } catch (error) {
      // Error saving data
    }
  };

  retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem("nearFields");
      if (value !== null) {
        this.setState({ fields: JSON.parse(value) });
        if (JSON.parse(value).length === 0) {
          this.setState({ empty: true });
        }
      } else {
        this.loadNearFields();
      }
    } catch (error) {
      // Error retrieving data
    }
  };
  componentDidMount() {
    Permissions.check("location").then(response => {
      if (response === "denied") {
        this.setState({ locationIOS: "denied" });
      } else if (response === "authorized") {
        this.getLocation();
      } else if (response === "undetermined") {
        if (Platform.OS == "android") {
          this.setState({ locationIOS: "denied" });
        } else {
          this.setState({ locationIOS: "undetermined" });
        }
      } else if (response === "restricted") {
        //Write the logic to open permission
        this.setState({ locationIOS: "restricted" });
      }
      // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
    });
  }

  showdialog = () => {
    if (Platform.OS == "android") {
      RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
        interval: 10000,
        fastInterval: 5000
      })
        .then(data => {
          if (data == "enabled") {
            this.setState({ locationIOS: "authorized" });
            this.getLocation();
          }
          // The user has accepted to enable the location services
          // data can be :
          //  - "already-enabled" if the location services has been already enabled
          //  - "enabled" if user has clicked on OK button in the popup
        })
        .catch(err => {
          // The user has not accepted to enable the location services or something went wrong during the process
          // "err" : { "code" : "ERR00|ERR01|ERR02", "message" : "message"}
          // codes :
          //  - ERR00 : The user has clicked on Cancel button in the popup
          //  - ERR01 : If the Settings change are unavailable
          //  - ERR02 : If the popup has failed to open
        });
    }
  };

  static navigationOptions = {
    header: null
  };

  getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          userLatitude: position.coords.latitude,
          userLongitude: position.coords.longitude,
          locationIOS: "authorized",
          error: null
        }),
          this.retrieveData();
      },
      error => {
        this.setState({ locationIOS: "disabled" });
      },
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 0 }
    );
  };

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

    //console.warn(d)
  };

  handleRefresh = () => {
    this.setState({ refreshing: true }, () => {
      this.loadNearFields();
    });
  };

  //Needed when there's hella fields ;)
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
    var { params } = this.props.navigation.state;

    this.state = {
      fields: [],
      userLatitude: 0,
      userLongitude: 0,
      locationIOS: null,
      refreshing: false,
      empty: false
    };

    this.ref = firebase
      .firestore()
      .collection("Users")
      .doc(firebase.auth().currentUser.uid);
  }

  render() {
    var { params } = this.props.navigation.state;

    const openFieldDetail = item => {
      var { params } = this.props.navigation.state;

      if (params.fromEvent === false) {
        this.props.navigation.navigate("DetailFieldScreen", {
          fieldName: item.fN,
          fieldID: item.id,
          fieldType: item.fT,
          goalCount: item.gC,
          accessType: item.fAT,
          peopleHere: item.pH,
          currentFieldID: this.props.userData.cFI,
          currentFieldName: this.props.userData.cFN,
          timestamp: this.props.userData.ts,
          trainingCount: this.props.userData.tC,
          reputation: this.props.userData.re,
          fIm: item.fIm,
          lt: item.lt,
          ln: item.ln,
          d: item.d
        });
      } else {
        this.props.navigation.navigate("CreateEventScreen", {
          fieldName: item.fN,
          fieldID: item.id
        });

        //Add field data here next. things are going great!
      }
    };

    if (params.fromEvent !== true) {
      var navigation = (
        <View style={styles.navigationContainer}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("FeedScreen", {})}
              style={styles.navigationItem}
              underlayColor="#bcbcbc"
            >
              <Image
                style={styles.navigationImage}
                source={{uri: 'home'}}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navigationItemBlue}>
              <Image
                style={styles.navigationImage}
                source={{uri: 'field_icon'}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.navigationItem}
              onPress={() =>
                this.props.navigation.navigate("ProfileScreen", {})
              }
            >
              <Image
                style={styles.navigationImage}
                source={{uri: 'profile'}}
              />
            </TouchableOpacity>
        </View>
      );
    } else {
      var navigation = null;
    }

    if (this.state.locationIOS === null) {
      var list = <View />;
    } else if (this.state.locationIOS === "authorized") {
      if (this.state.empty === false) {
        var list = (
          <FlatList
            onRefresh={this.handleRefresh}
            refreshing={this.state.refreshing}
            style={{ marginBottom: 50 }}
            data={this.state.fields}
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
      } else {
        var list = (
          <View style={{ flex: 1 }}>
            <FlatList
              onRefresh={this.handleRefresh}
              refreshing={this.state.refreshing}
              style={{ marginBottom: 50 }}
              data={this.state.fields}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => openFieldDetail(item)}
                >
                  <FieldSearchItem {...item} />
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.locationBox}
              onPress={() =>
                this.props.navigation.navigate("CreateNewFieldScreen", {
                  lt: null,
                  ln: null
                })
              }
            >
              <Text style={styles.locationText}>{no_fields_found_nearby}</Text>
            </TouchableOpacity>
          </View>
        );
      }
    } else if (this.state.locationIOS === "denied") {
      if (Platform.OS == "android") {
        var list = (
          <View style={styles.locationBox}>
            <TouchableOpacity onPress={() => this.getLocation()}>
              <Text style={styles.locationText}>
                {enable_location_to_find_nearest_fields}
              </Text>
            </TouchableOpacity>
          </View>
        );
      } else {
        var list = (
          <View style={styles.locationBox}>
            <TouchableOpacity onPress={() => Permissions.openSettings()}>
              <Text style={styles.locationText}>
                {enable_location_to_find_nearest_fields}
              </Text>
            </TouchableOpacity>
          </View>
        );
      }
    } else if (this.state.locationIOS === "undetermined") {
      var list = (
        <View style={styles.locationBox}>
          <TouchableOpacity onPress={() => this.getLocation()}>
            <Text style={styles.locationText}>
              {enable_location_to_find_nearest_fields}
            </Text>
          </TouchableOpacity>
        </View>
      );
    } else if (this.state.locationIOS === "disabled") {
      var list = (
        <View style={styles.locationBox}>
          <TouchableOpacity onPress={() => this.showdialog()}>
            <Text style={styles.locationText}>
              {enable_location_to_find_nearest_fields}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Text style={styles.bigText}>{start_training}</Text>
          <TouchableOpacity
            style={styles.addNewFieldBox}
            onPress={() =>
              this.props.navigation.navigate("CreateNewFieldScreen", {
                lt: null,
                ln: null
              })
            }
          >
            <Text style={styles.addNewFieldText}>{add_new_field}</Text>
          </TouchableOpacity>
        </View>
        {list}

        {navigation}
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FieldSearchScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
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
  },

    

    navigationContainer: {
      ...Platform.select({
        ios: {
          bottom: 0,
    position: "absolute",
    width: "100%",
    flex: 1,
          backgroundColor: "white",
          flexDirection: "row",
          shadowOffset: { width: 0, height: -1 },
          shadowOpacity: 0.1,
          shadowRadius: 3
        },
        android: {
          bottom: 0,
    position: "absolute",
    width: "100%",
    flex: 1,
          backgroundColor: "white",
          flexDirection: "row",
          alignItems: "flex-end",
          elevation: 10
        }
      })
    },
  

  searchBar: {
    backgroundColor: "white",
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: "#e0e0e0",
    margin: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    marginTop: 20,
    marginStart: 10,
    marginEnd: 10,
    fontWeight: "bold",
    height: 60,
    fontSize: 20
  },

  searchContainer: {
    backgroundColor: "#3bd774",
    paddingVertical: 10
  },

  filter: {
    fontWeight: "bold",
    backgroundColor: "red"
  },

  addHomeCityCard: {
    bottom: 100,
    position: "absolute",
    width: "100%",
    flex: 1
  },

  buttonContainer: {
    backgroundColor: "#3bd774",
    padding: 15,
    marginTop: 12,
    borderRadius: 10,
    marginHorizontal: 10
  },

  buttonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: 20
  },

  blackText: {
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    color: "#8e8e8e",
    marginTop: 24
  },
  homeAddContainer: {
    padding: 20
  },

 

  navigationItem: {
    flex: 1,
    height: 50,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center"
  },

  navigationItemBlue: {
    flex: 1,
    height: 50,
    backgroundColor: "#3facff",
    alignItems: "center",
    justifyContent: "center"
  },

  navigationImage: {
    height: 35,
    width: 35
  },

  item: {
    width: "100%"
  },

  addNewFieldBox: {
    backgroundColor: "white",
    padding: 10,
    marginTop: 0,
    marginHorizontal: 10,
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: "#e0e0e0"
  },

  addNewFieldText: {
    color: "#3facff",
    fontWeight: "bold",
    textAlign: "center"
  },
  bigText: {
    color: "black",
    margin: 24,
    fontSize: 22,
    fontWeight: "bold"
  }
});
