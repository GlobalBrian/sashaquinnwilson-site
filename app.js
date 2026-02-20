const grid = document.querySelector("#gallery-grid");
const template = document.querySelector("#gallery-card-template");
const tagCloud = document.querySelector("#tag-cloud");
const heroPhoto = document.querySelector("#hero-photo");
const heroPhotoFrame = document.querySelector("#hero-photo-frame");
const heroPhotoCaption = document.querySelector("#hero-photo-caption");
const langEnBtn = document.querySelector("#lang-en");
const langJaBtn = document.querySelector("#lang-ja");
const siteHeader = document.querySelector(".site-header");
const fallbackHeroSrc = "./content/hero-placeholder.jpg";
const fallbackGallerySrc = "./content/hero-placeholder.jpg";
const languageStorageKey = "sqw-language";

let currentPosts = [];
let currentLanguage = "en";

const translations = {
  en: {
    title: "Sasha Quinn Wilson | Official Portfolio",
    description:
      "Official portfolio for Sasha Quinn Wilson (Sassy) - model portfolio, featured collaborations, and latest campaign work.",
    strings: {
      navAbout: "プロフィール",
      navStyle: "スタイル",
      navPersonality: "人柄",
      navGallery: "Gallery",
      navContact: "Contact",
      heroKicker: "Official Model Portfolio",
      heroSubtitle: "aka Sassy",
      heroLead:
        "Big personality. Sharp camera instincts. Global-ready energy. Sasha brings playful edge and polished confidence to every frame.",
      heroCtaInstagram: "View Instagram",
      heroCtaWork: "See Latest Work",
      tone1: "スタジオミニマル",
      tone2: "Playful Pop",
      tone3: "エディトリアルレッド",
      spotGlobalTitle: "グローバル実績",
      spotGlobalCopy: "Campaign collaborations in Japan + international brand visibility.",
      spotFitTitle: "ブランド適性",
      spotFitCopy: "Lifestyle, fashion, family, sport, and character-led creative shoots.",
      spotSticker: "from day one",
      aboutTitle: "About Sasha",
      aboutCopy1:
        "Sasha Quinn Wilson is known for her expressive style, natural confidence, and vibrant personality. Family and followers call her <strong>Sassy</strong> for a reason.",
      aboutCopy2:
        "She has worked with brands in Japan and globally recognized names including Nike and Disney, building a portfolio that blends joy, individuality, and professional camera presence.",
      styleTitle: "Sassy Style DNA",
      dnaLabel1: "Expression",
      dnaTitle1: "Fearless Personality",
      dnaCopy1: "Strong facial storytelling with playful confidence and character.",
      dnaLabel2: "Movement",
      dnaTitle2: "Natural Posing",
      dnaCopy2: "Effortless transitions between editorial stills and energetic lifestyle moments.",
      dnaLabel3: "Presence",
      dnaTitle3: "Camera Magnetism",
      dnaCopy3: "A unique look that reads premium, modern, and memorable across campaigns.",
      looksTitle: "Signature Looks",
      lookTitle1: "Studio Minimal",
      lookCopy1: "Soft ivory and powder tones for premium catalog and clean-brand campaigns.",
      lookTitle2: "Playful Color Pop",
      lookCopy2: "Bright balloons, vivid sets, and joyful movement for energetic youth content.",
      lookTitle3: "Editorial Drama",
      lookCopy3: "High-contrast styling and expressive gaze for fashion-forward statement imagery.",
      personalityTitle: "Off Camera",
      personalityIntro:
        "Beyond modeling, Sasha brings bright energy, fearless confidence, and genuine joy into every room. Her personality makes her easy to direct, fun to work with, and naturally memorable on set.",
      hobbyTitle: "Hobbies",
      hobby1: "Dance practice",
      hobby2: "Learning new moves",
      hobby3: "Creative play",
      hobby4: "Performing for family",
      likesTitle: "Likes",
      like1: "Dancing",
      like2: "Sweets",
      like3: "Okra",
      like4: "Egg Lover",
      like5: "Making people laugh",
      like6: "Family time",
      like7: "Big brother adventures",
      notesTitle: "Personality Notes",
      note1: "Independent spirit",
      note2: "Social butterfly",
      note3: "Fearless energy",
      note4: "Prefers freedom over strict direction",
      note5: "Not a fan of toy cleanup time",
      galleryTitle: "Latest Instagram Lookbook",
      galleryNote: "Auto-refreshed from Instagram to keep Sasha's current work visible for new opportunities.",
      contactTitle: "Bookings & Collaborations",
      contactCopy: "For campaign inquiries, partnerships, and booking opportunities, contact the Wilson family team.",
      footerCopy: "© {{year}} Sasha Quinn Wilson. All rights reserved.",
      galleryCta: "View Post",
      galleryEmpty: "Gallery is being updated. Check back soon for Sasha's latest campaign work.",
      captionFallback: "Tap to view the full post on Instagram.",
      heroCaptionLatest: "Latest featured photo from Instagram",
      heroCaptionPreview: "Featured portrait preview",
      heroCaptionAddPlaceholder: "Add content/hero-placeholder.jpg to preview a featured portrait now.",
      heroCaptionNoData: "Featured portrait appears here once Instagram sync is active."
    }
  },
  ja: {
    title: "サーシャ・クイン・ウィルソン | 公式ポートフォリオ",
    description:
      "サーシャ・クイン・ウィルソン（Sassy）公式サイト。最新のモデル実績、ブランドコラボ、出演情報を掲載しています。",
    strings: {
      navAbout: "About",
      navStyle: "Style",
      navPersonality: "Personality",
      navGallery: "ギャラリー",
      navContact: "お問い合わせ",
      heroKicker: "Official Model Portfolio",
      heroSubtitle: "愛称：Sassy",
      heroLead:
        "豊かな表情、自然なカメラ感覚、そして世界観を瞬時に掴む対応力。サーシャは、遊び心と品のある存在感を一枚一枚に残します。",
      heroCtaInstagram: "Instagramを見る",
      heroCtaWork: "最新の出演を見る",
      tone1: "Studio Minimal",
      tone2: "プレイフルポップ",
      tone3: "Editorial Red",
      spotGlobalTitle: "Global Reach",
      spotGlobalCopy: "日本での案件を軸に、グローバルブランドとの実績も積み重ねています。",
      spotFitTitle: "Brand Fit",
      spotFitCopy: "ライフスタイル、ファッション、ファミリー、スポーツなど幅広い表現に対応できます。",
      spotSticker: "生まれた日からSassy",
      aboutTitle: "サーシャについて",
      aboutCopy1:
        "サーシャ・クイン・ウィルソンは、表情の豊かさと自然体の存在感が魅力のキッズモデル。家族やフォロワーから<strong>Sassy</strong>と呼ばれる、明るく印象に残るキャラクターです。",
      aboutCopy2:
        "日本でのブランド案件を中心に、Nike・Disneyなどグローバルブランドとの取り組みも経験。楽しさと洗練を両立したビジュアルで、着実に実績を広げています。",
      styleTitle: "Sassy Style DNA",
      dnaLabel1: "表現力",
      dnaTitle1: "ぶれない個性",
      dnaCopy1: "視線と表情だけで空気を変える、芯のある表現が得意です。",
      dnaLabel2: "動き",
      dnaTitle2: "自然なポージング",
      dnaCopy2: "エディトリアルの静けさから、ライフスタイルの動きまでスムーズに切り替えます。",
      dnaLabel3: "存在感",
      dnaTitle3: "カメラを惹きつける力",
      dnaCopy3: "一度見たら記憶に残るビジュアルを、安定して作れるのが強みです。",
      looksTitle: "シグネチャールック",
      lookTitle1: "スタジオミニマル",
      lookCopy1: "アイボリーや淡色トーンを活かした、上品でクリーンな世界観。",
      lookTitle2: "プレイフルポップ",
      lookCopy2: "鮮やかなカラーと明るい空気感で、キッズ案件と高い親和性を発揮。",
      lookTitle3: "エディトリアル",
      lookCopy3: "コントラストの効いたスタイリングで、ファッション性の高い表現に対応。",
      personalityTitle: "オフカメラ",
      personalityIntro:
        "撮影外でも、サーシャは周囲を明るくする存在。現場になじむ早さと、自然なコミュニケーション力も大きな魅力です。",
      hobbyTitle: "趣味",
      hobby1: "ダンス練習",
      hobby2: "新しいステップを覚えること",
      hobby3: "創作あそび",
      hobby4: "家族にダンスを見せること",
      likesTitle: "好きなこと",
      like1: "ダンス",
      like2: "スイーツ",
      like3: "オクラ",
      like4: "たまごが大好き",
      like5: "みんなを笑わせること",
      like6: "家族との時間",
      like7: "お兄ちゃんと遊ぶこと",
      notesTitle: "性格・特徴",
      note1: "自立心がある",
      note2: "社交的で人懐っこい",
      note3: "チャレンジを楽しめる",
      note4: "細かな指示より、自由度のある環境で力を発揮",
      note5: "おもちゃの片づけは少し苦手",
      galleryTitle: "最新Instagramルックブック",
      galleryNote: "Instagramの投稿を自動反映し、常に最新の出演実績を掲載しています。",
      contactTitle: "ご依頼・コラボレーション",
      contactCopy: "キャンペーン出演・タイアップ・撮影のご相談は、ご家族チームまでお気軽にご連絡ください。",
      footerCopy: "© {{year}} Sasha Quinn Wilson. All rights reserved.",
      galleryCta: "投稿を見る",
      galleryEmpty: "現在ギャラリーを更新中です。最新投稿はまもなく反映されます。",
      captionFallback: "Instagramで投稿を見る",
      heroCaptionLatest: "Instagram最新投稿からの注目カット",
      heroCaptionPreview: "注目ビジュアル（プレビュー）",
      heroCaptionAddPlaceholder: "Instagram未接続時は、設定したストック画像を表示しています。",
      heroCaptionNoData: "Instagram投稿が取得できないため、現在はストック画像を表示しています。"
    }
  }
};

