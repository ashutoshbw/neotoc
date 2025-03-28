const icons = {
  ts: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
    >
      <g fill="none">
        <g clipPath="url(#akarIconsTypescriptFill0)">
          <path
            fill="currentColor"
            d="M23.429 0H.57A.57.57 0 0 0 0 .571V23.43a.57.57 0 0 0 .571.571H23.43a.57.57 0 0 0 .571-.571V.57a.57.57 0 0 0-.572-.57m-9.143 12.826h-2.857v8.888H9.143v-8.888H6.286v-1.969h8zm.64 8.38v-2.375s1.298.978 2.855.978s1.497-1.018 1.497-1.158c0-1.477-4.412-1.477-4.412-4.751c0-4.452 6.429-2.695 6.429-2.695l-.08 2.116s-1.078-.719-2.296-.719s-1.657.58-1.657 1.198c0 1.597 4.452 1.438 4.452 4.652c0 4.95-6.788 2.755-6.788 2.755"
          ></path>
        </g>
        <defs>
          <clipPath id="akarIconsTypescriptFill0">
            <path fill="#fff" d="M0 0h24v24H0z"></path>
          </clipPath>
        </defs>
      </g>
    </svg>
  ),
  shirt: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 48 48"
    >
      <path
        fill="currentColor"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth={0}
        d="M18 6a6 6 0 0 0 12 0h5.455L42 15.818l-5.727 4.91V42H11.727V20.727L6 15.818L12.546 6z"
      ></path>
    </svg>
  ),
  mouse: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M13 10V6c0-.946 0-1.6-.036-2.12c-.034-.507-.099-.802-.193-1.03a2.98 2.98 0 0 0-1.62-1.62c-.225-.093-.52-.158-1.03-.193c-.516-.035-1.18-.036-2.12-.036s-1.6 0-2.12.036c-.507.035-.802.1-1.03.193a2.98 2.98 0 0 0-1.62 1.62c-.093.225-.158.521-.193 1.03c-.035.516-.035 1.17-.035 2.12v4c0 .946 0 1.6.035 2.12c.035.507.1.802.193 1.03c.304.735.89 1.32 1.62 1.62c.225.093.521.158 1.03.193c.516.035 1.17.036 2.12.036s1.6 0 2.12-.036c.507-.035.802-.1 1.03-.193a2.98 2.98 0 0 0 1.62-1.62c.094-.225.158-.521.193-1.03C13 11.604 13 10.94 13 10M2.3 2.47c-.304.735-.304 1.67-.304 3.53v4c0 1.86 0 2.8.304 3.53c.406.98 1.18 1.76 2.16 2.16c.735.304 1.67.304 3.53.304s2.8 0 3.53-.304a3.97 3.97 0 0 0 2.16-2.16c.304-.735.304-1.67.304-3.53V6c0-1.86 0-2.8-.304-3.53A3.97 3.97 0 0 0 11.52.31C10.785.006 9.85.006 7.99.006s-2.8 0-3.53.304A3.97 3.97 0 0 0 2.3 2.47"
        clipRule="evenodd"
      ></path>
      <path fill="currentColor" d="M7 3a1 1 0 0 1 2 0v4a1 1 0 0 1-2 0z"></path>
    </svg>
  ),
  folding: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 48 48"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={3}
      >
        <path d="m22 44l-1-8m21 8V12H26l1 8l1 8l1 8l-7 8zM28 28h5m-6-8h6"></path>
        <path d="M6 4h19l1 8l1 8l1 8l1 8H6zm6 8h7m-7 8h8m-8 8h9"></path>
      </g>
    </svg>
  ),
  framework: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="M12.9 4.22C18.73 6.84 20 2 20 2s-1.11 6.07-6.21 8.55c-1.04.51-1.69.78-1.69.78L3.73 7.25l8.37-3.43s-.2-.06.8.4M11.12 22l-7.79-4.22V9.07l7.79 3.97zm1.76 0l7.8-4.22V9.07l-7.8 3.97z"
      ></path>
    </svg>
  ),
  palette: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 512 512"
    >
      <path
        fill="currentColor"
        d="M274.174 41.604q-4.197-.014-8.332.195c-96.67 4.85-177.38 86.93-217.842 192c-40.462 105.06.914 239.97 90.336 237.48c89.42-2.5 18.09-99.6 65.486-146.12c24.345-23.9 58.852-15.48 94.207-5.64l-17.6-22.98l-4.2-5.48c-1.38.06-2.79.102-4.26.09c-8.24-.064-17.82-.54-25.25-7.347c-13.89-12.73-14.4-31.304-14.08-47.908s1.12-32.375-4.05-42.587l-5.7-11.24l12.595-.37q1.57-.047 3.15-.053c15.8-.073 32.304 2.776 46.914 9.03c15.584 6.67 29.254 17.44 36.154 33.053c4.18 9.46 3.665 20.116.623 29.768a57 57 0 0 1-2.24 5.89l54.9 71.68c6.21-1.05 12.184-2.936 17.844-5.92c46.09-24.313 97.313-77.71 88.27-129.03c-14.84-84.23-120.2-154.26-206.94-154.52zm60.79 39.888a34.152 39.804 15.878 0 1 17.913 7.06a34.152 39.804 15.878 0 1 4.666 54.87a34.152 39.804 15.878 0 1-48.72 9.77a34.152 39.804 15.878 0 1-4.665-54.87a34.152 39.804 15.878 0 1 30.805-16.83zm-119.85 4.467a39.307 30.27 71.565 0 1 34.603 35.56a39.307 30.27 71.565 0 1-23.213 41.31a39.307 30.27 71.565 0 1-37.678-35.47a39.307 30.27 71.565 0 1 23.213-41.31a39.307 30.27 71.565 0 1 3.07-.1zm-88.33 79.58a35.75 31.637 35.137 0 1 38.16 33.05a35.75 31.637 35.137 0 1-30.266 33.05a35.75 31.637 35.137 0 1-38.164-33.05a35.75 31.637 35.137 0 1 30.27-33.06zM421.256 170a34.25 40.436 25.644 0 1 20.41 9.578a34.25 40.436 25.644 0 1-2.914 55.51a34.25 40.436 25.644 0 1-50.107 3.966a34.25 40.436 25.644 0 1 2.916-55.51A34.25 40.436 25.644 0 1 421.26 170zm-174.152 27.95c2.982 12.774 1.784 26.197 1.548 38.275c-.31 15.893.734 28.32 8.89 35.797c1.19 1.09 8.018 3.092 14.556 3.143c3.268.026 6.44-.22 8.718-.535a27 27 0 0 0 2.383-.425l13.02-9.362l.02-.014c4.46-3.17 8.72-9.37 10.85-16.13s2.07-13.81 0-18.49c-4.83-10.93-14.84-19.26-27.82-24.81c-9.73-4.17-21-6.65-32.17-7.45zm67.455 83.808l-14.37 11L438.97 473.97l14.36-10.998l-138.773-181.21zm-200.35 60.16a48.74 40.895 69.57 0 1 46.46 47.85a48.74 40.895 69.57 0 1-36.85 47.852a48.74 40.895 69.57 0 1-46.46-47.852a48.74 40.895 69.57 0 1 36.85-47.85"
      ></path>
    </svg>
  ),
  button: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 15 15"
    >
      <path
        fill="currentColor"
        d="M4 6a3 3 0 0 1 0-6h7a3 3 0 1 1 0 6H9V3.5a2.5 2.5 0 0 0-5 0z"
      ></path>
      <path
        fill="currentColor"
        d="M6.5 2A1.5 1.5 0 0 0 5 3.5v4.55a2.5 2.5 0 0 0-2 2.45A4.5 4.5 0 0 0 7.5 15H8a5 5 0 0 0 5-5v-.853A2.147 2.147 0 0 0 10.853 7H8V3.5A1.5 1.5 0 0 0 6.5 2"
      ></path>
    </svg>
  ),
  breadcrumb: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 2048 2048"
    >
      <path
        fill="currentColor"
        d="M256 512h1536v128H256zm384 512V896h1152v128zm384 384v-128h768v128z"
      ></path>
    </svg>
  ),
  tree: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="M19.5 17c-.13 0-.26 0-.39.04l-1.61-3.25a2.5 2.5 0 0 0-1.75-4.29c-.13 0-.25 0-.39.04l-1.63-3.25c.48-.45.77-1.08.77-1.79a2.5 2.5 0 0 0-5 0c0 .71.29 1.34.76 1.79L8.64 9.54c-.14-.04-.26-.04-.39-.04a2.5 2.5 0 0 0-1.75 4.29l-1.61 3.25C4.76 17 4.63 17 4.5 17a2.5 2.5 0 0 0 0 5A2.5 2.5 0 0 0 7 19.5c0-.7-.29-1.34-.76-1.79l1.62-3.25c.14.04.26.04.39.04s.25 0 .39-.04l1.63 3.25c-.47.45-.77 1.09-.77 1.79a2.5 2.5 0 0 0 5 0A2.5 2.5 0 0 0 12 17c-.13 0-.26 0-.39.04L10 13.79c.46-.45.75-1.08.75-1.79s-.29-1.34-.75-1.79l1.61-3.25c.13.04.26.04.39.04s.26 0 .39-.04L14 10.21c-.45.45-.75 1.09-.75 1.79a2.5 2.5 0 0 0 2.5 2.5c.13 0 .25 0 .39-.04l1.63 3.25c-.47.45-.77 1.09-.77 1.79a2.5 2.5 0 0 0 5 0a2.5 2.5 0 0 0-2.5-2.5"
      ></path>
    </svg>
  ),
  feather: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
    >
      <path
        fill="currentColor"
        d="M15.807.531c-.174-.177-.41-.289-.64-.363a3.8 3.8 0 0 0-.833-.15c-.62-.049-1.394 0-2.252.175C10.365.545 8.264 1.415 6.315 3.1S3.147 6.824 2.557 8.523c-.294.847-.44 1.634-.429 2.268c.005.316.05.62.154.88q.025.061.056.122A68 68 0 0 0 .08 15.198a.53.53 0 0 0 .157.72a.504.504 0 0 0 .705-.16a68 68 0 0 1 2.158-3.26c.285.141.616.195.958.182c.513-.02 1.098-.188 1.723-.49c1.25-.605 2.744-1.787 4.303-3.642l1.518-1.55a.53.53 0 0 0 0-.739l-.729-.744l1.311.209a.5.5 0 0 0 .443-.15l.663-.684c.663-.68 1.292-1.325 1.763-1.892c.314-.378.585-.752.754-1.107c.163-.345.278-.773.112-1.188a.5.5 0 0 0-.112-.172M3.733 11.62C5.385 9.374 7.24 7.215 9.309 5.394l1.21 1.234l-1.171 1.196l-.027.03c-1.5 1.789-2.891 2.867-3.977 3.393c-.544.263-.99.378-1.324.39a1.3 1.3 0 0 1-.287-.018Zm6.769-7.22c1.31-1.028 2.7-1.914 4.172-2.6a7 7 0 0 1-.4.523c-.442.533-1.028 1.134-1.681 1.804l-.51.524zm3.346-3.357C9.594 3.147 6.045 6.8 3.149 10.678c.007-.464.121-1.086.37-1.806c.533-1.535 1.65-3.415 3.455-4.976c1.807-1.561 3.746-2.36 5.31-2.68a8 8 0 0 1 1.564-.173"
      ></path>
    </svg>
  ),
  browser: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 48 48"
    >
      <defs>
        <mask id="ipSBrowser0">
          <g fill="none">
            <path
              stroke="#fff"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={4}
              d="M42 18v22a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V18"
            ></path>
            <path
              fill="#fff"
              stroke="#fff"
              strokeLinejoin="round"
              strokeWidth={4}
              d="M6 8a2 2 0 0 1 2-2h32a2 2 0 0 1 2 2v10H6z"
            ></path>
            <path
              fill="#000"
              fillRule="evenodd"
              d="M12 14a2 2 0 1 0 0-4a2 2 0 0 0 0 4m6 0a2 2 0 1 0 0-4a2 2 0 0 0 0 4m6 0a2 2 0 1 0 0-4a2 2 0 0 0 0 4"
              clipRule="evenodd"
            ></path>
          </g>
        </mask>
      </defs>
      <path
        fill="currentColor"
        d="M0 0h48v48H0z"
        mask="url(#ipSBrowser0)"
      ></path>
    </svg>
  ),
  a11y: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12s4.477 10 10 10m0-13a2 2 0 1 0 0-4a2 2 0 0 0 0 4m-5.707.31a.75.75 0 0 0-.586 1.38l.002.001l.002.001l.01.004l.032.014a15 15 0 0 0 .572.225c.38.145.914.338 1.527.53c.988.312 2.236.64 3.398.748v1.24c0 .43-.124.853-.357 1.216l-2.524 3.925a.75.75 0 0 0 1.262.812l2.37-3.686l2.368 3.686a.75.75 0 0 0 1.262-.812l-2.524-3.925a2.25 2.25 0 0 1-.357-1.217v-1.239c1.162-.108 2.41-.436 3.399-.748a28 28 0 0 0 2.098-.755l.033-.014l.01-.004l.002-.001a.75.75 0 0 0-.585-1.381l-.007.003l-.027.011l-.11.045q-.148.061-.42.164c-.36.137-.865.32-1.444.502c-1.178.37-2.588.715-3.699.715s-2.52-.345-3.698-.715a27 27 0 0 1-1.974-.711L6.3 9.313z"
        clipRule="evenodd"
      ></path>
    </svg>
  ),
  crescent: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 30 30"
    >
      <path
        fill="currentColor"
        d="M3.74 14.44c0-1.52.3-2.98.89-4.37s1.4-2.58 2.4-3.59s2.2-1.81 3.59-2.4s2.84-.89 4.37-.89s2.98.3 4.37.89s2.59 1.4 3.6 2.4s1.81 2.2 2.4 3.59s.89 2.84.89 4.37s-.3 2.98-.89 4.37s-1.4 2.59-2.4 3.6s-2.2 1.81-3.6 2.4s-2.85.89-4.37.89s-2.98-.3-4.37-.89s-2.58-1.4-3.59-2.4s-1.81-2.2-2.4-3.6s-.89-2.84-.89-4.37M15.9 4.42c1.48.99 2.7 2.34 3.65 4.05s1.42 3.7 1.42 5.97c0 4.8-1.6 8.13-4.79 9.99q2.475-.3 4.5-1.68c2.025-1.38 2.42-2.12 3.2-3.58s1.17-3.03 1.17-4.72c0-1.72-.41-3.32-1.22-4.8s-1.91-2.69-3.31-3.61s-2.93-1.47-4.62-1.62"
      ></path>
    </svg>
  ),
};

export default icons;
