import { useContext } from "react";
import { TocContext } from "./toc-context";
import { Switch } from "@/components/ui/switch";

export function AutoFoldSwitch() {
  const tc = useContext(TocContext);

  return (
    tc && (
      <span data-nt-controller className="relative top-[2px]">
        <Switch
          checked={tc.autoFold}
          onCheckedChange={(checked) => tc.setAutoFold(checked)}
        />
      </span>
    )
  );
}
