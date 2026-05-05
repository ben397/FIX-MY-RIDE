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
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  CheckCircle,
  Wrench,
  Package,
  CreditCard,
  Wallet,
  Smartphone,
  Shield,
  ChevronRight,
  Star,
  Clock,
  User,
  DollarSign,
  Lock,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const paymentMethods = [
  {
    id: 'card',
    title: 'Credit Card',
    subtitle: '•••• 4242',
    icon: CreditCard,
    gradient: ['#6366f1', '#8b5cf6'],
    isDefault: true,
  },
  {
    id: 'mpesa',
    title: 'M-Pesa',
    subtitle: 'Mobile payment',
    icon: Smartphone,
    gradient: ['#10b981', '#059669'],
    isDefault: false,
  },
  {
    id: 'wallet',
    title: 'Wallet',
    subtitle: 'Balance: $250.00',
    icon: Wallet,
    gradient: ['#f59e0b', '#d97706'],
    isDefault: false,
  },
];

const serviceDetails = {
  labor: {
    title: 'Labor & Diagnostics',
    description: 'Engine inspection and repair',
    amount: '$85.00',
  },
  parts: {
    title: 'Parts & Materials',
    description: 'Spark plugs replacement',
    amount: '$45.00',
  },
  subtotal: '$130.00',
  platformFee: '$6.50',
  total: '$136.50',
};

