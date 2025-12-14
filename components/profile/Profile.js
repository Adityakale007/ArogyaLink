import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { disconnectSocket } from '../../utils/socket';
import { API_BASE_URL, API_ENDPOINTS } from '../../config/api';

// Reusing the color scheme for consistency
const COLORS = {
  primary: '#311B92',   // Dark Indigo (Main accents)
  secondary: '#880E4F', // Dark Maroon 
  darkBlue: '#0047AB',  // Secondary accents/prominent details
  white: '#FFFFFF',
  black: '#000000',
  gray: '#E5E7EB',
  lightGray: '#F5F5F5',
};

const Profile = () => {
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const navigation = useNavigation();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Fetch profile data from database
  useEffect(() => {
    const fetchProfileData = async () => {
      if (user?._id) {
        try {
          const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USER}/${user._id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              setProfileData(data.user);
            }
          }
        } catch (error) {
          console.error('Error fetching profile data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        // Use user data from context if available
        if (user) {
          setProfileData(user);
        }
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user?._id, user]);
  
  const handleEditPress = () => {
    navigation.navigate('EditProfile');
  };
  
  const handleLogout = () => {
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
  
  // Use profile data or fallback to user data
  const displayData = profileData || user || {
    name: 'User',
    email: '',
    mobile: '',
    role: '',
  };
  
  const profileImage = displayData?.profilePhoto 
    ? { uri: displayData.profilePhoto }
    : require('../../components/p.jpg');

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Page Title */}
      <Text style={[styles.pageTitle, { color: theme.text }]}>My Profile</Text>

      {/* Profile Card */}
      <View style={[styles.profileCard, { backgroundColor: theme.card }] }>
        {/* Header Row */}
        <View style={styles.headerRow}>
          <View style={styles.avatarContainer}>
            <Image source={profileImage} style={[styles.profileImage, { borderColor: theme.primary }]} />
          </View>
          <View style={styles.greetingContainer}>
            <Text style={[styles.greetingText, { color: theme.textSecondary }]}>Welcome back,</Text>
            <Text style={[styles.nameText, { color: theme.primary }]}>{displayData.name || 'User'}</Text>
          </View>
        </View>

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: theme.tabBarBorder }]} />

        {/* Details Grid */}
        <View style={styles.detailsGrid}>
          {displayData.email && (
            <View style={styles.fullWidthDetailItem}>
              <Text style={[styles.detailLabel, { color: theme.primary }]}>Email</Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>{displayData.email}</Text>
            </View>
          )}
          {displayData.mobile && (
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: theme.primary }]}>Phone</Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>{displayData.mobile}</Text>
            </View>
          )}
          {displayData.role && (
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: theme.primary }]}>Role</Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>{displayData.role}</Text>
            </View>
          )}
        </View>

        {/* Edit Button */}
        <TouchableOpacity style={{ backgroundColor: theme.primary, alignSelf: 'center', marginTop: 10, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 20 }} onPress={handleEditPress}>
          <Text style={{ color: theme.buttonText, fontWeight: 'bold' }}>Edit Profile</Text>
        </TouchableOpacity>
        
        {/* Logout Button */}
        <TouchableOpacity 
          style={{ backgroundColor: COLORS.secondary, alignSelf: 'center', marginTop: 10, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 20 }} 
          onPress={handleLogout}
        >
          <Text style={{ color: COLORS.white, fontWeight: 'bold' }}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray, // Overall light background
    padding: 20,
    paddingTop: 50,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 20,
    textAlign: 'center',
  },
  profileCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 25,
    shadowColor: COLORS.primary, // Primary color shadow for depth
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  // --- Header/Avatar Styles ---
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: { marginRight: 15 },
  profileImage: { width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: COLORS.primary },
  greetingContainer: { flex: 1 },
  greetingText: { fontSize: 18, color: '#666' },
  nameText: { fontSize: 28, fontWeight: 'bold', color: COLORS.darkBlue },
  divider: { height: 1, backgroundColor: COLORS.gray, marginBottom: 20 },
  // --- Details Grid Styles ---
  detailsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  detailItem: { width: '48%', marginBottom: 15 },
  fullWidthDetailItem: { width: '100%', marginBottom: 15, marginTop: 5, paddingTop: 10, borderTopWidth: 1, borderTopColor: COLORS.gray },
  detailLabel: { fontSize: 12, fontWeight: '600', color: COLORS.darkBlue, textTransform: 'uppercase', marginBottom: 3 },
  detailValue: { fontSize: 16, color: COLORS.black, fontWeight: '500' },
  // --- Edit Button ---
  editButton: { backgroundColor: COLORS.primary, alignSelf: 'center', marginTop: 10, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 20 },
  editButtonText: { color: COLORS.white, fontWeight: 'bold' },
});