const textTargets = {
  navAbout: "#nav-about",
  navStyle: "#nav-style",
  navPersonality: "#nav-personality",
  navGallery: "#nav-gallery",
  navContact: "#nav-contact",
  heroKicker: "#hero-kicker",
  heroSubtitle: "#hero-subtitle",
  heroLead: "#hero-lead",
  heroCtaInstagram: "#hero-cta-instagram",
  heroCtaWork: "#hero-cta-work",
  tone1: "#tone-1",
  tone2: "#tone-2",
  tone3: "#tone-3",
  spotGlobalTitle: "#spot-global-title",
  spotGlobalCopy: "#spot-global-copy",
  spotFitTitle: "#spot-fit-title",
  spotFitCopy: "#spot-fit-copy",
  spotSticker: "#spot-sticker",
  aboutTitle: "#about-title",
  aboutCopy1: "#about-copy-1",
  aboutCopy2: "#about-copy-2",
  styleTitle: "#style-title",
  dnaLabel1: "#dna-label-1",
  dnaTitle1: "#dna-title-1",
  dnaCopy1: "#dna-copy-1",
  dnaLabel2: "#dna-label-2",
  dnaTitle2: "#dna-title-2",
  dnaCopy2: "#dna-copy-2",
  dnaLabel3: "#dna-label-3",
  dnaTitle3: "#dna-title-3",
  dnaCopy3: "#dna-copy-3",
  looksTitle: "#looks-title",
  lookTitle1: "#look-title-1",
  lookCopy1: "#look-copy-1",
  lookTitle2: "#look-title-2",
  lookCopy2: "#look-copy-2",
  lookTitle3: "#look-title-3",
  lookCopy3: "#look-copy-3",
  personalityTitle: "#personality-title",
  personalityIntro: "#personality-intro",
  hobbyTitle: "#hobby-title",
  hobby1: "#hobby-1",
  hobby2: "#hobby-2",
  hobby3: "#hobby-3",
  hobby4: "#hobby-4",
  likesTitle: "#likes-title",
  like1: "#like-1",
  like2: "#like-2",
  like3: "#like-3",
  like4: "#like-4",
  like5: "#like-5",
  like6: "#like-6",
  like7: "#like-7",
  notesTitle: "#notes-title",
  note1: "#note-1",
  note2: "#note-2",
  note3: "#note-3",
  note4: "#note-4",
  note5: "#note-5",
  galleryTitle: "#gallery-title",
  galleryNote: "#gallery-note",
  contactTitle: "#contact-title",
  contactCopy: "#contact-copy",
  footerCopy: "#footer-copy"
};

