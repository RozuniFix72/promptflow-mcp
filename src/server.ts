import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerPromptTools } from "./templates/index.js";

export async function startServer() {
  const server = new McpServer({
    name: "promptflow",
    version: "0.2.1",
  });
  registerPromptTools(server);
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("promptflow-mcp: connected");
}

## Notes

- Local-first; no network needed.
