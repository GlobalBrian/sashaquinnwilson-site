const grid = document.querySelector("#gallery-grid");
const template = document.querySelector("#gallery-card-template");
const year = document.querySelector("#year");
const tagCloud = document.querySelector("#tag-cloud");

year.textContent = new Date().getFullYear();

function formatDate(dateString) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "Recent";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

function cleanCaption(caption = "") {
  return caption.replace(/#[\w_]+/g, "").replace(/\s+/g, " ").trim();
}

function collectTopTags(posts = []) {
  const counts = new Map();
  posts.forEach((post) => {
    const matches = (post.caption || "").match(/#[\w_]+/g) || [];
    matches.forEach((tag) => {
      const key = tag.toLowerCase();
      counts.set(key, (counts.get(key) || 0) + 1);
    });
  });

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([tag]) => tag);
}

function renderTagCloud(posts = []) {
  const tags = collectTopTags(posts);
  if (!tags.length) {
    tagCloud.innerHTML = "";
    return;
  }

  tags.forEach((tag) => {
    const item = document.createElement("span");
    item.className = "tag";
    item.textContent = tag;
    tagCloud.appendChild(item);
  });
}

function mountEmptyState() {
  const item = document.createElement("div");
  item.className = "empty-state";
  item.textContent = "Gallery is being updated. Check back soon for Sasha's latest campaign work.";
  grid.appendChild(item);
}

function getCardVariant(index) {
  if (index % 7 === 3) return "wide";
  if (index % 5 === 2) return "tall";
  return "";
}

function getToneClass(post = {}) {
  const text = `${post.caption || ""}`.toLowerCase();
  if (/red|editorial|fashion|portrait|glam/.test(text)) return "tone-editorial";
  if (/disney|fun|happy|party|balloon|color/.test(text)) return "tone-pop";
  return "tone-minimal";
}

function renderGallery(posts = []) {
  if (!Array.isArray(posts) || posts.length === 0) {
    mountEmptyState();
    return;
  }

  posts.forEach((post, index) => {
    if (!post.permalink || !post.mediaUrl) return;

    const fragment = template.content.cloneNode(true);
    const card = fragment.querySelector(".gallery-card");
    const link = fragment.querySelector(".gallery-link");
    const image = fragment.querySelector(".gallery-image");
    const date = fragment.querySelector(".gallery-date");
    const caption = fragment.querySelector(".gallery-caption");

    const variant = getCardVariant(index);
    if (variant) card.classList.add(variant);
    card.classList.add(getToneClass(post));

    link.href = post.permalink;
    image.src = post.mediaUrl;
    image.alt = post.caption ? post.caption.slice(0, 120) : "Sasha Quinn Wilson Instagram post";
    date.textContent = formatDate(post.timestamp);
    caption.textContent = cleanCaption(post.caption) || "Tap to view the full post on Instagram.";

    grid.appendChild(fragment);
  });

  if (!grid.children.length) mountEmptyState();
}

async function loadInstagramData() {
  try {
    const response = await fetch("./content/posts.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Unable to load posts");
    const data = await response.json();
    renderTagCloud(data.posts || []);
    renderGallery(data.posts);
  } catch (error) {
    mountEmptyState();
    console.error(error);
  }
}

function setupReveal() {
  const targets = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  targets.forEach((el) => observer.observe(el));
}

setupReveal();
loadInstagramData();
