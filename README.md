# LifeLine - Personalized AI Agent Platform

A React Native mobile app powered by Expo that provides personalized AI agents for personal growth and life coaching.

## Features

### Core Functionality
- **3-Tab Navigation**: Home, Chat, Profile
- **5 AI Agents** with distinct personalities:
  - Maya - Wellness Coach
  - Alex - Productivity Strategist  
  - Zoe - Relationship Guide
  - Sam - Financial Advisor
  - Leo - Creative Mentor
- **Chat Interface** with OpenAI integration
- **Local Storage** using AsyncStorage for message persistence
- **No Authentication** required for MVP
- **Clean UI** using React Native components

### Technical Features
- **Error Handling** for all API calls and storage operations
- **Loading States** and user feedback
- **Offline Capability** with graceful error handling
- **TypeScript** for type safety
- **Proper Navigation** with React Navigation

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure OpenAI API (Optional)**
   ```bash
   cp .env.example .env
   # Edit .env and add your OpenAI API key
   ```

3. **Start the Development Server**
   ```bash
   npm start
   # or
   expo start
   ```

4. **Run on Device/Simulator**
   - Scan QR code with Expo Go app (iOS/Android)
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Press `w` for web browser

## Project Structure

```
lifeline-app/
├── src/
│   ├── components/          # Reusable components
│   ├── screens/            # Main app screens
│   ├── services/           # API and storage services
│   ├── types/              # TypeScript type definitions
│   └── theme.ts            # App theme and styling
├── config/
│   └── agents.json         # AI agent configurations
├── App.tsx                 # Main app component
└── package.json           # Dependencies and scripts
```

## AI Agents

The app includes 5 pre-configured AI agents:

1. **Maya (Wellness Coach)** - Health, nutrition, fitness, mental wellbeing
2. **Alex (Productivity Strategist)** - Time management, goal setting, focus
3. **Zoe (Relationship Guide)** - Communication, relationships, boundaries
4. **Sam (Financial Advisor)** - Budgeting, investing, financial planning
5. **Leo (Creative Mentor)** - Creativity, artistic skills, inspiration

## Demo Mode

The app works in demo mode without an OpenAI API key, providing mock responses to showcase functionality. To enable full AI capabilities:

1. Get an OpenAI API key from https://platform.openai.com/
2. Add it to your `.env` file
3. Restart the app

## Development

### Available Scripts

- `npm start` - Start the development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS  
- `npm run web` - Run on web
- `npm run lint` - Lint the code
- `npm run type-check` - Run TypeScript checks

### Building for Production

```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Build for Android
npm run build:android

# Build for iOS
npm run build:ios
```

## Features Implemented

- ✅ 3-tab navigation (Home, Chat, Profile)
- ✅ AI agent selection with visual cards
- ✅ Chat interface with message bubbles
- ✅ Local message storage with AsyncStorage
- ✅ Error boundaries and crash prevention
- ✅ Loading states and typing indicators
- ✅ Starter prompt suggestions
- ✅ Clear chat functionality
- ✅ Offline capability with fallback responses
- ✅ TypeScript throughout
- ✅ Clean, modern UI

## License

MIT License - see LICENSE file for details.

## Support

This is an MVP version designed to showcase core functionality. For production use, additional features like user authentication, cloud sync, and enhanced security would be recommended.