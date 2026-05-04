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
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  ChevronLeft,
  CheckCircle,
  Clock,
  AlertCircle,
  MapPin,
  Bell,
  BellOff,
  Star,
  Wrench,
  CreditCard,
  Navigation,
  User,
  Shield,
  Trash2,
  MoreVertical,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
type GradientPair = [string, string];

const notifications: Array<{
  id: string;
  type: string;
  icon: any;
  iconColor: string;
  gradientColors: GradientPair;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  action: string | null;
  actionRoute?: string;
  mechanicName?: string;
}> = [
  {
    id: '1',
    type: 'success',
    icon: CheckCircle,
    iconColor: '#10b981',
    gradientColors: ['#ecfdf5', '#d1fae5'],
    title: 'Service Completed',
    message: 'Mike Johnson has completed your service. Rate your experience!',
    time: '2 hours ago',
    isRead: false,
    action: 'Rate Service',
    actionRoute: 'RateService',
    mechanicName: 'Mike Johnson',
  },
  {
    id: '2',
    type: 'info',
    icon: Navigation,
    iconColor: '#6366f1',
    gradientColors: ['#eef2ff', '#e0e7ff'],
    title: 'Mechanic En Route',
    message: 'Mike is on the way to your location. ETA: 5 minutes',
    time: '3 hours ago',
    isRead: false,
    action: 'Track Live',
    actionRoute: 'LiveTracking',
    mechanicName: 'Mike Johnson',
  },
  {
    id: '3',
    type: 'info',
    icon: User,
    iconColor: '#3b82f6',
    gradientColors: ['#eff6ff', '#dbeafe'],
    title: 'Mechanic Accepted',
    message: 'Mike Johnson accepted your engine repair request',
    time: '3 hours ago',
    isRead: true,
    action: null,
  },
  {
    id: '4',
    type: 'warning',
    icon: CreditCard,
    iconColor: '#f59e0b',
    gradientColors: ['#fffbeb', '#fef3c7'],
    title: 'Payment Reminder',
    message: 'Complete payment of $136.50 for your last engine repair service',
    time: '1 day ago',
    isRead: true,
    action: 'Pay Now',
    actionRoute: 'PaymentMethods',
  },
  {
    id: '5',
    type: 'success',
    icon: Star,
    iconColor: '#10b981',
    gradientColors: ['#ecfdf5', '#d1fae5'],
    title: 'Service Completed',
    message: 'Sarah Williams completed your tire repair. Great job!',
    time: '6 days ago',
    isRead: true,
    action: 'View Receipt',
    actionRoute: 'Receipt',
    mechanicName: 'Sarah Williams',
  },
  {
    id: '6',
    type: 'promo',
    icon: Wrench,
    iconColor: '#8b5cf6',
    gradientColors: ['#f5f3ff', '#ede9fe'],
    title: 'Special Offer! 🎉',
    message: 'Get 20% off on your next brake service. Limited time offer!',
    time: '1 week ago',
    isRead: true,
    action: 'Claim Offer',
    actionRoute: 'Promotions',
  },
];

