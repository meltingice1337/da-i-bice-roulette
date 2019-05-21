import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createNavigationContainer, createNavigator } from 'react-navigation';

import HomeScreen from '../screens/HomeScreen';
import ConnectionScreen from '../screens/ConnectionScreen';

const MainTabNavigator = createStackNavigator({
  Home: { screen: HomeScreen },
  ConnectionScreen: { screen: ConnectionScreen },
});
export default MainTabNavigator;
