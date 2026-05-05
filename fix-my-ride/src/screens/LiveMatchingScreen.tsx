import { useEffect, useState, useRef, useCallback } from 'react';
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
  Easing,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  MapPin,
  Clock,
  Star,
  ChevronLeft,
  Navigation,
  Shield,
  Award,
  Wrench,
  Zap,
  Users,
  RefreshCw,
  Phone,
  MessageCircle,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const mockMechanics = [
  {
    id: 1,
    name: 'Mike Johnson',
    rating: 4.9,
    distance: '0.8 mi',
    eta: '5 min',
    specialty: 'Engine Expert',
    initials: 'MJ',
    totalJobs: 234,
    isAvailable: true,
    certifications: ['ASE Certified', '20+ Years Exp'],
  },
  {
    id: 2,
    name: 'Sarah Williams',
    rating: 4.8,
    distance: '1.2 mi',
    eta: '7 min',
    specialty: 'All-Round',
    initials: 'SW',
    totalJobs: 189,
    isAvailable: true,
    certifications: ['ASE Certified', 'Hybrid Expert'],
  },
  {
    id: 3,
    name: 'David Chen',
    rating: 4.7,
    distance: '1.5 mi',
    eta: '9 min',
    specialty: 'Electrical',
    initials: 'DC',
    totalJobs: 156,
    isAvailable: true,
    certifications: ['Electrical Specialist'],
  },
];

