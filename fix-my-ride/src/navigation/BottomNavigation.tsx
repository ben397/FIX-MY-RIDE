import { useRouter, usePathname } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Home, MapPin, Clock, User } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  withTiming, 
  useSharedValue,
  withSequence,
  withDelay
} from 'react-native-reanimated';

const tabs = [
  { id: 'home', label: 'Home', icon: Home, path: '/home' },
  { id: 'requests', label: 'Requests', icon: MapPin, path: '/requests' },
  { id: 'history', label: 'History', icon: Clock, path: '/history' },
  { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
];

const { width } = Dimensions.get('window');

export default function BottomTabNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const scale = useSharedValue(1);

  const handlePress = (path: string) => {
    scale.value = withSequence(
      withSpring(0.9, { damping: 12 }),
      withSpring(1, { damping: 12 })
    );
    setTimeout(() => router.push(path), 100);
  };

  return (
    <BlurView intensity={90} tint="light" style={styles.container}>
      <View style={styles.innerContainer}>
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.path;

          const animatedStyle = useAnimatedStyle(() => ({
            transform: [{ scale: isActive ? withSpring(1.1, { damping: 12 }) : withSpring(1) }],
          }));

          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => handlePress(tab.path)}
              activeOpacity={0.7}
              style={styles.tabItem}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={`${tab.label} tab`}
            >
              <Animated.View style={[styles.tabContent, animatedStyle]}>
                {/* Active indicator line */}
                {isActive && (
                  <View style={styles.activeLine} />
                )}
                
                {/* Icon container with gradient background when active */}
                {isActive ? (
                  <LinearGradient
                    colors={['#6366f1', '#8b5cf6']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.activeIconContainer}
                  >
                    <Icon
                      size={22}
                      color="#ffffff"
                      strokeWidth={2.5}
                    />
                  </LinearGradient>
                ) : (
                  <View style={styles.inactiveIconContainer}>
                    <Icon
                      size={22}
                      color="#9ca3af"
                      strokeWidth={2}
                    />
                  </View>
                )}
                
                {/* Label with active state */}
                <Text
                  style={[
                    styles.label,
                    isActive && styles.activeLabel,
                  ]}
                  numberOfLines={1}
                >
                  {tab.label}
                </Text>

                {/* Active indicator dot */}
                {isActive && (
                  <View style={styles.activeDot} />
                )}
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 30, // Adjust for iPhone home indicator
    paddingHorizontal: 10,
    height: 75,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    minWidth: 60,
  },
  activeIconContainer: {
    padding: 10,
    borderRadius: 16,
    backgroundColor: 'transparent',
    shadowColor: '#6366f1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 2,
  },
  inactiveIconContainer: {
    padding: 10,
    borderRadius: 16,
    backgroundColor: 'transparent',
    marginBottom: 2,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    color: '#9ca3af',
    marginTop: 2,
    letterSpacing: 0.3,
  },
  activeLabel: {
    color: '#6366f1',
    fontWeight: '600',
  },
  activeLine: {
    position: 'absolute',
    top: -8,
    width: 20,
    height: 3,
    backgroundColor: '#6366f1',
    borderRadius: 2,
  },
  activeDot: {
    position: 'absolute',
    bottom: -6,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#6366f1',
  },
});