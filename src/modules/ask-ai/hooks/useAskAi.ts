import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  sendChatMessageApi,
  getConversationsApi,
  getConversationDetailApi,
  deleteConversationApi,
  renameConversationApi,
} from '../infrastructure/ask-ai.api';
import {
  SendChatMessageRequest,
  RenameConversationRequest,
  ConversationDetail,
  ConversationSummary,
} from '../domain/types';

export const askAiQueryKeys = {
  all: ['ask-ai'] as const,
  conversations: () => [...askAiQueryKeys.all, 'conversations'] as const,
  detail: (conversationId: string, recordId?: string | null) =>
    [
      ...askAiQueryKeys.all,
      'conversations',
      conversationId,
      recordId || null,
    ] as const,
};

export function useGetConversationsQuery() {
  return useQuery({
    queryKey: askAiQueryKeys.conversations(),
    queryFn: getConversationsApi,
    staleTime: 0,
  });
}

export function useGetConversationDetailQuery(conversationId: string | null) {
  const queryClient = useQueryClient();
  const { data: conversations } = useGetConversationsQuery();

  const record = conversations?.find(
    c => c.conversationId === conversationId || c.id === conversationId
  );
  const recordId = record ? record.id : null;

  return useQuery({
    queryKey: askAiQueryKeys.detail(conversationId || '', recordId),
    queryFn: async (): Promise<ConversationDetail> => {
      if (recordId) {
        return getConversationDetailApi(recordId);
      }

      const cached = queryClient.getQueryData<ConversationDetail>(
        askAiQueryKeys.detail(conversationId || '', null)
      );
      if (cached) {
        return cached;
      }

      return {
        id: conversationId || '',
        title: '',
        createdAt: new Date().toISOString(),
        messages: [],
      };
    },
    enabled: !!conversationId,
    staleTime: 0,
  });
}

export function useSendChatMessageMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SendChatMessageRequest) => sendChatMessageApi(data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: askAiQueryKeys.conversations() });
      if (data.conversationId) {
        queryClient.invalidateQueries({
          queryKey: ['ask-ai', 'conversations', data.conversationId],
        });

        if (!variables.conversationId) {
          const tempDetail: ConversationDetail = {
            id: data.conversationId,
            title: variables.message,
            createdAt: new Date().toISOString(),
            messages: [
              {
                id: 'temp-user-' + Date.now(),
                role: 'user',
                content: variables.message,
                conversationId: data.conversationId,
                createdAt: new Date().toISOString(),
                imageUrls:
                  variables.images && variables.images.length > 0
                    ? variables.images.map(file => URL.createObjectURL(file))
                    : [],
              },
              {
                id: 'temp-ai-' + Date.now(),
                role: 'ai',
                content: data.reply,
                conversationId: data.conversationId,
                createdAt: new Date().toISOString(),
              },
            ],
          };
          queryClient.setQueryData(
            ['ask-ai', 'conversations', data.conversationId, null],
            tempDetail
          );
        }
      }
    },
  });
}

export function useDeleteConversationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteConversationApi(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: askAiQueryKeys.conversations() });
      queryClient.removeQueries({
        predicate: query =>
          query.queryKey[0] === 'ask-ai' &&
          query.queryKey[1] === 'conversations' &&
          query.queryKey[3] === id,
      });
    },
  });
}

export function useRenameConversationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RenameConversationRequest) => renameConversationApi(data),
    onSuccess: (_, variables) => {
      let conversationId: string | undefined;

      queryClient.setQueryData<ConversationSummary[]>(
        askAiQueryKeys.conversations(),
        old => {
          if (!old) return old;
          const target = old.find(c => c.id === variables.id);
          if (target) {
            conversationId = target.conversationId;
          }
          return old.map(c =>
            c.id === variables.id ? { ...c, title: variables.title } : c
          );
        }
      );

      if (conversationId) {
        queryClient.setQueryData<ConversationDetail>(
          askAiQueryKeys.detail(conversationId, variables.id),
          old => {
            if (!old) return old;
            return { ...old, title: variables.title };
          }
        );
      }

      queryClient.refetchQueries({ queryKey: ['ask-ai'] });
    },
  });
}
