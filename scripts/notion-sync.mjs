import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
loadEnvFile(path.join(root, ".env.local"));
loadEnvFile(path.join(root, ".env"));

const token = process.env.NOTION_TOKEN;
const dataSourceId = process.env.NOTION_DATA_SOURCE_ID;
const legacyDatabaseId = process.env.NOTION_DATABASE_ID;
const outputPath = process.env.NOTION_OUTPUT || "assets/data/study-posts-data.js";
const visibilityValue = process.env.NOTION_VISIBILITY_VALUE || "Public";

if (!token) {
  fail("NOTION_TOKEN 이 필요합니다. .env.local 에 추가해 주세요.");
}

if (!dataSourceId && !legacyDatabaseId) {
  fail("NOTION_DATA_SOURCE_ID 가 필요합니다. 예전 API를 쓰면 NOTION_DATABASE_ID 도 가능합니다.");
}

const endpoint = dataSourceId
  ? `https://api.notion.com/v1/data_sources/${dataSourceId}/query`
  : `https://api.notion.com/v1/databases/${legacyDatabaseId}/query`;

const notionVersion = process.env.NOTION_VERSION || (dataSourceId ? "2026-03-11" : "2022-06-28");

const pages = await queryAllPages(endpoint, notionVersion);
const posts = (await Promise.all(pages.map(pageToStudyPost)))
  .filter(Boolean)
  .sort((a, b) => String(b.date).localeCompare(String(a.date)));
const syncedAt = formatDateTime(new Date());

const out = [
  "window.STUDY_POSTS_SYNCED_AT = ",
  JSON.stringify(syncedAt),
  ";\n",
  "window.STUDY_POSTS = ",
  JSON.stringify(posts, null, 2),
  ";\n"
].join("");

fs.mkdirSync(path.dirname(path.join(root, outputPath)), { recursive: true });
fs.writeFileSync(path.join(root, outputPath), out, "utf8");

console.log(`Synced ${posts.length} Notion pages to ${outputPath}`);

async function queryAllPages(url, version) {
  const results = [];
  let startCursor;

  do {
    const body = {
      page_size: 100,
      sorts: [
        {
          property: "PublishedAt",
          direction: "descending"
        }
      ]
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

async function pageToStudyPost(page) {
  const props = page.properties || {};
  const visibility = readPlain(props.Visibility);

  if (visibility && visibility !== visibilityValue) {
    return null;
  }

  const title = readPlain(props.Title || props.Name);

  if (!title) {
    return null;
  }

  const published = readDate(props.PublishedAt || props.Date);
  const category = readPlain(props.Category) || "Study";
  const summary = readPlain(props.Summary || props.PublicSummary);
  const publicUrl = readPlain(props.PublicUrl || props.URL);
  const slug = normalizeSlug(readPlain(props.Slug));
  const href = publicUrl || (slug ? `./study/${slug}.html` : "./study/");
  const isReady = Boolean(publicUrl || slug);
  const children = await blockChildrenToTree(page.id);

  return {
    id: page.id,
    slug,
    date: formatDateTime(published),
    category,
    title,
    summary,
    meta: formatDateTime(published),
    href,
    studyHref: publicUrl || (slug ? `./${slug}.html` : "#"),
    todo: !isReady,
    notionUrl: publicUrl || "",
    notionLabel: isReady ? "원문 보기 →" : "원문 없음",
    children
  };
}

async function blockChildrenToTree(blockId) {
  const blocks = await listBlockChildren(blockId);
  const tree = [];

  for (const block of blocks) {
    const item = await blockToNode(block);

    if (item) {
      tree.push(item);
    }
  }

  return tree;
}

async function blockToNode(block) {
  if (block.type === "child_page") {
    return {
      type: "page",
      title: block.child_page?.title || "제목 없음",
      children: await blockChildrenToTree(block.id)
    };
  }

  if (block.type === "image") {
    const image = block.image || {};
    const url = image.type === "external"
      ? image.external?.url
      : "";

    if (!url) {
      return null;
    }

    return {
      type: "image",
      url,
      caption: richText(image.caption || [])
    };
  }

  const value = block[block.type] || {};
  const text = richText(value.rich_text || []);

  if (!text) {
    return null;
  }

  return {
    type: block.type,
    text
  };
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
    case "multi_select":
      return (prop.multi_select || []).map(item => item.name).join(", ");
    case "url":
      return prop.url || "";
    case "email":
      return prop.email || "";
    case "phone_number":
      return prop.phone_number || "";
    case "date":
      return prop.date?.start || "";
    case "number":
      return prop.number == null ? "" : String(prop.number);
    case "checkbox":
      return prop.checkbox ? "true" : "";
    default:
      return "";
  }
}

function readDate(prop) {
  const value = readPlain(prop);
  return value ? new Date(value) : new Date();
}

function richText(items) {
  return (items || []).map(item => item.plain_text || "").join("").trim();
}

function normalizeSlug(value) {
  return String(value || "")
    .trim()
    .replace(/\\/g, "/")
    .split("/")
    .filter(Boolean)
    .join("-")
    .toLowerCase();
}

function formatDateTime(date) {
  const formatter = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  });

  const parts = Object.fromEntries(
    formatter.formatToParts(date).map(part => [part.type, part.value])
  );

  return `${parts.year}.${parts.month}.${parts.day} ${parts.hour}:${parts.minute}`;
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
