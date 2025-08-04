import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ChatMessage, ChatSession, Agent } from '../types';
import { StorageService } from '../services/StorageService';
import { AIService } from '../services/AIService';
import { colors, spacing, borderRadius, shadows } from '../theme';

interface ChatScreenProps {
  navigation: any;
  route: any;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ navigation, route }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [currentAgent, setCurrentAgent] = useState<Agent | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Initialize AI service
    AIService.initialize();
    
    // Load session from navigation params or create default
    if (route.params?.session && route.params?.agent) {
      setCurrentSession(route.params.session);
      setCurrentAgent(route.params.agent);
      loadMessages(route.params.session.id);
    } else {
      // No session provided, show empty state
      loadDefaultAgent();
    }
  }, [route.params]);

  const loadDefaultAgent = async () => {
    try {
      // For demo, load the first available agent
      const agentsConfig = require('../../config/agents.json');
      if (agentsConfig.agents && agentsConfig.agents.length > 0) {
        const defaultAgent = agentsConfig.agents[0];
        setCurrentAgent(defaultAgent);
      }
    } catch (error) {
      console.error('Error loading default agent:', error);
    }
  };

  const loadMessages = async (sessionId: string) => {
    try {
      const sessionMessages = await StorageService.getMessages(sessionId);
      setMessages(sessionMessages);
      // Scroll to bottom after loading messages
      setTimeout(() => scrollToBottom(), 100);
    } catch (error) {
      console.error('Error loading messages:', error);
      Alert.alert('Error', 'Failed to load messages');
    }
  };

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  const sendMessage = async () => {
    if (!inputText.trim() || !currentAgent || loading) return;

    const userMessage = inputText.trim();
    setInputText('');
    setLoading(true);
    setIsTyping(true);

    try {
      // Create user message
      const newUserMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        session_id: currentSession?.id || 'demo_session',
        role: 'user',
        content: userMessage,
        metadata: {},
        created_at: new Date().toISOString(),
      };

      // Add user message to UI immediately
      const updatedMessages = [...messages, newUserMessage];
      setMessages(updatedMessages);

      // Save user message
      if (currentSession) {
        await StorageService.saveMessage(newUserMessage);
      }

      // Scroll to show user message
      setTimeout(() => scrollToBottom(), 100);

      // Get AI response
      const aiResponse = await AIService.retryMessage(
        currentAgent,
        messages,
        userMessage
      );

      // Create AI message
      const aiMessage: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        session_id: currentSession?.id || 'demo_session',
        role: 'assistant',
        content: aiResponse,
        metadata: { agent_id: currentAgent.id },
        created_at: new Date().toISOString(),
      };

      // Add AI message to UI
      setMessages(prev => [...prev, aiMessage]);

      // Save AI message
      if (currentSession) {
        await StorageService.saveMessage(aiMessage);
      }

      // Scroll to show AI response
      setTimeout(() => scrollToBottom(), 100);

    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert(
        'Failed to send message',
        error instanceof Error ? error.message : 'Please try again'
      );
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };

  const clearChat = async () => {
    Alert.alert(
      'Clear Chat',
      'Are you sure you want to clear this conversation?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              if (currentSession) {
                await StorageService.clearMessages(currentSession.id);
              }
              setMessages([]);
              Alert.alert('Success', 'Chat cleared');
            } catch (error) {
              console.error('Error clearing chat:', error);
              Alert.alert('Error', 'Failed to clear chat');
            }
          }
        }
      ]
    );
  };

  const sendStarterPrompt = (prompt: string) => {
    setInputText(prompt);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getAgentColor = () => {
    if (!currentAgent) return colors.primary;
    
    switch (currentAgent.id) {
      case 'maya-wellness-coach': return colors.wellness;
      case 'alex-productivity-strategist': return colors.productivity;
      case 'zoe-relationship-guide': return colors.relationships;
      case 'sam-financial-advisor': return colors.finance;
      case 'leo-creative-mentor': return colors.creative;
      default: return colors.primary;
    }
  };

  if (!currentAgent) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No agent selected</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={styles.emptyLink}>Choose an agent from Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.agentInfo}>
          <View
            style={[
              styles.agentAvatar,
              { backgroundColor: getAgentColor() + '20' }
            ]}
          >
            <Text style={[styles.agentInitial, { color: getAgentColor() }]}>
              {currentAgent.name.charAt(0)}
            </Text>
          </View>
          <View style={styles.agentDetails}>
            <Text style={styles.agentName}>{currentAgent.name}</Text>
            <Text style={styles.agentRole}>{currentAgent.role}</Text>
          </View>
        </View>
        
        <TouchableOpacity onPress={clearChat} style={styles.menuButton}>
          <Ionicons name="ellipsis-vertical" size={20} color={colors.gray[600]} />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.length === 0 && (
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeTitle}>
              👋 Hi! I'm {currentAgent.name}
            </Text>
            <Text style={styles.welcomeText}>
              {currentAgent.system_prompt.split('.')[0]}.
            </Text>
            
            {currentAgent.starter_prompts && currentAgent.starter_prompts.length > 0 && (
              <View style={styles.starterPrompts}>
                <Text style={styles.starterPromptsTitle}>
                  Try asking me:
                </Text>
                {currentAgent.starter_prompts.map((prompt, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.starterPromptCard,
                      { borderLeftColor: getAgentColor() }
                    ]}
                    onPress={() => sendStarterPrompt(prompt)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.starterPromptText}>
                      "{prompt}"
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

        {messages.map((message) => (
          <View key={message.id} style={styles.messageContainer}>
            <View
              style={[
                styles.messageRow,
                message.role === 'user' ? styles.userMessageRow : styles.assistantMessageRow
              ]}
            >
              {message.role === 'assistant' && (
                <View
                  style={[
                    styles.messageAvatar,
                    { backgroundColor: getAgentColor() + '20' }
                  ]}
                >
                  <Text style={[styles.messageAvatarText, { color: getAgentColor() }]}>
                    {currentAgent.name.charAt(0)}
                  </Text>
                </View>
              )}
              
              <View
                style={[
                  styles.messageBubble,
                  message.role === 'user' ? 
                    { ...styles.userBubble, backgroundColor: getAgentColor() } : 
                    styles.assistantBubble
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    message.role === 'user' ? styles.userMessageText : styles.assistantMessageText
                  ]}
                >
                  {message.content}
                </Text>
                <Text
                  style={[
                    styles.messageTime,
                    message.role === 'user' ? styles.userMessageTime : styles.assistantMessageTime
                  ]}
                >
                  {formatTime(message.created_at)}
                </Text>
              </View>
            </View>
          </View>
        ))}

        {isTyping && (
          <View style={styles.messageContainer}>
            <View style={styles.assistantMessageRow}>
              <View
                style={[
                  styles.messageAvatar,
                  { backgroundColor: getAgentColor() + '20' }
                ]}
              >
                <Text style={[styles.messageAvatarText, { color: getAgentColor() }]}>
                  {currentAgent.name.charAt(0)}
                </Text>
              </View>
              <View style={styles.typingBubble}>
                <View style={styles.typingContainer}>
                  <Text style={styles.typingText}>Thinking</Text>
                  <ActivityIndicator size="small" color={getAgentColor()} />
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder={`Message ${currentAgent.name}...`}
            multiline
            maxLength={1000}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
            blurOnSubmit={false}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              { backgroundColor: getAgentColor() },
              (!inputText.trim() || loading) && styles.sendButtonDisabled
            ]}
            onPress={sendMessage}
            disabled={!inputText.trim() || loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name="send" size={20} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  emptyTitle: {
    fontSize: 18,
    color: colors.gray[600],
    marginBottom: spacing.md,
  },
  emptyLink: {
    color: colors.info,
    textDecorationLine: 'underline',
  },
  header: {
    backgroundColor: colors.white,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shadows.sm,
  },
  agentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  agentAvatar: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  agentInitial: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  agentDetails: {
    flex: 1,
  },
  agentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.gray[800],
  },
  agentRole: {
    fontSize: 14,
    color: colors.gray[600],
  },
  menuButton: {
    padding: spacing.sm,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  welcomeContainer: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.gray[700],
    marginBottom: spacing.md,
  },
  welcomeText: {
    fontSize: 16,
    textAlign: 'center',
    color: colors.gray[600],
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  starterPrompts: {
    width: '100%',
    marginTop: spacing.md,
  },
  starterPromptsTitle: {
    fontSize: 14,
    color: colors.gray[500],
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  starterPromptCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    marginHorizontal: spacing.sm,
    borderLeftWidth: 3,
    ...shadows.sm,
  },
  starterPromptText: {
    fontSize: 14,
    color: colors.gray[700],
  },
  messageContainer: {
    marginBottom: spacing.md,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  userMessageRow: {
    justifyContent: 'flex-end',
  },
  assistantMessageRow: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
    marginBottom: spacing.xs,
  },
  messageAvatarText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: borderRadius.xxl,
    padding: spacing.sm,
  },
  userBubble: {
    borderBottomRightRadius: borderRadius.md,
  },
  assistantBubble: {
    backgroundColor: colors.white,
    borderBottomLeftRadius: borderRadius.md,
    ...shadows.sm,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: colors.white,
  },
  assistantMessageText: {
    color: colors.gray[800],
  },
  messageTime: {
    fontSize: 12,
    marginTop: spacing.xs,
    textAlign: 'right',
  },
  userMessageTime: {
    color: colors.white,
    opacity: 0.8,
  },
  assistantMessageTime: {
    color: colors.gray[500],
  },
  typingBubble: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xxl,
    borderBottomLeftRadius: borderRadius.md,
    padding: spacing.sm,
    ...shadows.sm,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingText: {
    color: colors.gray[600],
    marginRight: spacing.sm,
  },
  inputContainer: {
    backgroundColor: colors.white,
    padding: spacing.md,
    ...shadows.lg,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
    maxHeight: 100,
    marginRight: spacing.sm,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});

export default ChatScreen;