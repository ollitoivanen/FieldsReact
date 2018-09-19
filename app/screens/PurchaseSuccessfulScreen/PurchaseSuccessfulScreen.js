import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import I18n from "FieldsReact/i18n";

export default class PurchaseSuccessfulScreen extends Component {
  constructor(props){
    super(props);
    firebase.analytics().setCurrentScreen("PurchaseSuccessfulScreen", "PurchaseSuccessfulScreen");

  }
  static navigationOptions = {
    header: null
  };
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>{I18n.t("thank_you_for")}</Text>
        <View style={{ position: "absolute", bottom: 16, width: "100%" }}>
          <TouchableOpacity
            style={{
              padding: 30,
              elevation: 3,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 2,
              backgroundColor: "#3facff",
              marginTop: 16,
              marginBottom: 16,

              marginHorizontal: 16,
              borderRadius: 50,
              justifyContent: "center"
            }}
            onPress={() => this.props.navigation.replace("ProfileScreen")}
          >
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 18
              }}
            >
              {I18n.t("lets_go")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#333333"
  },
  text: {
    fontWeight: "bold",
    fontSize: 22,
    textAlign: "center",
    color: "#c6c6c6",
    marginVertical: 16,
    marginTop: 32
  }
});
