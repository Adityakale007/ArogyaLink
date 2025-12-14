import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import AvatarMenu from '../patient/othercomps/AvatarMenu';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import { disconnectSocket } from '../../utils/socket';

// Import doctor screens
import DashboardScreen from './screens/DashboardScreen';
import PatientsScreen from './screens/PatientsScreen';
import ChatScreen from './screens/ChatScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import ReportsScreen from './screens/ReportsScreen';

const Tab = createBottomTabNavigator();

export default function DoctorMainDashboard() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { user, logout, updateUser } = useAuth();
  const navigation = useNavigation();
  const route = useRoute();
  const [currentRoute, setCurrentRoute] = useState('Dashboard');
  const [profilePhoto, setProfilePhoto] = useState(
    user?.profilePhoto 
      ? { uri: user.profilePhoto }
      : require('../../components/p.jpg')
  );

  // Update profile photo when user data changes
  useEffect(() => {
    if (user?.profilePhoto) {
      setProfilePhoto({ uri: user.profilePhoto });
    }
  }, [user?.profilePhoto]);

  const handleChangePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Permission to access media library is needed to change profile photo.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const newPhoto = { uri: result.assets[0].uri };
        setProfilePhoto(newPhoto);
        
        const updatedUser = { ...user, profilePhoto: result.assets[0].uri };
        await updateUser(updatedUser);
        
        Alert.alert('Success', 'Profile photo updated successfully!');
      }
    } catch (error) {
      console.error('Error changing photo:', error);
      Alert.alert('Error', 'Failed to change profile photo. Please try again.');
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              // Disconnect socket first
              disconnectSocket();
              // Logout from auth context
              await logout();
              
              // Get root navigator if nested (same pattern as worker)
              const rootNavigation = navigation.getParent()?.getParent() || navigation.getParent() || navigation;
              
              // Reset navigation to StartPage
              rootNavigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'StartPage' }],
                })
              );
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleProfile = () => {
    navigation.navigate('Profile');
  };

  const handleSettings = () => {
    navigation.navigate('Settings');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            const iconSize = 24;

            if (route.name === 'Dashboard') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Patients') {
              iconName = focused ? 'people' : 'people-outline';
            } else if (route.name === 'Chat') {
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
            } else if (route.name === 'Notifications') {
              iconName = focused ? 'notifications' : 'notifications-outline';
            } else if (route.name === 'Reports') {
              iconName = focused ? 'document-text' : 'document-text-outline';
            }

            return <Ionicons name={iconName} size={iconSize} color={color} />;
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
          tabBarShowLabel: true,
        })}
        initialRouteName="Dashboard"
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
          name="Dashboard" 
          component={DashboardScreen}
          options={{
            tabBarLabel: 'Dashboard',
          }}
        />
        <Tab.Screen 
          name="Patients" 
          component={PatientsScreen}
          options={{
            tabBarLabel: 'Patients',
          }}
        />
        <Tab.Screen 
          name="Chat" 
          component={ChatScreen}
          options={{
            tabBarLabel: 'Chat',
          }}
        />
        <Tab.Screen 
          name="Notifications" 
          component={NotificationsScreen}
          options={{
            tabBarLabel: 'Alerts',
          }}
        />
        <Tab.Screen 
          name="Reports" 
          component={ReportsScreen}
          options={{
            tabBarLabel: 'Reports',
          }}
        />
      </Tab.Navigator>
      
      {/* Avatar Menu floating on top right - Only visible on Dashboard screen */}
      {currentRoute === 'Dashboard' && (
        <AvatarMenu
          avatarUri={profilePhoto}
          onProfile={handleProfile}
          onSettings={handleSettings}
          onLogout={handleLogout}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
