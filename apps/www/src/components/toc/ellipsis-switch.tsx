import { useContext } from "react";
import { TocContext } from "./toc-context";
import { Switch } from "@/components/ui/switch";

export function EllipsisSwitch() {
  const tc = useContext(TocContext);

  return (
    tc && (
      <span data-nt-controller className="flex items-center gap-2">
        Ellipsis:{" "}
        <Switch
          checked={tc.ellipsis}
          onCheckedChange={(checked) => tc.setEllipsis(checked)}
        />
      </span>
    )
  );
}
