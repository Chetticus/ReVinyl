import Image from 'next/image';
import IconArrowTopRight from '../../../../public/icon-svg/IconArrowTopRight';

interface CardChallengeProps {
  image: string;
  description: string;
  tag: string;
  backgroundColor: string;
}

export default function CardChallenge(props: CardChallengeProps) {
  const { image, description, tag, backgroundColor } = props;
  return (
    <div style={{ backgroundColor }} className='rounded-4xl'>
      <div className='p-8'>
        <div className='flex flex-col items-center justify-center'>
          <Image alt='Challenge Image' src={image} className='mb-6 w-[80px]' />

          <div className='text-lg font-bold'>{tag}</div>
          <div className='mt-3 text-center text-[#637381]'>{description}</div>

          <div
            className='mt-3 flex h-8 cursor-pointer items-center rounded-full bg-white px-8'
            aria-hidden
          >
            Khám phá
          </div>
        </div>
      </div>
    </div>
  );
}
