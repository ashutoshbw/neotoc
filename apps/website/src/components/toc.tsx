"use client";

import { useEffect, useRef } from "react";
import neotoc from "neotoc";
import "./neotoc.css";

export default function Toc({ from }: { from: string }) {
  const toRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return neotoc({ io: `${from} >> h*`, to: toRef.current! });
  }, [from]);
  return <div ref={toRef}></div>;
}
