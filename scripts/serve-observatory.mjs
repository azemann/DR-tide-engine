import { createReadStream } from "node:fs";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";

const port = Number.parseInt(
  process.env.DR_TIDE_OBSERVATORY_PORT ?? "4173",
  10,
);

if (!Number.isSafeInteger(port) || port < 1 || port > 65_535) {
  throw new Error("DR_TIDE_OBSERVATORY_PORT must be a valid TCP port");
}

const routes = new Map([
  ["/", ["../tools/observatory/index.html", "text/html; charset=utf-8"]],
  [
    "/index.html",
    ["../tools/observatory/index.html", "text/html; charset=utf-8"],
  ],
  [
    "/styles.css",
    ["../tools/observatory/styles.css", "text/css; charset=utf-8"],
  ],
  [
    "/app.js",
    ["../tools/observatory/app.js", "text/javascript; charset=utf-8"],
  ],
  [
    "/design/tokens.css",
    ["../design/tokens.css", "text/css; charset=utf-8"],
  ],
  [
    "/data/observatory-data.json",
    ["../data/generated/observatory-data.json", "application/json"],
  ],
]);

const server = createServer((request, response) => {
  const path = new URL(request.url ?? "/", "http://localhost").pathname;
  const route = routes.get(path);
  if (request.method !== "GET" || route === undefined) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found\n");
    return;
  }

  const [relativePath, contentType] = route;
  const stream = createReadStream(
    fileURLToPath(new URL(relativePath, import.meta.url)),
  );
  stream.on("open", () => {
    response.writeHead(200, {
      "Cache-Control": "no-store",
      "Content-Security-Policy":
        "default-src 'self'; style-src 'self'; script-src 'self'; connect-src 'self'",
      "Content-Type": contentType,
      "X-Content-Type-Options": "nosniff",
    });
    stream.pipe(response);
  });
  stream.on("error", () => {
    if (!response.headersSent) {
      response.writeHead(404, {
        "Content-Type": "text/plain; charset=utf-8",
      });
    }
    response.end("Not found\n");
  });
});

server.listen(port, "127.0.0.1", () => {
  process.stdout.write(
    `DR Tide Observatory: http://127.0.0.1:${port}\n`,
  );
});
