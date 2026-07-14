/**
 * seed-auto.js — one-step menu seeder for Strapi.
 * Logs in, creates an API token if needed, then seeds the menu.
 *
 * Usage: node seed-auto.js
 * (Strapi must be running on http://localhost:1337)
 */

const http = require("http");

const STRAPI_URL = "http://localhost:1337";

async function request(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, STRAPI_URL);
    const opts = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: { "Content-Type": "application/json" },
    };
    if (token) opts.headers["Authorization"] = `Bearer ${token}`;
    const req = http.request(opts, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });
    req.on("error", reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function main() {
  console.log("=== Strapi Menu Seeder ===\n");

  // 1. Login
  console.log("Logging in...");
  let loginRes = await request("POST", "/admin/login", {
    email: "admin@strapi.com",
    password: "Admin1234",
  });

  if (loginRes.status === 200) {
    console.log("  Logged in as admin@strapi.com");
  } else {
    // Try other common credentials
    loginRes = await request("POST", "/admin/login", {
      email: "admin@admin.com",
      password: "Admin123",
    });
    if (loginRes.status === 200) {
      console.log("  Logged in as admin@admin.com");
    } else {
      console.error(
        "  Could not log in. Status:",
        loginRes.status,
        loginRes.body,
      );
      console.error(
        "  Please create an admin user at http://localhost:1337/admin first.",
      );
      process.exit(1);
    }
  }

  const jwt = loginRes.body.data?.token || loginRes.body.token;
  if (!jwt) {
    console.error("  No token in response:", JSON.stringify(loginRes.body));
    process.exit(1);
  }

  // 2. Check for existing API token or create one
  console.log("Checking API tokens...");
  const tokensRes = await request("GET", "/admin/api-tokens", null, jwt);
  let apiToken = null;

  if (tokensRes.status === 200) {
    const existing = (tokensRes.body.data || []).find(
      (t) => t.name === "menu-seed-token",
    );
    if (existing) {
      apiToken = existing.accessKey;
      console.log("  Using existing token:", apiToken);
    }
  }

  if (!apiToken) {
    console.log("  Creating new API token...");
    const createRes = await request(
      "POST",
      "/admin/api-tokens",
      {
        name: "menu-seed-token",
        description: "Auto-generated for menu seeding",
        type: "full-access",
      },
      jwt,
    );

    if (createRes.status === 201 || createRes.status === 200) {
      apiToken = createRes.body.data?.accessKey;
      console.log("  Token created:", apiToken);
    } else {
      console.error(
        "  Failed to create token:",
        createRes.status,
        JSON.stringify(createRes.body),
      );
      process.exit(1);
    }
  }

  // 3. Run the seed
  console.log("\nSeeding menu items...\n");
  process.env.STRAPI_API_TOKEN = apiToken;
  process.env.STRAPI_URL = STRAPI_URL;
  require("./seed-menu.js");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
