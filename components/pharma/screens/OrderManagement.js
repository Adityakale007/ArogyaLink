import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../contexts/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import HealthChatBot from '../../patient/othercomps/HealthChatBot';

// Mock data for orders
const mockOrders = [
  {
    id: '1',
    orderNumber: 'ORD-001',
    patientName: 'Rajesh Kumar',
    medicines: ['Paracetamol', 'Amoxicillin'],
    status: 'pending',
    date: '2025-01-20',
    totalAmount: '₹450',
  },
  {
    id: '2',
    orderNumber: 'ORD-002',
    patientName: 'Priya Sharma',
    medicines: ['Insulin', 'Metformin'],
    status: 'processing',
    date: '2025-01-20',
    totalAmount: '₹1200',
  },
  {
    id: '3',
    orderNumber: 'ORD-003',
    patientName: 'Amit Singh',
    medicines: ['Aspirin', 'Vitamin D'],
    status: 'completed',
    date: '2025-01-19',
    totalAmount: '₹300',
  },
];

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

const getStatusColor = (status) => {
  switch (status) {
    case 'pending': return COLORS.warning;
    case 'processing': return COLORS.primary;
    case 'completed': return COLORS.success;
    case 'cancelled': return COLORS.danger;
    default: return COLORS.gray;
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'pending': return 'time-outline';
    case 'processing': return 'refresh-outline';
    case 'completed': return 'checkmark-circle-outline';
    case 'cancelled': return 'close-circle-outline';
    default: return 'help-circle-outline';
  }
};

export default function OrderManagement() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [orders, setOrders] = useState(mockOrders);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
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
      Alert.alert('Report Uploaded', 'Your order report has been successfully uploaded!');
    }
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    setModalVisible(false);
  };

  const renderOrderCard = ({ item }) => {
    const statusColor = getStatusColor(item.status);
    const statusIcon = getStatusIcon(item.status);

    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: theme.card || COLORS.white }]}
        onPress={() => openOrderDetails(item)}
      >
        <View style={styles.cardHeader}>
          <Text style={[styles.orderNumber, { color: theme.text || COLORS.black }]}>
            {item.orderNumber}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Ionicons name={statusIcon} size={16} color={COLORS.white} />
            <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
          </View>
        </View>
        
        <Text style={[styles.patientName, { color: theme.text || COLORS.black }]}>
          {item.patientName}
        </Text>
        
        <View style={styles.medicinesContainer}>
          <Text style={[styles.medicinesLabel, { color: theme.textSecondary || '#666' }]}>
            Medicines:
          </Text>
          {item.medicines.map((medicine, index) => (
            <Text key={index} style={[styles.medicineItem, { color: theme.text || COLORS.black }]}>
              • {medicine}
            </Text>
          ))}
        </View>
        
        <View style={styles.cardFooter}>
          <Text style={[styles.date, { color: theme.textSecondary || '#666' }]}>
            {item.date}
          </Text>
          <Text style={[styles.amount, { color: theme.primary || COLORS.primary }]}>
            {item.totalAmount}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background || COLORS.white }]}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <Text style={[styles.title, { color: theme.text || COLORS.black }]}>Order Management</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => Alert.alert('Add Order', 'Create new order functionality')}>
          <Ionicons name="add" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={orders}
        renderItem={renderOrderCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.card || COLORS.white }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text || COLORS.black }]}>
                Order Details
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.text || COLORS.black} />
              </TouchableOpacity>
            </View>
            
            {selectedOrder && (
              <ScrollView style={styles.modalBody}>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: theme.textSecondary || '#666' }]}>
                    Order Number:
                  </Text>
                  <Text style={[styles.detailValue, { color: theme.text || COLORS.black }]}>
                    {selectedOrder.orderNumber}
                  </Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: theme.textSecondary || '#666' }]}>
                    Patient:
                  </Text>
                  <Text style={[styles.detailValue, { color: theme.text || COLORS.black }]}>
                    {selectedOrder.patientName}
                  </Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: theme.textSecondary || '#666' }]}>
                    Date:
                  </Text>
                  <Text style={[styles.detailValue, { color: theme.text || COLORS.black }]}>
                    {selectedOrder.date}
                  </Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: theme.textSecondary || '#666' }]}>
                    Total Amount:
                  </Text>
                  <Text style={[styles.detailValue, { color: theme.primary || COLORS.primary, fontWeight: 'bold' }]}>
                    {selectedOrder.totalAmount}
                  </Text>
                </View>
                
                <View style={styles.medicinesSection}>
                  <Text style={[styles.sectionTitle, { color: theme.text || COLORS.black }]}>
                    Medicines Ordered:
                  </Text>
                  {selectedOrder.medicines.map((medicine, index) => (
                    <View key={index} style={styles.medicineRow}>
                      <Ionicons name="medical" size={20} color={theme.primary || COLORS.primary} />
                      <Text style={[styles.medicineText, { color: theme.text || COLORS.black }]}>
                        {medicine}
                      </Text>
                    </View>
                  ))}
                </View>
                
                <View style={styles.actionButtons}>
                  {selectedOrder.status === 'pending' && (
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: COLORS.primary }]}
                      onPress={() => updateOrderStatus(selectedOrder.id, 'processing')}
                    >
                      <Ionicons name="play" size={20} color={COLORS.white} />
                      <Text style={styles.actionButtonText}>Start Processing</Text>
                    </TouchableOpacity>
                  )}
                  
                  {selectedOrder.status === 'processing' && (
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: COLORS.success }]}
                      onPress={() => updateOrderStatus(selectedOrder.id, 'completed')}
                    >
                      <Ionicons name="checkmark" size={20} color={COLORS.white} />
                      <Text style={styles.actionButtonText}>Mark Complete</Text>
                    </TouchableOpacity>
                  )}
                  
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: COLORS.danger }]}
                    onPress={() => updateOrderStatus(selectedOrder.id, 'cancelled')}
                  >
                    <Ionicons name="close" size={20} color={COLORS.white} />
                    <Text style={styles.actionButtonText}>Cancel Order</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

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
  addButton: {
    backgroundColor: COLORS.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 20,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  patientName: {
    fontSize: 14,
    marginBottom: 8,
  },
  medicinesContainer: {
    marginBottom: 12,
  },
  medicinesLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  medicineItem: {
    fontSize: 12,
    marginLeft: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 12,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalBody: {
    flex: 1,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    flex: 1,
    textAlign: 'right',
  },
  medicinesSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  medicineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  medicineText: {
    fontSize: 14,
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    justifyContent: 'center',
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
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
