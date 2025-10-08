import * as React from "react";
import { SVGProps } from "react";
const Shield = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <g fill="#fff">
      <path
        fillRule="evenodd"
        d="M3.378 5.082C3 5.62 3 7.22 3 10.417v1.574c0 5.638 4.239 8.375 6.899 9.536.721.315 1.082.473 2.101.473V2c-.811 0-1.595.268-3.162.805L8.265 3C5.258 4.03 3.755 4.545 3.378 5.082Z"
        clipRule="evenodd"
      />
      <path
        d="M21 11.991v-1.574c0-3.198 0-4.797-.378-5.335-.377-.537-1.88-1.052-4.887-2.081l-.573-.196C13.595 2.268 12.812 2 12 2v20c1.02 0 1.38-.158 2.101-.473C16.761 20.365 21 17.63 21 11.991Z"
        opacity={0.5}
      />
    </g>
  </svg>
);
export default Shield;