function getStrings() {
  return translations[currentLanguage]?.strings || translations.en.strings;
}

function loadSavedLanguage() {
  try {
    const stored = localStorage.getItem(languageStorageKey);
    if (stored === "en" || stored === "ja") currentLanguage = stored;
  } catch (_) {
    currentLanguage = "en";
  }
}

function persistLanguage(languageCode) {
  try {
    localStorage.setItem(languageStorageKey, languageCode);
  } catch (_) {
    // Ignore storage failures (private mode / strict browser settings).
  }
}

function updateLanguageButtons() {
  if (!langEnBtn || !langJaBtn) return;
  langEnBtn.classList.toggle("is-active", currentLanguage === "en");
  langJaBtn.classList.toggle("is-active", currentLanguage === "ja");
}

function applyLanguageText() {
  const strings = getStrings();
  document.documentElement.lang = currentLanguage;
  document.title = translations[currentLanguage].title;

  const descriptionTag = document.querySelector('meta[name="description"]');
  if (descriptionTag) descriptionTag.setAttribute("content", translations[currentLanguage].description);

  Object.entries(textTargets).forEach(([key, selector]) => {
    const el = document.querySelector(selector);
    if (!el || typeof strings[key] === "undefined") return;

    if (key === "aboutCopy1") {
      el.innerHTML = strings[key];
    } else if (key === "footerCopy") {
      el.innerHTML = strings[key].replace("{{year}}", `<span id=\"year\">${new Date().getFullYear()}</span>`);
    } else {
      el.textContent = strings[key];
    }
  });

  updateLanguageButtons();
}

