import {
  DuplicateReviewStatus,
  RightsReviewStatus,
  VerificationReviewStatus,
} from '@/modules/archive/types';

export interface ReviewValues {
  sourceReviewStatus: VerificationReviewStatus;
  rightsReviewStatus: RightsReviewStatus;
  accuracyReviewStatus: VerificationReviewStatus;
  duplicateReviewStatus: DuplicateReviewStatus;
}
interface Props {
  value: ReviewValues;
  onChange: (value: ReviewValues) => void;
}
const verification = [
  ['NOT_REVIEWED', 'Chưa kiểm tra'],
  ['VERIFIED', 'Đã xác minh'],
  ['ISSUE', 'Có vấn đề'],
] as const;
const rights = [
  ['NOT_REVIEWED', 'Chưa kiểm tra'],
  ['CLEARED', 'Được phép'],
  ['RESTRICTED', 'Hạn chế'],
  ['UNKNOWN', 'Chưa rõ'],
] as const;
const duplicate = [
  ['NOT_REVIEWED', 'Chưa kiểm tra'],
  ['UNIQUE', 'Không trùng'],
  ['DUPLICATE', 'Trùng lặp'],
] as const;
export function AdminReviewChecklist({ value, onChange }: Props) {
  const field =
    'mt-1 h-11 w-full rounded-lg border border-[#DFE3E8] bg-white px-3 font-normal';
  return (
    <section className='mt-7 rounded-xl border border-[#DFE3E8] p-5'>
      <h3 className='text-sm font-bold uppercase tracking-wider text-[#637381]'>
        Kiểm duyệt
      </h3>
      <div className='mt-4 grid gap-4 sm:grid-cols-2'>
        <label className='font-semibold'>
          Nguồn
          <select
            value={value.sourceReviewStatus}
            onChange={e =>
              onChange({
                ...value,
                sourceReviewStatus: e.target.value as VerificationReviewStatus,
              })
            }
            className={field}
          >
            {verification.map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </label>
        <label className='font-semibold'>
          Quyền sử dụng
          <select
            value={value.rightsReviewStatus}
            onChange={e =>
              onChange({
                ...value,
                rightsReviewStatus: e.target.value as RightsReviewStatus,
              })
            }
            className={field}
          >
            {rights.map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </label>
        <label className='font-semibold'>
          Độ chính xác
          <select
            value={value.accuracyReviewStatus}
            onChange={e =>
              onChange({
                ...value,
                accuracyReviewStatus: e.target
                  .value as VerificationReviewStatus,
              })
            }
            className={field}
          >
            {verification.map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </label>
        <label className='font-semibold'>
          Trùng lặp
          <select
            value={value.duplicateReviewStatus}
            onChange={e =>
              onChange({
                ...value,
                duplicateReviewStatus: e.target.value as DuplicateReviewStatus,
              })
            }
            className={field}
          >
            {duplicate.map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}
