import { useContext } from "react";
import { TocContext } from "./toc-context";
import { Button } from "@/components/ui/button";

export function EllipsisToggler() {
  const tc = useContext(TocContext);

  return (
    tc && (
      <span data-nt-controller>
        <Button
          onClick={() => {
            tc.setEllipsis(!tc.ellipsis);
          }}
          variant="outline"
        >
          {tc.ellipsis ? "Do not use" : "Use"} Ellipsis(…)
        </Button>
      </span>
    )
  );
}
