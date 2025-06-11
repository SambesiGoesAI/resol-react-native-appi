import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebhookRequest, WebhookResponse, ChatMessage } from '../types/chat';

const WEBHOOK_URL = 'https://n8n.andsome.fi/webhook/c389f93f-25da-42d1-929a-17046d85c5ad';
const SESSION_STORAGE_KEY = 'chat_session_id';
const MESSAGES_STORAGE_KEY = 'chat_messages';

export class ChatService {
  private sessionID: string | null = null;

  private sessionLoadPromise: Promise<void> | null = null;

  constructor() {
    this.sessionLoadPromise = this.loadSession();
  }

  private async loadSession(): Promise<void> {
    try {
      console.log('[ChatService] Loading session from AsyncStorage');
      const storedSessionID = await AsyncStorage.getItem(SESSION_STORAGE_KEY);
      console.log('[ChatService] Loaded sessionID:', storedSessionID);
      this.sessionID = storedSessionID;
    } catch (error) {
      console.error('Failed to load session:', error);
    }
  }

  private async saveSession(sessionID: string): Promise<void> {
    try {
      console.log('[ChatService] Saving sessionID to AsyncStorage:', sessionID);
      this.sessionID = sessionID;
      await AsyncStorage.setItem(SESSION_STORAGE_KEY, sessionID);
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  }

  async saveMessages(messages: ChatMessage[]): Promise<void> {
    try {
      console.log('[ChatService] Saving messages to AsyncStorage:', messages.length);
      await AsyncStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error('Failed to save messages:', error);
    }
  }

  setSessionID(sessionID: string | null) {
    this.sessionID = sessionID;
  }

  async loadMessages(): Promise<ChatMessage[]> {
    try {
      console.log('[ChatService] Loading messages from AsyncStorage');
      const storedMessages = await AsyncStorage.getItem(MESSAGES_STORAGE_KEY);
      if (storedMessages) {
        const parsedMessages = JSON.parse(storedMessages);
        console.log('[ChatService] Loaded messages count:', parsedMessages.length);
        // Convert timestamp strings back to Date objects
        return parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      }
      return [];
    } catch (error) {
      console.error('Failed to load messages:', error);
      return [];
    }
  }

  async sendMessage(message: string): Promise<WebhookResponse> {
    console.log('[ChatService] sendMessage called with message:', message);
    console.log('[ChatService] Current sessionID before sending:', this.sessionID);

    // Wait for session to load before sending message
    if (this.sessionLoadPromise) {
      await this.sessionLoadPromise;
      this.sessionLoadPromise = null;
    }

    const requestBody: WebhookRequest = {
      message: message.trim(),
    };

    // Include sessionId if we have one (not for the first message)
    if (this.sessionID) {
      requestBody.sessionId = this.sessionID;
    }

    console.log('[ChatService] Request body:', requestBody);

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

      console.log('[ChatService] Response data:', data);

      // Save session ID if this is the first message
      if (!this.sessionID && data.sessionId) {
        console.log('[ChatService] Saving new sessionID:', data.sessionId);
        await this.saveSession(data.sessionId);
      }

      return data;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw new Error('Failed to send message. Please check your connection and try again.');
    }
  }

  getSessionID(): string | null {
    return this.sessionID;
  }

  async clearSession(): Promise<void> {
    try {
      this.sessionID = null;
      await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
      await AsyncStorage.removeItem(MESSAGES_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear session:', error);
    }
  }

  async resetSession(): Promise<void> {
    await this.clearSession();
  }
}

export const chatService = new ChatService();