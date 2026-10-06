'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronDown, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import QuestionModal, {
  QuestionModalResult,
} from '@/components/admin/challenge/QuestionModal';
import { Category, Edit, Warning2 } from 'iconsax-react';
import { Switch } from '@/components/ui/switch';
import {
  useCreateChallenge,
  useUpdateChallenge,
  useGetChallengeById,
} from '@/modules/admin/hooks/useChallengeAdmin';
import {
  CreateChallengeRequest,
  CreateQuestion,
  CreateOrdering,
  CreateFillBlank,
  CreatePuzzle,
} from '@/modules/admin/domain/challengeSchema';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

export default function CreateChallengeClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');
  const isEditMode = !!editId;

  // API hooks
  const createChallengeMutation = useCreateChallenge();
  const updateChallengeMutation = useUpdateChallenge();
  const {
    data: existingChallenge,
    isLoading: isLoadingChallenge,
    error: challengeError,
  } = useGetChallengeById(editId || '', isEditMode);

  // Form state
  const [challengeType, setChallengeType] = React.useState<
    'quiz' | 'ordering' | 'fillBlank' | 'puzzle'
  >('quiz');
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [published, setPublished] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Quiz questions state
  const [questions, setQuestions] = React.useState<
    Array<{
      id: string;
      question: string;
      explanation?: string;
      answers: Array<{ answer: string; is_correct: boolean }>;
      type: 'single' | 'multiple' | 'fill';
    }>
  >([]);

  // Fill blank questions state
  const [fillBlankQuestions, setFillBlankQuestions] = React.useState<
    Array<{ id: string; sentence: string; correct_word: string }>
  >([]);

  // Ordering items state
  const [timelineItems, setTimelineItems] = React.useState<
    Array<{ id: string; content: string; correct_order: number }>
  >([]);

  // Puzzle state
  const [puzzleData, setPuzzleData] = React.useState<{
    instruction: string;
    image: string;
  }>({ instruction: '', image: '' });
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string>('');

  // Question modal state
  const [isQuestionModalOpen, setIsQuestionModalOpen] = React.useState(false);
  const [editingQuestionIndex, setEditingQuestionIndex] = React.useState<
    number | null
  >(null);

  // Effect to populate form when editing
  React.useEffect(() => {
    if (isEditMode && existingChallenge) {
      const challenge = existingChallenge as any; // Cast to any to handle dynamic API structure

      setTitle(challenge.title);
      setDescription(challenge.description);
      setChallengeType(challenge.type);
      setPublished(challenge.status === 'published');

      // Populate type-specific data based on challenge type
      if (challenge.type === 'quiz') {
        // Use data.questions if available, fallback to questions
        const questionsData =
          challenge.data?.questions || challenge.questions || [];
        setQuestions(
          questionsData.map((q: any, index: number) => ({
            id: q.id || `q${index + 1}`,
            question: q.question,
            explanation: q.explanation,
            answers: q.answers || [],
            type:
              q.answers?.filter((a: any) => a.is_correct).length > 1
                ? ('multiple' as const)
                : ('single' as const),
          }))
        );
      } else if (challenge.type === 'fillBlank') {
        // Use fillBlankChallenge.questions or data.questions
        const fillBlankData =
          challenge.fillBlankChallenge?.questions ||
          challenge.data?.questions ||
          [];
        setFillBlankQuestions(
          fillBlankData.map((q: any, index: number) => ({
            id: q.id || `fq${index + 1}`,
            sentence: q.sentence,
            correct_word: q.correct_word,
          }))
        );
      } else if (challenge.type === 'ordering') {
        // Use orderingChallenge.items or data.items
        const orderingData =
          challenge.orderingChallenge?.items || challenge.data?.items || [];
        const instruction =
          challenge.orderingChallenge?.instruction ||
          challenge.data?.instruction ||
          '';

        setTimelineItems(
          orderingData.map((item: any, index: number) => ({
            id: item.id || `t${index + 1}`,
            content: item.content,
            correct_order: item.correct_order,
          }))
        );
      } else if (challenge.type === 'puzzle') {
        // Use puzzleChallenge or data
        const puzzleDataFromAPI =
          challenge.puzzleChallenge || challenge.data || {};
        setPuzzleData({
          instruction: puzzleDataFromAPI.instruction || '',
          image: puzzleDataFromAPI.image || '',
        });

        // If there's an existing image, set it as preview
        if (puzzleDataFromAPI.image) {
          const imageUrl = puzzleDataFromAPI.image.startsWith('http')
            ? puzzleDataFromAPI.image
            : `https://res.cloudinary.com/db1ema3b7/image/upload/${puzzleDataFromAPI.image}`;
          setPreviewUrl(imageUrl);
        }
      }
    }
  }, [isEditMode, existingChallenge]);

  // Helper functions
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const addQuestion = () => {
    setEditingQuestionIndex(null);
    setIsQuestionModalOpen(true);
  };

  // File upload handlers
  const handleFileSelect = (file: File) => {
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      toast.error('Chỉ hỗ trợ file JPG, JPEG, PNG');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('Kích thước file không được vượt quá 5MB');
      return;
    }

    setSelectedFile(file);

    // Create preview URL
    const reader = new FileReader();
    reader.onload = e => {
      const result = e.target?.result as string;
      setPreviewUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data:image/jpeg;base64, prefix to get only base64 string
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const removeImage = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setPuzzleData(prev => ({ ...prev, image: '' }));
  };

  const addTimelineItem = () => {
    setTimelineItems(prev => [
      ...prev,
      {
        id: `t${prev.length + 1}`,
        content: '',
        correct_order: prev.length,
      },
    ]);
  };

  // Form validation
  const validateForm = (): string[] => {
    const errors: string[] = [];

    if (!title.trim()) {
      errors.push('Tiêu đề là bắt buộc');
    }

    if (title.length > 30) {
      errors.push('Tiêu đề không được vượt quá 30 ký tự');
    }

    if (challengeType === 'quiz' || challengeType === 'fillBlank') {
      if (challengeType === 'quiz' && questions.length === 0) {
        errors.push('Cần có ít nhất một câu hỏi');
      }
      if (challengeType === 'fillBlank' && fillBlankQuestions.length === 0) {
        errors.push('Cần có ít nhất một câu hỏi điền từ');
      }
    } else if (challengeType === 'ordering') {
      if (timelineItems.length < 2) {
        errors.push('Cần có ít nhất 2 sự kiện để sắp xếp');
      }
      if (timelineItems.some(item => !item.content.trim())) {
        errors.push('Tất cả sự kiện phải có nội dung');
      }
    } else if (challengeType === 'puzzle') {
      if (!puzzleData.instruction.trim()) {
        errors.push('Hướng dẫn puzzle là bắt buộc');
      }
      if (!puzzleData.image.trim() && !selectedFile) {
        errors.push('Hình ảnh puzzle là bắt buộc');
      }
    }

    return errors;
  };

  // Form submission
  const handleSubmit = async () => {
    const errors = validateForm();
    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
      return;
    }

    setIsSubmitting(true);

    try {
      const challengeData: CreateChallengeRequest = {
        title: title.trim(),
        slug: generateSlug(title),
        description: description.trim() || title.trim(),
        type: challengeType,
        order: 0,
        status: published ? 'published' : 'draft',
      };

      // Add type-specific data
      if (challengeType === 'quiz') {
        challengeData.questions = questions.map(q => ({
          question: q.question,
          explanation: q.explanation,
          answers: q.answers,
        }));
      } else if (challengeType === 'fillBlank') {
        challengeData.fillBlank = {
          questions: fillBlankQuestions.map(q => ({
            sentence: q.sentence,
            correct_word: q.correct_word,
          })),
        };
      } else if (challengeType === 'ordering') {
        challengeData.ordering = {
          instruction: 'Sắp xếp các sự kiện theo thứ tự thời gian',
          items: timelineItems.map((item, index) => ({
            content: item.content,
            correct_order: index,
          })),
        };
      } else if (challengeType === 'puzzle') {
        let imageData = puzzleData.image;

        // If user selected a new file, convert to base64
        if (selectedFile) {
          imageData = await convertFileToBase64(selectedFile);
        }

        challengeData.puzzle = {
          instruction: puzzleData.instruction,
          image: imageData,
        };
      }

      if (isEditMode && editId) {
        await updateChallengeMutation.mutateAsync({
          id: editId,
          data: challengeData,
        });
      } else {
        await createChallengeMutation.mutateAsync(challengeData);
      }

      // Navigate back to challenges list
      router.push('/admin/discovery-activities');
    } catch (error) {
      // Error is handled in the mutation hooks
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state when editing
  if (isEditMode && isLoadingChallenge) {
    return (
      <div className='p-6 flex items-center justify-center'>
        <div className='text-gray-500'>Đang tải dữ liệu...</div>
      </div>
    );
  }

  // Show error state if failed to load challenge
  if (isEditMode && challengeError) {
    return (
      <div className='p-6 flex items-center justify-center'>
        <div className='text-red-500'>
          Có lỗi xảy ra khi tải thông tin thử thách. Vui lòng thử lại.
          <br />
          <button
            onClick={() => router.back()}
            className='mt-2 text-blue-500 hover:underline'
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='p-6 space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            {isEditMode ? 'Chỉnh sửa thử thách' : 'Thêm thử thách'}
          </h1>
          {/* Breadcrumb */}
          <div className='flex items-center space-x-2 text-sm text-gray-600 mt-1'>
            <span>Bảng điều khiển</span>
            <span className='w-1 h-1 bg-gray-400 rounded-full'></span>
            <span>Thử thách</span>
            <span className='w-1 h-1 bg-gray-400 rounded-full'></span>
            <span className='text-gray-900'>
              {isEditMode ? 'Chỉnh sửa thử thách' : 'Thêm thử thách'}
            </span>
          </div>
        </div>
      </div>

      <div className='bg-white rounded-xl p-6 space-y-6'>
        {/* Details */}
        <div className='space-y-4'>
          <label className='text-sm font-semibold text-[#212B36]'>
            Tiêu đề
          </label>
          <Input
            placeholder='Tiêu đề'
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <div className='flex gap-1 items-center text-xs text-[#637381]'>
            <Warning2 size='16' color='#637381' variant='Bold' />
            Tiêu đề dài tối đa 30 ký tự
          </div>

          <label className='text-sm font-semibold text-[#212B36]'>
            Mô tả (tùy chọn)
          </label>
          <Input
            placeholder='Mô tả thử thách'
            value={description}
            onChange={e => setDescription(e.target.value)}
          />

          <div className='grid grid-cols-1'>
            {/* Type */}
            <div className='space-y-2'>
              <label className='text-sm font-semibold text-[#212B36]'>
                Loại
              </label>
              <div className='relative'>
                <select
                  value={challengeType}
                  onChange={e => setChallengeType(e.target.value as any)}
                  className='appearance-none w-full px-4 h-[44px] py-2 border border-[#919EAB52] rounded-[10px] text-sm bg-white text-gray-900 cursor-pointer pr-10'
                >
                  <option value='quiz'>Câu hỏi vui</option>
                  <option value='ordering'>Sắp xếp</option>
                  <option value='fillBlank'>Điền từ</option>
                  <option value='puzzle'>Ghép hình</option>
                </select>
                <div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
                  <ChevronDown className='w-4 h-4 text-gray-400' />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Type specific sections */}
        {(challengeType === 'quiz' || challengeType === 'fillBlank') && (
          <div className='space-y-3'>
            <label className='text-sm font-semibold text-[#212B36]'>
              Bộ câu hỏi
            </label>
            {challengeType === 'quiz'
              ? questions.map((q, idx) => (
                  <div
                    key={q.id}
                    className='flex items-center justify-between border rounded-lg px-4 py-3'
                  >
                    <div className='flex gap-2'>
                      <Category size='20' color='#919EAB' variant='Bold' />
                      <div className='text-sm text-gray-800'>
                        {q.question || `Câu hỏi ${idx + 1}`}
                      </div>
                    </div>

                    <div className='flex gap-1 items-center'>
                      <div className='text-xs text-gray-500 mr-2'>
                        {q.type === 'single'
                          ? 'Một đáp án'
                          : q.type === 'multiple'
                            ? 'Nhiều đáp án'
                            : 'Điền từ'}
                      </div>
                      <button
                        onClick={() => {
                          setEditingQuestionIndex(idx);
                          setIsQuestionModalOpen(true);
                        }}
                        className='p-1 hover:bg-gray-100 rounded'
                        title='Chỉnh sửa câu hỏi'
                      >
                        <Edit size='16' color='#637381' />
                      </button>
                      {questions.length > 1 && (
                        <button
                          onClick={() => {
                            setQuestions(prev =>
                              prev.filter((_, index) => index !== idx)
                            );
                          }}
                          className='p-1 hover:bg-red-100 rounded'
                          title='Xóa câu hỏi'
                        >
                          <Trash2 size='16' color='#ef4444' />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              : fillBlankQuestions.map((q, idx) => (
                  <div
                    key={q.id}
                    className='flex items-center justify-between border rounded-lg px-4 py-3'
                  >
                    <div className='flex gap-2'>
                      <Category size='20' color='#919EAB' variant='Bold' />
                      <div className='text-sm text-gray-800'>
                        {q.sentence || `Câu hỏi ${idx + 1}`}
                      </div>
                    </div>

                    <div className='flex gap-1 items-center'>
                      <div className='text-xs text-gray-500 mr-2'>Điền từ</div>
                      <button
                        onClick={() => {
                          setEditingQuestionIndex(idx);
                          setIsQuestionModalOpen(true);
                        }}
                        className='p-1 hover:bg-gray-100 rounded'
                        title='Chỉnh sửa câu hỏi'
                      >
                        <Edit size='16' color='#637381' />
                      </button>
                      {fillBlankQuestions.length > 1 && (
                        <button
                          onClick={() => {
                            setFillBlankQuestions(prev =>
                              prev.filter((_, index) => index !== idx)
                            );
                          }}
                          className='p-1 hover:bg-red-100 rounded'
                          title='Xóa câu hỏi'
                        >
                          <Trash2 size='16' color='#ef4444' />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            <Button
              variant='outline'
              onClick={addQuestion}
              className='w-full bg-[#919EAB14] border-[#919EAB14]'
            >
              <Plus className='w-4 h-4 mr-2' /> Thêm câu hỏi
            </Button>
          </div>
        )}

        {challengeType === 'ordering' && (
          <div className='space-y-3'>
            <label className='text-sm font-medium text-[#212B36]'>
              Dòng thời gian
            </label>
            {timelineItems.map((item, idx) => (
              <div key={item.id} className='flex items-center gap-3'>
                <Input
                  placeholder='Nội dung sự kiện'
                  value={item.content}
                  onChange={e => {
                    const v = e.target.value;
                    setTimelineItems(prev =>
                      prev.map(it =>
                        it.id === item.id ? { ...it, content: v } : it
                      )
                    );
                  }}
                  className='flex-1'
                />
                {timelineItems.length > 2 && (
                  <button
                    onClick={() => {
                      setTimelineItems(prev =>
                        prev.filter((_, index) => index !== idx)
                      );
                    }}
                    className='p-2 hover:bg-red-100 rounded'
                    title='Xóa sự kiện'
                  >
                    <Trash2 size='16' color='#ef4444' />
                  </button>
                )}
              </div>
            ))}
            <Button
              variant='outline'
              onClick={addTimelineItem}
              className='w-full'
            >
              <Plus className='w-4 h-4 mr-2' /> Thêm sự kiện
            </Button>
          </div>
        )}

        {challengeType === 'puzzle' && (
          <div className='space-y-4'>
            <div className='space-y-2'>
              <label className='text-sm font-semibold text-[#212B36]'>
                Hướng dẫn
              </label>
              <Input
                placeholder='Nhập hướng dẫn cho puzzle'
                value={puzzleData.instruction}
                onChange={e =>
                  setPuzzleData(prev => ({
                    ...prev,
                    instruction: e.target.value,
                  }))
                }
              />
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-semibold text-[#212B36]'>
                Hình ảnh
              </label>

              {/* Show preview image if exists */}
              {(previewUrl || puzzleData.image) && (
                <div className='mb-4'>
                  <div className='text-sm text-gray-600 mb-2'>
                    {selectedFile ? 'Hình ảnh đã chọn:' : 'Hình ảnh hiện tại:'}
                  </div>
                  <div className='relative inline-block'>
                    <img
                      src={
                        previewUrl ||
                        (puzzleData.image.startsWith('http')
                          ? puzzleData.image
                          : `https://res.cloudinary.com/db1ema3b7/image/upload/${puzzleData.image}`)
                      }
                      alt='Puzzle image'
                      className='w-32 h-32 object-cover rounded-lg border'
                    />
                    <button
                      onClick={removeImage}
                      className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600'
                      title='Xóa hình ảnh'
                    >
                      ×
                    </button>
                  </div>
                  {selectedFile && (
                    <div className='mt-2 text-sm text-gray-600'>
                      <div>Tên file: {selectedFile.name}</div>
                      <div>
                        Kích thước:{' '}
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Upload area */}
              {!previewUrl && !puzzleData.image && (
                <div
                  className='flex flex-col items-center bg-[#919EAB14] p-4 mt-2 rounded-xl border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer'
                  onDrop={handleFileDrop}
                  onDragOver={handleDragOver}
                  onClick={() =>
                    document.getElementById('puzzle-file-input')?.click()
                  }
                >
                  <div className='w-18 h-18 bg-[#919EAB]/8 rounded-full flex items-center justify-center mb-4'>
                    <Image
                      width={64}
                      height={64}
                      alt='upload'
                      src='/images/upload.png'
                    />
                  </div>
                  <h3 className='text-lg font-medium text-gray-900 mb-2'>
                    Thả hoặc chọn tệp tin
                  </h3>
                  <p className='text-sm text-gray-500 mb-4'>
                    Thả tệp tin vào đây hoặc nhấp để{' '}
                    <span className='text-primary-main hover:underline cursor-pointer'>
                      duyệt
                    </span>{' '}
                    từ máy tính
                  </p>
                  <input
                    id='puzzle-file-input'
                    type='file'
                    accept='image/jpeg,image/jpg,image/png'
                    onChange={handleFileUpload}
                    className='hidden'
                  />
                </div>
              )}

              {/* Change image button when image exists */}
              {(previewUrl || puzzleData.image) && (
                <div className='mt-2'>
                  <button
                    type='button'
                    onClick={() =>
                      document.getElementById('puzzle-file-input')?.click()
                    }
                    className='px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors'
                  >
                    Thay đổi hình ảnh
                  </button>
                  <input
                    id='puzzle-file-input'
                    type='file'
                    accept='image/jpeg,image/jpg,image/png'
                    onChange={handleFileUpload}
                    className='hidden'
                  />
                </div>
              )}

              <div className='text-xs text-gray-500 flex gap-1'>
                <Warning2 size='16' color='#637381' variant='Bold' />
                Kích thước tối đa: 5MB. Hỗ trợ JPG, JPEG, PNG
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <Switch checked={published} onCheckedChange={setPublished} />
            <span className='text-sm'>Xuất bản</span>
          </div>
          <Button
            className='bg-gray-900 hover:bg-gray-800'
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? 'Đang xử lý...'
              : isEditMode
                ? 'Cập nhật thử thách'
                : 'Tạo thử thách'}
          </Button>
        </div>
      </div>

      {/* Question Modal */}
      <QuestionModal
        key={`question-modal-${editingQuestionIndex}-${challengeType}`}
        isOpen={isQuestionModalOpen}
        onClose={() => {
          setIsQuestionModalOpen(false);
          setEditingQuestionIndex(null);
        }}
        defaultMode={challengeType === 'fillBlank' ? 'fill' : 'single'}
        editData={
          editingQuestionIndex !== null
            ? challengeType === 'fillBlank'
              ? {
                  title:
                    fillBlankQuestions[editingQuestionIndex]?.sentence || '',
                  fillAnswer:
                    fillBlankQuestions[editingQuestionIndex]?.correct_word ||
                    '',
                  mode: 'fill' as const,
                  explain: '',
                  hint: '',
                  required: false,
                  random: false,
                }
              : {
                  title: questions[editingQuestionIndex]?.question || '',
                  mode:
                    questions[editingQuestionIndex]?.type === 'multiple'
                      ? ('multiple' as const)
                      : ('single' as const),
                  options:
                    questions[editingQuestionIndex]?.answers?.map((a, idx) => ({
                      id: `o${idx + 1}`,
                      text: a.answer,
                      correct: a.is_correct,
                    })) || [],
                  explain: questions[editingQuestionIndex]?.explanation || '',
                  hint: '',
                  required: false,
                  random: false,
                }
            : undefined
        }
        onSave={(data: QuestionModalResult) => {
          if (challengeType === 'fillBlank') {
            if (editingQuestionIndex !== null) {
              // Edit existing fill blank question
              const existingQuestion = fillBlankQuestions[editingQuestionIndex];
              const updatedQuestion = {
                ...existingQuestion,
                sentence: data.title || '',
                correct_word: data.fillAnswer || '',
              };
              setFillBlankQuestions(prev =>
                prev.map((q, idx) =>
                  idx === editingQuestionIndex ? updatedQuestion : q
                )
              );
            } else {
              // Add new fill blank question
              const newFillBlankQuestion = {
                id: `fq${fillBlankQuestions.length + 1}`,
                sentence: data.title || '',
                correct_word: data.fillAnswer || '',
              };
              setFillBlankQuestions(prev => [...prev, newFillBlankQuestion]);
            }
          } else {
            if (editingQuestionIndex !== null) {
              // Edit existing question
              const existingQuestion = questions[editingQuestionIndex];
              const updatedQuestion = {
                ...existingQuestion,
                question: data.title || '',
                explanation: data.explain,
                answers:
                  data.options?.map(opt => ({
                    answer: opt.text,
                    is_correct: opt.correct,
                  })) || [],
                type:
                  data.mode === 'multiple'
                    ? ('multiple' as const)
                    : ('single' as const),
              };
              setQuestions(prev =>
                prev.map((q, idx) =>
                  idx === editingQuestionIndex ? updatedQuestion : q
                )
              );
            } else {
              // Add new question
              const newQuestion = {
                id: `q${questions.length + 1}`,
                question: data.title || '',
                explanation: data.explain,
                answers:
                  data.options?.map(opt => ({
                    answer: opt.text,
                    is_correct: opt.correct,
                  })) || [],
                type:
                  data.mode === 'multiple'
                    ? ('multiple' as const)
                    : ('single' as const),
              };
              setQuestions(prev => [...prev, newQuestion]);
            }
          }
          setEditingQuestionIndex(null);
        }}
      />
    </div>
  );
}
