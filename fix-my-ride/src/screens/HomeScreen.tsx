import { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { 
  Wrench, 
  User, 
  MapPin, 
  ChevronRight, 
  Zap, 
  Gauge, 
  Battery, 
  Fuel, 
  Navigation, 
  Bell,
  Star,
  Clock,
  TrendingUp,
  Shield,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomTabNavigation from '../navigation/BottomNavigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

const { width } = Dimensions.get('window');

const quickShortcuts = [
  { id: 'tire', label: 'Flat Tire', icon: Gauge, gradient: ['#f97316', '#ea580c'] },
  { id: 'battery', label: 'Battery Jump', icon: Battery, gradient: ['#eab308', '#ca8a04'] },
  { id: 'fuel', label: 'Fuel Delivery', icon: Fuel, gradient: ['#3b82f6', '#2563eb'] },
];

const stats = [
  { id: 'rating', label: 'Avg. Rating', value: '4.8★', icon: Star },
  { id: 'time', label: 'Avg. Time', value: '12 min', icon: Clock },
  { id: 'success', label: 'Success', value: '98%', icon: TrendingUp },
];

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const notificationDot = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulsing animation for "Request Fix Now" button
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
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

    // Notification dot animation
    const dotAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(notificationDot, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(notificationDot, {
          toValue: 0.3,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );
    dotAnimation.start();

    return () => {
      pulse.stop();
      dotAnimation.stop();
    };
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1e3a8a" />
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header Section */}
          <LinearGradient
            colors={['#1e3a8a', '#3b82f6', '#60a5fa']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            {/* Top Bar */}
            <View style={styles.topBar}>
              <View style={styles.greetingContainer}>
                <Text style={styles.greetingText}>Good afternoon 👋</Text>
                <Text style={styles.userName}>John Doe</Text>
              </View>
              <View style={styles.headerButtons}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Notifications')}
                  style={styles.iconButton}
                  activeOpacity={0.7}
                >
                  <Bell size={22} color="#ffffff" />
                  <Animated.View
                    style={[
                      styles.notificationDot,
                      { opacity: notificationDot },
                    ]}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate("MainTabs", { screen: "ProfileTab" })}
                  style={styles.iconButton}
                  activeOpacity={0.7}
                >
                  <User size={22} color="#ffffff" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Location Card */}
            <TouchableOpacity
              style={styles.locationCard}
              activeOpacity={0.8}
            >
              <BlurView intensity={20} tint="light" style={styles.locationContent}>
                <View style={styles.locationIcon}>
                  <MapPin size={20} color="#fbbf24" />
                </View>
                <View style={styles.locationInfo}>
                  <Text style={styles.locationLabel}>Current Location</Text>
                  <Text style={styles.locationAddress} numberOfLines={1}>
                    123 Main Street, Downtown
                  </Text>
                </View>
                <ChevronRight size={20} color="rgba(255, 255, 255, 0.5)" />
              </BlurView>
            </TouchableOpacity>
          </LinearGradient>

          {/* Main Content */}
          <View style={styles.mainContent}>
            {/* Emergency Card */}
            <Animated.View
              style={[
                styles.emergencyCard,
                { transform: [{ scale: pulseAnim }] },
              ]}
            >
              <LinearGradient
                colors={['#6366f1', '#8b5cf6', '#a78bfa']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.emergencyGradient}
              >
                <View style={styles.emergencyHeader}>
                  <View>
                    <Text style={styles.emergencyTitle}>Need Help Now?</Text>
                    <Text style={styles.emergencySubtitle}>
                      Get a mechanic in minutes
                    </Text>
                  </View>
                  <View style={styles.emergencyIconContainer}>
                    <Zap size={24} color="#ffffff" />
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => navigation.navigate('RequestService' as never)}
                  style={styles.emergencyButton}
                  activeOpacity={0.9}
                >
                  <LinearGradient
                    colors={['#ffffff', '#f0f0f0']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.emergencyButtonGradient}
                  >
                    <Shield size={20} color="#6366f1" />
                    <Text style={styles.emergencyButtonText}>
                      Request Fix Now
                    </Text>
                    <ChevronRight size={20} color="#6366f1" />
                  </LinearGradient>
                </TouchableOpacity>
              </LinearGradient>
            </Animated.View>

            {/* Quick Shortcuts */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Quick Shortcuts</Text>
              <View style={styles.shortcutsGrid}>
                {quickShortcuts.map((shortcut) => {
                  const Icon = shortcut.icon;
                  return (
                    <TouchableOpacity
                      key={shortcut.id}
                      onPress={() => navigation.navigate('RequestService' as never)}
                      style={styles.shortcutCard}
                      activeOpacity={0.7}
                    >
                      <LinearGradient
                        colors={shortcut.gradient as [string, string]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.shortcutIcon}
                      >
                        <Icon size={24} color="#ffffff" strokeWidth={2} />
                      </LinearGradient>
                      <Text style={styles.shortcutLabel} numberOfLines={2}>
                        {shortcut.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Map Preview */}
            <TouchableOpacity
              style={styles.mapCard}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#f8fafc', '#e2e8f0']}
                style={styles.mapContent}
              >
                <View style={styles.mapPlaceholder}>
                  <View style={styles.mapIconContainer}>
                    <Navigation size={32} color="#6366f1" />
                  </View>
                  <Text style={styles.mapTitle}>Map Preview</Text>
                  <View style={styles.mechanicsBadge}>
                    <View style={styles.onlineDot} />
                    <Text style={styles.mechanicsText}>
                      5 mechanics nearby
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* Mechanics Online Stats */}
            <View style={styles.statsSection}>
              <View style={styles.statsHeader}>
                <View style={styles.statsIconContainer}>
                  <Wrench size={20} color="#f59e0b" />
                </View>
                <View>
                  <Text style={styles.statsTitle}>Mechanics Online</Text>
                  <Text style={styles.statsSubtitle}>
                    47 available near you
                  </Text>
                </View>
              </View>

              <View style={styles.statsGrid}>
                {stats.map((stat) => {
                  const StatIcon = stat.icon;
                  return (
                    <View key={stat.id} style={styles.statCard}>
                      <BlurView intensity={30} tint="light" style={styles.statContent}>
                        <StatIcon size={18} color="#6366f1" />
                        <Text style={styles.statLabel}>{stat.label}</Text>
                        <Text style={styles.statValue}>{stat.value}</Text>
                      </BlurView>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        </ScrollView>

        <BottomTabNavigation />
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
    paddingBottom: 90, // Space for bottom tab
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greetingContainer: {
    flex: 1,
  },
  greetingText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },
  locationCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  locationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    gap: 12,
  },
  locationIcon: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationInfo: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 2,
  },
  locationAddress: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  mainContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  emergencyCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  emergencyGradient: {
    padding: 24,
  },
  emergencyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  emergencyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  emergencySubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  emergencyIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  emergencyButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 10,
  },
  emergencyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6366f1',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  shortcutsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  shortcutCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  shortcutIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  shortcutLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    textAlign: 'center',
  },
  mapCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
    height: 180,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  mapContent: {
    flex: 1,
  },
  mapPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapIconContainer: {
    width: 64,
    height: 64,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  mapTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
  },
  mechanicsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
    marginRight: 6,
  },
  mechanicsText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6366f1',
  },
  statsSection: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  statsIconContainer: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  statsSubtitle: {
    fontSize: 13,
    color: '#f59e0b',
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  statContent: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(248, 250, 252, 0.8)',
  },
  statLabel: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 8,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
});