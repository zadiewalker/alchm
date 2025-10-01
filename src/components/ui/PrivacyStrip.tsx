import Link from "next/link";

export function PrivacyStrip() {
  return (
    <div className="mt-8 inline-block mx-auto rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-3 py-2 text-xs flex items-center gap-2">
      <span className="font-medium text-white">Your words stay yours.</span>
      <Link className="underline text-white/90 hover:text-white transition-colors duration-200" href="/account/export">
        Export
      </Link>
      <span className="opacity-50 text-white/60">·</span>
      <Link className="underline text-white/90 hover:text-white transition-colors duration-200" href="/account/delete">
        Delete
      </Link>
    </div>
  );
}