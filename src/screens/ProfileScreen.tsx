import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StorageService } from '../services/StorageService';
import { colors, spacing, borderRadius, shadows } from '../theme';

const ProfileScreen: React.FC = () => {
  const [totalSessions, setTotalSessions] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    analyticsEnabled: true,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const sessions = await StorageService.getSessions();
      setTotalSessions(sessions.length);

      // Count total messages across all sessions
      let messageCount = 0;
      for (const session of sessions) {
        const messages = await StorageService.getMessages(session.id);
        messageCount += messages.length;
      }
      setTotalMessages(messageCount);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const clearAllData = async () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to delete all your conversations? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            try {
              await StorageService.clearAllData();
              setTotalSessions(0);
              setTotalMessages(0);
              Alert.alert('Success', 'All data has been cleared');
            } catch (error) {
              console.error('Error clearing data:', error);
              Alert.alert('Error', 'Failed to clear data. Please try again.');
            }
          }
        }
      ]
    );
  };

  const StatCard: React.FC<{ 
    icon: string; 
    title: string; 
    value: string; 
    color?: string;
  }> = ({ icon, title, value, color = colors.primary }) => (
    <View style={[styles.statCard, { flex: 1 }]}>
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon as any} size={24} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  const SettingItem: React.FC<{
    icon: string;
    title: string;
    description: string;
    value: boolean;
    onToggle: (value: boolean) => void;
    disabled?: boolean;
  }> = ({ icon, title, description, value, onToggle, disabled = false }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingIcon}>
        <Ionicons name={icon as any} size={20} color={colors.gray[600]} />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        disabled={disabled}
        trackColor={{ false: colors.gray[300], true: colors.primary + '40' }}
        thumbColor={value ? colors.primary : colors.gray[400]}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* User Info Section */}
      <View style={styles.userSection}>
        <View style={styles.userAvatar}>
          <Ionicons name="person" size={40} color={colors.primary} />
        </View>
        <Text style={styles.userName}>Demo User</Text>
        <Text style={styles.userEmail}>lifeline.demo@example.com</Text>
        <Text style={styles.userNote}>MVP Version - No authentication required</Text>
      </View>

      {/* Stats Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Activity</Text>
        <View style={styles.statsRow}>
          <StatCard
            icon="chatbubbles"
            title="Active Sessions"
            value={totalSessions.toString()}
            color={colors.primary}
          />
          <View style={styles.statSpacer} />
          <StatCard
            icon="chatbox"
            title="Total Messages"
            value={totalMessages.toString()}
            color={colors.info}
          />
        </View>
      </View>

      {/* Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.settingsCard}>
          <SettingItem
            icon="notifications"
            title="Push Notifications"
            description="Get notified about important updates"
            value={settings.notifications}
            onToggle={(value) => setSettings(prev => ({ ...prev, notifications: value }))}
            disabled={true} // Disabled for MVP
          />
          
          <View style={styles.divider} />
          
          <SettingItem
            icon="moon"
            title="Dark Mode"
            description="Switch to dark theme"
            value={settings.darkMode}
            onToggle={(value) => setSettings(prev => ({ ...prev, darkMode: value }))}
            disabled={true} // Disabled for MVP
          />
          
          <View style={styles.divider} />
          
          <SettingItem
            icon="analytics"
            title="Usage Analytics"
            description="Help improve the app experience"
            value={settings.analyticsEnabled}
            onToggle={(value) => setSettings(prev => ({ ...prev, analyticsEnabled: value }))}
            disabled={true} // Disabled for MVP
          />
        </View>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.aboutCard}>
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>Version</Text>
            <Text style={styles.aboutValue}>1.0.0 MVP</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.aboutDescription}>
            <Text style={styles.aboutTitle}>LifeLine</Text>
            <Text style={styles.aboutText}>
              Your personal AI agents for growth and support. This is an MVP version 
              designed to showcase core functionality.
            </Text>
          </View>
        </View>
      </View>

      {/* Data Management */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>
        
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={20} color={colors.info} />
          <Text style={styles.infoText}>
            All your conversations are stored locally on your device for privacy. 
            No data is sent to external servers except when communicating with AI agents.
          </Text>
        </View>
        
        <TouchableOpacity style={styles.dangerButton} onPress={clearAllData}>
          <Ionicons name="trash" size={16} color={colors.error} />
          <Text style={styles.dangerButtonText}>Clear All Data</Text>
        </TouchableOpacity>
      </View>

      {/* API Configuration */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>API Configuration</Text>
        
        <View style={styles.warningCard}>
          <Ionicons name="warning" size={20} color={colors.warning} />
          <Text style={styles.warningText}>
            This MVP uses demo responses. To enable full AI functionality, 
            add your OpenAI API key to the environment configuration.
          </Text>
        </View>
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
  userSection: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  userAvatar: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.gray[800],
    marginBottom: spacing.xs,
  },
  userEmail: {
    fontSize: 16,
    color: colors.gray[600],
    marginBottom: spacing.xs,
  },
  userNote: {
    fontSize: 14,
    color: colors.gray[500],
    textAlign: 'center',
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
  statsRow: {
    flexDirection: 'row',
  },
  statSpacer: {
    width: spacing.md,
  },
  statCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    alignItems: 'center',
    ...shadows.sm,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.gray[800],
    marginBottom: spacing.xs,
  },
  statTitle: {
    fontSize: 14,
    color: colors.gray[600],
    textAlign: 'center',
  },
  settingsCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    ...shadows.sm,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[800],
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.gray[600],
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray[200],
    marginVertical: spacing.sm,
  },
  aboutCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    ...shadows.sm,
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  aboutLabel: {
    fontSize: 16,
    color: colors.gray[700],
  },
  aboutValue: {
    fontSize: 16,
    color: colors.gray[600],
  },
  aboutDescription: {
    paddingTop: spacing.sm,
  },
  aboutTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[700],
    marginBottom: spacing.sm,
  },
  aboutText: {
    fontSize: 14,
    color: colors.gray[600],
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  infoText: {
    fontSize: 14,
    color: '#1976D2',
    flex: 1,
    marginLeft: spacing.sm,
    lineHeight: 20,
  },
  dangerButton: {
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dangerButtonText: {
    color: colors.error,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  warningCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    flexDirection: 'row',
  },
  warningText: {
    fontSize: 14,
    color: '#F57C00',
    flex: 1,
    marginLeft: spacing.sm,
    lineHeight: 20,
  },
});

export default ProfileScreen;