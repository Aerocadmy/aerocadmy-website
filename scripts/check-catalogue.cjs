const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("node:path");
const ts = require("typescript");

async function main() {
  const base = process.env.CATALOGUE_CHECK_URL || "http://localhost:3011";
  const storage = process.env.CATALOGUE_CHECK_STORAGE_DIR;
  assert(storage, "Point CATALOGUE_CHECK_STORAGE_DIR at an isolated test server's WAITLIST_STORAGE_DIR.");
  const source = await fs.readFile(path.join(__dirname, "../src/data/courses.ts"), "utf8");
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const exports = {};
  new Function("exports", compiled)(exports);
  const courses = exports.recordedCourses;
  assert.equal(courses.length, 8);
  assert.equal(new Set(courses.map(course => course.slug)).size, 8);
  for (const group of exports.courseGroups) assert.equal(courses.filter(course => course.group === group).length, 4);
  const htmlText = text => text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#x27;");
  for (const course of courses) {
    const response = await fetch(`${base}/courses/${course.slug}`);
    assert.equal(response.status, 200, course.slug);
    const html = await response.text();
    for (const text of [course.title, course.audience, course.prerequisites, course.outcome, course.project, ...course.modules, ...course.resources]) {
      assert(html.includes(htmlText(text)), `Missing course content: ${course.slug}`);
    }
    assert(html.includes("Join the waitlist"));
    assert.equal(course.modules.length, 4);
    await fs.access(path.join(__dirname, "../public", course.visual.src));
  }
  assert.equal((await fetch(`${base}/courses/not-a-listed-course`)).status, 404);
  assert.equal((await fetch(`${base}/courses`)).status, 200);
  assert.equal((await fetch(`${base}/programs/drone-technology-internship`)).status, 200);

  const file = path.join(storage, "waitlist.jsonl");
  const readRows = async () => {
    try { return (await fs.readFile(file, "utf8")).trim().split("\n").filter(Boolean).map(row => JSON.parse(row)); }
    catch (error) { if (error.code === "ENOENT") return []; throw error; }
  };
  const before = await readRows();
  const payload = { name: "Catalogue check", phone: "+91 90000 00000", email: "catalogue-check@example.invalid", courseSlug: courses[0].slug };
  const send = data => fetch(`${base}/api/waitlist`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
  for (const invalid of [null, [], {}, { ...payload, courseSlug: "unknown" }, { ...payload, phone: "abc" }, { ...payload, email: "invalid" }, { ...payload, name: " " }]) {
    assert.equal((await send(invalid)).status, 400);
  }
  assert.equal((await fetch(`${base}/api/waitlist`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{" })).status, 400);
  assert.equal((await fetch(`${base}/api/waitlist`, { method: "POST", body: "not-json" })).status, 415);
  assert.equal((await send({ ...payload, name: "x".repeat(9000) })).status, 413);
  assert.equal((await readRows()).length, before.length, "Invalid forms must not be saved");
  const accepted = await send(payload);
  assert.equal(accepted.status, 201);
  const rows = await readRows();
  assert.equal(rows.length, before.length + 1);
  const saved = rows.at(-1);
  for (const key of Object.keys(payload)) assert.equal(saved[key], payload[key]);
  assert.equal(saved.courseTitle, courses[0].title);
  assert(saved.id && !Number.isNaN(Date.parse(saved.createdAt)));
  assert.equal((await fetch(`${base}/.data/catalogue-check/waitlist.jsonl`)).status, 404, "Private submissions must not be served");
  console.log("Passed: eight complete course previews, two learning paths, assets, 404s, input validation, request limits, private storage, and persisted waitlist submission.");
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
