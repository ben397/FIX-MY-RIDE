import { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Phone, Globe } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useState(() => {
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
  });

  const handleLogin = () => {
    // Add phone number validation here
    if (phoneNumber.length >= 10) {
      router.push('/home');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Top Decorative Element */}
          <LinearGradient
            colors={['#6366f1', '#8b5cf6', '#a78bfa']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.topGradient}
          >
            <View style={styles.gradientContent}>
              <Text style={styles.welcomeText}>Welcome Back! 👋</Text>
              <Text style={styles.subtitleText}>
                Sign in to continue your journey
              </Text>
            </View>
          </LinearGradient>

          <Animated.View
            style={[
              styles.formContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Phone Input Card */}
            <View style={styles.card}>
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Phone Number</Text>
                <View
                  style={[
                    styles.inputContainer,
                    isFocused && styles.inputFocused,
                  ]}
                >
                  <View style={styles.iconContainer}>
                    <Phone size={20} color={isFocused ? '#6366f1' : '#94a3b8'} />
                  </View>
                  <View style={styles.countryCode}>
                    <Text style={styles.countryCodeText}>+1</Text>
                  </View>
                  <TextInput
                    style={styles.input}
                    value={phoneNumber}
                    onChangeText={(text) => {
                      // Format phone number
                      const cleaned = text.replace(/\D/g, '');
                      let formatted = cleaned;
                      if (cleaned.length > 3 && cleaned.length <= 6) {
                        formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
                      } else if (cleaned.length > 6) {
                        formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
                      }
                      setPhoneNumber(formatted);
                    }}
                    placeholder="(555) 000-0000"
                    placeholderTextColor="#94a3b8"
                    keyboardType="phone-pad"
                    maxLength={14}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    selectionColor="#6366f1"
                  />
                </View>
                <View style={styles.inputHint}>
                  <Text style={styles.hintText}>
                    We'll send you a verification code
                  </Text>
                </View>
              </View>

              {/* Send OTP Button */}
              <TouchableOpacity
                onPress={handleLogin}
                activeOpacity={0.8}
                style={styles.buttonContainer}
              >
                <LinearGradient
                  colors={
                    phoneNumber.length >= 10
                      ? ['#6366f1', '#8b5cf6']
                      : ['#cbd5e1', '#94a3b8']
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientButton}
                >
                  <Text style={styles.buttonText}>Send OTP</Text>
                  <View style={styles.buttonArrow}>
                    <Text style={styles.arrowText}>→</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <View style={styles.dividerTextContainer}>
                  <Text style={styles.dividerText}>or continue with</Text>
                </View>
                <View style={styles.dividerLine} />
              </View>

              {/* Social Buttons */}
              <View style={styles.socialButtons}>
                <TouchableOpacity
                  style={styles.socialButton}
                  activeOpacity={0.7}
                >
                  <BlurView intensity={20} tint="light" style={styles.blurButton}>
                    <Globe size={22} color="#4285f4" />
                    <Text style={styles.socialButtonText}>Google</Text>
                  </BlurView>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.socialButton}
                  activeOpacity={0.7}
                >
                  <BlurView intensity={20} tint="light" style={styles.blurButton}>
                    <View style={styles.appleIcon}>
                      <Text style={styles.appleText}></Text>
                    </View>
                    <Text style={styles.socialButtonText}>Apple</Text>
                  </BlurView>
                </TouchableOpacity>
              </View>
            </View>

            {/* Terms and Privacy */}
            <View style={styles.termsContainer}>
              <Text style={styles.termsText}>
                By continuing, you agree to our{' '}
                <Text style={styles.termsLink}>Terms</Text> &{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  scrollContent: {
    flexGrow: 1,
  },
  topGradient: {
    height: height * 0.35,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    shadowColor: '#6366f1',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  gradientContent: {
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitleText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '400',
    letterSpacing: 0.3,
  },
  formContainer: {
    flex: 1,
    marginTop: -40,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  inputWrapper: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  inputFocused: {
    borderColor: '#6366f1',
    backgroundColor: '#ffffff',
    shadowColor: '#6366f1',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  countryCode: {
    paddingRight: 8,
    borderRightWidth: 1,
    borderRightColor: '#e2e8f0',
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },
  inputHint: {
    marginTop: 8,
    paddingHorizontal: 4,
  },
  hintText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '400',
  },
  buttonContainer: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#6366f1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  buttonArrow: {
    marginLeft: 8,
  },
  arrowText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '300',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  dividerTextContainer: {
    paddingHorizontal: 16,
  },
  dividerText: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },
  socialButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  blurButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  socialButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
  },
  appleIcon: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appleText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
  },
  termsContainer: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  termsText: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: '#6366f1',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});