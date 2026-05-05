import { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Platform,
  StatusBar,
  Easing,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useNavigation } from '@react-navigation/native';
import { 
  MapPin, 
  Clock, 
  Navigation, 
  Phone, 
  Wrench,
  AlertCircle,
  ChevronRight,
  Loader,
  Shield,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';

const activeRequests = [
  {
    id: 1,
    mechanicName: 'Mike Johnson',
    status: 'On the way',
    eta: '5 min',
    issueType: 'Engine Problem',
    mechanicRating: 4.9,
    mechanicPhoto: null, // Add photo URL
  },
];

const pendingRequests = [
  {
    id: 2,
    mechanicName: 'Searching...',
    status: 'Finding mechanic',
    eta: 'Pending',
    issueType: 'Battery Jump',
  },
];

export default function RequestsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const spinValue = useRef(new Animated.Value(0)).current;

  // Spinning animation for the loading indicator
  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    ).start();

    // Fade in animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: false,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: false,
      }),
    ]).start();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const renderEmptyState = () => (
    <Animated.View
      style={[
        styles.emptyState,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <LinearGradient
        colors={['#f8fafc', '#e2e8f0']}
        style={styles.emptyIconContainer}
      >
        <MapPin size={48} color="#94a3b8" />
      </LinearGradient>
      <Text style={styles.emptyTitle}>No Active Requests</Text>
      <Text style={styles.emptyText}>
        You don't have any ongoing services
      </Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('RequestService', { issueType: 'Engine', isEmergency: false })}
        style={styles.emptyButton}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#6366f1', '#8b5cf6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.emptyButtonGradient}
        >
          <Wrench size={18} color="#ffffff" />
          <Text style={styles.emptyButtonText}>Request Service</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

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
            <Text style={styles.headerTitle}>Active Requests</Text>
            <Text style={styles.headerSubtitle}>
              Track your ongoing services
            </Text>
            
            {/* Summary Cards */}
            <View style={styles.summaryCards}>
              <View style={styles.summaryCard}>
                <BlurView intensity={20} tint="light" style={styles.summaryContent}>
                  <View style={[styles.summaryDot, { backgroundColor: '#10b981' }]} />
                  <Text style={styles.summaryNumber}>1</Text>
                  <Text style={styles.summaryLabel}>Active</Text>
                </BlurView>
              </View>
              
              <View style={styles.summaryCard}>
                <BlurView intensity={20} tint="light" style={styles.summaryContent}>
                  <View style={[styles.summaryDot, { backgroundColor: '#f59e0b' }]} />
                  <Text style={styles.summaryNumber}>1</Text>
                  <Text style={styles.summaryLabel}>Pending</Text>
                </BlurView>
              </View>
              
              <View style={styles.summaryCard}>
                <BlurView intensity={20} tint="light" style={styles.summaryContent}>
                  <View style={[styles.summaryDot, { backgroundColor: '#6366f1' }]} />
                  <Text style={styles.summaryNumber}>12</Text>
                  <Text style={styles.summaryLabel}>Completed</Text>
                </BlurView>
              </View>
            </View>
          </LinearGradient>

          {/* Main Content */}
          <View style={styles.mainContent}>
            {/* Active Requests */}
            {activeRequests.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionTitleContainer}>
                    <View style={styles.greenDot} />
                    <Text style={styles.sectionTitle}>Current Jobs</Text>
                  </View>
                  <TouchableOpacity>
                    <Text style={styles.seeAll}>See All</Text>
                  </TouchableOpacity>
                </View>

                {activeRequests.map((request, index) => (
                  <Animated.View
                    key={request.id}
                    style={[
                      styles.activeCard,
                      {
                        opacity: fadeAnim,
                        transform: [
                          {
                            translateY: fadeAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [30, 0],
                            }),
                          },
                        ],
                      },
                    ]}
                  >
                    <LinearGradient
                      colors={['#ffffff', '#faf5ff']}
                      style={styles.cardGradient}
                    >
                      {/* Status and ETA Row */}
                      <View style={styles.cardHeader}>
                        <View style={styles.statusContainer}>
                          <LinearGradient
                            colors={['#6366f1', '#8b5cf6']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.statusBadge}
                          >
                            <View style={styles.pulseDot} />
                            <Text style={styles.statusText}>{request.status}</Text>
                          </LinearGradient>
                        </View>
                        <View style={styles.etaContainer}>
                          <Clock size={16} color="#6366f1" />
                          <Text style={styles.etaText}>{request.eta}</Text>
                        </View>
                      </View>

                      {/* Mechanic Info */}
                      <View style={styles.mechanicInfo}>
                        <View style={styles.mechanicAvatar}>
                          <LinearGradient
                            colors={['#6366f1', '#8b5cf6']}
                            style={styles.avatarGradient}
                          >
                            <Text style={styles.avatarText}>
                              {request.mechanicName.charAt(0)}
                            </Text>
                          </LinearGradient>
                          <View style={styles.onlineIndicator} />
                        </View>
                        <View style={styles.mechanicDetails}>
                          <Text style={styles.mechanicName}>
                            {request.mechanicName}
                          </Text>
                          <View style={styles.ratingContainer}>
                            <Shield size={14} color="#f59e0b" />
                            <Text style={styles.ratingText}>
                              {request.mechanicRating} • Top Rated
                            </Text>
                          </View>
                          <View style={styles.issueTypeContainer}>
                            <AlertCircle size={14} color="#64748b" />
                            <Text style={styles.issueType}>
                              {request.issueType}
                            </Text>
                          </View>
                        </View>
                      </View>

                      {/* Action Buttons */}
                      <View style={styles.actionButtons}>
                        <TouchableOpacity
                          onPress={() => navigation.navigate('Tracking' as never)}
                          style={styles.trackButton}
                          activeOpacity={0.8}
                        >
                          <LinearGradient
                            colors={['#6366f1', '#8b5cf6']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.trackButtonGradient}
                          >
                            <Navigation size={18} color="#ffffff" />
                            <Text style={styles.trackButtonText}>Track Live</Text>
                            <ChevronRight size={18} color="#ffffff" />
                          </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.callButton}
                          activeOpacity={0.7}
                        >
                          <View style={styles.callIconContainer}>
                            <Phone size={22} color="#6366f1" />
                          </View>
                        </TouchableOpacity>
                      </View>
                    </LinearGradient>
                  </Animated.View>
                ))}
              </View>
            )}

            {/* Pending Requests */}
            {pendingRequests.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionTitleContainer}>
                    <View style={styles.yellowDot} />
                    <Text style={styles.sectionTitle}>Pending</Text>
                  </View>
                </View>

                {pendingRequests.map((request, index) => (
                  <Animated.View
                    key={request.id}
                    style={[
                      styles.pendingCard,
                      {
                        opacity: fadeAnim,
                        transform: [
                          {
                            translateY: fadeAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [30, 0],
                            }),
                          },
                        ],
                      },
                    ]}
                  >
                    <View style={styles.pendingContent}>
                      <View style={styles.pendingHeader}>
                        <View>
                          <View style={styles.pendingStatusBadge}>
                            <Animated.View
                              style={[
                                styles.spinner,
                                { transform: [{ rotate: spin }] },
                              ]}
                            >
                              <Loader size={14} color="#d97706" />
                            </Animated.View>
                            <Text style={styles.pendingStatusText}>
                              {request.status}
                            </Text>
                          </View>
                          <View style={styles.pendingIssueContainer}>
                            <AlertCircle size={14} color="#64748b" />
                            <Text style={styles.pendingIssueText}>
                              {request.issueType}
                            </Text>
                          </View>
                        </View>
                      </View>

                      {/* Animated Search Indicator */}
                      <View style={styles.searchCard}>
                        <LinearGradient
                          colors={['#fef3c7', '#fde68a']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.searchContent}
                        >
                          <View style={styles.searchDots}>
                            {[0, 1, 2].map((dot) => (
                              <Animated.View
                                key={dot}
                                style={[
                                  styles.searchDot,
                                  {
                                    opacity: fadeAnim.interpolate({
                                      inputRange: [0, 0.5, 1],
                                      outputRange: [0.3, 1, 0.3],
                                    }),
                                  },
                                ]}
                              />
                            ))}
                          </View>
                          <Text style={styles.searchText}>
                            Searching for available mechanics...
                          </Text>
                        </LinearGradient>
                      </View>
                    </View>
                  </Animated.View>
                ))}
              </View>
            )}

            {/* Empty State */}
            {activeRequests.length === 0 && pendingRequests.length === 0 && 
              renderEmptyState()
            }
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
    paddingBottom: 90,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 20,
  },
  summaryCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  summaryContent: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  summaryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
  },
  yellowDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#f59e0b',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  seeAll: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '600',
  },
  activeCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  cardGradient: {
    padding: 20,
    borderWidth: 2,
    borderColor: 'rgba(99, 102, 241, 0.2)',
    borderRadius: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ffffff',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
  },
  etaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  etaText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6366f1',
  },
  mechanicInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  mechanicAvatar: {
    width: 52,
    height: 52,
    position: 'relative',
  },
  avatarGradient: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  mechanicDetails: {
    flex: 1,
  },
  mechanicName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 13,
    color: '#f59e0b',
    fontWeight: '600',
  },
  issueTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  issueType: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  trackButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  trackButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  trackButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  callButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  callIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pendingCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#fde68a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  pendingContent: {
    padding: 20,
  },
  pendingHeader: {
    marginBottom: 16,
  },
  pendingStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 6,
    marginBottom: 8,
  },
  spinner: {
    width: 14,
    height: 14,
  },
  pendingStatusText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#d97706',
  },
  pendingIssueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pendingIssueText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  searchCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  searchContent: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  searchDots: {
    flexDirection: 'row',
    gap: 4,
  },
  searchDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#d97706',
  },
  searchText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: '#64748b',
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 22,
  },
  emptyButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  emptyButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 18,
    gap: 10,
  },
  emptyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
});