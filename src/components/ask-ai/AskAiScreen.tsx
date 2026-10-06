'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  BookOpen,
  Bot,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Edit2,
  GraduationCap,
  Loader2,
  Menu,
  Mic,
  Music2,
  Paperclip,
  Plus,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Trash2,
  Trophy,
  User,
  X,
} from 'lucide-react';
import {
  useDeleteConversationMutation,
  useGetConversationDetailQuery,
  useGetConversationsQuery,
  useRenameConversationMutation,
  useSendChatMessageMutation,
} from '@/modules/ask-ai/hooks/useAskAi';
import { cn } from '@/lib/utils';

const WELCOME_MESSAGE = {
  id: 'welcome',
  role: 'ai' as const,
  content:
    'Chào bạn, tôi là trợ lý AI của Vinyl Heritage. Bạn có thể hỏi về chuyên đề, thử thách, lịch sử đĩa than Việt Nam hoặc nhờ giải thích kiến thức học tập.',
  images: undefined as string[] | undefined,
  imageUrls: undefined as string[] | undefined,
};

const SUGGESTIONS = [
  {
    icon: <BookOpen size={18} />,
    title: 'Giải thích Chuyên đề',
    prompt:
      'Hãy giúp tôi tóm tắt và giải thích các khái niệm quan trọng trong chuyên đề đang học.',
    description: 'Làm rõ nội dung Chuyên đề theo cách dễ hiểu.',
  },
  {
    icon: <Music2 size={18} />,
    title: 'Di sản vinyl',
    prompt:
      'Kể cho tôi về lịch sử đĩa than Việt Nam và những nghệ sĩ, nhãn đĩa đáng nhớ.',
    description: 'Khám phá câu chuyện làm nên di sản âm nhạc.',
  },
  {
    icon: <GraduationCap size={18} />,
    title: 'Lộ trình học',
    prompt:
      'Hãy giúp tôi tạo lộ trình học các chuyên đề trong tuần này một cách hợp lý.',
    description: 'Sắp xếp thời gian học tập hiệu quả hơn.',
  },
];

