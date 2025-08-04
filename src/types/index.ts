export interface User {
  id: string;
  email: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  onboarding_completed: boolean;
  preferences: Record<string, any>;
  subscription_tier: 'free' | 'premium' | 'premium_plus';
  created_at: string;
  updated_at: string;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  specialty: string;
  avatar_url: string;
  color_scheme: string[];
  personality: {
    traits: string[];
    communication_style: string;
    expertise_level: string;
  };
  system_prompt: string;
  starter_prompts: string[];
  is_premium: boolean;
  is_active: boolean;
  usage_count: number;
  rating: number;
  tags: string[];
}

export interface ChatSession {
  id: string;
  user_id: string;
  agent_id: string;
  title?: string;
  is_active: boolean;
  session_metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  agent?: Agent;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  role: 'user' | 'assistant';
  content: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface UserGoal {
  id: string;
  user_id: string;
  category: string;
  title: string;
  description?: string;
  target_date?: string;
  status: 'active' | 'completed' | 'paused';
  progress: number;
  created_at: string;
  updated_at: string;
}