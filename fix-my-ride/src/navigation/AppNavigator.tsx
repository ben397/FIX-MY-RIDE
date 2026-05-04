import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Navigators
import TabNavigator, { TabParamList } from '../navigation/BottomNavigation';

// Screens
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import RequestServiceScreen from '../screens/RequestServiceScreen';
import LiveMatchingScreen from '../screens/LiveMatchingScreen';
import MechanicAcceptanceScreen from '../screens/MechanicAcceptanceScreen';
import LiveTrackingScreen from '../screens/LiveTrackingScreen';
import ServiceCompletionScreen from '../screens/ServiceCompletionScreen';
import ReceiptRatingScreen from '../screens/ReceiptRatingScreen';
import SettingsScreen from '../screens/SettingsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ChatScreen from '../screens/ChatScreen';
import VehicleManagementScreen from '../screens/VehicleManagementScreen';
import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  MainTabs: NavigatorScreenParams<TabParamList> | undefined;
  RequestService: { issueType?: string; isEmergency?: boolean };
  Matching: { issueType?: string; isEmergency?: boolean };
  MechanicAcceptance: { mechanicId?: number; isEmergency?: boolean };
  Tracking: { mechanicId?: number; isEmergency?: boolean };
  Completion: { mechanicId?: number };
  Receipt: { mechanicId?: number; serviceId?: string };
  Settings: undefined;
  Notifications: undefined;
  Chat: { mechanicId?: string };
  VehicleManagement: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={'Splash'}
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: '#f8fafc' },
        }}
      >
        <Stack.Screen 
          name="Splash" 
          component={SplashScreen}
          options={{ animation: 'fade' }}
        />
        <Stack.Screen 
          name="Onboarding" 
          component={OnboardingScreen}
          options={{ animation: 'fade' }}
        />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{ animation: 'fade' }}
        />
        <Stack.Screen 
          name="MainTabs" 
          component={TabNavigator}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen 
          name="RequestService" 
          component={RequestServiceScreen}
          options={{ animation: 'slide_from_bottom' }}
        />
        <Stack.Screen 
          name="Matching" 
          component={LiveMatchingScreen}
          options={{ animation: 'slide_from_bottom' }}
        />
        <Stack.Screen 
          name="MechanicAcceptance" 
          component={MechanicAcceptanceScreen}
        />
        <Stack.Screen 
          name="Tracking" 
          component={LiveTrackingScreen}
          options={{ 
            animation: 'slide_from_bottom',
            gestureEnabled: false,
          }}
        />
        <Stack.Screen 
          name="Completion" 
          component={ServiceCompletionScreen}
          options={{ 
            animation: 'fade',
            gestureEnabled: false,
          }}
        />
        <Stack.Screen name="Receipt" component={ReceiptRatingScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="VehicleManagement" component={VehicleManagementScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}