export function AskAiScreen() {
  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    null
  );
  const [inputValue, setInputValue] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [tempUserMessage, setTempUserMessage] = useState<{
    content: string;
    imageUrls?: string[];
  } | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [renameTarget, setRenameTarget] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  const { data: conversations, isLoading: isLoadingConversations } =
    useGetConversationsQuery();
  const { data: conversationDetail, isLoading: isLoadingDetail } =
    useGetConversationDetailQuery(activeConversationId);
  const sendMutation = useSendChatMessageMutation();
  const deleteMutation = useDeleteConversationMutation();
  const renameMutation = useRenameConversationMutation();

  const attachmentPreviews = useMemo(
    () => attachedFiles.map(file => ({ file, url: URL.createObjectURL(file) })),
    [attachedFiles]
  );

  useEffect(() => {
    return () => {
      attachmentPreviews.forEach(item => URL.revokeObjectURL(item.url));
    };
  }, [attachmentPreviews]);

  const currentMessages = activeConversationId
    ? conversationDetail?.messages || []
    : [];
  const hasMessages = currentMessages.length > 0 || tempUserMessage;
  const renderedMessages = hasMessages ? currentMessages : [WELCOME_MESSAGE];

  const filteredConversations =
    conversations?.filter(chat =>
      chat.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const activeConversationTitle = activeConversationId
    ? conversationDetail?.title ||
    conversations?.find(item => item.conversationId === activeConversationId)
      ?.title ||
    'Đang tải đoạn chat...'
    : 'Cuộc trò chuyện mới';

  const canSend =
    Boolean(inputValue.trim() || attachedFiles.length > 0) &&
    !sendMutation.isPending;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [
    conversationDetail?.messages,
    tempUserMessage,
    sendMutation.isPending,
    activeConversationId,
  ]);

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = '0px';
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
  }, [inputValue]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = false;
    rec.lang = 'vi-VN';

    rec.onstart = () => setIsListening(true);
    rec.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      setInputValue(prev => prev + (prev ? ' ' : '') + transcript);
    };
    rec.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };
    rec.onend = () => setIsListening(false);

    recognitionRef.current = rec;
  }, []);

  const resetChatDraft = () => {
    setActiveConversationId(null);
    setTempUserMessage(null);
    setInputValue('');
    setAttachedFiles([]);
    setIsMobileSidebarOpen(false);
  };

  const handleMicClick = () => {
    if (!recognitionRef.current) {
      alert('Trình duyệt của bạn chưa hỗ trợ nhận diện giọng nói.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      return;
    }

    try {
      recognitionRef.current.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
    }
  };

  const handleSendMessage = async (text?: string) => {
    const messageText = text ?? inputValue;
    if (!messageText.trim() && attachedFiles.length === 0) return;

    const filesToSend = [...attachedFiles];
    const previewUrls = filesToSend.map(file => URL.createObjectURL(file));

    setAttachedFiles([]);
    setInputValue('');
    setTempUserMessage({ content: messageText, imageUrls: previewUrls });

    try {
      const res = await sendMutation.mutateAsync({
        message: messageText,
        conversationId: activeConversationId || undefined,
        images: filesToSend,
      });

      if (!activeConversationId && res.conversationId) {
        setActiveConversationId(res.conversationId);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
      setTempUserMessage(null);
    }
  };

  const handleDeleteConversation = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      const activeRecord = conversations?.find(
        c => c.conversationId === activeConversationId
      );
      if (activeRecord?.id === id || activeConversationId === id) {
        resetChatDraft();
      }
    } catch (err) {
      console.error('Failed to delete conversation:', err);
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files as FileList).filter(file =>
      file.type.startsWith('image/')
    );
    setAttachedFiles(prev => [...prev, ...filesArray]);
    e.target.value = '';
  };

  const removeAttachedFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const renderRichText = (content: string) =>
    content.split('**').map((part, index) =>
      index % 2 === 1 ? (
        <strong key={index} className='font-bold text-[#212B36]'>
          {part}
        </strong>
      ) : (
        part
      )
    );

  return (
    <div className='flex h-screen w-full overflow-hidden bg-[radial-gradient(circle_at_top_left,#FAE7DB_0%,#FDF6F1_42%,#F7F8FA_100%)] pt-[72px] text-[#212B36]'>
      {isMobileSidebarOpen && (
        <button
          aria-label='Đóng danh sách đoạn chat'
          className='fixed inset-0 z-30 bg-[#212B36]/40 backdrop-blur-sm lg:hidden'
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-40 flex w-[312px] flex-col border-r border-[#919EAB3D] bg-[#FDF6F1]/95 pt-[72px] shadow-2xl shadow-[#212B36]/10 backdrop-blur-xl transition-transform duration-300 lg:static lg:translate-x-0 lg:pt-0 lg:shadow-none',
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className='border-b border-[#919EAB3D] p-5'>
          <button
            onClick={resetChatDraft}
            className='group flex w-full items-center justify-center gap-2 rounded-2xl bg-[#E4722C] px-4 py-3.5 text-sm font-bold text-white shadow-xl shadow-[#E4722C]/25 transition-all hover:-translate-y-0.5 hover:bg-[#C45E1F] active:scale-[0.98]'
          >
            <Plus size={18} />
            Tạo cuộc trò chuyện mới
          </button>

          <div className='mt-4 rounded-2xl border border-[#E4722C29] bg-[#E4722C14] p-4'>
            <div className='mb-2 flex items-center gap-2 text-sm font-bold text-[#E4722C]'>
              <ShieldCheck size={17} />
              Vinyl AI Assistant
            </div>
            <p className='text-xs leading-relaxed font-medium text-[#E4722C]/80'>
              Hỗ trợ học tập, giải thích chuyên đề và khám phá di sản vinyl Việt
              Nam. Thông tin chỉ mang tính tham khảo.
            </p>
          </div>
        </div>

        <div className='px-5 py-4'>
          <div className='relative flex items-center rounded-2xl border border-[#919EAB52] bg-white px-3 py-2.5 shadow-sm'>
            <Search size={16} className='mr-2 text-[#919EAB]' />
            <input
              type='text'
              placeholder='Tìm kiếm đoạn chat...'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className='w-full bg-transparent text-sm font-semibold text-[#637381] placeholder:text-[#919EAB] focus:outline-none'
            />
          </div>
        </div>

        <div className='flex-1 overflow-y-auto px-3 pb-5'>
          <div className='mb-3 flex items-center justify-between px-2'>
            <p className='text-[11px] font-black tracking-[0.18em] text-[#919EAB]'>
              GẦN ĐÂY
            </p>
            <span className='rounded-full bg-[#919EAB14] px-2.5 py-1 text-[11px] font-bold text-[#637381]'>
              {filteredConversations.length}
            </span>
          </div>

          {isLoadingConversations ? (
            <div className='space-y-2 px-2'>
              {[1, 2, 3, 4].map(n => (
                <div
                  key={n}
                  className='h-14 w-full animate-pulse rounded-2xl bg-[#919EAB14]'
                />
              ))}
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className='mx-2 mt-8 rounded-3xl border border-dashed border-[#919EAB52] bg-white/70 p-6 text-center'>
              <MessageEmptyIcon />
              <p className='mt-3 text-sm font-bold text-[#637381]'>
                Chưa có đoạn chat phù hợp
              </p>
              <p className='mt-1 text-xs leading-relaxed text-[#919EAB]'>
                Tạo đoạn chat mới hoặc thử tìm bằng từ khóa khác.
              </p>
            </div>
          ) : (
            <div className='space-y-1.5'>
              {filteredConversations.map(chat => {
                const isActive = activeConversationId === chat.conversationId;

                return (
                  <div
                    key={chat.id}
                    className={cn(
                      'group relative flex items-center rounded-2xl border px-2 py-1.5 transition-all',
                      isActive
                        ? 'border-[#E4722C29] bg-[#E4722C14] shadow-sm'
                        : 'border-transparent hover:border-[#919EAB29] hover:bg-white'
                    )}
                  >
                    <button
                      onClick={() => {
                        setActiveConversationId(chat.conversationId);
                        setIsMobileSidebarOpen(false);
                      }}
                      className='flex min-w-0 flex-1 items-center gap-3 rounded-xl px-2 py-2 text-left'
                    >
                      <span
                        className={cn(
                          'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
                          isActive
                            ? 'bg-[#E4722C] text-white'
                            : 'bg-[#919EAB14] text-[#637381]'
                        )}
                      >
                        <Bot size={17} />
                      </span>
                      <span className='min-w-0'>
                        <span
                          className={cn(
                            'block truncate text-sm font-bold',
                            isActive ? 'text-[#C45E1F]' : 'text-[#637381]'
                          )}
                        >
                          {chat.title}
                        </span>
                        <span className='block truncate text-[11px] font-medium text-[#919EAB]'>
                          Tiếp tục hội thoại
                        </span>
                      </span>
                    </button>

                    <div className='flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100'>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setRenameTarget({ id: chat.id, title: chat.title });
                        }}
                        className='rounded-lg p-1.5 text-[#919EAB] transition hover:bg-white hover:text-[#E4722C]'
                        title='Đổi tên đoạn chat'
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setDeleteConfirmId(chat.id);
                        }}
                        className='rounded-lg p-1.5 text-[#919EAB] transition hover:bg-red-50 hover:text-red-500'
                        title='Xóa đoạn chat'
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </aside>

      <main className='relative flex min-w-0 flex-1 flex-col overflow-hidden'>
        <header className='z-20 flex min-h-16 shrink-0 items-center justify-between border-b border-white/70 bg-white/75 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-10'>
          <div className='flex min-w-0 items-center gap-3'>
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className='flex h-10 w-10 items-center justify-center rounded-2xl border border-[#919EAB52] bg-white text-[#637381] shadow-sm transition hover:border-[#E4722C52] hover:text-[#E4722C] lg:hidden'
              title='Mở danh sách chat'
            >
              <Menu size={20} />
            </button>

            <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#E4722C] text-white shadow-lg shadow-[#E4722C40]'>
              <GraduationCap size={22} />
            </div>

            <div className='min-w-0'>
              <div className='flex items-center gap-2'>
                <h1 className='truncate text-base font-black text-[#212B36] sm:text-lg'>
                  {activeConversationTitle}
                </h1>
                <span className='hidden rounded-full bg-[#4CAF5014] px-2.5 py-1 text-[11px] font-bold text-[#4CAF50] sm:inline-flex'>
                  Online
                </span>
              </div>
              <p className='truncate text-xs font-medium text-[#637381] sm:text-sm'>
                Hỏi đáp học tập, chuyên đề và di sản vinyl
              </p>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            {activeConversationId && (
              <button
                onClick={() => {
                  const activeRecord = conversations?.find(
                    item => item.conversationId === activeConversationId
                  );
                  if (activeRecord)
                    setRenameTarget({
                      id: activeRecord.id,
                      title: activeRecord.title,
                    });
                }}
                className='hidden rounded-2xl border border-[#919EAB52] bg-white px-3 py-2 text-sm font-bold text-[#637381] shadow-sm transition hover:border-[#E4722C52] hover:text-[#E4722C] sm:inline-flex'
              >
                <Edit2 size={16} className='mr-2' />
                Đổi tên
              </button>
            )}

            <button
              onClick={resetChatDraft}
              className='flex h-10 w-10 items-center justify-center rounded-2xl bg-[#E4722C] text-white shadow-lg shadow-[#E4722C]/20 transition hover:bg-[#C45E1F] sm:h-auto sm:w-auto sm:px-4 sm:py-2.5 sm:text-sm sm:font-bold'
              title='Đoạn chat mới'
            >
              <Plus size={18} />
              <span className='ml-2 hidden sm:inline'>Chat mới</span>
            </button>
          </div>
        </header>

        <section className='flex-1 overflow-y-auto px-4 py-5 sm:px-6 lg:px-10 lg:py-8'>
          <div className='mx-auto max-w-5xl'>
            {!hasMessages && !isLoadingDetail && (
              <WelcomeHero onSuggestionClick={handleSendMessage} />
            )}

            {isLoadingDetail ? (
              <div className='flex min-h-[60vh] items-center justify-center'>
                <div className='flex flex-col items-center gap-4 rounded-3xl border border-white/70 bg-white px-8 py-7 shadow-xl shadow-[#212B36]/5 backdrop-blur'>
                  <Loader2 className='h-8 w-8 animate-spin text-[#E4722C]' />
                  <p className='text-sm font-bold text-[#637381]'>
                    Đang tải lịch sử đoạn chat...
                  </p>
                </div>
              </div>
            ) : (
              <div className='space-y-6'>
                {renderedMessages.map(msg => (
                  <MessageBubble
                    key={msg.id}
                    message={msg}
                    renderRichText={renderRichText}
                  />
                ))}

                {tempUserMessage && (
                  <MessageBubble
                    message={{
                      id: 'temp-user-message',
                      role: 'user',
                      content: tempUserMessage.content,
                      imageUrls: tempUserMessage.imageUrls,
                    }}
                    renderRichText={renderRichText}
                    isTemporary
                  />
                )}

                {sendMutation.isPending && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </section>

        <footer className='shrink-0 border-t border-white/70 bg-white/70 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-10'>
          <div className='mx-auto max-w-5xl'>
            {attachmentPreviews.length > 0 && (
              <div className='mb-3 flex flex-wrap gap-2 rounded-3xl border border-[#919EAB52] bg-white/90 p-3 shadow-sm'>
                {attachmentPreviews.map((item, index) => (
                  <div
                    key={`${item.file.name}-${index}`}
                    className='group relative h-20 w-20 overflow-hidden rounded-2xl border border-[#919EAB52] bg-[#919EAB14]'
                  >
                    <img
                      src={item.url}
                      alt={item.file.name}
                      className='h-full w-full object-cover'
                    />
                    <button
                      onClick={() => removeAttachedFile(index)}
                      className='absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#212B36]/75 text-white opacity-90 transition hover:bg-red-500'
                      title='Xóa ảnh'
                    >
                      <X size={13} />
                    </button>
                    <div className='absolute right-0 bottom-0 left-0 bg-[#212B36]/55 px-1.5 py-1 text-[10px] font-semibold text-white'>
                      <span className='block truncate'>{item.file.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className='rounded-[28px] border border-[#919EAB52] bg-white p-2 shadow-[0_18px_55px_rgba(33,43,54,0.10)]'>
              <input
                type='file'
                multiple
                accept='image/*'
                ref={fileInputRef}
                onChange={handleFileChange}
                className='hidden'
              />

              <div className='flex items-end gap-2'>
                <button
                  onClick={handleAttachmentClick}
                  className='mb-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-[#637381] transition hover:bg-[#919EAB14] hover:text-[#E4722C]'
                  title='Đính kèm ảnh'
                >
                  <Paperclip size={21} strokeWidth={1.8} />
                </button>

                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      if (canSend) handleSendMessage();
                    }
                  }}
                  rows={1}
                  placeholder='Hỏi về chuyên đề, thử thách hoặc di sản vinyl...'
                  className='max-h-40 min-h-12 flex-1 resize-none bg-transparent py-3 text-[15px] leading-relaxed font-semibold text-[#212B36] placeholder:text-[#919EAB] focus:outline-none'
                />

                <button
                  onClick={handleMicClick}
                  className={cn(
                    'mb-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition',
                    isListening
                      ? 'animate-pulse bg-red-50 text-red-500 ring-4 ring-red-100'
                      : 'text-[#637381] hover:bg-[#919EAB14] hover:text-[#E4722C]'
                  )}
                  title={isListening ? 'Dừng ghi âm' : 'Ghi âm giọng nói'}
                >
                  <Mic size={21} strokeWidth={1.8} />
                </button>

                <button
                  onClick={() => handleSendMessage()}
                  disabled={!canSend}
                  className={cn(
                    'mb-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg transition-all active:scale-95',
                    canSend
                      ? 'bg-[#E4722C] shadow-[#E4722C40] hover:bg-[#C45E1F]'
                      : 'cursor-not-allowed bg-[#919EAB52] shadow-none'
                  )}
                  title='Gửi tin nhắn'
                >
                  {sendMutation.isPending ? (
                    <Loader2 size={20} className='animate-spin' />
                  ) : (
                    <Send size={19} />
                  )}
                </button>
              </div>

              <div className='flex flex-wrap items-center justify-between gap-2 border-t border-[#919EAB29] px-3 pt-2 pb-1'>
                <p className='flex items-center gap-1.5 text-[11px] font-semibold text-[#919EAB]'>
                  <AlertTriangle size={13} />
                  AI hỗ trợ tham khảo, không thay thế hướng dẫn chính thức.
                </p>
                <p className='text-[11px] font-semibold text-[#919EAB]'>
                  Enter để gửi · Shift + Enter để xuống dòng
                </p>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {deleteConfirmId && (
        <ConfirmModal
          icon={<Trash2 size={28} />}
          iconClassName='bg-red-50 text-red-500'
          title='Xóa đoạn chat?'
          description='Bạn có chắc chắn muốn xóa đoạn chat này không? Hành động này không thể hoàn tác.'
          cancelText='Hủy bỏ'
          confirmText={deleteMutation.isPending ? 'Đang xóa...' : 'Xóa'}
          confirmClassName='bg-red-500 text-white hover:bg-red-600'
          disabled={deleteMutation.isPending}
          onCancel={() => setDeleteConfirmId(null)}
          onConfirm={async () => {
            if (!deleteConfirmId) return;
            await handleDeleteConversation(deleteConfirmId);
            setDeleteConfirmId(null);
          }}
        />
      )}

      {renameTarget && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-[#212B36]/45 p-4 backdrop-blur-sm'>
          <button className='absolute inset-0' onClick={() => setRenameTarget(null)} />

          <div className='relative w-full max-w-[440px] rounded-[32px] border border-white/70 bg-white p-7 shadow-2xl shadow-[#212B36]/15'>
            <div className='mb-5 flex items-center gap-3'>
              <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E4722C14] text-[#E4722C]'>
                <Edit2 size={22} />
              </div>
              <div>
                <h3 className='text-lg font-black text-[#212B36]'>
                  Đổi tên đoạn chat
                </h3>
                <p className='text-sm font-medium text-[#637381]'>
                  Đặt tên ngắn gọn để dễ tìm lại sau này.
                </p>
              </div>
            </div>

            <input
              type='text'
              value={renameTarget.title}
              onChange={e =>
                setRenameTarget({ ...renameTarget, title: e.target.value })
              }
              placeholder='Nhập tên đoạn chat mới...'
              className='mb-6 h-14 w-full rounded-2xl border border-[#919EAB52] bg-white px-5 text-sm font-bold text-[#637381] placeholder:text-[#919EAB] focus:border-[#E4722C] focus:ring-4 focus:ring-[#E4722C29] focus:outline-none'
              autoFocus
            />

            <div className='flex justify-end gap-3'>
              <button
                type='button'
                onClick={() => setRenameTarget(null)}
                className='rounded-2xl bg-[#919EAB14] px-5 py-3 text-sm font-bold text-[#637381] transition hover:bg-[#919EAB29]'
              >
                Hủy bỏ
              </button>
              <button
                type='button'
                onClick={async () => {
                  if (!renameTarget.title.trim()) return;
                  try {
                    await renameMutation.mutateAsync({
                      id: renameTarget.id,
                      title: renameTarget.title.trim(),
                    });
                    setRenameTarget(null);
                  } catch (err) {
                    console.error('Failed to rename conversation:', err);
                  }
                }}
                disabled={
                  renameMutation.isPending || !renameTarget.title.trim()
                }
                className='rounded-2xl bg-[#E4722C] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#E4722C33] transition hover:bg-[#C45E1F] disabled:cursor-not-allowed disabled:opacity-50'
              >
                {renameMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function WelcomeHero({
  onSuggestionClick,
}: {
  onSuggestionClick: (prompt: string) => void;
}) {
  return (
    <div className='mb-8 overflow-hidden rounded-[36px] border border-white/80 bg-white shadow-2xl shadow-[#212B36]/5 backdrop-blur-xl'>
      <div className='relative px-5 py-6 sm:px-8 sm:py-8 lg:px-10'>
        <div className='absolute top-0 right-0 h-40 w-40 rounded-full bg-[#E4722C33] blur-3xl' />
        <div className='absolute bottom-0 left-0 h-32 w-32 rounded-full bg-[#FFB16933] blur-3xl' />

        <div className='relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center'>
          <div>
            <div className='mb-4 inline-flex items-center gap-2 rounded-full border border-[#E4722C29] bg-[#E4722C14] px-3 py-1.5 text-xs font-black text-[#E4722C]'>
              <Sparkles size={15} />
              Vinyl AI Bot
            </div>

            <h2 className='max-w-2xl text-2xl leading-tight font-black tracking-tight text-[#212B36] sm:text-3xl lg:text-4xl'>
              Học nhanh hơn với trợ lý AI hiểu ngữ cảnh Chuyên đề của bạn.
            </h2>

            <p className='mt-4 max-w-2xl text-sm leading-7 font-medium text-[#637381] sm:text-base'>
              Bạn có thể hỏi về chuyên đề, nhờ gợi ý luyện thử thách hoặc khám
              phá câu chuyện đằng sau di sản vinyl Việt Nam.
            </p>

            <div className='mt-5 grid gap-3 sm:grid-cols-3'>
              <InfoPill
                icon={<ShieldCheck size={16} />}
                label='An toàn hơn'
                text='Không chia sẻ công khai'
              />
              <InfoPill
                icon={<Clock3 size={16} />}
                label='Nhanh chóng'
                text='Trả lời theo ngữ cảnh'
              />
              <InfoPill
                icon={<BookOpen size={16} />}
                label='Học tập'
                text='Chuyên đề'
              />
            </div>
          </div>

          <div className='rounded-[28px] border border-[#919EAB29] bg-[#212B36] p-5 text-white shadow-2xl shadow-[#212B36]/20'>
            <div className='mb-5 flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E4722C] text-white'>
                  <GraduationCap size={23} />
                </div>
                <div>
                  <p className='text-sm font-black'>Learning Brief</p>
                  <p className='text-xs font-medium text-white/50'>
                    Gợi ý bắt đầu
                  </p>
                </div>
              </div>
              <CheckCircle2 size={20} className='text-[#4CAF50]' />
            </div>

            <div className='space-y-3'>
              {[
                'Đĩa nhạc Vinyl là gì?',
                'Vinyl Việt Nam có gì đặc biệt?',
              ].map(item => (
                <div
                  key={item}
                  className='flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3'
                >
                  <span className='text-sm font-semibold text-white/85'>
                    {item}
                  </span>
                  <ChevronRight size={16} className='text-white/35' />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className='relative mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4'>
          {SUGGESTIONS.map(suggestion => (
            <button
              key={suggestion.title}
              onClick={() => onSuggestionClick(suggestion.prompt)}
              className='group rounded-[26px] border border-[#919EAB29] bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-[#E4722C29] hover:shadow-xl hover:shadow-[#E4722C14]'
            >
              <span className='mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E4722C14] text-[#E4722C] transition group-hover:bg-[#E4722C] group-hover:text-white'>
                {suggestion.icon}
              </span>
              <span className='block text-sm font-black text-[#212B36]'>
                {suggestion.title}
              </span>
              <span className='mt-1 block text-xs leading-relaxed font-medium text-[#637381]'>
                {suggestion.description}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function MessageBubble({
  message,
  renderRichText,
  isTemporary,
}: {
  message: any;
  renderRichText: (content: string) => React.ReactNode;
  isTemporary?: boolean;
}) {
  const isAi =
    message.role === 'ai' ||
    message.role === 'assistant' ||
    message.role === 'system';
  const imageList = message.imageUrls || message.images || [];

  return (
    <div
      className={cn('flex gap-3 sm:gap-4', isAi ? 'justify-start' : 'justify-end')}
    >
      {isAi && <Avatar type='ai' />}

      <div
        className={cn(
          'flex max-w-[88%] flex-col',
          isAi ? 'items-start' : 'items-end'
        )}
      >
        <div
          className={cn(
            'rounded-[28px] px-5 py-4 text-sm leading-7 shadow-sm sm:px-6 sm:py-5',
            isAi
              ? 'border border-[#919EAB29] bg-white text-[#212B36] shadow-[#212B36]/5'
              : 'bg-gradient-to-br from-[#E4722C] to-[#C45E1F] text-white shadow-[#E4722C26]'
          )}
        >
          <div className='font-medium whitespace-pre-wrap'>
            {isAi ? renderRichText(message.content || '') : message.content}
          </div>

          {imageList.length > 0 && (
            <div className='mt-4 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap'>
              {imageList.map((imgUrl: string, index: number) => (
                <a
                  key={`${imgUrl}-${index}`}
                  href={imgUrl}
                  target='_blank'
                  rel='noreferrer'
                  className='block h-32 w-full overflow-hidden rounded-2xl border border-white/40 bg-[#919EAB14] sm:w-32'
                >
                  <img
                    src={imgUrl}
                    alt='Uploaded attachment'
                    className='h-full w-full object-cover'
                  />
                </a>
              ))}
            </div>
          )}
        </div>

        <div
          className={cn(
            'mt-1.5 flex items-center gap-2 px-2 text-[11px] font-semibold',
            isAi ? 'text-[#919EAB]' : 'text-[#E4722C]/70'
          )}
        >
          {isTemporary ? (
            <>
              <Loader2 size={12} className='animate-spin' /> Đang gửi
            </>
          ) : isAi ? (
            <>Vinyl AI</>
          ) : (
            <>Bạn</>
          )}
        </div>
      </div>

      {!isAi && <Avatar type='user' />}
    </div>
  );
}

function Avatar({ type }: { type: 'ai' | 'user' }) {
  return (
    <div
      className={cn(
        'mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl shadow-sm sm:h-10 sm:w-10',
        type === 'ai'
          ? 'bg-[#212B36] text-white'
          : 'bg-white text-[#E4722C]'
      )}
    >
      {type === 'ai' ? <Bot size={18} /> : <User size={18} />}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className='flex justify-start gap-4'>
      <Avatar type='ai' />
      <div className='rounded-[28px] border border-[#919EAB29] bg-white px-5 py-4 shadow-sm'>
        <div className='flex items-center gap-3'>
          <Loader2 size={16} className='animate-spin text-[#E4722C]' />
          <span className='text-sm font-bold text-[#637381]'>
            Vinyl AI đang suy nghĩ...
          </span>
        </div>
        <div className='mt-2 flex gap-1.5'>
          <span className='h-1.5 w-1.5 animate-bounce rounded-full bg-[#E4722C]' />
          <span className='h-1.5 w-1.5 animate-bounce rounded-full bg-[#E4722C] [animation-delay:120ms]' />
          <span className='h-1.5 w-1.5 animate-bounce rounded-full bg-[#E4722C] [animation-delay:240ms]' />
        </div>
      </div>
    </div>
  );
}

function InfoPill({
  icon,
  label,
  text,
}: {
  icon: React.ReactNode;
  label: string;
  text: string;
}) {
  return (
    <div className='rounded-2xl border border-[#919EAB29] bg-white/70 p-3'>
      <div className='mb-1 flex items-center gap-2 text-xs font-black text-[#212B36]'>
        <span className='text-[#E4722C]'>{icon}</span>
        {label}
      </div>
      <p className='text-[11px] font-semibold text-[#637381]'>{text}</p>
    </div>
  );
}

function MessageEmptyIcon() {
  return (
    <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#919EAB14] text-[#919EAB]'>
      <Bot size={22} />
    </div>
  );
}

function ConfirmModal({
  icon,
  iconClassName,
  title,
  description,
  cancelText,
  confirmText,
  confirmClassName,
  disabled,
  onCancel,
  onConfirm,
}: {
  icon: React.ReactNode;
  iconClassName: string;
  title: string;
  description: string;
  cancelText: string;
  confirmText: string;
  confirmClassName: string;
  disabled?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-[#212B36]/45 p-4 backdrop-blur-sm'>
      <button className='absolute inset-0' onClick={onCancel} />

      <div className='relative flex w-full max-w-[410px] flex-col items-center rounded-[32px] border border-white/70 bg-white p-8 text-center shadow-2xl shadow-[#212B36]/15'>
        <div
          className={cn(
            'mb-4 flex h-16 w-16 items-center justify-center rounded-3xl',
            iconClassName
          )}
        >
          {icon}
        </div>
        <h3 className='mb-2 text-lg font-black text-[#212B36]'>{title}</h3>
        <p className='mb-7 text-sm leading-relaxed font-medium text-[#637381]'>
          {description}
        </p>

        <div className='flex w-full gap-3'>
          <button
            type='button'
            onClick={onCancel}
            className='flex-1 rounded-2xl bg-[#919EAB14] py-3 text-sm font-bold text-[#637381] transition hover:bg-[#919EAB29]'
          >
            {cancelText}
          </button>
          <button
            type='button'
            onClick={onConfirm}
            disabled={disabled}
            className={cn(
              'flex-1 rounded-2xl py-3 text-sm font-bold shadow-lg transition disabled:cursor-not-allowed disabled:opacity-50',
              confirmClassName
            )}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
