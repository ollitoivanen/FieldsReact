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
  AsyncStorage,
  ActivityIndicator
} from "react-native";
import firebase from "react-native-firebase";
import * as RNIap from "react-native-iap";
import Loader from "FieldsReact/app/components/Loader/Loader.js";

import { connect } from "react-redux";
import { getUserData } from "FieldsReact/app/redux/app-redux.js";

import {
  near_me,
  set,
  enter_home_city,
  add_home_city_placeholder,
  search_fields_near,
  add_new_field,
  start_training,
  enable_location_to_find_nearest_fields,
  load_other,
  no_fields_found_nearby,
  fields,
  teams,
  users,
  search_teams,
  search_users,
  searchHeaders,
  no_teams_found_nearby,
  location_access_blocked
} from "../../strings/strings";
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
      .limit(25);

    query
      .get()
      .then(
        function(doc) {
          firebase.analytics().logEvent("fieldFetchFromDB");
          console.warn(doc.length);

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
        this.storeData(serializedData, "nearFields");
        this.setState({ refreshing: false });
      });
  }
  loadNearTeams() {
    const ref = firebase.firestore().collection("Teams");
    var { params } = this.props.navigation.state;
    const teams = [];

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
          firebase.analytics().logEvent("teamFetchFromDB");

          doc.forEach(doc => {
            const id = doc.id;
            const { tUN, co } = doc.data();
            var d = this.getDistanceFromLatLonInKm(co.latitude, co.longitude);
            if (d < 50) {
              d = d + "km";

              teams.push({
                key: doc.id,
                doc,
                id,
                username: tUN,
                co
              });
            }
            //Sorting the results! cool 2018
            teams.sort((a, b) => parseFloat(a.d) - parseFloat(b.d));
          });
        }.bind(this)
      )
      .then(() => {
        const alreadyVisited = [];
        serializedData = JSON.stringify(teams, function(key, value) {
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
        this.storeData(serializedData, "nearTeams");
        this.setState({ refreshing: false });
      });
  }

  search = () => {
    const users = [];

    const userRef = firebase.firestore().collection("Users");

    const query = userRef.where(
      "un",
      "==",
      this.state.searchTerm.toLowerCase().trim()
    );
    query.get().then(
      function(doc) {
        firebase.analytics().logEvent("userFetchFromDB");

        doc.forEach(doc => {
          const { un, fC, tC, re, cFI, cFN, uTI, ts, uTN, uIm } = doc.data();

          const id = doc.id;
          users.push({
            key: doc.id,
            doc,
            id,
            username: un,
            fC,
            tC,
            re,
            cFI,
            cFN,
            uTI,
            uTN,
            ts,
            uIm,
            index: 0
          });
        });
        this.setState({
          users
        });
      }.bind(this)
    );
  };

  storeData = async (data, name) => {
    try {
      await AsyncStorage.setItem(name, data).then(this.retrieveData(name));
    } catch (error) {
      // Error saving data
    }
  };

  retrieveData = async name => {
    try {
      const value = await AsyncStorage.getItem(name);

      if (value !== null) {
        if (name === "nearFields") {
          this.setState({ fields: JSON.parse(value) }),
            firebase.analytics().logEvent("fieldFetchFromAsync", value.length);

          if (JSON.parse(value).length === 0) {
            this.setState({ fieldsEmpty: true });
          }
        } else if (name === "nearTeams") {
          this.setState({ teams: JSON.parse(value) }),
            firebase.analytics().logEvent("teamFetchFromAsync", value.length);

          if (JSON.parse(value).length === 0) {
            this.setState({ teamsEmpty: true });
          }
        }
      } else {
        if (this.state.locationIOS === "authorized") {
          if (Platform.OS === "android") {
            this.setState({ locationIOS: "denied" });
          } else {
            this.setState({ locationIOS: "undetermined" });
          }
        }
      }
    } catch (error) {
      // Error retrieving data
    }
  };

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
          } else if (data == "already-enabled") {
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

  changeIndex = index => {
    this.setState({ selectedIndex: index });
    if (index === 0) {
      this.retrieveData("nearFields");
    } else if (index === 1) {
      this.retrieveData("nearTeams");
    }
  };

  getLocationPure = () => {

   // this.setState({ loading: true });
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({ loading: false }),
          firebase.analytics().logEvent("locationEnabled");

        if (position.coords.latitude !== 0 && position.coords.longitude !== 0) {
          this.setState({
            userLatitude: position.coords.latitude,
            userLongitude: position.coords.longitude,
            locationIOS: "authorized",
            error: null
          });
          if (this.state.selectedIndex === 0) {
            this.loadNearFields();
          } else if (this.state.selectedIndex === 1) {
            this.loadNearTeams();
          }
        } else {
        }
      },
      error => {
        console.warn("errror")

        this.setState({ locationIOS: "disabled", loading: false })
        //  firebase.analytics().logEvent("locationDisabled");
      },
      { enableHighAccuracy: false, timeout: 20000 }
    );
  };

  getLocation = () => {
    Permissions.check("location").then(response => {
      if (response === "denied") {
        this.setState({ locationIOS: "denied" }),
          firebase.analytics().logEvent("locationDenied");
      } else if (response === "authorized") {
        //
        //
        navigator.geolocation.getCurrentPosition(
          position => {

            this.setState({ loading: false }),
            firebase.analytics().logEvent("locationEnabled"),

              firebase.analytics().logEvent("locationAuthorized");

            if (
              position.coords.latitude !== 0 &&
              position.coords.longitude !== 0
            ) {
              //Test
              this.setState({
                userLatitude: position.coords.latitude,
                userLongitude: position.coords.longitude,
                locationIOS: "authorized",
                error: null
              });
              if (this.state.selectedIndex === 0) {
                this.loadNearFields();
              } else if (this.state.selectedIndex === 1) {
                this.loadNearTeams();
              }
            } else {
            }
          },
          error => {

            this.setState({ loading: false }),             firebase.analytics().logEvent("locationDisabled");

            this.setState({ locationIOS: "disabled" });
          },
          { enableHighAccuracy: false, timeout: 20000 }
        );
      } else if (response === "undetermined") {
        if (Platform.OS == "android") {
          this.setState({ locationIOS: "denied" });
        } else {
          this.setState({ locationIOS: "undetermined" });
        }
      } else if (response === "restricted") {
        //Write the logic to open kmsion

        this.setState({ locationIOS: "restricted" });
      }
      // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
    });
  };

  openFavorite = () => {
    promise1 = RNIap.initConnection();
    Promise.all([promise1]).then(() => {
      RNIap.getAvailablePurchases()
        .then(purchases => {
          var state = purchases[0].autoRenewingAndroid;

          if (state == true) {
            RNIap.endConnection();

            this.props.navigation.navigate("FavoriteFieldsScreen");
          } else {
            if (this.props.userData.fP === true) {
              promise1 = firebase
                .firestore()
                .collection("Users")
                .doc(firebase.auth().currentUser.uid)
                .update({
                  fP: false
                });
              promise2 = AsyncStorage.removeItem("fP");
              promise3 = this.props.getUserData();

              Promise.all([promise1, promise2, promise3]).then(() => {
                RNIap.endConnection();
                 firebase.analytics().logEvent("toFieldsPlusScreen", "fromFieldSearch");

                this.props.navigation.navigate("FieldsPlusScreen");
              });
            } else {
              RNIap.endConnection();
               firebase.analytics().logEvent("toFieldsPlusScreen", "fromFieldSearch");

              this.props.navigation.navigate("FieldsPlusScreen");
            }
          }
        })
        .catch(() => {
          RNIap.endConnection();
          firebase.analytics().logEvent("toFieldsPlusScreen", "fromFieldSearch");

          this.props.navigation.navigate("FieldsPlusScreen");
        });
    });
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
  };

  handleRefresh = () => {
    this.setState({ refreshing: true, loading: true }, () => {
      this.getLocation();
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
    firebase.analytics().setCurrentScreen("FieldSearchScreen", "FieldSearchScreen");

    var { params } = this.props.navigation.state;

    this.state = {
      fields: [],
      teams: [],
      users: [],
      userLatitude: 0,
      userLongitude: 0,
      locationIOS: "authorized",
      refreshing: false,
      fieldsEmpty: false,
      teamsEmpty: false,
      selectedIndex: params.selectedIndex,
      loading: false
    };

    if (params.selectedIndex === 0) {
      this.retrieveData("nearFields");
    } else if (params.selectedIndex === 1) {
      this.retrieveData("nearTeams");
    }

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
         firebase.analytics().logEvent("toFieldDetail");

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

    if (this.state.selectedIndex === 0) {
      var filterBox = (
        <View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <Text style={styles.bigText}>
              {I18n.t(["searchHeaders", this.state.selectedIndex])}
            </Text>
            <TouchableOpacity
              style={styles.infoContainer}
              onPress={() => this.openFavorite()}
            >
              <Image
                style={styles.infoIcon}
                source={{ uri: "favorite_bordered" }}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.filterBox}>
            <TouchableOpacity style={styles.filterItem}>
              <Text style={styles.filterTextSelected}>{I18n.t("fields")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.filterItem}
              onPress={() => this.changeIndex(1)}
            >
              <Text style={styles.filterText}>{I18n.t("teams")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.filterItem}
              onPress={() => this.changeIndex(2)}
            >
              <Text style={styles.filterText}>{I18n.t("users")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else if (this.state.selectedIndex === 1) {
      var filterBox = (
        <View>
          <Text style={styles.bigText}>
            {I18n.t(["searchHeaders", this.state.selectedIndex])}
          </Text>
          <View style={styles.filterBox}>
            <TouchableOpacity
              style={styles.filterItem}
              onPress={() => this.changeIndex(0)}
            >
              <Text style={styles.filterText}>{I18n.t("fields")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterItem}>
              <Text style={styles.filterTextSelected}>{I18n.t("teams")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.filterItem}
              onPress={() => this.changeIndex(2)}
            >
              <Text style={styles.filterText}>{I18n.t("users")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else if (this.state.selectedIndex === 2) {
      var filterBox = (
        <View>
          <TextInput
            clearButtonMode={"always"}
            style={styles.searchBar}
            placeholder={I18n.t("search_users")}
            onChangeText={searchTerm => this.setState({ searchTerm })}
            underlineColorAndroid="rgba(0,0,0,0)"
            value={this.state.searchTerm}
            onSubmitEditing={() => this.search()}
            returnKeyType={"search"}
            spellCheck={false}
            autoCapitalize={"none"}
          />
          <View style={styles.filterBox}>
            <TouchableOpacity
              style={styles.filterItem}
              onPress={() => this.changeIndex(0)}
            >
              <Text style={styles.filterText}>{I18n.t("fields")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.filterItem}
              onPress={() => this.changeIndex(1)}
            >
              <Text style={styles.filterText}>{I18n.t("teams")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterItem}>
              <Text style={styles.filterTextSelected}>{I18n.t("users")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    if (params.fromEvent !== true) {
      var navigation = (
        <View style={styles.navigationContainer}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("FeedScreen", {})}
            style={styles.navigationItem}
            underlayColor="#bcbcbc"
          >
            <Image style={styles.navigationImage} source={{ uri: "home" }} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navigationItemBlue}>
            <Image
              style={styles.navigationImage}
              source={{ uri: "field_icon" }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navigationItem}
            onPress={() => this.props.navigation.navigate("ProfileScreen", {})}
          >
            <Image style={styles.navigationImage} source={{ uri: "profile" }} />
          </TouchableOpacity>
        </View>
      );
    } else {
      var navigation = null;
    }

    addNewFieldBox = null;

    if (this.state.selectedIndex === 0) {
      var addNewFieldBox = (
        <TouchableOpacity
          style={styles.addNewFieldBox}
          onPress={() =>
            this.props.navigation.navigate("CreateNewFieldScreen", {
              lt: null,
              ln: null
            })
          }
        >
          <Text style={styles.addNewFieldText}>{I18n.t("add_new_field")}</Text>
        </TouchableOpacity>
      );

      if (this.state.locationIOS === null) {
        var list = <View />;
      } else if (this.state.locationIOS === "authorized") {
        if (this.state.fieldsEmpty === false) {
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
                <Text style={styles.locationText}>
                  {I18n.t("no_fields_found_nearby")}
                </Text>
              </TouchableOpacity>
            </View>
          );
        }
      } else if (this.state.locationIOS === "denied") {
        if (Platform.OS == "android") {
          var list = (
            <View style={styles.locationBox}>
              <TouchableOpacity onPress={() => this.getLocationPure()}>
                <Text style={styles.locationText}>
                  {I18n.t("enable_location_to_find_nearest_fields") +
                    " " +
                    I18n.t("no_location_permission")}
                </Text>
              </TouchableOpacity>
            </View>
          );
        } else {
          var list = (
            <View style={styles.locationBox}>
              <TouchableOpacity onPress={() => Permissions.openSettings()}>
                <Text style={styles.locationText}>
                  {I18n.t("enable_location_to_find_nearest_fields") +
                    " " +
                    I18n.t("no_location_permission")}
                </Text>
              </TouchableOpacity>
            </View>
          );
        }
      } else if (this.state.locationIOS === "undetermined") {
        var list = (
          <View style={styles.locationBox}>
            <TouchableOpacity onPress={() => this.getLocationPure()}>
              <Text style={styles.locationText}>
                {I18n.t("enable_location_to_find_nearest_fields") +
                  " " +
                  I18n.t("no_location_permission")}
              </Text>
            </TouchableOpacity>
          </View>
        );
      } else if (this.state.locationIOS === "disabled") {
        var list = (
          <View style={styles.locationBox}>
            <TouchableOpacity onPress={() => this.showdialog()}>
              <Text style={styles.locationText}>
                {I18n.t("enable_location_to_find_nearest_fields") +
                  " " +
                  I18n.t("location_off")}
              </Text>
            </TouchableOpacity>
          </View>
        );
      } else if (this.state.locationIOS === "restricted") {
        var list = (
          <View style={styles.locationBox}>
            <TouchableOpacity onPress={() => this.showdialog()}>
              <Text style={styles.locationText}>
                {I18n.t("location_access_blocked")}
              </Text>
            </TouchableOpacity>
          </View>
        );
      }
    } else if (this.state.selectedIndex === 1) {
      if (this.state.locationIOS === null) {
        var list = <View />;
      } else if (this.state.locationIOS === "authorized") {
        if (this.state.teamsEmpty === false) {
          var list = (
            <FlatList
              onRefresh={this.handleRefresh}
              refreshing={this.state.refreshing}
              style={{ marginBottom: 50 }}
              data={this.state.teams}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => {
                    this.props.navigation.navigate("DetailTeamScreen", {
                      teamUsername: item.username,
                      teamFullName: item.teamFullName,
                      teamID: item.id
                    });
                       firebase.analytics().logEvent("toTeamDetail");
                  }}
                >
                  <TeamSearchItem {...item} />
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
                data={this.state.teams}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.item}
                    onPress={() => openFieldDetail(item)}
                  >
                    <TeamSearchItem {...item} />
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity style={styles.locationBox}>
                <Text style={styles.locationText}>
                  {I18n.t("no_teams_found_nearby")}
                </Text>
              </TouchableOpacity>
            </View>
          );
        }
      } else if (this.state.locationIOS === "denied") {
        if (Platform.OS == "android") {
          var list = (
            <View style={styles.locationBox}>
              <TouchableOpacity onPress={() => this.getLocationPure()}>
                <Text style={styles.locationText}>
                  {I18n.t("enable_location_to_find_nearest_teams") +
                    " " +
                    I18n.t("no_location_permission")}
                </Text>
              </TouchableOpacity>
            </View>
          );
        } else {
          var list = (
            <View style={styles.locationBox}>
              <TouchableOpacity onPress={() => Permissions.openSettings()}>
                <Text style={styles.locationText}>
                  {I18n.t("enable_location_to_find_nearest_teams") +
                    " " +
                    I18n.t("no_location_permission")}
                </Text>
              </TouchableOpacity>
            </View>
          );
        }
      } else if (this.state.locationIOS === "undetermined") {
        var list = (
          <View style={styles.locationBox}>
            <TouchableOpacity onPress={() => this.getLocationPure()}>
              <Text style={styles.locationText}>
                {I18n.t("enable_location_to_find_nearest_teams") +
                  " " +
                  I18n.t("no_location_permission")}
              </Text>
            </TouchableOpacity>
          </View>
        );
      } else if (this.state.locationIOS === "disabled") {
        var list = (
          <View style={styles.locationBox}>
            <TouchableOpacity onPress={() => this.showdialog()}>
              <Text style={styles.locationText}>
                {I18n.t("enable_location_to_find_nearest_teams") +
                  " " +
                  I18n.t("location_off")}
              </Text>
            </TouchableOpacity>
          </View>
        );
      } else if (this.state.locationIOS === "restricted") {
        var list = (
          <View style={styles.locationBox}>
            <TouchableOpacity onPress={() => this.showdialog()}>
              <Text style={styles.locationText}>
                {I18n.t("location_access_blocked")}
              </Text>
            </TouchableOpacity>
          </View>
        );
      }
    } else if (this.state.selectedIndex === 2) {
      var list = (
        <FlatList
          style={{ marginBottom: 50 }}
          data={this.state.users}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() =>
                this.props.navigation.navigate("DetailProfileScreen", {
                  uTI: item.uTI,
                  uTN: item.uTN,
                  un: item.username,
                  tC: item.tC,
                  cFI: item.cFI,
                  cFN: item.cFN,
                  ts: item.ts,
                  id: item.id,
                  uIm: item.uIm,
                  re: item.re
                })
              }
            >
              <UserSearchItem {...item} />
            </TouchableOpacity>
          )}
        />
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          {filterBox}

          {addNewFieldBox}
        </View>
        {list}
        <Loader loading={this.state.loading} />

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

  filterBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
    marginBottom: 10,
    marginHorizontal: 10,
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: "#e0e0e0"
  },

  filterItem: {
    flexGrow: 1,
    alignItems: "center",
    textAlign: "center",
    flex: 1,
    padding: 10
  },

  filterText: {
    fontWeight: "bold",
    color: "#e0e0e0"
  },

  filterTextSelected: {
    fontWeight: "bold",
    color: "#3bd774"
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
    color: "#6b6b6b",
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
    margin: 29,
    marginEnd: 24,
    fontSize: 22,
    fontWeight: "bold"
  },
  infoContainer: {
    height: 28,
    width: 28,
    marginEnd: 24
  },

  infoIcon: {
    height: 28,
    width: 28
  }
});
