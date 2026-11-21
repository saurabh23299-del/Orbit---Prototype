// Analytics selectors, ported from the logic in design/reference/screens/Analytics.dc.html.
// Each historical section passes its own Period; nothing here is global.

import { addDays, fmtDate, fmtDateYear } from './format';
import {
  BOTTLENECKS, DELAY_DAYS, DONE, HISTORY_END, LATE, LOADS, LOAD_ORDER, MILESTONES_LATE, MILESTONES_ON_TIME, OVERDUE,
  PREV_DONE, PREV_LATE, PREV_OVERDUE, PREV_UTIL, WEEK_LABELS, WEEK_NOTES, WEEK_STARTS, employeeById,
} from './mockData';
import { BAND_LABEL, bandOf, type Band } from './selectors';
import type { Bottleneck, ChatScript, Evidence } from './types';

export type Period = { kind: 'weeks'; n: 4 | 8 | 12 } | { kind: 'custom'; start: string; end: string };

export const DATA_START = WEEK_STARTS[0];
export const DATA_END = HISTORY_END;
const TEAM = LOAD_ORDER.length;

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

/** Team average utilisation per week. */
export const TEAM_UTIL: number[] = LOADS.map((row) => Math.round(sum(row) / row.length));

// ---------- Periods ----------

export interface Range {
  /** Week indices in the period. */
  idx: number[];
  n: number;
  start: string;
  end: string;
  /** "Last 8 weeks" or "Oct 5 – Nov 22" */
  label: string;
  /** "over the last 8 weeks" or "between Oct 5 and Nov 22" */
  phrase: string;
  /** "Sep 28 – Nov 22, 2026" */
  span: string;
}

export const rangeOf = (p: Period): Range => {
  const idx: number[] = [];
  if (p.kind === 'custom') {
    // A week counts if any of its days fall inside the range.
    WEEK_STARTS.forEach((w, i) => {
      if (w >= addDays(p.start, -6) && w <= p.end) idx.push(i);
    });
  } else {
    for (let i = WEEK_STARTS.length - p.n; i < WEEK_STARTS.length; i++) idx.push(i);
  }
  const start = p.kind === 'custom' ? p.start : WEEK_STARTS[idx[0]];
  const end = p.kind === 'custom' ? p.end : DATA_END;
  return {
    idx,
    n: idx.length,
    start,
    end,
    label: p.kind === 'custom' ? `${fmtDate(start)} – ${fmtDate(end)}` : `Last ${p.n} weeks`,
    phrase: p.kind === 'custom' ? `between ${fmtDate(start)} and ${fmtDate(end)}` : `over the last ${p.n} weeks`,
    span: `${fmtDate(start)} – ${fmtDateYear(end)}`,
  };
};

/** Custom range validation: both dates, end after start, inside the data, at least 2 weeks. */
export const validateRange = (start: string, end: string): string => {
  if (!start || !end) return 'Choose both dates.';
  if (end <= start) return 'The end date must be after the start date.';
  if (start < DATA_START || end > DATA_END) return `Data is available from ${fmtDate(DATA_START)} to ${fmtDate(DATA_END)}.`;
  if (rangeOf({ kind: 'custom', start, end }).n < 2) return 'Choose a range of at least 2 weeks.';
  return '';
};

// ---------- Overview (with previous-period comparison) ----------

export interface Delta {
  text: string;
  tone: 'good' | 'bad' | 'neutral';
}

/** Change vs the previous period. `good` says which direction is better. */
const delta = (cur: number, prev: number, good: 'up' | 'down', unit: string, suffix: string): Delta => {
  const d = Math.round((cur - prev) * 10) / 10;
  if (d === 0) return { text: `No change ${suffix}`, tone: 'neutral' };
  const better = good === 'up' ? d > 0 : d < 0;
  return { text: `${d > 0 ? '+' : '−'}${Math.abs(d)}${unit} ${suffix}`, tone: better ? 'good' : 'bad' };
};

