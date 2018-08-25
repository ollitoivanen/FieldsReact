import React from "react";
import { TouchableOpacity, View, Text, StyleSheet, Image } from "react-native";


export default class FeedFriendListItem extends React.PureComponent {
  // toggle a todo as completed or not via update()

 
  


  render() {

    if(this.props.trainingTime
        
        !==undefined){
        var trainingTime  =       <Text style={styles.fieldText}>{this.props.cFN+", " + this.props.trainingTime}</Text>

    }else{
        var trainingTime  =       <Text style={styles.fieldText}>{this.props.cFN}</Text>

    }
    return (
        <View>
            
      <View style={styles.item}>
        <Image
          style={styles.fieldImage}
          source={require("FieldsReact/app/images/FieldsLogo/fields_logo_green.png")}
          borderRadius={25}
          resizeMode="cover"
        />
        <Text style={styles.text} numberOfLines={2}>
          {this.props.fN}
        </Text>
      </View>
      {trainingTime}
      <View style={styles.div} />

      </View>
    );
  }
}
const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: "white",
    alignItems: "center"
  },

  div: {
    height: 1,
    width: "100%",
    backgroundColor: "#e0e0e0",
    bottom: 0,
    position: "absolute"
  },

  text: {
    fontWeight: "bold",
    fontSize: 20,
    flex: 1,
    marginStart: 8,
    flexWrap: "wrap",
    color: 'black'
  },

  fieldImage: {
    width: 50,
    height: 50,
    marginTop: 16,
    marginStart: 8,
    borderWidth: 3,
    borderColor: "#e0e0e0",
    margin: 5
  },

  fieldText: {
      marginStart: 16,
      marginTop: 3,
      marginBottom: 16,
      fontSize: 18,
      fontWeight: '500'
  }
  
});
