'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemName?: string;
  isLoading?: boolean;
}

export const DeleteConfirmationModal: React.FC<
  DeleteConfirmationModalProps
> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  isLoading = false,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold text-gray-900'>
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className='py-3'>
          {/* Warning Icon */}
          <div className='flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full'>
            <AlertTriangle className='w-8 h-8 text-red-600' />
          </div>

          {/* Message */}
          <div className='text-center'>
            <p className='text-gray-700 mb-2'>{message}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex justify-end space-x-3'>
          <Button
            variant='outline'
            onClick={onClose}
            disabled={isLoading}
            className='px-6'
          >
            Hủy
          </Button>
          <Button
            variant='destructive'
            onClick={onConfirm}
            disabled={isLoading}
            className='px-6 bg-red-600 hover:bg-red-700'
          >
            {isLoading ? (
              <div className='flex items-center space-x-2'>
                <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                <span>Đang xóa...</span>
              </div>
            ) : (
              <div className='flex items-center space-x-2'>
                <Trash2 className='w-4 h-4' />
                <span>Xóa</span>
              </div>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
