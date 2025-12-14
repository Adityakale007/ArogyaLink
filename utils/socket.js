import { io } from 'socket.io-client';
import { API_BASE_URL } from '../config/api';

let socket = null;

export const initializeSocket = (userId) => {
  if (socket && socket.connected) {
    return socket;
  }

  // Extract base URL without /api
  const baseURL = API_BASE_URL.replace('/api', '');
  const wsURL = baseURL.replace('http://', 'ws://').replace('https://', 'wss://');

  socket = io(baseURL, {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  });

  socket.on('connect', () => {
    console.log('Socket connected');
    if (userId) {
      socket.emit('join', userId);
    }
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  return socket;
};

export const getSocket = () => {
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export default {
  initializeSocket,
  getSocket,
  disconnectSocket,
};
