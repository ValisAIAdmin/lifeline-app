import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChatMessage, ChatSession } from '../types';

const MESSAGES_KEY = 'lifeline_messages';
const SESSIONS_KEY = 'lifeline_sessions';

export class StorageService {
  // Messages
  static async saveMessage(message: ChatMessage): Promise<void> {
    try {
      const existingMessages = await this.getMessages(message.session_id);
      const updatedMessages = [...existingMessages, message];
      await AsyncStorage.setItem(
        `${MESSAGES_KEY}_${message.session_id}`,
        JSON.stringify(updatedMessages)
      );
    } catch (error) {
      console.error('Error saving message:', error);
      throw new Error('Failed to save message');
    }
  }

  static async getMessages(sessionId: string): Promise<ChatMessage[]> {
    try {
      const messagesJson = await AsyncStorage.getItem(`${MESSAGES_KEY}_${sessionId}`);
      return messagesJson ? JSON.parse(messagesJson) : [];
    } catch (error) {
      console.error('Error getting messages:', error);
      return [];
    }
  }

  static async clearMessages(sessionId: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(`${MESSAGES_KEY}_${sessionId}`);
    } catch (error) {
      console.error('Error clearing messages:', error);
      throw new Error('Failed to clear messages');
    }
  }

  // Sessions
  static async saveSession(session: ChatSession): Promise<void> {
    try {
      const existingSessions = await this.getSessions();
      const existingIndex = existingSessions.findIndex(s => s.id === session.id);
      
      if (existingIndex >= 0) {
        existingSessions[existingIndex] = session;
      } else {
        existingSessions.push(session);
      }
      
      await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(existingSessions));
    } catch (error) {
      console.error('Error saving session:', error);
      throw new Error('Failed to save session');
    }
  }

  static async getSessions(): Promise<ChatSession[]> {
    try {
      const sessionsJson = await AsyncStorage.getItem(SESSIONS_KEY);
      return sessionsJson ? JSON.parse(sessionsJson) : [];
    } catch (error) {
      console.error('Error getting sessions:', error);
      return [];
    }
  }

  static async getActiveSession(agentId: string): Promise<ChatSession | null> {
    try {
      const sessions = await this.getSessions();
      return sessions.find(s => s.agent_id === agentId && s.is_active) || null;
    } catch (error) {
      console.error('Error getting active session:', error);
      return null;
    }
  }

  static async deleteSession(sessionId: string): Promise<void> {
    try {
      // Delete messages for this session
      await this.clearMessages(sessionId);
      
      // Remove session from sessions list
      const sessions = await this.getSessions();
      const filteredSessions = sessions.filter(s => s.id !== sessionId);
      await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(filteredSessions));
    } catch (error) {
      console.error('Error deleting session:', error);
      throw new Error('Failed to delete session');
    }
  }

  // General storage utilities
  static async clearAllData(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const lifelineKeys = keys.filter(key => 
        key.startsWith(MESSAGES_KEY) || key.startsWith(SESSIONS_KEY)
      );
      await AsyncStorage.multiRemove(lifelineKeys);
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw new Error('Failed to clear all data');
    }
  }
}