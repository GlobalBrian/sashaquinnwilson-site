import { mkdir, writeFile } from "node:fs/promises";
import { extname, resolve } from "node:path";

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
  const hydratedPosts = await mirrorMediaLocally(posts);
  const out = {
    updatedAt: new Date().toISOString(),
    source: "instagram_graph_api",
    posts: hydratedPosts
  };

  const outputDir = resolve(process.cwd(), "content");
  await mkdir(outputDir, { recursive: true });
  await writeFile(resolve(outputDir, "posts.json"), `${JSON.stringify(out, null, 2)}\n`, "utf8");

  console.log(`Saved ${posts.length} posts to content/posts.json`);
}

function pickExtension(contentType, originalUrl) {
  if (contentType?.includes("image/jpeg")) return ".jpg";
  if (contentType?.includes("image/png")) return ".png";
  if (contentType?.includes("image/webp")) return ".webp";

  const parsed = new URL(originalUrl);
  const pathExt = extname(parsed.pathname);
  if (pathExt) return pathExt;
  return ".jpg";
}

async function mirrorMediaLocally(posts) {
  const mediaDir = resolve(process.cwd(), "content", "ig");
  await mkdir(mediaDir, { recursive: true });

  const mirrored = await Promise.all(
    posts.map(async (post) => {
      if (!post.mediaUrl) return post;

      try {
        const response = await fetch(post.mediaUrl);
        if (!response.ok) return post;

        const contentType = response.headers.get("content-type") || "";
        const fileExt = pickExtension(contentType, post.mediaUrl);
        const fileName = `${post.id}${fileExt}`;
        const filePath = resolve(mediaDir, fileName);
        const buffer = Buffer.from(await response.arrayBuffer());
        await writeFile(filePath, buffer);

        return {
          ...post,
          mediaUrl: `./content/ig/${fileName}`
        };
      } catch {
        return post;
      }
    })
  );

  return mirrored;
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
