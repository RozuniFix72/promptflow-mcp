# Usage

## Build

```bash
npm install
npm run build
```

## Run the server

```bash
node dist/index.js
```

## MCP client config

Add to your MCP client config (e.g. Claude Desktop):

```json
{
  "mcpServers": {
    "promptflow": {
      "command": "node",
      "args": ["/path/to/promptflow-mcp/dist/index.js"]
    }
  }
}
```

## Example session

```text
prompt.save  name="code-review" body="Review this diff:\n{{diff}}" tags=["review"]
prompt.list
prompt.get   id=... vars={"diff":"..."}
prompt.versions id=...
```

## Tests

```bash
npm test
```

- Updated example output.
