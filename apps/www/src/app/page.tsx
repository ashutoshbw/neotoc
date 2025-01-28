import Link from "next/link";
import Image from "next/image";
import NeotocFullTextLogoDark from "../../public/logo-full-text-dark.svg";
import NeotocFullTextLogoLight from "../../public/logo-full-text-light.svg";
import Features from "./features";

export default function Home() {
  return (
    <div className="max-w-[140ch] mx-auto pb-10">
      <div className="flex justify-center">
        <div className="md:w-[340px] md:h-[562px] min-w-[170px] md:mt-2 mt-3 sm:block hidden">
          <Video />
        </div>
        <div className="p-4 md:ml-8 w-[450px] sm:block relative left-0 sm:left-[-10px] flex flex-col justify-center">
          <h1 className="md:mt-24 sm:mt-10 my-8 md:block flex justify-center">
            <span className="dark:block hidden md:relative left-[-28px]">
              <Image
                className="block md:w-[300px] sm:w-[260px] w-[250px]"
                src={NeotocFullTextLogoDark}
                alt="Neotoc Logo"
              />
            </span>
            <span className="block dark:hidden md:relative left-[-28px]">
              <Image
                className="block md:w-[300px] sm:w-[260px] w-[250px]"
                src={NeotocFullTextLogoLight}
                alt="Neotoc Logo"
              />
            </span>
          </h1>
          <p className="mt-2">
            A tool for creating hyper-smooth table of contents with JavaScript.
          </p>
          <div className="md:block sm:flex justify-center hidden mt-8">
            <CTAButton />
          </div>
          <div className="md:block sm:flex justify-center hidden mt-3">
            <StarOnGithubButton />
          </div>
        </div>
      </div>
      <div className="flex gap-2 justify-center my-10 flex-wrap">
        <div className="sm:hidden block">
          <CTAButton />
        </div>
        <div className="sm:hidden block">
          <StarOnGithubButton />
        </div>
      </div>
      <div className="sm:hidden flex justify-center w-[270px] mx-auto">
        <Video />
      </div>
      <Features />
    </div>
  );
}

function Video() {
  return (
    <>
      <div className="dark:block hidden">
        <video autoPlay loop muted playsInline>
          <source src="neotoc-dark.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="dark:hidden block">
        <video autoPlay loop muted playsInline>
          <source src="neotoc-light.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </>
  );
}

function CTAButton() {
  return (
    <Link
      className="inline-block transition text-xl text-white shadow-lg shadow-purple-500/10 bg-gradient-to-br from-purple-600/80 to-red-600/80 hover:bg-secondary border border-zinc-500/40 hover:border-zinc-500/80 rounded-xl py-2 px-4 hover:translate-y-[-2px]"
      href="/docs#get-started"
    >
      ✨ See it in action
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
