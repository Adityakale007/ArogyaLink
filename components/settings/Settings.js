import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, Switch } from 'react-native';
import React, { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { disconnectSocket } from '../../utils/socket';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import * as ImagePicker from 'expo-image-picker';

// Reusing a consistent color scheme
const COLORS = {
  primary: '#311B92',    // Dark Indigo (Main accents/icons)
  secondary: '#880E4F',  // Dark Maroon (Action/Danger text)
  darkBlue: '#0047AB',   // Status text
  white: '#FFFFFF',      // Used for primary text on dark accents
  black: '#000000',      // Used for primary text on light backgrounds
  gray: '#F0F0F0',       // Light gray background for groups
  lightGray: '#FFFFFF',  // White background for option rows
};

// Component for a single settings item row (theme-aware)
const SettingsRow = ({ title, value, onPress, isDanger, icon }) => {
  const { theme } = useTheme();
  return (
    <TouchableOpacity style={[styles.row, { backgroundColor: theme.card, borderBottomColor: theme.tabBarBorder }]} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Text style={[styles.icon, {color: icon.color || theme.primary}]}>{icon.symbol}</Text>
      </View>
      <Text style={[styles.optionText, { color: theme.text }, isDanger && styles.dangerText]}>{title}</Text>
      <View style={styles.valueContainer}>
        {value && <Text style={[styles.valueText, { color: theme.textSecondary }, isDanger && styles.dangerText]}>{value}</Text>}
        <Text style={[styles.arrow, { color: theme.textSecondary }, isDanger && styles.dangerText]}>{'\u00A0>\u00A0'}</Text>
      </View>
    </TouchableOpacity>
  );
};

// Main Settings component
const Settings = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const { theme, isDarkMode, toggleTheme } = useTheme();
    const { user, updateUser, logout } = useAuth();

  const handleAlert = (title, message) => {
    Alert.alert(title, message);
  };
  
  // Custom alert handler for non-navigable pages
  const handleNonNavigableAlert = (title, message) => {
    Alert.alert(title, message);
  };
  
  // Handle change profile photo
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
        const updatedUser = { ...user, profilePhoto: result.assets[0].uri };
        await updateUser(updatedUser);
        Alert.alert('Success', 'Profile photo updated successfully!');
      }
    } catch (error) {
      console.error('Error changing photo:', error);
      Alert.alert('Error', 'Failed to change profile photo. Please try again.');
    }
  };
  
  // Handle logout
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
              
              // Get root navigator if nested
              const rootNavigation = navigation.getParent()?.getParent() || navigation.getParent() || navigation;
              
              // Reset navigation to SignIn
              rootNavigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'SignIn' }],
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

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.background }]}>
      <Text style={[styles.headerTitle, { color: theme.text }]}>Settings</Text>
      
      <ScrollView 
        contentContainerStyle={[
          styles.scrollContent, 
          { paddingBottom: insets.bottom + 20 }
        ]}
      >

        {/* --- 1. User & Account Section --- */}
        <View style={[styles.sectionGroup, { backgroundColor: theme.surface }]}>
          <SettingsRow 
            title="Edit Profile Information" 
            icon={{symbol: '👤', color: COLORS.darkBlue}}
            onPress={() => navigation.navigate('EditProfile')} // Navigates to EditProfile.js
          />
          
          <SettingsRow 
            title="Change Profile Photo" 
            icon={{symbol: '📷', color: COLORS.primary}}
            onPress={handleChangePhoto}
          />
          
          <SettingsRow 
            title="Manage Notifications" 
            value="Custom"
            icon={{symbol: '🔔', color: COLORS.secondary}}
            onPress={() => navigation.navigate('ManageNotification')} // Navigates to ManageNotification.js
          />
        </View>
        
        {/* --- 2. Preferences & Appearance Section --- */}
        <View style={[styles.sectionGroup, { backgroundColor: theme.surface }]}>
          <View style={[styles.row, { backgroundColor: theme.card, borderBottomColor: theme.tabBarBorder }]}>
            <View style={styles.iconContainer}>
              <Text style={[styles.icon, {color: COLORS.secondary}]}>🎨</Text>
            </View>
            <Text style={[styles.optionText, { color: theme.text }]}>Dark Mode</Text>
            <View style={styles.valueContainer}>
              <Text style={[styles.valueText, { color: theme.textSecondary, marginRight: 10 }]}>{isDarkMode ? 'Dark' : 'Light'}</Text>
              <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
                trackColor={{ false: '#767577', true: theme.primary }}
                thumbColor={isDarkMode ? '#f5dd4b' : '#f4f3f4'}
              />
            </View>
          </View>
          
          <SettingsRow 
            title="Language" 
            value="English (US)"
            icon={{symbol: '🌐', color: COLORS.primary}}
            onPress={() => navigation.navigate('Language')} // Navigates to Language.js
          />
        </View>

        {/* --- 3. Data, Privacy, and Support Section --- */}
        <View style={[styles.sectionGroup, { backgroundColor: theme.surface }]}>
          <SettingsRow 
            title="Privacy Policy" 
            icon={{symbol: '📜', color: COLORS.darkBlue}}
            onPress={() => navigation.navigate('PrivacyPolicy')} // Navigates to PrivacyPolicy.js
          />
          
          <SettingsRow 
            title="Terms of Service" 
            icon={{symbol: '⚖️', color: COLORS.darkBlue}}
            onPress={() => navigation.navigate('Terms')} // Navigates to Terms.js
          />
          
          <SettingsRow 
            title="Clear Cache" 
            icon={{symbol: '🧹', color: COLORS.tertiary}}
            onPress={() => handleNonNavigableAlert('Maintenance', 'Clearing local cache...')}/>
          
          <SettingsRow 
            title="Help Center / FAQ" 
            icon={{symbol: '❓', color: COLORS.primary}}
            onPress={() => navigation.navigate('FAQ')} // Navigates to FAQ.js
          />

          <SettingsRow 
            title="Version" 
            value="1.1.0"
            icon={{symbol: '📱', color: '#666'}}
            onPress={() => handleNonNavigableAlert('Version', 'Displaying app version number.')}/>

          <SettingsRow 
            title="Sign Out" 
            isDanger={true}
            icon={{symbol: '➡️', color: COLORS.secondary}}
            onPress={handleLogout}/>
        </View>

      </ScrollView>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerTitle: {
    color: COLORS.black, 
    fontSize: 32,
    fontWeight: 'bold',
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'left',
  },
  scrollContent: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  sectionGroup: {
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
  },
  iconContainer: {
    width: 30,
    marginRight: 15,
    alignItems: 'center',
  },
  icon: {
    fontSize: 20,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueText: {
    fontSize: 14,
    marginRight: 5,
  },
  arrow: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  dangerText: {
    color: COLORS.secondary,
  },
});
