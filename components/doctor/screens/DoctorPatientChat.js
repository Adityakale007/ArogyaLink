// DoctorPatientChat.jsx - Doctor chatting with Patient or Worker

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { API_BASE_URL, API_ENDPOINTS } from '../../../config/api';
import { initializeSocket, getSocket } from '../../../utils/socket';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Image,
  StatusBar,
} from 'react-native';
import { useTheme } from '../../../contexts/ThemeContext';

const cardColors = {
  grayText: '#6b7280',
  white: '#ffffff',
  greenAccent: '#10b981', 
  maroonPrimary: '#881337',
  maroonLight: '#fdf2f8',
  maroonMessage: '#be123c',
  grayMessage: '#f3f4f6',
};

// Component for a single chat bubble
const MessageBubble = ({ message, theme }) => {
  const isUser = message.isUser; // Doctor (our user)
  const userBubbleStyle = { backgroundColor: theme.primary };
  const otherBubbleStyle = { backgroundColor: theme.card };
  const userTextStyle = { color: theme.buttonText };
  const otherTextStyle = { color: theme.text };

  return (
    <View
      style={[
        styles.messageContainer,
        isUser ? styles.userMessageContainer : styles.patientMessageContainer,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isUser ? userBubbleStyle : otherBubbleStyle,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            isUser ? userTextStyle : otherTextStyle,
          ]}
        >
          {message.text}
        </Text>
        <Text
          style={[
            styles.timeText,
            isUser ? userTextStyle : otherTextStyle,
          ]}
        >
          {message.time}
        </Text>
      </View>
    </View>
  );
};

const DoctorPatientChat = ({ route, navigation }) => {
  const { patient, worker, userType } = route.params;
  const user = patient || worker;
  const { theme } = useTheme();
  const { user: currentUser } = useAuth();
  const socket = getSocket();

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);

  // Initialize socket and fetch messages
  useEffect(() => {
    if (currentUser?._id && user?.id) {
      // Initialize socket connection
      const socketInstance = initializeSocket(currentUser._id);
      
      // Fetch existing messages
      fetchMessages();

      // Listen for new messages
      socketInstance.on('receive_message', (data) => {
        if (data.message && (data.senderId === user.id || data.message.senderId === user.id)) {
          const formattedMessage = {
            id: data.message._id,
            text: data.message.message,
            isUser: data.message.senderId === currentUser._id,
            time: new Date(data.message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          setMessages(prev => [formattedMessage, ...prev]);
        }
      });

      // Cleanup on unmount
      return () => {
        socketInstance.off('receive_message');
      };
    }
  }, [currentUser?._id, user?.id]);

  const fetchMessages = async () => {
    if (!currentUser?._id || !user?.id) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.CHAT}/messages/${currentUser._id}/${user.id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const formattedMessages = data.messages.map(msg => ({
            id: msg._id,
            text: msg.message,
            isUser: msg.senderId._id === currentUser._id,
            time: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }));
          setMessages(formattedMessages.reverse());
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    if (inputText.trim() && currentUser?._id && user?.id) {
      const socketInstance = getSocket();
      
      if (socketInstance && socketInstance.connected) {
        // Send via websocket
        socketInstance.emit('send_message', {
          senderId: currentUser._id,
          receiverId: user.id,
          message: inputText.trim(),
        });

        // Optimistically add message
        const newMessage = {
          id: Date.now().toString(),
          text: inputText.trim(),
          isUser: true, 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [newMessage, ...prev]);
        setInputText('');
      } else {
        // Fallback: add message locally if socket not connected
        const newMessage = {
          id: Date.now().toString(),
          text: inputText.trim(),
          isUser: true, 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [newMessage, ...prev]);
        setInputText('');
      }
    }
  };

  const userAvatar = user?.avatarUrl || `https://i.pravatar.cc/150?img=${user?.id || 1}`;
  const userName = user?.name || 'User';
  const userRole = user?.role || (userType === 'worker' ? 'ASHA Worker' : 'Patient');

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar backgroundColor={theme.primary} barStyle={theme.statusBarStyle} />
      
      {/* Custom Header */}
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={[styles.backButtonText, { color: theme.buttonText }]}>{'< Back'}</Text>
        </TouchableOpacity>
        <Image source={{ uri: userAvatar }} style={styles.avatar} />
        <View style={styles.headerTitleGroup}>
          <Text style={[styles.headerTitle, { color: theme.buttonText }]}>{userName}</Text>
          <Text style={[styles.headerSubtitle, { color: theme.surface }]}>{userRole}</Text>
        </View>
      </View>

      {/* Chat Messages */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={{ color: theme.text }}>Loading messages...</Text>
        </View>
      ) : (
        <FlatList
          data={messages}
          renderItem={({ item }) => <MessageBubble message={item} theme={theme} />}
          keyExtractor={(item) => item.id}
          inverted
          contentContainerStyle={styles.messageList}
        />
      )}

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={[styles.inputContainer, { backgroundColor: theme.surface }]}>
          <TextInput
            style={[styles.input, { backgroundColor: theme.card, color: theme.text }]}
            placeholder="Type a message..."
            placeholderTextColor={theme.textSecondary}
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, { backgroundColor: theme.primary }]}
            onPress={handleSend}
          >
            <Text style={[styles.sendButtonText, { color: theme.buttonText }]}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 15,
    paddingHorizontal: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  backButton: {
    marginRight: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerTitleGroup: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  messageList: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 12,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  patientMessageContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
  },
  messageText: {
    fontSize: 15,
    marginBottom: 4,
  },
  timeText: {
    fontSize: 11,
    opacity: 0.7,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    maxHeight: 100,
  },
  sendButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DoctorPatientChat;
