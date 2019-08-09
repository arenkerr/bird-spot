import React, { Component } from 'react';
import { StyleSheet, Platform, Image, Text, View } from 'react-native';
import * as firebase from 'firebase';
import { FirebaseWrapper } from '../firebase/firebase';

export default class LoadingScreen extends Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.props.navigation.navigate(user ? 'HomeScreen' : 'SignUpScreen');
    });
  }

  render() {
    return <Text>Loading...</Text>;
  }
}
