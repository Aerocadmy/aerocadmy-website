const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("node:path");
const ts = require("typescript");

async function main() {
  const base = process.env.CATALOGUE_CHECK_URL || "http://localhost:3011";
  const storage = process.env.CATALOGUE_CHECK_STORAGE_DIR;
  assert(storage, "Set CATALOGUE_CHECK_STORAGE_DIR to an isolated test server's storage directory.");
  const compiled = ts.transpileModule(await fs.readFile(path.join(__dirname, "../src/data/guidance.ts"), "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const choices = {}; new Function("exports", compiled)(choices);
  const payload = { profession: choices.professions[1], fieldOfWork: "Engineering", experience: choices.droneExperience[0], interest: choices.learningInterests[1], goal: choices.learningGoals[0], format: choices.learningFormats[2], name: "Guidance check", phone: "+91 90000 00000", email: "guidance-check@example.invalid", callbackWindow: choices.callbackWindows[1], questions: "Which hardware course fits my background?" };
  const file = path.join(storage, "counselling.jsonl");
  const rows = async () => { try { return (await fs.readFile(file, "utf8")).trim().split("\n").filter(Boolean).map(row => JSON.parse(row)); } catch (error) { if (error.code === "ENOENT") return []; throw error; } };
  const before = await rows();
  const send = data => fetch(`${base}/api/counselling`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
  for (const invalid of [null, [], {}, { ...payload, profession: "unknown" }, { ...payload, experience: "" }, { ...payload, interest: "unknown" }, { ...payload, goal: "unknown" }, { ...payload, format: "unknown" }, { ...payload, email: "invalid" }, { ...payload, phone: "abc" }, { ...payload, callbackWindow: "unknown" }, { ...payload, fieldOfWork: 123 }, { ...payload, questions: "x".repeat(1001) }]) assert.equal((await send(invalid)).status, 400);
  assert.equal((await send({ ...payload, questions: "x".repeat(9000) })).status, 413);
  assert.equal((await fetch(`${base}/api/counselling`, { method: "POST", body: "no-json" })).status, 415);
  assert.equal((await fetch(`${base}/api/counselling`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{" })).status, 400);
  assert.equal((await rows()).length, before.length);
  assert.equal((await send(payload)).status, 201);
  const saved = await rows();
  assert.equal(saved.length, before.length + 1);
  const entry = saved.at(-1);
  for (const key of Object.keys(payload)) assert.equal(entry[key], payload[key]);
  assert.equal(entry.contactRequested, true);
  assert.equal(entry.callbackTimezone, "Asia/Kolkata");
  assert(entry.id && !Number.isNaN(Date.parse(entry.createdAt)));
  for (const [query, count] of [["engineering",4], ["applications",4], ["unknown",8]]) {
    const response = await fetch(`${base}/courses?path=${query}`); assert.equal(response.status, 200);
    const html = await response.text(); assert.equal((html.match(/<article\b/g) || []).length, count);
  }
  const home = await (await fetch(base)).text();
  assert(home.includes('id="find-your-path"') && home.includes('id="counselling"'));
  assert.equal((await fetch(`${base}/.data/counselling.jsonl`)).status, 404);
  if (process.env.GUIDANCE_FAILURE_CHECK_URL) {
    const failure = await fetch(`${process.env.GUIDANCE_FAILURE_CHECK_URL}/api/counselling`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    assert.equal(failure.status, 503); const result = await failure.json(); assert(result.error && !result.message);
  }
  console.log("Passed: counselling validation, full saved context, payload limits, private storage, learning-path filters, and homepage sections.");
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
