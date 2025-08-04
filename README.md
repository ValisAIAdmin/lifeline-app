# LifeLine - AI Agent Platform

A personalized agentic AI platform where users can select different AI agents (strategists, assistants, therapists, mentors) to guide them in specific areas of life.

## Features

- 🤖 **Multiple AI Agents** - Specialized agents for different life areas
- 💬 **Intelligent Chat** - Context-aware conversations with personality
- 📱 **Mobile-First** - Cross-platform iOS and Android support
- 🎯 **Daily Suggestions** - Smart agent recommendations
- 📊 **Progress Tracking** - Monitor your growth journey
- 🔒 **Privacy-Focused** - Your data stays secure

## Tech Stack

- **Frontend**: React Native + Expo
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **AI Integration**: OpenAI GPT-4 / Claude
- **State Management**: Zustand
- **Navigation**: React Navigation v6
- **UI Framework**: NativeBase

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Expo CLI
- Supabase account

### Installation

```bash
# Clone the repository
git clone https://github.com/ValisAIAdmin/lifeline-app.git
cd lifeline-app

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start the development server
expo start
```

### Environment Setup

Create a `.env` file with:

```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_OPENAI_API_KEY=your_openai_api_key
```

## Project Structure

- `/src/components` - Reusable UI components
- `/src/screens` - App screens and navigation
- `/src/services` - API and external service integrations
- `/src/store` - State management
- `/config` - Agent and prompt configurations
- `/supabase` - Database migrations and functions

## Development Roadmap

### Phase 1: Foundation ✨
- [x] Project setup and architecture
- [ ] User authentication system
- [ ] Database schema implementation
- [ ] Core UI components

### Phase 2: Core Features 🚀
- [ ] Agent discovery and selection
- [ ] Chat interface with AI integration
- [ ] User profiles and preferences
- [ ] Chat history management

### Phase 3: Enhancement 💡
- [ ] Daily recommendation engine
- [ ] Push notifications
- [ ] Analytics and insights
- [ ] Beta testing program

### Phase 4: Launch 🎉
- [ ] Performance optimization
- [ ] App store deployment
- [ ] Marketing and user acquisition

## Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.