"use client";

/*
 * I don't use this component in the doc website because it requires a bit
 * involved setup using react context that allows me to use sliders to
 * interactively change toc's appearance and behavior.
 *
 * I've kept this component here to show anyone stubled upon here that how easy
 * it can be to use neotoc in React. The pattern below is proablly what you want
 * in most of the cases.
 */

import { useEffect, useRef } from "react";
import neotoc from "neotoc";
import "./neotoc.css";

export default function Toc({
  from,
  className,
}: {
  from: string;
  className?: string;
}) {
  const toRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return neotoc({ io: `${from} >> h*`, to: toRef.current! });
  }, [from]);
  return <div ref={toRef} className={className}></div>;
}
