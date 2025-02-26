import React from "react";
import { AlertTriangle, Info, Lightbulb } from "lucide-react";

type AdmonitionType = "tip" | "warning" | "note";

interface AdmonitionProps {
  type: AdmonitionType;
  title: React.ReactNode;
  children: React.ReactNode;
}

const iconMap = {
  tip: <Lightbulb className="text-yellow-300" />,
  warning: <AlertTriangle className="text-yellow-500" />,
  note: <Info className="text-blue-500" />,
};

const bgColorMap = {
  tip: "bg-zinc-100 dark:bg-zinc-700 border-yellow-300",
  warning: "bg-zinc-100 dark:bg-zinc-700 border-yellow-500",
  note: "bg-zinc-100 dark:bg-zinc-700 border-blue-500",
};

function Admonition({ type, title, children }: AdmonitionProps) {
  return (
    <div
      className={`admonition border-l-4 p-4 mt-6 ${bgColorMap[type]} rounded-md shadow-sm`}
    >
      <div className="flex items-center mb-2">
        {iconMap[type]}
        <h3 className="ml-2 font-semibold text-zinc-900 dark:text-zinc-100">
          {title}
        </h3>
      </div>
      <div className="text-zinc-800 dark:text-zinc-200">{children}</div>
    </div>
  );
}

export default Admonition;
