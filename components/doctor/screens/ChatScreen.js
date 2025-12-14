// ChatScreen.jsx - Doctor's Chat Screen with Patients and Workers

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../contexts/AuthContext';
import { useTheme } from '../../../contexts/ThemeContext';
import { API_BASE_URL, API_ENDPOINTS } from '../../../config/api';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const cardColors = {
  grayText: '#6b7280', 
  white: '#ffffff',
  greenAccent: '#10b981', 
  maroonPrimary: '#881337', 
  maroonLight: '#fdf2f8', 
};

// Demo Patients
const mockPatients = [
  {
    id: 'p1',
    name: 'Rajesh Kumar',
    lastMessage: 'I have been experiencing chest pain since morning.',
    time: '2:10 PM',
    unread: 3,
    avatarUrl: 'https://i.pravatar.cc/150?img=15',
    role: 'Patient',
  },
  {
    id: 'p2',
    name: 'Priya Sharma',
    lastMessage: 'Thank you for the prescription, doctor.',
    time: 'Yesterday',
    unread: 0,
    avatarUrl: 'https://i.pravatar.cc/150?img=20',
    role: 'Patient',
  },
  {
    id: 'p3',
    name: 'Amit Patel',
    lastMessage: 'When should I come for the follow-up?',
    time: '9/29/2025',
    unread: 1,
    avatarUrl: 'https://i.pravatar.cc/150?img=18',
    role: 'Patient',
  },
  {
    id: 'p4',
    name: 'Sunita Devi',
    lastMessage: 'The medicine is working well.',
    time: '4:30 PM',
    unread: 5,
    avatarUrl: 'https://i.pravatar.cc/150?img=19',
    role: 'Patient',
  },
  {
    id: 'p5',
    name: 'Vikram Singh',
    lastMessage: 'I need to reschedule my appointment.',
    time: '5:00 AM',
    unread: 0,
    avatarUrl: 'https://i.pravatar.cc/150?img=16',
    role: 'Patient',
  },
];

// Demo Workers
const mockWorkers = [
  {
    id: 'w1',
    name: 'Meera Kumari',
    lastMessage: 'Patient visit completed in Sector 5.',
    time: '2:10 PM',
    unread: 2,
    avatarUrl: 'https://i.pravatar.cc/150?img=25',
    role: 'Asha Worker',
  },
  {
    id: 'w2',
    name: 'Lakshmi Nair',
    lastMessage: 'Need guidance on vaccination schedule.',
    time: 'Yesterday',
    unread: 0,
    avatarUrl: 'https://i.pravatar.cc/150?img=26',
    role: 'Asha Worker',
  },
  {
    id: 'w3',
    name: 'Geeta Yadav',
    lastMessage: 'Completed health checkup for 5 families.',
    time: '9/29/2025',
    unread: 1,
    avatarUrl: 'https://i.pravatar.cc/150?img=27',
    role: 'Asha Worker',
  },
  {
    id: 'w4',
    name: 'Sushila Devi',
    lastMessage: 'Patient requires immediate attention.',
    time: '4:30 PM',
    unread: 3,
    avatarUrl: 'https://i.pravatar.cc/150?img=28',
    role: 'Asha Worker',
  },
];

// Component for a single chat item
const ChatItem = ({ item, onPress }) => (
  <TouchableOpacity style={styles.chatItemContainer} onPress={onPress}>
    <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
    <View style={styles.chatDetails}>
      <View style={styles.nameTimeRow}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.timeText}>{item.time}</Text>
      </View>
      <View style={styles.messageUnreadRow}>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage}
        </Text>
        {item.unread > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.unread}</Text>
          </View>
        )}
      </View>
    </View>
  </TouchableOpacity>
);

