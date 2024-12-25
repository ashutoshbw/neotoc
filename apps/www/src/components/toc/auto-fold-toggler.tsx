import { useContext } from "react";
import { TocContext } from "./toc-context";
import { Button } from "@/components/ui/button";

export function AutoFoldToggler() {
  const tc = useContext(TocContext);

  return (
    tc && (
      <span data-nt-controller>
        <Button
          onClick={() => {
            tc.setAutoFold(!tc.autoFold);
          }}
          variant="outline"
        >
          Turn {tc.autoFold ? "off" : "on"} Auto Folding
        </Button>
      </span>
    )
  );
}
