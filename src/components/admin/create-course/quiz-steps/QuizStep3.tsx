'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Control } from 'react-hook-form';
import { ChevronDown, Info } from 'lucide-react';

interface QuizStep3Props {
  control: Control<any>;
}

export default function QuizStep3({ control }: QuizStep3Props) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [timeUnit, setTimeUnit] = React.useState<
    'seconds' | 'minutes' | 'hours'
  >('minutes');

  const convertToMinutes = (
    value: number,
    unit: 'seconds' | 'minutes' | 'hours'
  ) => {
    if (!value || Number.isNaN(value)) return 0;
    switch (unit) {
      case 'seconds':
        return Math.floor(value / 60);
      case 'hours':
        return Math.floor(value * 60);
      default:
        return Math.floor(value);
    }
  };

  const convertFromMinutes = (
    minutes: number,
    unit: 'seconds' | 'minutes' | 'hours'
  ) => {
    if (!minutes || Number.isNaN(minutes)) return 0;
    switch (unit) {
      case 'seconds':
        return minutes * 60;
      case 'hours':
        return Math.round((minutes / 60) * 100) / 100;
      default:
        return minutes;
    }
  };

  return (
    <div className='space-y-4'>
      <div>
        <div className='grid grid-cols-3 gap-4 items-end'>
          <FormField
            control={control}
            name='timeLimit'
            render={({ field }) => {
              const displayedValue = convertFromMinutes(field.value, timeUnit);
              const unitStep = timeUnit === 'hours' ? '0.25' : '1';
              return (
                <FormItem>
                  <FormLabel className='text-sm font-semibold'>
                    Thời gian tối đa
                  </FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      min='0'
                      step={unitStep}
                      placeholder='00'
                      className='h-12'
                      value={displayedValue ?? 0}
                      onChange={e => {
                        const raw = e.target.value;
                        const num = raw === '' ? 0 : Number(raw);
                        field.onChange(convertToMinutes(num, timeUnit));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <div>
            <FormLabel className='text-sm font-semibold invisible'>
              Đơn vị
            </FormLabel>
            <Select
              value={timeUnit}
              onValueChange={(v: 'seconds' | 'minutes' | 'hours') =>
                setTimeUnit(v)
              }
            >
              <FormControl>
                <SelectTrigger className='h-12'>
                  <SelectValue placeholder='Chọn đơn vị' />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value='seconds'>Giây</SelectItem>
                <SelectItem value='minutes'>Phút</SelectItem>
                <SelectItem value='hours'>Giờ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <FormField
            control={control}
            name='showTimer'
            render={({ field }) => (
              <FormItem className='flex items-center gap-3 mb-3'>
                <FormControl>
                  <Switch
                    checked={!!field.value}
                    onCheckedChange={checked => {
                      console.log('[QuizStep3] showTimer changed to:', checked);
                      field.onChange(Boolean(checked));
                    }}
                    className='mb-0'
                  />
                </FormControl>
                <FormLabel className='text-sm font-semibold'>
                  Ẩn/Hiện thời gian kiểm tra
                </FormLabel>
              </FormItem>
            )}
          />
        </div>
        <p className='text-xs text-gray-500 flex items-center mt-2'>
          <Info className='w-3 h-3 mr-1 shrink-0' />
          Giới hạn thời gian cho bài kiểm tra này. Đặt 0 để không giới hạn.
        </p>
      </div>

      <div>
        <FormField
          control={control}
          name='passingScore'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-sm font-semibold'>
                Điểm đạt (%)
              </FormLabel>
              <FormControl>
                <Input
                  type='number'
                  min='0'
                  max='100'
                  className='h-12'
                  {...field}
                  onChange={e => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <p className='text-xs text-gray-500 flex items-center mt-2'>
          <Info className='w-3 h-3 mr-1 shrink-0' />
          Đặt 0 để không giới hạn.
        </p>

        <FormField
          control={control}
          name='feedbackMode'
          render={({ field }) => (
            <FormItem className='mt-4'>
              <FormLabel className='text-sm font-semibold'>
                Chế độ phản hồi câu hỏi
              </FormLabel>
              <p className='text-xs text-[#637381]'>
                Chọn hành vi của hệ thống câu đố dựa trên các câu hỏi lựa chọn.
              </p>
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className='mt-2 gap-3'
              >
                <div className='flex items-center gap-2'>
                  <RadioGroupItem value='none' id='feedback-none' />
                  <label htmlFor='feedback-none' className='text-sm'>
                    Mặc định{' '}
                    <span className='text-[#637381]'>
                      (Câu trả lời được hiển thị sau khi bài kiểm tra kết thúc)
                    </span>
                  </label>
                </div>
                <div className='flex items-center gap-2'>
                  <RadioGroupItem value='immediate' id='feedback-immediate' />
                  <label htmlFor='feedback-immediate' className='text-sm'>
                    Chế độ hiển thị{' '}
                    <span className='text-[#637381]'>
                      (Hiển thị kết quả sau khi thử)
                    </span>
                  </label>
                </div>
                <div className='flex items-center gap-2'>
                  <RadioGroupItem
                    value='after_submit'
                    id='feedback-after-submit'
                  />
                  <label htmlFor='feedback-after-submit' className='text-sm'>
                    Chế độ thử lại{' '}
                    <span className='text-[#637381]'>
                      (Thử lại bài kiểm tra bất kỳ số lần nào. Định nghĩa Số lần
                      thử được phép bên dưới)
                    </span>
                  </label>
                </div>
              </RadioGroup>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div>
        <FormField
          control={control}
          name='maxQuestions'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-sm font-semibold'>
                Câu hỏi tối đa được phép trả lời
              </FormLabel>
              <FormControl>
                <Input
                  type='number'
                  min='1'
                  className='h-12'
                  {...field}
                  onChange={e => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <p className='text-xs text-gray-500 flex items-center mt-2'>
          <Info className='w-3 h-3 mr-1 shrink-0' />
          Số lượng câu hỏi này sẽ có sẵn để học sinh trả lời và câu hỏi sẽ được
          chọn ngẫu nhiên từ tất cả các câu hỏi có sẵn trong bài kiểm tra. Nếu
          số lượng này lớn hơn số câu hỏi có sẵn, khi đó học sinh có thể trả lời
          mọi câu hỏi.
        </p>
      </div>

      <div className='mt-2 border rounded-md'>
        <button
          type='button'
          className='flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold'
          onClick={() => setIsOpen(!isOpen)}
        >
          Cài đặt nâng cao
          <ChevronDown
            className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
        {isOpen && (
          <div className='px-4 pb-4'>
            <div className='space-y-4'>
              <FormField
                control={control}
                name='autoStart'
                render={({ field }) => (
                  <FormItem className='flex items-center gap-3'>
                    <FormControl>
                      <Switch
                        checked={!!field.value}
                        onCheckedChange={checked =>
                          field.onChange(Boolean(checked))
                        }
                      />
                    </FormControl>
                    <FormLabel className='text-sm font-semibold m-0'>
                      Tự động bắt đầu bài kiểm tra
                    </FormLabel>
                  </FormItem>
                )}
              />

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <FormLabel className='text-sm font-semibold'>
                    Bố cục câu hỏi
                  </FormLabel>
                  <FormField
                    control={control}
                    name='questionLayout'
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className='h-12'>
                            <SelectValue placeholder='Chọn bố cục' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='random'>Ngẫu nhiên</SelectItem>
                          <SelectItem value='category'>Phân loại</SelectItem>
                          <SelectItem value='asc'>Tăng dần</SelectItem>
                          <SelectItem value='desc'>Giảm dần</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div>
                  <FormLabel className='text-sm font-semibold'>
                    Cài đặt câu hỏi
                  </FormLabel>
                  <FormField
                    control={control}
                    name='questionViewMode'
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className='h-12'>
                            <SelectValue placeholder='Chọn cài đặt' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='layout'>
                            Đặt chế độ xem bố cục câu hỏi
                          </SelectItem>
                          <SelectItem value='single'>Câu hỏi đơn</SelectItem>
                          <SelectItem value='paginate'>
                            Phân trang câu hỏi
                          </SelectItem>
                          <SelectItem value='stacked'>
                            Câu hỏi bên dưới nhau
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={control}
                name='showQuestionCount'
                render={({ field }) => (
                  <FormItem className='flex items-center gap-3 col-span-2'>
                    <FormControl>
                      <Switch
                        checked={!!field.value}
                        onCheckedChange={checked =>
                          field.onChange(Boolean(checked))
                        }
                      />
                    </FormControl>
                    <FormLabel className='text-sm font-semibold m-0'>
                      Ẩn/Hiện số câu hỏi khi làm bài
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
