const container = document.getElementById("theoryContainer");
const titleEl = document.getElementById("theoryTitle");
const subtitleEl = document.getElementById("theorySubtitle");
const languageToggle = document.getElementById("languageToggle");
const allMcqContainer = document.getElementById("allMcqContainer");
const mcqPracticeContainer = document.getElementById("mcqPracticeContainer");

const theoryTabButtons = [...document.querySelectorAll("[data-theory-tab]")];
const theoryPanels = {
  lesson: document.getElementById("lessonPanel"),
  mcq: document.getElementById("mcqPanel")
};

const mcqTabButtons = [...document.querySelectorAll("[data-mcq-tab]")];
const mcqPanels = {
  all: document.getElementById("allMcqPanel"),
  practice: document.getElementById("practiceMcqPanel")
};

let theoryData = null;
let mcqData = null;
let currentLanguage = "fr";
let currentTheoryTab = "lesson";
let practiceIndex = 0;
let practiceScore = 0;
let practiceChecked = false;

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
  languageToggle.innerHTML = `
    <span class="toggle-arrows" aria-hidden="true">↕</span>
    <span>${escapeHtml(content.toggleLabel)}</span>`;
  languageToggle.setAttribute("aria-label", content.toggleLabel);
  container.innerHTML = content.blocks.map(renderBlock).join("");
}

function toggleLanguage() {
  renderLanguage(currentLanguage === "fr" ? "en" : "fr");
}

function switchTheoryTab(tabName) {
  currentTheoryTab = tabName;
  theoryTabButtons.forEach(button => {
    button.classList.toggle("active", button.dataset.theoryTab === tabName);
  });
  Object.entries(theoryPanels).forEach(([name, panel]) => {
    panel.hidden = name !== tabName;
  });
  languageToggle.hidden = tabName !== "lesson";
}

function switchMcqTab(tabName) {
  mcqTabButtons.forEach(button => {
    button.classList.toggle("active", button.dataset.mcqTab === tabName);
  });
  Object.entries(mcqPanels).forEach(([name, panel]) => {
    panel.hidden = name !== tabName;
  });
}

function renderAllMcqs() {
  const groups = [
    { title: "Basic theory", range: "1–20", from: 1, to: 20 },
    { title: "Cash / Balance Sheet mechanics", range: "21–38", from: 21, to: 38 },
    { title: "Amortization, debt, equity", range: "39–60", from: 39, to: 60 },
    { title: "Tax + calculations", range: "61–75", from: 61, to: 75 },
    { title: "Exam revision", range: "76–100", from: 76, to: 100 }
  ];

  allMcqContainer.innerHTML = groups.map((group, groupIndex) => `
    <details class="mcq-group" ${groupIndex === 0 ? "open" : ""}>
      <summary class="mcq-group-heading">
        <span class="mcq-group-arrow" aria-hidden="true"></span>
        <h2>${escapeHtml(group.title)}</h2>
        <span class="pill dark">Questions ${group.range}</span>
      </summary>
      <div class="mcq-group-list">
        ${mcqData.questions
          .filter(question => question.id >= group.from && question.id <= group.to)
          .map(question => `
          <article class="card mcq-reference-card">
            <div class="mcq-reference-row">
              <div class="mcq-question-heading">
                <span class="pill dark">Question ${question.id}</span>
                <div class="mcq-bilingual-question">
                  <h2 lang="en">${escapeHtml(question.question)}</h2>
                  <p lang="fr">${escapeHtml(question.questionFr || "")}</p>
                </div>
              </div>
              <div class="mcq-compact-answer">
                <div>
                  <b>${question.answer}. ${escapeHtml(question.options[question.answer])}</b>
                  ${question.explanation ? `<p>${escapeHtml(question.explanation)}</p>` : ""}
                </div>
              </div>
            </div>
          </article>`).join("")}
      </div>
    </details>`).join("");
}

function renderPracticeQuestion() {
  if (practiceIndex >= mcqData.questions.length) {
    renderPracticeResult();
    return;
  }

  const question = mcqData.questions[practiceIndex];
  practiceChecked = false;
  mcqPracticeContainer.innerHTML = `
    <div class="mcq-practice-header">
      <span class="pill dark">Question ${practiceIndex + 1}/${mcqData.questions.length}</span>
      <span class="score">Answered: ${practiceIndex} · Score: ${practiceScore}</span>
    </div>
    <h2>${escapeHtml(question.question)}</h2>
    <div class="mcq-option-grid" role="radiogroup" aria-label="Answer choices">
      ${Object.entries(question.options).map(([letter, text]) => `
        <label class="mcq-option" data-option="${letter}">
          <input type="radio" name="practiceAnswer" value="${letter}" />
          <span><b>${letter}</b>${escapeHtml(text)}</span>
        </label>`).join("")}
    </div>
    <div class="feedback" id="mcqFeedback"></div>
    <div class="button-row">
      <button type="button" id="checkMcqBtn">Check answer</button>
      <button class="secondary" type="button" id="nextMcqBtn" hidden>
        ${practiceIndex === mcqData.questions.length - 1 ? "See final score" : "Next question"}
      </button>
    </div>`;

  document.getElementById("checkMcqBtn").addEventListener("click", checkPracticeAnswer);
  document.getElementById("nextMcqBtn").addEventListener("click", nextPracticeQuestion);
}

