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
  Dimensions,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  User,
  Car,
  Heart,
  CreditCard,
  Settings,
  ChevronRight,
  Edit,
  Phone,
  Mail,
  MapPin,
  Shield,
  Star,
  Award,
  LogOut,
  Bell,
  HelpCircle,
  Share2,
  Wrench,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const savedMechanics = [
  {
    name: 'Mike Johnson',
    rating: 4.9,
    specialty: 'Engine Expert',
    initials: 'MJ',
    isFavorite: true,
  },
  {
    name: 'Sarah Williams',
    rating: 4.8,
    specialty: 'Tire Specialist',
    initials: 'SW',
    isFavorite: true,
  },
  {
    name: 'David Chen',
    rating: 4.7,
    specialty: 'Electrical Expert',
    initials: 'DC',
    isFavorite: true,
  },
];

const menuItems = [
  {
    id: 'vehicles',
    title: 'My Vehicles',
    subtitle: 'Toyota Camry 2020 • ABC-1234',
    icon: Car,
    iconColors: ['#6366f1', '#8b5cf6'],
    route: 'VehicleManagement',
  },
  {
    id: 'mechanics',
    title: 'Saved Mechanics',
    subtitle: '3 favorites',
    icon: Heart,
    iconColors: ['#f59e0b', '#d97706'],
    route: 'SavedMechanics',
  },
  {
    id: 'payments',
    title: 'Payment Methods',
    subtitle: '2 cards, M-Pesa',
    icon: CreditCard,
    iconColors: ['#8b5cf6', '#7c3aed'],
    route: 'PaymentMethods',
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: Settings,
    iconColors: ['#64748b', '#475569'],
    route: 'Settings',
  },
];

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const profileScale = useRef(new Animated.Value(1)).current;
  const [isOnline, setIsOnline] = useState(true);

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

    // Profile picture animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(profileScale, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(profileScale, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const handleEditProfile = () => {
    Animated.sequence([
      Animated.spring(profileScale, {
        toValue: 0.9,
        useNativeDriver: false,
      }),
      Animated.spring(profileScale, {
        toValue: 1,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handleLogout = () => {
    // Add logout logic here
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1e3a8a" />
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header with Profile */}
          <LinearGradient
            colors={['#1e3a8a', '#3b82f6', '#60a5fa']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            <Text style={styles.headerTitle}>Profile</Text>
            <Text style={styles.headerSubtitle}>Manage your account</Text>

            {/* Profile Card */}
            <Animated.View
              style={[
                styles.profileCard,
                {
                  transform: [
                    { translateY: slideAnim },
                    { scale: profileScale },
                  ],
                  opacity: fadeAnim,
                },
              ]}
            >
              <TouchableOpacity
                onPress={handleEditProfile}
                activeOpacity={0.9}
                style={styles.profileTouchable}
              >
                <View style={styles.profileContent}>
                  {/* Avatar */}
                  <View style={styles.avatarContainer}>
                    <View style={styles.avatarWrapper}>
                      <LinearGradient
                        colors={['#818cf8', '#6366f1']}
                        style={styles.avatar}
                      >
                        <User size={48} color="#ffffff" />
                      </LinearGradient>
                      {isOnline && <View style={styles.onlineIndicator} />}
                    </View>
                    <TouchableOpacity
                      style={styles.editAvatarButton}
                      onPress={handleEditProfile}
                    >
                      <LinearGradient
                        colors={['#6366f1', '#8b5cf6']}
                        style={styles.editAvatarGradient}
                      >
                        <Edit size={14} color="#ffffff" />
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>

                  {/* Info */}
                  <View style={styles.profileInfo}>
                    <Text style={styles.userName}>John Doe</Text>
                    
                    <View style={styles.contactRow}>
                      <View style={styles.contactItem}>
                        <Phone size={14} color="#64748b" />
                        <Text style={styles.contactText}>+1 (555) 123-4567</Text>
                      </View>
                    </View>
                    
                    <View style={styles.contactRow}>
                      <View style={styles.contactItem}>
                        <Mail size={14} color="#64748b" />
                        <Text style={styles.contactText}>john.doe@email.com</Text>
                      </View>
                    </View>

                    <View style={styles.contactRow}>
                      <View style={styles.contactItem}>
                        <MapPin size={14} color="#64748b" />
                        <Text style={styles.contactText}>San Francisco, CA</Text>
                      </View>
                    </View>

                    {/* Stats Row */}
                    <View style={styles.statsRow}>
                      <View style={styles.statItem}>
                        <Text style={styles.statNumber}>12</Text>
                        <Text style={styles.statLabel}>Services</Text>
                      </View>
                      <View style={styles.statDivider} />
                      <View style={styles.statItem}>
                        <Text style={styles.statNumber}>4.8</Text>
                        <Text style={styles.statLabel}>Rating</Text>
                      </View>
                      <View style={styles.statDivider} />
                      <View style={styles.statItem}>
                        <Text style={styles.statNumber}>3</Text>
                        <Text style={styles.statLabel}>Vehicles</Text>
                      </View>
                    </View>
                  </View>

                  {/* Edit Button */}
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => navigation.navigate('EditProfile')}
                  >
                    <LinearGradient
                      colors={['#6366f1', '#8b5cf6']}
                      style={styles.editButtonGradient}
                    >
                      <Edit size={18} color="#ffffff" />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Animated.View>
          </LinearGradient>

          {/* Main Content */}
          <View style={styles.mainContent}>
            {/* Menu Items */}
            <View style={styles.menuSection}>
              <Text style={styles.sectionTitle}>Account</Text>
              <View style={styles.menuGrid}>
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <Animated.View
                      key={item.id}
                      style={{
                        opacity: fadeAnim,
                        transform: [
                          {
                            translateY: slideAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0, 15 * (index + 1)],
                            }),
                          },
                        ],
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => navigation.navigate(item.route)}
                        style={styles.menuItem}
                        activeOpacity={0.8}
                      >
                        <View style={styles.menuItemContent}>
                          <View style={styles.menuIconContainer}>
                            <LinearGradient
                              colors={item.iconColors}
                              style={styles.menuIcon}
                            >
                              <Icon size={22} color="#ffffff" />
                            </LinearGradient>
                          </View>
                          
                          <View style={styles.menuInfo}>
                            <Text style={styles.menuTitle}>{item.title}</Text>
                            {item.subtitle && (
                              <Text style={styles.menuSubtitle} numberOfLines={1}>
                                {item.subtitle}
                              </Text>
                            )}
                          </View>

                          <ChevronRight size={20} color="#94a3b8" />
                        </View>
                      </TouchableOpacity>
                    </Animated.View>
                  );
                })}
              </View>
            </View>

            {/* Saved Mechanics */}
            <View style={styles.mechanicsSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Favorite Mechanics</Text>
                <TouchableOpacity onPress={() => navigation.navigate('SavedMechanics')}>
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.mechanicsScroll}
              >
                {savedMechanics.map((mechanic, index) => (
                  <Animated.View
                    key={index}
                    style={[
                      styles.mechanicCard,
                      {
                        opacity: fadeAnim,
                        transform: [
                          {
                            translateX: slideAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [30 * (index + 1), 0],
                            }),
                          },
                        ],
                      },
                    ]}
                  >
                    <LinearGradient
                      colors={['#ffffff', '#f8fafc']}
                      style={styles.mechanicCardGradient}
                    >
                      <View style={styles.mechanicAvatarSmall}>
                        <LinearGradient
                          colors={['#6366f1', '#8b5cf6']}
                          style={styles.mechanicAvatarGradient}
                        >
                          <Text style={styles.mechanicInitials}>
                            {mechanic.initials}
                          </Text>
                        </LinearGradient>
                        <View style={styles.mechanicOnlineDot} />
                      </View>

                      <Text style={styles.mechanicCardName}>{mechanic.name}</Text>
                      
                      <View style={styles.mechanicRating}>
                        <Star size={12} color="#f59e0b" />
                        <Text style={styles.mechanicRatingText}>{mechanic.rating}</Text>
                      </View>

                      <View style={styles.mechanicSpecialty}>
                        <Wrench size={12} color="#64748b" />
                        <Text style={styles.mechanicSpecialtyText}>
                          {mechanic.specialty}
                        </Text>
                      </View>

                      {mechanic.isFavorite && (
                        <View style={styles.favoriteBadge}>
                          <Heart size={12} color="#ef4444" fill="#ef4444" />
                        </View>
                      )}
                    </LinearGradient>
                  </Animated.View>
                ))}
              </ScrollView>
            </View>

            {/* Quick Actions */}
            <View style={styles.actionsSection}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <View style={styles.actionsGrid}>
                <TouchableOpacity
                  style={styles.actionCard}
                  onPress={() => navigation.navigate('Notifications')}
                >
                  <LinearGradient
                    colors={['#eff6ff', '#dbeafe']}
                    style={styles.actionContent}
                  >
                    <Bell size={24} color="#6366f1" />
                    <Text style={styles.actionText}>Notifications</Text>
                    <View style={styles.notificationBadge}>
                      <Text style={styles.notificationCount}>3</Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionCard}
                  onPress={() => navigation.navigate('Help')}
                >
                  <LinearGradient
                    colors={['#f0fdf4', '#dcfce7']}
                    style={styles.actionContent}
                  >
                    <HelpCircle size={24} color="#10b981" />
                    <Text style={styles.actionText}>Help Center</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionCard}
                  onPress={() => navigation.navigate('Share')}
                >
                  <LinearGradient
                    colors={['#fef3c7', '#fde68a']}
                    style={styles.actionContent}
                  >
                    <Share2 size={24} color="#f59e0b" />
                    <Text style={styles.actionText}>Share App</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionCard}
                  onPress={handleLogout}
                >
                  <LinearGradient
                    colors={['#fef2f2', '#fee2e2']}
                    style={styles.actionContent}
                  >
                    <LogOut size={24} color="#ef4444" />
                    <Text style={[styles.actionText, { color: '#ef4444' }]}>
                      Logout
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>

            {/* Badge Section */}
            <View style={styles.badgeSection}>
              <View style={styles.badgeCard}>
                <LinearGradient
                  colors={['#6366f1', '#8b5cf6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.badgeContent}
                >
                  <View style={styles.badgeIcon}>
                    <Award size={32} color="#fbbf24" />
                  </View>
                  <View style={styles.badgeInfo}>
                    <Text style={styles.badgeTitle}>Premium Member</Text>
                    <Text style={styles.badgeSubtitle}>
                      Enjoy priority service and discounts
                    </Text>
                  </View>
                  <Shield size={20} color="#fbbf24" />
                </LinearGradient>
              </View>
            </View>

            {/* App Version */}
            <Text style={styles.versionText}>Version 2.1.0</Text>
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
    paddingBottom: 40,
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
    marginBottom: 30,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    marginHorizontal: 0,
  },
  profileTouchable: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  profileContent: {
    flexDirection: 'row',
    padding: 20,
    position: 'relative',
  },
  avatarContainer: {
    marginRight: 16,
    position: 'relative',
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10b981',
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  editAvatarGradient: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  contactRow: {
    marginBottom: 4,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  contactText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 10,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6366f1',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#e2e8f0',
  },
  editButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  editButtonGradient: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  menuSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  menuGrid: {
    gap: 10,
  },
  menuItem: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuIconContainer: {
    marginRight: 14,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuInfo: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 13,
    color: '#94a3b8',
  },
  mechanicsSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366f1',
  },
  mechanicsScroll: {
    gap: 12,
    paddingRight: 20,
  },
  mechanicCard: {
    width: 160,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  mechanicCardGradient: {
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    borderRadius: 20,
  },
  mechanicAvatarSmall: {
    marginBottom: 12,
    position: 'relative',
  },
  mechanicAvatarGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mechanicInitials: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
  },
  mechanicOnlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  mechanicCardName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 6,
    textAlign: 'center',
  },
  mechanicRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  mechanicRatingText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#f59e0b',
  },
  mechanicSpecialty: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  mechanicSpecialtyText: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
  },
  favoriteBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fef2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionsSection: {
    marginBottom: 24,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  actionCard: {
    width: (width - 60) / 2,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  actionContent: {
    padding: 20,
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginTop: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationCount: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
  },
  badgeSection: {
    marginBottom: 24,
  },
  badgeCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  badgeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  badgeIcon: {
    marginRight: 16,
  },
  badgeInfo: {
    flex: 1,
  },
  badgeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  badgeSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 18,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 24,
  },
});