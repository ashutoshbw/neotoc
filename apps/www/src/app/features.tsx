import icons from "./feature-icons";
import styles from "./animation.module.css";
import { cn } from "@/lib/utils";

const data = [
  {
    title: "Proportional Highlighting",
    description:
      "Neotoc redefines active section highlighting by replacing the conventional, vague approach with precise proportional highlighting, delivering an enjoyable user experience.",
    svg: icons.ruler,
  },
  {
    title: "Automatic Scrolling",
    description:
      "With automatic scrolling, the table of contents stays perfectly in sync with your scrolling, always reflecting your current position on the page.",
    svg: icons.mouse,
  },
  {
    title: "Automatic Folding",
    description:
      "With automatic folding enabled, sections in the table of contents magically fold or unfold based on your position on the page. Manual control is always available.",
    svg: icons.folding,
  },
  {
    title: "Powerful Fold Buttons",
    description:
      "Four intuitive buttons at the top-right let you fold or unfold the table of contents by one level or all at once, making navigation effortless.",
    svg: icons.button,
  },
  {
    title: "Breadcrumb Navigation",
    description:
      "Lost in nested sections? Neotoc helps you to create your own breadcrumb to quickly view or navigate to parent sections with ease.",
    svg: icons.breadcrumb,
  },
  {
    title: "Customize Easily",
    description:
      "Leverage dozens of CSS variables to easily tweak colors and sizes, ensuring your project’s design achieves a cohesive look.",
    svg: icons.palette,
  },
  {
    title: "Written in TypeScript",
    description: "Can be used in both TypeScript and JavaScript projects.",
    svg: icons.ts,
  },
  {
    title: "Excellent Browser Support",
    description: "Fully compatible with all modern and popular web browsers.",
    svg: icons.browser,
  },
  {
    title: "Framework-Agnostic",
    description: "Designed to work across all major frameworks and libraries.",
    svg: icons.framework,
  },
  {
    title: "Zero Dependencies",
    description: "Built entirely from scratch with no external dependencies.",
    svg: icons.tree,
  },
  {
    title: "Lightweight",
    description:
      "The JavaScript bundle is just 5.3KB, with default CSS weighing only 2.1KB (both minified and gzipped).",
    svg: icons.feather,
  },
  {
    title: "Accessible",
    description: "Accessible with keyboards, touchscreens and screen readers.",
    svg: icons.a11y,
  },
];

export default function Features() {
  return (
    <div>
      <h2
        className={cn(
          styles.animateHeading,
          "mt-16 mb-10 font-thin text-5xl text-center tracking-tighter"
        )}
      >
        Why Neotoc?
      </h2>
      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5 mx-5 max-w-screen-xl mb-20 perspective-dramatic">
        {data.map((feature, i) => (
          <div
            key={i}
            className={cn(
              styles.animateFeature,
              "transition p-4 rounded-lg dark:bg-zinc-900/50 hover:dark:bg-zinc-900/90 bg-zinc-100 hover:bg-zinc-200 shadow-md dark:shadow-black shadow-zinc-300 group"
            )}
          >
            <span className="flex justify-center text-3xl dark:group-hover:[&_svg]:text-[#a1c4e8] group-hover:[&_svg]:text-[#13304e]">
              {feature.svg}
            </span>
            <h3 className="text-lg text-center font-semibold mt-4 mb-4 dark:group-hover:text-[#a1c4e8] group-hover:text-[#13304e]">
              {feature.title}
            </h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
