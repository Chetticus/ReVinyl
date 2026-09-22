import * as React from 'react';
import { SVGProps } from 'react';
const IconLine = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={8}
    height={32}
    fill='none'
    {...props}
  >
    <path stroke='#BF2F1F' d='M4 0v32' />
  </svg>
);
export default IconLine;