export default function LiveMatchingScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { issueType, isEmergency } = route.params || {};

  const [mechanics, setMechanics] = useState<typeof mockMechanics>([]);
  const [loading, setLoading] = useState(true);
  const [searchProgress, setSearchProgress] = useState(0);
  const [selectedMechanic, setSelectedMechanic] = useState<number | null>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;
  const radarAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animation
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

    // Radar animation
    Animated.loop(
      Animated.timing(radarAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    ).start();

    // Pulsing animation for search indicator
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    ).start();

    // Spinning animation for loading
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    ).start();

    // Simulate search progress
    const progressInterval = setInterval(() => {
      setSearchProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    // Simulate finding mechanics
    const timer = setTimeout(() => {
      setMechanics(mockMechanics);
      setLoading(false);
      clearInterval(progressInterval);
      setSearchProgress(100);
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, []);

  const rotate = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const radarScale = radarAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const radarOpacity = radarAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.5, 0],
  });

  const handleSelectMechanic = useCallback((mechanicId: number) => {
    setSelectedMechanic(mechanicId);
    
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.1,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start(() => {
      navigation.navigate('MechanicAcceptance', {
        mechanicId,
        isEmergency,
      });
    });
  }, [navigation, isEmergency]);

  const refreshMechanics = useCallback(() => {
    setLoading(true);
    setMechanics([]);
    setSearchProgress(0);
    
    setTimeout(() => {
      setMechanics(mockMechanics);
      setLoading(false);
      setSearchProgress(100);
    }, 2000);
  }, []);

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
            colors={isEmergency ? ['#991b1b', '#dc2626'] : ['#1e3a8a', '#3b82f6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
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
                <Text style={styles.headerTitle}>Finding Mechanics</Text>
                <Text style={styles.headerSubtitle}>
                  {loading ? 'Searching for available help...' : `${mechanics.length} mechanics found`}
                </Text>
              </View>

              <TouchableOpacity
                onPress={refreshMechanics}
                style={styles.refreshButton}
              >
                <RefreshCw size={20} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {/* Main Content */}
          <View style={styles.mainContent}>
            {/* Map/Radar Area */}
            <Animated.View style={[styles.radarContainer, { opacity: fadeAnim }]}>
              <LinearGradient
                colors={['#f0f9ff', '#e0f2fe']}
                style={styles.radarBackground}
              >
                {/* Radar Circles */}
                <View style={styles.radarCenter}>
                  <MapPin size={32} color="#6366f1" />
                </View>
                
                {[1, 2, 3].map((ring) => (
                  <Animated.View
                    key={ring}
                    style={[
                      styles.radarRing,
                      {
                        width: Animated.multiply(80 * ring, radarScale),
                        height: Animated.multiply(80 * ring, radarScale),
                        borderRadius: Animated.multiply(40 * ring, radarScale),
                        opacity: radarOpacity,
                      },
                    ]}
                  />
                ))}

                {/* Scanning Line */}
                <Animated.View
                  style={[
                    styles.radarLine,
                    { transform: [{ rotate }] },
                  ]}
                />

                {/* Search Progress */}
                {loading && (
                  <View style={styles.searchInfo}>
                    <Text style={styles.searchProgress}>{searchProgress}%</Text>
                    <Text style={styles.searchText}>Scanning area</Text>
                  </View>
                )}
              </LinearGradient>
            </Animated.View>

            {/* Loading State */}
            {loading ? (
              <Animated.View style={[styles.loadingContainer, { opacity: fadeAnim }]}>
                <View style={styles.loadingContent}>
                  <View style={styles.loadingSpinner}>
                    <Animated.View
                      style={[
                        styles.spinnerInner,
                        { transform: [{ rotate }] },
                      ]}
                    />
                  </View>
                  <Text style={styles.loadingTitle}>Finding nearest mechanics...</Text>
                  <Text style={styles.loadingSubtitle}>This will only take a moment</Text>
                  
                  {/* Progress Bar */}
                  <View style={styles.progressBar}>
                    <Animated.View
                      style={[
                        styles.progressFill,
                        { width: `${searchProgress}%` },
                      ]}
                    >
                      <LinearGradient
                        colors={isEmergency ? ['#ef4444', '#dc2626'] : ['#6366f1', '#8b5cf6']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.progressGradient}
                      />
                    </Animated.View>
                  </View>

                  {/* Searching Pulse */}
                  <Animated.View
                    style={[
                      styles.searchingPulse,
                      { transform: [{ scale: pulseAnim }] },
                    ]}
                  >
                    <View style={styles.pulseDot} />
                  </Animated.View>
                </View>
              </Animated.View>
            ) : (
              /* Mechanics List */
              <Animated.View style={[styles.mechanicsSection, { opacity: fadeAnim }]}>
                <View style={styles.mechanicsHeader}>
                  <View style={styles.foundInfo}>
                    <Users size={20} color="#6366f1" />
                    <Text style={styles.foundText}>
                      {mechanics.length} Available Mechanics
                    </Text>
                  </View>
                  {isEmergency && (
                    <View style={styles.emergencyBadge}>
                      <Zap size={14} color="#ffffff" />
                      <Text style={styles.emergencyBadgeText}>Priority</Text>
                    </View>
                  )}
                </View>

                <View style={styles.mechanicsList}>
                  {mechanics.map((mechanic, index) => (
                    <Animated.View
                      key={mechanic.id}
                      style={[
                        styles.mechanicCard,
                        {
                          transform: [
                            {
                              translateY: fadeAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [30 * (index + 1), 0],
                              }),
                            },
                          ],
                        },
                      ]}
                    >
                      <TouchableOpacity
                        onPress={() => handleSelectMechanic(mechanic.id)}
                        activeOpacity={0.8}
                        style={[
                          styles.mechanicTouchable,
                          selectedMechanic === mechanic.id && styles.mechanicSelected,
                        ]}
                      >
                        {/* Top Section */}
                        <View style={styles.mechanicTop}>
                          {/* Avatar */}
                          <View style={styles.avatarContainer}>
                            <LinearGradient
                              colors={['#6366f1', '#8b5cf6']}
                              style={styles.avatar}
                            >
                              <Text style={styles.avatarText}>
                                {mechanic.initials}
                              </Text>
                            </LinearGradient>
                            {mechanic.isAvailable && (
                              <View style={styles.onlineDot} />
                            )}
                          </View>

                          {/* Info */}
                          <View style={styles.mechanicInfo}>
                            <View style={styles.nameRow}>
                              <Text style={styles.mechanicName}>{mechanic.name}</Text>
                              {mechanic.rating >= 4.9 && (
                                <View style={styles.topRatedBadge}>
                                  <Award size={12} color="#f59e0b" />
                                  <Text style={styles.topRatedText}>Top Rated</Text>
                                </View>
                              )}
                            </View>
                            
                            <View style={styles.specialtyRow}>
                              <Wrench size={14} color="#64748b" />
                              <Text style={styles.specialtyText}>
                                {mechanic.specialty}
                              </Text>
                            </View>

                            {/* Certifications */}
                            <View style={styles.certifications}>
                              {mechanic.certifications.map((cert, idx) => (
                                <View key={idx} style={styles.certBadge}>
                                  <Shield size={10} color="#6366f1" />
                                  <Text style={styles.certText}>{cert}</Text>
                                </View>
                              ))}
                            </View>
                          </View>

                          {/* Rating */}
                          <View style={styles.ratingBadge}>
                            <Star size={16} color="#f59e0b" fill="#f59e0b" />
                            <Text style={styles.ratingText}>{mechanic.rating}</Text>
                          </View>
                        </View>

                        {/* Bottom Section */}
                        <View style={styles.mechanicBottom}>
                          {/* Distance & ETA */}
                          <View style={styles.metricsRow}>
                            <View style={styles.metric}>
                              <MapPin size={16} color="#6366f1" />
                              <Text style={styles.metricText}>{mechanic.distance}</Text>
                            </View>
                            <View style={styles.metricDivider} />
                            <View style={styles.metric}>
                              <Clock size={16} color="#f59e0b" />
                              <Text style={styles.metricText}>ETA {mechanic.eta}</Text>
                            </View>
                            <View style={styles.metricDivider} />
                            <View style={styles.metric}>
                              <Award size={16} color="#10b981" />
                              <Text style={styles.metricText}>{mechanic.totalJobs} jobs</Text>
                            </View>
                          </View>

                          {/* Quick Actions */}
                          <View style={styles.quickActions}>
                            <TouchableOpacity style={styles.quickActionButton}>
                              <Phone size={18} color="#6366f1" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.quickActionButton}>
                              <MessageCircle size={18} color="#6366f1" />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </Animated.View>
                  ))}
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
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  refreshButton: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  radarContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 24,
    height: 250,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  radarBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  radarCenter: {
    width: 60,
    height: 60,
    backgroundColor: '#ffffff',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 2,
  },
  radarRing: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: '#6366f1',
    opacity: 0.3,
  },
  radarLine: {
    position: 'absolute',
    width: 2,
    height: '50%',
    backgroundColor: '#6366f1',
    opacity: 0.5,
  },
  searchInfo: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchProgress: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6366f1',
    textAlign: 'center',
  },
  searchText: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  loadingContainer: {
    paddingVertical: 40,
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingSpinner: {
    width: 80,
    height: 80,
    marginBottom: 24,
  },
  spinnerInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#e2e8f0',
    borderTopColor: '#6366f1',
  },
  loadingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  loadingSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 24,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 24,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressGradient: {
    flex: 1,
  },
  searchingPulse: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#6366f1',
  },
  mechanicsSection: {
    marginBottom: 24,
  },
  mechanicsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  foundInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  foundText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  emergencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ef4444',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  emergencyBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  mechanicsList: {
    gap: 12,
  },
  mechanicCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  mechanicTouchable: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 20,
    overflow: 'hidden',
  },
  mechanicSelected: {
    borderColor: '#6366f1',
    backgroundColor: '#f8faff',
  },
  mechanicTop: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10b981',
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  mechanicInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  mechanicName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1e293b',
  },
  topRatedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  topRatedText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#d97706',
  },
  specialtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  specialtyText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  certifications: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  certBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 2,
  },
  certText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#6366f1',
  },
  ratingBadge: {
    alignItems: 'center',
    backgroundColor: '#fffbeb',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f59e0b',
    marginTop: 2,
  },
  mechanicBottom: {
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  metric: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  metricDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#e2e8f0',
  },
  metricText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  quickActionButton: {
    width: 44,
    height: 44,
    backgroundColor: '#f1f5f9',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});