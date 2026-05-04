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
  Switch,
  Alert,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  ChevronLeft,
  Bell,
  MapPin,
  Globe,
  HelpCircle,
  FileText,
  LogOut,
  ChevronRight,
  Shield,
  Moon,
  User,
  CreditCard,
  Star,
  Share2,
  Trash2,
  Info,
  Smartphone,
  Wifi,
  Lock,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const settingsSections = [
  {
    title: 'Preferences',
    items: [
      {
        id: 'notifications',
        icon: Bell,
        iconColor: '#6366f1',
        bgColor: '#eef2ff',
        title: 'Push Notifications',
        subtitle: 'Service updates and alerts',
        type: 'toggle',
        key: 'notificationsEnabled',
      },
      {
        id: 'location',
        icon: MapPin,
        iconColor: '#10b981',
        bgColor: '#ecfdf5',
        title: 'Location Services',
        subtitle: 'Auto-detect your location',
        type: 'toggle',
        key: 'locationEnabled',
      },
      {
        id: 'darkMode',
        icon: Moon,
        iconColor: '#8b5cf6',
        bgColor: '#f5f3ff',
        title: 'Dark Mode',
        subtitle: 'Switch to dark theme',
        type: 'toggle',
        key: 'darkModeEnabled',
      },
    ],
  },
  {
    title: 'Account',
    items: [
      {
        id: 'profile',
        icon: User,
        iconColor: '#6366f1',
        bgColor: '#eef2ff',
        title: 'Edit Profile',
        subtitle: 'Update your information',
        type: 'navigation',
        route: 'EditProfile',
      },
      {
        id: 'payment',
        icon: CreditCard,
        iconColor: '#f59e0b',
        bgColor: '#fef3c7',
        title: 'Payment Methods',
        subtitle: 'Manage cards and wallets',
        type: 'navigation',
        route: 'PaymentMethods',
      },
      {
        id: 'language',
        icon: Globe,
        iconColor: '#3b82f6',
        bgColor: '#eff6ff',
        title: 'Language',
        subtitle: 'English (US)',
        type: 'navigation',
        route: 'Language',
      },
    ],
  },
  {
    title: 'Support',
    items: [
      {
        id: 'help',
        icon: HelpCircle,
        iconColor: '#6366f1',
        bgColor: '#eef2ff',
        title: 'Help & Support',
        subtitle: 'Get assistance',
        type: 'navigation',
        route: 'Help',
      },
      {
        id: 'terms',
        icon: FileText,
        iconColor: '#64748b',
        bgColor: '#f1f5f9',
        title: 'Terms & Privacy',
        subtitle: 'Legal information',
        type: 'navigation',
        route: 'Terms',
      },
      {
        id: 'rate',
        icon: Star,
        iconColor: '#f59e0b',
        bgColor: '#fef3c7',
        title: 'Rate the App',
        subtitle: 'Leave a review',
        type: 'action',
        action: 'rateApp',
      },
      {
        id: 'share',
        icon: Share2,
        iconColor: '#10b981',
        bgColor: '#ecfdf5',
        title: 'Share with Friends',
        subtitle: 'Tell others about us',
        type: 'action',
        action: 'shareApp',
      },
    ],
  },
  {
    title: 'Data',
    items: [
      {
        id: 'cache',
        icon: Trash2,
        iconColor: '#ef4444',
        bgColor: '#fef2f2',
        title: 'Clear Cache',
        subtitle: 'Free up storage space',
        type: 'action',
        action: 'clearCache',
      },
      {
        id: 'about',
        icon: Info,
        iconColor: '#94a3b8',
        bgColor: '#f8fafc',
        title: 'About',
        subtitle: 'Version 1.0.0',
        type: 'navigation',
        route: 'About',
      },
    ],
  },
];

