import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';
import { WebhookRequest, WebhookResponse, ChatMessage, ChatSession } from '../types/chat';
import { User } from './auth';

const WEBHOOK_URL = 'https://n8n.andsome.fi/webhook/c389f93f-25da-42d1-929a-17046d85c5ad';

export class ChatService {
  private currentUser: User | null = null;
  private currentSession: ChatSession | null = null;

  /**
   * Set the current user context and start a new chat session.
   */
  async setUser(user: User | null): Promise<void> {
    this.currentUser = user;
    if (user) {
      await this.startNewSession();
    } else {
      this.currentSession = null;
    }
  }

  /**
   * Load messages for the current active session from Supabase.
   */
  async loadMessages(): Promise<ChatMessage[]> {
    if (!this.currentUser || !this.currentSession || !supabase) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', this.currentSession.id)
        .order('timestamp', { ascending: true });

      if (error) {
        console.error('Failed to load messages from Supabase:', error);
        return [];
      }

      return data.map(msg => ({
        id: msg.message_id,
        text: msg.text,
        isUser: msg.is_user,
        timestamp: new Date(msg.timestamp),
      }));
    } catch (error) {
      console.error('Failed to load messages:', error);
      return [];
    }
  }

  /**
   * Deactivates all active sessions for the current user and creates a new one.
   */
  async startNewSession(): Promise<void> {
    if (!this.currentUser || !supabase) {
      return;
    }

    try {
      // Deactivate all previous sessions for the user
      await supabase
        .from('chat_sessions')
        .update({ is_active: false })
        .eq('user_id', this.currentUser.id)
        .eq('is_active', true);

      // Create a new session
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: this.currentUser.id,
          is_active: true,
        })
        .select()
        .single();

      if (error) {
        console.error('Failed to create a new session:', error);
        this.currentSession = null;
        return;
      }

      this.currentSession = {
        id: data.id,
        userId: data.user_id,
        webhookSessionId: data.webhook_session_id,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        isActive: data.is_active,
      };
    } catch (error) {
      console.error('Failed to start a new session:', error);
      this.currentSession = null;
    }
  }

  /**
   * Save message to Supabase with user context
   */
  async saveMessage(message: ChatMessage): Promise<void> {
    if (!this.currentUser || !supabase) {
      console.warn('Cannot save message: no user context or Supabase connection');
      return;
    }

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          user_id: this.currentUser.id,
          session_id: this.currentSession?.id,
          message_id: message.id,
          text: message.text,
          is_user: message.isUser,
          timestamp: message.timestamp.toISOString()
        });

      if (error) {
        console.error('Failed to save message to Supabase:', error);
      }
    } catch (error) {
      console.error('Failed to save message:', error);
    }
  }

  /**
   * Get or create user-specific session
   */
  async getOrCreateSession(): Promise<string | null> {
    if (!this.currentUser || !supabase) {
      return null;
    }

    try {
      // Try to get existing active session
      const { data: existingSessions, error: fetchError } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', this.currentUser.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1);

      if (fetchError) {
        console.error('Failed to fetch existing sessions:', fetchError);
        return null;
      }

      if (existingSessions && existingSessions.length > 0) {
        this.currentSession = {
          id: existingSessions[0].id,
          userId: existingSessions[0].user_id,
          webhookSessionId: existingSessions[0].webhook_session_id,
          createdAt: new Date(existingSessions[0].created_at),
          updatedAt: new Date(existingSessions[0].updated_at),
          isActive: existingSessions[0].is_active
        };
        return existingSessions[0].webhook_session_id;
      }

      return null; // No existing session, will be created after first message
    } catch (error) {
      console.error('Failed to get or create session:', error);
      return null;
    }
  }

  /**
   * Save session to Supabase after receiving from webhook
   */
  async saveSession(webhookSessionId: string): Promise<void> {
    if (!this.currentUser || !supabase) {
      return;
    }

    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: this.currentUser.id,
          webhook_session_id: webhookSessionId,
          is_active: true
        })
        .select()
        .single();

      if (error) {
        console.error('Failed to save session to Supabase:', error);
        return;
      }

      this.currentSession = {
        id: data.id,
        userId: data.user_id,
        webhookSessionId: data.webhook_session_id,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        isActive: data.is_active
      };
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  }

  /**
   * Send message with user context
   */
  async sendMessage(message: string): Promise<WebhookResponse> {
    if (!this.currentUser) {
      throw new Error('No user context available');
    }

    // Get existing session ID
    const existingSessionId = await this.getOrCreateSession();

    const requestBody: WebhookRequest = {
      message: message.trim(),
    };

    // Include sessionId if we have one
    if (existingSessionId) {
      requestBody.sessionId = existingSessionId;
    }

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Save session ID if this is the first message
      if (!existingSessionId && data.sessionId) {
        await this.saveSession(data.sessionId);
      }

      return data;
    } catch (error) {
      throw new Error('Failed to send message. Please check your connection and try again.');
    }
  }

  /**
   * Get current session ID
   */
  getSessionID(): string | null {
    return this.currentSession?.webhookSessionId || null;
  }

  /**
   * Clear user-specific data on logout
   */
  async clearUserData(): Promise<void> {
    this.currentUser = null;
    this.currentSession = null;
    // Note: We don't delete data from Supabase, just clear local references
  }

  /**
   * Clear all chat data for current user (destructive operation)
   */
  async clearUserChatHistory(): Promise<void> {
    if (!this.currentUser || !supabase) {
      return;
    }

    try {
      // Delete messages first (due to foreign key constraints)
      await supabase
        .from('chat_messages')
        .delete()
        .eq('user_id', this.currentUser.id);

      // Delete sessions
      await supabase
        .from('chat_sessions')
        .delete()
        .eq('user_id', this.currentUser.id);

      this.currentSession = null;
    } catch (error) {
      console.error('Failed to clear user chat history:', error);
      throw error;
    }
  }
}

export const chatService = new ChatService();