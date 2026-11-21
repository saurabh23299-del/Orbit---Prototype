import type { ISODate } from './types';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const parts = (d: ISODate) => d.split('-').map(Number) as [number, number, number];

/** "Nov 24" */
export const fmtDate = (d: ISODate): string => {
  const [, m, day] = parts(d);
  return `${MONTHS[m - 1]} ${day}`;
};

/** "Nov 24, 2026" */
export const fmtDateYear = (d: ISODate): string => `${fmtDate(d)}, ${parts(d)[0]}`;

/** "Mon, Nov 24" */
export const fmtDateWeekday = (d: ISODate): string => {
  const [y, m, day] = parts(d);
  return `${DAYS[new Date(Date.UTC(y, m - 1, day)).getUTCDay()]}, ${fmtDate(d)}`;
};

/** Whole days from a to b (b − a). */
export const daysBetween = (a: ISODate, b: ISODate): number => {
  const [y1, m1, d1] = parts(a);
  const [y2, m2, d2] = parts(b);
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86_400_000);
};

export const addDays = (d: ISODate, n: number): ISODate => {
  const [y, m, day] = parts(d);
  const t = new Date(Date.UTC(y, m - 1, day + n));
  return t.toISOString().slice(0, 10);
};

export const pct = (n: number): string => `${Math.round(n)}%`;

export const plural = (n: number, one: string, many = `${one}s`): string => `${n} ${n === 1 ? one : many}`;
