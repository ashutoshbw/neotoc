"use client";

import { useEffect, useRef } from "react";
import neotoc from "neotoc";
import "./neotoc.css";

export default function Toc({ from }: { from: string }) {
  const outEltRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return neotoc({ io: `${from} >> h*`, to: outEltRef.current! });
  }, [from]);
  return <div ref={outEltRef}></div>;
}
