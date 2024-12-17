import { Link } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

type Types = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
type HeadingProps<T extends Types> = Omit<ComponentPropsWithoutRef<T>, "as"> & {
  as?: T;
};

export function Heading<T extends Types = "h1">({
  as,
  className,
  ...props
}: HeadingProps<T>): React.ReactElement {
  const As = as ?? "h1";

  if (!props.id) return <As className={className} {...props} />;

  return (
    <As className={cn("", className)} {...props}>
      <a href={`#${props.id}`} className="group">
        {props.children}
        <Link
          aria-label="Link to section"
          className="ml-1 inline size-3.5 text-muted-foreground transition-opacity opacity-0 group-hover:opacity-100"
        />
      </a>
    </As>
  );
}
