import api from '@/lib/api/axios';
import { API_ROUTES } from '@/lib/api/routes';
import {
  ConversationDetail,
  ConversationSummary,
  RenameConversationRequest,
  SendChatMessageRequest,
  SendChatMessageResponse,
} from '../domain/types';

export async function sendChatMessageApi(
  data: SendChatMessageRequest
): Promise<SendChatMessageResponse> {
  const formData = new FormData();
  formData.append('message', data.message);
  if (data.conversationId) {
    formData.append('conversationId', data.conversationId);
  }
  if (data.images && data.images.length > 0) {
    data.images.forEach(file => {
      formData.append('images', file);
    });
  }

  const response = await api.post<SendChatMessageResponse>(
    API_ROUTES.CHAT.SEND,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000,
    }
  );
  return response.data;
}

export async function getConversationsApi(): Promise<ConversationSummary[]> {
  const response = await api.get<ConversationSummary[]>(
    API_ROUTES.CHAT.CONVERSATIONS
  );
  return response.data;
}

export async function getConversationDetailApi(
  id: string
): Promise<ConversationDetail> {
  const response = await api.get<ConversationDetail>(
    API_ROUTES.CHAT.CONVERSATION_DETAIL(id)
  );
  return response.data;
}

export async function deleteConversationApi(id: string): Promise<void> {
  await api.delete(API_ROUTES.CHAT.CONVERSATION_DETAIL(id));
}

export async function renameConversationApi(
  data: RenameConversationRequest
): Promise<void> {
  await api.patch(API_ROUTES.CHAT.RENAME(data.id), {
    title: data.title,
  });
}
