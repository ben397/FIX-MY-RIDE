import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
  StatusBar,
  RefreshControl,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  CheckCircle,
  XCircle,
  ChevronRight,
  Filter,
  Search,
  Calendar,
  DollarSign,
  Star,
  Clock,
  Download,
  RefreshCw,
  TrendingUp,
  TrendingDown,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';

type FilterType = 'all' | 'completed' | 'cancelled';

const historyData = [
  {
    id: '1',
    date: 'May 4, 2026',
    time: '2:30 PM',
    serviceType: 'Engine Problem',
    mechanicName: 'Mike Johnson',
    amount: '$136.50',
    status: 'completed',
    rating: 5,
  },
  {
    id: '2',
    date: 'Apr 28, 2026',
    time: '11:15 AM',
    serviceType: 'Tire Puncture',
    mechanicName: 'Sarah Williams',
    amount: '$75.00',
    status: 'completed',
    rating: 4,
  },
  {
    id: '3',
    date: 'Apr 22, 2026',
    time: '4:45 PM',
    serviceType: 'Battery Jump',
    mechanicName: 'David Chen',
    amount: '$0.00',
    status: 'cancelled',
    rating: null,
  },
  {
    id: '4',
    date: 'Apr 15, 2026',
    time: '9:00 AM',
    serviceType: 'Fuel Delivery',
    mechanicName: 'Alex Martinez',
    amount: '$45.00',
    status: 'completed',
    rating: 5,
  },
];