export default function ServiceCompletionScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { mechanicId } = route.params || {};

  const [selectedPayment, setSelectedPayment] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const checkScale = useRef(new Animated.Value(0)).current;
  const payButtonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entrance animations
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

    // Checkmark animation
    Animated.spring(checkScale, {
      toValue: 1,
      delay: 300,
      friction: 4,
      tension: 40,
      useNativeDriver: false,
    }).start();
  }, []);

  const handlePayment = useCallback(() => {
    setIsProcessing(true);
    
    // Payment processing animation
    Animated.sequence([
      Animated.timing(payButtonScale, {
        toValue: 0.95,
        duration: 150,
        useNativeDriver: false,
      }),
      Animated.timing(payButtonScale, {
        toValue: 1,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start();

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      Alert.alert(
        'Payment Successful',
        'Your payment has been processed successfully!',
        [
          {
            text: 'View Receipt',
            onPress: () => navigation.navigate('Receipt', { mechanicId }),
          },
        ]
      );
    }, 2000);
  }, [navigation, mechanicId]);

  const handleAddPaymentMethod = useCallback(() => {
    navigation.navigate('PaymentMethods');
  }, [navigation]);

  const handleSecurityInfo = useCallback(() => {
    Alert.alert(
      'Secure Payment',
      'Your payment is protected with 256-bit SSL encryption. Your financial data is never stored on our servers.',
    );
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#059669" />
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Success Header */}
          <LinearGradient
            colors={['#059669', '#10b981', '#34d399']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            <Animated.View style={{ transform: [{ scale: checkScale }] }}>
              <View style={styles.checkCircle}>
                <CheckCircle size={48} color="#ffffff" />
              </View>
            </Animated.View>
            
            <Text style={styles.headerTitle}>Service Complete!</Text>
            <Text style={styles.headerSubtitle}>
              Your vehicle has been repaired successfully
            </Text>

            {/* Mechanic Mini Card */}
            <View style={styles.mechanicMiniCard}>
              <LinearGradient
                colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                style={styles.mechanicMiniContent}
              >
                <View style={styles.mechanicMiniAvatar}>
                  <LinearGradient
                    colors={['#6366f1', '#8b5cf6']}
                    style={styles.miniAvatarGradient}
                  >
                    <User size={20} color="#ffffff" />
                  </LinearGradient>
                  <View style={styles.onlineDot} />
                </View>
                <View style={styles.mechanicMiniInfo}>
                  <Text style={styles.mechanicMiniName}>Mike Johnson</Text>
                  <View style={styles.mechanicMiniRating}>
                    <Star size={12} color="#fbbf24" fill="#fbbf24" />
                    <Text style={styles.mechanicMiniRatingText}>4.9</Text>
                  </View>
                </View>
                <Shield size={20} color="#ffffff" />
              </LinearGradient>
            </View>
          </LinearGradient>

          {/* Main Content */}
          <View style={styles.mainContent}>
            {/* Service Breakdown */}
            <Animated.View
              style={[
                styles.serviceCard,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <View style={styles.serviceHeader}>
                <Wrench size={20} color="#6366f1" />
                <Text style={styles.serviceTitle}>Service Breakdown</Text>
              </View>

              {/* Labor */}
              <View style={styles.serviceItem}>
                <View style={styles.serviceItemHeader}>
                  <View style={[styles.serviceIcon, { backgroundColor: '#eff6ff' }]}>
                    <Wrench size={20} color="#6366f1" />
                  </View>
                  <View style={styles.serviceItemInfo}>
                    <Text style={styles.serviceItemTitle}>
                      {serviceDetails.labor.title}
                    </Text>
                    <Text style={styles.serviceItemDescription}>
                      {serviceDetails.labor.description}
                    </Text>
                  </View>
                  <Text style={styles.serviceItemAmount}>
                    {serviceDetails.labor.amount}
                  </Text>
                </View>
              </View>

              {/* Parts */}
              <View style={styles.serviceItem}>
                <View style={styles.serviceItemHeader}>
                  <View style={[styles.serviceIcon, { backgroundColor: '#fef3c7' }]}>
                    <Package size={20} color="#f59e0b" />
                  </View>
                  <View style={styles.serviceItemInfo}>
                    <Text style={styles.serviceItemTitle}>
                      {serviceDetails.parts.title}
                    </Text>
                    <Text style={styles.serviceItemDescription}>
                      {serviceDetails.parts.description}
                    </Text>
                  </View>
                  <Text style={styles.serviceItemAmount}>
                    {serviceDetails.parts.amount}
                  </Text>
                </View>
              </View>

              {/* Totals */}
              <View style={styles.totalsContainer}>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Subtotal</Text>
                  <Text style={styles.totalValue}>{serviceDetails.subtotal}</Text>
                </View>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Platform Fee (5%)</Text>
                  <Text style={styles.totalValue}>{serviceDetails.platformFee}</Text>
                </View>
                <View style={styles.totalDivider} />
                <View style={styles.grandTotalRow}>
                  <Text style={styles.grandTotalLabel}>Total Amount</Text>
                  <View style={styles.grandTotalValue}>
                    <LinearGradient
                      colors={['#059669', '#10b981']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.grandTotalBadge}
                    >
                      <DollarSign size={16} color="#ffffff" />
                      <Text style={styles.grandTotalText}>
                        {serviceDetails.total}
                      </Text>
                    </LinearGradient>
                  </View>
                </View>
              </View>
            </Animated.View>

            {/* Payment Methods */}
            <Animated.View
              style={[
                styles.paymentCard,
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
              <View style={styles.paymentHeader}>
                <CreditCard size={20} color="#6366f1" />
                <Text style={styles.paymentTitle}>Payment Method</Text>
                <TouchableOpacity onPress={handleAddPaymentMethod}>
                  <Text style={styles.addPaymentText}>+ Add</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.paymentMethods}>
                {paymentMethods.map((method, index) => {
                  const Icon = method.icon;
                  const isSelected = selectedPayment === method.id;

                  return (
                    <TouchableOpacity
                      key={method.id}
                      onPress={() => setSelectedPayment(method.id)}
                      activeOpacity={0.8}
                      style={[
                        styles.paymentMethod,
                        isSelected && styles.paymentMethodSelected,
                      ]}
                    >
                      <LinearGradient
                        colors={method.gradient}
                        style={styles.paymentIcon}
                      >
                        <Icon size={22} color="#ffffff" />
                      </LinearGradient>
                      <View style={styles.paymentInfo}>
                        <Text style={styles.paymentMethodTitle}>
                          {method.title}
                        </Text>
                        <Text style={styles.paymentMethodSubtitle}>
                          {method.subtitle}
                        </Text>
                      </View>
                      <View style={[
                        styles.radioButton,
                        isSelected && styles.radioButtonSelected,
                      ]}>
                        {isSelected && <View style={styles.radioDot} />}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </Animated.View>

            {/* Security Note */}
            <TouchableOpacity
              onPress={handleSecurityInfo}
              style={styles.securityNote}
              activeOpacity={0.8}
            >
              <View style={styles.securityContent}>
                <Lock size={14} color="#10b981" />
                <Text style={styles.securityText}>
                  Your payment is secure and encrypted
                </Text>
              </View>
            </TouchableOpacity>

            {/* Pay Button */}
            <Animated.View style={{ transform: [{ scale: payButtonScale }] }}>
              <TouchableOpacity
                onPress={handlePayment}
                activeOpacity={0.9}
                style={styles.payButtonContainer}
                disabled={isProcessing}
              >
                <LinearGradient
                  colors={isProcessing ? ['#94a3b8', '#64748b'] : ['#059669', '#10b981']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.payButton}
                >
                  {isProcessing ? (
                    <>
                      <Clock size={22} color="#ffffff" />
                      <Text style={styles.payButtonText}>Processing...</Text>
                    </>
                  ) : (
                    <>
                      <Lock size={22} color="#ffffff" />
                      <Text style={styles.payButtonText}>
                        Pay {serviceDetails.total}
                      </Text>
                      <ChevronRight size={22} color="#ffffff" />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            {/* Additional Info */}
            <Text style={styles.additionalInfo}>
              By completing this payment, you agree to our Terms of Service and Privacy Policy
            </Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#059669',
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
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 20 : 30,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
  },
  checkCircle: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 24,
  },
  mechanicMiniCard: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  mechanicMiniContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  mechanicMiniAvatar: {
    position: 'relative',
    marginRight: 12,
  },
  miniAvatarGradient: {
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
  mechanicMiniInfo: {
    flex: 1,
  },
  mechanicMiniName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 2,
  },
  mechanicMiniRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  mechanicMiniRatingText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fbbf24',
  },
  mainContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  serviceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  serviceItem: {
    marginBottom: 16,
  },
  serviceItemHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  serviceIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceItemInfo: {
    flex: 1,
  },
  serviceItemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  serviceItemDescription: {
    fontSize: 12,
    color: '#94a3b8',
  },
  serviceItemAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 4,
  },
  totalsContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  totalLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  totalDivider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 12,
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  grandTotalValue: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  grandTotalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 4,
  },
  grandTotalText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
  },
  paymentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    flex: 1,
  },
  addPaymentText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366f1',
  },
  paymentMethods: {
    gap: 10,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  paymentMethodSelected: {
    borderColor: '#6366f1',
    backgroundColor: '#eff6ff',
  },
  paymentIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentMethodTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  paymentMethodSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: '#6366f1',
    backgroundColor: '#6366f1',
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff',
  },
  securityNote: {
    marginBottom: 20,
  },
  securityContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  securityText: {
    fontSize: 13,
    color: '#10b981',
    fontWeight: '600',
  },
  payButtonContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 10,
  },
  payButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.3,
  },
  additionalInfo: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 20,
  },
});