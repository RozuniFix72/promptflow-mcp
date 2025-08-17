# Design

## Backend

Templates are stored as one JSON file per template under `~/.promptflow`.
A `TemplateRegistry` class handles CRUD, versioning and rendering.

Each template keeps a `history` array of `{version, body, updated}` so old
versions are never lost.

## Rendering

`{{variable}}` placeholders are replaced from a vars map at render time.
Missing variables are left as-is so callers can detect gaps.

## Search

A simple linear scan over name, body and tags. Fine for personal use;
swap for an inverted index if the store grows.

## Why JSON files

- Zero dependencies beyond the MCP SDK
- Easy to inspect, back up, or sync via git
- Good enough for a local prompt library

## Future

- Tag renaming
- Import/export bundles
- Sync via git remote

// TODO: revisit this section
