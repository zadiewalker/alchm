import Link from "next/link";

export function Card({ title, desc, href, tone }: {
  title: string; desc?: string; href: string; tone?: "default" | "blush" | "terra-tint";
}) {
  const tones = {
    default: "bg-white",
    blush: "bg-[var(--blush)]/60",
    "terra-tint": "bg-[var(--terra)]/[0.10]"
  } as const;
  
  return (
    <Link href={href}
      className={`group block rounded-2xl border border-[var(--line)] shadow-[var(--shadow)] p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--terra)] ${tones[tone || "default"]} hover:border-[var(--sage)] transition-all duration-200`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-medium text-[var(--ink)]">{title}</div>
          {desc && <p className="mt-1 text-[var(--ink-mute)]">{desc}</p>}
        </div>
        <span className="text-sm font-medium text-[var(--ink)] group-hover:text-[var(--sage)] transition-colors duration-200">Open →</span>
      </div>
    </Link>
  );
}