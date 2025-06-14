import {
    createNativeBottomTabNavigator,
    NativeBottomTabNavigationEventMap,
    NativeBottomTabNavigationOptions,
} from '@bottom-tabs/react-navigation';
import { ParamListBase, TabNavigationState } from '@react-navigation/native';
import { withLayoutContext } from 'expo-router';
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
  const colorScheme = useColorScheme() as 'light' | 'dark';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme].surface,
          borderTopWidth: 0,
          elevation: 8,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Campaigns',
          tabBarIcon: () => ({ sfSymbol: 'map.fill' }),
        }}
      />
      <Tabs.Screen
        name="characters"
        options={{
          title: 'Characters',
          tabBarIcon: () => ({ sfSymbol: 'person.fill' }),
        }}
      />
      <Tabs.Screen
        name="dice"
        options={{
          title: 'Dice',
          tabBarIcon: () => ({ sfSymbol: 'dice.fill' }),
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          title: 'Groups',
          tabBarIcon: () => ({ sfSymbol: 'person.3.fill' }),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: () => ({ sfSymbol: 'gear' }),
        }}
      />
    </Tabs>
  );
}