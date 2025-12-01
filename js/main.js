// Category images
const categoryImages = {
  "campus-center": "img/CC_380.jpg",
  "dining": "img/dining.jfif",
  "housing": "img/housing.jfif",
  "academic": "img/academic.jfif",
  "student-services": "img/services.jfif",
};
const imgFor = (svc) => categoryImages[svc.category] || "img/placeholder.jpg";

// Services data 
const services = [

  // Campus Center
  { 
    id: "cc-info-desk", name: "Campus Center Information Desk", category: "campus-center",
    description: "General info, directions, and event support.",
    location: "Campus Center, Ground Floor", hours: "Mon–Fri 8:30am–4:30pm" 
  },
  { 
    id: "cc-starbucks", name: "Starbucks (Campus Center)", category: "campus-center",
    description: "Coffee, tea, and quick snacks.",
    location: "Campus Center", hours: "Mon–Fri 8am–9:00pm, Sat–Sun 10:00am–8:00pm" 
  },
  { 
    id: "cc-acadamiens-bookstore", name: "AcaDamien's Bookstore", category: "campus-center",
    description: "Textbooks, merch, and supplies.",
    location: "Campus Center", hours: "Mon–Thurs 10:00am–6:00pm, Sat 10:00am-5:00pm" 
  },
  { 
    id: "cc-jamals", name: "Jamal's", category: "campus-center",
    description: "Grab and go chicken based sandwiches and sides.",
    location: "Campus Center", hours: "Mon–Fri 8am–9:00pm, Sat–Sun 10:00am–8:00pm" 
  },


  // Dining Halls
  { 
    id: "cc-food-court", name: "Campus Center Food Court", category: "dining",
    description: "Multiple dining options for students.",
    location: "Campus Center, Lower Level", hours: "Daily 7:30am–11:00pm" },

  { 
    id: "dining-indian", name: "Indian Dining Hall", category: "dining",
    description: "Dining hall on Indian Quad.",
    location: "Indian Quad", hours: "Daily 7:30am–11:00pm" },

  { 
    id: "dining-state", name: "State Dining Hall", category: "dining",
    description: "Dining hall on State Quad.",
    location: "State Quad", hours: "Daily 7:30am–11:00pm" 
  },


  // Academic
  { 
    id: "academic-advising", name: "Academic Advising", category: "academic",
    description: "Help with course planning and scheduling.",
    location: "Lecture Center, Suite 30", hours: "Mon–Fri 9am–5pm" 
  },
  { 
    id: "academic-bio", name: "Biological Sciences (BIO)", category: "academic",
    description: "Department offices and student resources for biology based classes.",
    location: "Academic Podium", hours: "Mon-Fri" 
  },
  { 
    id: "academic-social-sciences", name: "Social Sciences", category: "academic",
    description: "Department resources and advising info for social science classes.",
    location: "Social Sciences Building", hours: "Mon–Fri" 
  },
  { 
    id: "university-library", name: "University Library", category: "academic",
    description: "Study spaces, research help, printing.",
    location: "University Library", hours: "See Ualbany site" 
  },


  // Housing Services
  { 
    id: "housing-empire-commons", name: "Empire Commons", category: "housing",
    description: "Apartment-style student housing.",
    location: "Empire Commons", hours: "Mon–Fri 12pm–12am" 
  },
  { 
    id: "housing-state-quad", name: "State Quad (Residence Halls)", category: "housing",
    description: "Traditional residence halls and services.",
    location: "State Quad", hours: "Office hours vary" 
  },

  // Student Services
  { 
    id: "student-health", name: "Student Health Services", category: "student-services",
    description: "Primary care, physical therapy, and wellness.",
    location: "Health Center", hours: "Mon–Fri 8am–3:30pm" 
  },
  { 
    id: "student-sefcu-arena", name: "SEFCU Arena/Campus Recreational", category: "student-services",
    description: "Fitness center, recreation, and events.",
    location: "Athletics Center", hours: "Mon–Fri 7am–10pm" 
  },
];

// Storage helpers
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));
const lsGet = (k, f) => { 
  try { return JSON.parse(localStorage.getItem(k)) ?? f; } catch { return f; } 
};
const lsSet = (k, v) => localStorage.setItem(k, JSON.stringify(v));

const loadReviews = (id) => lsGet(`reviews:${id}`, []);
const saveReview = (id, r) => { const a = loadReviews(id); a.push(r); lsSet(`reviews:${id}`, a); };
const averageRating = (id) => {
  const a = loadReviews(id); if (!a.length) return 0;
  return a.reduce((s, r) => s + (+r.rating || 0), 0) / a.length;
};
const formatStars = (n) =>
  "★★★★★".slice(0, Math.round(n)) + "☆☆☆☆☆".slice(0, 5 - Math.round(n));

// DOM refs 
const servicesList = $("#servicesList");
const searchInput = $("#searchInput");
const categoryFilter = $("#categoryFilter");

const detail = $("#serviceDetail");
const detailClose = $("#detailClose");
const detailName = $("#detailName");
const detailAvg = $("#detailAvg");
const detailDesc = $("#detailDesc");
const detailMeta = $("#detailMeta");
const reviewsList = $("#reviewsList");
const reviewForm = $("#reviewForm");
const ratingInput = $("#rating");
const starWidget = $("#starWidget");
const formMsg = $("#formMsg");
const detailBanner = $("#detailBanner");

