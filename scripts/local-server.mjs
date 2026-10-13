import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const port = Number(process.env.PORT || 8000);
const host = "127.0.0.1";

const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml"
};

const server = http.createServer((request, response) => {
  const pathname = decodeURIComponent((request.url || "/").split("?")[0]);
  let file = path.resolve(root, pathname === "/" ? "index.html" : pathname.slice(1));

  if (!file.startsWith(root) || isBlocked(file)) {
    response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Forbidden");
    return;
  }

  try {
    if (fs.statSync(file).isDirectory()) {
      file = path.join(file, "index.html");
    }

    if (isBlocked(file)) {
      response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Forbidden");
      return;
    }

    const ext = path.extname(file).toLowerCase();
    response.writeHead(200, {
      "Cache-Control": "no-store",
      "Content-Type": types[ext] || "application/octet-stream"
    });
    fs.createReadStream(file).pipe(response);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
});

server.listen(port, host, () => {
  console.log(`Serving http://${host}:${port}`);
});

function isBlocked(file) {
  const relative = path.relative(root, file);
  const parts = relative.split(path.sep);

  return parts.some(part =>
    part === ".git" ||
    part === ".env" ||
    part.startsWith(".env.") ||
    part === ".env.local" ||
    part === ".DS_Store"
  );
}
