'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { ChevronDown, Plus, Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

export type QuestionMode = 'single' | 'multiple' | 'fill';

export interface QuestionModalResult {
  title: string;
  mode: QuestionMode;
  options?: { id: string; text: string; correct: boolean }[];
  fillAnswer?: string;
  explain?: string;
  hint?: string;
  required: boolean;
  random: boolean;
}

interface QuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: QuestionModalResult) => void;
  defaultMode?: QuestionMode;
  editData?: QuestionModalResult;
}

export default function QuestionModal({
  isOpen,
  onClose,
  onSave,
  defaultMode = 'single',
  editData,
}: QuestionModalProps) {
  const [title, setTitle] = React.useState('');
  const [mode, setMode] = React.useState<QuestionMode>(defaultMode);
  const [required, setRequired] = React.useState(false);
  const [random, setRandom] = React.useState(false);
  const [options, setOptions] = React.useState([
    { id: 'o1', text: '', correct: true },
    { id: 'o2', text: '', correct: false },
  ]);
  const [fillAnswer, setFillAnswer] = React.useState('');
  const [explain, setExplain] = React.useState('');
  const [hint, setHint] = React.useState('');

  React.useEffect(() => {
    if (!isOpen) return;

    if (editData) {
      // Populate with edit data
      setTitle(editData.title || '');
      setMode(editData.mode || defaultMode);
      setRequired(editData.required || false);
      setRandom(editData.random || false);
      setOptions(
        editData.options || [
          { id: 'o1', text: '', correct: true },
          { id: 'o2', text: '', correct: false },
        ]
      );
      setFillAnswer(editData.fillAnswer || '');
      setExplain(editData.explain || '');
      setHint(editData.hint || '');
    } else {
      // Reset for new question
      setTitle('');
      setMode(defaultMode);
      setRequired(false);
      setRandom(false);
      setOptions([
        { id: 'o1', text: '', correct: true },
        { id: 'o2', text: '', correct: false },
      ]);
      setFillAnswer('');
      setExplain('');
      setHint('');
    }
  }, [isOpen, defaultMode, editData]);

  const addOption = () =>
    setOptions(prev => [
      ...prev,
      { id: `o${prev.length + 1}`, text: '', correct: false },
    ]);
  const removeOption = (id: string) =>
    setOptions(prev => prev.filter(o => o.id !== id));
  const toggleCorrect = (id: string) => {
    setOptions(prev =>
      prev.map(o =>
        o.id === id
          ? { ...o, correct: !o.correct }
          : mode === 'single'
            ? { ...o, correct: false }
            : o
      )
    );
  };

  const save = () => {
    const payload: QuestionModalResult = {
      title,
      mode,
      required,
      random,
      explain,
      hint,
      ...(mode === 'fill' ? { fillAnswer } : { options }),
    };
    onSave(payload);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-3xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>
            {editData ? 'Chỉnh sửa câu hỏi' : 'Thêm câu hỏi'}
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-4'>
          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-700'>
              Nhập câu hỏi
            </label>
            <textarea
              className='w-full border rounded-md p-3 min-h-[80px]'
              placeholder='Nhập câu hỏi'
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
            {mode === 'fill' && (
              <div className='text-gray-400 text-sm -mt-2'>
                Ghi chú: Bạn cần nhập kiểu: abc___def với ___ là khoảng trống
                cho kết quả
              </div>
            )}
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-700'>
              Loại câu hỏi
            </label>
            <div className='relative '>
              <select
                disabled
                value={mode}
                onChange={e => setMode(e.target.value as QuestionMode)}
                className='appearance-none bg-gray-200 w-full px-4 h-[44px] py-2 border rounded-[10px] text-sm text-gray-900 cursor-pointer pr-10'
              >
                <option value='single'>1 Đáp án</option>
                <option value='multiple'>Nhiều đáp án</option>
                <option value='fill'>Điền từ</option>
              </select>
              <div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
                <ChevronDown className='w-4 h-4 text-gray-400' />
              </div>
            </div>
          </div>

          {mode === 'fill' ? (
            <div className='space-y-2'>
              <label className='text-sm font-medium text-gray-700'>
                Đáp án
              </label>
              <Input
                placeholder='Câu trả lời ngắn'
                value={fillAnswer}
                onChange={e => setFillAnswer(e.target.value)}
              />
            </div>
          ) : (
            <div className='space-y-3'>
              <label className='text-sm font-medium text-gray-700'>
                Đáp án
              </label>
              {options.map((opt, idx) => (
                <div key={opt.id} className='flex items-center space-x-2'>
                  <Input
                    className='flex-1'
                    placeholder={`Đáp án ${String.fromCharCode(65 + idx)}`}
                    value={opt.text}
                    onChange={e =>
                      setOptions(prev =>
                        prev.map(o =>
                          o.id === opt.id ? { ...o, text: e.target.value } : o
                        )
                      )
                    }
                  />
                  <label className='inline-flex items-center space-x-1 text-sm text-gray-700'>
                    <input
                      type='checkbox'
                      checked={!!opt.correct}
                      onChange={() => toggleCorrect(opt.id)}
                    />
                    <span>Đúng</span>
                  </label>
                  <button
                    onClick={() => removeOption(opt.id)}
                    className='px-2 py-1 rounded border text-gray-500 border-gray-300'
                  >
                    <Trash2 className='w-4 h-4' />
                  </button>
                </div>
              ))}
              <Button variant='outline' onClick={addOption} className='w-full'>
                <Plus className='w-4 h-4 mr-2' /> Thêm đáp án
              </Button>
            </div>
          )}

          {mode !== 'fill' && (
            <>
              <div className='space-y-2'>
                <label className='text-sm font-medium text-gray-700'>
                  Giải thích đáp án đúng
                </label>
                <textarea
                  className='w-full border rounded-md p-3 min-h-[80px]'
                  placeholder='Viết gì đó...'
                  value={explain}
                  onChange={e => setExplain(e.target.value)}
                />
              </div>
              <div className='space-y-2'>
                <label className='text-sm font-medium text-gray-700'>
                  Gợi ý đáp án sai
                </label>
                <textarea
                  className='w-full border rounded-md p-3 min-h-[80px]'
                  placeholder='Viết gì đó...'
                  value={hint}
                  onChange={e => setHint(e.target.value)}
                />
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            Hủy bỏ
          </Button>
          <Button className='bg-gray-900 hover:bg-gray-800' onClick={save}>
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
