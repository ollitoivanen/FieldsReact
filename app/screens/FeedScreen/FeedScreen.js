import React from "react";
import {
  StyleSheet,
  Platform,
  Image,
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity
} from "react-native";
import firebase from "react-native-firebase";
import { NavigationActions, StackActions } from "react-navigation";
import { connect } from "react-redux";
import { getUserData } from "FieldsReact/app/redux/app-redux.js";

import {
  not_in_a_team,
  not_at_any_field
} from "FieldsReact/app/strings/strings";
const mapStateToProps = state => {
  return {
    userData: state.userData,
    usersTeamData: state.usersTeamData
  };
};
const mapDispatchToProps = dispatch => {
  return {
    getUserData: () => dispatch(getUserData())
  };
};
class FeedScreen extends React.Component {
  componentWillUnmount() {
    this.unsubscribe();
  }
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    // this.props.getUserData();

    var { params } = this.props.navigation.state;

    this.unsubscribe = null;

    this.state = {
      currentUser: null,
      homeArea: "",
      loading: true
    };
  }
  componentWillMount() {
    const { currentUser } = firebase.auth();
    this.setState({ currentUser });
  }
  render() {
    const { currentUser } = this.state;

    var teamCard;

    if (this.props.userData.userTeamID !== null) {
      teamCard = (
        <TouchableOpacity
          style={styles.teamCard}
          onPress={() => this.props.navigation.navigate("TeamScreen")}
        >
          <Text style={styles.teamCardText}>
            {this.props.usersTeamData.teamUsername}
          </Text>
        </TouchableOpacity>
      );
    } else {
      teamCard = (
        <TouchableOpacity style={styles.teamCard}>
          <Text style={styles.teamCardText}>{not_in_a_team}</Text>
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.container}>
      <View style={styles.rowCont}>
      {teamCard}

      <TouchableOpacity
            style={styles.infoContainer}
            underlayColor="#bcbcbc"
            onPress={() => this.props.navigation.navigate("SearchScreen")}
          >
            <Image
              style={styles.infoIcon}
              source={require("FieldsReact/app/images/Search/search.png")}
            />
          </TouchableOpacity>

      </View>

        <Text
          style={styles.container1}
          onPress={() => firebase.auth().signOut()}
        >
          {this.props.userData.id}
        </Text>
        <View style={styles.navigationContainer}>
          <TouchableOpacity
            style={styles.navigationItem}
            underlayColor="#bcbcbc"
          >
            <Image
              style={styles.navigationImage}
              source={require("FieldsReact/app/images/Home/home_green.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navigationItemGreen}
            onPress={() => this.props.navigation.navigate("FieldSearchScreen", {fromEvent: false})}
          >
            <Image
              style={styles.navigationImage}
              source={require("FieldsReact/app/images/Field/field_icon.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navigationItem}
            onPress={() => this.props.navigation.navigate("ProfileScreen")}
          >
            <Image
              style={styles.navigationImage}
              source={require("FieldsReact/app/images/Profile/profile.png")}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeedScreen);

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: "white"
  },

  rowCont: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40
  },

  container1: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 60
  },
  navigationContainer: {
    backgroundColor: "white",
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end"
  },

  navigationItem: {
    flex: 1,
    height: 50,
    backgroundColor: "#f4fff8",
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

  infoContainer: {
   
    height: 36,
    width: 36,
    marginEnd: 15,
    marginStart: 5
  },

  infoIcon: {
    height: 36,
    width: 36
  },

  navigationImage: {
    height: 35,
    width: 35
  },

  teamCard: {
    padding: 20,
    backgroundColor: "white",
    borderWidth: 3,
    borderRadius: 5,
    borderColor: "#e0e0e0",
    marginHorizontal: 10,
    flex: 1
  },

  teamCardText: {
    fontWeight: "bold",
    color: "black"
  }
});
