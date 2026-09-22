import { Plus, Trash2 } from 'lucide-react';
import {
  ContributionResourceInput,
  ContributionResourceType,
} from '@/modules/archive/types';

export type ResourceDraft = ContributionResourceInput & { key: number };
interface Labels {
  add: string;
  remove: string;
  type: string;
  url: string;
  title: string;
  note: string;
  rights: string;
  types: Record<ContributionResourceType, string>;
}
interface Props {
  resources: ResourceDraft[];
  onChange: (resources: ResourceDraft[]) => void;
  labels: Labels;
}
const resourceTypes: ContributionResourceType[] = [
  'SOURCE',
  'IMAGE',
  'AUDIO',
  'VIDEO',
  'DOCUMENT',
  'OTHER',
];

export function ContributionResourceFields({
  resources,
  onChange,
  labels,
}: Props) {
  const update = (
    key: number,
    field: keyof ContributionResourceInput,
    value: string
  ) =>
    onChange(
      resources.map(resource =>
        resource.key === key ? { ...resource, [field]: value } : resource
      )
    );
  return (
    <div className='space-y-4'>
      {resources.map((resource, index) => (
        <div
          key={resource.key}
          className='rounded-sm border border-[#ded3c1] bg-white p-4'
        >
          <div className='grid gap-4 sm:grid-cols-2'>
            <label className='text-sm font-semibold'>
              {labels.type}
              <select
                value={resource.type}
                onChange={e => update(resource.key, 'type', e.target.value)}
                className='mt-1 h-11 w-full rounded-sm border border-[#c9bda9] bg-white px-3 font-normal'
              >
                {resourceTypes.map(type => (
                  <option key={type} value={type}>
                    {labels.types[type]}
                  </option>
                ))}
              </select>
            </label>
            <label className='text-sm font-semibold'>
              {labels.url} <span className='text-[#a34924]'>*</span>
              <input
                required
                type='url'
                pattern='https?://.+'
                value={resource.url}
                onChange={e => update(resource.key, 'url', e.target.value)}
                placeholder='https://...'
                className='mt-1 h-11 w-full rounded-sm border border-[#c9bda9] px-3 font-normal'
              />
            </label>
            <label className='text-sm font-semibold'>
              {labels.title}
              <input
                maxLength={255}
                value={resource.title ?? ''}
                onChange={e => update(resource.key, 'title', e.target.value)}
                className='mt-1 h-11 w-full rounded-sm border border-[#c9bda9] px-3 font-normal'
              />
            </label>
            <label className='text-sm font-semibold'>
              {labels.note}
              <input
                maxLength={2000}
                value={resource.note ?? ''}
                onChange={e => update(resource.key, 'note', e.target.value)}
                className='mt-1 h-11 w-full rounded-sm border border-[#c9bda9] px-3 font-normal'
              />
            </label>
            <label className='text-sm font-semibold sm:col-span-2'>
              {labels.rights}
              <textarea
                rows={2}
                maxLength={2000}
                value={resource.rightsNote ?? ''}
                onChange={e =>
                  update(resource.key, 'rightsNote', e.target.value)
                }
                className='mt-1 w-full rounded-sm border border-[#c9bda9] p-3 font-normal'
              />
            </label>
          </div>
          <button
            type='button'
            onClick={() =>
              onChange(resources.filter(item => item.key !== resource.key))
            }
            className='mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#a34924]'
            aria-label={`${labels.remove} ${index + 1}`}
          >
            <Trash2 size={15} />
            {labels.remove}
          </button>
        </div>
      ))}
      <button
        type='button'
        onClick={() =>
          onChange([...resources, { key: Date.now(), type: 'SOURCE', url: '' }])
        }
        className='inline-flex items-center gap-2 rounded-full border border-[#a34924] px-4 py-2 text-sm font-bold text-[#a34924]'
      >
        <Plus size={16} />
        {labels.add}
      </button>
    </div>
  );
}
