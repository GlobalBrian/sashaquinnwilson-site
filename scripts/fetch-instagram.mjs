import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const accessToken = process.env.IG_ACCESS_TOKEN;
const userId = process.env.IG_USER_ID;
const postLimit = Number(process.env.IG_POST_LIMIT || 24);

if (!accessToken || !userId) {
  console.error("Missing required env vars: IG_ACCESS_TOKEN and IG_USER_ID");
  process.exit(1);
}

const graphVersion = process.env.IG_GRAPH_VERSION || "v23.0";
const endpoint = new URL(`https://graph.facebook.com/${graphVersion}/${userId}/media`);
endpoint.searchParams.set(
  "fields",
  "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp"
);
endpoint.searchParams.set("limit", String(postLimit));
endpoint.searchParams.set("access_token", accessToken);

async function fetchPosts(url) {
  const response = await fetch(url.toString());
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Instagram Graph API error (${response.status}): ${body}`);
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

async function main() {
  const posts = await fetchPosts(endpoint);
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
