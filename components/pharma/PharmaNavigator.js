import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

// Import pharmacy screens
import PharmaDashboard from './screens/PharmaDashboard';
import StockManagement from './screens/StockManagement';
import OrderManagement from './screens/OrderManagement';
import InventoryReports from './screens/InventoryReports';
import PharmaSettings from './screens/PharmaSettings';

const Tab = createBottomTabNavigator();

export default function PharmaNavigator() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Stock') {
            iconName = focused ? 'cube' : 'cube-outline';
          } else if (route.name === 'Orders') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Reports') {
            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.primary || '#1B5E20',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: theme.card || '#FFFFFF',
          borderTopColor: theme.tabBarBorder || '#ddd',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={PharmaDashboard}
        options={{ tabBarLabel: 'Dashboard' }}
      />
      <Tab.Screen 
        name="Stock" 
        component={StockManagement}
        options={{ tabBarLabel: 'Stock' }}
      />
      <Tab.Screen 
        name="Orders" 
        component={OrderManagement}
        options={{ tabBarLabel: 'Orders' }}
      />
      <Tab.Screen 
        name="Reports" 
        component={InventoryReports}
        options={{ tabBarLabel: 'Reports' }}
      />
      <Tab.Screen 
        name="Settings" 
        component={PharmaSettings}
        options={{ tabBarLabel: 'Settings' }}
      />
    </Tab.Navigator>
  );
}
