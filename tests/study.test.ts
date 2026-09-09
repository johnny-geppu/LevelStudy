/* eslint-disable @typescript-eslint/no-explicit-any -- Prisma boundary spies retain heterogeneous query shapes. */
import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import ts from "typescript";
import { z } from "zod";
import { validStudyDate } from "../src/lib/progress";

// Execute the actual action with isolated auth/database boundaries; never touches live data.
function harness(options: { signedOut?: boolean; owned?: boolean; archived?: boolean } = {}) {
 const calls: { method: string; args: any }[] = [];
 const mutation = (method: string) => async (args: any) => { calls.push({method,args}); return {count:1}; };
 const prisma = {
   skill: { findFirst: async (args: any) => { calls.push({method:"findFirst",args}); return options.owned === false ? null : {id:"mine",archivedAt:options.archived ? new Date() : null}; }, create:mutation("createSkill"), update:mutation("updateSkill") },
   studyRecord: {create:mutation("createRecord"),updateMany:mutation("editRecord"),deleteMany:mutation("deleteRecord")},
 };
 const source = ts.transpileModule(fs.readFileSync("src/lib/actions/study.ts","utf8"), {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 const actionModule = {exports:{} as {saveStudy: (state: object, form: FormData) => Promise<{error?: string;success?: string}>}};
 const imports: Record<string, unknown> = {
   "@/lib/prisma": {prisma}, "@/lib/session": {requireUser: async () => {if(options.signedOut) throw new Error("redirect login"); return {id:"owner"};}},
   "@/lib/progress": {validStudyDate}, "next/cache": {revalidatePath: () => {}}, "zod": {z},
 };
 new Function("require","module","exports",source)((name: string) => {if(!(name in imports)) throw new Error(name); return imports[name];},actionModule,actionModule.exports);
 return {calls, run: (data: Record<string,string>) => {const form=new FormData();for(const [key,value] of Object.entries(data))form.set(key,value);return actionModule.exports.saveStudy({},form);}};
}
test("signed-out mutations stop before database access",async () => {
 const h=harness({signedOut:true});await assert.rejects(h.run({operation:"createSkill",title:"Python"}),/redirect login/);assert.equal(h.calls.length,0);
});
test("another user's skill cannot be edited",async () => {
 const h=harness({owned:false});const result=await h.run({operation:"rename",skillId:"other",title:"Changed"});assert.ok(result.error);assert.equal(h.calls.length,1);assert.deepEqual(h.calls[0].args.where,{id:"other",userId:"owner"});
});
test("invalid minutes never create a record",async () => {
 for(const minutes of ["0","-1","1.5","1441","NaN"]){const h=harness();assert.ok((await h.run({operation:"createRecord",skillId:"mine",minutes,date:"2026-01-01",content:"test"})).error);assert.equal(h.calls.length,1);}
});
test("archived skills reject new records",async () => {
 const h=harness({archived:true});assert.ok((await h.run({operation:"createRecord",skillId:"mine",minutes:"30",date:"2026-01-01",content:"test"})).error);assert.equal(h.calls.length,1);
});
test("record writes preserve JST learning date and ownership",async () => {
 const h=harness();assert.ok((await h.run({operation:"editRecord",skillId:"mine",recordId:"record",minutes:"45",date:"2026-01-01",content:" test "})).success);
 const call=h.calls[1];assert.equal(call.method,"editRecord");assert.deepEqual(call.args.where,{id:"record",skillId:"mine",skill:{userId:"owner"}});assert.equal(call.args.data.minutes,45);assert.equal(call.args.data.content,"test");assert.equal(call.args.data.studiedAt.toISOString(),"2025-12-31T15:00:00.000Z");
});
test("record deletion is scoped to both owner and skill",async () => {
 const h=harness();assert.ok((await h.run({operation:"deleteRecord",skillId:"mine",recordId:"record"})).success);assert.deepEqual(h.calls[1].args.where,{id:"record",skillId:"mine",skill:{userId:"owner"}});
});
