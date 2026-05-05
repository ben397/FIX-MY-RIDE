import { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Platform,
  StatusBar,
  Dimensions,
  Alert,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  MapPin,
  ChevronLeft,
  Fuel,
  Battery,
  Wrench,
  Gauge,
  AlertCircle,
  Navigation,
  Clock,
  Star,
  Shield,
  Zap,
  MessageCircle,
  Camera,
  Mic,
  FileText,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';

const { width } = Dimensions.get('window');

const issueTypes = [
  {
    id: 'engine',
    label: 'Engine Problem',
    icon: Gauge,
    gradient: ['#ef4444', '#dc2626'],
    description: 'Engine won\'t start, strange noises, or warning lights',
    estimatedTime: '30-60 min',
    severity: 'high',
  },
  {
    id: 'tire',
    label: 'Tire Puncture',
    icon: AlertCircle,
    gradient: ['#f97316', '#ea580c'],
    description: 'Flat tire, slow leak, or damaged wheel',
    estimatedTime: '15-30 min',
    severity: 'medium',
  },
  {
    id: 'battery',
    label: 'Battery Jump-Start',
    icon: Battery,
    gradient: ['#eab308', '#ca8a04'],
    description: 'Dead battery, won\'t start, clicking sound',
    estimatedTime: '10-20 min',
    severity: 'medium',
  },
  {
    id: 'fuel',
    label: 'Fuel Delivery',
    icon: Fuel,
    gradient: ['#3b82f6', '#2563eb'],
    description: 'Out of gas, wrong fuel, or fuel system issues',
    estimatedTime: '20-40 min',
    severity: 'medium',
  },
  {
    id: 'other',
    label: 'Other Issue',
    icon: Wrench,
    gradient: ['#6b7280', '#4b5563'],
    description: 'Describe your specific problem',
    estimatedTime: 'Varies',
    severity: 'low',
  },
];

export default function RequestServiceScreen() {
  const navigation = useNavigation<any>();
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const [location, setLocation] = useState('123 Main Street, Downtown');
  const [description, setDescription] = useState('');
  const [isEmergency, setIsEmergency] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: false,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: false,
      }),
    ]).start();

    // Pulse animation for emergency button
    if (isEmergency) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 800,
            useNativeDriver: false,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: false,
          }),
        ])
      ).start();
    }
  }, [isEmergency]);

  const getCurrentLocation = useCallback(async () => {
    setIsGettingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Please enable location services');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      // In a real app, you'd reverse geocode this to an address
      setLocation('Current Location Obtained');
      
      Animated.sequence([
        Animated.timing(buttonScale, {
          toValue: 1.1,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(buttonScale, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    } catch (error) {
      Alert.alert('Error', 'Could not get location');
    } finally {
      setIsGettingLocation(false);
    }
  }, []);

  const handleFindMechanic = useCallback(() => {
    if (selectedIssue) {
      Animated.sequence([
        Animated.timing(buttonScale, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: false,
        }),
        Animated.timing(buttonScale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: false,
        }),
      ]).start(() => {
        navigation.navigate('Matching', {
          issueType: selectedIssue,
          location,
          description,
          isEmergency,
        });
      });
    }
  }, [selectedIssue, location, description, isEmergency]);

  const selectedIssueData = issueTypes.find(i => i.id === selectedIssue);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1e3a8a" />
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <LinearGradient
            colors={['#1e3a8a', '#3b82f6', '#60a5fa']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            {/* Navigation Bar */}
            <View style={styles.navBar}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
                activeOpacity={0.7}
              >
                <BlurView intensity={20} tint="light" style={styles.backButtonBlur}>
                  <ChevronLeft size={24} color="#ffffff" />
                </BlurView>
              </TouchableOpacity>
              
              <View style={styles.headerInfo}>
                <Text style={styles.headerTitle}>Request Service</Text>
                <Text style={styles.headerSubtitle}>
                  Get help in minutes
                </Text>
              </View>

              {/* Emergency Toggle */}
              <TouchableOpacity
                onPress={() => setIsEmergency(!isEmergency)}
                style={styles.emergencyToggle}
              >
                <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                  <LinearGradient
                    colors={isEmergency ? ['#ef4444', '#dc2626'] : ['#64748b', '#475569']}
                    style={styles.emergencyToggleGradient}
                  >
                    <Zap size={20} color="#ffffff" />
                  </LinearGradient>
                </Animated.View>
                <Text style={[
                  styles.emergencyText,
                  isEmergency && styles.emergencyTextActive,
                ]}>
                  SOS
                </Text>
              </TouchableOpacity>
            </View>

            {/* Emergency Banner */}
            {isEmergency && (
              <Animated.View style={[styles.emergencyBanner, { opacity: fadeAnim }]}>
                <LinearGradient
                  colors={['#ef4444', '#dc2626']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.emergencyBannerContent}
                >
                  <AlertCircle size={20} color="#ffffff" />
                  <View style={styles.emergencyBannerText}>
                    <Text style={styles.emergencyBannerTitle}>
                      Emergency Mode Active
                    </Text>
                    <Text style={styles.emergencyBannerSubtitle}>
                      Priority dispatch enabled
                    </Text>
                  </View>
                </LinearGradient>
              </Animated.View>
            )}
          </LinearGradient>

          {/* Main Content */}
          <View style={styles.mainContent}>
            {/* Issue Selection */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <AlertCircle size={24} color="#1e293b" />
                <View>
                  <Text style={styles.sectionTitle}>What's the issue?</Text>
                  <Text style={styles.sectionSubtitle}>
                    Select the type of problem you're experiencing
                  </Text>
                </View>
              </View>

              <View style={styles.issuesGrid}>
                {issueTypes.map((issue, index) => {
                  const Icon = issue.icon;
                  const isSelected = selectedIssue === issue.id;

                  return (
                    <Animated.View
                      key={issue.id}
                      style={{
                        opacity: fadeAnim,
                        transform: [
                          {
                            translateY: slideAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0, 20 * (index + 1)],
                            }),
                          },
                        ],
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => setSelectedIssue(issue.id)}
                        activeOpacity={0.8}
                        style={[
                          styles.issueCard,
                          isSelected && styles.issueCardSelected,
                        ]}
                      >
                        <LinearGradient
                          colors={isSelected ? ['#eff6ff', '#dbeafe'] : ['#ffffff', '#f8fafc']}
                          style={styles.issueCardContent}
                        >
                          {/* Severity Badge */}
                          {issue.severity === 'high' && (
                            <View style={styles.severityBadge}>
                              <Text style={styles.severityText}>Urgent</Text>
                            </View>
                          )}

                          {/* Icon */}
                          <LinearGradient
                            colors={issue.gradient}
                            style={[
                              styles.issueIcon,
                              isSelected && styles.issueIconSelected,
                            ]}
                          >
                            <Icon size={28} color="#ffffff" strokeWidth={2} />
                          </LinearGradient>

                          {/* Label & Description */}
                          <View style={styles.issueInfo}>
                            <Text style={styles.issueLabel}>{issue.label}</Text>
                            <Text style={styles.issueDescription} numberOfLines={2}>
                              {issue.description}
                            </Text>
                            {isSelected && (
                              <View style={styles.estimateContainer}>
                                <Clock size={14} color="#6366f1" />
                                <Text style={styles.estimateText}>
                                  Est. {issue.estimatedTime}
                                </Text>
                              </View>
                            )}
                          </View>

                          {/* Radio Button */}
                          <View style={[
                            styles.radioButton,
                            isSelected && styles.radioButtonSelected,
                          ]}>
                            {isSelected && <View style={styles.radioDot} />}
                          </View>
                        </LinearGradient>
                      </TouchableOpacity>
                    </Animated.View>
                  );
                })}
              </View>
            </View>

            {/* Additional Details */}
            {selectedIssue && (
              <Animated.View style={[styles.additionalSection, { opacity: fadeAnim }]}>
                {/* Description Input */}
                <View style={styles.descriptionCard}>
                  <Text style={styles.descriptionTitle}>
                    Additional Details (Optional)
                  </Text>
                  <View style={styles.descriptionInputContainer}>
                    <FileText size={20} color="#94a3b8" style={styles.descriptionIcon} />
                    <TextInput
                      style={styles.descriptionInput}
                      placeholder="Describe your issue in detail..."
                      placeholderTextColor="#94a3b8"
                      multiline
                      numberOfLines={4}
                      value={description}
                      onChangeText={setDescription}
                      textAlignVertical="top"
                    />
                  </View>
                  
                  {/* Quick Actions */}
                  <View style={styles.quickActions}>
                    <TouchableOpacity style={styles.quickActionButton}>
                      <Camera size={18} color="#6366f1" />
                      <Text style={styles.quickActionText}>Photo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.quickActionButton}>
                      <Mic size={18} color="#6366f1" />
                      <Text style={styles.quickActionText}>Voice</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Location Card */}
                <Animated.View
                  style={[
                    styles.locationCard,
                    { transform: [{ scale: buttonScale }] },
                  ]}
                >
                  <View style={styles.locationHeader}>
                    <MapPin size={20} color="#6366f1" />
                    <Text style={styles.locationTitle}>Your Location</Text>
                  </View>
                  
                  <View style={styles.locationContent}>
                    <View style={styles.locationInfo}>
                      <Text style={styles.locationAddress} numberOfLines={1}>
                        {location}
                      </Text>
                      <TouchableOpacity
                        onPress={getCurrentLocation}
                        style={styles.locationButton}
                        disabled={isGettingLocation}
                      >
                        <Navigation size={14} color="#6366f1" />
                        <Text style={styles.locationButtonText}>
                          {isGettingLocation ? 'Getting...' : 'Use Current'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    
                    <TouchableOpacity
                      onPress={() => navigation.navigate('ChangeLocation')}
                      style={styles.changeLocationButton}
                    >
                      <Text style={styles.changeLocationText}>Change</Text>
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              </Animated.View>
            )}

            {/* Find Mechanic Button */}
            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <TouchableOpacity
                onPress={handleFindMechanic}
                disabled={!selectedIssue}
                activeOpacity={0.9}
                style={styles.findButtonContainer}
              >
                <LinearGradient
                  colors={
                    selectedIssue
                      ? isEmergency
                        ? ['#ef4444', '#dc2626']
                        : ['#6366f1', '#8b5cf6']
                      : ['#cbd5e1', '#94a3b8']
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.findButton}
                >
                  <View style={styles.findButtonContent}>
                    <Shield size={24} color="#ffffff" />
                    <Text style={styles.findButtonText}>
                      {isEmergency ? 'Emergency Dispatch' : 'Find Nearest Mechanic'}
                    </Text>
                    <Navigation size={20} color="#ffffff" />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            {/* Match Info */}
            {selectedIssue && (
              <Animated.View style={[styles.matchInfo, { opacity: fadeAnim }]}>
                <View style={styles.matchInfoRow}>
                  <Star size={16} color="#f59e0b" />
                  <Text style={styles.matchInfoText}>
                    We'll match you with the closest available mechanic
                  </Text>
                </View>
                <View style={styles.matchInfoRow}>
                  <Clock size={16} color="#6366f1" />
                  <Text style={styles.matchInfoText}>
                    Average response time: 12 minutes
                  </Text>
                </View>
              </Animated.View>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1e3a8a',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  backButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  backButtonBlur: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  emergencyToggle: {
    alignItems: 'center',
    gap: 4,
  },
  emergencyToggleGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 1,
  },
  emergencyTextActive: {
    color: '#ef4444',
  },
  emergencyBanner: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  emergencyBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 10,
  },
  emergencyBannerText: {
    flex: 1,
  },
  emergencyBannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 2,
  },
  emergencyBannerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  mainContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#64748b',
  },
  issuesGrid: {
    gap: 12,
  },
  issueCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  issueCardSelected: {
    borderColor: '#6366f1',
    shadowColor: '#6366f1',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  issueCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    position: 'relative',
  },
  severityBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#fef2f2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  severityText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ef4444',
  },
  issueIcon: {
    width: 60,
    height: 60,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  issueIconSelected: {
    transform: [{ scale: 1.1 }],
  },
  issueInfo: {
    flex: 1,
    marginRight: 12,
  },
  issueLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  issueDescription: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 16,
    marginBottom: 6,
  },
  estimateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: 4,
  },
  estimateText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6366f1',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: '#6366f1',
    backgroundColor: '#6366f1',
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff',
  },
  additionalSection: {
    marginBottom: 24,
  },
  descriptionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  descriptionInputContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 12,
  },
  descriptionIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  descriptionInput: {
    flex: 1,
    fontSize: 14,
    color: '#1e293b',
    minHeight: 80,
    padding: 0,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 8,
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  quickActionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6366f1',
  },
  locationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  locationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationInfo: {
    flex: 1,
    marginRight: 12,
  },
  locationAddress: {
    fontSize: 15,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    alignSelf: 'flex-start',
    gap: 4,
  },
  locationButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6366f1',
  },
  changeLocationButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
  },
  changeLocationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  findButtonContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  findButton: {
    paddingVertical: 20,
    borderRadius: 20,
  },
  findButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  findButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.3,
  },
  matchInfo: {
    backgroundColor: '#f0fdf4',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  matchInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  matchInfoText: {
    fontSize: 13,
    color: '#166534',
    fontWeight: '500',
    flex: 1,
  },
});