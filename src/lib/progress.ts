export function dayKey(date: Date = new Date()): string {
  return new Date(date.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

export function shiftDay(day: string, offset: number): string {
  return new Date(Date.parse(`${day}T00:00:00Z`) + offset * 86400000).toISOString().slice(0, 10);
}

export function validStudyDate(value: string, today = dayKey()): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value < "2000-01-01" || value > today) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

// Level n starts at 50 * n * (n - 1) XP. Each new level takes 100 more XP.
export function levelProgress(xp: number) {
  const level = Math.floor((1 + Math.sqrt(1 + 0.08 * Math.max(0, xp))) / 2);
  const floor = 50 * level * (level - 1);
  const needed = level * 100;
  return { level, current: xp - floor, needed, percent: Math.floor((xp - floor) / needed * 100) };
}

export function summarize(records: { minutes: number; createdAt: Date; studiedAt: Date | null }[], today = dayKey()) {
  const days = new Map<string, number>();
  for (const record of records) {
    const day = dayKey(record.studiedAt ?? record.createdAt);
    days.set(day, (days.get(day) ?? 0) + record.minutes);
  }
  let cursor = days.has(today) ? today : shiftDay(today, -1);
  let streak = 0;
  while (days.has(cursor)) { streak++; cursor = shiftDay(cursor, -1); }
  const week = Array.from({ length: 7 }, (_, i) => {
    const day = shiftDay(today, i - 6);
    return { day, minutes: days.get(day) ?? 0 };
  });
  return { total: records.reduce((sum, r) => sum + r.minutes, 0), today: days.get(today) ?? 0, streak, week, activeDays: days.size };
}
