import Link from "next/link";

export default function Header({
  title,
  subtitle,
  back,
  right,
}: {
  title: string;
  subtitle?: string;
  back?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="pt-6 px-5 pb-2 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {back && (
          <Link href={back} className="w-9 h-9 rounded-full bg-ink-100 flex items-center justify-center hairline border border-ink-300/60">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f5f5f0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Link>
        )}
        <div>
          {subtitle && <div className="text-[11px] uppercase tracking-[0.2em] text-bone-mute">{subtitle}</div>}
          <div className="text-[22px] font-light tracking-tightest text-bone leading-tight">{title}</div>
        </div>
      </div>
      <div className="flex items-center gap-2">{right}</div>
    </div>
  );
}
