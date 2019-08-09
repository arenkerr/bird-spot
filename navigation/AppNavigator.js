import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import SignUpScreen from '../screens/SignUpScreen';
import MainTabNavigator from './MainTabNavigator';
import UserAuth from './UserAuth';
import HomeScreen from '../screens/HomeScreen';

export default createAppContainer(
  createSwitchNavigator({
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    // BirdMap,
    UserAuth,
    SignUpScreen,
    HomeScreen: MainTabNavigator,
  })
);