function formatDate(dateString) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return currentLanguage === "ja" ? "最近" : "Recent";
  return new Intl.DateTimeFormat(currentLanguage === "ja" ? "ja-JP" : "en-US", {
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
  tagCloud.innerHTML = "";
  const tags = collectTopTags(posts);
  if (!tags.length) return;

  tags.forEach((tag) => {
    const item = document.createElement("span");
    item.className = "tag";
    item.textContent = tag;
    tagCloud.appendChild(item);
  });
}

function mountEmptyState() {
  const strings = getStrings();
  const item = document.createElement("div");
  item.className = "empty-state";
  item.textContent = strings.galleryEmpty;
  grid.appendChild(item);
}

function getCardVariant(index) {
  if (index % 7 === 3) return "wide";
  if (index % 5 === 2) return "tall";
  return "";
}

function getToneClass(post = {}) {
  const text = `${post.caption || ""}`.toLowerCase();
  if (/red|editorial|fashion|portrait|glam|赤|モード/.test(text)) return "tone-editorial";
  if (/disney|fun|happy|party|balloon|color|ポップ|カラフル/.test(text)) return "tone-pop";
  return "tone-minimal";
}

function renderGallery(posts = []) {
  grid.innerHTML = "";
  const strings = getStrings();

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
    const cta = fragment.querySelector(".gallery-cta");
    const caption = fragment.querySelector(".gallery-caption");

    const variant = getCardVariant(index);
    if (variant) card.classList.add(variant);
    card.classList.add(getToneClass(post));

    link.href = post.permalink;
    image.src = post.mediaUrl;
    image.onerror = () => {
      image.onerror = () => {
        image.closest(".gallery-card")?.remove();
        if (!grid.children.length) mountEmptyState();
      };
      image.src = fallbackGallerySrc;
    };
    image.alt = post.caption ? post.caption.slice(0, 120) : "Sasha Quinn Wilson Instagram post";
    date.textContent = formatDate(post.timestamp);
    cta.textContent = strings.galleryCta;
    caption.textContent = cleanCaption(post.caption) || strings.captionFallback;

    grid.appendChild(fragment);
  });

  if (!grid.children.length) mountEmptyState();
}