export default function NotificationsScreen() {
  const navigation = useNavigation<any>();
  const [notificationList, setNotificationList] = useState(notifications);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unread'>('all');
  
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
  }, []);

  const unreadCount = notificationList.filter(n => !n.isRead).length;

  const markAllAsRead = useCallback(() => {
    setNotificationList(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotificationList(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotificationList(prev =>
      prev.filter(notification => notification.id !== id)
    );
  }, []);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  }, []);

  const filteredNotifications = selectedFilter === 'unread'
    ? notificationList.filter(n => !n.isRead)
    : notificationList;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <Shield size={16} color="#10b981" />;
      case 'warning':
        return <AlertCircle size={16} color="#f59e0b" />;
      case 'promo':
        return <Star size={16} color="#8b5cf6" />;
      default:
        return <Bell size={16} color="#6366f1" />;
    }
  };

  const renderNotification = (notification: typeof notifications[0], index: number) => {
    const Icon = notification.icon;
    
    return (
      <Animated.View
        key={notification.id}
        style={[
          styles.notificationCard,
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 15 * (index + 1)],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => markAsRead(notification.id)}
          activeOpacity={0.9}
          style={[
            styles.notificationTouchable,
            !notification.isRead && styles.unreadNotification,
          ]}
        >
          <LinearGradient
            colors={notification.gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.notificationGradient}
          >
            {/* Unread Indicator */}
            {!notification.isRead && (
              <View style={styles.unreadDot} />
            )}

            <View style={styles.notificationContent}>
              {/* Icon */}
              <View style={styles.iconContainer}>
                <LinearGradient
                  colors={notification.gradientColors}
                  style={styles.iconGradient}
                >
                  <Icon size={24} color={notification.iconColor} />
                </LinearGradient>
                {getNotificationIcon(notification.type)}
              </View>

              {/* Content */}
              <View style={styles.notificationInfo}>
                <View style={styles.notificationHeader}>
                  <Text style={styles.notificationTitle} numberOfLines={1}>
                    {notification.title}
                  </Text>
                  <TouchableOpacity
                    onPress={() => deleteNotification(notification.id)}
                    style={styles.deleteButton}
                  >
                    <Trash2 size={16} color="#94a3b8" />
                  </TouchableOpacity>
                </View>
                
                <Text style={styles.notificationMessage} numberOfLines={2}>
                  {notification.message}
                </Text>
                
                <View style={styles.notificationFooter}>
                  <View style={styles.timeContainer}>
                    <Clock size={12} color="#94a3b8" />
                    <Text style={styles.timeText}>{notification.time}</Text>
                  </View>
                  
                  {notification.action && (
                    <TouchableOpacity
                      onPress={() => {
                        markAsRead(notification.id);
                        if (notification.actionRoute) {
                          navigation.navigate(notification.actionRoute as never);
                        }
                      }}
                      style={styles.actionButton}
                    >
                      <Text style={styles.actionButtonText}>
                        {notification.action}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* More Options */}
              <TouchableOpacity style={styles.moreButton}>
                <MoreVertical size={16} color="#94a3b8" />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1e3a8a" />
      <View style={styles.container}>
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
              <Text style={styles.headerTitle}>Notifications</Text>
              {unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadCount}>{unreadCount} new</Text>
                </View>
              )}
            </View>
          </View>

          {/* Quick Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <BlurView intensity={20} tint="light" style={styles.statContent}>
                <Bell size={20} color="#ffffff" />
                <Text style={styles.statNumber}>{notificationList.length}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </BlurView>
            </View>
            
            <View style={styles.statItem}>
              <BlurView intensity={20} tint="light" style={styles.statContent}>
                <CheckCircle size={20} color="#ffffff" />
                <Text style={styles.statNumber}>
                  {notificationList.filter(n => n.isRead).length}
                </Text>
                <Text style={styles.statLabel}>Read</Text>
              </BlurView>
            </View>
            
            <View style={styles.statItem}>
              <BlurView intensity={20} tint="light" style={styles.statContent}>
                <AlertCircle size={20} color="#ffffff" />
                <Text style={styles.statNumber}>{unreadCount}</Text>
                <Text style={styles.statLabel}>Unread</Text>
              </BlurView>
            </View>
          </View>
        </LinearGradient>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Filter and Actions */}
          <View style={styles.actionsBar}>
            <View style={styles.filterButtons}>
              <TouchableOpacity
                onPress={() => setSelectedFilter('all')}
                style={[
                  styles.filterButton,
                  selectedFilter === 'all' && styles.activeFilter,
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    selectedFilter === 'all' && styles.activeFilterText,
                  ]}
                >
                  All
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => setSelectedFilter('unread')}
                style={[
                  styles.filterButton,
                  selectedFilter === 'unread' && styles.activeFilter,
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    selectedFilter === 'unread' && styles.activeFilterText,
                  ]}
                >
                  Unread
                </Text>
                {unreadCount > 0 && (
                  <View style={styles.filterBadge}>
                    <Text style={styles.filterBadgeText}>{unreadCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {unreadCount > 0 && (
              <TouchableOpacity
                onPress={markAllAsRead}
                style={styles.markAllButton}
              >
                <CheckCircle size={16} color="#6366f1" />
                <Text style={styles.markAllText}>Mark all read</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Notifications List */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                tintColor="#6366f1"
                colors={['#6366f1']}
              />
            }
          >
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification, index) =>
                renderNotification(notification, index)
              )
            ) : (
              <Animated.View
                style={[
                  styles.emptyState,
                  {
                    opacity: fadeAnim,
                    transform: [{ scale: fadeAnim }],
                  },
                ]}
              >
                <View style={styles.emptyIconContainer}>
                  <LinearGradient
                    colors={['#f1f5f9', '#e2e8f0']}
                    style={styles.emptyIcon}
                  >
                    {selectedFilter === 'unread' ? (
                      <BellOff size={48} color="#94a3b8" />
                    ) : (
                      <Bell size={48} color="#94a3b8" />
                    )}
                  </LinearGradient>
                </View>
                <Text style={styles.emptyTitle}>
                  {selectedFilter === 'unread'
                    ? 'No Unread Notifications'
                    : 'All Caught Up! 🎉'}
                </Text>
                <Text style={styles.emptyText}>
                  {selectedFilter === 'unread'
                    ? "You've read all your notifications"
                    : 'You have no new notifications at the moment'}
                </Text>
              </Animated.View>
            )}
          </ScrollView>
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  unreadBadge: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  unreadCount: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statItem: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  statContent: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  mainContent: {
    flex: 1,
    paddingTop: 24,
  },
  actionsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    gap: 6,
  },
  activeFilter: {
    backgroundColor: '#6366f1',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  activeFilterText: {
    color: '#ffffff',
  },
  filterBadge: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  filterBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffff',
  },
  markAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  markAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366f1',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  notificationCard: {
    marginBottom: 12,
  },
  notificationTouchable: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  unreadNotification: {
    borderWidth: 1,
    borderColor: '#6366f1',
  },
  notificationGradient: {
    position: 'relative',
  },
  unreadDot: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6366f1',
    zIndex: 1,
  },
  notificationContent: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  iconContainer: {
    position: 'relative',
  },
  iconGradient: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationInfo: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    flex: 1,
    marginRight: 8,
  },
  deleteButton: {
    padding: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 10,
  },
  notificationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  actionButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  moreButton: {
    padding: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyIconContainer: {
    marginBottom: 24,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
  },
});