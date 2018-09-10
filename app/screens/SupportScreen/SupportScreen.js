import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Linking
} from "react-native";
import { if_you_want_to_report } from "../../strings/strings";
export { contact_us_here } from "../../strings/strings";

export default class SupportScreen extends Component {
  render() {
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
          <Text style={styles.teamName}>{settings}</Text>
        </View>
        <TouchableOpacity
          style={styles.contactButton}
          onPress={() => Linking.openURL("https://fields.one/contact/")}
        >
          <Text style={styles.contact}>{contact_us_here}</Text>
        </TouchableOpacity>
        <Text style={styles.reportText}>{if_you_want_to_report}</Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  contact: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#3facff"
  },
  contactButton: {
    padding: 20
  },
  reportText: {
    fldxWrap: "wrap",
    margin: 20,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bolf"
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
    paddingVertical: 20,
    paddingHorizontal: 10
  },
  backButton: {
    height: 48,
    width: 48,
    alignSelf: "center"
  }
});
