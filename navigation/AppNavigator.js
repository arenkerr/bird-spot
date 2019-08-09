import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import SignUpScreen from '../screens/SignUpScreen';
import HomeScreen from '../screens/HomeScreen';
import LogInScreen from '../screens/LogInScreen';
import MainTabNavigator from './MainTabNavigator';
import NavigationMenu from './NavigationMenu';

import UserAuth from './UserAuth';

export default createAppContainer(
  createSwitchNavigator({
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    // BirdMap,
    UserAuth,
    SignUpScreen,
    LogInScreen,
    HomeScreen: NavigationMenu,
  })
);
