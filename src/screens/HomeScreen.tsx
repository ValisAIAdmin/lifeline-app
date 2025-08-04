import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Agent } from '../types';
import { StorageService } from '../services/StorageService';
import { colors, spacing, borderRadius, shadows } from '../theme';
import agentsConfig from '../../config/agents.json';

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      setLoading(true);
      // Load agents from config and add runtime data
      const agentsWithData = await Promise.all(
        agentsConfig.agents.map(async (agent) => {
          const sessions = await StorageService.getSessions();
          const agentSessions = sessions.filter(s => s.agent_id === agent.id);
          
          return {
            ...agent,
            is_active: agentSessions.length > 0,
            usage_count: agentSessions.length,
            rating: 4.5, // Mock rating for MVP
          } as Agent;
        })
      );
      
      setAgents(agentsWithData);
    } catch (error) {
      console.error('Error loading agents:', error);
      Alert.alert('Error', 'Failed to load agents. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAgentSelect = async (agent: Agent) => {
    try {
      // Check if there's an active session for this agent
      let session = await StorageService.getActiveSession(agent.id);
      
      if (!session) {
        // Create new session
        session = {
          id: `session_${agent.id}_${Date.now()}`,
          user_id: 'demo_user', // For MVP, using demo user
          agent_id: agent.id,
          title: `Chat with ${agent.name}`,
          is_active: true,
          session_metadata: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          agent,
        };
        
        await StorageService.saveSession(session);
      }

      // Navigate to chat with the session
      navigation.navigate('Chat', { 
        session,
        agent,
      });
    } catch (error) {
      console.error('Error selecting agent:', error);
      Alert.alert('Error', 'Failed to start chat. Please try again.');
    }
  };

  const getAgentColor = (agent: Agent) => {
    switch (agent.id) {
      case 'maya-wellness-coach':
        return colors.wellness;
      case 'alex-productivity-strategist':
        return colors.productivity;
      case 'zoe-relationship-guide':
        return colors.relationships;
      case 'sam-financial-advisor':
        return colors.finance;
      case 'leo-creative-mentor':
        return colors.creative;
      default:
        return colors.primary;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading your AI agents...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to LifeLine</Text>
        <Text style={styles.subtitle}>
          Your personal AI agents for growth and support
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Choose Your AI Agent</Text>
        
        {agents.map((agent) => (
          <TouchableOpacity
            key={agent.id}
            style={[
              styles.agentCard,
              { borderLeftColor: getAgentColor(agent) }
            ]}
            onPress={() => handleAgentSelect(agent)}
            activeOpacity={0.7}
          >
            <View style={styles.agentContent}>
              <View
                style={[
                  styles.agentAvatar,
                  { backgroundColor: getAgentColor(agent) + '20' }
                ]}
              >
                <Text style={[styles.agentInitial, { color: getAgentColor(agent) }]}>
                  {agent.name.charAt(0)}
                </Text>
              </View>
              
              <View style={styles.agentInfo}>
                <View style={styles.agentHeader}>
                  <Text style={styles.agentName}>{agent.name}</Text>
                  {agent.is_premium && (
                    <View style={styles.premiumBadge}>
                      <Text style={styles.premiumText}>Premium</Text>
                    </View>
                  )}
                </View>
                
                <Text style={styles.agentRole}>{agent.role}</Text>
                <Text style={styles.agentSpecialty} numberOfLines={2}>
                  {agent.specialty}
                </Text>
                
                {agent.usage_count > 0 && (
                  <Text style={styles.usageCount}>
                    {agent.usage_count} conversation{agent.usage_count !== 1 ? 's' : ''}
                  </Text>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.tipBox}>
        <Text style={styles.tipTitle}>💡 Getting Started</Text>
        <Text style={styles.tipText}>
          Tap on any AI agent above to start a conversation. Each agent has unique expertise and personality to help you with different aspects of your life.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  loadingText: {
    fontSize: 16,
    color: colors.gray[600],
  },
  header: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.gray[800],
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray[600],
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.gray[700],
    marginBottom: spacing.md,
  },
  agentCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    ...shadows.sm,
  },
  agentContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  agentAvatar: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  agentInitial: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  agentInfo: {
    flex: 1,
  },
  agentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  agentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.gray[800],
  },
  premiumBadge: {
    backgroundColor: colors.warning,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  premiumText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  agentRole: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray[600],
    marginBottom: spacing.xs,
  },
  agentSpecialty: {
    fontSize: 14,
    color: colors.gray[500],
    marginBottom: spacing.xs,
  },
  usageCount: {
    fontSize: 12,
    color: colors.gray[400],
  },
  tipBox: {
    backgroundColor: '#E3F2FD',
    borderRadius: borderRadius.xl,
    padding: spacing.md,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1565C0',
    marginBottom: spacing.sm,
  },
  tipText: {
    fontSize: 14,
    color: '#1976D2',
    lineHeight: 20,
  },
});

export default HomeScreen;