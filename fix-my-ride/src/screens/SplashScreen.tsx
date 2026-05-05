import { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Wrench, Car, Zap, Shield } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const navigation = useNavigation<any>();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim1 = useRef(new Animated.Value(1)).current;
  const pulseAnim2 = useRef(new Animated.Value(1)).current;
  const pulseAnim3 = useRef(new Animated.Value(1)).current;
  const dotsOpacity = useRef(new Animated.Value(0)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animation sequence
    Animated.sequence([
      // Fade in and scale up the logo
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: false,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: false,
        }),
      ]),
      // Slide up the text
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: false,
      }),
      // Show dots
      Animated.timing(dotsOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: false,
      }),
    ]).start();

    // Continuous rotation for wrench
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: false,
        }),
      ])
    ).start();

    // Pulsing dots animation
    const createPulse = (anim: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.sequence([
            Animated.timing(anim, {
              toValue: 0.3,
              duration: 600,
              useNativeDriver: false,
            }),
            Animated.timing(anim, {
              toValue: 1,
              duration: 600,
              useNativeDriver: false,
            }),
          ]),
        ])
      );
    };

    createPulse(pulseAnim1, 0).start();
    createPulse(pulseAnim2, 200).start();
    createPulse(pulseAnim3, 400).start();

    // Progress bar animation
    Animated.timing(progressWidth, {
      toValue: 1,
      duration: 2500,
      useNativeDriver: false,
    }).start();

    // Navigate after delay
    const timer = setTimeout(async () => {
      const onboardingCompleted = await AsyncStorage.getItem('onboardingCompleted');
      
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start(() => {
        if (onboardingCompleted) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Onboarding' }],
          });
        }
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '30deg'],
  });

  const progressBarWidth = progressWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e3a8a" />
      <LinearGradient
        colors={['#1e3a8a', '#1e40af', '#1e3a8a']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}
      >
        {/* Decorative Background Elements */}
        <View style={styles.bgCircle1} />
        <View style={styles.bgCircle2} />
        <View style={styles.bgCircle3} />

        {/* Main Content */}
        <View style={styles.content}>
          {/* Logo Section */}
          <Animated.View
            style={[
              styles.logoContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            {/* Glow Effect */}
            <View style={styles.glowContainer}>
              <LinearGradient
                colors={['rgba(99, 102, 241, 0.3)', 'rgba(139, 92, 246, 0.1)']}
                style={styles.glow}
              />
            </View>

            {/* Icon Row */}
            <View style={styles.iconRow}>
              {/* Car Icon */}
              <View style={[styles.iconWrapper, styles.carIconWrapper]}>
                <LinearGradient
                  colors={['#6366f1', '#8b5cf6']}
                  style={styles.iconGradient}
                >
                  <Car size={48} color="#ffffff" strokeWidth={2} />
                </LinearGradient>
              </View>

              {/* Animated Wrench */}
              <Animated.View
                style={[
                  styles.iconWrapper,
                  styles.wrenchIconWrapper,
                  { transform: [{ rotate }] },
                ]}
              >
                <LinearGradient
                  colors={['#f59e0b', '#d97706']}
                  style={styles.iconGradient}
                >
                  <Wrench size={42} color="#ffffff" strokeWidth={2.5} />
                </LinearGradient>
              </Animated.View>

              {/* Shield Icon */}
              <View style={[styles.iconWrapper, styles.shieldIconWrapper]}>
                <LinearGradient
                  colors={['#10b981', '#059669']}
                  style={styles.iconGradient}
                >
                  <Shield size={38} color="#ffffff" strokeWidth={2} />
                </LinearGradient>
              </View>
            </View>
          </Animated.View>

          {/* Text Section */}
          <Animated.View
            style={[
              styles.textContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideUpAnim }],
              },
            ]}
          >
            <Text style={styles.appName}>Fix My Ride</Text>
            <View style={styles.taglineContainer}>
              <LinearGradient
                colors={['#818cf8', '#a78bfa']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.taglineGradient}
              >
                <Zap size={16} color="#ffffff" />
                <Text style={styles.tagline}>Roadside Assistance</Text>
              </LinearGradient>
            </View>
            <Text style={styles.description}>
              Help on the road, anytime, anywhere
            </Text>
          </Animated.View>

          {/* Loading Indicator */}
          <Animated.View
            style={[
              styles.loadingContainer,
              { opacity: dotsOpacity },
            ]}
          >
            {/* Progress Bar */}
            <View style={styles.progressBar}>
              <Animated.View style={[styles.progressFill, { width: progressBarWidth }]}>
                <LinearGradient
                  colors={['#6366f1', '#8b5cf6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.progressGradient}
                />
              </Animated.View>
            </View>

            {/* Animated Dots */}
            <View style={styles.dotsContainer}>
              <Animated.View
                style={[styles.dot, { opacity: pulseAnim1 }]}
              />
              <Animated.View
                style={[styles.dot, { opacity: pulseAnim2 }]}
              />
              <Animated.View
                style={[styles.dot, { opacity: pulseAnim3 }]}
              />
            </View>
          </Animated.View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Version 1.0.0</Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e3a8a',
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  bgCircle1: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
  },
  bgCircle2: {
    position: 'absolute',
    bottom: '20%',
    left: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
  },
  bgCircle3: {
    position: 'absolute',
    top: '30%',
    right: '10%',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  logoContainer: {
    marginBottom: 40,
    position: 'relative',
  },
  glowContainer: {
    position: 'absolute',
    top: -50,
    left: -50,
    right: -50,
    bottom: -50,
  },
  glow: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  iconWrapper: {
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  carIconWrapper: {
    transform: [{ translateY: -10 }],
  },
  wrenchIconWrapper: {
    transform: [{ translateY: 10 }],
    zIndex: 2,
  },
  shieldIconWrapper: {
    transform: [{ translateY: -5 }],
  },
  iconGradient: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  appName: {
    fontSize: 42,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 12,
    letterSpacing: -0.5,
    textShadowColor: 'rgba(99, 102, 241, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  taglineContainer: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  taglineGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    gap: 6,
  },
  tagline: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 280,
  },
  loadingContainer: {
    alignItems: 'center',
    width: '80%',
  },
  progressBar: {
    width: '100%',
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 1.5,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    borderRadius: 1.5,
  },
  progressGradient: {
    flex: 1,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff',
  },
  footer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 40 : 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '500',
  },
});