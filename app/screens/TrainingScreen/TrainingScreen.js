import React, { Component } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { under_minute, min, h, currently_training_at, training_time } from "../../strings/strings";
var moment = require("moment");

export default class TrainingScreen extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    var { params } = this.props.navigation.state;
    this.state = {
      trainingTime: ""
    };
  }

  componentWillMount = () => {
    this.getTrainingTime();
  };

  getTrainingTime = () => {
    var { params } = this.props.navigation.state;
    const startTime = params.startTime;
    const currentTime = moment().format("x");
    const trainingTime = currentTime - startTime;
    this.setState({ trainingTime: trainingTime });
    const seconds = trainingTime / 1000;
    const minutes =  Math.trunc(seconds / 60);
    const hours = Math.trunc( minutes / 60);


    if (minutes < 1) {
      this.setState({ trainingTime: [under_minute] });
    } else if (hours < 1) {
      this.setState({ trainingTime: minutes + [min] });
    } else {
      const minSub = minutes - hours*60
      this.setState({trainingTime: hours + [h] + ' ' + minSub + [min]})
    }
  };

  render() {
    var { params } = this.props.navigation.state;

    return (
      <View style={styles.greenBackground}>

       <Image
       style={styles.image}
       resizeMode={'center'}
                source={require("FieldsReact/app/images/FootballFieldOutlineWhite/football_field_outline_white.png")}
              />
    
      <Text style={styles.headerText}>{currently_training_at}</Text>
      <View style={styles.roundBackground}>
      <Text style={styles.fieldText}>{params.fieldName}</Text>
      </View>
      <Text style={styles.headerText}>{training_time}</Text>

      <View style={styles.roundBackground}>
        <Text style={styles.trainingTimeText}>{this.state.trainingTime}</Text>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {},

  trainingTimeText: {
    fontSize: 40,
    fontWeight: 'bold'
  },

  greenBackground: {
    backgroundColor: "#3bd774",
    paddingVertical: 20,
    paddingHorizontal: 10,
    flex: 1,
    alignItems: 'center'
  },

  roundBackground: {
    paddingStart: 10,
    paddingEnd: 10,
    paddingTop: 8,
    paddingBottom: 8,

    marginEnd: 10,
    backgroundColor: "white",
    borderRadius: 20,
    flexShrink: 1,
    marginTop: 20,
    marginStart: 8
  },

  fieldText: {
    fontSize: 25,
    fontWeight: 'bold',
  },

  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 36
  },

  image:{
  }
});
