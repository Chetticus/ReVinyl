'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

export type InfoSection = { heading?: string; body: string[] };
export type InfoData = { title: string; sections: InfoSection[] };

type InfoModalProps = {
  open: boolean;
  onClose: () => void;
  info: InfoData;
  className?: string;
  closeOnOuterClick?: boolean; // optional, default true
};

export default function InfoModal({
  open,
  onClose,
  info,
  className,
  closeOnOuterClick = true,
}: InfoModalProps) {
  // ESC + khoá scroll
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className='fixed inset-0 z-[100]'>
      {/* lớp nền */}
      <div className='absolute inset-0 bg-black/60 backdrop-blur-sm' />

      {/* container full-screen: bắt click ngoài để đóng */}
      <div
        className='absolute inset-0 flex items-center justify-center p-4'
        onMouseDown={closeOnOuterClick ? onClose : undefined}
      >
        {/* hộp nội dung: chặn lan truyền để không bị đóng khi click bên trong */}
        <div
          onMouseDown={e => e.stopPropagation()}
          role='dialog'
          aria-modal='true'
          className={[
            'w-[92vw] max-w-4xl rounded-2xl bg-[#1B222C] text-white shadow-2xl ring-1 ring-white/10',
            className || '',
          ].join(' ')}
        >
          <div className='flex items-center justify-between px-6 py-4'>
            <h3 className='text-2xl font-semibold text-primary-main'>
              {info.title}
            </h3>
            <button
              onClick={onClose}
              aria-label='Close'
              className='rounded-md p-2 hover:bg-white/10'
            >
              <X size={20} />
            </button>
          </div>

          <div className='px-6 pb-6 max-h-[70vh] overflow-y-auto'>
            {info.sections.map((sec, i) => (
              <section key={i} className='mb-6 last:mb-0'>
                {sec.heading && (
                  <h4 className='font-bold text-white mb-2'>{sec.heading}</h4>
                )}
                {sec.body.map((p, idx) => (
                  <p
                    key={idx}
                    className='text-[#FFFFFFA3] leading-7 mb-1 last:mb-0'
                  >
                    {p}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
