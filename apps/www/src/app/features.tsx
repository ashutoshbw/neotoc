import icons from "./feature-icons";
import styles from "./animation.module.css";
import { cn } from "@/lib/utils";

const data = [
  {
    title: <>Partial Highlighting</>,
    description: (
      <>
        <b>Neotoc</b> can partially highlight any <b>list item</b> in the{" "}
        <b>table of contents</b>, resulting in a <b>smoother user experience</b>
        .
      </>
    ),
    svg: icons.crescent,
  },
  {
    title: "Automatic Scrolling",
    description: (
      <>
        By default it keeps the scroll of table of contents{" "}
        <b>in sync with your page scrolling</b>, reflecting what you are viewing
        on the page.
      </>
    ),
    svg: icons.mouse,
  },
  {
    title: "Automatic Folding",
    description: (
      <>
        When enabled, it can <b>automatically fold or unfold</b> the table of
        contents based on the <b>scroll position on the page</b>. Manual control
        is always available.
      </>
    ),
    svg: icons.folding,
  },
  {
    title: "Handy Fold Buttons",
    description: (
      <>
        Four buttons <b>at the top-right</b> let you <b>fold or unfold</b> the
        table of contents by <b>one level</b> or <b>all at once</b>.
      </>
    ),
    svg: icons.button,
  },
  {
    title: "Breadcrumb",
    description: (
      <>
        Neotoc helps you to <b>create your own breadcrumb</b> to quickly view or
        navigate to parent sections with ease.
      </>
    ),
    svg: icons.breadcrumb,
  },
  {
    title: "Ready-made Styles",
    description: (
      <>
        You can get a head-start with carefully hand-crafted <b>base</b> and{" "}
        <b>colors</b> styles.
      </>
    ),
    svg: icons.shirt,
  },
  {
    title: "Customize Easily",
    description: (
      <>
        Easily tweak <b>colors</b> and <b>sizes</b> with <b>CSS variables</b>.
      </>
    ),
    svg: icons.palette,
  },
  {
    title: "Browser Support",
    description: (
      <>
        <b>Works well</b> with all <b>modern and popular</b> web browsers.
      </>
    ),
    svg: icons.browser,
  },
  {
    title: "Framework Agnostic",
    description: (
      <>
        Neotoc is not tied to any particular library or framework, freeing you
        to <b>use it anywhere</b> DOM exists.
      </>
    ),
    svg: icons.framework,
  },
  {
    title: "Zero Dependencies",
    description: (
      <>
        Built entirely from scratch with <b>no external dependencies</b>.
      </>
    ),
    svg: icons.tree,
  },
  {
    title: "Lightweight",
    description: (
      <>
        The <b>JavaScript bundle</b> is <b>5.3KB</b>, with default <b>CSS</b>{" "}
        weighing <b>2.1KB</b> (both minified and gzipped).
      </>
    ),
    svg: icons.feather,
  },
  {
    title: "Accessible",
    description: (
      <>
        Accessible with <b>keyboards</b>, <b>touchscreens</b> and{" "}
        <b>screen readers</b>.
      </>
    ),
    svg: icons.a11y,
  },
];

export default function Features() {
  return (
    <div className="mx-4">
      <h2
        className={cn(
          styles.animateHeading,
          "mt-28 mb-10 font-thin text-5xl text-center tracking-tighter",
        )}
      >
        Features
      </h2>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 max-w-screen-xl mb-20 mx-auto">
        {data.map((feature, i) => (
          <div
            key={i}
            className={cn(
              styles.animateFeature,
              "transition p-4 rounded-lg dark:bg-zinc-900/50 hover:dark:bg-zinc-900/90 bg-zinc-100 hover:bg-zinc-200 shadow-md dark:shadow-black shadow-zinc-300 group",
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
