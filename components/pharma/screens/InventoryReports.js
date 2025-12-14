import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../contexts/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
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

// Mock data for reports
const stockSummary = {
  totalMedicines: 156,
  lowStock: 12,
  expiringSoon: 8,
  expired: 3,
  totalValue: '₹2,45,000',
};

const topMedicines = [
  { name: 'Paracetamol', sales: 450, revenue: '₹9,000' },
  { name: 'Amoxicillin', sales: 320, revenue: '₹4,800' },
  { name: 'Insulin', sales: 180, revenue: '₹81,000' },
  { name: 'Metformin', sales: 280, revenue: '₹2,800' },
  { name: 'Aspirin', sales: 200, revenue: '₹1,000' },
];

const expiryAlerts = [
  { medicine: 'Insulin', batch: 'BATCH003', expiry: '2025-08-20', daysLeft: 15 },
  { medicine: 'Amoxicillin', batch: 'BATCH002', expiry: '2025-10-15', daysLeft: 25 },
  { medicine: 'Vitamin D', batch: 'BATCH004', expiry: '2025-11-30', daysLeft: 30 },
];

export default function InventoryReports() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [selectedReport, setSelectedReport] = useState('overview');
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
      Alert.alert('Report Uploaded', 'Your inventory report has been successfully uploaded!');
    }
  };

  const handleExportReport = () => {
    Alert.alert('Export Report', 'Exporting report to PDF/CSV...');
  };

  const reportTypes = [
    { id: 'overview', title: 'Overview', icon: 'bar-chart' },
    { id: 'sales', title: 'Sales', icon: 'trending-up' },
    { id: 'expiry', title: 'Expiry', icon: 'time' },
    { id: 'stock', title: 'Stock', icon: 'cube' },
  ];

  const renderOverviewReport = () => (
    <View style={styles.reportContent}>
      <View style={styles.summaryCards}>
        <View style={[styles.summaryCard, { backgroundColor: theme.card || COLORS.white }]}>
          <Ionicons name="medical" size={32} color={COLORS.primary} />
          <Text style={[styles.summaryNumber, { color: theme.text || COLORS.black }]}>
            {stockSummary.totalMedicines}
          </Text>
          <Text style={[styles.summaryLabel, { color: theme.textSecondary || '#666' }]}>
            Total Medicines
          </Text>
        </View>
        
        <View style={[styles.summaryCard, { backgroundColor: theme.card || COLORS.white }]}>
          <Ionicons name="warning" size={32} color={COLORS.warning} />
          <Text style={[styles.summaryNumber, { color: theme.text || COLORS.black }]}>
            {stockSummary.lowStock}
          </Text>
          <Text style={[styles.summaryLabel, { color: theme.textSecondary || '#666' }]}>
            Low Stock
          </Text>
        </View>
        
        <View style={[styles.summaryCard, { backgroundColor: theme.card || COLORS.white }]}>
          <Ionicons name="time" size={32} color={COLORS.danger} />
          <Text style={[styles.summaryNumber, { color: theme.text || COLORS.black }]}>
            {stockSummary.expiringSoon}
          </Text>
          <Text style={[styles.summaryLabel, { color: theme.textSecondary || '#666' }]}>
            Expiring Soon
          </Text>
        </View>
        
        <View style={[styles.summaryCard, { backgroundColor: theme.card || COLORS.white }]}>
          <Ionicons name="close-circle" size={32} color={COLORS.danger} />
          <Text style={[styles.summaryNumber, { color: theme.text || COLORS.black }]}>
            {stockSummary.expired}
          </Text>
          <Text style={[styles.summaryLabel, { color: theme.textSecondary || '#666' }]}>
            Expired
          </Text>
        </View>
      </View>
      
      <View style={[styles.valueCard, { backgroundColor: theme.card || COLORS.white }]}>
        <Text style={[styles.valueTitle, { color: theme.text || COLORS.black }]}>
          Total Inventory Value
        </Text>
        <Text style={[styles.valueAmount, { color: theme.primary || COLORS.primary }]}>
          {stockSummary.totalValue}
        </Text>
      </View>
    </View>
  );

  const renderSalesReport = () => (
    <View style={styles.reportContent}>
      <Text style={[styles.sectionTitle, { color: theme.text || COLORS.black }]}>
        Top Selling Medicines
      </Text>
      <View style={[styles.salesList, { backgroundColor: theme.card || COLORS.white }]}>
        {topMedicines.map((medicine, index) => (
          <View key={index} style={styles.salesItem}>
            <View style={styles.salesInfo}>
              <Text style={[styles.medicineName, { color: theme.text || COLORS.black }]}>
                {medicine.name}
              </Text>
              <Text style={[styles.salesCount, { color: theme.textSecondary || '#666' }]}>
                {medicine.sales} units sold
              </Text>
            </View>
            <Text style={[styles.salesRevenue, { color: theme.primary || COLORS.primary }]}>
              {medicine.revenue}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderExpiryReport = () => (
    <View style={styles.reportContent}>
      <Text style={[styles.sectionTitle, { color: theme.text || COLORS.black }]}>
        Expiry Alerts
      </Text>
      <View style={[styles.expiryList, { backgroundColor: theme.card || COLORS.white }]}>
        {expiryAlerts.map((alert, index) => (
          <View key={index} style={styles.expiryItem}>
            <View style={styles.expiryInfo}>
              <Text style={[styles.medicineName, { color: theme.text || COLORS.black }]}>
                {alert.medicine}
              </Text>
              <Text style={[styles.batchInfo, { color: theme.textSecondary || '#666' }]}>
                Batch: {alert.batch} | Expiry: {alert.expiry}
              </Text>
            </View>
            <View style={[styles.daysLeft, { backgroundColor: alert.daysLeft <= 30 ? COLORS.danger : COLORS.warning }]}>
              <Text style={styles.daysLeftText}>
                {alert.daysLeft} days
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderStockReport = () => (
    <View style={styles.reportContent}>
      <Text style={[styles.sectionTitle, { color: theme.text || COLORS.black }]}>
        Stock Levels
      </Text>
      <View style={[styles.stockChart, { backgroundColor: theme.card || COLORS.white }]}>
        <View style={styles.chartItem}>
          <View style={styles.chartBar}>
            <View style={[styles.chartFill, { width: '80%', backgroundColor: COLORS.success }]} />
          </View>
          <Text style={[styles.chartLabel, { color: theme.text || COLORS.black }]}>In Stock (80%)</Text>
        </View>
        
        <View style={styles.chartItem}>
          <View style={styles.chartBar}>
            <View style={[styles.chartFill, { width: '15%', backgroundColor: COLORS.warning }]} />
          </View>
          <Text style={[styles.chartLabel, { color: theme.text || COLORS.black }]}>Low Stock (15%)</Text>
        </View>
        
        <View style={styles.chartItem}>
          <View style={styles.chartBar}>
            <View style={[styles.chartFill, { width: '5%', backgroundColor: COLORS.danger }]} />
          </View>
          <Text style={[styles.chartLabel, { color: theme.text || COLORS.black }]}>Out of Stock (5%)</Text>
        </View>
      </View>
    </View>
  );

  const renderReportContent = () => {
    switch (selectedReport) {
      case 'overview': return renderOverviewReport();
      case 'sales': return renderSalesReport();
      case 'expiry': return renderExpiryReport();
      case 'stock': return renderStockReport();
      default: return renderOverviewReport();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background || COLORS.white }]}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <Text style={[styles.title, { color: theme.text || COLORS.black }]}>Inventory Reports</Text>
        <TouchableOpacity style={styles.exportButton} onPress={handleExportReport}>
          <Ionicons name="download" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.reportTabs}>
        {reportTypes.map((report) => (
          <TouchableOpacity
            key={report.id}
            style={[
              styles.tabButton,
              selectedReport === report.id && styles.activeTab,
              { backgroundColor: selectedReport === report.id ? theme.primary || COLORS.primary : 'transparent' }
            ]}
            onPress={() => setSelectedReport(report.id)}
          >
            <Ionicons 
              name={report.icon} 
              size={20} 
              color={selectedReport === report.id ? COLORS.white : theme.text || COLORS.black} 
            />
            <Text style={[
              styles.tabText,
              { color: selectedReport === report.id ? COLORS.white : theme.text || COLORS.black }
            ]}>
              {report.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderReportContent()}
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
    </View>
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
  exportButton: {
    backgroundColor: COLORS.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reportTabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  activeTab: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  reportContent: {
    flex: 1,
  },
  summaryCards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryCard: {
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
  summaryNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  valueCard: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  valueTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  valueAmount: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  salesList: {
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  salesItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  salesInfo: {
    flex: 1,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  salesCount: {
    fontSize: 12,
  },
  salesRevenue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  expiryList: {
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  expiryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  expiryInfo: {
    flex: 1,
  },
  batchInfo: {
    fontSize: 12,
    marginTop: 4,
  },
  daysLeft: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  daysLeftText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  stockChart: {
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartItem: {
    marginBottom: 20,
  },
  chartBar: {
    height: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 8,
  },
  chartFill: {
    height: '100%',
    borderRadius: 10,
  },
  chartLabel: {
    fontSize: 14,
    fontWeight: '500',
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
