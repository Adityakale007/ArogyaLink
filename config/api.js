import { Platform } from 'react-native';

// API Configuration
// IMPORTANT: For physical devices, set PHYSICAL_DEVICE_IP to your computer's IP address
// Your detected IP: 192.168.1.26
// If this doesn't work, find your IP:
//   - Mac/Linux: ifconfig | grep "inet " | grep -v 127.0.0.1
//   - Windows: ipconfig (look for IPv4 Address)

// Set this to your computer's IP address when testing on a physical device
// Leave as null to use default (localhost for iOS simulator, 10.0.2.2 for Android emulator)
const PHYSICAL_DEVICE_IP = '192.168.1.11'; // Change this if needed

const getBaseURL = () => {
  if (__DEV__) {
    // If physical device IP is set, use it (works for both iOS and Android physical devices)
    if (PHYSICAL_DEVICE_IP) {
      return `http://${PHYSICAL_DEVICE_IP}:4000`;
    }
    
    // For emulators/simulators
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:4000'; // Android emulator
    } else {
      return 'http://localhost:4000'; // iOS simulator
    }
  } else {
    // For production - replace with your production API URL
    return 'https://your-api-domain.com';
  }
};

export const API_BASE_URL = getBaseURL();

// Log the API URL for debugging
if (__DEV__) {
  console.log('API Base URL:', API_BASE_URL);
  console.log('Platform:', Platform.OS);
}

export const API_ENDPOINTS = {
  SIGNUP: '/api/auth/signup',
  SIGNIN: '/api/auth/signin',
  USER: '/api/auth/user',
  HEALTH: '/api/health',
  CHAT: '/api/chat',
};

