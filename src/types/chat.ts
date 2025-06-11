export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  userId?: string; // Add user context
  sessionId?: string; // Add session context
}

export interface WebhookRequest {
  message: string;
  sessionId?: string;
}

export interface WebhookResponse {
  agentMessage: string;
  sessionId: string;
}

export interface ChatSession {
  id: string;
  userId: string;
  webhookSessionId: string; // External webhook session ID
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sessionID: string | null;
}