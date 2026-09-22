import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Rating, RoundedStar } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (rating: number, comment: string, title?: string) => void;
  isLoading?: boolean;
  error?: string;
}

export const myStyles = {
  itemShapes: RoundedStar,
  activeFillColor: '#FFB145', // Màu vàng đậm hơn giống ảnh
  inactiveFillColor: '#E5E7EB', // màu xám nhạt
  size: 14,
};

export const ReviewDialog: React.FC<ReviewDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
  error,
}) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [title, setTitle] = useState('');

  const handleSubmit = () => {
    if (!comment.trim()) {
      return;
    }

    if (rating < 1 || rating > 5) {
      return;
    }

    onSubmit(rating, comment.trim(), title.trim() || undefined);
  };

  const handleClose = () => {
    // Reset form when closing
    setComment('');
    setTitle('');
    setRating(5);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='w-[500px] lg:w-[650px]'>
        <DialogHeader className='items-start'>
          <DialogTitle className='text-lg text-[#212B36]'>
            Đánh giá Chuyên đề
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          {error && (
            <div className='bg-red-50 border border-red-200 rounded-lg p-3'>
              <p className='text-red-600 text-sm'>{error}</p>
            </div>
          )}
          <div className='flex items-center gap-3'>
            <span className='text-sm font-medium text-[#212B36] whitespace-nowrap'>
              Đánh giá của bạn về Chuyên đề này:
            </span>
            <Rating
              className='ml-2'
              style={{ maxWidth: 120 }}
              value={rating}
              onChange={setRating}
              itemStyles={myStyles}
            />
            <span className='text-sm text-gray-600'>({rating}/5)</span>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Nội dung đánh giá <span className='text-red-500'>*</span>
            </label>
            <textarea
              className='w-full p-3 border-zinc-300 border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              rows={4}
              maxLength={300}
              placeholder='Chia sẻ trải nghiệm của bạn về Chuyên đề này...'
              value={comment}
              onChange={e => setComment(e.target.value)}
            />
            <div className='text-right text-gray-400 text-xs mt-1'>
              {comment.length}/300
            </div>
          </div>
        </div>

        <DialogFooter className='flex gap-2 mt-8'>
          <DialogClose asChild>
            <Button
              variant='outline'
              className='h-9 border-gray-300 shadow text-[#212B36] hover:border-gray-300 font-semibold rounded-[10px]'
              disabled={isLoading}
            >
              Hủy bỏ
            </Button>
          </DialogClose>
          <Button
            className='bg-gray-700 font-semibold w-fit h-9 rounded-[10px] text-white hover:bg-gray-800 transition-colors duration-300 disabled:opacity-50'
            onClick={handleSubmit}
            disabled={!comment.trim() || isLoading}
          >
            {isLoading ? 'Đang gửi...' : 'Đăng đánh giá'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
