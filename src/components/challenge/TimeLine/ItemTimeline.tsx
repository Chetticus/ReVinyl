import IconCircle from '../../../../public/icon-svg/IconCircle';
import IconLine from '../../../../public/icon-svg/IconLine';

interface IItemTimelineProps {
  indexNumber: number;
  length: number;
  timeLine?: string;
}

export default function ItemTimeline({
  indexNumber,
  length,
}: IItemTimelineProps) {
  return (
    <div className='flex gap-4 w-[100px] mt-[12px]'>
      <div className='flex flex-col gap-2 mt-2'>
        <IconCircle />
        {indexNumber !== length - 1 && <IconLine />}
      </div>
      <div className='font-semibold'>Thời cổ</div>
    </div>
  );
}