// Renders lists of services
function displayServices() {
  if (!servicesList) return; // non-list pages
  const text = (searchInput?.value || "").toLowerCase();
  const cat = categoryFilter?.value || "all";

  servicesList.innerHTML = "";
  services
    .filter(s => s.name.toLowerCase().includes(text) && (cat === "all" || s.category === cat))
    .forEach(s => {
      const avg = averageRating(s.id);
      const card = document.createElement("article");
      card.className = "service-card";
      card.innerHTML = `
        <img class="thumb" src="${imgFor(s)}" alt="${s.category} category image" />
        <h3>${s.name}</h3>
        <div class="meta">Category: ${s.category}</div>
        <div class="avg">
          Average: ${avg.toFixed(1)} / 5
          <span class="review-stars" aria-hidden="true">${formatStars(avg)}</span>
        </div>
        <p>${s.description}</p>
        <button data-id="${s.id}">View details</button>
      `;
      card.querySelector("button").addEventListener("click", () => openDetail(s.id));
      servicesList.appendChild(card);
    });
}
searchInput?.addEventListener("input", displayServices);
categoryFilter?.addEventListener("change", displayServices);

//  Detaisl view 
let currentServiceId = null;

function openDetail(id) {
  if (!detail) return;
  currentServiceId = id;
  const svc = services.find(s => s.id === id);
  if (!svc) return;

  // set banner if it's present
  if (detailBanner) {
    detailBanner.src = imgFor(svc);
    detailBanner.alt = `${svc.category} banner image`;
  }

  detailName.textContent = svc.name;
  detailDesc.textContent = svc.description;
  detailMeta.textContent = [svc.location, svc.hours].filter(Boolean).join(" • ");
  updateDetailAverage();
  renderReviews();
  renderStarWidget();

  detail.classList.remove("hidden");
  detail.scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeDetail() {
  if (!detail) return;
  detail.classList.add("hidden");
  currentServiceId = null;
}
detailClose?.addEventListener("click", closeDetail);

function updateDetailAverage() {
  if (!detail || !currentServiceId) return;
  const avg = averageRating(currentServiceId);
  detailAvg.textContent = `${avg.toFixed(1)} / 5 ${formatStars(avg)}`;
}

function renderReviews() {
  if (!reviewsList || !currentServiceId) return;
  const arr = loadReviews(currentServiceId);
  reviewsList.innerHTML = "";
  if (!arr.length) {
    const li = document.createElement("li");
    li.textContent = "No reviews yet. Be the first to leave one!";
    reviewsList.appendChild(li);
    return;
  }
  arr.slice().reverse().forEach(r => {
    const li = document.createElement("li");
    li.className = "review-item";
    li.innerHTML = `
      <div class="review-head">
        <span class="review-author">${r.author || "Anonymous"}</span>
        <span class="review-date">${new Date(r.createdAt).toLocaleString()}</span>
      </div>
      <div class="review-stars" aria-label="Rating">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</div>
      <p class="review-body"></p>
    `;
    li.querySelector(".review-body").textContent = r.comment;
    reviewsList.appendChild(li);
  });
}

// Star widgets
function renderStarWidget() {
  if (!starWidget) return;
  starWidget.innerHTML = "";
  const current = +ratingInput.value || 0;
  for (let i = 1; i <= 5; i++) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = `star ${i <= current ? "filled" : ""}`;
    b.setAttribute("role", "radio");
    b.setAttribute("aria-checked", String(i === current));
    b.setAttribute("aria-label", `${i} star${i > 1 ? "s" : ""}`);
    b.textContent = i <= current ? "★" : "☆";
    b.addEventListener("mouseenter", () => hoverStars(i));
    b.addEventListener("mouseleave", () => hoverStars(current));
    b.addEventListener("click", () => selectStars(i));
    b.addEventListener("keydown", (e) => onStarKeydown(e, i));
    starWidget.appendChild(b);
  }
}
function hoverStars(n) { $$(".star").forEach((el, idx) => { const i = idx + 1; el.textContent = i <= n ? "★" : "☆"; el.classList.toggle("filled", i <= n); }); }
function selectStars(n) { ratingInput.value = String(n); renderStarWidget(); }
function onStarKeydown(e, i) {
  const k = e.key, cur = +ratingInput.value || 0;
  if (["ArrowLeft","ArrowDown"].includes(k)) { e.preventDefault(); selectStars(Math.max(1, cur - 1)); focusStar(+ratingInput.value); }
  else if (["ArrowRight","ArrowUp"].includes(k)) { e.preventDefault(); selectStars(Math.min(5, cur + 1)); focusStar(+ratingInput.value); }
  else if (k === "Home") { e.preventDefault(); selectStars(1); focusStar(1); }
  else if (k === "End") { e.preventDefault(); selectStars(5); focusStar(5); }
  else if (k === " " || k === "Enter") { e.preventDefault(); selectStars(i); }
}
function focusStar(n) { const s = $$(".star"); if (s[n - 1]) s[n - 1].focus(); }

// Submits the review 
reviewForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!currentServiceId) return;

  const author = $("#author").value.trim();
  const rating = +$("#rating").value;
  const comment = $("#comment").value.trim();

  if (!rating || rating < 1 || rating > 5) { formMsg.textContent = "Please select a rating (1–5)."; formMsg.style.color = "#b91c1c"; return; }
  if (!comment) { formMsg.textContent = "Please write a short comment."; formMsg.style.color = "#b91c1c"; return; }

  saveReview(currentServiceId, { author: author || "Anonymous", rating, comment, createdAt: new Date().toISOString() });

  $("#author").value = ""; $("#comment").value = ""; $("#rating").value = ""; renderStarWidget();
  formMsg.textContent = "Thanks! Your review was added."; formMsg.style.color = "#065f46";

  updateDetailAverage(); renderReviews(); displayServices();
});

try {
  const pref = sessionStorage.getItem("prefCategory");
  if (pref && categoryFilter) { categoryFilter.value = pref; sessionStorage.removeItem("prefCategory"); }
} catch (_) { /* ignore */ }

// Init
displayServices();