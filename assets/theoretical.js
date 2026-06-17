const container = document.getElementById("theoryContainer");

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
  return `
    <div class="theory-block">
      <${block.headingLevel || "h3"}>${escapeHtml(block.title)}</${block.headingLevel || "h3"}>
      <div class="theory-body">
        ${renderParagraphs(block.paragraphs || [])}
        ${renderFormulaCards(block.formulas || [])}
        ${renderList(block.list || [])}
        ${renderParagraphs(block.paragraphsAfter || [])}
      </div>
    </div>`;
}

async function initTheory() {
  try {
    const response = await fetch("data/theoretical_questions.json");
    if (!response.ok) throw new Error(`Could not load theoretical_questions.json (${response.status})`);
    const data = await response.json();
    container.innerHTML = data.blocks.map(renderBlock).join("");
  } catch (error) {
    container.innerHTML = `<div class="feedback show"><b>Data loading failed.</b> Start a local server from this folder, then open the site through that server.</div>`;
    console.error(error);
  }
}

initTheory();
