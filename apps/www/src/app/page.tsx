import Link from "next/link";
import Image from "next/image";
import NeotocFullTextLogoDark from "../../public/logo-full-text-dark.svg";
import NeotocFullTextLogoLight from "../../public/logo-full-text-light.svg";

export default function Home() {
  return (
    <div className="max-w-[140ch] mx-auto pb-10">
      <div className="flex justify-center">
        <div className="md:w-[340px] md:h-[562px] min-w-[170px] md:mt-2 mt-3 md:block">
          <Video />
        </div>
        <div className="p-4 md:ml-8 w-[400px] sm:block relative sm:left-0 left-[-10px] flex flex-col justify-center">
          <h1 className="md:mt-24 sm:mt-10 md:block flex justify-center">
            <span className="dark:block hidden md:relative left-[-34px]">
              <Image
                priority
                className="block md:w-[300px] sm:w-[260px] w-[180px]"
                src={NeotocFullTextLogoDark}
                alt="Neotoc Logo"
              />
            </span>
            <span className="md:block dark:hidden md:relative left-[-34px]">
              <Image
                priority
                className="block md:w-[300px] sm:w-[260px] w-[180px]"
                src={NeotocFullTextLogoLight}
                alt="Neotoc Logo"
              />
            </span>
          </h1>
          <p className="mt-6 text-lg italic md:text-left text-center">
            An open source library
          </p>
          <p className="mt-0 text-lg italic md:text-left text-center">
            to help you build
          </p>
          <p className="mt-0 text-lg italic md:text-left text-center">
            table of contents
          </p>
          <p className="mt-0 text-lg italic md:text-left text-center">
            like never before.
          </p>
          <div className="md:block sm:flex justify-center hidden mt-8">
            <Link
              className="inline-block transition text-xl shadow-lg shadow-blue-500/5  hover:bg-secondary border rounded-xl py-2 px-4"
              href="/docs#get-started"
            >
              🚀 Get started
            </Link>
          </div>
          <div className="md:block sm:flex justify-center hidden mt-3">
            <Link
              className="inline-block hover:bg-secondary text-xl shadow-lg shadow-yellow-500/5 border rounded-xl py-2 px-4"
              href="https://github.com/ashutoshbw/neotoc"
              target="_blank"
            >
              🌟 on Github
            </Link>
          </div>
        </div>
      </div>
      <div className="flex gap-2 justify-center mt-8 flex-wrap">
        <div className="sm:hidden block">
          <Link
            className="inline-block transition text-xl shadow-lg shadow-blue-500/5  hover:bg-secondary border rounded-full py-2 px-4"
            href="/docs#get-started"
          >
            🚀 Get started
          </Link>
        </div>
        <div className="sm:hidden block">
          <Link
            className="inline-block hover:bg-secondary text-xl shadow-lg shadow-yellow-500/5 border rounded-full py-2 px-4"
            href="https://github.com/ashutoshbw/neotoc"
          >
            🌟 on Github
          </Link>
        </div>
      </div>
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
