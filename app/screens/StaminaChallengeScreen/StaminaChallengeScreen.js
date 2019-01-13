import React, { Component } from "react";
import { Image, Dimensions, PanResponder, View, } from "react-native";
import { Body, Loop, Stage, World, TileMap } from "react-game-kit/native";

import Matter from "matter-js";

export default class Game extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);

    this.state = {
      
      gravity: 1,
      ballPosition: {
        x: 0,
        y: 0
      },
      ballAngle: 0
    };
  }

  
  

  getBallStyles() {
    return {
      height: 75,
      width: 75,
      position: "absolute",
      transform: [
        { translateX: this.state.ballPosition.x },
        { translateY: this.state.ballPosition.y },
        { rotate: this.state.ballAngle * (180 / Math.PI) + "deg" }
      ]
    };
  }

  render() {
    const dimensions = Dimensions.get("window");
    return (
      <Loop>
        <Stage
          width={dimensions.width}
          height={dimensions.height}
          style={{ backgroundColor: "white" }}
        >
          <World
            onInit={this.physicsInit}
            onUpdate={this.handleUpdate}
            gravity={{ x: 0, y: this.state.gravity, scale: 0.001 }}
          >
            <TileMap
              style={{ top: Math.floor(64 * this.context.scale) }}
              src={require("FieldsReact/app/assets/boardwalktile.png")}
              sourceWidth={128}
              tileSize={128}
              columns={3}
              rows={3}
              layers={[[1, 1, 1, 1, 1, 1, 1, 1, 0]]}
              renderTile={(tile, src, styles) => {
                return (
                  <Body >
                    <Image style={[styles,{transform:[{ skewX: '180deg' }]}]} source={src} />
                  </Body>
                );
              }}
            />
          </World>
        </Stage>
      </Loop>
    );
  }
}
