"use client";

import { useContext } from "react";
import { ThemeToggler } from "@/components/theme-toggler";
import { TocProvider } from "@/components/toc/toc-provider";
import { TocContext } from "@/components/toc/toc-context";
import { RelativeFontSizeSlider } from "@/components/toc/relative-font-size-slider";
import "./page.css";

export default function Home() {
  return (
    <TocProvider>
      <div>
        <div className="fixed z-10">
          <ThemeToggler />
          <RelativeFontSizeSlider />
          <IndentLineGapSlider />
          <AutoFoldToggler />
        </div>
        <div className="wrapper">
          <article>
            <h1 id="section-1">Welcome to Random World</h1>
            <p>
              Discover the beauty of randomness and its endless possibilities.
            </p>

            <h2 id="section-2">Why Randomness Matters</h2>
            <p>Randomness drives creativity, innovation, and even evolution.</p>

            <h2 id="section-3">Applications of Randomness</h2>
            <p>
              From encryption to games, randomness finds its way everywhere.
            </p>

            <h3 id="section-4">Random Fun Facts</h3>
            <p>
              Did you know that bees use random patterns to forage for food?
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab sit
              suscipit placeat laboriosam modi similique quae commodi dolor!
              Aperiam libero exercitationem illo ducimus assumenda? Sequi nam
              consectetur itaque voluptatem ex!
            </p>

            <p>
              Did you know that bees use random patterns to forage for food?
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab sit
              suscipit placeat laboriosam modi similique quae commodi dolor!
              Aperiam libero exercitationem illo ducimus assumenda? Sequi nam
              consectetur itaque voluptatem ex!
            </p>

            <h4 id="section-5">Quotes on Randomness</h4>
            <p>Life is a series of random chances waiting to be seized.</p>

            <h5 id="section-6">Challenges in Randomness</h5>
            <p>Generating true randomness is harder than you might think!</p>

            <h6 id="section-7">Understanding Chaos</h6>
            <p>Chaos often feels random, but theres order hiding within it.</p>

            <h3 id="section-8">Pseudo-random Numbers</h3>
            <p>Computers rely on algorithms to simulate randomness.</p>

            <h1 id="section-9">The Role of Patterns</h1>
            <p>Even in randomness, patterns can emerge unexpectedly.</p>

            <h2 id="section-10">Nature’s Randomness</h2>
            <p>
              The swirls of galaxies and ocean waves are influenced by random
              forces.
            </p>

            <h2 id="section-11">Mathematics of Randomness</h2>
            <p>Probability theory is the backbone of studying randomness.</p>

            <h3 id="section-12">Random Acts of Kindness</h3>
            <p>A random smile can brighten someones day.</p>

            <h3 id="section-13">Random Generators</h3>
            <p>Random generators are widely used in games and simulations.</p>

            <h2 id="section-14">Exploring Unpredictability</h2>
            <p>Lifes unpredictability is what makes it thrilling.</p>

            <h3 id="section-15">Random Trivia</h3>
            <p>Bananas are berries, but strawberries arent!</p>

            <h4 id="section-16">Random in Technology</h4>
            <p>Cryptography relies on randomness for secure communications.</p>

            <h5 id="section-17">Random in Design</h5>
            <p>Random patterns can add uniqueness to designs.</p>

            <h1 id="section-18">The Science of Randomness</h1>
            <p>
              Quantum mechanics introduces true randomness at a subatomic level.
            </p>

            <h2 id="section-19">Random Thoughts</h2>
            <p>Randomness teaches us to embrace uncertainty.</p>

            <h3 id="section-20">Conclusion</h3>
            <p>In randomness, we find beauty, purpose, and inspiration.</p>
          </article>
          <aside id="sidebar"></aside>
        </div>
      </div>
    </TocProvider>
  );
}

function IndentLineGapSlider() {
  const tc = useContext(TocContext);
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    tc?.setIndentLineGap(+e.target.value);
  };

  return (
    <div className="p-5 border bg-zinc-100 dark:bg-zinc-900">
      <label htmlFor="relative-font-size">
        <code>--indet-line-gap</code>:{" "}
      </label>
      <input
        type="range"
        id="indent-line-gap"
        min="0"
        max="50"
        step="1"
        value={tc?.indentLineGap}
        onChange={handleChange}
      />
      <span>{tc?.indentLineGap}px</span>
    </div>
  );
}

function AutoFoldToggler() {
  const tc = useContext(TocContext);

  return (
    <div className="p-5 border bg-zinc-100 dark:bg-zinc-900">
      <button
        onClick={() => {
          tc?.setAutoFold(!tc.autoFold);
        }}
      >
        <code>autoFold</code>: {tc?.autoFold === true ? "true" : "false"}
      </button>
    </div>
  );
}
