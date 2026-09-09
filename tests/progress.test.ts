import assert from "node:assert/strict";
import test from "node:test";
import { dayKey, shiftDay, validStudyDate, levelProgress, summarize } from "../src/lib/progress";
const record = (day: string, minutes = 30) => ({ minutes, createdAt: new Date("2026-09-09T10:00:00Z"), studiedAt: new Date(day + "T00:00:00+09:00") });
test("JST midnight separates learning days", () => {
 assert.equal(dayKey(new Date("2026-09-08T14:59:59Z")), "2026-09-08");
 assert.equal(dayKey(new Date("2026-09-08T15:00:00Z")), "2026-09-09");
 assert.equal(shiftDay("2026-01-01", -1), "2025-12-31");
});
test("dates reject rollover, future and invalid input", () => {
 for (const value of ["2026-02-30", "2026-09-10", "bad", "1999-12-31"]) assert.equal(validStudyDate(value,"2026-09-09"), false);
 assert.equal(validStudyDate("2024-02-29","2026-09-09"), true);
});
test("levels advance at exact thresholds", () => {
 assert.equal(levelProgress(0).level, 1);
 assert.equal(levelProgress(99).level, 1);
 assert.deepEqual(levelProgress(100), {level:2,current:0,needed:200,percent:0});
 assert.equal(levelProgress(299).level,2);
 assert.equal(levelProgress(300).level,3);
 for (let n = 1; n < 500; n++) assert.equal(levelProgress(50*n*(n-1)).level,n);
});
test("streak deduplicates days and allows today to be pending", () => {
 const records = [record("2026-09-08"),record("2026-09-08"),record("2026-09-07")];
 const s = summarize(records,"2026-09-09");
 assert.equal(s.streak,2); assert.equal(s.total,90); assert.equal(s.activeDays,2); assert.equal(s.today,0);
 assert.equal(s.week.length,7); assert.equal(s.week[5].minutes,60);
 assert.equal(summarize(records,"2026-09-10").streak,0);
});
test("backdated records count on study day, legacy records fall back", () => {
 const s = summarize([record("2026-09-01"),{minutes:15,createdAt:new Date("2026-09-09T01:00:00Z"),studiedAt:null}],"2026-09-09");
 assert.equal(s.today,15); assert.equal(s.total,45); assert.equal(s.streak,1);
 assert.equal(summarize([],"2026-09-09").streak,0);
});
