// ===========================
// App State & Configuration
// ===========================
const APP_CONFIG = {
  STORAGE_KEY_ANSWERS: "sgq.v1.answers",
  STORAGE_KEY_META: "sgq.v1.meta",
  QUESTIONS_PER_PAGE: 14, // 133 / 14 ≈ 9.5, so we'll have 10 pages
  TOTAL_QUESTIONS: 133,
  TOTAL_GIFTS: 19,
  MAX_SCORE_PER_GIFT: 21, // 7 questions × 3 max points
};

let state = {
  questions: [],
  gifts: [],
  answers: new Array(APP_CONFIG.TOTAL_QUESTIONS).fill(null),
  currentPage: 1,
  totalPages: 0,
};

// ===========================
// Utility Functions
// ===========================
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function showNotification(message, type = "info") {
  // Simple notification - could be enhanced with a toast library
  console.log(`[${type.toUpperCase()}] ${message}`);
}

// ===========================
// LocalStorage Management
// ===========================
function loadFromStorage() {
  try {
    const savedAnswers = localStorage.getItem(APP_CONFIG.STORAGE_KEY_ANSWERS);
    if (savedAnswers) {
      state.answers = JSON.parse(savedAnswers);
      return true;
    }
  } catch (error) {
    console.error("Error loading from storage:", error);
    showNotification("Nu s-au putut încărca datele salvate", "warning");
  }
  return false;
}

function saveToStorage() {
  try {
    localStorage.setItem(
      APP_CONFIG.STORAGE_KEY_ANSWERS,
      JSON.stringify(state.answers)
    );
    localStorage.setItem(
      APP_CONFIG.STORAGE_KEY_META,
      JSON.stringify({
        updatedAt: new Date().toISOString(),
        version: "1",
      })
    );
  } catch (error) {
    console.error("Error saving to storage:", error);
    showNotification("Nu s-au putut salva datele", "error");
  }
}

const debouncedSave = debounce(saveToStorage, 500);

function clearStorage() {
  if (
    confirm(
      "Sigur dorești să ștergi toate răspunsurile? Această acțiune nu poate fi anulată."
    )
  ) {
    localStorage.removeItem(APP_CONFIG.STORAGE_KEY_ANSWERS);
    localStorage.removeItem(APP_CONFIG.STORAGE_KEY_META);
    state.answers = new Array(APP_CONFIG.TOTAL_QUESTIONS).fill(null);
    showNotification("Datele au fost șterse cu succes", "success");
    navigateTo("/");
  }
}

// ===========================
// Data Loading
// ===========================
async function loadData() {
  try {
    const [questionsRes, giftsRes] = await Promise.all([
      fetch("data/intrebari.json"),
      fetch("data/daruri.json"),
    ]);

    state.questions = await questionsRes.json();
    state.gifts = await giftsRes.json();

    state.totalPages = Math.ceil(
      APP_CONFIG.TOTAL_QUESTIONS / APP_CONFIG.QUESTIONS_PER_PAGE
    );

    return true;
  } catch (error) {
    console.error("Error loading data:", error);
    showNotification("Eroare la încărcarea datelor", "error");
    return false;
  }
}

// ===========================
// Router
// ===========================
function getRoute() {
  const hash = window.location.hash.slice(1) || "/";
  return hash;
}

function navigateTo(route) {
  window.location.hash = route;
}

