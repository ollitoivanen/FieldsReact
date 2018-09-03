import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  Image
} from "react-native";
import firebase from "react-native-firebase";
import { ButtonGroup } from "react-native-elements";

import { connect } from "react-redux";
import { getUserData } from "FieldsReact/app/redux/app-redux.js";

import {
  teams,
  users,
  search_users,
  search_teams
} from "../../strings/strings";
import SearchItem from "FieldsReact/app/components/SearchItem/SearchItem"; // we'll create this next

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

class SearchScreen extends Component {
  componentWillMount() {
    var { params } = this.props.navigation.state;

    this.updateIndex(params.selectedIndex);
  }
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    var { params } = this.props.navigation.state;

    this.state = {
      selectedIndex: params.selectedIndex,
      searchTerm: "",
      teams: [],
      users: [],
      search_placeholder: search_users
    };
  }

  updateIndex = selectedIndex => {
    this.setState({ selectedIndex });
    if (selectedIndex === 0) {
      this.setState({ search_placeholder: search_users, searchTerm: "" });
    } else if (selectedIndex === 1) {
      this.setState({ search_placeholder: search_teams, searchTerm: "" });
    }
  };

  search = () => {
    const users = [];
    const teams = [];

    const userRef = firebase.firestore().collection("Users");
    const teamRef = firebase.firestore().collection("Teams");

    if (this.state.selectedIndex === 0) {
      const query = userRef.where(
        "un",
        "==",
        this.state.searchTerm.toLowerCase().trim()
      );
      query.get().then(
        function(doc) {
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
    } else if (this.state.selectedIndex === 1) {
      const query = teamRef.where(
        "tUN",
        "==",
        this.state.searchTerm.toLowerCase().trim()
      );
      query.get().then(
        function(doc) {
          doc.forEach(doc => {
            const id = doc.id;
            const { tUN, tFN } = doc.data();
            teams.push({
              key: doc.id,
              doc,
              id,
              username: tUN,
              teamFullName: tFN,
              index: 1
            });
          });
          this.setState({
            teams
          });
        }.bind(this)
      );
    }
  };

  render() {
    var { params } = this.props.navigation.state;

    const buttons = [[users], [teams]];
    const { selectedIndex } = this.state;
    let input;

    if (this.state.selectedIndex === 0) {
      var searchList = (
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
                  uIm: item.uIm
                })
              }
            >
              <SearchItem {...item} />
            </TouchableOpacity>
          )}
        />
      );
    } else if (this.state.selectedIndex === 1) {
      var searchList = (
        <FlatList
          style={{ marginBottom: 50 }}
          data={this.state.teams}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() =>
                this.props.navigation.navigate("DetailTeamScreen", {
                  teamUsername: item.username,
                  teamFullName: item.teamFullName,
                  teamID: item.id
                })
              }
            >
              <SearchItem {...item} />
            </TouchableOpacity>
          )}
        />
      );
    }

    var navigation = (
      <View style={styles.navigationContainer}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("FeedScreen", {})}
              style={styles.navigationItem}
              underlayColor="#bcbcbc"
            >
              <Image
                style={styles.navigationImage}
                source={{uri:'home'}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.navigationItemGreen}
              onPress={() =>
                this.props.navigation.navigate("FieldSearchScreen", {
                  fromEvent: false
                })
              }
            >
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

    return (
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <View style={styles.searchRow}>
            <TextInput
              clearButtonMode={"always"}
              style={styles.searchBar}
              placeholder={this.state.search_placeholder}
              onChangeText={searchTerm => this.setState({ searchTerm })}
              underlineColorAndroid="rgba(0,0,0,0)"
              value={this.state.searchTerm}
              onSubmitEditing={() => this.search()}
              returnKeyType={"search"}
              spellCheck={false}
              autoCapitalize={"none"}
            />

            <TouchableOpacity onPress={() => this.search()}>
              <Image
                style={styles.button}
                source={require("FieldsReact/app/images/Forward/forward_white.png")}
              />
            </TouchableOpacity>
          </View>
          <ButtonGroup
            onPress={this.updateIndex}
            selectedIndex={selectedIndex}
            buttons={buttons}
            buttonStyle={{ height: 40 }}
            selectedTextStyle={{ color: "#3bd774", fontWeight: "bold" }}
            textStyle={{ color: "#c4c4c4", fontWeight: "bold" }}
            innerBorderStyle={{ width: 0 }}
          />
        </View>

        {searchList}

        {navigation}
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },

  button: {
    height: 48,
    width: 48,
    alignSelf: "center",
    marginTop: 4,
    marginEnd: 10
  },

  navigationContainer: {
    bottom: 0,
    position: "absolute",
    width: "100%",
    flex: 1,
    backgroundColor: "white",
    flexDirection: "row",
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,

    elevation: 10
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
    fontSize: 20,
    flex: 1
  },

  searchText: {
    color: "#3facff",
    fontWeight: "bold",
    margin: 5,
    textAlign: "center"
  },

  searchTextBox: {
    backgroundColor: "white",
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: "#e0e0e0",
    margin: 5,
    height: 60,
    marginTop: 20,
    marginBottom: 10,
    marginEnd: 10,
    justifyContent: "center"
  },

  searchRow: {
    flexDirection: "row",
    alignItems: "center"
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

  navigationItemGreen: {
    flex: 1,
    height: 50,
    backgroundColor: "#3bd774",
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
    marginTop: 8,
    marginHorizontal: 10,
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: "#e0e0e0"
  },

  addNewFieldText: {
    color: "#3facff",
    fontWeight: "bold",
    textAlign: "center"
  }
});
