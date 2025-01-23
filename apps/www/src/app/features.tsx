import icons from "./feature-icons";

const data = [
  {
    title: "Proportional Highlighting",
    description:
      "Unlike conventional active section highlighting, this feature uses proportional highlighting to deliver an intuitive and ultra-smooth user experience.",
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
    title: "Customize Effortlessly",
    description:
      "Leverage dozens of CSS variables to effortlessly tweak colors and sizes, ensuring your project’s design achieves a flawless, cohesive look.",
    svg: icons.palette,
  },
  {
    title: "Written in TypeScript",
    description:
      "Neotoc is built with TypeScript, ensuring seamless integration with both TypeScript and JavaScript projects.",
    svg: icons.ts,
  },
  {
    title: "Built for the Modern Web",
    description:
      "Neotoc is a forward-thinking solution, utilizing modern web features to make every aspect of the user experience as enjoyable as possible.",
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
    title: "Fully Accessible",
    description:
      "Neotoc is built for everyone, offering full accessibility with keyboards, touchscreens, and screen readers.",
    svg: icons.a11y,
  },
];

export default function Features() {
  return (
    <div>
      <h2 className="mt-16 mb-10 font-thin text-5xl text-center">
        Why Neotoc?
      </h2>
      <div className="grid grid-cols-3 gap-5 mx-5 max-w-screen-xl">
        {data.map((feature, i) => (
          <div key={i} className="border p-4 rounded-lg bg-zinc-900/50">
            <span className="text-3xl">{feature.svg}</span>
            <h3 className="text-lg font-semibold mt-4 mb-4">{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
