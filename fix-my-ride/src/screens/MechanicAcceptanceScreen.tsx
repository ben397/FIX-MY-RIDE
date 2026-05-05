import { useRef, useEffect, useState, useCallback } from 'react';
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
  Linking,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  Star,
  MapPin,
  Award,
  Wrench,
  Phone,
  MessageCircle,
  ChevronLeft,
  Shield,
  Clock,
  CheckCircle,
  Users,
  ThumbsUp,
  AlertTriangle,
  Heart,
  Share2,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const mechanicData = {
  id: 1,
  name: 'Mike Johnson',
  initials: 'MJ',
  rating: 4.9,
  totalReviews: 127,
  distance: '0.8 miles',
  eta: '5 minutes',
  experience: '8 years',
  specialty: 'Engine Expert',
  totalJobs: 234,
  satisfactionRate: '98%',
  certifications: [
    'Engine Repair',
    'Diagnostics',
    'ASE Certified',
    'Electrical',
    'Hybrid Systems',
  ],
  recentReviews: [
    { id: 1, text: 'Excellent service! Very professional.', rating: 5 },
    { id: 2, text: 'Fixed my engine quickly. Highly recommended!', rating: 5 },
  ],
};

export default function MechanicAcceptanceScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { mechanicId, isEmergency } = route.params || {};

  const [isFavorite, setIsFavorite] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const confirmScale = useRef(new Animated.Value(1)).current;
  const heartScale = useRef(new Animated.Value(1)).current;

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
  }, []);

  const handleConfirm = useCallback(() => {
    setIsConfirming(true);
    
    // Confirmation animation
    Animated.sequence([
      Animated.timing(confirmScale, {
        toValue: 0.95,
        duration: 150,
        useNativeDriver: false,
      }),
      Animated.timing(confirmScale, {
        toValue: 1.02,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(confirmScale, {
        toValue: 1,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start(() => {
      navigation.navigate('Tracking', {
        mechanicId,
        isEmergency,
      });
      setIsConfirming(false);
    });
  }, [navigation, mechanicId, isEmergency]);

  const handleToggleFavorite = useCallback(() => {
    Animated.sequence([
      Animated.spring(heartScale, {
        toValue: 1.3,
        useNativeDriver: false,
      }),
      Animated.spring(heartScale, {
        toValue: 1,
        useNativeDriver: false,
      }),
    ]).start();
    
    setIsFavorite(!isFavorite);
  }, [isFavorite]);

  const handleCall = useCallback(() => {
    Alert.alert(
      'Call Mechanic',
      'Do you want to call Mike Johnson?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => Linking.openURL('tel:+1234567890'),
        },
      ]
    );
  }, []);

  const handleMessage = useCallback(() => {
    navigation.navigate('Chat', { mechanicId });
  }, [navigation, mechanicId]);

  const handleCancelRequest = useCallback(() => {
    Alert.alert(
      'Cancel Request',
      'Are you sure you want to cancel this request?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  }, [navigation]);

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
                <Text style={styles.headerTitle}>Mechanic Found!</Text>
                <Text style={styles.headerSubtitle}>
                  Review details before confirming
                </Text>
              </View>

              <TouchableOpacity
                onPress={handleToggleFavorite}
                style={styles.favoriteButton}
              >
                <Animated.View style={{ transform: [{ scale: heartScale }] }}>
                  <Heart
                    size={22}
                    color={isFavorite ? '#ef4444' : '#ffffff'}
                    fill={isFavorite ? '#ef4444' : 'transparent'}
                  />
                </Animated.View>
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {/* Main Content */}
          <View style={styles.mainContent}>
            {/* Mechanic Profile Card */}
            <Animated.View
              style={[
                styles.profileCard,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <LinearGradient
                colors={['#ffffff', '#faf5ff']}
                style={styles.profileCardGradient}
              >
                {/* Top Section */}
                <View style={styles.profileTop}>
                  <View style={styles.avatarContainer}>
                    <LinearGradient
                      colors={['#6366f1', '#8b5cf6']}
                      style={styles.avatar}
                    >
                      <Text style={styles.avatarText}>
                        {mechanicData.initials}
                      </Text>
                    </LinearGradient>
                    <View style={styles.onlineIndicator} />
                    {mechanicData.rating >= 4.9 && (
                      <View style={styles.topRatedBadge}>
                        <Award size={10} color="#f59e0b" />
                      </View>
                    )}
                  </View>

                  <View style={styles.profileInfo}>
                    <View style={styles.nameRow}>
                      <Text style={styles.mechanicName}>{mechanicData.name}</Text>
                      {isEmergency && (
                        <View style={styles.priorityBadge}>
                          <Text style={styles.priorityText}>Priority</Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.ratingRow}>
                      <Star size={16} color="#f59e0b" fill="#f59e0b" />
                      <Text style={styles.ratingText}>{mechanicData.rating}</Text>
                      <Text style={styles.reviewCount}>
                        ({mechanicData.totalReviews} reviews)
                      </Text>
                    </View>

                    <View style={styles.distanceRow}>
                      <MapPin size={14} color="#6366f1" />
                      <Text style={styles.distanceText}>
                        {mechanicData.distance} away
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                  <View style={styles.statItem}>
                    <View style={[styles.statIcon, { backgroundColor: '#fef3c7' }]}>
                      <Award size={18} color="#f59e0b" />
                    </View>
                    <Text style={styles.statValue}>{mechanicData.experience}</Text>
                    <Text style={styles.statLabel}>Experience</Text>
                  </View>

                  <View style={[styles.statDivider]} />

                  <View style={styles.statItem}>
                    <View style={[styles.statIcon, { backgroundColor: '#eff6ff' }]}>
                      <Wrench size={18} color="#6366f1" />
                    </View>
                    <Text style={styles.statValue}>{mechanicData.specialty}</Text>
                    <Text style={styles.statLabel}>Specialty</Text>
                  </View>

                  <View style={[styles.statDivider]} />

                  <View style={styles.statItem}>
                    <View style={[styles.statIcon, { backgroundColor: '#ecfdf5' }]}>
                      <Users size={18} color="#10b981" />
                    </View>
                    <Text style={styles.statValue}>{mechanicData.totalJobs}</Text>
                    <Text style={styles.statLabel}>Jobs Done</Text>
                  </View>
                </View>

                {/* ETA Card */}
                <View style={styles.etaCard}>
                  <LinearGradient
                    colors={['#10b981', '#059669']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.etaContent}
                  >
                    <View style={styles.etaIcon}>
                      <Clock size={24} color="#ffffff" />
                    </View>
                    <View style={styles.etaInfo}>
                      <Text style={styles.etaLabel}>Estimated Arrival</Text>
                      <Text style={styles.etaValue}>{mechanicData.eta}</Text>
                    </View>
                    <View style={styles.etaCheckmark}>
                      <CheckCircle size={28} color="#ffffff" />
                    </View>
                  </LinearGradient>
                </View>
              </LinearGradient>
            </Animated.View>

            {/* Certifications */}
            <Animated.View
              style={[
                styles.certificationsCard,
                {
                  opacity: fadeAnim,
                  transform: [
                    {
                      translateY: slideAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 30],
                      }),
                    },
                  ],
                },
              ]}
            >
              <View style={styles.certificationsHeader}>
                <Shield size={20} color="#6366f1" />
                <Text style={styles.certificationsTitle}>
                  Skills & Certifications
                </Text>
              </View>
              <View style={styles.certificationsList}>
                {mechanicData.certifications.map((cert, index) => (
                  <View key={index} style={styles.certBadge}>
                    <LinearGradient
                      colors={['#eff6ff', '#dbeafe']}
                      style={styles.certGradient}
                    >
                      <CheckCircle size={12} color="#6366f1" />
                      <Text style={styles.certText}>{cert}</Text>
                    </LinearGradient>
                  </View>
                ))}
              </View>
            </Animated.View>

            {/* Recent Reviews */}
            <Animated.View
              style={[
                styles.reviewsCard,
                {
                  opacity: fadeAnim,
                  transform: [
                    {
                      translateY: slideAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 45],
                      }),
                    },
                  ],
                },
              ]}
            >
              <View style={styles.reviewsHeader}>
                <ThumbsUp size={20} color="#f59e0b" />
                <Text style={styles.reviewsTitle}>Recent Reviews</Text>
              </View>
              {mechanicData.recentReviews.map((review) => (
                <View key={review.id} style={styles.reviewItem}>
                  <View style={styles.reviewStars}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        color={i < review.rating ? '#f59e0b' : '#e2e8f0'}
                        fill={i < review.rating ? '#f59e0b' : 'none'}
                      />
                    ))}
                  </View>
                  <Text style={styles.reviewText}>{review.text}</Text>
                </View>
              ))}
            </Animated.View>

            {/* Action Buttons */}
            <View style={styles.actionsContainer}>
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  onPress={handleCall}
                  style={styles.callMessageButton}
                  activeOpacity={0.8}
                >
                  <View style={styles.callMessageContent}>
                    <Phone size={20} color="#6366f1" />
                    <Text style={styles.callMessageText}>Call</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleMessage}
                  style={styles.callMessageButton}
                  activeOpacity={0.8}
                >
                  <View style={styles.callMessageContent}>
                    <MessageCircle size={20} color="#6366f1" />
                    <Text style={styles.callMessageText}>Message</Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Confirm Button */}
              <Animated.View style={{ transform: [{ scale: confirmScale }] }}>
                <TouchableOpacity
                  onPress={handleConfirm}
                  activeOpacity={0.9}
                  style={styles.confirmButtonContainer}
                  disabled={isConfirming}
                >
                  <LinearGradient
                    colors={
                      isEmergency
                        ? ['#ef4444', '#dc2626']
                        : ['#6366f1', '#8b5cf6']
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.confirmButton}
                  >
                    <Shield size={22} color="#ffffff" />
                    <Text style={styles.confirmButtonText}>
                      {isConfirming ? 'Confirming...' : 'Confirm Arrival'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>

              {/* Cancel Option */}
              <TouchableOpacity
                onPress={handleCancelRequest}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelButtonText}>
                  Cancel Request
                </Text>
              </TouchableOpacity>

              <Text style={styles.disclaimerText}>
                You can cancel anytime before the mechanic arrives. No charges will be applied.
              </Text>
            </View>
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
    paddingBottom: 30,
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
  favoriteButton: {
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
  profileCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  profileCardGradient: {
    padding: 20,
    borderWidth: 2,
    borderColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 24,
  },
  profileTop: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 16,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarText: {
    fontSize: 30,
    fontWeight: '700',
    color: '#ffffff',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10b981',
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  topRatedBadge: {
    position: 'absolute',
    top: -4,
    left: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fef3c7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  mechanicName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
  priorityBadge: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffff',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 4,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  reviewCount: {
    fontSize: 14,
    color: '#64748b',
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distanceText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 2,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 4,
  },
  etaCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  etaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
  },
  etaIcon: {
    marginRight: 14,
  },
  etaInfo: {
    flex: 1,
  },
  etaLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 2,
  },
  etaValue: {
    fontSize: 26,
    fontWeight: '700',
    color: '#ffffff',
  },
  etaCheckmark: {
    marginLeft: 10,
  },
  certificationsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  certificationsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 8,
  },
  certificationsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  certificationsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  certBadge: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  certGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  certText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6366f1',
  },
  reviewsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  reviewsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 8,
  },
  reviewsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  reviewItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  reviewStars: {
    flexDirection: 'row',
    marginBottom: 4,
    gap: 2,
  },
  reviewText: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
  },
  actionsContainer: {
    alignItems: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
    width: '100%',
  },
  callMessageButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#6366f1',
  },
  callMessageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  callMessageText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#6366f1',
  },
  confirmButtonContainer: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 10,
  },
  confirmButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.3,
  },
  cancelButton: {
    marginBottom: 16,
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ef4444',
  },
  disclaimerText: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 18,
  },
});