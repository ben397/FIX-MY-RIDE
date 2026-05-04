import { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
  StatusBar,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  MapPin,
  Users,
  DollarSign,
  ChevronRight,
  Shield,
  Zap,
  Heart,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    icon: MapPin,
    title: 'Stranded on the road?',
    subtitle: 'Get help instantly',
    description:
      'Our mechanics are ready to assist you wherever you are, 24/7. Never feel stranded again.',
    gradient: ['#6366f1', '#8b5cf6'],
    bgColor: '#eef2ff',
    features: ['24/7 Availability', 'GPS Location', 'Fast Response'],
  },
  {
    id: '2',
    icon: Users,
    title: 'Find nearby mechanics',
    subtitle: 'In seconds',
    description:
      'We connect you with verified professionals closest to your location for quick assistance.',
    gradient: ['#f59e0b', '#d97706'],
    bgColor: '#fef3c7',
    features: ['Verified Mechanics', 'Real-time Tracking', 'Rating System'],
  },
  {
    id: '3',
    icon: DollarSign,
    title: 'Transparent pricing',
    subtitle: 'Fast repairs',
    description:
      'See costs upfront and pay securely through the app. No hidden fees, no surprises.',
    gradient: ['#10b981', '#059669'],
    bgColor: '#d1fae5',
    features: ['Upfront Pricing', 'Secure Payment', 'Digital Receipts'],
  },
];