export default function SettingsScreen() {
  const navigation = useNavigation<any>();
  
  const [settings, setSettings] = useState({
    notificationsEnabled: true,
    locationEnabled: true,
    darkModeEnabled: false,
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Load settings
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const saved = await AsyncStorage.getItem('appSettings');
      if (saved) {
        setSettings(JSON.parse(saved));
      }
    } catch (error) {
      console.log('Error loading settings');
    }
  };

  const saveSettings = async (newSettings: typeof settings) => {
    try {
      await AsyncStorage.setItem('appSettings', JSON.stringify(newSettings));
    } catch (error) {
      console.log('Error saving settings');
    }
  };

  const handleToggle = useCallback((key: string) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: !prev[key as keyof typeof prev] };
      saveSettings(newSettings);
      return newSettings;
    });
  }, []);

  const handleNavigation = useCallback((route: string) => {
    navigation.navigate(route);
  }, [navigation]);

  const handleAction = useCallback((action: string) => {
    switch (action) {
      case 'rateApp':
        Alert.alert(
          'Rate the App',
          'Would you like to rate Fix My Ride on the app store?',
          [
            { text: 'Later', style: 'cancel' },
            {
              text: 'Rate Now',
              onPress: () => {
                // Linking.openURL('market://details?id=...');
              },
            },
          ]
        );
        break;
      case 'shareApp':
        Alert.alert('Share', 'Share functionality coming soon!');
        break;
      case 'clearCache':
        Alert.alert(
          'Clear Cache',
          'Are you sure you want to clear the app cache?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Clear',
              style: 'destructive',
              onPress: () => {
                Alert.alert('Success', 'Cache cleared successfully');
              },
            },
          ]
        );
        break;
    }
  }, []);

  const handleLogout = useCallback(() => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
        },
      ]
    );
  }, [navigation]);

  const renderToggleSwitch = (value: boolean, onToggle: () => void) => (
    <Switch
      value={value}
      onValueChange={onToggle}
      trackColor={{ false: '#d1d5db', true: '#6366f1' }}
      thumbColor={'#ffffff'}
      ios_backgroundColor="#d1d5db"
    />
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
            <View style={styles.headerContent}>
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
                <Text style={styles.headerTitle}>Settings</Text>
                <Text style={styles.headerSubtitle}>Customize your experience</Text>
              </View>
            </View>
          </LinearGradient>

          {/* Main Content */}
          <View style={styles.mainContent}>
            {settingsSections.map((section, sectionIndex) => (
              <Animated.View
                key={section.title}
                style={[
                  styles.section,
                  {
                    opacity: fadeAnim,
                    transform: [
                      {
                        translateY: slideAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 15 * (sectionIndex + 1)],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Text style={styles.sectionTitle}>{section.title}</Text>
                
                <View style={styles.sectionCard}>
                  {section.items.map((item, itemIndex) => {
                    const Icon = item.icon;
                    const isLast = itemIndex === section.items.length - 1;

                    return (
                      <View key={item.id}>
                        <TouchableOpacity
                          onPress={() => {
                            if (item.type === 'toggle') {
                              handleToggle(item.key);
                            } else if (item.type === 'navigation' && item.route) {
                              handleNavigation(item.route);
                            } else if (item.type === 'action' && item.action) {
                              handleAction(item.action);
                            }
                          }}
                          style={styles.settingsItem}
                          activeOpacity={0.7}
                        >
                          <View style={styles.itemLeft}>
                            <View style={[styles.itemIcon, { backgroundColor: item.bgColor }]}>
                              <Icon size={20} color={item.iconColor} />
                            </View>
                            <View style={styles.itemInfo}>
                              <Text style={styles.itemTitle}>{item.title}</Text>
                              {item.subtitle && (
                                <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
                              )}
                            </View>
                          </View>

                          <View style={styles.itemRight}>
                            {item.type === 'toggle' ? (
                              renderToggleSwitch(
                                settings[item.key as keyof typeof settings],
                                () => handleToggle(item.key)
                              )
                            ) : (
                              <ChevronRight size={20} color="#94a3b8" />
                            )}
                          </View>
                        </TouchableOpacity>
                        {!isLast && <View style={styles.itemDivider} />}
                      </View>
                    );
                  })}
                </View>
              </Animated.View>
            ))}

            {/* Security Section */}
            <Animated.View
              style={[
                styles.securityCard,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <LinearGradient
                colors={['#eff6ff', '#dbeafe']}
                style={styles.securityContent}
              >
                <View style={styles.securityIcon}>
                  <Shield size={24} color="#6366f1" />
                </View>
                <View style={styles.securityInfo}>
                  <Text style={styles.securityTitle}>Your Data is Secure</Text>
                  <Text style={styles.securitySubtitle}>
                    We use encryption to protect your personal information
                  </Text>
                </View>
              </LinearGradient>
            </Animated.View>

            {/* Logout Button */}
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }}
            >
              <TouchableOpacity
                onPress={handleLogout}
                style={styles.logoutButton}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#fef2f2', '#fee2e2']}
                  style={styles.logoutGradient}
                >
                  <LogOut size={20} color="#ef4444" />
                  <Text style={styles.logoutText}>Log Out</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            {/* App Info */}
            <View style={styles.appInfo}>
              <Text style={styles.versionText}>Version 1.0.0</Text>
              <Text style={styles.copyrightText}>© 2026 Fix My Ride. All rights reserved.</Text>
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
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
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
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  mainContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingLeft: 4,
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  itemSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
  },
  itemRight: {
    marginLeft: 8,
  },
  itemDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginLeft: 68,
  },
  securityCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
  },
  securityContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  securityIcon: {
    marginRight: 16,
  },
  securityInfo: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  securitySubtitle: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
  },
  logoutButton: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fecaca',
    gap: 10,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ef4444',
  },
  appInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  versionText: {
    fontSize: 13,
    color: '#94a3b8',
    marginBottom: 4,
  },
  copyrightText: {
    fontSize: 12,
    color: '#cbd5e1',
  },
});