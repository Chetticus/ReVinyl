import { ContributionType } from '@/modules/archive/types';

interface Props {
  value: ContributionType;
  onChange: (value: ContributionType) => void;
  labels: Record<
    'NEW_RECORDING' | 'INFORMATION' | 'CORRECTION',
    readonly [string, string]
  >;
}

const types = ['NEW_RECORDING', 'INFORMATION', 'CORRECTION'] as const;

export function ContributionTypeSelector({ value, onChange, labels }: Props) {
  return (
    <div className='grid gap-3 sm:grid-cols-3'>
      {types.map(type => (
        <button
          key={type}
          type='button'
          aria-pressed={value === type}
          onClick={() => onChange(type)}
          className={`rounded-sm border p-4 text-left transition ${value === type ? 'border-[#a34924] bg-[#f8eadb] ring-1 ring-[#a34924]' : 'border-[#c9bda9] bg-white hover:border-[#a34924]'}`}
        >
          <strong className='block'>{labels[type][0]}</strong>
          <span className='mt-2 block text-sm leading-5 text-[#685f54]'>
            {labels[type][1]}
          </span>
        </button>
      ))}
    </div>
  );
}
