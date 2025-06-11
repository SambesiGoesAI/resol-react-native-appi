export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
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
  sessionID: string | null;
  messages: ChatMessage[];
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sessionID: string | null;
}