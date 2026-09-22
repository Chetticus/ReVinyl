import * as React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

type InputProps = {
  helperText?: string;
  invalid?: boolean;
};

type CheckboxInputProps = {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
} & Omit<React.ComponentProps<'input'>, 'type' | 'checked' | 'onChange'>;

function Input({
  className,
  type,
  helperText,
  invalid,
  ...props
}: React.ComponentProps<'input'> & InputProps) {
  return (
    <>
      <input
        type={type}
        data-slot='input'
        className={cn(
          'border-disabled file:text-foreground placeholder:text-disabled selection:bg-primary selection:text-primary-foreground flex h-12 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm border-[#919EAB52]',
          'focus-visible:border-ring focus-visible:ring-ring/50',
          'aria-invalid:ring-red-500/20 aria-invalid:border-red-500',
          className,
          invalid && 'border-error-main/80'
        )}
        aria-invalid={!!invalid}
        {...props}
      />
      {helperText && (
        <p className='text-disabled text-xs font-light'>{helperText}</p>
      )}
    </>
  );
}

function CheckboxInput({
  checked = false,
  onChange,
  className,
  ...props
}: CheckboxInputProps) {
  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center w-5 h-5 rounded border-1 cursor-pointer transition-all duration-200',
        checked
          ? 'bg-primary-main border-[#BF2F1F]'
          : 'bg-white border-[#919EAB] hover:border-[#BF2F1F]',
        className
      )}
      onClick={() => onChange?.(!checked)}
    >
      <input
        type='checkbox'
        checked={checked}
        onChange={e => onChange?.(e.target.checked)}
        className='absolute inset-0 opacity-0 cursor-pointer'
        {...props}
      />
      {checked && <Check className='w-3 h-3 text-white stroke-[3]' />}
    </div>
  );
}

export { Input, CheckboxInput };
