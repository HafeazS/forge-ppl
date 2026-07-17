import React, { useState, useEffect, useRef } from "react";

// ─── localStorage helpers (works in any browser, no account needed) ──────────
const lsGet = (key) => {
  try { const v = localStorage.getItem(key); return v ? { value: v } : null; }
  catch(e) { return null; }
};
const lsSet = (key, val) => {
  try { localStorage.setItem(key, val); } catch(e) {}
};



// ─── DESIGN TOKENS ───────────────────────────────────────────
const T = {
  bg:       "#0c0c0f",
  surface:  "#141418",
  card:     "#1c1c24",
  border:   "#2a2a38",
  accent:   "#f5a623",
  accentDim:"#f5a62322",
  text:     "#f0ede8",
  muted:    "#6b6b7e",
  danger:   "#e0321e",
  success:  "#2ec27e",
  info:     "#4a9eff",
};

// ─── 6-DAY PLAN ──────────────────────────────────────────────
const PLAN = [
  {
    id: "push1", day: "MON", label: "PUSH A",
    theme: { bg: "radial-gradient(ellipse at 20% 0%, #2a1200 0%, #0c0c0f 60%)", accent: "#f5a623", glyph: "P" },
    muscles: "Chest · Shoulders · Triceps",
    tagline: "Heavy compound foundation",
    groups: [
      { label: "CHEST", color: "#e0321e", exercises: [
        { name: "Flat Barbell Bench Press", sets: 4, reps: "6–8", cue: "Retract scapula · bar to lower chest · full drive" },
        { name: "Incline Dumbbell Press", sets: 3, reps: "8–10", cue: "30° incline · full stretch at bottom · squeeze top" },
        { name: "Cable Fly", sets: 3, reps: "12–15", cue: "Slight bend in elbow · deep stretch · squeeze peak" },
      ]},
      { label: "SHOULDERS", color: "#f5a623", exercises: [
        { name: "Seated Dumbbell Shoulder Press", sets: 3, reps: "10–12", cue: "Press vertical · ribs down · no lower-back arch" },
        { name: "Dumbbell Lateral Raise", sets: 4, reps: "15", cue: "Lead with elbow · slight forward lean · slow lower" },
      ]},
      { label: "TRICEPS", color: "#4a9eff", exercises: [
        { name: "Tricep Rope Pushdown", sets: 3, reps: "12–15", cue: "Elbows pinned · flare rope at full extension" },
        { name: "Overhead Tricep Extension", sets: 3, reps: "12", cue: "Full stretch overhead · long head is the mass driver" },
      ]},
      { label: "ABS", color: "#2ec27e", exercises: [
        { name: "Hanging Leg Raise", sets: 4, reps: "15–20", cue: "No swing · tuck pelvis at the top" },
        { name: "Plank", sets: 3, reps: "45–60s", cue: "Squeeze glutes · brace core · breathe steadily" },
      ]},
    ],
  },
  {
    id: "pull1", day: "TUE", label: "PULL A",
    theme: { bg: "radial-gradient(ellipse at 80% 0%, #001a2a 0%, #0c0c0f 60%)", accent: "#4a9eff", glyph: "P" },
    muscles: "Back · Biceps · Rear Delts",
    tagline: "Lat width + thickness",
    groups: [
      { label: "LATS", color: "#4a9eff", exercises: [
        { name: "Weighted Pull-Ups", sets: 4, reps: "6–8", cue: "Dead hang start · drive elbows to hips · full range" },
        { name: "Lat Pulldown", sets: 3, reps: "10–12", cue: "Pull to collarbone · elbows track down not back" },
        { name: "Seated Cable Row", sets: 3, reps: "10–12", cue: "Full stretch forward · elbows drive past torso" },
      ]},
      { label: "MID BACK", color: "#2ec27e", exercises: [
        { name: "Bent-Over Barbell Row", sets: 4, reps: "8–10", cue: "45° hinge · pull to belly · hard squeeze at top" },
        { name: "Face Pulls", sets: 3, reps: "15", cue: "Rope to forehead · elbows high · rear delt + shoulder health" },
      ]},
      { label: "BICEPS", color: "#f5a623", exercises: [
        { name: "EZ-Bar Curl", sets: 3, reps: "10–12", cue: "Full supination · zero body swing · slow eccentric" },
        { name: "Preacher Curl", sets: 3, reps: "12", cue: "Full stretch at bottom · squeeze peak contraction" },
      ]},
    ],
  },
  {
    id: "legs1", day: "WED", label: "LEGS A",
    theme: { bg: "radial-gradient(ellipse at 50% 0%, #0a1a08 0%, #0c0c0f 60%)", accent: "#2ec27e", glyph: "L" },
    muscles: "Quads · Hamstrings · Glutes · Calves",
    tagline: "Quad-dominant session",
    groups: [
      { label: "QUADS", color: "#2ec27e", exercises: [
        { name: "Barbell Back Squat", sets: 4, reps: "6–8", cue: "Below parallel · knees track toes · chest tall · stay braced" },
        { name: "Leg Press", sets: 3, reps: "10–12", cue: "Low foot = quad bias · don't lock knees at top" },
        { name: "Walking Lunges", sets: 3, reps: "12/leg", cue: "Long step · front shin vertical · back knee light tap" },
        { name: "Leg Extension", sets: 3, reps: "15", cue: "Full extension · 1-sec squeeze · slow eccentric" },
      ]},
      { label: "HAMSTRINGS + CALVES", color: "#f5a623", exercises: [
        { name: "Romanian Deadlift", sets: 3, reps: "10–12", cue: "Bar hugs legs · hinge to deep stretch · drive hips forward" },
        { name: "Lying Leg Curl", sets: 3, reps: "12", cue: "Point toes slightly · squeeze full contraction" },
        { name: "Standing Calf Raise", sets: 4, reps: "15", cue: "Full stretch at bottom · hard pause at top · no bouncing" },
      ]},
      { label: "ABS", color: "#4a9eff", exercises: [
        { name: "Crunches", sets: 4, reps: "20", cue: "Curl spine · exhale hard at top" },
        { name: "Russian Twist", sets: 4, reps: "20", cue: "Rotate from core · controlled · add weight when easy" },
      ]},
    ],
  },
  {
    id: "push2", day: "THU", label: "PUSH B",
    theme: { bg: "radial-gradient(ellipse at 20% 100%, #1a0a1a 0%, #0c0c0f 60%)", accent: "#c47ef5", glyph: "P" },
    muscles: "Upper Chest · Shoulders · Triceps",
    tagline: "Incline + isolation variation",
    groups: [
      { label: "CHEST", color: "#c47ef5", exercises: [
        { name: "Incline Barbell Press", sets: 4, reps: "8–10", cue: "Upper chest emphasis · control descent · full press" },
        { name: "Cable Cross (High to Low)", sets: 3, reps: "12–15", cue: "Full stretch at open · squeeze tight at close" },
        { name: "Dips (Chest-Lean)", sets: 3, reps: "10–12", cue: "Lean forward · go deep · lower chest focus" },
      ]},
      { label: "SHOULDERS", color: "#f5a623", exercises: [
        { name: "Barbell Overhead Press", sets: 3, reps: "8–10", cue: "Bar in front · press directly overhead · ribs down" },
        { name: "Cable Lateral Raise", sets: 4, reps: "15", cue: "Cable = constant tension through the full arc" },
      ]},
      { label: "TRICEPS", color: "#e0321e", exercises: [
        { name: "Skull Crusher", sets: 3, reps: "10–12", cue: "Bar to forehead · elbows fixed · don't let them flare" },
        { name: "Close-Grip Bench Press", sets: 3, reps: "10–12", cue: "Shoulder-width grip · elbows tucked throughout" },
      ]},
      { label: "ABS", color: "#2ec27e", exercises: [
        { name: "Leg Raise", sets: 4, reps: "20", cue: "No swing · tuck pelvis · feel lower abs" },
        { name: "Cable Woodchopper", sets: 3, reps: "12/side", cue: "Rotate from core not arms · stay controlled" },
      ]},
    ],
  },
  {
    id: "pull2", day: "FRI", label: "PULL B",
    theme: { bg: "radial-gradient(ellipse at 80% 100%, #001218 0%, #0c0c0f 60%)", accent: "#2ec27e", glyph: "P" },
    muscles: "Rear Delts · Traps · Back · Biceps",
    tagline: "Rear delt + trap emphasis",
    groups: [
      { label: "TRAPS + REAR DELTS", color: "#2ec27e", exercises: [
        { name: "Barbell Shrug", sets: 4, reps: "12–15", cue: "Straight arms · shrug straight up · 1-sec hold at top" },
        { name: "Reverse Pec Deck", sets: 3, reps: "15", cue: "Keep slight bend in elbows · lead with elbows not hands" },
        { name: "Face Pulls", sets: 3, reps: "15", cue: "Rope to forehead · elbows flare high · squeeze rear delts" },
      ]},
      { label: "BACK", color: "#4a9eff", exercises: [
        { name: "One-Arm Dumbbell Row", sets: 4, reps: "10/side", cue: "Brace on bench · full range · elbow drives to hip" },
        { name: "Close-Grip Pulldown", sets: 3, reps: "12", cue: "Neutral grip · squeeze lats at the bottom" },
        { name: "Seated Row (Wide Grip)", sets: 3, reps: "12", cue: "Wide grip hits rhomboids · full stretch each rep" },
      ]},
      { label: "BICEPS", color: "#f5a623", exercises: [
        { name: "Incline Dumbbell Curl", sets: 3, reps: "10–12", cue: "Arm hangs fully · maximum stretch at bottom" },
        { name: "Hammer Curl", sets: 3, reps: "12", cue: "Neutral grip · brachialis focus · slow eccentric" },
      ]},
    ],
  },
  {
    id: "legs2", day: "SAT", label: "LEGS B",
    theme: { bg: "radial-gradient(ellipse at 50% 100%, #120800 0%, #0c0c0f 60%)", accent: "#f5a623", glyph: "L" },
    muscles: "Hamstrings · Glutes · Quads",
    tagline: "Posterior chain session",
    groups: [
      { label: "HAMSTRINGS + GLUTES", color: "#f5a623", exercises: [
        { name: "Conventional Deadlift", sets: 4, reps: "5", cue: "Bar over mid-foot · chest tall · push floor away · king of lifts" },
        { name: "Romanian Deadlift", sets: 3, reps: "10–12", cue: "Bar hugs shins · hinge to deep stretch · drive hips" },
        { name: "Hip Thrust", sets: 4, reps: "10–12", cue: "Bar on hip crease · drive hips up · squeeze glutes hard at top" },
        { name: "Seated Leg Curl", sets: 3, reps: "12", cue: "Full stretch · squeeze at contraction · slow lower" },
      ]},
      { label: "QUADS + CALVES", color: "#e0321e", exercises: [
        { name: "Bulgarian Split Squat", sets: 3, reps: "10/leg", cue: "Back foot elevated · front knee tracks toe · upright torso" },
        { name: "Hack Squat", sets: 3, reps: "10–12", cue: "Feet low · go deep · quad dominant movement" },
        { name: "Seated Calf Raise", sets: 4, reps: "15–20", cue: "Soleus focus · full stretch · slow reps · no bouncing" },
      ]},
      { label: "ABS", color: "#2ec27e", exercises: [
        { name: "Ab Wheel Rollout", sets: 3, reps: "10–12", cue: "Keep lower back flat · full extension · pull back with abs" },
        { name: "Side Plank", sets: 3, reps: "30s/side", cue: "Hips stacked · straight line head to feet" },
      ]},
    ],
  },
];

