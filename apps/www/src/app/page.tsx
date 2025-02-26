import Link from "next/link";
import Features from "./features";
import { cn } from "@/lib/utils";
import LogoLarge from "@/components/logo-large";

export default function Home() {
  return (
    <div>
      <div className="max-w-screen-lg mx-auto">
        <div className="flex md:flex-row flex-col">
          <div className="md:pl-[40px] px-4 flex-shrink-[3]">
            <h1>
              <LogoLarge className="lg:max-w-96 max-w-80 lg:ml-0 lg:mt-24 md:mt-16 mt-8 mx-auto" />
              <span className="sr-only">Neotoc</span>
            </h1>
            <h2 className="mt-8 lg:ml-10 lg:text-left text-center lg:text-2xl md:text-xl text-lg font-extralight">
              Easily generate{" "}
              <b className="font-bold">beautiful table of contents</b> with{" "}
              <b className="font-bold">JavaScript</b>.
            </h2>
            <div className="lg:ml-10 md:flex flex-col hidden gap-2 lg:items-start items-center mt-12">
              <CTAButton />
              <StarOnGithubButton />
            </div>
          </div>
          <div className="flex md:justify-end justify-center flex-shrink-1">
            <Video />
          </div>
        </div>
        <div className="lg:ml-12 md:hidden flex gap-3 items-start lg:justify-start justify-center mt-10 flex-wrap mx-5">
          <CTAButton />
          <StarOnGithubButton />
        </div>
      </div>
      <Features />
    </div>
  );
}

function Video() {
  const borderImageBlock = `[border-image:linear-gradient(to_bottom,_transparent_0%,_hsl(var(--border))_40px,_hsl(var(--border))_calc(100%-40px),transparent_100%)_1]`;
  const borderImageInline = `[border-image:linear-gradient(to_right,_transparent_0%,_hsl(var(--border))_40px,_hsl(var(--border))_calc(100%-40px),transparent_100%)_1]`;
  return (
    <div className="relative m-[40px] shadow-[0_0_150px_hsl(210deg_60%_68%/0.11)]">
      <div
        className={cn(
          "absolute left-0 w-0 h-[calc(100%+80px)] top-[-40px] border-l",
          borderImageBlock,
        )}
      ></div>
      <div
        className={cn(
          "absolute right-0 w-0 h-[calc(100%+80px)] top-[-40px] border-l",
          borderImageBlock,
        )}
      ></div>
      <div
        className={cn(
          "absolute top-0 h-0 w-[calc(100%+80px)] left-[-40px] border-t",
          borderImageInline,
        )}
      ></div>
      <div
        className={cn(
          "absolute bottom-0 h-0 w-[calc(100%+80px)] left-[-40px] border-t",
          borderImageInline,
        )}
      ></div>
      <div className="dark:block hidden">
        <video
          width="340"
          height="562"
          className="[aspect-ratio:340/562]"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="neotoc-dark.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="dark:hidden block">
        <video
          width="340"
          height="562"
          className="[aspect-ratio:340/562]"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="neotoc-light.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}

function CTAButton() {
  return (
    <Link
      className="inline-block transition text-xl text-center text-white shadow-lg shadow-purple-500/10 bg-gradient-to-br from-purple-600/80 to-red-600/80 hover:bg-secondary border border-zinc-500/40 hover:border-zinc-500/80 rounded-xl py-2 px-4 hover:translate-y-[-2px]"
      href="/learn#get-started"
    >
      🚀 Get started
    </Link>
  );
}

function StarOnGithubButton() {
  return (
    <Link
      className="inline-block hover:bg-secondary text-xl shadow-lg shadow-zinc-300/5 border rounded-xl py-2 px-4  transition hover:translate-y-[-2px]"
      href="https://github.com/ashutoshbw/neotoc"
      target="_blank"
    >
      Star on Github
    </Link>
  );
}
