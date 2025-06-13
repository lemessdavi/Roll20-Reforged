import { withLayoutContext } from 'expo-router';
import {
  createNativeBottomTabNavigator,
  NativeBottomTabNavigationOptions,
  NativeBottomTabNavigationEventMap,
} from '@bottom-tabs/react-navigation';
import { ParamListBase, TabNavigationState } from '@react-navigation/native';
import React from 'react';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const BottomTabNavigator = createNativeBottomTabNavigator().Navigator;

const Tabs = withLayoutContext<
  NativeBottomTabNavigationOptions,
  typeof BottomTabNavigator,
  TabNavigationState<ParamListBase>,
  NativeBottomTabNavigationEventMap
>(BottomTabNavigator);

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: () => ({ sfSymbol: 'house.fill' }),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: () => ({ sfSymbol: 'paperplane.fill' }),
        }}
      />
    </Tabs>
  );
}
