import React from 'react';
import { StyleSheet, Image, View } from 'react-native';

export default class LoadingLocationScreen extends React.Component {
  resetAnimation = () => {
    this.animation.reset();
    this.animation.play();
    Animated.timing(this.state.progress, {
      toValue: 1,
      duration: 3000,
      easing: Easing.linear,
    }).start();
  };

  render() {
    const logo = require('../assets/images/splash.png');

    return (
      <View style={styles.container}>
        <Image source={logo} style={styles.image} />
      </View>
    );
  }
}

import Dimensions from 'Dimensions';
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#22b573',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width: width,
    height: height,
  },
  image: {
    height: height,
    width: width - 60,
  },
});
