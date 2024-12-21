import { HashIcon } from "lucide-react";
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
    <As
      className={cn(
        "scroll-m-20 tracking-tight",
        as !== "h1" && "relative flex border-b font-semibold",
        className
      )}
      {...props}
    >
      {as == "h1" ? (
        props.children
      ) : (
        <a href={`#${props.id}`} className="group flex-grow pb-[0.1em]">
          <span className="absolute left-[-0.8em] w-[0.8em] text-muted-foreground opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition">
            <HashIcon
              aria-label="Link to section"
              className="inline w-[0.7em] h-[0.7em]"
            />
          </span>
          {props.children}
        </a>
      )}
    </As>
  );
}
