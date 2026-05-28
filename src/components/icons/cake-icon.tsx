import type { SVGProps } from "react";

function CakeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g transform="translate(-2, 4) scale(1.2, 1.2)">
        <path
          d="M22.5217 7.07507V17.0435C16.8406 16.4368 11.1594 15.8281 5.47827 15.2194V5.25913C5.47827 5.25913 5.47827 5.2571 5.4803 5.25507C6.45016 3.07594 9.12436 1.20725 12.7846 0L22.5217 7.07507Z"
          fill="currentColor"
        />
      </g>
    </svg>
  );
}

export { CakeIcon };
