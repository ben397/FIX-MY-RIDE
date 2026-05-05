import { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
  Animated,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  ChevronLeft,
  Send,
  Phone,
  Video,
  MapPin,
  Clock,
  Image,
  Mic,
  Smile,
  MoreVertical,
  Check,
  CheckCheck,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';

const quickReplies = [
  { id: '1', text: "I'm here" },
  { id: '2', text: 'Running late' },
  { id: '3', text: 'Call me' },
  { id: '4', text: 'Okay, thanks!' },
  { id: '5', text: 'Take your time' },
];

const initialMessages = [
  {
    id: '1',
    sender: 'mechanic',
    text: "Hi! I'm on my way to your location. I should be there shortly.",
    time: '2:30 PM',
    status: 'read',
  },
  {
    id: '2',
    sender: 'user',
    text: 'Great! How long will it take?',
    time: '2:31 PM',
    status: 'read',
  },
  {
    id: '3',
    sender: 'mechanic',
    text: "About 5 minutes. I'll be there soon! Is there anything specific I should know about the issue?",
    time: '2:31 PM',
    status: 'read',
  },
  {
    id: '4',
    sender: 'user',
    text: 'The car won\'t start. Battery might be dead.',
    time: '2:32 PM',
    status: 'delivered',
  },
];

export default function ChatScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { mechanicId } = route.params || {};

  const [messages, setMessages] = useState(initialMessages);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const flatListRef = useRef<FlatList>(null);
  const typingDotAnim = useRef(new Animated.Value(0)).current;

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

    // Typing indicator animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(typingDotAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(typingDotAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const handleSend = useCallback(() => {
    if (inputText.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        sender: 'user',
        text: inputText.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'sent',
      };

      setMessages(prev => [...prev, newMessage]);
      setInputText('');
      setShowQuickReplies(false);

      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);

      // Simulate mechanic response
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          const mechanicReply = {
            id: (Date.now() + 1).toString(),
            sender: 'mechanic',
            text: "Thanks for letting me know! I'll check the battery first.",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'sent',
          };
          setMessages(prev => [...prev, mechanicReply]);
          setIsTyping(false);
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 2000);
      }, 500);
    }
  }, [inputText]);

  const handleQuickReply = useCallback((text: string) => {
    setInputText(text);
    // Auto-send after selecting quick reply
    setTimeout(() => {
      const newMessage = {
        id: Date.now().toString(),
        sender: 'user',
        text: text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'sent',
      };
      setMessages(prev => [...prev, newMessage]);
      setInputText('');
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 300);
  }, []);

  const handleCall = useCallback(() => {
    Alert.alert(
      'Call Mechanic',
      'Start a voice call with Mike Johnson?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => {} },
      ]
    );
  }, []);

  const handleVideoCall = useCallback(() => {
    Alert.alert(
      'Video Call',
      'Start a video call with Mike Johnson?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Start', onPress: () => {} },
      ]
    );
  }, []);

  const renderMessage = ({ item, index }: { item: typeof initialMessages[0]; index: number }) => {
    const isUser = item.sender === 'user';
    const showAvatar = !isUser && (index === 0 || messages[index - 1]?.sender !== 'mechanic');

    return (
      <Animated.View
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.mechanicMessageContainer,
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          },
        ]}
      >
        {!isUser && showAvatar && (
          <View style={styles.messageAvatar}>
            <LinearGradient
              colors={['#6366f1', '#8b5cf6']}
              style={styles.avatarGradient}
            >
              <Text style={styles.avatarText}>MJ</Text>
            </LinearGradient>
          </View>
        )}

        {!isUser && !showAvatar && <View style={styles.messageAvatarPlaceholder} />}

        <View style={[
          styles.messageBubble,
          isUser ? styles.userBubble : styles.mechanicBubble,
        ]}>
          <Text style={[
            styles.messageText,
            isUser ? styles.userMessageText : styles.mechanicMessageText,
          ]}>
            {item.text}
          </Text>
          <View style={styles.messageFooter}>
            <Text style={[
              styles.messageTime,
              isUser ? styles.userMessageTime : styles.mechanicMessageTime,
            ]}>
              {item.time}
            </Text>
            {isUser && (
              item.status === 'read' ? (
                <CheckCheck size={14} color="#94a3b8" />
              ) : (
                <Check size={14} color="#94a3b8" />
              )
            )}
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderTypingIndicator = () => {
    if (!isTyping) return null;

    return (
      <View style={styles.typingContainer}>
        <View style={styles.messageAvatar}>
          <LinearGradient
            colors={['#6366f1', '#8b5cf6']}
            style={styles.avatarGradient}
          >
            <Text style={styles.avatarText}>MJ</Text>
          </LinearGradient>
        </View>
        <View style={styles.typingBubble}>
          <View style={styles.typingDots}>
            {[0, 1, 2].map((dot) => (
              <Animated.View
                key={dot}
                style={[
                  styles.typingDot,
                  {
                    opacity: typingDotAnim.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0.3, 1, 0.3],
                    }),
                    transform: [
                      {
                        scale: typingDotAnim.interpolate({
                          inputRange: [0, 0.5, 1],
                          outputRange: [0.8, 1.2, 0.8],
                        }),
                      },
                    ],
                  },
                ]}
              />
            ))}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1e3a8a" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
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

            <TouchableOpacity style={styles.userInfo}>
              <View style={styles.headerAvatar}>
                <LinearGradient
                  colors={['#818cf8', '#6366f1']}
                  style={styles.headerAvatarGradient}
                >
                  <Text style={styles.headerAvatarText}>MJ</Text>
                </LinearGradient>
                <View style={styles.onlineDot} />
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>Mike Johnson</Text>
                <View style={styles.statusRow}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>Online</Text>
                </View>
              </View>
            </TouchableOpacity>

            <View style={styles.headerActions}>
              <TouchableOpacity
                onPress={handleCall}
                style={styles.headerActionButton}
              >
                <Phone size={20} color="#ffffff" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleVideoCall}
                style={styles.headerActionButton}
              >
                <Video size={20} color="#ffffff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerActionButton}>
                <MoreVertical size={20} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Location Banner */}
          <View style={styles.locationBanner}>
            <BlurView intensity={20} tint="light" style={styles.locationContent}>
              <MapPin size={14} color="#fbbf24" />
              <Text style={styles.locationText}>Mechanic is 5 minutes away</Text>
              <Clock size={14} color="#fbbf24" />
            </BlurView>
          </View>
        </LinearGradient>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
          ListFooterComponent={renderTypingIndicator}
          showsVerticalScrollIndicator={false}
        />

        {/* Quick Replies */}
        {showQuickReplies && (
          <Animated.View style={[styles.quickRepliesContainer, { opacity: fadeAnim }]}>
            <FlatList
              horizontal
              data={quickReplies}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickRepliesList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleQuickReply(item.text)}
                  style={styles.quickReplyButton}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={['#eff6ff', '#dbeafe']}
                    style={styles.quickReplyGradient}
                  >
                    <Text style={styles.quickReplyText}>{item.text}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
            />
          </Animated.View>
        )}

        {/* Input Bar */}
        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <TouchableOpacity style={styles.attachButton}>
              <Image size={22} color="#6366f1" />
            </TouchableOpacity>

            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Type a message..."
                placeholderTextColor="#94a3b8"
                value={inputText}
                onChangeText={(text) => {
                  setInputText(text);
                  if (text.length > 0) setShowQuickReplies(false);
                }}
                multiline
                maxLength={500}
              />
              <TouchableOpacity style={styles.emojiButton}>
                <Smile size={20} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            {inputText.trim() ? (
              <TouchableOpacity
                onPress={handleSend}
                style={styles.sendButton}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#6366f1', '#8b5cf6']}
                  style={styles.sendButtonGradient}
                >
                  <Send size={18} color="#ffffff" />
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.micButton}>
                <Mic size={22} color="#6366f1" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
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
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    paddingBottom: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backButton: {
    borderRadius: 14,
    overflow: 'hidden',
    marginRight: 12,
  },
  backButtonBlur: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    position: 'relative',
    marginRight: 10,
  },
  headerAvatarGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981',
  },
  statusText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
    marginLeft: 8,
  },
  headerActionButton: {
    width: 36,
    height: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationBanner: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  locationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    gap: 6,
  },
  locationText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexGrow: 1,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '80%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
  },
  mechanicMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageAvatar: {
    marginRight: 8,
    alignSelf: 'flex-end',
  },
  messageAvatarPlaceholder: {
    width: 32,
    marginRight: 8,
  },
  avatarGradient: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 20,
    maxWidth: '100%',
  },
  userBubble: {
    backgroundColor: '#6366f1',
    borderBottomRightRadius: 4,
  },
  mechanicBubble: {
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#ffffff',
  },
  mechanicMessageText: {
    color: '#1e293b',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
    gap: 4,
  },
  messageTime: {
    fontSize: 11,
  },
  userMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  mechanicMessageTime: {
    color: '#94a3b8',
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
    paddingLeft: 16,
  },
  typingBubble: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  typingDots: {
    flexDirection: 'row',
    gap: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6366f1',
  },
  quickRepliesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  quickRepliesList: {
    gap: 8,
  },
  quickReplyButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  quickReplyGradient: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  quickReplyText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6366f1',
  },
  inputContainer: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  attachButton: {
    width: 42,
    height: 42,
    backgroundColor: '#f1f5f9',
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f8fafc',
    borderRadius: 21,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 16,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#1e293b',
    paddingVertical: 10,
    maxHeight: 100,
    paddingRight: 8,
  },
  emojiButton: {
    paddingBottom: 10,
    paddingLeft: 4,
  },
  sendButton: {
    borderRadius: 21,
    overflow: 'hidden',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  sendButtonGradient: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micButton: {
    width: 42,
    height: 42,
    backgroundColor: '#f1f5f9',
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
});