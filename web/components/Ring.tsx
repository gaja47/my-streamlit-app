type RingProps = {
  size?: number;
  stroke?: number;
  value: number; // 0-100
  color: string;
  track?: string;
  label?: string;
};

export function Ring({ size = 140, stroke = 12, value, color, track = "#1f1f24", label }: RingProps) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.min(100, Math.max(0, value));
  const offset = c - (pct / 100) * c;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <linearGradient id={`g-${color}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.85" />
          <stop offset="100%" stopColor={color} stopOpacity="1" />
        </linearGradient>
      </defs>
      <circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={`url(#g-${color})`}
        strokeWidth={stroke}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      {label && (
        <text x="50%" y="52%" textAnchor="middle" dominantBaseline="middle" fontSize={size * 0.18} fill="#f5f5f0" fontWeight={300} letterSpacing="-0.04em">
          {label}
        </text>
      )}
    </svg>
  );
}

export function NestedRings({ values }: { values: { value: number; color: string }[] }) {
  // up to 3 concentric rings
  const size = 160;
  const stroke = 12;
  const gap = 4;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {values.map((v, i) => {
        const r = (size - stroke) / 2 - i * (stroke + gap);
        const c = 2 * Math.PI * r;
        const pct = Math.min(100, Math.max(0, v.value));
        const offset = c - (pct / 100) * c;
        return (
          <g key={i}>
            <circle cx={size / 2} cy={size / 2} r={r} stroke="#1f1f24" strokeWidth={stroke} fill="none" />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              stroke={v.color}
              strokeOpacity="0.95"
              strokeWidth={stroke}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={offset}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          </g>
        );
      })}
    </svg>
  );
}
