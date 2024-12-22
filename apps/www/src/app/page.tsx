"use client";

import { useState, useEffect } from "react";
import Doc from "./doc.mdx";
import { ThemeToggler } from "@/components/theme-toggler";

export default function Home() {
  const [state, setState] = useState(false);

  useEffect(() => {
    const demoElt = document.querySelector("#demo");

    const intervalId = setInterval(() => {
      console.log(document.body.contains(demoElt));
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div>
      <ThemeToggler />
      <button
        onClick={() => {
          setState(!state);
        }}
      >
        Toggle state
      </button>
      <span>{`${state}`}</span>
      <Doc />
    </div>
  );
}
