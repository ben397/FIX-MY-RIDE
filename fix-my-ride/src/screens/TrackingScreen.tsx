import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  MapPin, 
  Phone, 
  MessageCircle, 
  Navigation, 
  Clock,
  Shield,
  Star,
  ChevronLeft,
  AlertTriangle,
  Wrench,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function LiveTrackingScreen() {
  const [eta, setEta] = useState(5);
  const [distance, setDistance] = useState('0.8');
  const router = useRouter();
  
  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(100)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initial animations
    Animated.parallel([
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: false,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: false,
      }),
    ]).start();

    // Pulsing animation for navigation marker
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.in(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    );
    pulse.start();

    // Rotation animation for progress ring
    const rotate = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    );
    rotate.start();

    // ETA countdown
    const interval = setInterval(() => {
      setEta((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimeout(() => router.push('/completion'), 2000);
          return 0;
        }
        return prev - 1;
      });
    }, 3000);

    // Distance simulation
    setDistance((prev) => {
      const newDist = parseFloat(prev) - 0.1;
      return newDist > 0 ? newDist.toFixed(1) : '0.0';
    });

    // Progress animation
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: eta * 3000,
      useNativeDriver: false,
    }).start();

    return () => {
      clearInterval(interval);
      pulse.stop();
      rotate.stop();
    };
  }, [eta]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1e3a8a" />
      <View style={styles.container}>
        {/* Map Area */}
        <View style={styles.mapContainer}>
          <LinearGradient
            colors={['#e0e7ff', '#f0f4ff', '#e8f0fe']}
            style={styles.mapGradient}
          >
            {/* Map Grid Pattern */}
            <View style={styles.mapGrid}>
              {[...Array(8)].map((_, i) => (
                <View key={`h-${i}`} style={styles.gridLine} />
              ))}
            </View>

            {/* Route Path */}
            <View style={styles.routePath}>
              <View style={styles.routeLine} />
              <View style={styles.routeDotStart} />
              <View style={styles.routeDotEnd} />
            </View>

            {/* Animated Navigation Marker */}
            <Animated.View
              style={[
                styles.navigationMarker,
                {
                  transform: [
                    { scale: pulseAnim },
                  ],
                },
              ]}
            >
              <View style={styles.markerInner}>
                <LinearGradient
                  colors={['#6366f1', '#8b5cf6']}
                  style={styles.markerGradient}
                >
                  <Navigation size={32} color="#ffffff" />
                </LinearGradient>
              </View>
              <Animated.View style={[styles.markerPulse, { opacity: fadeAnim }]} />
              <Animated.View style={[styles.markerPulse2, { opacity: fadeAnim }]} />
            </Animated.View>

            {/* Map Controls */}
            <View style={styles.mapControls}>
              <TouchableOpacity style={styles.mapControlButton}>
                <Text style={styles.mapControlText}>+</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.mapControlButton}>
                <Text style={styles.mapControlText}>−</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.mapControlButton}>
                <Navigation size={20} color="#6366f1" />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {/* Back Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            activeOpacity={0.8}
          >
            <BlurView intensity={80} tint="light" style={styles.backButtonBlur}>
              <ChevronLeft size={24} color="#1e293b" />
            </BlurView>
          </TouchableOpacity>

          {/* Mechanic Info Card */}
          <Animated.View
            style={[
              styles.mechanicCard,
              {
                transform: [{ translateY: slideUpAnim }],
                opacity: fadeAnim,
              },
            ]}
          >
            <View style={styles.mechanicContent}>
              {/* Mechanic Avatar */}
              <View style={styles.mechanicAvatar}>
                <LinearGradient
                  colors={['#6366f1', '#8b5cf6']}
                  style={styles.avatarGradient}
                >
                  <Text style={styles.avatarText}>MJ</Text>
                </LinearGradient>
                <View style={styles.onlineDot} />
              </View>

              {/* Mechanic Info */}
              <View style={styles.mechanicInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.mechanicName}>Mike Johnson</Text>
                  <View style={styles.verifiedBadge}>
                    <Shield size={12} color="#10b981" />
                    <Text style={styles.verifiedText}>Verified</Text>
                  </View>
                </View>
                <View style={styles.statusRow}>
                  <View style={styles.statusIndicator}>
                    <View style={styles.statusDot} />
                    <Text style={styles.statusText}>On the way</Text>
                  </View>
                  <View style={styles.ratingContainer}>
                    <Star size={12} color="#f59e0b" />
                    <Text style={styles.ratingText}>4.9</Text>
                  </View>
                </View>
              </View>

              {/* ETA Counter */}
              <View style={styles.etaContainer}>
                <Animated.View style={[styles.etaRing, { transform: [{ rotate: spin }] }]}>
                  <View style={styles.etaRingInner} />
                </Animated.View>
                <View style={styles.etaTextContainer}>
                  <Text style={styles.etaNumber}>{eta}</Text>
                  <Text style={styles.etaUnit}>min</Text>
                </View>
              </View>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <Animated.View style={[styles.progressBar, { width: progressWidth }]}>
                <LinearGradient
                  colors={['#6366f1', '#8b5cf6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.progressGradient}
                />
              </Animated.View>
            </View>
          </Animated.View>

          {/* Arrival Banner */}
          {eta === 0 && (
            <Animated.View style={styles.arrivalBanner}>
              <LinearGradient
                colors={['#10b981', '#059669']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.arrivalContent}
              >
                <AlertTriangle size={24} color="#ffffff" />
                <View style={styles.arrivalTextContainer}>
                  <Text style={styles.arrivalTitle}>Mechanic Arrived!</Text>
                  <Text style={styles.arrivalSubtitle}>Mike is at your location</Text>
                </View>
              </LinearGradient>
            </Animated.View>
          )}
        </View>

        {/* Bottom Sheet */}
        <Animated.View
          style={[
            styles.bottomSheet,
            {
              transform: [{ translateY: slideUpAnim }],
            },
          ]}
        >
          {/* Trip Details */}
          <View style={styles.tripDetails}>
            <View style={styles.tripHeader}>
              <MapPin size={20} color="#6366f1" />
              <Text style={styles.tripTitle}>Trip Details</Text>
            </View>
            
            <View style={styles.tripInfoGrid}>
              <View style={styles.tripInfoItem}>
                <View style={styles.tripInfoIcon}>
                  <Navigation size={16} color="#6366f1" />
                </View>
                <View style={styles.tripInfoContent}>
                  <Text style={styles.tripInfoLabel}>Distance</Text>
                  <Text style={styles.tripInfoValue}>{distance} miles</Text>
                </View>
              </View>
              
              <View style={styles.tripInfoItem}>
                <View style={styles.tripInfoIcon}>
                  <Wrench size={16} color="#f59e0b" />
                </View>
                <View style={styles.tripInfoContent}>
                  <Text style={styles.tripInfoLabel}>Issue Type</Text>
                  <Text style={styles.tripInfoValue}>Engine Problem</Text>
                </View>
              </View>
              
              <View style={styles.tripInfoItem}>
                <View style={styles.tripInfoIcon}>
                  <Clock size={16} color="#10b981" />
                </View>
                <View style={styles.tripInfoContent}>
                  <Text style={styles.tripInfoLabel}>Est. Arrival</Text>
                  <Text style={styles.tripInfoValue}>2:45 PM</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.emergencyButton}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#ef4444', '#dc2626']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.emergencyButtonGradient}
              >
                <Phone size={20} color="#ffffff" />
                <Text style={styles.emergencyButtonText}>Emergency</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/chat')}
              style={styles.chatButton}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#6366f1', '#8b5cf6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.chatButtonGradient}
              >
                <MessageCircle size={20} color="#ffffff" />
                <Text style={styles.chatButtonText}>Chat with Mechanic</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Status Message */}
          <View style={styles.statusMessage}>
            <LinearGradient
              colors={['#eff6ff', '#dbeafe']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.statusMessageContent}
            >
              <Clock size={16} color="#6366f1" />
              <Text style={styles.statusMessageText}>
                {eta > 0
                  ? `Mike is ${eta} minute${eta !== 1 ? 's' : ''} away. Sit tight!`
                  : 'Mike has arrived at your location'}
              </Text>
            </LinearGradient>
          </View>
        </Animated.View>
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
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  mapGradient: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  mapGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
  },
  gridLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#94a3b8',
    marginBottom: 50,
  },
  routePath: {
    position: 'absolute',
    top: '40%',
    left: '20%',
    right: '20%',
  },
  routeLine: {
    height: 3,
    backgroundColor: '#6366f1',
    borderRadius: 2,
    opacity: 0.3,
  },
  routeDotStart: {
    position: 'absolute',
    left: 0,
    top: -3,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10b981',
  },
  routeDotEnd: {
    position: 'absolute',
    right: 0,
    top: -3,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6366f1',
  },
  navigationMarker: {
    position: 'absolute',
    top: '35%',
    right: '25%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerInner: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  markerGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  markerPulse: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    zIndex: 1,
  },
  markerPulse2: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    zIndex: 0,
  },
  mapControls: {
    position: 'absolute',
    right: 16,
    top: '40%',
    gap: 8,
  },
  mapControlButton: {
    width: 40,
    height: 40,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapControlText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6366f1',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 10 : 20,
    left: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  backButtonBlur: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  mechanicCard: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 20 : 30,
    left: 16,
    right: 16,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  mechanicContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  mechanicAvatar: {
    position: 'relative',
    marginRight: 12,
  },
  avatarGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
  onlineDot: {
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
  mechanicInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  mechanicName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    gap: 4,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#10b981',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981',
  },
  statusText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#f59e0b',
  },
  etaContainer: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  etaRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: '#6366f1',
    borderTopColor: 'transparent',
    position: 'absolute',
  },
  etaRingInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f4ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  etaTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  etaNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#6366f1',
  },
  etaUnit: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6366f1',
    marginTop: -2,
  },
  progressContainer: {
    height: 3,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  progressGradient: {
    flex: 1,
  },
  arrivalBanner: {
    position: 'absolute',
    top: '50%',
    left: 20,
    right: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  arrivalContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  arrivalTextContainer: {
    flex: 1,
  },
  arrivalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  arrivalSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  bottomSheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  tripDetails: {
    marginBottom: 20,
  },
  tripHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  tripTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  tripInfoGrid: {
    gap: 12,
  },
  tripInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 12,
    gap: 12,
  },
  tripInfoIcon: {
    width: 36,
    height: 36,
    backgroundColor: '#eff6ff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tripInfoContent: {
    flex: 1,
  },
  tripInfoLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 2,
  },
  tripInfoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  emergencyButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  emergencyButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  emergencyButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  chatButton: {
    flex: 2,
    borderRadius: 16,
    overflow: 'hidden',
  },
  chatButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  chatButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  statusMessage: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  statusMessageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  statusMessageText: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '600',
    textAlign: 'center',
  },
});