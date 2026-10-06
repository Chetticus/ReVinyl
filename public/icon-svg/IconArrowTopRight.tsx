import * as React from 'react';
import { SVGProps } from 'react';
const IconArrowTopRight = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={36}
    height={36}
    fill='none'
    {...props}
  >
    <rect width={36} height={36} fill='#fff' rx={18} />
    <path
      fill='#212B36'
      d='M23 13.876a.833.833 0 0 0-.833-.834l-6.667-.041a.833.833 0 0 0 0 1.666h4.633l-6.891 6.909a.833.833 0 0 0 0 1.183.834.834 0 0 0 1.183 0l6.908-6.909v4.65a.833.833 0 1 0 1.667 0v-6.624Z'
    />
  </svg>
);
export default IconArrowTopRight;
