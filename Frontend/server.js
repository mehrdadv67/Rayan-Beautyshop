const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

// تنظیمات محیطی
const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3000;
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    // تجزیه URL
    const parsedUrl = parse(req.url, true);
    const { pathname, query } = parsedUrl;

    // تنظیم هدرهای CORS
    res.setHeader(
      "Access-Control-Allow-Origin",
      process.env.NEXT_PUBLIC_SITE_URL || "*"
    ); // استفاده از URL صحیح
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With, Content-Type, Authorization"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);

    // مدیریت درخواست‌های OPTIONS برای CORS
    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    // مدیریت مسیرها
    if (pathname === "/a") {
      app.render(req, res, "/a", query);
    } else if (pathname === "/b") {
      app.render(req, res, "/b", query);
    } else {
      handle(req, res, parsedUrl);
    }
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
