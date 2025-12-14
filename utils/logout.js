import { CommonActions } from '@react-navigation/native';
import { disconnectSocket } from './socket';

/**
 * Utility function to handle logout consistently across the app
 * @param {Function} logout - The logout function from AuthContext
 * @param {Object} navigation - The navigation object
 * @param {Function} onError - Optional error callback
 */
export const handleLogout = async (logout, navigation, onError) => {
  try {
    // Disconnect socket first
    disconnectSocket();
    
    // Logout from auth context
    await logout();
    
    // Reset navigation to SignIn screen
    if (navigation && navigation.dispatch) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'SignIn' }],
        })
      );
    } else {
      console.error('Navigation object is not available');
      if (onError) {
        onError(new Error('Navigation not available'));
      }
    }
  } catch (error) {
    console.error('Logout error:', error);
    if (onError) {
      onError(error);
    } else {
      throw error;
    }
  }
};

export default handleLogout;
