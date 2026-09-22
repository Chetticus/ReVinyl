import clsx from 'clsx';

interface ITitleProps {
  label: string;
  title: string;
  subTitle: string;
  containerClass?: string;
}

export function Title({ label, title, subTitle, containerClass }: ITitleProps) {
  return (
    <div
      className={clsx(
        'flex flex-col gap-2 items-center lg:w-[60%]',
        containerClass
      )}
    >
      <div className='text-primary-main w-fit text-lg font-semibold'>
        {label}
      </div>
      <div className='font-bold text-2xl leading-9 lg:text-3xl text-center lg:leading-12 w-full text-[#212B36]'>
        {title}
      </div>
      <div className='text-[#212B36] text-center text-base '>{subTitle}</div>
    </div>
  );
}
