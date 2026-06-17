const container = document.getElementById("theoryContainer");
const titleEl = document.getElementById("theoryTitle");
const subtitleEl = document.getElementById("theorySubtitle");
const languageToggle = document.getElementById("languageToggle");

let theoryData = null;
let currentLanguage = "fr";

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderParagraphs(paragraphs) {
  return paragraphs.map(text => `<p>${text}</p>`).join("");
}

function renderFormulaCards(cards) {
  if (!cards || !cards.length) return "";
  return `
    <div class="formula-grid">
      ${cards.map(card => `
        <div class="formula-card">
          <b>${escapeHtml(card.title)}</b>
          ${card.value}
        </div>`).join("")}
    </div>`;
}

function renderList(items) {
  if (!items || !items.length) return "";
  return `
    <ul class="answer-list">
      ${items.map(item => `<li>${item}</li>`).join("")}
    </ul>`;
}

function renderBlock(block) {
  const heading = block.headingLevel || "h3";
  return `
    <div class="theory-block">
      <${heading}>${escapeHtml(block.title)}</${heading}>
      <div class="theory-body">
        ${renderParagraphs(block.paragraphs || [])}
        ${renderFormulaCards(block.formulas || [])}
        ${renderList(block.list || [])}
        ${renderParagraphs(block.paragraphsAfter || [])}
      </div>
    </div>`;
}

function renderLanguage(language) {
  const content = theoryData.languages[language];
  currentLanguage = language;
  document.documentElement.lang = language;
  titleEl.textContent = content.pageTitle;
  subtitleEl.textContent = content.subtitle;
  languageToggle.textContent = content.toggleLabel;
  container.innerHTML = content.blocks.map(renderBlock).join("");
}

function toggleLanguage() {
  renderLanguage(currentLanguage === "fr" ? "en" : "fr");
}

async function initTheory() {
  try {
    const response = await fetch("data/theoretical_questions.json");
    if (!response.ok) throw new Error(`Could not load theoretical_questions.json (${response.status})`);
    theoryData = await response.json();
    renderLanguage(theoryData.defaultLanguage || "fr");
  } catch (error) {
    container.innerHTML = `<div class="feedback show"><b>Data loading failed.</b> Start a local server from this folder, then open the site through that server.</div>`;
    console.error(error);
  }
}

languageToggle.addEventListener("click", toggleLanguage);
initTheory();