export default function HistoryScreen() {
  const navigation = useNavigation<any>();
  const [filter, setFilter] = useState<FilterType>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const filterScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
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

  const stats = useMemo(() => {
    const completed = historyData.filter(item => item.status === 'completed');
    const totalSpent = completed.reduce((sum, item) => {
      const amount = parseFloat(item.amount.replace('$', ''));
      return sum + amount;
    }, 0);
    
    return {
      totalServices: historyData.length,
      completedServices: completed.length,
      cancelledServices: historyData.filter(item => item.status === 'cancelled').length,
      totalSpent,
    };
  }, []);

  const filteredHistory = useMemo(() => {
    if (filter === 'all') return historyData;
    return historyData.filter(item => item.status === filter);
  }, [filter]);

  const handleFilterChange = useCallback((newFilter: FilterType) => {
    // Animate filter button press
    Animated.sequence([
      Animated.spring(filterScale, {
        toValue: 0.9,
        useNativeDriver: false,
      }),
      Animated.spring(filterScale, {
        toValue: 1,
        useNativeDriver: false,
      }),
    ]).start();
    
    setFilter(newFilter);
  }, []);

  const handleItemPress = useCallback((id: string) => {
    setSelectedItem(id);
    navigation.navigate('Receipt', { serviceId: id });
  }, [navigation]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  }, []);

  const handleDownloadHistory = useCallback(() => {
    Alert.alert(
      'Download History',
      'Would you like to download your service history as a PDF?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Download', onPress: () => Alert.alert('Success', 'History downloaded!') },
      ]
    );
  }, []);

  const EmptyState = () => (
    <Animated.View
      style={[
        styles.emptyState,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.emptyIconContainer}>
        <LinearGradient
          colors={['#f1f5f9', '#e2e8f0']}
          style={styles.emptyIcon}
        >
          <XCircle size={48} color="#94a3b8" />
        </LinearGradient>
      </View>
      <Text style={styles.emptyTitle}>
        {filter === 'all' ? 'No Services Yet' : `No ${filter} services`}
      </Text>
      <Text style={styles.emptyText}>
        {filter === 'all'
          ? "You haven't used any services yet"
          : `You don't have any ${filter} services`}
      </Text>
      {filter !== 'all' && (
        <TouchableOpacity
          onPress={() => handleFilterChange('all')}
          style={styles.resetButton}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#6366f1', '#8b5cf6']}
            style={styles.resetGradient}
          >
            <RefreshCw size={16} color="#ffffff" />
            <Text style={styles.resetText}>Show All</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1e3a8a" />
      <View style={styles.container}>
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor="#6366f1"
              colors={['#6366f1']}
            />
          }
        >
          {/* Header */}
          <LinearGradient
            colors={['#1e3a8a', '#3b82f6', '#60a5fa']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            <View style={styles.headerTop}>
              <Text style={styles.headerTitle}>Service History</Text>
              <TouchableOpacity
                onPress={handleDownloadHistory}
                style={styles.downloadButton}
              >
                <Download size={20} color="#ffffff" />
              </TouchableOpacity>
            </View>

            {/* Summary Cards */}
            <View style={styles.summaryCards}>
              <View style={styles.summaryCard}>
                <BlurView intensity={20} tint="light" style={styles.summaryContent}>
                  <Calendar size={16} color="#ffffff" />
                  <Text style={styles.summaryNumber}>{stats.totalServices}</Text>
                  <Text style={styles.summaryLabel}>Total</Text>
                </BlurView>
              </View>
              
              <View style={styles.summaryCard}>
                <BlurView intensity={20} tint="light" style={styles.summaryContent}>
                  <CheckCircle size={16} color="#ffffff" />
                  <Text style={styles.summaryNumber}>{stats.completedServices}</Text>
                  <Text style={styles.summaryLabel}>Done</Text>
                </BlurView>
              </View>
              
              <View style={styles.summaryCard}>
                <BlurView intensity={20} tint="light" style={styles.summaryContent}>
                  <DollarSign size={16} color="#ffffff" />
                  <Text style={styles.summaryNumber}>${stats.totalSpent}</Text>
                  <Text style={styles.summaryLabel}>Spent</Text>
                </BlurView>
              </View>
            </View>
          </LinearGradient>

          {/* Main Content */}
          <View style={styles.mainContent}>
            {/* Filter Section */}
            <View style={styles.filterSection}>
              <Filter size={18} color="#64748b" />
              <Animated.View style={[styles.filterButtons, { transform: [{ scale: filterScale }] }]}>
                {(['all', 'completed', 'cancelled'] as FilterType[]).map((type) => (
                  <TouchableOpacity
                    key={type}
                    onPress={() => handleFilterChange(type)}
                    style={[
                      styles.filterButton,
                      filter === type && styles.filterButtonActive,
                    ]}
                    activeOpacity={0.8}
                  >
                    {filter === type ? (
                      <LinearGradient
                        colors={
                          type === 'completed' ? ['#10b981', '#059669'] :
                          type === 'cancelled' ? ['#ef4444', '#dc2626'] :
                          ['#6366f1', '#8b5cf6']
                        }
                        style={styles.activeFilter}
                      >
                        <Text style={styles.activeFilterText}>
                          {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
                        </Text>
                      </LinearGradient>
                    ) : (
                      <Text style={styles.filterButtonText}>
                        {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
                      </Text>
                    )}
                  </TouchableOpacity>
                ))}
              </Animated.View>
            </View>

            {/* History List */}
            {filteredHistory.length > 0 ? (
              filteredHistory.map((item, index) => (
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
                    onPress={() => handleItemPress(item.id)}
                    style={styles.historyCard}
                    activeOpacity={0.8}
                  >
                    {/* Status Stripe */}
                    <View style={[
                      styles.statusStripe,
                      { backgroundColor: item.status === 'completed' ? '#10b981' : '#ef4444' }
                    ]} />
                    
                    <View style={styles.historyContent}>
                      {/* Header */}
                      <View style={styles.historyHeader}>
                        <View style={styles.serviceInfo}>
                          <Text style={styles.serviceType}>{item.serviceType}</Text>
                          <View style={styles.statusBadge}>
                            {item.status === 'completed' ? (
                              <CheckCircle size={14} color="#10b981" />
                            ) : (
                              <XCircle size={14} color="#ef4444" />
                            )}
                            <Text style={[
                              styles.statusText,
                              { color: item.status === 'completed' ? '#10b981' : '#ef4444' }
                            ]}>
                              {item.status === 'completed' ? 'Completed' : 'Cancelled'}
                            </Text>
                          </View>
                        </View>
                        <ChevronRight size={18} color="#94a3b8" />
                      </View>

                      {/* Details */}
                      <View style={styles.detailsRow}>
                        <View style={styles.detail}>
                          <Calendar size={12} color="#94a3b8" />
                          <Text style={styles.detailText}>{item.date}</Text>
                        </View>
                        <View style={styles.detail}>
                          <Clock size={12} color="#94a3b8" />
                          <Text style={styles.detailText}>{item.time}</Text>
                        </View>
                      </View>

                      {/* Mechanic */}
                      <View style={styles.mechanicRow}>
                        <Text style={styles.mechanicName}>{item.mechanicName}</Text>
                        {item.rating && (
                          <View style={styles.ratingBadge}>
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={10}
                                color={i < (item.rating || 0) ? '#f59e0b' : '#d1d5db'}
                                fill={i < (item.rating || 0) ? '#f59e0b' : 'none'}
                              />
                            ))}
                          </View>
                        )}
                      </View>

                      {/* Amount */}
                      <View style={styles.amountRow}>
                        <Text style={styles.amountLabel}>Amount</Text>
                        <Text style={[
                          styles.amountValue,
                          { color: item.status === 'completed' ? '#10b981' : '#ef4444' }
                        ]}>
                          {item.amount}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              ))
            ) : (
              <EmptyState />
            )}
          </View>
        </Animated.ScrollView>
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
    paddingBottom: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  downloadButton: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCards: {
    flexDirection: 'row',
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  summaryContent: {
    padding: 14,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  summaryNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 4,
    marginBottom: 2,
  },
  summaryLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  mainContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  filterSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
  },
  filterButton: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
  },
  filterButtonActive: {
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  activeFilter: {
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 14,
  },
  activeFilterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
    backgroundColor: '#f1f5f9',
    paddingVertical: 10,
    textAlign: 'center',
    borderRadius: 14,
    overflow: 'hidden',
  },
  historyCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    marginBottom: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  statusStripe: {
    width: 3,
  },
  historyContent: {
    flex: 1,
    padding: 16,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  serviceInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  serviceType: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  detailsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  mechanicRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  mechanicName: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  ratingBadge: {
    flexDirection: 'row',
    gap: 2,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  amountLabel: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  amountValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIconContainer: {
    marginBottom: 20,
  },
  emptyIcon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 20,
    textAlign: 'center',
  },
  resetButton: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  resetGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  resetText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
});