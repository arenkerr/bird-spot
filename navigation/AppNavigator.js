import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import SignUpScreen from '../screens/SignUpScreen';
import HomeScreen from '../screens/HomeScreen';
import LogInScreen from '../screens/LogInScreen';
import NavigationMenu from './NavigationMenu';
import AddBirdScreen from '../screens/AddBirdScreen';
import BirdMap from '../screens/BirdMap';

import UserAuth from './UserAuth';

export default createAppContainer(
  createSwitchNavigator({
    UserAuth,
    SignUpScreen,
    LogInScreen,
    HomeScreen: NavigationMenu,
    AddBirdScreen,
  })
);
