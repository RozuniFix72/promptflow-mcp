import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { TemplateRegistry } from "../storage/store.js";

const reg = new TemplateRegistry();

export function registerPromptTools(server: McpServer) {
  server.tool(
    "prompt.save",
    { name: z.string(), body: z.string(), tags: z.array(z.string()).optional() },
    async ({ name, body, tags }) => {
      const id = reg.save(name, body, tags ?? []);
      return { content: [{ type: "text", text: `saved ${name} as ${id}` }] };
    }
  );

  server.tool("prompt.list", {}, async () => {
    const items = reg.list().map((t) => ({
      id: t.id, name: t.name, version: t.version, tags: t.tags,
    }));
    return { content: [{ type: "text", text: JSON.stringify(items) }] };
  });

  server.tool(
    "prompt.get",
    { id: z.string(), vars: z.record(z.string()).optional() },
    async ({ id, vars }) => {
      const rendered = reg.render(id, vars ?? {});
      return { content: [{ type: "text", text: rendered }] };
    }
  );

  server.tool(
    "prompt.search",
    { q: z.string() },
    async ({ q }) => {
      const found = reg.search(q);
      return { content: [{ type: "text", text: JSON.stringify(found) }] };
    }
  );

  server.tool(
    "prompt.delete",
    { id: z.string() },
    async ({ id }) => {
      reg.remove(id);
      return { content: [{ type: "text", text: `deleted ${id}` }] };
    }
  );

  server.tool(
    "prompt.versions",
    { id: z.string() },
    async ({ id }) => {
      const versions = reg.versions(id);
      return { content: [{ type: "text", text: JSON.stringify(versions) }] };
    }
  );
}

<!-- maintenance -->