function weeksElapsed(s) {
  if (!s) return 0;
  return Math.floor((Date.now() - new Date(s)) / 604800000);
}
function isDeload(w) { return w > 0 && w % 5 === 0; }

// ─── FEEL CONFIG ─────────────────────────────────────────────
const FEELS = [
  { id: "easy",  emoji: "😊", label: "Easy",  color: "#2ec27e" },
  { id: "solid", emoji: "💪", label: "Solid", color: "#4a9eff" },
  { id: "hard",  emoji: "🔥", label: "Hard",  color: "#f5a623" },
  { id: "max",   emoji: "😤", label: "Max",   color: "#e0321e" },
];

// ─── SPARKLINE ────────────────────────────────────────────────
function Sparkline({ points, color }) {
  if (!points || points.length < 2) return null;
  const W = 56, H = 22;
  const mn = Math.min(...points), mx = Math.max(...points);
  const range = mx - mn || 1;
  const coords = points.map((v, i) => {
    const x = (i / (points.length - 1)) * W;
    const y = H - 2 - ((v - mn) / range) * (H - 4);
    return `${x},${y}`;
  }).join(" ");
  const last = points[points.length - 1];
  const first = points[0];
  const delta = last - first;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <svg width={W} height={H}>
        <polyline points={coords} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" opacity="0.8"/>
        {points.map((v, i) => {
          const x = (i / (points.length - 1)) * W;
          const y = H - 2 - ((v - mn) / range) * (H - 4);
          return i === points.length - 1
            ? <circle key={i} cx={x} cy={y} r="2.5" fill={color}/>
            : null;
        })}
      </svg>
      <div style={{ fontSize: 10, color: delta >= 0 ? "#2ec27e" : "#e0321e", fontWeight: 800 }}>
        {delta >= 0 ? "+" : ""}{delta.toFixed(1)}kg
      </div>
    </div>
  );
}