function renderHeroPhoto(posts = []) {
  if (!heroPhoto || !heroPhotoFrame || !heroPhotoCaption) return;

  const strings = getStrings();
  const featured = Array.isArray(posts) ? posts.find((post) => post.mediaUrl) : null;
  if (!featured) {
    heroPhotoFrame.classList.add("is-empty");
    heroPhotoCaption.textContent = strings.heroCaptionAddPlaceholder;
    heroPhoto.onload = () => {
      heroPhotoFrame.classList.remove("is-empty");
      heroPhotoCaption.textContent = strings.heroCaptionPreview;
    };
    heroPhoto.onerror = () => {
      heroPhoto.removeAttribute("src");
      heroPhotoFrame.classList.add("is-empty");
      heroPhotoCaption.textContent = strings.heroCaptionNoData;
    };
    heroPhoto.src = fallbackHeroSrc;
    return;
  }

  heroPhoto.onload = () => {
    heroPhotoFrame.classList.remove("is-empty");
  };
  heroPhoto.onerror = () => {
    heroPhoto.onload = () => {
      heroPhotoFrame.classList.remove("is-empty");
      heroPhotoCaption.textContent = strings.heroCaptionNoData;
    };
    heroPhoto.onerror = () => {
      heroPhoto.removeAttribute("src");
      heroPhotoFrame.classList.add("is-empty");
      heroPhotoCaption.textContent = strings.heroCaptionNoData;
    };
    heroPhoto.src = fallbackHeroSrc;
  };
  heroPhotoCaption.textContent = cleanCaption(featured.caption) || strings.heroCaptionLatest;
  heroPhoto.src = featured.mediaUrl;
}

function rerenderLocalizedDynamicParts() {
  renderHeroPhoto(currentPosts);
  renderTagCloud(currentPosts);
  renderGallery(currentPosts);
}

function setLanguage(languageCode) {
  if (!["en", "ja"].includes(languageCode)) return;
  currentLanguage = languageCode;
  persistLanguage(currentLanguage);
  applyLanguageText();
  rerenderLocalizedDynamicParts();
}

function setupLanguageSwitch() {
  if (!langEnBtn || !langJaBtn) return;
  langEnBtn.addEventListener("click", () => setLanguage("en"));
  langJaBtn.addEventListener("click", () => setLanguage("ja"));
}

function getAnchorOffset(targetId) {
  const headerHeight = siteHeader ? siteHeader.getBoundingClientRect().height : 0;
  const stickyTopGap = 14;
  const baseOffset = Math.ceil(headerHeight + stickyTopGap);
  return targetId === "top" ? baseOffset + 8 : baseOffset;
}

function setupAnchorScrolling() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";

  anchorLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || href.length < 2) return;

      const id = href.slice(1);
      const target = document.getElementById(id);
      if (!target) return;

      event.preventDefault();
      const targetTop = target.getBoundingClientRect().top + window.scrollY;
      const offset = getAnchorOffset(id);
      window.scrollTo({ top: Math.max(targetTop - offset, 0), behavior });
      history.replaceState(null, "", `#${id}`);
    });
  });
}

async function loadInstagramData() {
  try {
    const response = await fetch("./content/posts.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Unable to load posts");
    const data = await response.json();
    currentPosts = data.posts || [];
    rerenderLocalizedDynamicParts();
  } catch (error) {
    currentPosts = [];
    rerenderLocalizedDynamicParts();
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

loadSavedLanguage();
applyLanguageText();
setupLanguageSwitch();
setupAnchorScrolling();
setupReveal();
loadInstagramData();
