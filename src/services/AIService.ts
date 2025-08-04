import OpenAI from 'openai';
import { Agent, ChatMessage } from '../types';

// For MVP, we'll use a fallback API key for demo purposes
// In production, this should come from environment variables
const FALLBACK_API_KEY = 'demo-key-please-replace';

export class AIService {
  private static openai: OpenAI | null = null;
  private static isInitialized = false;

  static initialize(apiKey?: string) {
    try {
      const key = apiKey || FALLBACK_API_KEY;
      this.openai = new OpenAI({
        apiKey: key,
        // For demo purposes, we'll handle API errors gracefully
      });
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize OpenAI:', error);
      this.isInitialized = false;
    }
  }

  static async sendMessage(
    agent: Agent,
    messages: ChatMessage[],
    userMessage: string,
    onProgress?: (chunk: string) => void
  ): Promise<string> {
    if (!this.isInitialized || !this.openai) {
      throw new Error('AI service not initialized');
    }

    try {
      // Convert chat messages to OpenAI format
      const openAIMessages = [
        {
          role: 'system' as const,
          content: agent.system_prompt,
        },
        ...messages.map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        })),
        {
          role: 'user' as const,
          content: userMessage,
        },
      ];

      // For demo purposes, if no valid API key, return a mock response
      if (FALLBACK_API_KEY === 'demo-key-please-replace') {
        return this.getMockResponse(agent, userMessage);
      }

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: openAIMessages,
        max_tokens: 500,
        temperature: 0.7,
        stream: false, // For simplicity in MVP, not using streaming
      });

      return completion.choices[0]?.message?.content || 'I apologize, but I couldn\'t generate a response. Please try again.';
    } catch (error) {
      console.error('Error sending message to AI:', error);
      
      // Graceful fallback for API errors
      if (error instanceof Error && error.message.includes('401')) {
        throw new Error('Invalid API key. Please check your OpenAI configuration.');
      } else if (error instanceof Error && error.message.includes('429')) {
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      } else if (error instanceof Error && error.message.includes('network')) {
        throw new Error('Network error. Please check your internet connection.');
      }
      
      // Return a fallback response for other errors
      return this.getMockResponse(agent, userMessage);
    }
  }

  private static getMockResponse(agent: Agent, userMessage: string): string {
    const responses = {
      'maya-wellness-coach': [
        "I understand you're looking to improve your wellness. Let's start with small, sustainable changes that can make a big impact on your daily life.",
        "That's a great question! Wellness is a journey, not a destination. What specific area would you like to focus on first?",
        "I love your enthusiasm for better health! Here's what I'd recommend based on what you've shared...",
      ],
      'alex-productivity-strategist': [
        "Excellent question! Productivity is about working smarter, not harder. Let me share a strategic approach that could help you.",
        "I can see you're motivated to optimize your workflow. Here's a systematic approach we can try together.",
        "Great focus on productivity! Let's break this down into actionable steps you can implement right away.",
      ],
      'zoe-relationship-guide': [
        "Thank you for sharing this with me. Relationships require patience and understanding. Let's explore this together.",
        "I appreciate your openness about this situation. Here's how we might approach improving this relationship dynamic.",
        "That sounds challenging, and it's normal to feel this way. Let me offer some perspective and practical advice.",
      ],
      'sam-financial-advisor': [
        "Smart thinking about your finances! Let's create a practical plan that fits your current situation and goals.",
        "I'm glad you're taking charge of your financial future. Here's what I'd recommend as a starting point.",
        "Excellent question about money management! Let me break this down into clear, actionable steps.",
      ],
    };

    const agentResponses = responses[agent.id as keyof typeof responses] || responses['maya-wellness-coach'];
    const randomResponse = agentResponses[Math.floor(Math.random() * agentResponses.length)];
    
    return `${randomResponse}\n\n*Note: This is a demo response. Please configure your OpenAI API key for full functionality.*`;
  }

  static async retryMessage(
    agent: Agent,
    messages: ChatMessage[],
    userMessage: string,
    maxRetries: number = 3
  ): Promise<string> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.sendMessage(agent, messages, userMessage);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        console.warn(`AI request attempt ${attempt} failed:`, lastError.message);
        
        if (attempt < maxRetries) {
          // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }

    throw lastError || new Error('Failed to get AI response after retries');
  }
}