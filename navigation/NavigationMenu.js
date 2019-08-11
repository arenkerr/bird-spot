import React from 'react';
import { Platform } from 'react-native';
import {
  createStackNavigator,
  createBottomTabNavigator,
} from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import AddBirdScreen from '../screens/AddBirdScreen';
import BirdMap from '../screens/BirdMap';

const config = Platform.select({
  web: { headerMode: 'none' },
  default: { headerMode: 'none' },
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false,
  },
});

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
  },
  config
);

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-home` : 'md-home'}
    />
  ),
  tabBarOptions: { showLabel: false },
};

HomeStack.path = '';

const MapStack = createStackNavigator(
  {
    Links: BirdMap,
  },
  config
);

MapStack.navigationOptions = {
  tabBarLabel: 'BirdMap',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-navigate' : 'md-navigate'}
    />
  ),
  tabBarOptions: { showLabel: false },
};

MapStack.path = '';

const AddBirdStack = createStackNavigator(
  {
    AddBird: AddBirdScreen,
  },
  config
);

AddBirdStack.navigationOptions = {
  tabBarLabel: 'AddBird',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-add-circle' : 'md-add-circle'}
    />
  ),
  tabBarOptions: { showLabel: false },
};

AddBirdStack.path = '';

const tabNavigator = createBottomTabNavigator({
  HomeStack,
  MapStack,
  AddBirdStack,
});

tabNavigator.path = '';

export default tabNavigator;
