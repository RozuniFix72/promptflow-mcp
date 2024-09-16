import test from "node:test";
import assert from "node:assert";
import { TemplateRegistry } from "../src/storage/store.js";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

test("save and list templates", () => {
  const dir = mkdtempSync(join(tmpdir(), "promptflow-"));
  const reg = new TemplateRegistry(dir);
  const id = reg.save("code-review", "Review {{diff}}", ["review"]);
  assert.ok(id);
  assert.equal(reg.list().length, 1);
  rmSync(dir, { recursive: true, force: true });
});

test("updating bumps version and keeps history", () => {
  const dir = mkdtempSync(join(tmpdir(), "promptflow-"));
  const reg = new TemplateRegistry(dir);
  const id = reg.save("greet", "hi {{name}}");
  reg.update(id, "hello {{name}}");
  const tpl = reg.get(id);
  assert.equal(tpl.version, 2);
  assert.equal(tpl.history.length, 2);
  rmSync(dir, { recursive: true, force: true });
});

test("render interpolates variables", () => {
  const dir = mkdtempSync(join(tmpdir(), "promptflow-"));
  const reg = new TemplateRegistry(dir);
  const id = reg.save("greet", "hi {{name}}");
  assert.equal(reg.render(id, { name: "ada" }), "hi ada");
  rmSync(dir, { recursive: true, force: true });
});

test("search matches tags and body", () => {
  const dir = mkdtempSync(join(tmpdir(), "promptflow-"));
  const reg = new TemplateRegistry(dir);
  reg.save("deploy", "run the pipeline", ["ci"]);
  assert.equal(reg.search("pipeline").length, 1);
  assert.equal(reg.search("ci").length, 1);
  rmSync(dir, { recursive: true, force: true });
});
