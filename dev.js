const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = 8000;

const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
};

function send(res, code, body, type = "text/plain; charset=utf-8") {
  res.writeHead(code, { "Content-Type": type });
  res.end(body);
}

http.createServer((req, res) => {
  const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
  const requested = urlPath === "/" ? "/index.html" : urlPath;
  const filePath = path.normalize(path.join(root, requested));

  if (!filePath.startsWith(root)) {
    send(res, 403, "Forbidden");
    return;
  }

  // Check if file exists
  fs.stat(filePath, (statErr, stats) => {
    let target = filePath;

    if (statErr) {
      // If the file doesn't exist, try appending .html for clean URLs
      const htmlPath = filePath + ".html";
      if (fs.existsSync(htmlPath)) {
        target = htmlPath;
      } else {
        send(res, 404, "Not found");
        return;
      }
    } else if (stats.isDirectory()) {
      target = path.join(filePath, "index.html");
    }

    fs.readFile(target, (readErr, content) => {
      if (readErr) {
        send(res, 404, "Not found");
        return;
      }

      const ext = path.extname(target).toLowerCase();
      send(res, 200, content, types[ext] || "application/octet-stream");
    });
  });
}).listen(port, () => {
  console.log(`Static server running at http://127.0.0.1:${port}`);
});
