import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
loadEnvFile(path.join(root, ".env.local"));
loadEnvFile(path.join(root, ".env"));

const token = process.env.NOTION_TOKEN;
const dataSourceId = process.env.NOTION_DATA_SOURCE_ID;
const legacyDatabaseId = process.env.NOTION_DATABASE_ID;
const notionVersion = process.env.NOTION_VERSION || (dataSourceId ? "2026-03-11" : "2022-06-28");

if (!token) {
  fail("NOTION_TOKEN 이 필요합니다. .env.local 에 추가해 주세요.");
}

if (!dataSourceId && !legacyDatabaseId) {
  fail("NOTION_DATA_SOURCE_ID 또는 NOTION_DATABASE_ID 가 필요합니다.");
}

const endpoint = dataSourceId
  ? `https://api.notion.com/v1/data_sources/${dataSourceId}/query`
  : `https://api.notion.com/v1/databases/${legacyDatabaseId}/query`;

const pages = await queryAllPages(endpoint);

console.log(`DB pages: ${pages.length}`);

for (const page of pages) {
  const title = readPlain(page.properties?.Title || page.properties?.Name) || "(no title)";
  const slug = readPlain(page.properties?.Slug);
  const visibility = readPlain(page.properties?.Visibility);

  console.log(`\n- ${title}`);
  console.log(`  id: ${page.id}`);
  console.log(`  slug: ${slug || "(empty)"}`);
  console.log(`  visibility: ${visibility || "(empty)"}`);

  await printChildren(page.id, "  ");
}

async function printChildren(blockId, indent) {
  const blocks = await listBlockChildren(blockId);

  if (!blocks.length) {
    console.log(`${indent}children: (empty)`);
    return;
  }

  console.log(`${indent}children:`);

  for (const block of blocks) {
    const label = blockLabel(block);
    console.log(`${indent}- ${block.type}: ${label}`);

    if (block.type === "child_page") {
      await printChildren(block.id, indent + "  ");
    }
  }
}

async function queryAllPages(url) {
  const results = [];
  let startCursor;

  do {
    const body = {
      page_size: 100
    };

    if (startCursor) {
      body.start_cursor = startCursor;
    }

    const data = await notionFetch(url, {
      method: "POST",
      body: JSON.stringify(body)
    });

    results.push(...(data.results || []));
    startCursor = data.has_more ? data.next_cursor : undefined;
  } while (startCursor);

  return results;
}

async function listBlockChildren(blockId) {
  const results = [];
  let startCursor;

  do {
    const url = new URL(`https://api.notion.com/v1/blocks/${blockId}/children`);
    url.searchParams.set("page_size", "100");

    if (startCursor) {
      url.searchParams.set("start_cursor", startCursor);
    }

    const data = await notionFetch(url, {
      method: "GET"
    });

    results.push(...(data.results || []));
    startCursor = data.has_more ? data.next_cursor : undefined;
  } while (startCursor);

  return results;
}

async function notionFetch(url, options) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      "Notion-Version": notionVersion,
      ...(options.headers || {})
    }
  });

  if (!response.ok) {
    const message = await response.text();
    fail(`Notion API 요청 실패 (${response.status})\n${message}`);
  }

  return response.json();
}

function blockLabel(block) {
  if (block.type === "child_page") {
    return block.child_page?.title || "(untitled child page)";
  }

  const value = block[block.type];

  if (value?.rich_text) {
    return richText(value.rich_text) || "(empty)";
  }

  return "(no text)";
}

function readPlain(prop) {
  if (!prop) {
    return "";
  }

  switch (prop.type) {
    case "title":
      return richText(prop.title);
    case "rich_text":
      return richText(prop.rich_text);
    case "select":
      return prop.select?.name || "";
    case "status":
      return prop.status?.name || "";
    case "url":
      return prop.url || "";
    case "date":
      return prop.date?.start || "";
    default:
      return "";
  }
}

function richText(items) {
  return (items || []).map(item => item.plain_text || "").join("").trim();
}

function loadEnvFile(file) {
  if (!fs.existsSync(file)) {
    return;
  }

  const text = fs.readFileSync(file, "utf8");

  text.split(/\r?\n/).forEach(line => {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      return;
    }

    const index = trimmed.indexOf("=");

    if (index === -1) {
      return;
    }

    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^["']|["']$/g, "");

    if (!process.env[key]) {
      process.env[key] = value;
    }
  });
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
