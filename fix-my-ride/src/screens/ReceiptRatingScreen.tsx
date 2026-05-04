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
  TextInput,
  Share,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  Star,
  Download,
  Bookmark,
  Home,
  ChevronRight,
  CheckCircle,
  Clock,
  Calendar,
  CreditCard,
  User,
  Wrench,
  Shield,
  Heart,
  ThumbsUp,
  MessageSquare,
  Share2,
  RefreshCw,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

const receiptData = {
  date: 'May 4, 2026',
  time: '2:30 PM',
  transactionId: '#FMR-2026-1847',
  mechanic: {
    name: 'Mike Johnson',
    initials: 'MJ',
    specialty: 'Engine Expert',
    rating: 4.9,
  },
  items: [
    { label: 'Labor & Diagnostics', amount: '$85.00' },
    { label: 'Parts & Materials', amount: '$45.00' },
    { label: 'Platform Fee', amount: '$6.50' },
  ],
  total: '$136.50',
  paymentMethod: '•••• 4242',
};

export default function ReceiptRatingScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { mechanicId, serviceId } = route.params || {};

  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const starAnims = useRef([...Array(5)].map(() => new Animated.Value(0))).current;
  const successScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate stars sequentially
    starAnims.forEach((anim, index) => {
      Animated.spring(anim, {
        toValue: 1,
        delay: index * 100,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }).start();
    });
  }, []);

  const handleRating = useCallback((star: number) => {
    setRating(star);
    
    // Animate selected star
    Animated.sequence([
      Animated.spring(starAnims[star - 1], {
        toValue: 1.3,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.spring(starAnims[star - 1], {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  }, [starAnims]);

  const handleDownloadReceipt = useCallback(async () => {
    try {
      const html = generateReceiptHTML();
      const { uri } = await Print.printToFileAsync({ html });
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert('Success', 'Receipt saved to device');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not download receipt');
    }
  }, []);

  const generateReceiptHTML = () => `
    <html>
      <body style="font-family: 'Helvetica'; padding: 20px;">
        <h1 style="color: #6366f1;">Fix My Ride</h1>
        <h2>Service Receipt</h2>
        <p>Date: ${receiptData.date}</p>
        <p>Transaction: ${receiptData.transactionId}</p>
        <p>Mechanic: ${receiptData.mechanic.name}</p>
        <hr/>
        ${receiptData.items.map(item => 
          `<p>${item.label}: ${item.amount}</p>`
        ).join('')}
        <hr/>
        <h3>Total: ${receiptData.total}</h3>
      </body>
    </html>
  `;

  const handleSaveMechanic = useCallback(() => {
    setIsSaved(!isSaved);
    Animated.spring(successScale, {
      toValue: isSaved ? 0 : 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  }, [isSaved]);

  const handleSubmit = useCallback(() => {
    if (rating === 0) {
      Alert.alert('Rating Required', 'Please rate your experience before submitting');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      navigation.navigate('Home');
    }, 1000);
  }, [rating, navigation]);

  const handleShare = useCallback(async () => {
    try {
      await Share.share({
        message: `I just used Fix My Ride! ${receiptData.mechanic.name} provided excellent service. Rating: ${rating}/5 ⭐`,
      });
    } catch (error) {
      // User cancelled
    }
  }, [rating]);

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
            <View style={styles.successIcon}>
              <CheckCircle size={48} color="#ffffff" />
            </View>
            <Text style={styles.headerTitle}>Payment Successful!</Text>
            <Text style={styles.headerSubtitle}>
              Thank you for using Fix My Ride
            </Text>
            
            {/* Total Amount */}
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total Paid</Text>
              <Text style={styles.totalAmount}>{receiptData.total}</Text>
            </View>
          </LinearGradient>

          {/* Main Content */}
          <View style={styles.mainContent}>
            {/* Receipt Card */}
            <Animated.View
              style={[
                styles.receiptCard,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              {/* Receipt Header */}
              <View style={styles.receiptHeader}>
                <View style={styles.receiptTitleRow}>
                  <CreditCard size={20} color="#6366f1" />
                  <Text style={styles.receiptTitle}>Digital Receipt</Text>
                </View>
                <TouchableOpacity
                  onPress={handleDownloadReceipt}
                  style={styles.downloadButton}
                >
                  <Download size={18} color="#6366f1" />
                  <Text style={styles.downloadText}>Download</Text>
                </TouchableOpacity>
              </View>

              {/* Transaction Info */}
              <View style={styles.transactionInfo}>
                <View style={styles.transactionRow}>
                  <View style={styles.transactionItem}>
                    <Calendar size={14} color="#94a3b8" />
                    <Text style={styles.transactionLabel}>Date</Text>
                  </View>
                  <Text style={styles.transactionValue}>{receiptData.date}</Text>
                </View>
                
                <View style={styles.transactionRow}>
                  <View style={styles.transactionItem}>
                    <Clock size={14} color="#94a3b8" />
                    <Text style={styles.transactionLabel}>Time</Text>
                  </View>
                  <Text style={styles.transactionValue}>{receiptData.time}</Text>
                </View>
                
                <View style={styles.transactionRow}>
                  <View style={styles.transactionItem}>
                    <CreditCard size={14} color="#94a3b8" />
                    <Text style={styles.transactionLabel}>Transaction ID</Text>
                  </View>
                  <Text style={styles.transactionId}>{receiptData.transactionId}</Text>
                </View>
              </View>

              {/* Mechanic Info */}
              <View style={styles.mechanicSection}>
                <Text style={styles.sectionLabel}>Service Provider</Text>
                <View style={styles.mechanicRow}>
                  <View style={styles.mechanicAvatar}>
                    <LinearGradient
                      colors={['#6366f1', '#8b5cf6']}
                      style={styles.avatarGradient}
                    >
                      <Text style={styles.avatarText}>
                        {receiptData.mechanic.initials}
                      </Text>
                    </LinearGradient>
                    <View style={styles.onlineDot} />
                  </View>
                  <View style={styles.mechanicInfo}>
                    <Text style={styles.mechanicName}>
                      {receiptData.mechanic.name}
                    </Text>
                    <View style={styles.specialtyRow}>
                      <Wrench size={12} color="#64748b" />
                      <Text style={styles.specialtyText}>
                        {receiptData.mechanic.specialty}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.mechanicRating}>
                    <Star size={14} color="#f59e0b" fill="#f59e0b" />
                    <Text style={styles.ratingText}>
                      {receiptData.mechanic.rating}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Billing Details */}
              <View style={styles.billingSection}>
                {receiptData.items.map((item, index) => (
                  <View key={index} style={styles.billingRow}>
                    <Text style={styles.billingLabel}>{item.label}</Text>
                    <Text style={styles.billingAmount}>{item.amount}</Text>
                  </View>
                ))}
                
                <View style={styles.billingDivider} />
                
                <View style={styles.totalRow}>
                  <Text style={styles.totalRowLabel}>Total Paid</Text>
                  <View style={styles.totalRowAmount}>
                    <Text style={styles.totalRowValue}>{receiptData.total}</Text>
                    <Text style={styles.paymentMethod}>
                      via {receiptData.paymentMethod}
                    </Text>
                  </View>
                </View>
              </View>
            </Animated.View>

            {/* Rating Section */}
            <Animated.View
              style={[
                styles.ratingCard,
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
              <View style={styles.ratingHeader}>
                <ThumbsUp size={20} color="#6366f1" />
                <Text style={styles.ratingTitle}>Rate Your Experience</Text>
              </View>
              
              <Text style={styles.ratingSubtitle}>
                How was your service with {receiptData.mechanic.name}?
              </Text>

              {/* Star Rating */}
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Animated.View
                    key={star}
                    style={{
                      transform: [{ scale: starAnims[star - 1] }],
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => handleRating(star)}
                      style={styles.starButton}
                      activeOpacity={0.7}
                    >
                      <Star
                        size={40}
                        color={star <= rating ? '#f59e0b' : '#d1d5db'}
                        fill={star <= rating ? '#f59e0b' : 'transparent'}
                      />
                    </TouchableOpacity>
                  </Animated.View>
                ))}
              </View>

              {/* Rating Labels */}
              <View style={styles.ratingLabels}>
                <Text style={styles.ratingLabelText}>
                  {rating === 0 ? 'Tap to rate' :
                   rating === 1 ? 'Poor' :
                   rating === 2 ? 'Fair' :
                   rating === 3 ? 'Good' :
                   rating === 4 ? 'Great' : 'Excellent!'}
                </Text>
              </View>

              {/* Feedback Input */}
              <View style={styles.feedbackContainer}>
                <MessageSquare size={18} color="#94a3b8" style={styles.feedbackIcon} />
                <TextInput
                  style={styles.feedbackInput}
                  placeholder="Share your feedback (optional)"
                  placeholderTextColor="#94a3b8"
                  value={feedback}
                  onChangeText={setFeedback}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
            </Animated.View>

            {/* Action Buttons */}
            <View style={styles.actionsContainer}>
              {/* Save Mechanic Button */}
              <TouchableOpacity
                onPress={handleSaveMechanic}
                style={styles.saveButton}
                activeOpacity={0.8}
              >
                <View style={styles.saveButtonContent}>
                  <Animated.View style={{ transform: [{ scale: successScale }] }}>
                    {isSaved ? (
                      <Heart size={20} color="#ef4444" fill="#ef4444" />
                    ) : (
                      <Bookmark size={20} color="#6366f1" />
                    )}
                  </Animated.View>
                  <Text style={[
                    styles.saveButtonText,
                    isSaved && styles.saveButtonTextActive,
                  ]}>
                    {isSaved ? 'Mechanic Saved!' : 'Save Mechanic'}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Share Button */}
              <TouchableOpacity
                onPress={handleShare}
                style={styles.shareButton}
                activeOpacity={0.8}
              >
                <Share2 size={20} color="#6366f1" />
              </TouchableOpacity>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              style={styles.submitButton}
              activeOpacity={0.9}
              disabled={isSubmitting}
            >
              <LinearGradient
                colors={rating > 0 ? ['#6366f1', '#8b5cf6'] : ['#94a3b8', '#64748b']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.submitButtonGradient}
              >
                <Home size={20} color="#ffffff" />
                <Text style={styles.submitButtonText}>
                  {isSubmitting ? 'Submitting...' : 'Back to Home'}
                </Text>
                <ChevronRight size={20} color="#ffffff" />
              </LinearGradient>
            </TouchableOpacity>

            {/* Support Link */}
            <TouchableOpacity style={styles.supportButton}>
              <Text style={styles.supportText}>
                Need help with this service?{' '}
                <Text style={styles.supportLink}>Contact Support</Text>
              </Text>
            </TouchableOpacity>
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
  successIcon: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 26,
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
  totalContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 20,
  },
  totalLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 36,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -1,
  },
  mainContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  receiptCard: {
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
  receiptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  receiptTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  receiptTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  downloadText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6366f1',
  },
  transactionInfo: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  transactionLabel: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '500',
  },
  transactionValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  transactionId: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6366f1',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  mechanicSection: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  mechanicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  mechanicAvatar: {
    position: 'relative',
  },
  avatarGradient: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  onlineDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
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
  mechanicName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 2,
  },
  specialtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  specialtyText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  mechanicRating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffbeb',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f59e0b',
  },
  billingSection: {
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: '#f1f5f9',
  },
  billingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  billingLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  billingAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  billingDivider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalRowLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  totalRowAmount: {
    alignItems: 'flex-end',
  },
  totalRowValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#059669',
  },
  paymentMethod: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  ratingCard: {
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
  ratingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  ratingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  ratingSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 24,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 8,
  },
  starButton: {
    padding: 4,
  },
  ratingLabels: {
    alignItems: 'center',
    marginBottom: 20,
  },
  ratingLabelText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#6366f1',
  },
  feedbackContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  feedbackIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  feedbackInput: {
    flex: 1,
    fontSize: 14,
    color: '#1e293b',
    minHeight: 70,
    padding: 0,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  saveButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#6366f1',
  },
  saveButtonTextActive: {
    color: '#ef4444',
  },
  shareButton: {
    width: 56,
    height: 56,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButton: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  submitButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 8,
  },
  submitButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#ffffff',
  },
  supportButton: {
    alignItems: 'center',
    marginTop: 8,
  },
  supportText: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
  },
  supportLink: {
    color: '#6366f1',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});