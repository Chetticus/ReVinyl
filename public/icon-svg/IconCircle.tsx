import * as React from 'react';
import { SVGProps } from 'react';
const IconCircle = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={8}
    height={8}
    fill='none'
    {...props}
  >
    <circle cx={4} cy={4} r={4} fill='#BF2F1F' />
  </svg>
);
export default IconCircle;
