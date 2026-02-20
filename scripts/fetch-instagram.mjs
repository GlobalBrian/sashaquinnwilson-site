import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const accessToken = (process.env.IG_ACCESS_TOKEN || "").trim();
const userId = process.env.IG_USER_ID;
const postLimit = Number(process.env.IG_POST_LIMIT || 24);

if (!accessToken || !userId) {
  console.error("Missing required env vars: IG_ACCESS_TOKEN and IG_USER_ID");
  process.exit(1);
}

const graphVersion = process.env.IG_GRAPH_VERSION || "v23.0";

function buildEndpoint(baseUrl, withVersion = true) {
  const versionSegment = withVersion ? `/${graphVersion}` : "";
  const endpoint = new URL(`${baseUrl}${versionSegment}/${userId}/media`);
  endpoint.searchParams.set(
    "fields",
    "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp"
  );
  endpoint.searchParams.set("limit", String(postLimit));
  endpoint.searchParams.set("access_token", accessToken);
  return endpoint;
}

const endpoints = [
  buildEndpoint("https://graph.facebook.com", true),
  buildEndpoint("https://graph.instagram.com", true),
  buildEndpoint("https://graph.instagram.com", false)
];

async function fetchPosts() {
  const errors = [];

  for (const endpoint of endpoints) {
    const response = await fetch(endpoint.toString());
    if (!response.ok) {
      const body = await response.text();
      errors.push(`${endpoint.origin}: ${response.status} ${body}`);
      continue;
    }

    const payload = await response.json();
    const media = Array.isArray(payload.data) ? payload.data : [];

    return media
      .filter((item) => item.media_url || item.thumbnail_url)
      .map((item) => ({
        id: item.id,
        caption: item.caption ?? "",
        mediaType: item.media_type,
        mediaUrl: item.media_url ?? item.thumbnail_url,
        permalink: item.permalink,
        timestamp: item.timestamp
      }));
  }

  throw new Error(`Instagram Graph API failed for all endpoints: ${errors.join(" | ")}`);
}

async function main() {
  const posts = await fetchPosts();
  const out = {
    updatedAt: new Date().toISOString(),
    source: "instagram_graph_api",
    posts
  };

  const outputDir = resolve(process.cwd(), "content");
  await mkdir(outputDir, { recursive: true });
  await writeFile(resolve(outputDir, "posts.json"), `${JSON.stringify(out, null, 2)}\n`, "utf8");

  console.log(`Saved ${posts.length} posts to content/posts.json`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
