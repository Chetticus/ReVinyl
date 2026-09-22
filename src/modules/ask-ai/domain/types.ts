export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  conversationId: string;
  createdAt: string;
  images?: string[];
  imageUrls?: string[];
}

export interface ConversationSummary {
  id: string;
  title: string;
  conversationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationDetail {
  id: string;
  title: string;
  createdAt: string;
  messages: ChatMessage[];
}

export interface SendChatMessageRequest {
  message: string;
  conversationId?: string;
  images?: File[];
}

export interface SendChatMessageResponse {
  conversationId: string;
  reply: string;
  chatbotCode: string;
}

export interface RenameConversationRequest {
  id: string;
  title: string;
}