export const overview = (r: Range) => {
  // The previous period is the same number of weeks immediately before this one,
  // reaching back into the earlier quarter's data where needed.
  const ALL_U = [...PREV_UTIL, ...TEAM_UTIL];
  const ALL_D = [...PREV_DONE, ...DONE];
  const ALL_L = [...PREV_LATE, ...LATE];
  const ALL_O = [...PREV_OVERDUE, ...OVERDUE];
  const off = PREV_UTIL.length;
  const cur = (A: number[]) => r.idx.map((i) => A[off + i]);
  const prev = (A: number[]) => r.idx.map((i) => A[off + i - r.n]);

  const done = sum(cur(ALL_D));
  const late = sum(cur(ALL_L));
  const pdone = sum(prev(ALL_D));
  const plate = sum(prev(ALL_L));
  const util = Math.round(sum(cur(ALL_U)) / r.n);
  const putil = Math.round(sum(prev(ALL_U)) / r.n);
  const onTimePct = Math.round(((done - late) / done) * 100);
  const pOnTimePct = Math.round(((pdone - plate) / pdone) * 100);
  const over = sum(cur(ALL_O));
  const pover = sum(prev(ALL_O));
  const vs = `vs previous ${r.n} weeks`;
  return {
    subtitle: `Compared with the previous ${r.n} weeks · ${r.span}`,
    util, done, onTimePct, onTime: done - late, over,
    dUtil: delta(util, putil, 'down', '%', vs),
    dDone: delta(done, pdone, 'up', '', vs),
    dOnTime: delta(onTimePct, pOnTimePct, 'up', '%', vs),
    dOver: delta(over, pover, 'down', '', vs),
  };
};

// ---------- Workload trends ----------

export const trendNote = (weekIndex: number) => WEEK_NOTES[weekIndex];

/** First and last day of a reporting week (Monday and Sunday), e.g. { start: "Sep 28", end: "Oct 4" }. */
export const weekBounds = (weekIndex: number) => {
  const start = WEEK_STARTS[weekIndex];
  return { start: fmtDate(start), end: fmtDate(addDays(start, 6)) };
};

/** Monday–Sunday range of a reporting week: "Oct 5–11", or "Sep 28–Oct 4" across months. */
export const weekRangeLabel = (weekIndex: number): string => {
  const start = WEEK_STARTS[weekIndex];
  const end = addDays(start, 6);
  const [sm, sd] = fmtDate(start).split(' ');
  const [em, ed] = fmtDate(end).split(' ');
  return sm === em ? `${sm} ${sd}–${ed}` : `${sm} ${sd}–${em} ${ed}`;
};

/** Line chart tooltip band, relative to the 70–85% target range. */
export const trendBand = (v: number) => (v > 85 ? 'High' : v >= 70 ? 'In target range' : 'Below target');

export interface Person { name: string; util: number }

/** Share of people per band in a week (people, not tasks or hours). */
export const distribution = (weekIndex: number): Record<Band, Person[]> => {
  const people: Person[] = LOADS[weekIndex].map((util, col) => ({ name: employeeById(LOAD_ORDER[col]).name, util }));
  const by = (b: Band) => people.filter((p) => bandOf(p.util) === b).sort((a, z) => z.util - a.util);
  return { Low: by('Low'), Moderate: by('Moderate'), High: by('High') };
};

export const segmentSummary = (band: Band, count: number) => {
  const pct = Math.round((count / TEAM) * 100);
  const tail = band === 'High' ? 'with high utilisation' : band === 'Low' ? 'with spare capacity' : 'in a sustainable range';
  return `${count} of ${TEAM} people (${pct}%) ${tail}`;
};

export const segmentNote = (band: Band, weekIndex: number): string | null =>
  band === 'High' ? `Context: ${WEEK_NOTES[weekIndex]}.` : band === 'Low' ? 'Could take on redistributed work.' : null;

export { BAND_LABEL, TEAM };

// ---------- Kepler insight (uses the trends section's period) ----------

const highCount = (i: number) => LOADS[i].filter((v) => v > 85).length;

