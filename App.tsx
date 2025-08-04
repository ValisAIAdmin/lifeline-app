import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import ChatScreen from './src/screens/ChatScreen';
import ProfileScreen from './src/screens/ProfileScreen';

// Import error boundary
import ErrorBoundary from './src/components/ErrorBoundary';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName: keyof typeof Ionicons.glyphMap;

                if (route.name === 'Home') {
                  iconName = focused ? 'home' : 'home-outline';
                } else if (route.name === 'Chat') {
                  iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
                } else if (route.name === 'Profile') {
                  iconName = focused ? 'person' : 'person-outline';
                } else {
                  iconName = 'home-outline';
                }

                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: '#4CAF50',
              tabBarInactiveTintColor: 'gray',
              headerStyle: {
                backgroundColor: '#fff',
              },
              headerTitleStyle: {
                fontWeight: '600',
              },
            })}
          >
            <Tab.Screen 
              name="Home" 
              component={HomeScreen}
              options={{ title: 'LifeLine' }}
            />
            <Tab.Screen 
              name="Chat" 
              component={ChatScreen}
              options={{ title: 'Chat' }}
            />
            <Tab.Screen 
              name="Profile" 
              component={ProfileScreen}
              options={{ title: 'Profile' }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}