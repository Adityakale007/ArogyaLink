import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../contexts/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import HealthChatBot from '../../patient/othercomps/HealthChatBot';

const { width } = Dimensions.get('window');

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

export default function PharmaDashboard() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [isChatbotVisible, setIsChatbotVisible] = useState(false);

  const handleChatbotPress = () => {
    setIsChatbotVisible(true);
  };

  const closeChatbot = () => {
    setIsChatbotVisible(false);
  };

  const quickStats = [
    { title: 'Total Medicines', value: '156', icon: 'medical', color: COLORS.primary },
    { title: 'Low Stock', value: '12', icon: 'warning', color: COLORS.warning },
    { title: 'Expiring Soon', value: '8', icon: 'time', color: COLORS.danger },
    { title: 'Orders Today', value: '24', icon: 'list', color: COLORS.secondary },
  ];

  const recentActivities = [
    { id: 1, action: 'Added Paracetamol', time: '2 hours ago', type: 'add' },
    { id: 2, action: 'Stock Alert: Insulin', time: '4 hours ago', type: 'alert' },
    { id: 3, action: 'Order #1234 Completed', time: '6 hours ago', type: 'order' },
    { id: 4, action: 'Updated Amoxicillin Stock', time: '8 hours ago', type: 'update' },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'add': return 'add-circle';
      case 'alert': return 'warning';
      case 'order': return 'checkmark-circle';
      case 'update': return 'refresh';
      default: return 'information-circle';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'add': return COLORS.success;
      case 'alert': return COLORS.warning;
      case 'order': return COLORS.primary;
      case 'update': return COLORS.secondary;
      default: return COLORS.gray;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background || COLORS.white }]}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        {/* Back Button - Lowered for iPhone 15 notch */}
        <TouchableOpacity
          style={[styles.backButton, { top: insets.top + 10 }]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.text || COLORS.black} />
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, { color: theme.text || COLORS.black }]}>
          Pharmacy Dashboard
        </Text>
        <Text style={[styles.headerSubtitle, { color: theme.textSecondary || '#666' }]}>
          Manage your pharmacy efficiently
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <Text style={[styles.sectionTitle, { color: theme.text || COLORS.black }]}>
            Quick Overview
          </Text>
          <View style={styles.statsGrid}>
            {quickStats.map((stat, index) => (
              <View key={index} style={[styles.statCard, { backgroundColor: theme.card || COLORS.white }]}>
                <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                  <Ionicons name={stat.icon} size={24} color={stat.color} />
                </View>
                <Text style={[styles.statValue, { color: theme.text || COLORS.black }]}>
                  {stat.value}
                </Text>
                <Text style={[styles.statTitle, { color: theme.textSecondary || '#666' }]}>
                  {stat.title}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Activities */}
        <View style={styles.activitiesContainer}>
          <Text style={[styles.sectionTitle, { color: theme.text || COLORS.black }]}>
            Recent Activities
          </Text>
          <View style={[styles.activitiesList, { backgroundColor: theme.card || COLORS.white }]}>
            {recentActivities.map((activity) => (
              <View key={activity.id} style={styles.activityItem}>
                <View style={[styles.activityIcon, { backgroundColor: getActivityColor(activity.type) + '20' }]}>
                  <Ionicons 
                    name={getActivityIcon(activity.type)} 
                    size={20} 
                    color={getActivityColor(activity.type)} 
                  />
                </View>
                <View style={styles.activityContent}>
                  <Text style={[styles.activityText, { color: theme.text || COLORS.black }]}>
                    {activity.action}
                  </Text>
                  <Text style={[styles.activityTime, { color: theme.textSecondary || '#666' }]}>
                    {activity.time}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <Text style={[styles.sectionTitle, { color: theme.text || COLORS.black }]}>
            Quick Actions
          </Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: theme.primary || COLORS.primary }]}
              onPress={() => {/* Navigate to add medicine */}}
            >
              <Ionicons name="add" size={24} color={COLORS.white} />
              <Text style={styles.actionText}>Add Medicine</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: theme.secondary || COLORS.secondary }]}
              onPress={() => {/* Navigate to search */}}
            >
              <Ionicons name="search" size={24} color={COLORS.white} />
              <Text style={styles.actionText}>Search Stock</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: theme.warning || COLORS.warning }]}
              onPress={() => {/* Show low stock alert */}}
            >
              <Ionicons name="alert" size={24} color={COLORS.white} />
              <Text style={styles.actionText}>Low Stock Alert</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: theme.danger || COLORS.danger }]}
              onPress={() => {/* Navigate to expiry check */}}
            >
              <Ionicons name="time" size={24} color={COLORS.white} />
              <Text style={styles.actionText}>Expiry Check</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Floating AI Chatbot Button */}
      <TouchableOpacity
        style={[styles.fab, styles.fabShadow, { bottom: 24, right: 24 }]}
        onPress={handleChatbotPress}
      >
        <Text style={styles.fabText}>🧠</Text>
      </TouchableOpacity>

      {isChatbotVisible && (
        <View style={styles.overlay}>
          <HealthChatBot onClose={closeChatbot} bottomInset={insets.bottom} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 10,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  statsContainer: {
    marginBottom: 30,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - 60) / 2,
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statTitle: {
    fontSize: 12,
    textAlign: 'center',
  },
  activitiesContainer: {
    marginBottom: 30,
  },
  activitiesList: {
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
  },
  actionsContainer: {
    marginBottom: 30,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: (width - 60) / 2,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
  },
  fabText: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  fabShadow: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 10,
  },
});
