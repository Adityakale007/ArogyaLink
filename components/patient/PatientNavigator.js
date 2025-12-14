import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Patient from './Patient';
import PastReports from './PastReports';
import Profile from '../profile/Profile';

const Tab = createBottomTabNavigator();

export default function PatientNavigator() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [currentRoute, setCurrentRoute] = useState('Home');

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Reports') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.primary || '#1B5E20',
        tabBarInactiveTintColor: '#999',
          tabBarStyle: {
            backgroundColor: theme.card || '#FFFFFF',
            borderTopColor: theme.tabBarBorder || '#ddd',
            height: 60 + insets.bottom,
            paddingBottom: insets.bottom,
            paddingTop: 5,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
          },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      })}
      screenListeners={{
        state: (e) => {
          const routeName = e.data?.state?.routes?.[e.data.state.index]?.name;
          if (routeName) {
            setCurrentRoute(routeName);
          }
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={Patient}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen 
        name="Reports" 
        component={PastReports}
        options={{ tabBarLabel: 'Reports' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={Profile}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
}
