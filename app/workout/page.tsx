import Header from "@/components/Header";
import { HeartRateChart } from "@/components/Charts";
import { hrSeries, workout } from "@/lib/mockData";

export default function Workout() {
  return (
    <div>
      <Header
        title={workout.title}
        subtitle="Live · Strength"
        back="/"
        right={
          <button className="w-10 h-10 rounded-full bg-strain/20 border border-strain/30 flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-sm bg-strain" />
          </button>
        }
      />

      <div className="px-5 mt-2">
        <div className="card p-5">
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-[0.25em] text-bone-mute">Elapsed</div>
            <div className="text-[44px] font-light tracking-tightest tabular leading-none mt-1">{workout.elapsed}</div>
          </div>
          <div className="flex items-center justify-center gap-4 mt-5">
            <div className="text-center">
              <div className="text-[10px] uppercase tracking-[0.2em] text-bone-mute">Heart rate</div>
              <div className="text-[34px] font-light tracking-tightest tabular text-strain mt-1">{workout.hr}<span className="text-bone-mute text-[12px] ml-1">bpm</span></div>
            </div>
            <div className="w-px h-12 bg-ink-300/60" />
            <div className="text-center">
              <div className="text-[10px] uppercase tracking-[0.2em] text-bone-mute">Zone</div>
              <div className="text-[34px] font-light tracking-tightest tabular mt-1">Z{workout.zone}</div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 mt-5 text-center">
            <Stat label="Cal" v={workout.cals} />
            <Stat label="Strain" v={workout.strain} />
            <Stat label="Avg" v={workout.avgHr} unit="bpm" />
            <Stat label="Peak" v={workout.peakHr} unit="bpm" />
          </div>

          <div className="mt-5">
            <HeartRateChart values={hrSeries.slice(8, 28)} />
          </div>
        </div>
      </div>

      <div className="px-5 mt-4">
        <div className="card p-5">
          <div className="text-[10px] uppercase tracking-[0.25em] text-bone-mute mb-1">Current set</div>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-[18px] mt-1">{workout.exercises[0].name}</div>
              <div className="text-[11px] text-bone-mute mt-0.5">Set {workout.exercises[0].current + 1} of {workout.exercises[0].target}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-[0.2em] text-bone-mute">Rest</div>
              <div className="text-[22px] tabular font-light tracking-tightest mt-1">{workout.exercises[0].rest}</div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <Input label="Reps" v="8" />
            <Input label="Weight" v="72.5 kg" />
            <Input label="RPE" v="8" />
          </div>

          <button className="mt-4 w-full rounded-2xl bg-bone text-ink py-3.5 font-medium tracking-tight">Log set</button>

          <div className="mt-5 border-t border-ink-300/60 pt-4 space-y-2">
            <div className="text-[10px] uppercase tracking-[0.25em] text-bone-mute mb-1">Previous sets</div>
            {workout.exercises[0].sets.map((s, i) => (
              <div key={i} className="flex items-center justify-between text-[12px]">
                <div className="text-bone-mute">Set {i + 1}</div>
                <div className="flex gap-4 tabular">
                  <span>{s.reps} reps</span>
                  <span>{s.kg} kg</span>
                  <span className="text-bone-mute">RPE {s.rpe}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 mt-4">
        <div className="text-[10px] uppercase tracking-[0.25em] text-bone-mute mb-3 px-1">Up next</div>
        <div className="space-y-2">
          {workout.exercises.slice(1).map((ex, i) => (
            <div key={ex.name} className="subcard p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-ink-100 border border-ink-300/60 text-[11px] tabular text-bone-mute flex items-center justify-center">{i + 2}</div>
                <div className="text-[14px]">{ex.name}</div>
              </div>
              <div className="text-[11px] text-bone-mute tabular">{ex.target} sets</div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 mt-4 grid grid-cols-2 gap-3">
        <button className="rounded-2xl bg-ink-100 border border-ink-300/60 py-3 text-[13px]">Pause</button>
        <button className="rounded-2xl bg-strain/90 text-bone py-3 text-[13px] font-medium">End workout</button>
      </div>
    </div>
  );
}

function Stat({ label, v, unit }: { label: string; v: string | number; unit?: string }) {
  return (
    <div className="bg-ink-100 rounded-2xl py-3 border border-ink-300/60">
      <div className="text-[10px] uppercase tracking-[0.2em] text-bone-mute">{label}</div>
      <div className="text-[16px] tabular font-light tracking-tightest mt-1">{v}{unit && <span className="text-bone-mute text-[10px] ml-1">{unit}</span>}</div>
    </div>
  );
}

function Input({ label, v }: { label: string; v: string }) {
  return (
    <div className="bg-ink-200 rounded-2xl px-3 py-3">
      <div className="text-[10px] uppercase tracking-[0.2em] text-bone-mute">{label}</div>
      <div className="text-[18px] tabular font-light mt-1">{v}</div>
    </div>
  );
}
