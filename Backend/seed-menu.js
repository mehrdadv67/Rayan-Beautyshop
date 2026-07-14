/**
 * seed-menu.js — imports the cosmetics menu tree into Strapi's menu-items.
 *
 * USAGE (from the Backend folder):
 *   1. Start Strapi:  cd my-strapi-project && npm run dev
 *   2. Create an API token in Strapi admin:
 *        Settings → Users & Permissions Plugin → API Tokens
 *        → Create new API Token → Token type: "Full access"
 *        → Name: "menu-seed" → copy the generated token
 *   3. set STRAPI_API_TOKEN=your_token_here
 *      node seed-menu.js
 *
 * WHAT IT DOES:
 *   - Reads the menu tree (desktop + mobile) from seed-menu-data.json
 *   - Creates parents first, then children, linking each child to its parent.
 *   - Idempotent: skips items whose (menu_type, path, label) already exist.
 *
 * Re-runnable. Safe to edit seed-menu-data.json and run again — existing
 * items are kept, only missing ones are added.
 */

const fs = require("fs");
const path = require("path");

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";
const TOKEN = process.env.STRAPI_API_TOKEN;

if (!TOKEN) {
  console.error(
    "ERROR: set STRAPI_API_TOKEN to a Full-access API token from Strapi admin."
  );
  process.exit(1);
}

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${TOKEN}`,
};

const DATA_PATH = path.join(__dirname, "seed-menu-data.json");
const { desktop, mobile } = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));

// ---- existing-item cache so re-runs are idempotent ----------------------
const existing = new Map(); // key: "menu_type|path|label" -> documentId

async function loadExisting() {
  let page = 1;
  while (true) {
    const url = `${STRAPI_URL}/api/menu-items?pagination[page]=${page}&pagination[pageSize]=100&fields[0]=label&fields[1]=path&fields[2]=menu_type`;
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`loadExisting ${res.status}: ${await res.text()}`);
    const json = await res.json();
    for (const it of json.data || []) {
      const key = `${it.menu_type}|${it.path}|${it.label}`;
      existing.set(key, it.documentId);
    }
    if (page >= (json.meta?.pagination?.pageCount || 1)) break;
    page++;
  }
  console.log(`Found ${existing.size} existing menu-items.`);
}

// ---- create one item, returns its documentId -----------------------------
async function createItem({ label, path, sortOrder, menuType, parentDocId }) {
  const key = `${menuType}|${path}|${label}`;
  if (existing.has(key)) {
    return existing.get(key);
  }
  const body = {
    data: {
      label,
      path: path || "",
      sort_order: sortOrder,
      menu_type: menuType,
      is_active: true,
      parent: parentDocId || null,
    },
  };
  const res = await fetch(`${STRAPI_URL}/api/menu-items`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(
      `createItem(${label}) ${res.status}: ${await res.text()}`
    );
  }
  const json = await res.json();
  const docId = json.data.documentId;
  existing.set(key, docId);
  return docId;
}

// ---- recursively seed a tree ---------------------------------------------
async function seedTree(node, menuType, sortOrder, parentDocId, depth) {
  const docId = await createItem({
    label: node.label,
    path: node.path,
    sortOrder,
    menuType,
    parentDocId,
  });
  const indent = "  ".repeat(depth);
  console.log(`${indent}${depth === 0 ? "ROOT" : "item"} #${sortOrder} ${node.label} [${docId}]`);
  const children = node.children || node.subMenu || [];
  let n = 0;
  for (const child of children) {
    await seedTree(child, menuType, n + 1, docId, depth + 1);
    n++;
  }
}

async function main() {
  console.log(`Seeding to ${STRAPI_URL} ...`);
  await loadExisting();
  console.log("\n=== DESKTOP MENU ===");
  let i = 0;
  for (const root of desktop) {
    await seedTree(root, "desktop", ++i, null, 0);
  }
  console.log("\n=== MOBILE MENU ===");
  i = 0;
  for (const root of mobile) {
    await seedTree(root, "mobile", ++i, null, 0);
  }
  console.log(`\nDone. Total menu-items now: ${existing.size}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
