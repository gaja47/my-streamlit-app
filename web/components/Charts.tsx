export function Sparkline({
  values,
  color = "#8aa2d8",
  height = 60,
  width = 320,
  fill = true,
}: {
  values: number[];
  color?: string;
  height?: number;
  width?: number;
  fill?: boolean;
}) {
  if (!values.length) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = width / (values.length - 1 || 1);
  const points = values.map((v, i) => {
    const x = i * step;
    const y = height - ((v - min) / range) * (height - 6) - 3;
    return [x, y] as const;
  });
  const d = points.map((p, i) => `${i ? "L" : "M"}${p[0]},${p[1]}`).join(" ");
  const areaD = `${d} L ${width},${height} L 0,${height} Z`;
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`sp-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill && <path d={areaD} fill={`url(#sp-${color})`} />}
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function HeartRateChart({ values }: { values: number[] }) {
  const width = 380;
  const height = 120;
  const min = 50;
  const max = 180;
  const step = width / (values.length - 1);
  const pts = values.map((v, i) => [i * step, height - ((v - min) / (max - min)) * height]);
  const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0]},${p[1]}`).join(" ");
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="hr-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c98ba8" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#c98ba8" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[60, 100, 140].map((zone) => (
        <line key={zone} x1="0" x2={width} y1={height - ((zone - min) / (max - min)) * height} y2={height - ((zone - min) / (max - min)) * height} stroke="#1f1f24" strokeDasharray="2 4" />
      ))}
      <path d={`${d} L ${width},${height} L 0,${height} Z`} fill="url(#hr-fill)" />
      <path d={d} stroke="#c98ba8" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </svg>
  );
}

type Stage = "awake" | "rem" | "light" | "deep";
const stageColor: Record<Stage, string> = {
  awake: "#3a3a44",
  rem: "#b8a4d4",
  light: "#8aa2d8",
  deep: "#5b73a8",
};

export function SleepStages({ segments }: { segments: { stage: Stage; minutes: number }[] }) {
  const total = segments.reduce((s, x) => s + x.minutes, 0);
  const width = 380;
  const stageRow = (stage: Stage, y: number) => {
    let x = 0;
    return segments.map((seg, i) => {
      const w = (seg.minutes / total) * width;
      const active = seg.stage === stage;
      const rect = active ? <rect key={i} x={x} y={y} width={w} height={14} fill={stageColor[stage]} rx={3} /> : null;
      x += w;
      return rect;
    });
  };
  return (
    <svg width="100%" height="90" viewBox={`0 0 ${width} 90`} preserveAspectRatio="none">
      {(["awake", "rem", "light", "deep"] as Stage[]).map((s, i) => stageRow(s, i * 20 + 6))}
    </svg>
  );
}
