import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

const StartPage = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Header with Sign In and Sign Up buttons */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={[styles.headerButton, styles.signInButton, { borderColor: theme.primary }]}
            onPress={() => navigation.navigate('SignIn')}
          >
            <Text style={[styles.headerButtonText, { color: theme.primary }]}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.headerButton, styles.signUpButton, { backgroundColor: theme.primary }]}
            onPress={() => navigation.navigate('SignUp')}
          >
            <Text style={[styles.headerButtonText, { color: theme.buttonText || '#FFFFFF' }]}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Hero Section */}
      <View style={[styles.heroSection, { backgroundColor: theme.primary + '08' }]}>
        <View style={[styles.heroIconContainer, { backgroundColor: theme.primary + '20' }]}>
          <Text style={styles.heroIcon}>🏥</Text>
        </View>
        <Text style={[styles.heroTitle, { color: theme.primary }]}>
          ArogyaLink
        </Text>
        <Text style={[styles.heroSubtitle, { color: theme.text }]}>
          Bridging Healthcare Gaps, One Connection at a Time
        </Text>
        <Text style={[styles.heroDescription, { color: theme.textSecondary }]}>
          Empowering communities through seamless healthcare connectivity. Where patients, ASHA workers, and PHC doctors unite for better health outcomes.
        </Text>
      </View>

      {/* ASHA Workers Section */}
      <View style={[styles.section, { backgroundColor: theme.surface }]}>
        <View style={styles.sectionHeader}>
          <View style={[styles.iconContainer, { backgroundColor: theme.tertiary + '20' }]}>
            <Text style={styles.iconEmoji}>👩‍⚕️</Text>
          </View>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            ASHA Workers: Your Health Champions
          </Text>
        </View>
        
        <View style={styles.contentCard}>
          <Text style={[styles.contentText, { color: theme.text }]}>
            <Text style={[styles.highlight, { color: theme.tertiary }]}>ASHA Workers</Text> are the heartbeat of community healthcare! 🌟 These dedicated health champions bring expert medical care right to your doorstep. From monitoring vital signs to conducting health checkups, they ensure you receive timely, personalized healthcare without leaving your home.
          </Text>
          
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <Text style={[styles.featureBullet, { color: theme.tertiary }]}>✓</Text>
              <Text style={[styles.featureText, { color: theme.text }]}>
                Home visits for health monitoring and care
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={[styles.featureBullet, { color: theme.tertiary }]}>✓</Text>
              <Text style={[styles.featureText, { color: theme.text }]}>
                Real-time communication with PHC doctors
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={[styles.featureBullet, { color: theme.tertiary }]}>✓</Text>
              <Text style={[styles.featureText, { color: theme.text }]}>
                Digital health records and data management
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={[styles.featureBullet, { color: theme.tertiary }]}>✓</Text>
              <Text style={[styles.featureText, { color: theme.text }]}>
                Emergency response and patient support
              </Text>
            </View>
          </View>
        </View>

        {/* Image placeholder for ASHA Workers */}
        <View style={[styles.imagePlaceholder, { backgroundColor: theme.tertiary + '20', borderWidth: 2, borderColor: theme.tertiary + '40' }]}>
          <View style={styles.imageIconContainer}>
            <Text style={styles.imageIcon}>🏥</Text>
            <Text style={styles.imageIcon}>👩‍⚕️</Text>
            <Text style={styles.imageIcon}>🏡</Text>
          </View>
          <Text style={[styles.imagePlaceholderText, { color: theme.tertiary }]}>ASHA Worker in Action</Text>
          <Text style={[styles.imagePlaceholderSubtext, { color: theme.textSecondary }]}>
            Community health workers providing doorstep care
          </Text>
        </View>
      </View>

      {/* PHC Doctors Section */}
      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <View style={styles.sectionHeader}>
          <View style={[styles.iconContainer, { backgroundColor: theme.primary + '20' }]}>
            <Text style={styles.iconEmoji}>👨‍⚕️</Text>
          </View>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            PHC Doctors: Expert Care, Always Connected
          </Text>
        </View>
        
        <View style={styles.contentCard}>
          <Text style={[styles.contentText, { color: theme.text }]}>
            <Text style={[styles.highlight, { color: theme.primary }]}>PHC Doctors</Text> are your trusted medical experts, always just a message away! 💬 Through ArogyaLink's seamless platform, doctors provide instant consultations, review patient data in real-time, and collaborate directly with ASHA workers to deliver comprehensive, coordinated care that puts your health first.
          </Text>
          
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <Text style={[styles.featureBullet, { color: theme.primary }]}>✓</Text>
              <Text style={[styles.featureText, { color: theme.text }]}>
                Direct consultation with patients via chat
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={[styles.featureBullet, { color: theme.primary }]}>✓</Text>
              <Text style={[styles.featureText, { color: theme.text }]}>
                Real-time collaboration with ASHA workers
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={[styles.featureBullet, { color: theme.primary }]}>✓</Text>
              <Text style={[styles.featureText, { color: theme.text }]}>
                Access to patient health records and history
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={[styles.featureBullet, { color: theme.primary }]}>✓</Text>
              <Text style={[styles.featureText, { color: theme.text }]}>
                Prescription management and follow-up care
              </Text>
            </View>
          </View>
        </View>

        {/* Image placeholder for PHC Doctors */}
        <View style={[styles.imagePlaceholder, { backgroundColor: theme.primary + '20', borderWidth: 2, borderColor: theme.primary + '40' }]}>
          <View style={styles.imageIconContainer}>
            <Text style={styles.imageIcon}>💻</Text>
            <Text style={styles.imageIcon}>👨‍⚕️</Text>
            <Text style={styles.imageIcon}>📱</Text>
          </View>
          <Text style={[styles.imagePlaceholderText, { color: theme.primary }]}>PHC Doctor Consultation</Text>
          <Text style={[styles.imagePlaceholderSubtext, { color: theme.textSecondary }]}>
            Expert medical care at your fingertips
          </Text>
        </View>
      </View>

      {/* Connection Flow Section */}
      <View style={[styles.section, styles.connectionSection, { backgroundColor: theme.secondary + '15' }]}>
        <Text style={[styles.connectionTitle, { color: theme.secondary }]}>
          How It All Connects
        </Text>
        <Text style={[styles.connectionDescription, { color: theme.text }]}>
          ArogyaLink creates a seamless healthcare ecosystem where patients, ASHA workers, and PHC doctors work together for better health outcomes.
        </Text>
        
        <View style={styles.flowDiagram}>
          <View style={[styles.flowItem, { backgroundColor: theme.card }]}>
            <Text style={[styles.flowEmoji]}>👤</Text>
            <Text style={[styles.flowLabel, { color: theme.text }]}>Patient</Text>
          </View>
          <Text style={[styles.flowArrow, { color: theme.primary }]}>→</Text>
          <View style={[styles.flowItem, { backgroundColor: theme.card }]}>
            <Text style={[styles.flowEmoji]}>👩‍⚕️</Text>
            <Text style={[styles.flowLabel, { color: theme.text }]}>ASHA Worker</Text>
          </View>
          <Text style={[styles.flowArrow, { color: theme.primary }]}>→</Text>
          <View style={[styles.flowItem, { backgroundColor: theme.card }]}>
            <Text style={[styles.flowEmoji]}>👨‍⚕️</Text>
            <Text style={[styles.flowLabel, { color: theme.text }]}>PHC Doctor</Text>
          </View>
        </View>
      </View>

      {/* Call to Action */}
      <View style={[styles.ctaSection, { backgroundColor: theme.primary + '10' }]}>
        <Text style={[styles.ctaTitle, { color: theme.primary }]}>
          Ready to Transform Healthcare?
        </Text>
        <Text style={[styles.ctaDescription, { color: theme.textSecondary }]}>
          Join thousands of patients, workers, and doctors already using ArogyaLink
        </Text>
        <View style={styles.ctaButtons}>
          <TouchableOpacity
            style={[styles.ctaButton, styles.ctaPrimary, { backgroundColor: theme.primary }]}
            onPress={() => navigation.navigate('SignUp')}
          >
            <Text style={[styles.ctaButtonText, { color: theme.buttonText || '#FFFFFF' }]}>
              Get Started
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.ctaButton, styles.ctaSecondary, { borderColor: theme.primary }]}
            onPress={() => navigation.navigate('SignIn')}
          >
            <Text style={[styles.ctaButtonText, { color: theme.primary }]}>
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
  },
  signInButton: {
    backgroundColor: 'transparent',
  },
  signUpButton: {
    borderWidth: 0,
  },
  headerButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  heroSection: {
    paddingHorizontal: 20,
    paddingVertical: 50,
    alignItems: 'center',
    borderRadius: 25,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 30,
  },
  heroIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  heroIcon: {
    fontSize: 50,
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  heroDescription: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  iconEmoji: {
    fontSize: 32,
  },
  sectionTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
    lineHeight: 28,
  },
  contentCard: {
    marginBottom: 20,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 15,
  },
  highlight: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  featureList: {
    marginTop: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  featureBullet: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
    fontWeight: 'bold',
  },
  featureText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  imagePlaceholder: {
    height: 200,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  imageIconContainer: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 15,
  },
  imageIcon: {
    fontSize: 40,
  },
  imagePlaceholderText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  imagePlaceholderSubtext: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  connectionSection: {
    padding: 25,
    alignItems: 'center',
  },
  connectionTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  connectionDescription: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 25,
  },
  flowDiagram: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  flowItem: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  flowEmoji: {
    fontSize: 32,
    marginBottom: 5,
  },
  flowLabel: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  flowArrow: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  ctaSection: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 40,
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  ctaDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  ctaButtons: {
    flexDirection: 'row',
    gap: 15,
    width: '100%',
    justifyContent: 'center',
  },
  ctaButton: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 2,
    maxWidth: 150,
  },
  ctaPrimary: {
    borderWidth: 0,
  },
  ctaSecondary: {
    backgroundColor: 'transparent',
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default StartPage;