function checkPracticeAnswer() {
  if (practiceChecked) return;
  const question = mcqData.questions[practiceIndex];
  const selected = document.querySelector('input[name="practiceAnswer"]:checked');
  const feedback = document.getElementById("mcqFeedback");

  if (!selected) {
    feedback.innerHTML = "Choose an answer before checking.";
    feedback.className = "feedback show";
    return;
  }

  practiceChecked = true;
  const isCorrect = selected.value === question.answer;
  if (isCorrect) practiceScore++;

  document.querySelectorAll(".mcq-option").forEach(option => {
    const letter = option.dataset.option;
    option.classList.toggle("correct", letter === question.answer);
    option.classList.toggle("wrong", letter === selected.value && !isCorrect);
    option.querySelector("input").disabled = true;
  });

  feedback.innerHTML = `
    <div class="${isCorrect ? "ok" : "no"}"><b>${isCorrect ? "Correct" : "Wrong"}</b></div>
    ${isCorrect ? "" : `<div>Correct answer: <b>${question.answer}. ${escapeHtml(question.options[question.answer])}</b></div>`}
    ${question.explanation ? `<div>${escapeHtml(question.explanation)}</div>` : ""}`;
  feedback.className = "feedback show";
  document.getElementById("checkMcqBtn").hidden = true;
  document.getElementById("nextMcqBtn").hidden = false;
}

function nextPracticeQuestion() {
  if (!practiceChecked) return;
  practiceIndex++;
  renderPracticeQuestion();
}

function renderPracticeResult() {
  const total = mcqData.questions.length;
  const percentage = Math.round((practiceScore / total) * 100);
  mcqPracticeContainer.innerHTML = `
    <div class="mcq-result">
      <span class="pill dark">Complete</span>
      <h2>Final score: ${practiceScore}/${total}</h2>
      <p>${percentage}% correct</p>
      <button type="button" id="restartMcqBtn">Restart MCQ practice</button>
    </div>`;
  document.getElementById("restartMcqBtn").addEventListener("click", restartPractice);
}

function restartPractice() {
  practiceIndex = 0;
  practiceScore = 0;
  renderPracticeQuestion();
}

async function initTheory() {
  try {
    const [theoryResponse, mcqResponse, mcqFrenchResponse] = await Promise.all([
      fetch("data/theoretical_questions.json"),
      fetch("data/mcq_questions.json"),
      fetch("data/mcq_questions_fr.json")
    ]);
    if (!theoryResponse.ok) throw new Error(`Could not load theoretical_questions.json (${theoryResponse.status})`);
    if (!mcqResponse.ok) throw new Error(`Could not load mcq_questions.json (${mcqResponse.status})`);
    if (!mcqFrenchResponse.ok) throw new Error(`Could not load mcq_questions_fr.json (${mcqFrenchResponse.status})`);

    theoryData = await theoryResponse.json();
    const englishMcqs = await mcqResponse.json();
    const frenchMcqs = await mcqFrenchResponse.json();
    const frenchById = new Map(frenchMcqs.questions.map(question => [question.id, question.questionFr]));
    mcqData = {
      questions: englishMcqs.questions
        .map(question => ({
          ...question,
          questionFr: frenchById.get(question.id) || ""
        }))
        .sort((a, b) => a.id - b.id)
    };
    renderLanguage(theoryData.defaultLanguage || "fr");
    renderAllMcqs();
    renderPracticeQuestion();
  } catch (error) {
    container.innerHTML = `<div class="feedback show"><b>Data loading failed.</b> Start a local server from this folder, then open the site through that server.</div>`;
    console.error(error);
  }
}

languageToggle.addEventListener("click", toggleLanguage);
theoryTabButtons.forEach(button => {
  button.addEventListener("click", () => switchTheoryTab(button.dataset.theoryTab));
});
mcqTabButtons.forEach(button => {
  button.addEventListener("click", () => switchMcqTab(button.dataset.mcqTab));
});

initTheory();