function router() {
  const route = getRoute();
  const mainContent = document.getElementById("mainContent");

  // Close menu if open
  document.getElementById("sideMenu").classList.remove("active");
  document.getElementById("overlay").classList.remove("active");

  // Update active nav links
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${route}`) {
      link.classList.add("active");
    }
  });

  // Route handling
  if (route === "/" || route === "") {
    renderHome();
  } else if (route === "/quiz") {
    renderQuiz();
  } else if (route.startsWith("/quiz/")) {
    const page = parseInt(route.split("/")[2]) || 1;
    state.currentPage = Math.max(1, Math.min(page, state.totalPages));
    renderQuiz();
  } else if (route === "/results") {
    renderResults();
  } else if (route === "/gifts") {
    renderGifts();
  } else {
    renderHome();
  }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: "auto" });
}

// ===========================
// Progress Bar
// ===========================
function updateProgressBar() {
  const progressContainer = document.getElementById("progressContainer");
  const progressFill = document.getElementById("progressFill");
  const progressText = document.getElementById("progressText");
  const progressPercent = document.getElementById("progressPercent");

  const route = getRoute();

  if (route.startsWith("/quiz")) {
    progressContainer.classList.remove("hidden");

    const answeredCount = state.answers.filter((a) => a !== null).length;
    const percentage = Math.round(
      (answeredCount / APP_CONFIG.TOTAL_QUESTIONS) * 100
    );

    progressFill.style.width = `${percentage}%`;
    progressText.textContent = `${answeredCount} / ${APP_CONFIG.TOTAL_QUESTIONS}`;
    progressPercent.textContent = `${percentage}%`;
  } else {
    progressContainer.classList.add("hidden");
  }
}

// ===========================
// Home Page
// ===========================
function renderHome() {
  const mainContent = document.getElementById("mainContent");
  const template = document.getElementById("homeTemplate");
  mainContent.innerHTML = template.innerHTML;

  // Update button text based on progress
  const answeredCount = state.answers.filter((a) => a !== null).length;
  const startBtn = document.getElementById("startQuizBtn");
  const btnText = document.getElementById("startBtnText");

  if (answeredCount > 0) {
    btnText.textContent = `Continuă Chestionarul (${answeredCount}/133)`;
  } else {
    btnText.textContent = "Începe Chestionarul";
  }

  startBtn.addEventListener("click", () => {
    navigateTo("/quiz/1");
  });

  updateProgressBar();
}

// ===========================
// Quiz Page
// ===========================
// Motivational messages for quiz
const motivationalMessages = [
  "Fii sincer cu tine însuți",
  "Descoperă cum te-a înzestrat Dumnezeu",
  "Răspunde din inimă, nu din minte",
  "Fiecare răspuns te apropie de descoperire",
  "Gândește-te la experiențele tale personale",
  "Nu există răspunsuri greșite sau corecte",
  "Reflectează asupra modului în care te simți natural",
  "Sinceritatea te va ajuta mult!",
  "Ia-ți timp să reflectezi la fiecare afirmație",
  "Ești unic și special înzestrat - fiecare suntem!",
];

function getRandomMotivation() {
  return motivationalMessages[
    Math.floor(Math.random() * motivationalMessages.length)
  ];
}

function renderQuiz() {
  const mainContent = document.getElementById("mainContent");
  const template = document.getElementById("quizTemplate");
  mainContent.innerHTML = template.innerHTML;

  // Update page numbers
  document.getElementById("currentPage").textContent = state.currentPage;
  document.getElementById("totalPages").textContent = state.totalPages;

  // Update motivational message
  const motivationEl = document.getElementById("quizMotivation");
  if (motivationEl) {
    motivationEl.textContent = getRandomMotivation();
  }

  // Render questions for current page
  renderQuestions();

  // Setup navigation
  setupQuizNavigation();

  // Render page dots
  renderPageDots();

  updateProgressBar();
}

function renderQuestions() {
  const container = document.getElementById("questionsContainer");
  const template = document.getElementById("questionTemplate");
  const startIndex = (state.currentPage - 1) * APP_CONFIG.QUESTIONS_PER_PAGE;
  const endIndex = Math.min(
    startIndex + APP_CONFIG.QUESTIONS_PER_PAGE,
    APP_CONFIG.TOTAL_QUESTIONS
  );

  container.innerHTML = "";

  for (let i = startIndex; i < endIndex; i++) {
    const question = state.questions[i];
    if (!question) continue;

    let html = template.innerHTML;
    html = html.replace(/{number}/g, question.nr);
    html = html.replace(/{text}/g, question.intrebare);

    const questionDiv = document.createElement("div");
    questionDiv.innerHTML = html;
    const questionCard = questionDiv.firstElementChild;

    // Check if already answered
    if (state.answers[i] !== null) {
      questionCard.classList.add("answered");
    }

    // Set saved answer if exists
    const savedAnswer = state.answers[i];
    if (savedAnswer !== null) {
      const radio = questionCard.querySelector(`input[value="${savedAnswer}"]`);
      if (radio) radio.checked = true;
    }

    // Add change listeners
    const radios = questionCard.querySelectorAll('input[type="radio"]');
    radios.forEach((radio) => {
      radio.addEventListener("change", (e) => {
        state.answers[i] = parseInt(e.target.value);
        questionCard.classList.add("answered");
        debouncedSave();
        updateProgressBar();

        // Add subtle animation
        questionCard.style.transform = "scale(0.98)";
        setTimeout(() => {
          questionCard.style.transform = "scale(1)";
        }, 150);
      });
    });

    container.appendChild(questionCard);
  }
}

function setupQuizNavigation() {
  const prevBtn = document.getElementById("prevPageBtn");
  const nextBtn = document.getElementById("nextPageBtn");

  // Update button states
  prevBtn.disabled = state.currentPage === 1;
  nextBtn.textContent =
    state.currentPage === state.totalPages ? "Finalizează" : "Înainte";

  // Remove old listeners by cloning
  const newPrevBtn = prevBtn.cloneNode(true);
  const newNextBtn = nextBtn.cloneNode(true);
  prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
  nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);

  // Add new listeners
  newPrevBtn.addEventListener("click", () => {
    if (state.currentPage > 1) {
      navigateTo(`/quiz/${state.currentPage - 1}`);
    }
  });

  newNextBtn.addEventListener("click", () => {
    if (state.currentPage < state.totalPages) {
      navigateTo(`/quiz/${state.currentPage + 1}`);
    } else {
      // Go to results
      navigateTo("/results");
    }
  });
}

function renderPageDots() {
  const container = document.getElementById("pageDots");
  container.innerHTML = "";

  for (let i = 1; i <= state.totalPages; i++) {
    const dot = document.createElement("div");
    dot.className = `page-dot ${i === state.currentPage ? "active" : ""}`;
    dot.addEventListener("click", () => {
      navigateTo(`/quiz/${i}`);
    });
    container.appendChild(dot);
  }
}

// ===========================
// Results Page
// ===========================
function renderResults() {
  const mainContent = document.getElementById("mainContent");
  const template = document.getElementById("resultsTemplate");
  mainContent.innerHTML = template.innerHTML;

  // Calculate scores
  const scores = calculateScores();

  // Check completion
  const answeredCount = state.answers.filter((a) => a !== null).length;
  if (answeredCount < APP_CONFIG.TOTAL_QUESTIONS) {
    const warningCard = document.getElementById("completionWarning");
    warningCard.classList.remove("hidden");
    document.getElementById("answeredCount").textContent = answeredCount;
  }

  // Render top gifts
  renderTopGifts(scores);

  // Render results table
  renderResultsTable(scores);

  // Setup actions
  document.getElementById("printBtn").addEventListener("click", () => {
    // Add current date/time to print
    const now = new Date();
    const dateStr = now.toLocaleDateString("ro-RO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const timeStr = now.toLocaleTimeString("ro-RO", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const printDate = document.getElementById("printDate");
    printDate.innerHTML = `
            <strong>Raport generat:</strong> ${dateStr} la ora ${timeStr}
        `;

    // Add dynamic links
    const baseUrl =
      window.location.origin +
      window.location.pathname.replace("/index.html", "");
    const appUrl = baseUrl + (baseUrl.endsWith("/") ? "" : "/") + "#/";
    const giftsUrl = baseUrl + (baseUrl.endsWith("/") ? "" : "/") + "#/gifts";

    const printLinks = document.getElementById("printLinks");
    printLinks.innerHTML = `
            <div class="print-link-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
                <div>
                    <span class="print-link-label">Aplicația:</span>
                    <span class="print-link-url">${appUrl}</span>
                </div>
            </div>
            <div class="print-link-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <div>
                    <span class="print-link-label">Citește mai multe:</span>
                    <span class="print-link-url">${giftsUrl}</span>
                </div>
            </div>
        `;

    // Trigger print
    window.print();
  });

  document.getElementById("viewGiftsBtn").addEventListener("click", () => {
    navigateTo("/gifts");
  });

  updateProgressBar();
}

function calculateScores() {
  const scores = {};

  // Initialize scores for all gifts
  state.gifts.forEach((gift) => {
    scores[gift.cod_dar] = {
      code: gift.cod_dar,
      name: gift.nume,
      description: gift.descriere,
      score: 0,
      max: APP_CONFIG.MAX_SCORE_PER_GIFT,
    };
  });

  // Calculate scores from answers
  state.questions.forEach((question, index) => {
    const answer = state.answers[index];
    if (answer !== null && scores[question.cod_dar]) {
      scores[question.cod_dar].score += answer;
    }
  });

  return scores;
}

function renderTopGifts(scores) {
  const container = document.getElementById("topGiftsContainer");
  container.innerHTML = "";

  // Sort by score
  const sortedGifts = Object.values(scores).sort((a, b) => b.score - a.score);

  // Find max score
  const maxScore = sortedGifts[0].score;

  // Get all gifts with max score (handle ties)
  const topGifts = sortedGifts.filter((g) => g.score === maxScore);

  topGifts.forEach((gift, index) => {
    const card = document.createElement("div");
    card.className = "top-gift-card";
    card.style.animationDelay = `${index * 0.1}s`;

    card.innerHTML = `
            <div class="top-gift-header">
                <span class="top-gift-badge">${
                  topGifts.length > 1
                    ? `Top ${index + 1}`
                    : "Darul Tău Dominant"
                }</span>
                <span class="top-gift-score">${gift.score} / ${gift.max}</span>
            </div>
            <h2 class="top-gift-name">${gift.name}</h2>
            <p class="top-gift-description">${gift.description}</p>
        `;

    container.appendChild(card);
  });
}

function renderResultsTable(scores) {
  const tbody = document.getElementById("resultsTableBody");
  tbody.innerHTML = "";

  // Sort by score descending
  const sortedGifts = Object.values(scores).sort((a, b) => b.score - a.score);
  const maxScore = sortedGifts[0].score;

  sortedGifts.forEach((gift) => {
    const row = document.createElement("tr");
    if (gift.score === maxScore) {
      row.classList.add("highlight");
    }

    row.innerHTML = `
            <td class="code-cell">${gift.code.toUpperCase()}</td>
            <td>${gift.name}</td>
            <td class="score-cell">${gift.score}</td>
            <td class="text-tertiary">${gift.max}</td>
        `;

    tbody.appendChild(row);
  });
}

// ===========================
// Gifts Page
// ===========================
function renderGifts() {
  const mainContent = document.getElementById("mainContent");
  const template = document.getElementById("giftsTemplate");
  mainContent.innerHTML = template.innerHTML;

  const container = document.getElementById("giftsContainer");
  const cardTemplate = document.getElementById("giftCardTemplate");

  state.gifts.forEach((gift, index) => {
    let html = cardTemplate.innerHTML;
    html = html.replace(/{code}/g, gift.cod_dar.toUpperCase());
    html = html.replace(/{name}/g, gift.nume);
    html = html.replace(/{description}/g, gift.descriere);

    const cardDiv = document.createElement("div");
    cardDiv.innerHTML = html;
    const card = cardDiv.firstElementChild;
    card.style.animationDelay = `${index * 0.05}s`;

    container.appendChild(card);
  });

  updateProgressBar();
}

// ===========================
// Menu Handlers
// ===========================
function setupMenu() {
  const menuBtn = document.getElementById("menuBtn");
  const closeBtn = document.getElementById("closeMenu");
  const sideMenu = document.getElementById("sideMenu");
  const overlay = document.getElementById("overlay");

  menuBtn.addEventListener("click", () => {
    sideMenu.classList.add("active");
    overlay.classList.add("active");
  });

  closeBtn.addEventListener("click", () => {
    sideMenu.classList.remove("active");
    overlay.classList.remove("active");
  });

  overlay.addEventListener("click", () => {
    sideMenu.classList.remove("active");
    overlay.classList.remove("active");
  });

  // Close menu on navigation
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      sideMenu.classList.remove("active");
      overlay.classList.remove("active");
    });
  });

  // Reset button
  document.getElementById("resetBtn").addEventListener("click", clearStorage);
}

// ===========================
// Initialization
// ===========================
async function init() {
  // Load data
  const dataLoaded = await loadData();
  if (!dataLoaded) {
    document.getElementById("mainContent").innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <h2>Eroare la încărcarea datelor</h2>
                <p>Te rugăm să reîncarci pagina.</p>
                <button onclick="location.reload()" class="btn btn-primary" style="margin-top: 1rem;">
                    Reîncarcă Pagina
                </button>
            </div>
        `;
    return;
  }

  // Load saved data
  loadFromStorage();

  // Setup menu
  setupMenu();

  // Setup router
  window.addEventListener("hashchange", router);

  // Initial route
  router();

  // Setup Back to Top button
  setupBackToTop();
}

// ===========================
// Back to Top Button
// ===========================
function setupBackToTop() {
  const backToTopBtn = document.getElementById("backToTop");

  if (!backToTopBtn) return;

  // Show/hide button based on scroll position and current route
  function updateBackToTopVisibility() {
    const currentRoute = window.location.hash || "#/";
    const isQuizPage = currentRoute.startsWith("#/quiz");

    // Hide on quiz page, show on other pages when scrolled
    if (isQuizPage || window.scrollY <= 300) {
      backToTopBtn.classList.remove("visible");
    } else {
      backToTopBtn.classList.add("visible");
    }
  }

  window.addEventListener("scroll", updateBackToTopVisibility);
  window.addEventListener("hashchange", updateBackToTopVisibility);

  // Scroll to top when clicked
  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// Start the app
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