// ─── INLINE LOG ROW ───────────────────────────────────────────
function ExerciseRow({ ex, groupColor, weekNum, logKey, entry, onChange, history, deload }) {
  const wRef = useRef();
  const rRef = useRef();

  const sets = deload ? Math.max(1, (ex.sets || 3) - 1) : ex.sets;

  const histWeights = history
    .filter(h => h.key.includes(`__${ex.name}__`) && h.value?.weight)
    .sort((a, b) => (a.week || 0) - (b.week || 0))
    .map(h => h.value.weight);

  const [showCue, setShowCue] = useState(false);
  const done = entry?.weight && entry?.reps;

  return (
    <div style={{
      background: done ? groupColor + "0e" : T.card,
      border: `1px solid ${done ? groupColor + "55" : T.border}`,
      borderRadius: 14,
      marginBottom: 8,
      overflow: "hidden",
      transition: "all 0.2s",
    }}>
      {/* Main row */}
      <div style={{ display: "flex", alignItems: "center", gap: 0, padding: "0 0 0 14px" }}>
        {/* Done tick */}
        <div style={{
          width: 20, height: 20, borderRadius: 6,
          border: `2px solid ${done ? groupColor : T.border}`,
          background: done ? groupColor : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, marginRight: 12,
          transition: "all 0.2s",
        }}>
          {done && <span style={{ fontSize: 10, color: "#000", fontWeight: 900 }}>✓</span>}
        </div>

        {/* Name + sets info */}
        <div style={{ flex: 1, minWidth: 0, padding: "12px 0" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.text, lineHeight: 1.2 }}>{ex.name}</div>
          <div style={{ fontSize: 10, color: T.muted, marginTop: 3 }}>
            {sets} sets · {ex.reps} reps
            {deload && <span style={{ color: "#f5a623", marginLeft: 6, fontWeight: 800 }}>· DELOAD</span>}
          </div>
          {histWeights.length >= 2 && (
            <div style={{ marginTop: 6 }}>
              <Sparkline points={histWeights.slice(-8)} color={groupColor} />
            </div>
          )}
        </div>

        {/* Weight input */}
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          background: T.surface, borderLeft: `1px solid ${T.border}`, padding: "10px 10px",
          minWidth: 60,
        }}>
          <div style={{ fontSize: 8, color: T.muted, letterSpacing: 1, marginBottom: 4 }}>KG</div>
          <input
            ref={wRef}
            type="number"
            inputMode="decimal"
            value={entry?.weight || ""}
            onChange={e => onChange({ ...entry, weight: e.target.value === "" ? null : parseFloat(e.target.value) })}
            placeholder="—"
            style={{
              width: 44, textAlign: "center",
              background: "transparent", border: "none",
              color: entry?.weight ? T.text : T.muted,
              fontSize: entry?.weight ? 18 : 14,
              fontWeight: 900, padding: 0, cursor: "pointer",
            }}
          />
        </div>

        {/* Reps input */}
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          background: T.surface, borderLeft: `1px solid ${T.border}`, padding: "10px 10px",
          minWidth: 52,
        }}>
          <div style={{ fontSize: 8, color: T.muted, letterSpacing: 1, marginBottom: 4 }}>REPS</div>
          <input
            ref={rRef}
            type="number"
            inputMode="numeric"
            value={entry?.reps || ""}
            onChange={e => onChange({ ...entry, reps: e.target.value === "" ? null : parseInt(e.target.value) })}
            placeholder="—"
            style={{
              width: 38, textAlign: "center",
              background: "transparent", border: "none",
              color: entry?.reps ? T.text : T.muted,
              fontSize: entry?.reps ? 18 : 14,
              fontWeight: 900, padding: 0, cursor: "pointer",
            }}
          />
        </div>

        {/* Feel button */}
        <button
          onClick={() => {
            const idx = FEELS.findIndex(f => f.id === entry?.feel);
            const next = FEELS[(idx + 1) % FEELS.length];
            onChange({ ...entry, feel: next.id });
          }}
          style={{
            background: T.surface, border: "none", borderLeft: `1px solid ${T.border}`,
            padding: "12px 10px", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
            minWidth: 44,
          }}
        >
          <span style={{ fontSize: 16 }}>
            {entry?.feel ? FEELS.find(f => f.id === entry.feel)?.emoji : "·"}
          </span>
        </button>
      </div>

      {/* Cue strip */}
      <div
        onClick={() => setShowCue(!showCue)}
        style={{
          padding: "6px 14px", cursor: "pointer",
          borderTop: `1px solid ${T.border}`,
          display: "flex", alignItems: "center", gap: 8,
        }}
      >
        <span style={{ fontSize: 9, color: T.muted, letterSpacing: 1 }}>FORM CUE</span>
        <span style={{ fontSize: 11, color: showCue ? T.text : T.muted, flex: 1, lineHeight: 1.5 }}>
          {showCue ? ex.cue : ex.cue.split("·")[0].trim() + " ···"}
        </span>
        <span style={{ fontSize: 8, color: T.muted }}>{showCue ? "▲" : "▼"}</span>
      </div>
    </div>
  );
}