export default function ChatScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('patients'); // 'patients' or 'workers'
  const [patients, setPatients] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastMessages, setLastMessages] = useState({});

  useEffect(() => {
    fetchPatients();
    fetchWorkers();
  }, []);

  const fetchPatients = async () => {
    try {
      // Fetch patients from database
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CHAT}/patients`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Combine database patients with demo data
          const dbPatients = data.patients.map((patient, index) => ({
            id: patient._id,
            name: patient.name,
            role: patient.role || 'Patient',
            avatarUrl: patient.profilePhoto || `https://i.pravatar.cc/150?img=${15 + index}`,
            email: patient.email,
            mobile: patient.mobile,
          }));

          // Merge with demo data
          const allPatients = [...dbPatients, ...mockPatients];
          
          // Remove duplicates based on name
          const uniquePatients = allPatients.filter((patient, index, self) =>
            index === self.findIndex((p) => p.name === patient.name)
          );

          setPatients(uniquePatients);
          
          // Fetch last messages for each patient
          if (currentUser?._id) {
            fetchLastMessages(uniquePatients, 'patients');
          }
        }
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      // Fallback to demo data
      setPatients(mockPatients);
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkers = async () => {
    try {
      // Fetch workers from database
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CHAT}/workers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Combine database workers with demo data
          const dbWorkers = data.workers.map((worker, index) => ({
            id: worker._id,
            name: worker.name,
            role: worker.role || 'Asha Worker',
            avatarUrl: worker.profilePhoto || `https://i.pravatar.cc/150?img=${25 + index}`,
            email: worker.email,
            mobile: worker.mobile,
          }));

          // Merge with demo data
          const allWorkers = [...dbWorkers, ...mockWorkers];
          
          // Remove duplicates based on name
          const uniqueWorkers = allWorkers.filter((worker, index, self) =>
            index === self.findIndex((w) => w.name === worker.name)
          );

          setWorkers(uniqueWorkers);
          
          // Fetch last messages for each worker
          if (currentUser?._id) {
            fetchLastMessages(uniqueWorkers, 'workers');
          }
        }
      }
    } catch (error) {
      console.error('Error fetching workers:', error);
      // Fallback to demo data
      setWorkers(mockWorkers);
    }
  };

  const fetchLastMessages = async (usersList, type) => {
    if (!currentUser?._id) return;

    const messagesMap = {};
    
    for (const userItem of usersList) {
      try {
        const response = await fetch(
          `${API_BASE_URL}${API_ENDPOINTS.CHAT}/messages/${currentUser._id}/${userItem.id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.messages && data.messages.length > 0) {
            const lastMsg = data.messages[data.messages.length - 1];
            messagesMap[userItem.id] = {
              text: lastMsg.message,
              time: new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              unread: data.messages.filter(m => !m.read && m.senderId._id !== currentUser._id).length,
            };
          }
        }
      } catch (error) {
        console.error(`Error fetching messages for ${userItem.id}:`, error);
      }
    }

    setLastMessages(prev => ({ ...prev, ...messagesMap }));
  };

  const navigateToChat = (userItem) => {
    // Navigate to individual chat screen
    if (activeTab === 'patients') {
      navigation.navigate('DoctorPatientChat', { patient: userItem, userType: 'patient' });
    } else {
      navigation.navigate('DoctorPatientChat', { worker: userItem, userType: 'worker' });
    }
  };

  const formatUserData = (userItem) => {
    const lastMsg = lastMessages[userItem.id];
    return {
      ...userItem,
      lastMessage: lastMsg?.text || 'No messages yet',
      time: lastMsg?.time || '',
      unread: lastMsg?.unread || 0,
    };
  };

  const currentData = activeTab === 'patients' ? patients : workers;
  const headerTitle = activeTab === 'patients' ? 'Patients' : 'ASHA Workers';
  const headerSubtitle = activeTab === 'patients' ? 'Patient Consultations' : 'Field Support';

  return (
    <View style={[styles.container, { backgroundColor: theme?.background || cardColors.white, paddingTop: insets.top }]}>
      <StatusBar
        backgroundColor={cardColors.maroonPrimary}
        barStyle="light-content"
      />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{headerTitle}</Text>
        <Text style={styles.headerSubtitle}>{headerSubtitle}</Text>
      </View>

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'patients' && styles.activeTab,
            { backgroundColor: activeTab === 'patients' ? cardColors.maroonPrimary : 'transparent' }
          ]}
          onPress={() => setActiveTab('patients')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'patients' && styles.activeTabText
          ]}>
            Patients
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'workers' && styles.activeTab,
            { backgroundColor: activeTab === 'workers' ? cardColors.maroonPrimary : 'transparent' }
          ]}
          onPress={() => setActiveTab('workers')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'workers' && styles.activeTabText
          ]}>
            Workers
          </Text>
        </TouchableOpacity>
      </View>

      {/* Chat List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={cardColors.maroonPrimary} />
        </View>
      ) : (
        <FlatList
          data={currentData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChatItem item={formatUserData(item)} onPress={() => navigateToChat(item)} />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cardColors.white,
  },
  header: {
    backgroundColor: cardColors.maroonPrimary,
    paddingTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: cardColors.white,
  },
  headerSubtitle: {
    fontSize: 14,
    color: cardColors.maroonLight,
    marginTop: 2,
    opacity: 0.9,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: cardColors.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: cardColors.maroonPrimary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: cardColors.grayText,
  },
  activeTabText: {
    color: cardColors.white,
    fontWeight: 'bold',
  },
  chatItemContainer: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
    backgroundColor: cardColors.white,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    backgroundColor: cardColors.maroonLight,
  },
  chatDetails: {
    flex: 1,
  },
  nameTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  timeText: {
    fontSize: 12,
    color: cardColors.grayText,
  },
  messageUnreadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    color: cardColors.grayText,
    flex: 1,
    marginRight: 10,
  },
  unreadBadge: {
    backgroundColor: cardColors.greenAccent,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  unreadText: {
    color: cardColors.white,
    fontSize: 11,
    fontWeight: 'bold',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#ccc',
    marginLeft: 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
