const grid = document.querySelector("#gallery-grid");
const template = document.querySelector("#gallery-card-template");
const year = document.querySelector("#year");

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

function mountEmptyState() {
  const item = document.createElement("div");
  item.className = "empty-state";
  item.textContent = "Gallery is being updated. Check back soon for Sasha's latest campaign work.";
  grid.appendChild(item);
}

function renderGallery(posts = []) {
  if (!Array.isArray(posts) || posts.length === 0) {
    mountEmptyState();
    return;
  }

  posts.forEach((post) => {
    if (!post.permalink || !post.mediaUrl) return;

    const fragment = template.content.cloneNode(true);
    const link = fragment.querySelector(".gallery-link");
    const image = fragment.querySelector(".gallery-image");
    const date = fragment.querySelector(".gallery-date");

    link.href = post.permalink;
    image.src = post.mediaUrl;
    image.alt = post.caption ? post.caption.slice(0, 120) : "Sasha Quinn Wilson Instagram post";
    date.textContent = formatDate(post.timestamp);

    grid.appendChild(fragment);
  });

  if (!grid.children.length) mountEmptyState();
}

async function loadInstagramData() {
  try {
    const response = await fetch("./content/posts.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Unable to load posts");
    const data = await response.json();
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
