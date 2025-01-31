import * as React from "react";
const LogoSmall = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 48 48"
    width={48}
    height={48}
    className={className}
  >
    <defs>
      <linearGradient id="x">
        <stop
          offset={0}
          style={{
            stopColor: "#7cadde",
            stopOpacity: 0.73049885,
          }}
        />
        <stop
          offset={1}
          style={{
            stopColor: "#4169e1",
            stopOpacity: 0,
          }}
        />
      </linearGradient>
      <linearGradient
        xlinkHref="#x"
        id="y"
        x1={55.227}
        x2={63.387}
        y1={84.657}
        y2={84.657}
        gradientTransform="matrix(3.2909 0 0 5.15286 -169.698 -412.21)"
        gradientUnits="userSpaceOnUse"
      />
    </defs>
    <rect
      width={48}
      height={48}
      rx={10.263}
      ry={10.263}
      className="dark:fill-[#171717] fill-[#efefef]"
    />
    <path
      d="M38.922 36.813h-7.106L25.14 20.878h-.143q.179 2.117.215 3.768.072 1.615.072 2.728v9.439h-5.671V11.187h7.07l6.64 15.505h.144q-.108-1.938-.18-3.482-.072-1.579-.072-2.727v-9.296h5.707z"
      fill="currentColor"
    />
    <rect
      width={28.039}
      height={15.933}
      x={10.861}
      y={16.034}
      ry={0}
      fill="url(#y)"
    />
    <path
      d="M10.86 14.25a1.79 1.79 0 0 0-1.782 1.784v15.932a1.79 1.79 0 0 0 3.58 0V16.034a1.79 1.79 0 0 0-1.797-1.784"
      fill="#7cadde"
    />
  </svg>
);
export default LogoSmall;
