import * as React from 'react';
import { SVGProps } from 'react';
const IconArrowHome = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={40}
    height={40}
    fill='none'
    {...props}
  >
    <rect width={40} height={40} fill='#212B36' rx={20} />
    <path
      fill='#fff'
      d='M22.43 26.82c-.19 0-.38-.07-.53-.22a.754.754 0 0 1 0-1.06L27.44 20l-5.54-5.54a.754.754 0 0 1 0-1.06c.29-.29.77-.29 1.06 0l6.07 6.07c.29.29.29.77 0 1.06l-6.07 6.07c-.15.15-.34.22-.53.22Z'
    />
    <path
      fill='#fff'
      d='M28.33 20.75H11.5c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h16.83c.41 0 .75.34.75.75s-.34.75-.75.75Z'
    />
  </svg>
);
export default IconArrowHome;
