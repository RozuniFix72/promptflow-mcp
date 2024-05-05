export async function main() {
  const { startServer } = await import("./server.js");
  await startServer();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error("fatal:", err);
    process.exit(1);
  });
}
