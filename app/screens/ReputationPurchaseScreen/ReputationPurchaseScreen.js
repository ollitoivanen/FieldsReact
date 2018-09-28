import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  ScrollView,
  Platform,
  ActivityIndicator
} from "react-native";
import I18n from "FieldsReact/i18n";
import * as RNIap from "react-native-iap";
import firebase from "react-native-firebase";
import { connect } from "react-redux";

import { getUserData } from "FieldsReact/app/redux/app-redux.js";

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

var prices = [];

class ReputationPurchaseScreen extends Component {
  constructor(props) {
    super(props);
    firebase
      .analytics()
      .setCurrentScreen("ReputationPurchaseScreen", "ReputationPurchaseScreen");
    this.state = { prices: null };
  }
  async componentDidMount() {
    const itemSkus = Platform.select({
      ios: [
        "reputation_pack_1",
        "reputation_pack_2",
        "reputation_pack_3",
        "reputation_pack_4",
        "reputation_pack_5",
        "reputation_pack_6"
      ],
      android: [
        "reputation_pack_1",
        "reputation_pack_2",
        "reputation_pack_3",
        "reputation_pack_4",
        "reputation_pack_5",
        "reputation_pack_6"
      ]
    });
    try {
      await RNIap.initConnection();

      await RNIap.getProducts(itemSkus).then(products => {
        console.warn(products);
        for (i = 0; i < products.length; i++) {
          prices.push(products[i].price);
        }
        this.setState({ prices: prices, currency: products[0].currency });
      });
      this.setState({ products });
    } catch (err) {}
  }
  componentWillUnmount() {
    RNIap.endConnection();
  }
  static navigationOptions = {
    header: null
  };

  buy = id => {
    firebase.analytics().logEvent("rep_buying_init");
    var currentRep = this.props.userData.re;
    if (id === "reputation_pack_1") {
      var rep = 300;
    } else if (id === "reputation_pack_2") {
      var rep = 2000;
    } else if (id === "reputation_pack_3") {
      var rep = 4500;
    } else if (id === "reputation_pack_4") {
      var rep = 10000;
    } else if (id === "reputation_pack_5") {
      var rep = 40000;
    } else if (id === "reputation_pack_6") {
      var rep = 100000;
    }
    var newRep = currentRep + rep;
    RNIap.buyProduct(id)
      .then(purchase => {
        firebase
          .firestore()
          .collection("Users")
          .doc(firebase.auth().currentUser.uid)
          .update({
            re: newRep
          })
          .then(() => {
            this.props.getUserData();
          })
          .catch(() => {
            firebase
              .firestore()
              .collection("Users")
              .doc(firebase.auth().currentUser.uid)
              .update({
                re: newRep
              });
          });
        RNIap.consumeAllItems();
      })
      .catch(err => {
        firebase.analytics().logEvent("rep_buying_declined");
      });
  };

  render() {
    if (this.state.prices == null) {
      return <View style={{flex: 1, backgroundColor: 'white', justifyContent: 'center', alignContent: 'center'}}>
      <ActivityIndicator/>
      </View>;
    } else {
      return (
        <ScrollView style={styles.container}>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 20,
              margin: 20,
              marginTop: 30
            }}
          >
            {I18n.t("time_to_get_a_head_start")}
          </Text>

          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              this.buy("reputation_pack_1");
            }}
          >
            <View style={styles.border}>
              <TouchableOpacity
                style={{
                  elevation: 3,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 1
                }}
              >
                <Image
                  source={{ uri: "rep_pack1" }}
                  style={{ height: 50, width: 50, margin: 20 }}
                />
              </TouchableOpacity>
              <Text style={styles.textGray}>300 {I18n.t("reputation")}</Text>
              <Text style={styles.textGray}>
                {this.state.prices[0] + " " + this.state.currency}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              this.buy("reputation_pack_2");
            }}
          >
            <View style={styles.border}>
              <TouchableOpacity
                style={{
                  elevation: 3,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 1
                }}
              >
                <Image
                  source={{ uri: "rep_pack2" }}
                  style={{ height: 50, width: 50, margin: 20 }}
                />
              </TouchableOpacity>
              <Text style={styles.textGray}>2000 {I18n.t("reputation")}</Text>
              <Text style={styles.textGray}>
                {this.state.prices[1] + " " + this.state.currency}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              this.buy("reputation_pack_3");
            }}
          >
            <View style={styles.border}>
              <TouchableOpacity
                style={{
                  elevation: 3,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 1
                }}
              >
                <Image
                  source={{ uri: "rep_pack3" }}
                  style={{ height: 50, width: 50, margin: 20 }}
                />
              </TouchableOpacity>
              <Text style={styles.textGray}>4500 {I18n.t("reputation")}</Text>
              <Text style={styles.textGray}>
                {this.state.prices[2] + " " + this.state.currency}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              this.buy("reputation_pack_4");
            }}
          >
            <View style={styles.border}>
              <TouchableOpacity
                style={{
                  elevation: 3,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 1
                }}
              >
                <Image
                  source={{ uri: "rep_pack4" }}
                  style={{ height: 50, width: 50, margin: 20 }}
                />
              </TouchableOpacity>
              <Text style={styles.textGray}>10000 {I18n.t("reputation")}</Text>
              <Text style={styles.textGray}>
                {this.state.prices[3] + " " + this.state.currency}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              this.buy("reputation_pack_5");
            }}
          >
            <View style={styles.border}>
              <TouchableOpacity
                style={{
                  elevation: 3,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 1
                }}
              >
                <Image
                  source={{ uri: "rep_pack5" }}
                  style={{ height: 50, width: 50, margin: 20 }}
                />
              </TouchableOpacity>
              <Text style={styles.textGray}>40000 {I18n.t("reputation")}</Text>
              <Text style={styles.textGray}>
                {this.state.prices[4] + " " + this.state.currency}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              this.buy("reputation_pack_6");
            }}
          >
            <View style={styles.border}>
              <TouchableOpacity
                style={{
                  elevation: 3,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 1
                }}
              >
                <Image
                  source={{ uri: "rep_pack6" }}
                  style={{ height: 50, width: 50, margin: 20 }}
                />
              </TouchableOpacity>
              <Text style={styles.textGray}>100000 {I18n.t("reputation")}</Text>
              <Text style={styles.textGray}>
                {this.state.prices[5] + " " + this.state.currency}
              </Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      );
    }
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReputationPurchaseScreen);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  item: {
    flexDirection: "row",
    backgroundColor: "white",
    justifyContent: "center"
  },

  widthSetter: {
    width: "100%",
    backgroundColor: "red"
  },

  border: {
    elevation: 0,
    borderRadius: 30,
    borderWidth: 5,
    borderColor: "#ededed",
    marginVertical: 10,
    alignSelf: "center",
    flexDirection: "column",
    marginHorizontal: 16,
    alignItems: "center"
  },

  textGray: {
    fontWeight: "bold",
    fontSize: 20,
    flex: 1,
    margin: 10,
    flexWrap: "wrap"
  },
  textRed: {
    fontWeight: "bold",
    fontSize: 20,
    flex: 1,
    color: "red",
    margin: 15,
    flexWrap: "wrap"
  },
  textGreen: {
    fontWeight: "bold",
    fontSize: 20,
    flex: 1,
    margin: 15,
    color: "#3bd774",
    flexWrap: "wrap"
  },

  fieldImage: {
    width: 50,
    height: 50,

    marginStart: 8,
    borderWidth: 5,
    borderColor: "white",
    margin: 5
  }
});