export default function OnboardingScreen() {
  const navigation = useNavigation<any>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animations
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
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Rotation animation for icon
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();
  }, [currentSlide]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handleNext = useCallback(async () => {
    if (currentSlide < slides.length - 1) {
      const nextSlide = currentSlide + 1;
      setCurrentSlide(nextSlide);
      flatListRef.current?.scrollToIndex({
        index: nextSlide,
        animated: true,
      });
      
      // Reset animations for new slide
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Mark onboarding as completed
      await AsyncStorage.setItem('onboardingCompleted', 'true');
      navigation.replace('Login');
    }
  }, [currentSlide, navigation]);

  const handleSkip = useCallback(async () => {
    await AsyncStorage.setItem('onboardingCompleted', 'true');
    navigation.replace('Login');
  }, [navigation]);

  const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentSlide(viewableItems[0].index);
    }
  }, []);

  const renderSlide = ({ item, index }: { item: typeof slides[0]; index: number }) => {
    const Icon = item.icon;
    const isActive = index === currentSlide;

    return (
      <View style={styles.slideContainer}>
        {/* Icon Container with Gradient Background */}
        <Animated.View
          style={[
            styles.iconWrapper,
            {
              opacity: isActive ? fadeAnim : 0.3,
              transform: [
                { scale: isActive ? scaleAnim : 0.7 },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={item.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconContainer}
          >
            <View style={styles.iconInner}>
              <Icon size={64} color="#ffffff" strokeWidth={1.5} />
            </View>
          </LinearGradient>
          
          {/* Decorative Elements */}
          <Animated.View
            style={[
              styles.decorativeRing,
              { transform: [{ rotate }] },
            ]}
          />
          <View style={styles.decorativeDot1} />
          <View style={styles.decorativeDot2} />
          <View style={styles.decorativeDot3} />
        </Animated.View>

        {/* Content */}
        <Animated.View
          style={[
            styles.contentContainer,
            {
              opacity: isActive ? fadeAnim : 0,
              transform: [
                {
                  translateY: isActive ? slideAnim : 30,
                },
              ],
            },
          ]}
        >
          <Text style={styles.title}>{item.title}</Text>
          <View style={styles.subtitleContainer}>
            <LinearGradient
              colors={item.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.subtitleGradient}
            >
              <Text style={styles.subtitle}>{item.subtitle}</Text>
            </LinearGradient>
          </View>
          <Text style={styles.description}>{item.description}</Text>

          {/* Features List */}
          <View style={styles.featuresContainer}>
            {item.features.map((feature, idx) => (
              <Animated.View
                key={idx}
                style={[
                  styles.featureItem,
                  {
                    opacity: isActive ? fadeAnim : 0,
                    transform: [
                      {
                        translateX: isActive
                          ? slideAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [20 * (idx + 1), 0],
                            })
                          : 20,
                      },
                    ],
                  },
                ]}
              >
                <LinearGradient
                  colors={item.gradient}
                  style={styles.featureDot}
                >
                  <Shield size={10} color="#ffffff" />
                </LinearGradient>
                <Text style={styles.featureText}>{feature}</Text>
              </Animated.View>
            ))}
          </View>
        </Animated.View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.container}>
        {/* Skip Button */}
        {currentSlide < slides.length - 1 && (
          <TouchableOpacity
            onPress={handleSkip}
            style={styles.skipButton}
            activeOpacity={0.7}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}

        {/* Slides */}
        <FlatList
          ref={flatListRef}
          data={slides}
          renderItem={renderSlide}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
          keyExtractor={(item) => item.id}
          bounces={false}
        />

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          {/* Pagination Dots */}
          <View style={styles.paginationContainer}>
            {slides.map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setCurrentSlide(index);
                  flatListRef.current?.scrollToIndex({ index, animated: true });
                }}
                style={[
                  styles.paginationDot,
                  index === currentSlide && styles.paginationDotActive,
                ]}
              >
                {index === currentSlide && (
                  <LinearGradient
                    colors={slides[currentSlide].gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.activeDotGradient}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Navigation Buttons */}
          <View style={styles.buttonContainer}>
            {currentSlide < slides.length - 1 ? (
              <>
                <TouchableOpacity
                  onPress={handleSkip}
                  style={styles.secondaryButton}
                  activeOpacity={0.8}
                >
                  <Text style={styles.secondaryButtonText}>Skip</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleNext}
                  style={styles.primaryButton}
                  activeOpacity={0.9}
                >
                  <LinearGradient
                    colors={slides[currentSlide].gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.primaryButtonGradient}
                  >
                    <Text style={styles.primaryButtonText}>Next</Text>
                    <ChevronRight size={20} color="#ffffff" />
                  </LinearGradient>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                onPress={handleNext}
                style={styles.getStartedButton}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={slides[currentSlide].gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.getStartedGradient}
                >
                  <Zap size={22} color="#ffffff" />
                  <Text style={styles.getStartedText}>Get Started</Text>
                  <ChevronRight size={22} color="#ffffff" />
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  skipButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 10 : 20,
    right: 20,
    zIndex: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f1f5f9',
    borderRadius: 20,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  slideContainer: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  iconWrapper: {
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    transform: [{ rotate: '-5deg' }],
  },
  iconInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  decorativeRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#6366f1',
    opacity: 0.1,
  },
  decorativeDot1: {
    position: 'absolute',
    top: -20,
    right: -10,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#f59e0b',
    opacity: 0.6,
  },
  decorativeDot2: {
    position: 'absolute',
    bottom: -15,
    left: -15,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#6366f1',
    opacity: 0.4,
  },
  decorativeDot3: {
    position: 'absolute',
    top: 20,
    left: -25,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
    opacity: 0.5,
  },
  contentContainer: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
    lineHeight: 38,
  },
  subtitleContainer: {
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  subtitleGradient: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 10,
  },
  featuresContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    width: '80%',
    gap: 10,
  },
  featureDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
    paddingTop: 20,
  },
  paginationDot: {
    height: 4,
    borderRadius: 2,
    backgroundColor: '#e2e8f0',
    overflow: 'hidden',
  },
  paginationDotActive: {
    width: 32,
    height: 4,
    borderRadius: 2,
  },
  activeDotGradient: {
    flex: 1,
    borderRadius: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#64748b',
  },
  primaryButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 4,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  getStartedButton: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  getStartedGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  getStartedText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.3,
  },
});