// ChatWithDoctor.jsx

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
import { useAuth } from '../../contexts/AuthContext';
import { API_BASE_URL, API_ENDPOINTS } from '../../config/api';

const cardColors = {
  // Existing Colors
  grayText: '#6b7280', 
  white: '#ffffff',
  greenAccent: '#10b981', 
  
  // Maroon Secondary Scheme
  maroonPrimary: '#881337', 
  maroonLight: '#fdf2f8', 
};

// Mock Data for Doctors (Expanded to 8)
const mockDoctors = [
  {
    id: 'd1',
    name: 'Dr. Priya Singh (MBBS)',
    lastMessage: 'Your report indicates a minor infection.',
    time: '2:10 PM',
    unread: 3,
    avatarUrl: 'https://i.pravatar.cc/150?img=9',
    specialty: 'General Physician',
  },
  {
    id: 'd2',
    name: 'Dr. Ashok Kumar (MD)',
    lastMessage: 'Please upload the recent blood test results.',
    time: 'Yesterday',
    unread: 0,
    avatarUrl: 'https://i.pravatar.cc/150?img=11',
    specialty: 'Pediatrician',
  },
  {
    id: 'd3',
    name: 'Dr. S. K. Reddy',
    lastMessage: 'The next follow-up appointment is next week.',
    time: '9/29/2025',
    unread: 1,
    avatarUrl: 'https://i.pravatar.cc/150?img=8',
    specialty: 'Cardiologist',
  },
  {
    id: 'd4',
    name: 'Dr. Neha Verma',
    lastMessage: 'Check your temperature twice a day.',
    time: '4:30 PM',
    unread: 5,
    avatarUrl: 'https://i.pravatar.cc/150?img=2',
    specialty: 'Dermatologist',
  },
  {
    id: 'd5',
    name: 'Dr. Rohan Mehra',
    lastMessage: 'Do you have any history of allergies?',
    time: '5:00 AM',
    unread: 0,
    avatarUrl: 'https://i.pravatar.cc/150?img=7',
    specialty: 'Orthopedic',
  },
  {
    id: 'd6',
    name: 'Dr. Kavita Desai',
    lastMessage: 'I have sent the prescription details.',
    time: '9/27/2025',
    unread: 2,
    avatarUrl: 'https://i.pravatar.cc/150?img=10',
    specialty: 'Gynecologist',
  },
  {
    id: 'd7',
    name: 'Dr. V. Nambiar',
    lastMessage: 'Follow the diet plan strictly for a week.',
    time: '9/26/2025',
    unread: 0,
    avatarUrl: 'https://i.pravatar.cc/150?img=3',
    specialty: 'Endocrinologist',
  },
  {
    id: 'd8',
    name: 'Dr. Alok Sharma',
    lastMessage: 'Please confirm your availability tomorrow.',
    time: '8:05 AM',
    unread: 1,
    avatarUrl: 'https://i.pravatar.cc/150?img=12',
    specialty: 'Neurologist',
  },
];

// Component for a single chat item
const ChatItem = ({ item, onPress }) => (
  <TouchableOpacity style={styles.chatItemContainer} onPress={onPress}>
    <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
    <View style={styles.chatDetails}>
      <View style={styles.nameTimeRow}>
        <Text style={styles.doctorName}>{item.name}</Text>
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

const ChatWithDoctor = ({ navigation }) => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastMessages, setLastMessages] = useState({});

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      // Fetch doctors from database
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CHAT}/doctors`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Combine database doctors with demo data
          const dbDoctors = data.doctors.map((doc, index) => ({
            id: doc._id,
            name: doc.name,
            specialty: doc.role || 'General Physician',
            avatarUrl: doc.profilePhoto || `https://i.pravatar.cc/150?img=${index + 1}`,
            email: doc.email,
            mobile: doc.mobile,
          }));

          // Merge with demo data (keeping demo for variety)
          const allDoctors = [...dbDoctors, ...mockDoctors];
          
          // Remove duplicates based on name
          const uniqueDoctors = allDoctors.filter((doctor, index, self) =>
            index === self.findIndex((d) => d.name === doctor.name)
          );

          setDoctors(uniqueDoctors);
          
          // Fetch last messages for each doctor
          if (user?._id) {
            fetchLastMessages(uniqueDoctors);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      // Fallback to demo data
      setDoctors(mockDoctors);
    } finally {
      setLoading(false);
    }
  };

  const fetchLastMessages = async (doctorsList) => {
    if (!user?._id) return;

    const messagesMap = {};
    
    for (const doctor of doctorsList) {
      try {
        const response = await fetch(
          `${API_BASE_URL}${API_ENDPOINTS.CHAT}/messages/${user._id}/${doctor.id}`,
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
            messagesMap[doctor.id] = {
              text: lastMsg.message,
              time: new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              unread: data.messages.filter(m => !m.read && m.senderId._id !== user._id).length,
            };
          }
        }
      } catch (error) {
        console.error(`Error fetching messages for ${doctor.id}:`, error);
      }
    }

    setLastMessages(messagesMap);
  };

  const navigateToChat = (doctor) => {
    // Navigates to the DoctorChat screen
    navigation.navigate('DoctorChat', { doctor });
  };

  const formatDoctorData = (doctor) => {
    const lastMsg = lastMessages[doctor.id];
    return {
      ...doctor,
      lastMessage: lastMsg?.text || 'No messages yet',
      time: lastMsg?.time || '',
      unread: lastMsg?.unread || 0,
    };
  };

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={cardColors.maroonPrimary}
        barStyle="light-content"
      />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Consults</Text>
        <Text style={styles.headerSubtitle}>PHC Connection</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={cardColors.maroonPrimary} />
        </View>
      ) : (
        <FlatList
          data={doctors}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChatItem item={formatDoctorData(item)} onPress={() => navigateToChat(item)} />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
};

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
  doctorName: {
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

export default ChatWithDoctor;