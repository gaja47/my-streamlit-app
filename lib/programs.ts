export type ProgramGoal = "strength" | "hypertrophy" | "fat_loss" | "general";

export type ProgramExercise = {
  exerciseId: string;
  sets: number;
  reps: string;
  rest: string;
  notes?: string;
};

export type ProgramDay = {
  label: string;
  focus: string;
  exercises: ProgramExercise[];
};

export type Program = {
  id: string;
  name: string;
  goal: ProgramGoal;
  level: "beginner" | "intermediate" | "advanced";
  daysPerWeek: number;
  durationWeeks: number;
  description: string;
  bestFor: string[];
  days: ProgramDay[];
};

export const programs: Record<string, Program> = {
  ppl: {
    id: "ppl",
    name: "Push / Pull / Legs (PPL)",
    goal: "hypertrophy",
    level: "intermediate",
    daysPerWeek: 6,
    durationWeeks: 12,
    description:
      "High-frequency hypertrophy split hitting each muscle group twice per week. Best when you can train 5-6x weekly and have 60-90 min sessions.",
    bestFor: ["Muscle mass", "Body recomposition", "Intermediate lifters with time to train"],
    days: [
      {
        label: "Day 1 - Push (Strength)",
        focus: "Chest, shoulders, triceps - heavier",
        exercises: [
          { exerciseId: "bench", sets: 4, reps: "5-6", rest: "3 min", notes: "Top set heaviest" },
          { exerciseId: "ohp", sets: 3, reps: "6-8", rest: "2-3 min" },
          { exerciseId: "incline_db_press", sets: 3, reps: "8-10", rest: "90 sec" },
          { exerciseId: "lateral_raise", sets: 3, reps: "12-15", rest: "60 sec" },
          { exerciseId: "tricep_pushdown", sets: 3, reps: "10-12", rest: "60 sec" },
          { exerciseId: "skullcrusher", sets: 3, reps: "8-12", rest: "60 sec" },
        ],
      },
      {
        label: "Day 2 - Pull (Strength)",
        focus: "Back, biceps - heavier",
        exercises: [
          { exerciseId: "deadlift", sets: 3, reps: "3-5", rest: "3-4 min", notes: "RPE 8 cap" },
          { exerciseId: "pullup", sets: 4, reps: "5-8", rest: "2 min" },
          { exerciseId: "barbell_row", sets: 3, reps: "6-8", rest: "2 min" },
          { exerciseId: "face_pull", sets: 3, reps: "12-15", rest: "60 sec" },
          { exerciseId: "bb_curl", sets: 3, reps: "8-10", rest: "60 sec" },
          { exerciseId: "hammer_curl", sets: 3, reps: "10-12", rest: "60 sec" },
        ],
      },
      {
        label: "Day 3 - Legs (Strength)",
        focus: "Quads, hams, glutes - heavier",
        exercises: [
          { exerciseId: "back_squat", sets: 4, reps: "5-6", rest: "3 min" },
          { exerciseId: "rdl", sets: 3, reps: "6-8", rest: "2 min" },
          { exerciseId: "walking_lunge", sets: 3, reps: "10/leg", rest: "90 sec" },
          { exerciseId: "leg_curl", sets: 3, reps: "10-12", rest: "60 sec" },
          { exerciseId: "calf_raise", sets: 4, reps: "10-15", rest: "60 sec" },
          { exerciseId: "hanging_leg_raise", sets: 3, reps: "8-12", rest: "60 sec" },
        ],
      },
      {
        label: "Day 4 - Push (Volume)",
        focus: "Chest, shoulders, triceps - higher reps",
        exercises: [
          { exerciseId: "incline_db_press", sets: 4, reps: "10-12", rest: "90 sec" },
          { exerciseId: "dips", sets: 3, reps: "8-12", rest: "2 min" },
          { exerciseId: "lateral_raise", sets: 4, reps: "15-20", rest: "60 sec", notes: "Drop set last set" },
          { exerciseId: "pushup", sets: 3, reps: "AMRAP", rest: "60 sec" },
          { exerciseId: "tricep_pushdown", sets: 4, reps: "12-15", rest: "45 sec" },
        ],
      },
      {
        label: "Day 5 - Pull (Volume)",
        focus: "Back, biceps - higher reps",
        exercises: [
          { exerciseId: "lat_pulldown", sets: 4, reps: "10-12", rest: "90 sec" },
          { exerciseId: "db_row", sets: 3, reps: "10-12", rest: "90 sec" },
          { exerciseId: "face_pull", sets: 4, reps: "15-20", rest: "45 sec" },
          { exerciseId: "hammer_curl", sets: 3, reps: "12-15", rest: "60 sec" },
          { exerciseId: "bb_curl", sets: 3, reps: "12-15", rest: "60 sec" },
        ],
      },
      {
        label: "Day 6 - Legs (Volume)",
        focus: "Quads, hams, glutes - higher reps + glute focus",
        exercises: [
          { exerciseId: "front_squat", sets: 3, reps: "8-10", rest: "2 min" },
          { exerciseId: "hip_thrust", sets: 4, reps: "10-12", rest: "90 sec" },
          { exerciseId: "leg_press", sets: 3, reps: "12-15", rest: "90 sec" },
          { exerciseId: "leg_extension", sets: 3, reps: "12-15", rest: "60 sec" },
          { exerciseId: "leg_curl", sets: 3, reps: "12-15", rest: "60 sec" },
          { exerciseId: "calf_raise", sets: 4, reps: "15-20", rest: "60 sec" },
        ],
      },
    ],
  },

  upper_lower: {
    id: "upper_lower",
    name: "Upper / Lower 4-Day",
    goal: "hypertrophy",
    level: "intermediate",
    daysPerWeek: 4,
    durationWeeks: 8,
    description:
      "Balanced 4-day split — great middle ground between full body and 6-day PPL. Each muscle hit twice weekly with manageable session length.",
    bestFor: ["Time-constrained intermediate lifters", "Strength + hypertrophy blend"],
    days: [
      {
        label: "Day 1 - Upper (Strength)",
        focus: "Heavy compounds",
        exercises: [
          { exerciseId: "bench", sets: 4, reps: "5-6", rest: "3 min" },
          { exerciseId: "barbell_row", sets: 4, reps: "5-6", rest: "3 min" },
          { exerciseId: "ohp", sets: 3, reps: "6-8", rest: "2 min" },
          { exerciseId: "pullup", sets: 3, reps: "6-10", rest: "2 min" },
          { exerciseId: "bb_curl", sets: 3, reps: "8-10", rest: "60 sec" },
          { exerciseId: "tricep_pushdown", sets: 3, reps: "10-12", rest: "60 sec" },
        ],
      },
      {
        label: "Day 2 - Lower (Strength)",
        focus: "Squat + deadlift focus",
        exercises: [
          { exerciseId: "back_squat", sets: 4, reps: "5-6", rest: "3 min" },
          { exerciseId: "rdl", sets: 3, reps: "6-8", rest: "2 min" },
          { exerciseId: "leg_press", sets: 3, reps: "10-12", rest: "90 sec" },
          { exerciseId: "leg_curl", sets: 3, reps: "10-12", rest: "60 sec" },
          { exerciseId: "calf_raise", sets: 4, reps: "10-15", rest: "60 sec" },
        ],
      },
      {
        label: "Day 3 - Upper (Volume)",
        focus: "Hypertrophy-rep ranges",
        exercises: [
          { exerciseId: "incline_db_press", sets: 4, reps: "8-12", rest: "90 sec" },
          { exerciseId: "lat_pulldown", sets: 4, reps: "10-12", rest: "90 sec" },
          { exerciseId: "db_row", sets: 3, reps: "10-12", rest: "90 sec" },
          { exerciseId: "lateral_raise", sets: 4, reps: "12-15", rest: "60 sec" },
          { exerciseId: "face_pull", sets: 3, reps: "15-20", rest: "45 sec" },
          { exerciseId: "hammer_curl", sets: 3, reps: "10-12", rest: "60 sec" },
          { exerciseId: "skullcrusher", sets: 3, reps: "10-12", rest: "60 sec" },
        ],
      },
      {
        label: "Day 4 - Lower (Volume)",
        focus: "Hypertrophy + glute work",
        exercises: [
          { exerciseId: "front_squat", sets: 3, reps: "8-10", rest: "2 min" },
          { exerciseId: "hip_thrust", sets: 4, reps: "8-12", rest: "90 sec" },
          { exerciseId: "walking_lunge", sets: 3, reps: "10/leg", rest: "90 sec" },
          { exerciseId: "leg_extension", sets: 3, reps: "12-15", rest: "60 sec" },
          { exerciseId: "hanging_leg_raise", sets: 3, reps: "8-12", rest: "60 sec" },
          { exerciseId: "plank", sets: 3, reps: "45s", rest: "45 sec" },
        ],
      },
    ],
  },

  full_body: {
    id: "full_body",
    name: "Full Body 3-Day",
    goal: "general",
    level: "beginner",
    daysPerWeek: 3,
    durationWeeks: 12,
    description:
      "Three full-body sessions per week. Highest return on investment for beginners, busy professionals, and anyone training while cutting weight aggressively.",
    bestFor: ["Beginners", "Busy schedules", "Cutting / fat loss while preserving muscle"],
    days: [
      {
        label: "Day A",
        focus: "Squat-pattern emphasis",
        exercises: [
          { exerciseId: "back_squat", sets: 3, reps: "5-8", rest: "2-3 min" },
          { exerciseId: "bench", sets: 3, reps: "6-8", rest: "2 min" },
          { exerciseId: "db_row", sets: 3, reps: "8-12", rest: "90 sec" },
          { exerciseId: "ohp", sets: 3, reps: "8-10", rest: "90 sec" },
          { exerciseId: "plank", sets: 3, reps: "45s", rest: "45 sec" },
        ],
      },
      {
        label: "Day B",
        focus: "Hinge-pattern emphasis",
        exercises: [
          { exerciseId: "rdl", sets: 3, reps: "6-8", rest: "2 min" },
          { exerciseId: "incline_db_press", sets: 3, reps: "8-12", rest: "90 sec" },
          { exerciseId: "lat_pulldown", sets: 3, reps: "10-12", rest: "90 sec" },
          { exerciseId: "walking_lunge", sets: 3, reps: "10/leg", rest: "90 sec" },
          { exerciseId: "face_pull", sets: 3, reps: "15", rest: "45 sec" },
        ],
      },
      {
        label: "Day C",
        focus: "Hypertrophy + accessories",
        exercises: [
          { exerciseId: "front_squat", sets: 3, reps: "6-10", rest: "2 min" },
          { exerciseId: "pushup", sets: 3, reps: "AMRAP", rest: "90 sec" },
          { exerciseId: "pullup", sets: 3, reps: "AMRAP", rest: "90 sec" },
          { exerciseId: "hip_thrust", sets: 3, reps: "10-12", rest: "90 sec" },
          { exerciseId: "bb_curl", sets: 2, reps: "10", rest: "60 sec" },
          { exerciseId: "tricep_pushdown", sets: 2, reps: "10-12", rest: "60 sec" },
        ],
      },
    ],
  },

  bbb_531: {
    id: "bbb_531",
    name: "5/3/1 Boring But Big",
    goal: "strength",
    level: "advanced",
    daysPerWeek: 4,
    durationWeeks: 16,
    description:
      "Jim Wendler's 5/3/1 with the BBB volume template. Strength-focused with a top set of 5/3/1 reps followed by 5x10 at lower load for hypertrophy. Run in 4-week cycles.",
    bestFor: ["Plateauing intermediate / advanced lifters", "Strength focus with some hypertrophy"],
    days: [
      {
        label: "Day 1 - Press",
        focus: "Overhead press main lift + BBB sets",
        exercises: [
          { exerciseId: "ohp", sets: 3, reps: "5/3/1", rest: "3 min", notes: "Top set is AMRAP" },
          { exerciseId: "ohp", sets: 5, reps: "10", rest: "90 sec", notes: "BBB: 50-60% of 1RM" },
          { exerciseId: "pullup", sets: 5, reps: "10", rest: "90 sec" },
          { exerciseId: "tricep_pushdown", sets: 3, reps: "12-15", rest: "60 sec" },
        ],
      },
      {
        label: "Day 2 - Deadlift",
        focus: "Deadlift main lift + BBB sets",
        exercises: [
          { exerciseId: "deadlift", sets: 3, reps: "5/3/1", rest: "3-4 min", notes: "Top set is AMRAP" },
          { exerciseId: "deadlift", sets: 5, reps: "10", rest: "2 min", notes: "BBB: 50% of 1RM" },
          { exerciseId: "hanging_leg_raise", sets: 5, reps: "10-12", rest: "60 sec" },
          { exerciseId: "calf_raise", sets: 5, reps: "12-15", rest: "45 sec" },
        ],
      },
      {
        label: "Day 3 - Bench",
        focus: "Bench main lift + BBB sets",
        exercises: [
          { exerciseId: "bench", sets: 3, reps: "5/3/1", rest: "3 min", notes: "Top set is AMRAP" },
          { exerciseId: "bench", sets: 5, reps: "10", rest: "90 sec", notes: "BBB: 50-60% of 1RM" },
          { exerciseId: "barbell_row", sets: 5, reps: "10", rest: "90 sec" },
          { exerciseId: "bb_curl", sets: 3, reps: "12-15", rest: "60 sec" },
        ],
      },
      {
        label: "Day 4 - Squat",
        focus: "Squat main lift + BBB sets",
        exercises: [
          { exerciseId: "back_squat", sets: 3, reps: "5/3/1", rest: "3 min", notes: "Top set is AMRAP" },
          { exerciseId: "back_squat", sets: 5, reps: "10", rest: "2 min", notes: "BBB: 50% of 1RM" },
          { exerciseId: "leg_curl", sets: 5, reps: "10-12", rest: "60 sec" },
          { exerciseId: "plank", sets: 3, reps: "60s", rest: "45 sec" },
        ],
      },
    ],
  },
};

export const programList = Object.values(programs);
export const programIds = Object.keys(programs);

export function programsForGoal(goal: "cut" | "recomp" | "bulk"): Program[] {
  if (goal === "cut") return [programs.full_body, programs.upper_lower];
  if (goal === "recomp") return [programs.upper_lower, programs.ppl];
  return [programs.ppl, programs.bbb_531];
}
