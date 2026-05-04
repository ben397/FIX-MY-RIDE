import { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
  StatusBar,
  Dimensions,
  Alert,
  Linking,
  Vibration,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  MapPin,
  Phone,
  MessageCircle,
  Navigation,
  Clock,
  ChevronLeft,
  Star,
  Shield,
  AlertTriangle,
  Wrench,
  Share2,
  Car,
  User,
  TrendingDown,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function LiveTrackingScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { mechanicId } = route.params || {};
  
  const [eta, setEta] = useState(5);
  const [distanceTraveled, setDistanceTraveled] = useState(0);
  const [mechanicLocation, setMechanicLocation] = useState({ x: 50, y: 60 });
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const mapAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Start pulse animation for mechanic marker
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    // Simulate mechanic movement
    const movementInterval = setInterval(() => {
      setMechanicLocation(prev => ({
        x: Math.max(10, prev.x - Math.random() * 3),
        y: Math.max(10, prev.y - Math.random() * 2),
      }));
      setDistanceTraveled(prev => Math.min(0.8, prev + 0.05));
    }, 2000);

    // ETA countdown
    const etaInterval = setInterval(() => {
      setEta((prev) => {
        if (prev <= 1) {
          clearInterval(etaInterval);
          clearInterval(movementInterval);
          Vibration.vibrate([500, 200, 500]);
          
          // Animate arrival
          Animated.spring(bounceAnim, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
          }).start();
          
          setTimeout(() => {
            navigation.replace('Completion', { mechanicId });
          }, 3000);
          return 0;
        }
        return prev - 1;
      });
    }, 3000);

    // Progress animation
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: eta * 3000,
      useNativeDriver: false,
    }).start();

    return () => {
      clearInterval(etaInterval);
      clearInterval(movementInterval);
      pulse.stop();
    };
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const bounceTranslateY = bounceAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -20, 0],
  });

  const handleEmergencyCall = useCallback(() => {
    Alert.alert(
      'Emergency Call',
      'Do you want to call emergency services?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call 911',
          style: 'destructive',
          onPress: () => Linking.openURL('tel:911'),
        },
      ]
    );
  }, []);

  const handleCallMechanic = useCallback(() => {
    Linking.openURL('tel:+1234567890');
  }, []);

  const handleShareLocation = useCallback(() => {
    Alert.alert('Share Location', 'Location link copied to clipboard!');
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      <View style={styles.container}>
        {/* Map Area */}
        <View style={styles.mapContainer}>
          <LinearGradient
            colors={['#e0e7ff', '#dbeafe', '#eff6ff']}
            style={styles.mapGradient}
          >
            {/* Road Grid */}
            <View style={styles.roadGrid}>
              {['horizontal', 'vertical'].map((type, i) => (
                <View
                  key={`${type}-${i}`}
                  style={[
                    type === 'horizontal' ? styles.horizontalRoad : styles.verticalRoad,
                    { 
                      left: type === 'vertical' ? `${(i + 1) * 30}%` : 0,
                      top: type === 'horizontal' ? `${(i + 1) * 25}%` : 0,
                    },
                  ]}
                />
              ))}
            </View>

            {/* Your Location Marker */}
            <View style={[styles.userMarker, { bottom: '20%', left: '30%' }]}>
              <View style={styles.userMarkerInner}>
                <View style={styles.userDot} />
              </View>
              <Text style={styles.markerLabel}>You</Text>
            </View>

            {/* Mechanic Marker */}
            <Animated.View
              style={[
                styles.mechanicMarker,
                {
                  top: `${mechanicLocation.y}%`,
                  left: `${mechanicLocation.x}%`,
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            >
              <LinearGradient
                colors={['#6366f1', '#8b5cf6']}
                style={styles.mechanicMarkerGradient}
              >
                <Car size={24} color="#ffffff" />
              </LinearGradient>
              <View style={styles.markerPulse} />
              <View style={styles.markerPulse2} />
              <Text style={[styles.markerLabel, { color: '#6366f1' }]}>Mike</Text>
            </Animated.View>

            {/* Route Line */}
            <View style={styles.routeLine}>
              <View style={styles.routeDash} />
              <View style={styles.routeDash} />
              <View style={styles.routeDash} />
            </View>

            {/* Map Controls */}
            <View style={styles.mapControls}>
              <TouchableOpacity style={styles.mapButton}>
                <Text style={styles.mapButtonText}>+</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.mapButton}>
                <Text style={styles.mapButtonText}>−</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.mapButton}>
                <Navigation size={18} color="#6366f1" />
              </TouchableOpacity>
            </View>

            {/* Distance Info */}
            <View style={styles.distanceInfo}>
              <LinearGradient
                colors={['#ffffff', '#f8fafc']}
                style={styles.distanceContent}
              >
                <View style={styles.distanceRow}>
                  <TrendingDown size={16} color="#10b981" />
                  <Text style={styles.distanceText}>
                    {distanceTraveled.toFixed(2)} miles traveled
                  </Text>
                </View>
                <View style={styles.distanceProgress}>
                  <Animated.View
                    style={[styles.distanceProgressFill, { width: progressWidth }]}
                  >
                    <LinearGradient
                      colors={['#6366f1', '#8b5cf6']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{ flex: 1 }}
                    />
                  </Animated.View>
                </View>
              </LinearGradient>
            </View>
          </LinearGradient>

          {/* Back Button */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.8}
          >
            <BlurView intensity={80} tint="light" style={styles.backButtonBlur}>
              <ChevronLeft size={24} color="#1e293b" />
            </BlurView>
          </TouchableOpacity>

          {/* Mechanic Info Card */}
          <View style={styles.mechanicCard}>
            <LinearGradient
              colors={['#ffffff', '#f8fafc']}
              style={styles.mechanicCardGradient}
            >
              {/* Status Banner */}
              <View style={styles.statusBanner}>
                <LinearGradient
                  colors={['#6366f1', '#8b5cf6']}
                  style={styles.statusContent}
                >
                  <Shield size={14} color="#ffffff" />
                  <Text style={styles.statusText}>Mechanic En Route</Text>
                </LinearGradient>
              </View>

              <View style={styles.mechanicContent}>
                {/* Avatar */}
                <View style={styles.avatar}>
                  <LinearGradient
                    colors={['#6366f1', '#8b5cf6']}
                    style={styles.avatarGradient}
                  >
                    <User size={20} color="#ffffff" />
                  </LinearGradient>
                  <View style={styles.onlineDot} />
                </View>

                {/* Info */}
                <View style={styles.mechanicInfo}>
                  <Text style={styles.mechanicName}>Mike Johnson</Text>
                  <View style={styles.ratingRow}>
                    <Star size={12} color="#f59e0b" fill="#f59e0b" />
                    <Text style={styles.ratingText}>4.9 • Engine Expert</Text>
                  </View>
                  <View style={styles.locationRow}>
                    <MapPin size={12} color="#64748b" />
                    <Text style={styles.locationText}>2 blocks away</Text>
                  </View>
                </View>

                {/* ETA Counter */}
                <View style={styles.etaContainer}>
                  <View style={styles.etaCircle}>
                    <Text style={styles.etaValue}>{eta}</Text>
                    <Text style={styles.etaUnit}>min</Text>
                  </View>
                  <Text style={styles.etaLabel}>ETA</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Arrival Alert */}
          {eta === 0 && (
            <Animated.View
              style={[
                styles.arrivalAlert,
                { transform: [{ translateY: bounceTranslateY }] },
              ]}
            >
              <LinearGradient
                colors={['#10b981', '#059669']}
                style={styles.arrivalContent}
              >
                <View style={styles.arrivalIcon}>
                  <AlertTriangle size={32} color="#ffffff" />
                </View>
                <Text style={styles.arrivalTitle}>Mechanic Arrived!</Text>
                <Text style={styles.arrivalSubtitle}>
                  Mike is at your location
                </Text>
              </LinearGradient>
            </Animated.View>
          )}
        </View>

        {/* Bottom Sheet */}
        <View style={styles.bottomSheet}>
          {/* Trip Details */}
          <View style={styles.tripSection}>
            <View style={styles.tripHeader}>
              <Wrench size={20} color="#6366f1" />
              <Text style={styles.tripTitle}>Trip Details</Text>
            </View>

            <View style={styles.tripGrid}>
              <View style={styles.tripItem}>
                <View style={[styles.tripIcon, { backgroundColor: '#eff6ff' }]}>
                  <MapPin size={16} color="#6366f1" />
                </View>
                <View style={styles.tripInfo}>
                  <Text style={styles.tripLabel}>Distance</Text>
                  <Text style={styles.tripValue}>0.8 miles</Text>
                </View>
              </View>

              <View style={styles.tripItem}>
                <View style={[styles.tripIcon, { backgroundColor: '#fef3c7' }]}>
                  <AlertTriangle size={16} color="#f59e0b" />
                </View>
                <View style={styles.tripInfo}>
                  <Text style={styles.tripLabel}>Issue</Text>
                  <Text style={styles.tripValue}>Engine Problem</Text>
                </View>
              </View>

              <View style={styles.tripItem}>
                <View style={[styles.tripIcon, { backgroundColor: '#ecfdf5' }]}>
                  <Clock size={16} color="#10b981" />
                </View>
                <View style={styles.tripInfo}>
                  <Text style={styles.tripLabel}>Arrival</Text>
                  <Text style={styles.tripValue}>2:45 PM</Text>
                </View>
              </View>

              <View style={styles.tripItem}>
                <View style={[styles.tripIcon, { backgroundColor: '#fef2f2' }]}>
                  <Car size={16} color="#ef4444" />
                </View>
                <View style={styles.tripInfo}>
                  <Text style={styles.tripLabel}>Vehicle</Text>
                  <Text style={styles.tripValue}>Toyota Camry</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              onPress={handleEmergencyCall}
              style={styles.emergencyButton}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#ef4444', '#dc2626']}
                style={styles.emergencyButtonGradient}
              >
                <Phone size={18} color="#ffffff" />
                <Text style={styles.emergencyButtonText}>SOS</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleCallMechanic}
              style={styles.callButton}
              activeOpacity={0.8}
            >
              <Phone size={22} color="#ffffff" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('Chat')}
              style={styles.chatButton}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#6366f1', '#8b5cf6']}
                style={styles.chatButtonGradient}
              >
                <MessageCircle size={18} color="#ffffff" />
                <Text style={styles.chatButtonText}>Chat</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleShareLocation}
              style={styles.shareButton}
              activeOpacity={0.8}
            >
              <Share2 size={20} color="#6366f1" />
            </TouchableOpacity>
          </View>

          {/* Status Message */}
          <View style={styles.statusMessage}>
            <LinearGradient
              colors={['#eff6ff', '#dbeafe']}
              style={styles.statusMessageContent}
            >
              <Navigation size={16} color="#6366f1" />
              <Text style={styles.statusMessageText}>
                {eta > 0
                  ? `Mike is ${eta} minute${eta !== 1 ? 's' : ''} away. Sit tight!`
                  : 'Mike has arrived at your location'}
              </Text>
            </LinearGradient>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    flex: 1,
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
  roadGrid: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0,
  },
  horizontalRoad: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#94a3b8',
  },
  verticalRoad: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#94a3b8',
  },
  userMarker: {
    position: 'absolute',
    alignItems: 'center',
  },
  userMarkerInner: {
    width: 24,
    height: 24,
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  userDot: {
    width: 8,
    height: 8,
    backgroundColor: '#ffffff',
    borderRadius: 4,
  },
  markerLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#3b82f6',
    marginTop: 4,
    backgroundColor: '#ffffff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  mechanicMarker: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 2,
  },
  mechanicMarkerGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  markerPulse: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    zIndex: -1,
  },
  markerPulse2: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    zIndex: -2,
  },
  routeLine: {
    position: 'absolute',
    top: '35%',
    left: '40%',
    width: '30%',
    height: 40,
    transform: [{ rotate: '30deg' }],
  },
  routeDash: {
    height: 2,
    backgroundColor: '#6366f1',
    marginBottom: 8,
    opacity: 0.5,
  },
  mapControls: {
    position: 'absolute',
    top: '40%',
    right: 12,
    gap: 8,
  },
  mapButton: {
    width: 36,
    height: 36,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  mapButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6366f1',
  },
  distanceInfo: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  distanceContent: {
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  distanceText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  distanceProgress: {
    height: 3,
    backgroundColor: '#e2e8f0',
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  distanceProgressFill: {
    height: '100%',
    borderRadius: 1.5,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 16,
    borderRadius: 16,
    overflow: 'hidden',
    zIndex: 3,
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
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 70,
    right: 16,
    borderRadius: 20,
    overflow: 'hidden',
    zIndex: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  mechanicCardGradient: {
    borderRadius: 20,
  },
  statusBanner: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  statusContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    gap: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#ffffff',
  },
  mechanicContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 10,
  },
  avatar: {
    position: 'relative',
  },
  avatarGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  mechanicInfo: {
    flex: 1,
  },
  mechanicName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  ratingText: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 11,
    color: '#94a3b8',
  },
  etaContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  etaCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#6366f1',
  },
  etaValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6366f1',
  },
  etaUnit: {
    fontSize: 9,
    fontWeight: '600',
    color: '#6366f1',
    marginTop: -2,
  },
  etaLabel: {
    fontSize: 9,
    color: '#94a3b8',
    marginTop: 2,
  },
  arrivalAlert: {
    position: 'absolute',
    top: '40%',
    left: 30,
    right: 30,
    borderRadius: 24,
    overflow: 'hidden',
    zIndex: 4,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  arrivalContent: {
    padding: 24,
    alignItems: 'center',
  },
  arrivalIcon: {
    marginBottom: 12,
  },
  arrivalTitle: {
    fontSize: 22,
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
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  tripSection: {
    marginBottom: 20,
  },
  tripHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  tripTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1e293b',
  },
  tripGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tripItem: {
    width: (width - 60) / 2,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 12,
    gap: 10,
  },
  tripIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tripInfo: {
    flex: 1,
  },
  tripLabel: {
    fontSize: 10,
    color: '#94a3b8',
    marginBottom: 2,
  },
  tripValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1e293b',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  emergencyButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  emergencyButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 6,
  },
  emergencyButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
  callButton: {
    width: 50,
    height: 50,
    backgroundColor: '#10b981',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  chatButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  chatButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  chatButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  shareButton: {
    width: 50,
    height: 50,
    backgroundColor: '#f1f5f9',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statusMessage: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  statusMessageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    gap: 8,
  },
  statusMessageText: {
    fontSize: 13,
    color: '#6366f1',
    fontWeight: '600',
  },
});