export const insight = (r: Range) => {
  const i0 = r.idx[0];
  const i1 = r.idx[r.idx.length - 1];
  const counts = LOAD_ORDER.map((id, j) => ({ name: employeeById(id).name, n: r.idx.filter((i) => LOADS[i][j] > 85).length, of: r.n }))
    .filter((x) => x.n > 0)
    .sort((a, b) => b.n - a.n);
  const heavy = r.idx.filter((i) => highCount(i) >= 3).length;
  const rising = TEAM_UTIL[i1] > TEAM_UTIL[i0];
  const evidence: Evidence[] = [
    { tag: 'Observed', text: counts.length ? `${counts[0].name} was above 85% in ${counts[0].n} of ${r.n} weeks.` : 'Nobody was above 85% in this period.' },
    { tag: 'Observed', text: `${heavy} of ${r.n} weeks had 3 or more people above 85%.` },
    { tag: 'Predicted', text: 'If this continues, at least one milestone a month is likely to slip. Medium confidence.' },
  ];
  return {
    title: rising ? 'High utilisation is becoming the norm' : 'Utilisation has eased, but high load persists',
    text: `Average utilisation went from ${TEAM_UTIL[i0]}% to ${TEAM_UTIL[i1]}% ${r.phrase}, and the share of people above 85% went from ${Math.round((highCount(i0) / TEAM) * 100)}% to ${Math.round((highCount(i1) / TEAM) * 100)}%.`,
    why: 'Sustained load above 85% leaves no buffer for blockers like the Fintech design handoff, and the extra work keeps landing on the same few people.',
    action: 'Shift recurring backend work toward people in the low band, and check team capacity before committing to new client work.',
    evidence,
    rows: r.idx.map((i) => ({ label: WEEK_LABELS[i], avg: TEAM_UTIL[i], high: highCount(i), share: Math.round((highCount(i) / TEAM) * 100) })),
    top: counts.slice(0, 4),
  };
};

export const insightChat = (r: Range): ChatScript & { title: string; sub: string } => {
  const d = insight(r);
  const top = d.top.slice(0, 3).map((c) => `${c.name} (${c.n} of ${c.of} weeks)`).join(', ');
  return {
    title: d.title,
    sub: `Workload trends · ${r.label}`,
    qs: [
      { q: 'Who has been above 85% most often?', a: [{ tag: 'Observed', text: top ? `${top}.` : 'Nobody in this period.' }] },
      { q: 'What caused the October peak?', a: [{ tag: 'Observed', text: 'Utilisation peaked at 82% in the week of Oct 19, when the E-commerce and Fintech client releases overlapped. Arjun (97%), Rahul (95%) and Karan (94%) were all above 85%.' }] },
      { q: 'What happens if nothing changes?', a: [
        { tag: 'Predicted', text: 'With 3 people regularly above 85%, at least one milestone a month is likely to slip, and the Fintech release on Dec 3 is most exposed. Medium confidence.' },
        { tag: '', text: 'This is a forecast, not a certainty. You decide what to change.' },
      ] },
    ],
    fallback: [{ tag: 'Observed', text: d.text }, { tag: '', text: 'Ask me about who is affected, what caused the peaks, or what might happen next.' }],
  };
};

// ---------- Delivery ----------

export const delivery = (r: Range) => {
  const done = sum(r.idx.map((i) => DONE[i]));
  const late = sum(r.idx.map((i) => LATE[i]));
  const onTimePct = Math.round(((done - late) / done) * 100);
  const msOn = sum(r.idx.map((i) => MILESTONES_ON_TIME[i]));
  const lateNames = r.idx.flatMap((i) => MILESTONES_LATE[i] ?? []);
  const msTotal = msOn + lateNames.length;
  return {
    done, late, onTime: done - late, onTimePct, latePct: 100 - onTimePct,
    avgDelay: (sum(r.idx.map((i) => DELAY_DAYS[i] * LATE[i])) / Math.max(1, late)).toFixed(1),
    msOn, msLate: lateNames.length, msTotal, msPct: Math.round((msOn / msTotal) * 100), lateNames,
  };
};

// ---------- Bottlenecks ----------

export interface BottleneckRow {
  b: Bottleneck;
  dates: string[];
}

/** Bottlenecks that occurred in the period, most frequent first. */
export const bottlenecks = (r: Range): BottleneckRow[] =>
  BOTTLENECKS.map((b) => ({ b, dates: b.dates.filter((d) => d >= r.start && d <= r.end) }))
    .filter((x) => x.dates.length > 0)
    .sort((a, z) => z.dates.length - a.dates.length);

export const bottleneckSuggestion = (rows: BottleneckRow[]): string | null => {
  if (!rows.length) return null;
  if (rows[0].b.id === 'b1') {
    return 'Design sign-off waits caused the most delay in this period. Agreeing a 3-day client review window in project plans could recover about 4 delivery days a sprint.';
  }
  return `${rows[0].b.title} recurred most often in this period (${rows[0].dates.length}×). Ask Kepler how to reduce it.`;
};

export const bottleneckChat = (b: Bottleneck, r: Range): ChatScript & { title: string; sub: string } => ({
  title: b.title,
  sub: `Bottlenecks · ${r.label}`,
  qs: b.qa,
  fallback: [{ tag: 'Observed', text: b.explain }, { tag: '', text: 'Ask me about the projects it affected or how to prevent it.' }],
});
