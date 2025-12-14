import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../contexts/ThemeContext';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import HealthChatBot from '../../patient/othercomps/HealthChatBot';
import { disconnectSocket } from '../../../utils/socket';

const COLORS = {
  primary: '#1B5E20',
  secondary: '#2E7D32',
  danger: '#D32F2F',
  warning: '#F57C00',
  success: '#388E3C',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#F5F5F5',
};

export default function PharmaSettings() {
  const { theme } = useTheme();
  const { logout } = useAuth();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState(true);
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  const [expiryAlerts, setExpiryAlerts] = useState(true);
  const [autoReorder, setAutoReorder] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isChatbotVisible, setIsChatbotVisible] = useState(false);

  const handleChatbotPress = () => {
    setIsChatbotVisible(true);
  };

  const closeChatbot = () => {
    setIsChatbotVisible(false);
  };

  const handleUploadReport = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Permission to access media library is needed to upload a report.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ 
      mediaTypes: ImagePicker.MediaTypeOptions.Images, 
      allowsEditing: true, 
      aspect: [4, 3], 
      quality: 1 
    });
    if (!result.canceled) {
      Alert.alert('Report Uploaded', 'Your settings report has been successfully uploaded!');
    }
  };

  const settingsSections = [
    {
      title: 'Notifications',
      items: [
        {
          id: 'notifications',
          title: 'Push Notifications',
          subtitle: 'Receive notifications for important updates',
          type: 'switch',
          value: notifications,
          onToggle: setNotifications,
        },
        {
          id: 'lowStock',
          title: 'Low Stock Alerts',
          subtitle: 'Get notified when stock is running low',
          type: 'switch',
          value: lowStockAlerts,
          onToggle: setLowStockAlerts,
        },
        {
          id: 'expiry',
          title: 'Expiry Alerts',
          subtitle: 'Get notified before medicines expire',
          type: 'switch',
          value: expiryAlerts,
          onToggle: setExpiryAlerts,
        },
      ],
    },
    {
      title: 'Inventory Management',
      items: [
        {
          id: 'autoReorder',
          title: 'Auto Reorder',
          subtitle: 'Automatically reorder when stock is low',
          type: 'switch',
          value: autoReorder,
          onToggle: setAutoReorder,
        },
        {
          id: 'reorderLevel',
          title: 'Reorder Level',
          subtitle: 'Set minimum stock level for auto reorder',
          type: 'action',
          onPress: () => Alert.alert('Reorder Level', 'Set minimum stock level for auto reorder'),
        },
        {
          id: 'suppliers',
          title: 'Manage Suppliers',
          subtitle: 'Add and manage your suppliers',
          type: 'action',
          onPress: () => Alert.alert('Suppliers', 'Manage your suppliers'),
        },
      ],
    },
    {
      title: 'Appearance',
      items: [
        {
          id: 'darkMode',
          title: 'Dark Mode',
          subtitle: 'Switch between light and dark themes',
          type: 'switch',
          value: darkMode,
          onToggle: setDarkMode,
        },
        {
          id: 'language',
          title: 'Language',
          subtitle: 'English (US)',
          type: 'action',
          onPress: () => Alert.alert('Language', 'Select your preferred language'),
        },
      ],
    },
    {
      title: 'Data & Privacy',
      items: [
        {
          id: 'backup',
          title: 'Backup Data',
          subtitle: 'Create a backup of your inventory data',
          type: 'action',
          onPress: () => Alert.alert('Backup', 'Create a backup of your inventory data'),
        },
        {
          id: 'export',
          title: 'Export Data',
          subtitle: 'Export your data to CSV or PDF',
          type: 'action',
          onPress: () => Alert.alert('Export', 'Export your data to CSV or PDF'),
        },
        {
          id: 'privacy',
          title: 'Privacy Policy',
          subtitle: 'View our privacy policy',
          type: 'action',
          onPress: () => Alert.alert('Privacy Policy', 'View our privacy policy'),
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          id: 'help',
          title: 'Help & Support',
          subtitle: 'Get help with using the app',
          type: 'action',
          onPress: () => Alert.alert('Help', 'Get help with using the app'),
        },
        {
          id: 'feedback',
          title: 'Send Feedback',
          subtitle: 'Share your feedback with us',
          type: 'action',
          onPress: () => Alert.alert('Feedback', 'Share your feedback with us'),
        },
        {
          id: 'about',
          title: 'About',
          subtitle: 'Version 1.0.0',
          type: 'action',
          onPress: () => Alert.alert('About', 'Pharmacy Management App v1.0.0'),
        },
      ],
    },
  ];

  const renderSettingItem = (item) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.settingItem, { backgroundColor: theme.card || COLORS.white }]}
        onPress={item.onPress}
        disabled={item.type === 'switch'}
      >
        <View style={styles.settingContent}>
          <Text style={[styles.settingTitle, { color: theme.text || COLORS.black }]}>
            {item.title}
          </Text>
          <Text style={[styles.settingSubtitle, { color: theme.textSecondary || '#666' }]}>
            {item.subtitle}
          </Text>
        </View>
        
        {item.type === 'switch' ? (
          <Switch
            value={item.value}
            onValueChange={item.onToggle}
            trackColor={{ false: '#767577', true: theme.primary || COLORS.primary }}
            thumbColor={item.value ? COLORS.white : '#f4f3f4'}
          />
        ) : (
          <Ionicons name="chevron-forward" size={20} color={theme.textSecondary || '#666'} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background || COLORS.white }]}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <Text style={[styles.title, { color: theme.text || COLORS.black }]}>Settings</Text>
        <TouchableOpacity style={styles.saveButton} onPress={() => Alert.alert('Settings Saved', 'Your settings have been saved successfully!')}>
          <Ionicons name="checkmark" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text || COLORS.black }]}>
              {section.title}
            </Text>
            <View style={styles.sectionContent}>
              {section.items.map((item, itemIndex) => (
                <View key={item.id}>
                  {renderSettingItem(item)}
                  {itemIndex < section.items.length - 1 && (
                    <View style={[styles.separator, { backgroundColor: theme.tabBarBorder || '#f0f0f0' }]} />
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}
        
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={() => {
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
            }}
          >
            <Ionicons name="log-out" size={20} color={COLORS.danger} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Upload Report FAB */}
      <TouchableOpacity style={[styles.uploadFab]} onPress={handleUploadReport}>
        <Ionicons name="cloud-upload" size={24} color={COLORS.white} />
      </TouchableOpacity>

      {/* AI Chatbot FAB */}
      <TouchableOpacity
        style={[styles.chatbotFab]}
        onPress={handleChatbotPress}
      >
        <Text style={styles.chatbotFabText}>🧠</Text>
      </TouchableOpacity>

      {isChatbotVisible && (
        <View style={styles.overlay}>
          <HealthChatBot onClose={closeChatbot} bottomInset={insets.bottom} />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    marginLeft: 5,
  },
  sectionContent: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    minHeight: 60,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
  },
  separator: {
    height: 1,
    marginLeft: 16,
  },
  footer: {
    marginTop: 20,
    marginBottom: 40,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  logoutText: {
    color: COLORS.danger,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  uploadFab: {
    position: 'absolute',
    left: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  chatbotFab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  chatbotFabText: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 10,
  },
});