// ─── DAY HERO ─────────────────────────────────────────────────
function DayHero({ plan, weekNum, logCount, totalEx }) {
  const deload = isDeload(weekNum);
  const pct = Math.round((logCount / totalEx) * 100);
  return (
    <div style={{
      background: plan.theme.bg,
      padding: "28px 20px 20px",
      position: "relative", overflow: "hidden",
    }}>
      {/* Big glyph watermark */}
      <div style={{
        position: "absolute", right: -10, top: -30,
        fontSize: 160, fontWeight: 900, color: "rgba(255,255,255,0.03)",
        fontFamily: "'Arial Black', sans-serif", lineHeight: 1, userSelect: "none",
      }}>{plan.theme.glyph}</div>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <div style={{
              background: plan.theme.accent, borderRadius: 6,
              padding: "3px 10px", fontSize: 11, fontWeight: 900,
              color: "#000", letterSpacing: 1,
            }}>{plan.day}</div>
            {deload && (
              <div style={{
                background: "#f5a62333", border: "1px solid #f5a623",
                borderRadius: 6, padding: "3px 10px",
                fontSize: 10, fontWeight: 800, color: "#f5a623", letterSpacing: 1,
              }}>⚡ DELOAD</div>
            )}
          </div>
          <div style={{
            fontSize: 30, fontWeight: 900, color: T.text, letterSpacing: -0.5,
            fontFamily: "'Arial Black', sans-serif",
          }}>{plan.label}</div>
          <div style={{ fontSize: 12, color: plan.theme.accent, fontWeight: 700, marginTop: 4 }}>{plan.muscles}</div>
          <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{plan.tagline}</div>
        </div>

        {/* Progress ring */}
        <div style={{ position: "relative", width: 52, height: 52, flexShrink: 0 }}>
          <svg width={52} height={52} style={{ transform: "rotate(-90deg)" }}>
            <circle cx={26} cy={26} r={22} fill="none" stroke={T.border} strokeWidth={4}/>
            <circle cx={26} cy={26} r={22} fill="none" stroke={plan.theme.accent}
              strokeWidth={4} strokeDasharray={`${2 * Math.PI * 22}`}
              strokeDashoffset={`${2 * Math.PI * 22 * (1 - pct / 100)}`}
              strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.5s" }}/>
          </svg>
          <div style={{
            position: "absolute", inset: 0, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
          }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: T.text, lineHeight: 1 }}>{pct}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── WORKOUT TAB ─────────────────────────────────────────────
function WorkoutView({ plan, weekNum, logs, setLogs, allLogs }) {
  const deload = isDeload(weekNum);

  function logKey(exName) {
    return `${plan.id}__${exName}__w${weekNum}`;
  }
  function getEntry(exName) { return logs[logKey(exName)] || null; }
  function setEntry(exName, val) {
    const k = logKey(exName);
    const updated = { ...logs, [k]: { ...val, week: weekNum, ts: Date.now() } };
    setLogs(updated);
    try { lsSet("forge_logs", JSON.stringify(updated)); } catch(e) {}
  }

  const allEx = plan.groups.flatMap(g => g.exercises);
  const loggedCount = allEx.filter(e => getEntry(e.name)?.weight && getEntry(e.name)?.reps).length;

  return (
    <div>
      <DayHero plan={plan} weekNum={weekNum} logCount={loggedCount} totalEx={allEx.length} />
      {deload && (
        <div style={{
          margin: "12px 14px 0",
          padding: "12px 14px",
          background: "#f5a62311", border: "1px solid #f5a62355",
          borderRadius: 12, display: "flex", gap: 10, alignItems: "flex-start",
        }}>
          <span style={{ fontSize: 22, flexShrink: 0 }}>⚡</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#f5a623" }}>Deload Week {weekNum}</div>
            <div style={{ fontSize: 11, color: "#f5a62399", marginTop: 2, lineHeight: 1.5 }}>
              Same exercises, same weight — but <strong style={{ color: "#f5a623" }}>1 fewer set per exercise</strong>. Let your nervous system recharge.
            </div>
          </div>
        </div>
      )}
      <div style={{ padding: "12px 14px 20px" }}>
        {plan.groups.map((group, gi) => (
          <div key={gi} style={{ marginBottom: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div style={{ width: 3, height: 16, borderRadius: 2, background: group.color }}/>
              <div style={{ fontSize: 10, fontWeight: 900, color: group.color, letterSpacing: 2 }}>{group.label}</div>
            </div>
            {group.exercises.map((ex, ei) => {
              const history = Object.entries(allLogs)
                .filter(([k]) => k.includes(`__${ex.name}__`))
                .map(([k, v]) => ({ key: k, value: v, week: parseInt(k.split("__w")[1]) }));
              return (
                <ExerciseRow
                  key={ei} ex={ex} groupColor={group.color}
                  weekNum={weekNum} logKey={logKey(ex.name)}
                  entry={getEntry(ex.name)}
                  onChange={val => setEntry(ex.name, val)}
                  history={history}
                  deload={deload}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PROGRESS TAB ─────────────────────────────────────────────
function ProgressView({ logs, weekNum, bodyWeights, onAddBW }) {
  const [bw, setBw] = useState("");
  const [expandEx, setExpandEx] = useState(null);

  // Aggregate exercise history
  const exHistory = {};
  Object.entries(logs).forEach(([k, v]) => {
    const parts = k.split("__");
    if (parts.length < 3) return;
    const name = parts[1];
    const week = parseInt(k.split("__w")[1]);
    if (!exHistory[name]) exHistory[name] = [];
    if (v?.weight) exHistory[name].push({ week, weight: v.weight, reps: v.reps, feel: v.feel });
  });
  Object.values(exHistory).forEach(a => a.sort((x, y) => x.week - y.week));

  const sortedBW = [...bodyWeights].sort((a, b) => a.week - b.week);

  return (
    <div style={{ padding: "16px 14px 30px" }}>
      {/* 26-week calendar */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: T.muted, letterSpacing: 2, marginBottom: 10 }}>26-WEEK PLAN</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {Array.from({ length: 26 }, (_, i) => i + 1).map(w => {
            const dl = isDeload(w);
            const past = w < weekNum;
            const cur = w === weekNum;
            return (
              <div key={w} style={{
                width: 30, height: 30, borderRadius: 8,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 800,
                background: cur ? T.accent : dl ? T.accentDim : past ? "#1a2a1a" : T.surface,
                border: `1px solid ${cur ? T.accent : dl ? "#f5a62366" : past ? "#2ec27e33" : T.border}`,
                color: cur ? "#000" : dl ? T.accent : past ? "#2ec27e" : T.muted,
              }}>
                {dl ? "⚡" : w}
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 14, marginTop: 10, fontSize: 9, color: T.muted }}>
          <span><span style={{ color: T.accent }}>■</span> Now</span>
          <span>⚡ Deload</span>
          <span><span style={{ color: "#2ec27e" }}>■</span> Done</span>
        </div>
      </div>

      {/* Body weight */}
      <div style={{ background: T.card, borderRadius: 16, padding: "16px", marginBottom: 20, border: `1px solid ${T.border}` }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: T.muted, letterSpacing: 2, marginBottom: 12 }}>BODY WEIGHT (kg)</div>
        {sortedBW.length >= 2 && (
          <div style={{ marginBottom: 12 }}>
            {(() => {
              const pts = sortedBW.map(b => b.weight);
              const W = 260, H = 60;
              const mn = Math.min(...pts), mx = Math.max(...pts);
              const range = mx - mn || 1;
              const coords = pts.map((v, i) => `${(i / (pts.length - 1)) * W},${H - 4 - ((v - mn) / range) * (H - 8)}`).join(" ");
              return (
                <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
                  <polyline points={coords} fill="none" stroke="#4a9eff" strokeWidth="2" strokeLinejoin="round"/>
                  {pts.map((v, i) => (
                    <circle key={i} cx={(i / (pts.length - 1)) * W} cy={H - 4 - ((v - mn) / range) * (H - 8)} r="3" fill="#4a9eff"/>
                  ))}
                </svg>
              );
            })()}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: T.muted, marginTop: 4 }}>
              <span>Wk {sortedBW[0].week}: {sortedBW[0].weight}kg</span>
              <span style={{ color: T.text, fontWeight: 800 }}>Now: {sortedBW[sortedBW.length - 1].weight}kg</span>
            </div>
          </div>
        )}
        <div style={{ display: "flex", gap: 8 }}>
          <input type="number" inputMode="decimal" value={bw} onChange={e => setBw(e.target.value)}
            placeholder={`Week ${weekNum} weight`}
            style={{
              flex: 1, background: T.surface, border: `1px solid ${T.border}`,
              borderRadius: 10, padding: "11px 14px", color: T.text, fontSize: 15, fontWeight: 700,
            }}/>
          <button onClick={() => { if(bw) { onAddBW({ week: weekNum, weight: parseFloat(bw) }); setBw(""); }}}
            style={{
              background: "#4a9eff", border: "none", borderRadius: 10,
              padding: "11px 18px", color: "#000", fontWeight: 900, cursor: "pointer", fontSize: 13,
            }}>LOG</button>
        </div>
      </div>

      {/* Exercise progress */}
      <div style={{ fontSize: 10, fontWeight: 800, color: T.muted, letterSpacing: 2, marginBottom: 12 }}>EXERCISE PROGRESS</div>
      {Object.entries(exHistory).length === 0 && (
        <div style={{ textAlign: "center", color: T.muted, padding: "32px 0", fontSize: 13, lineHeight: 1.8 }}>
          Nothing logged yet.<br/>
          Head to <strong style={{ color: T.text }}>Workout</strong> and tap the weight fields to start.
        </div>
      )}
      {Object.entries(exHistory).filter(([, d]) => d.length >= 1).map(([name, data]) => {
        const pts = data.map(d => d.weight);
        const latest = data[data.length - 1];
        const best = Math.max(...pts);
        const expanded = expandEx === name;
        return (
          <div key={name} onClick={() => setExpandEx(expanded ? null : name)} style={{
            background: T.card, borderRadius: 14, padding: "14px", marginBottom: 8,
            border: `1px solid ${T.border}`, cursor: "pointer",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.text, marginBottom: 4 }}>{name}</div>
                <div style={{ fontSize: 10, color: T.muted }}>{data.length} session{data.length > 1 ? "s" : ""} logged · Best: {best}kg</div>
              </div>
              <Sparkline points={pts.slice(-8)} color={T.accent} />
            </div>
            {expanded && (
              <div style={{ marginTop: 12, borderTop: `1px solid ${T.border}`, paddingTop: 10 }}>
                {data.slice().reverse().slice(0, 10).map((d, i) => {
                  const feel = FEELS.find(f => f.id === d.feel);
                  return (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderBottom: `1px solid ${T.border}` }}>
                      <span style={{ fontSize: 10, color: T.muted }}>Week {d.week}</span>
                      <span style={{ fontSize: 14, fontWeight: 900, color: T.accent }}>{d.weight}kg</span>
                      <span style={{ fontSize: 11, color: T.text }}>{d.reps} reps</span>
                      <span style={{ fontSize: 12 }}>{feel?.emoji || "·"}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── SCHEDULE TAB ─────────────────────────────────────────────
function ScheduleView({ weekNum }) {
  const deload = isDeload(weekNum);
  const rules = [
    { icon: "😴", title: "Sleep 7–8 hrs", body: "Growth hormone peaks during deep sleep. Less than 6hrs spikes cortisol and breaks muscle down." },
    { icon: "🥩", title: "Protein 1.6–2.2g/kg", body: "Spread across 4–5 meals. Your body uses ~40–50g per sitting for muscle protein synthesis." },
    { icon: "⚡", title: "Deload every 5th week", body: "Same lifts, 1 fewer set per exercise. Your CNS accumulates fatigue before you notice it." },
    { icon: "⏱️", title: "48–72hrs muscle recovery", body: "Your split already respects this. Don't add extra sessions targeting the same muscle." },
  ];
  return (
    <div style={{ padding: "16px 14px 30px" }}>
      <div style={{ fontSize: 10, fontWeight: 800, color: T.muted, letterSpacing: 2, marginBottom: 12 }}>WEEKLY SPLIT</div>
      {PLAN.map((d, i) => (
        <div key={i} style={{
          display: "flex", gap: 14, alignItems: "center",
          background: T.card, borderRadius: 12, padding: "13px 14px", marginBottom: 8,
          border: `1px solid ${T.border}`,
        }}>
          <div style={{
            width: 42, height: 42, borderRadius: 10, flexShrink: 0,
            background: d.theme.accent + "22", border: `1px solid ${d.theme.accent}55`,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{ fontSize: 9, color: d.theme.accent, fontWeight: 900, letterSpacing: 1 }}>{d.day}</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: d.theme.accent }}>{d.label}</div>
            <div style={{ fontSize: 10, color: T.muted, marginTop: 2 }}>{d.muscles}</div>
          </div>
        </div>
      ))}
      <div style={{
        background: T.card, borderRadius: 12, padding: "12px 14px", marginBottom: 24,
        border: `1px solid ${T.border}`, color: T.muted, fontSize: 12,
      }}>
        Sunday = rest. Active recovery (walk, stretch, swim) keeps blood flowing without taxing the CNS.
      </div>

      <div style={{ fontSize: 10, fontWeight: 800, color: T.muted, letterSpacing: 2, marginBottom: 12 }}>RECOVERY RULES</div>
      {rules.map((r, i) => (
        <div key={i} style={{
          background: T.card, borderRadius: 14, padding: "14px 16px", marginBottom: 8,
          border: `1px solid ${T.border}`,
          borderLeft: `3px solid ${T.accent}`,
        }}>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>{r.icon}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: T.text, marginBottom: 4 }}>{r.title}</div>
              <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.6 }}>{r.body}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── ONBOARDING ───────────────────────────────────────────────
function Onboarding({ onDone }) {
  const [name, setName] = useState("");
  const [ready, setReady] = useState(false);
  useEffect(() => { setTimeout(() => setReady(true), 100); }, []);
  return (
    <div style={{
      minHeight: "100vh", background: T.bg,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "32px 24px",
      opacity: ready ? 1 : 0, transition: "opacity 0.5s",
    }}>
      <div style={{ fontSize: 52, marginBottom: 8 }}>🔥</div>
      <div style={{
        fontSize: 40, fontWeight: 900, color: T.text, letterSpacing: -1,
        fontFamily: "'Arial Black', sans-serif", marginBottom: 4,
      }}>FORGE</div>
      <div style={{ fontSize: 13, color: T.accent, fontWeight: 700, letterSpacing: 3, marginBottom: 40 }}>6-DAY PPL TRACKER</div>

      <div style={{ width: "100%", maxWidth: 340 }}>
        <div style={{ fontSize: 11, color: T.muted, letterSpacing: 2, marginBottom: 8 }}>YOUR NAME</div>
        <input
          type="text" value={name} onChange={e => setName(e.target.value)}
          placeholder="Enter your name"
          style={{
            width: "100%", background: T.card, border: `1px solid ${T.border}`,
            borderRadius: 14, padding: "16px 18px", color: T.text, fontSize: 18, fontWeight: 700,
            marginBottom: 16, boxSizing: "border-box",
          }}
        />
        <button
          onClick={() => { if (name.trim()) onDone(name.trim()); }}
          disabled={!name.trim()}
          style={{
            width: "100%", padding: "16px", borderRadius: 14, border: "none", cursor: name.trim() ? "pointer" : "not-allowed",
            background: name.trim() ? `linear-gradient(135deg, ${T.accent}, #e08800)` : T.surface,
            color: name.trim() ? "#000" : T.muted,
            fontSize: 15, fontWeight: 900, letterSpacing: 1,
            fontFamily: "'Arial Black', sans-serif",
            transition: "all 0.2s",
          }}
        >START YOUR 26-WEEK PLAN →</button>
        <div style={{ textAlign: "center", fontSize: 11, color: T.muted, marginTop: 16, lineHeight: 1.6 }}>
          6-day PPL split · Tracks progressive overload<br/>
          Auto deload every 5th week · Charts your progress
        </div>
      </div>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("loading"); // loading | onboarding | app
  const [userName, setUserName] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [dayIdx, setDayIdx] = useState(0);
  const [tab, setTab] = useState("workout");
  const [logs, setLogs] = useState({});
  const [bodyWeights, setBodyWeights] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const n = await lsGet("forge_name");
        const s = await lsGet("forge_start");
        const l = await lsGet("forge_logs");
        const b = await lsGet("forge_bw");
        if (n?.value && s?.value) {
          setUserName(n.value);
          setStartDate(s.value);
          if (l?.value) setLogs(JSON.parse(l.value));
          if (b?.value) setBodyWeights(JSON.parse(b.value));
          setScreen("app");
        } else {
          setScreen("onboarding");
        }
      } catch(e) { setScreen("onboarding"); }
    })();
  }, []);

  const handleOnboard = async (name) => {
    const today = new Date().toISOString().split("T")[0];
    setUserName(name);
    setStartDate(today);
    try {
      lsSet("forge_name", name);
      lsSet("forge_start", today);
    } catch(e) {}
    setScreen("app");
  };

  const addBW = async (entry) => {
    const updated = [...bodyWeights.filter(b => b.week !== entry.week), entry];
    setBodyWeights(updated);
    try { lsSet("forge_bw", JSON.stringify(updated)); } catch(e) {}
  };

  if (screen === "loading") return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontSize: 32 }}>🔥</div>
    </div>
  );

  if (screen === "onboarding") return <Onboarding onDone={handleOnboard} />;

  const weekNum = Math.max(1, weeksElapsed(startDate) + 1);
  const plan = PLAN[dayIdx];
  const deload = isDeload(weekNum);

  const TABS = [
    { id: "workout", label: "WORKOUT", icon: "🏋️" },
    { id: "progress", label: "PROGRESS", icon: "📈" },
    { id: "schedule", label: "PLAN", icon: "📅" },
  ];

  return (
    <div style={{ background: T.bg, minHeight: "100vh", maxWidth: 480, margin: "0 auto", fontFamily: "'Helvetica Neue', Arial, sans-serif", color: T.text }}>
      <style>{`
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        input { outline: none; }
        input:focus { border-color: ${T.accent} !important; }
        ::-webkit-scrollbar { display: none; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* DELOAD TICKER */}
      {deload && (
        <div style={{
          background: "#f5a623", textAlign: "center",
          padding: "7px 16px", fontSize: 11, fontWeight: 900, color: "#000", letterSpacing: 1.5,
          position: "sticky", top: 0, zIndex: 300,
        }}>
          ⚡ WEEK {weekNum} · DELOAD — 1 FEWER SET PER EXERCISE
        </div>
      )}

      {/* TOP BAR */}
      <div style={{
        position: "sticky", top: deload ? 28 : 0, zIndex: 200,
        background: "rgba(12,12,15,0.96)", backdropFilter: "blur(8px)",
        borderBottom: `1px solid ${T.border}`,
      }}>
        {/* User + week */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px 6px" }}>
          <div>
            <div style={{ fontSize: 10, color: T.muted, letterSpacing: 1 }}>FORGE · {userName.toUpperCase()}</div>
          </div>
          <div style={{
            background: deload ? "#f5a62322" : T.surface,
            border: `1px solid ${deload ? "#f5a623" : T.border}`,
            borderRadius: 8, padding: "4px 12px",
            fontSize: 11, fontWeight: 800,
            color: deload ? "#f5a623" : T.muted,
          }}>WK {weekNum} / 26</div>
        </div>

        {/* Day pills */}
        {(tab === "workout" || tab === "log") && (
          <div style={{ display: "flex", gap: 6, overflowX: "auto", padding: "2px 14px 10px" }}>
            {PLAN.map((d, i) => (
              <button key={i} onClick={() => setDayIdx(i)} style={{
                flexShrink: 0, padding: "7px 12px", borderRadius: 20, border: "none", cursor: "pointer",
                background: dayIdx === i ? d.theme.accent : T.surface,
                color: dayIdx === i ? "#000" : T.muted,
                fontWeight: 900, fontSize: 10, letterSpacing: 0.5,
                fontFamily: "'Arial Black', sans-serif",
                transition: "all 0.15s",
                boxShadow: dayIdx === i ? `0 0 12px ${d.theme.accent}55` : "none",
              }}>
                {d.day} · {d.label.split(" ")[0]}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div style={{ paddingBottom: 76, animation: "fadeIn 0.2s ease" }}>
        {tab === "workout" && (
          <WorkoutView
            plan={plan} weekNum={weekNum}
            logs={logs} setLogs={setLogs} allLogs={logs}
          />
        )}
        {tab === "progress" && (
          <ProgressView logs={logs} weekNum={weekNum} bodyWeights={bodyWeights} onAddBW={addBW} />
        )}
        {tab === "schedule" && <ScheduleView weekNum={weekNum} />}
      </div>

      {/* BOTTOM TAB BAR */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 480, zIndex: 200,
        background: "rgba(12,12,15,0.97)", backdropFilter: "blur(8px)",
        borderTop: `1px solid ${T.border}`,
        display: "flex", paddingBottom: "env(safe-area-inset-bottom, 4px)",
      }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, padding: "11px 0 8px", border: "none", cursor: "pointer",
            background: "transparent", display: "flex", flexDirection: "column",
            alignItems: "center", gap: 3,
          }}>
            <span style={{ fontSize: 20 }}>{t.icon}</span>
            <span style={{
              fontSize: 8, fontWeight: 900, letterSpacing: 1.5,
              color: tab === t.id ? T.accent : T.muted,
              fontFamily: "'Arial Black', sans-serif",
            }}>{t.label}</span>
            {tab === t.id && (
              <div style={{ width: 20, height: 2, background: T.accent, borderRadius: 1 }}/>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
