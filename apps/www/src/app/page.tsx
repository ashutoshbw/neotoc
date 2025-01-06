import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="m-4">
      <h1 className="text-center text-4xl font-extrabold lg:text-5xl mt-12">
        Neotoc
      </h1>
      <h2 className="text-center font-semibod md:text-2xl text-xl mt-8">
        Easiest way to make <i>intuitive</i> Table of Contents UI for your
        webpage.
      </h2>
      <div className="grid place-items-center mt-12">
        <Link href="/docs">
          <Button className="text-2xl font-bold p-7 shadow-xl shadow-zinc-500/50">
            Documentation
          </Button>
        </Link>
      </div>
    </div>
  );
}
