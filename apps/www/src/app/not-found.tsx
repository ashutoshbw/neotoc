import Link from "next/link";

export default function NotFound() {
  return (
    <div className="text-center">
      <h2 className="text-4xl font-extrabold mt-20">Not Found</h2>
      <p className="mt-4">Could not find requested resource.</p>
      <Link className="hover:underline" href="/">
        Go Home!
      </Link>
    </div>
  );
}
