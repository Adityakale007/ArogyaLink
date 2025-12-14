import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../../contexts/AuthContext';
import { API_BASE_URL, API_ENDPOINTS } from '../../../config/api';

const darkCardColors = {
  // --- Dark Theme Palette ---
  darkBackground: '#1E1E1E', // Main screen background
  darkCard: '#2C2C2C',       // Card background
  primaryHighlight: '#4A90E2', // Bright blue for buttons/links (Replaced #0047AB)
  mainText: '#F0F0F0',         // White/Light text
  subText: '#888888',          // Placeholder/Subtitles
  white: '#ffffff',
  redDanger: '#B71C1C',
};

const SignIn = ({ navigation }) => {
  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSignIn = async () => {
    if (!emailOrMobile || !password) {
      Alert.alert('Login Error', 'Please enter both email/mobile and password.');
      return;
    }

    setLoading(true);

    try {
      // Determine if input is email or mobile
      const isEmail = emailOrMobile.includes('@');
      const requestBody = isEmail
        ? { email: emailOrMobile.toLowerCase(), password }
        : { mobile: emailOrMobile, password };

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.SIGNIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        // Try to parse error response
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { message: `Server error: ${response.status}` };
        }
        Alert.alert('Login Error', errorData.message || `Server error: ${response.status}`);
        return;
      }

      const data = await response.json();

      if (data.success) {
        // Save user to context and AsyncStorage
        await login(data.user);
        Alert.alert('Login Successful', `Welcome back, ${data.user.name}!`);
        navigation.navigate('MainDashboard');
      } else {
        Alert.alert('Login Error', data.message || 'Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      Alert.alert(
        'Connection Error',
        'Unable to connect to server. Please check your internet connection and ensure the backend server is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Status bar uses the dark card color for seamless look */}
      <StatusBar backgroundColor={darkCardColors.darkCard} barStyle="light-content" />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header/Title */}
        <Text style={styles.appTitle}>ArogyaLink</Text>
        <Text style={styles.pageTitle}>Sign In</Text>
        <Text style={styles.subtitle}>Welcome back! Please sign in to access your dashboard.</Text>

        <View style={styles.card}>
          
          {/* Email/Mobile Input */}
          <Text style={styles.inputLabel}>Email / Mobile Number</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g., pooja.sharma@asha.in or 9876543210"
            placeholderTextColor={darkCardColors.subText}
            value={emailOrMobile}
            onChangeText={setEmailOrMobile}
            keyboardType="default"
            autoCapitalize="none"
            color={darkCardColors.mainText} // Set input text color
          />

          {/* Password Input */}
          <Text style={styles.inputLabel}>Password</Text>
          <TextInput
            style={styles.textInput}
            placeholder="••••••••"
            placeholderTextColor={darkCardColors.subText}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            color={darkCardColors.mainText} // Set input text color
          />
          
          {/* Forgot Password Link */}
          <TouchableOpacity style={styles.forgotPasswordButton} onPress={() => Alert.alert('Navigate', 'Forgot Password Screen')}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Sign In Button */}
          <TouchableOpacity 
            onPress={handleSignIn} 
            style={[styles.signInButton, loading && styles.signInButtonDisabled]}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={darkCardColors.white} />
            ) : (
              <Text style={styles.buttonText}>CONTINUE</Text>
            )}
          </TouchableOpacity>
          
          {/* Divider */}
          <View style={styles.divider} />
          
          {/* Sign Up Link */}
          <View style={styles.signUpLinkContainer}>
            <Text style={styles.linkText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.linkButtonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkCardColors.darkBackground,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: darkCardColors.primaryHighlight,
    marginBottom: 5,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: darkCardColors.mainText,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: darkCardColors.subText,
    marginBottom: 30,
    textAlign: 'center',
  },
  card: {
    backgroundColor: darkCardColors.darkCard,
    borderRadius: 15,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    shadowColor: darkCardColors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, // Increased shadow visibility on dark background
    shadowRadius: 10,
    elevation: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: darkCardColors.mainText,
    marginBottom: 5,
    marginTop: 10,
  },
  textInput: {
    height: 50,
    borderColor: darkCardColors.subText, // Use subtext color for input border
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: darkCardColors.darkBackground, // Slightly darker input background
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: darkCardColors.primaryHighlight,
    fontSize: 14,
    fontWeight: '600',
  },
  signInButton: {
    backgroundColor: darkCardColors.primaryHighlight,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 25,
  },
  buttonText: {
    color: darkCardColors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: darkCardColors.subText,
    marginVertical: 20,
  },
  signUpLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  linkText: {
    fontSize: 14,
    color: darkCardColors.mainText,
  },
  linkButtonText: {
    color: darkCardColors.primaryHighlight,
    fontSize: 14,
    fontWeight: 'bold',
  },
  signInButtonDisabled: {
    opacity: 0.6,
  },
});

export default SignIn;
