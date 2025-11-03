import { randomUUID } from "node:crypto";
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

export interface TemplateVersion {
  version: number;
  body: string;
  updated: string;
}

export interface Template {
  id: string;
  name: string;
  body: string;
  tags: string[];
  version: number;
  created: string;
  history: TemplateVersion[];
}

export class TemplateRegistry {
  private dir: string;

  constructor(dir = join(homedir(), ".promptflow")) {
    this.dir = dir;
    mkdirSync(this.dir, { recursive: true });
  }

  private path(id: string) {
    return join(this.dir, `${id}.json`);
  }

  save(name: string, body: string, tags: string[] = []): string {
    const existing = this.list().find((t) => t.name === name);
    if (existing) {
      return this.update(existing.id, body, tags);
    }
    const tpl: Template = {
      id: randomUUID(),
      name,
      body,
      tags,
      version: 1,
      created: new Date().toISOString(),
      history: [{ version: 1, body, updated: new Date().toISOString() }],
    };
    writeFileSync(this.path(tpl.id), JSON.stringify(tpl, null, 2));
    return tpl.id;
  }

  update(id: string, body: string, tags?: string[]): string {
    const tpl = this.get(id);
    tpl.version += 1;
    tpl.body = body;
    if (tags) tpl.tags = tags;
    tpl.history.push({ version: tpl.version, body, updated: new Date().toISOString() });
    writeFileSync(this.path(id), JSON.stringify(tpl, null, 2));
    return id;
  }

  get(id: string): Template {
    return JSON.parse(readFileSync(this.path(id), "utf-8")) as Template;
  }

  list(): Template[] {
    return readdirSync(this.dir)
      .filter((f) => f.endsWith(".json"))
      .map((f) => JSON.parse(readFileSync(join(this.dir, f), "utf-8")) as Template);
  }

  search(q: string): Template[] {
    const needle = q.toLowerCase();
    return this.list().filter(
      (t) =>
        t.name.toLowerCase().includes(needle) ||
        t.body.toLowerCase().includes(needle) ||
        t.tags.some((tag) => tag.toLowerCase().includes(needle))
    );
  }

  versions(id: string): TemplateVersion[] {
    return this.get(id).history;
  }

  render(id: string, vars: Record<string, string>): string {
    const tpl = this.get(id);
    return tpl.body.replace(/\{\{(\w+)\}\}/g, (_, key: string) => vars[key] ?? `{{${key}}}`);
  }

  remove(id: string): void {
    rmSync(this.path(id), { force: true });
  }
}

- Updated example output.
