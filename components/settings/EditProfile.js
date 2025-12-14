import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { API_BASE_URL, API_ENDPOINTS } from '../../config/api';

// Reusing a consistent color scheme
const COLORS = {
  primary: '#311B92', 
  secondary: '#880E4F', 
  tertiary: '#1B5E20', 
  darkBlue: '#0047AB',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#E5E7EB',
  lightGray: '#F5F5F5',
};

const EditProfile = () => {
  const { user, updateUser } = useAuth();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    number: '',
    role: '',
    dob: '',
    aadhar: '',
  });
  const [loading, setLoading] = useState(true);

  // Fetch user data from database
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?._id) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USER}/${user._id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.user) {
            setFormData({
              name: data.user.name || '',
              email: data.user.email || '',
              number: data.user.mobile || '',
              role: data.user.role || '',
              dob: data.user.dob || '',
              aadhar: data.user.aadhar || '',
            });
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Fallback to user from context if API fails
        if (user) {
          setFormData({
            name: user.name || '',
            email: user.email || '',
            number: user.mobile || '',
            role: user.role || '',
            dob: user.dob || '',
            aadhar: user.aadhar || '',
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user?._id]);

  const handleInputChange = (key, value) => {
    setFormData(prevData => ({ ...prevData, [key]: value }));
  };

  const handleSave = async () => {
    if (!user?._id) {
      Alert.alert('Error', 'User not found. Please login again.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USER}/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          mobile: formData.number,
          dob: formData.dob,
          aadhar: formData.aadhar,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Update user in context
          await updateUser({
            ...user,
            name: formData.name,
            email: formData.email,
            mobile: formData.number,
            dob: formData.dob,
            aadhar: formData.aadhar,
          });
          
          Alert.alert(
            "Profile Updated", 
            `Your changes have been saved!\nName: ${formData.name}\nEmail: ${formData.email}\nNumber: ${formData.number}`
          );
        } else {
          Alert.alert('Error', data.message || 'Failed to update profile.');
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        Alert.alert('Error', errorData.message || 'Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please check your connection and try again.');
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.background || COLORS.white, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: theme.text || COLORS.black }}>Loading profile data...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.background || COLORS.white }]}>
      <Text style={[styles.headerTitle, { color: theme.text || COLORS.black }]}>Edit Profile</Text>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={[styles.formSection, { backgroundColor: theme.surface || COLORS.lightGray }]}>
          <Text style={[styles.sectionTitle, { color: theme.primary || COLORS.primary }]}>Personal Details</Text>
          
          <TextInput
            style={[styles.input, { backgroundColor: theme.card || COLORS.white, color: theme.text || COLORS.black, borderColor: theme.tabBarBorder || COLORS.gray }]}
            placeholder="Name"
            placeholderTextColor="#888"
            value={formData.name}
            onChangeText={(text) => handleInputChange('name', text)}
          />
          
          <TextInput
            style={[styles.input, { backgroundColor: theme.card || COLORS.white, color: theme.text || COLORS.black, borderColor: theme.tabBarBorder || COLORS.gray }]}
            placeholder="Email Address"
            placeholderTextColor="#888"
            value={formData.email}
            onChangeText={(text) => handleInputChange('email', text)}
            keyboardType="email-address"
          />
          
          <TextInput
            style={[styles.input, { backgroundColor: theme.card || COLORS.white, color: theme.text || COLORS.black, borderColor: theme.tabBarBorder || COLORS.gray }]}
            placeholder="Phone Number"
            placeholderTextColor="#888"
            value={formData.number}
            onChangeText={(text) => handleInputChange('number', text)}
            keyboardType="phone-pad"
          />

          <TextInput
            style={[styles.input, { backgroundColor: theme.card || COLORS.white, color: theme.text || COLORS.black, borderColor: theme.tabBarBorder || COLORS.gray }]}
            placeholder="Date of Birth"
            placeholderTextColor="#888"
            value={formData.dob}
            onChangeText={(text) => handleInputChange('dob', text)}
          />

          <TextInput
            style={[styles.input, { backgroundColor: theme.card || COLORS.white, color: theme.text || COLORS.black, borderColor: theme.tabBarBorder || COLORS.gray }]}
            placeholder="Aadhar Number"
            placeholderTextColor="#888"
            value={formData.aadhar}
            onChangeText={(text) => handleInputChange('aadhar', text)}
          />
          
          <TextInput
            style={[styles.input, { backgroundColor: theme.cardSecondary || COLORS.lightGray, color: theme.textSecondary || '#666', borderColor: theme.tabBarBorder || COLORS.gray }]}
            placeholder="Role"
            placeholderTextColor="#888"
            value={formData.role}
            editable={false}
          />
        </View>

        <TouchableOpacity style={[styles.saveButton, { backgroundColor: theme.primary || COLORS.primary }]} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  formSection: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 15,
  },
  input: {
    height: 50,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: COLORS.black,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.gray,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});