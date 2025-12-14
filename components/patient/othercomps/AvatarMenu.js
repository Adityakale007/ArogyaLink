import React, { useEffect, useMemo, useState } from 'react';
import { View, Image, Text, TouchableOpacity, Pressable, Platform, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { useAuth } from '../../../contexts/AuthContext';
import { API_BASE_URL, API_ENDPOINTS } from '../../../config/api';

const AvatarMenu = ({ avatarUri, onProfile, onSettings, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (isOpen) {
      scale.value = withTiming(1, { duration: 160, easing: Easing.out(Easing.cubic) });
      opacity.value = withTiming(1, { duration: 140 });
    } else {
      scale.value = withTiming(0.95, { duration: 120, easing: Easing.in(Easing.cubic) });
      opacity.value = withTiming(0, { duration: 120 });
    }
  }, [isOpen]);

  const animatedMenuStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  // Fetch profile data from database when menu opens
  useEffect(() => {
    if (isOpen && user?._id && !profileData) {
      fetchProfileData();
    }
  }, [isOpen, user?._id]);

  const fetchProfileData = async () => {
    if (!user?._id) return;
    
    setLoadingProfile(true);
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
      setLoadingProfile(false);
    }
  };

  const handleToggle = () => {
    const next = !isOpen;
    if (next) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      // Fetch profile data when opening
      if (user?._id && !profileData) {
        fetchProfileData();
      }
    }
    setIsOpen(next);
  };

  const handleSelect = (action) => {
    setIsOpen(false);
    action && action();
  };

  const containerOffsets = useMemo(() => ({
    top: insets.top + 10, // safe-area + small margin
    right: 24, // Position like pharmacy bubble (right: 24)
  }), [insets.top]);

  return (
    <View
      className="absolute z-50 items-end"
      style={{ top: containerOffsets.top, right: containerOffsets.right, elevation: 10, zIndex: 1000 }}
      pointerEvents="box-none"
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={handleToggle}
        style={styles.avatarButton}
      >
        <Image
          source={avatarUri}
          style={styles.avatarImage}
          resizeMode="cover"
        />
      </TouchableOpacity>

      {isOpen && (
        <>
          {/* Backdrop to capture outside taps */}
          <Pressable
            onPress={() => setIsOpen(false)}
            style={styles.backdrop}
          />

          <Animated.View
            style={[styles.menuContainer, animatedMenuStyle]}
          >
            {/* Profile Info Section */}
            {profileData && (
              <>
                <View style={styles.profileInfoContainer}>
                  <Text style={styles.profileName}>{profileData.name || 'User'}</Text>
                  {profileData.email && (
                    <Text style={styles.profileEmail} numberOfLines={1}>{profileData.email}</Text>
                  )}
                  {profileData.mobile && (
                    <Text style={styles.profileMobile}>{profileData.mobile}</Text>
                  )}
                  {profileData.role && (
                    <Text style={styles.profileRole}>{profileData.role}</Text>
                  )}
                </View>
                <View style={styles.divider} />
              </>
            )}
            
            <TouchableOpacity
              onPress={() => handleSelect(onProfile)}
              style={styles.menuItem}
            >
              <Text style={styles.menuItemText}>Profile</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity
              onPress={() => handleSelect(onSettings)}
              style={styles.menuItem}
            >
              <Text style={styles.menuItemText}>Settings</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity
              onPress={() => handleSelect(onLogout)}
              style={styles.menuItem}
            >
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </Animated.View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  avatarButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#888888',
    backgroundColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  backdrop: {
    position: 'absolute',
    top: -1000,
    left: -1000,
    right: -1000,
    bottom: -1000,
    zIndex: -1,
  },
  menuContainer: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    width: 200,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  profileInfoContainer: {
    padding: 16,
    backgroundColor: '#F9FAFB',
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  profileMobile: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  profileRole: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '600',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuItemText: {
    fontSize: 15,
    color: '#111827',
  },
  logoutText: {
    fontSize: 15,
    color: '#DC2626',
    fontWeight: '600',
  },
});

export default AvatarMenu;


