const ROUND_LENGTH = 10;

let TABLES = [];
let EXERCISE = null;
let activeExerciseId = null;
let current = null;
let missingIndexes = [];
let titleOptions = [];
let rowOptions = {};
let round = null;
let lastResult = null;

const els = {
  studyFlow: document.getElementById("studyFlow"),
  mode: document.getElementById("mode"),
  tableChoice: document.getElementById("tableChoice"),
  missingCount: document.getElementById("missingCount"),
  newQuizBtn: document.getElementById("newQuizBtn"),
  checkBtn: document.getElementById("checkBtn"),
  nextBtn: document.getElementById("nextBtn"),
  showBtn: document.getElementById("showBtn"),
  resetBtn: document.getElementById("resetBtn"),
  modePill: document.getElementById("modePill"),
  progressPill: document.getElementById("progressPill"),
  titleLabel: document.getElementById("titleLabel"),
  microHint: document.getElementById("microHint"),
  titleQuestion: document.getElementById("titleQuestion"),
  tableContainer: document.getElementById("tableContainer"),
  feedback: document.getElementById("feedback"),
  calculationExerciseTabs: document.getElementById("calculationExerciseTabs"),
  exerciseGiven: document.getElementById("exerciseGiven"),
  exerciseTables: document.getElementById("exerciseTables")
};

const practicalTabButtons = [...document.querySelectorAll(".sub-tab-button")];
const practicalPanels = {
  memorization: document.getElementById("memorizationPanel"),
  calculation: document.getElementById("calculationPanel")
};

function normalize(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/['’`]/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function answerMatches(input, aliases) {
  const n = normalize(input);
  if (!n) return false;
  return aliases.some(alias => {
    const accepted = normalize(alias);
    return n === accepted || n.includes(accepted) || accepted.includes(n);
  });
}

function shuffle(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickTable() {
  const choice = els.tableChoice.value;
  if (choice === "random") return TABLES[Math.floor(Math.random() * TABLES.length)];
  return TABLES.find(table => table.id === choice) || TABLES[0];
}

function enforceProgressiveTableChoice() {
  const randomOption = els.tableChoice.querySelector('option[value="random"]');
  const isProgressive = els.studyFlow.value === "progressive";
  randomOption.disabled = isProgressive;
  if (isProgressive && els.tableChoice.value === "random") {
    els.tableChoice.value = TABLES[0].id;
  }
}

function updateMissingLimit() {
  enforceProgressiveTableChoice();
  const selected = els.tableChoice.value === "random"
    ? Math.max(...TABLES.map(table => table.rows.length))
    : pickTable().rows.length;
  els.missingCount.max = selected;
  if (Number(els.missingCount.value) > selected) {
    els.missingCount.value = selected;
  }
}

function makeOptions(correctLabel, allLabels, n = 4) {
  const wrong = shuffle(allLabels.filter(label => label !== correctLabel)).slice(0, n - 1);
  return shuffle([correctLabel, ...wrong]);
}

function makeQuestion(forcedTable = null, forcedCount = null) {
  const table = forcedTable || pickTable();
  const requestedCount = forcedCount ?? Number(els.missingCount.value || 3);
  const count = Math.max(1, Math.min(requestedCount, table.rows.length));
  const hiddenRows = shuffle([...table.rows.keys()]).slice(0, count).sort((a, b) => a - b);
  const optionsByRow = {};
  const allRows = [...new Set(TABLES.flatMap(t => t.rows.map(row => row.label)))];
  hiddenRows.forEach(index => {
    optionsByRow[index] = makeOptions(table.rows[index].label, allRows, 5);
  });

  return {
    table,
    hiddenRows,
    titleChoices: makeOptions(table.title, TABLES.map(t => t.title), 3),
    rowChoices: optionsByRow
  };
}

function loadQuestion(question) {
  current = question.table;
  missingIndexes = question.hiddenRows;
  titleOptions = question.titleChoices;
  rowOptions = question.rowChoices;
  lastResult = null;
}

function newQuiz() {
  clearFeedback();
  updateMissingLimit();
  const flow = els.studyFlow.value;
  if (flow === "practice") {
    round = null;
    loadQuestion(makeQuestion());
  } else if (flow === "progressive") {
    const progressiveTable = pickTable();
    const requestedStart = Number(els.missingCount.value || 3);
    const startCount = Math.max(1, Math.min(requestedStart, progressiveTable.rows.length));
    round = {
      flow,
      number: 1,
      total: progressiveTable.rows.length - startCount + 1,
      table: progressiveTable,
      hiddenCount: startCount,
      results: [],
      awaitingNext: false
    };
    loadQuestion(makeQuestion(progressiveTable, startCount));
  } else {
    round = {
      flow,
      number: 1,
      total: ROUND_LENGTH,
      results: [],
      awaitingNext: false
    };
    loadQuestion(makeQuestion());
  }
  renderQuiz();
}

function renderTitleQuestion(showAnswer = false) {
  const mode = els.mode.value;
  const isProgressive = els.studyFlow.value === "progressive";
  if (isProgressive) {
    els.titleLabel.textContent = "Selected table:";
    els.titleQuestion.innerHTML = `<div class="pill">${escapeHtml(current.title)}</div>`;
    return;
  }
  els.titleLabel.textContent = "Table name:";
  if (showAnswer) {
    els.titleQuestion.innerHTML = `<div class="pill">${escapeHtml(current.title)}</div>`;
    return;
  }
  if (mode === "mcq") {
    els.titleQuestion.innerHTML = `
      <div class="choice-grid" role="radiogroup" aria-label="Choose table name">
        ${titleOptions.map(option => `
          <label class="choice">
            <input type="radio" name="titleAnswer" value="${escapeHtml(option)}" />
            <span>${escapeHtml(option)}</span>
          </label>`).join("")}
      </div>`;
  } else {
    els.titleQuestion.innerHTML = `<input type="text" id="titleAnswer" placeholder="Write table name: e.g. P&L, CDR, Bilan..." />`;
  }
}

function renderChoiceGrid(name, className, dataIndex, options) {
  return `
    <div class="choice-grid" role="radiogroup" aria-label="Choose missing row">
      ${options.map(option => `
        <label class="choice">
          <input class="${className}" type="radio" name="${name}" data-index="${dataIndex}" value="${escapeHtml(option)}" />
          <span>${escapeHtml(option)}</span>
        </label>`).join("")}
    </div>`;
}

function renderQuiz(showAnswer = false) {
  const mode = els.mode.value;
  const flow = els.studyFlow.value;
  els.modePill.textContent = mode === "mcq" ? "MCQ" : "Free answer";
  els.progressPill.textContent = round
    ? flow === "progressive"
      ? `${round.hiddenCount} hidden · ${round.number}/${round.total}`
      : `Question ${round.number}/${round.total}`
    : "Practice";
  els.microHint.textContent = flow === "blind"
    ? "Blind mode moves on immediately and saves correction for the final score."
    : flow === "progressive"
      ? "Same chosen table, one more hidden row after each checked question."
      : "The table title is also hidden.";
  renderTitleQuestion(showAnswer);

  const rowsHtml = current.rows.map((row, index) => {
    const isMissing = missingIndexes.includes(index);
    const classes = [row.type === "strong" ? "strong-row" : "", row.type === "total" ? "total-row" : ""].join(" ");
    let labelCell = escapeHtml(row.label);

    if (isMissing && !showAnswer) {
      if (mode === "mcq") {
        labelCell = `
          <div class="answer-box">
            ${renderChoiceGrid(`rowAnswer-${index}`, "rowAnswer", index, rowOptions[index])}
            <span class="badge" id="badge-${index}"></span>
          </div>`;
      } else {
        labelCell = `
          <div class="answer-box">
            <input class="rowAnswer" data-index="${index}" type="text" placeholder="English or French answer" />
            <span class="badge" id="badge-${index}"></span>
          </div>`;
      }
    }

    return `
      <tr class="${classes}">
        <td class="${isMissing && !showAnswer ? "missing-cell" : ""}">${labelCell}${showAnswer && isMissing ? `<div class="hidden-answer">was hidden</div>` : ""}</td>
      </tr>`;
  }).join("");

  els.tableContainer.innerHTML = `
    <table aria-label="Financial statement quiz table">
      <thead>
        <tr><th>Rows to memorize</th></tr>
      </thead>
      <tbody>${rowsHtml}</tbody>
    </table>`;

  updateButtons();
}

function collectResult() {
  let score = 0;
  const isProgressive = els.studyFlow.value === "progressive";
  const total = missingIndexes.length + (isProgressive ? 0 : 1);
  const titleInput = els.mode.value === "mcq"
    ? document.querySelector(`input[name="titleAnswer"]:checked`)?.value || ""
    : document.getElementById("titleAnswer")?.value || "";
  const titleOk = answerMatches(titleInput, [current.title, ...current.titleAliases]);
  if (titleOk && !isProgressive) score++;

  const answers = isProgressive ? [] : [{
    kind: "Table name",
    user: titleInput,
    ok: titleOk,
    correct: current.title
  }];

  missingIndexes.forEach(index => {
    const row = current.rows[index];
    const input = els.mode.value === "mcq"
      ? document.querySelector(`input[name="rowAnswer-${index}"]:checked`)?.value || ""
      : document.querySelector(`.rowAnswer[data-index="${index}"]`)?.value || "";
    const ok = answerMatches(input, [row.label, ...row.aliases]);
    if (ok) score++;
    answers.push({
      kind: `Row ${index + 1}`,
      user: input,
      ok,
      correct: row.label
    });
  });

  return {
    table: current.title,
    score,
    total,
    answers
  };
}

function checkAnswers() {
  const flow = els.studyFlow.value;
  lastResult = collectResult();

  if (flow === "blind") {
    round.results.push(lastResult);
    if (round.number >= round.total) {
      finishRound();
      return;
    }
    round.number++;
    loadQuestion(makeQuestion());
    clearFeedback();
    renderQuiz();
    return;
  }

  paintBadges(lastResult);
  showResultFeedback(lastResult, flow === "lightning" || flow === "progressive");

  if (flow === "lightning" || flow === "progressive") {
    round.awaitingNext = true;
    round.results.push(lastResult);
  }
  updateButtons();
}

function paintBadges(result) {
  result.answers
    .filter(answer => answer.kind.startsWith("Row "))
    .forEach(answer => {
      const rowNumber = Number(answer.kind.replace("Row ", "")) - 1;
      const badge = document.getElementById(`badge-${rowNumber}`);
      if (badge) {
        badge.textContent = answer.ok ? "✓" : "×";
        badge.className = `badge ${answer.ok ? "ok" : "no"}`;
      }
    });
}

function showResultFeedback(result, includeNextHint = false) {
  const lines = result.answers.map(answer => `
    <div class="line">
      <b>${escapeHtml(answer.kind)}:</b>
      <span class="${answer.ok ? "ok" : "no"}">${answer.ok ? "Correct" : "Wrong"}</span>
      ${answer.ok ? "" : `Correct: <b>${escapeHtml(answer.correct)}</b>`}
    </div>`).join("");

  els.feedback.innerHTML = `
    <div class="score">Score: ${result.score}/${result.total}</div>
    ${lines}
    ${includeNextHint ? `<div class="line"><b>Next:</b> use the correction, then move to the next question.</div>` : ""}`;
  els.feedback.className = "feedback show";
}

function nextQuestion() {
  if (!round) return;
  if (round.number >= round.total) {
    finishRound();
    return;
  }
  round.number++;
  round.awaitingNext = false;
  if (round.flow === "progressive") {
    round.hiddenCount++;
    loadQuestion(makeQuestion(round.table, round.hiddenCount));
  } else {
    loadQuestion(makeQuestion());
  }
  clearFeedback();
  renderQuiz();
}

function finishRound() {
  const earned = round.results.reduce((sum, result) => sum + result.score, 0);
  const possible = round.results.reduce((sum, result) => sum + result.total, 0);
  const review = round.results.map((result, index) => {
    const missed = result.answers.filter(answer => !answer.ok);
    const detail = missed.length
      ? missed.map(answer => `<div class="line">${escapeHtml(answer.kind)}: <b>${escapeHtml(answer.correct)}</b></div>`).join("")
      : `<div class="line ok">All correct.</div>`;
    return `
      <div class="review-item">
        <b>Question ${index + 1}: ${escapeHtml(result.table)}</b> - ${result.score}/${result.total}
        ${detail}
      </div>`;
  }).join("");

  els.titleQuestion.innerHTML = `<div class="pill">Round complete</div>`;
  els.tableContainer.innerHTML = "";
  els.feedback.innerHTML = `
    <div class="score">Final score: ${earned}/${possible}</div>
    <div class="review-list">${review}</div>`;
  els.feedback.className = "feedback show";
  round = null;
  updateButtons(true);
}

function showAnswers() {
  renderQuiz(true);
  els.feedback.innerHTML = `
    <div class="score">Answers shown</div>
    <div class="line"><b>Table:</b> ${escapeHtml(current.title)}</div>
    ${missingIndexes.map(index => `<div class="line"><b>Row ${index + 1}:</b> ${escapeHtml(current.rows[index].label)}</div>`).join("")}`;
  els.feedback.className = "feedback show";
}

function resetSameQuiz() {
  if (!current) {
    newQuiz();
    return;
  }
  lastResult = null;
  if (round) round.awaitingNext = false;
  clearFeedback();
  renderQuiz(false);
}

function clearFeedback() {
  els.feedback.className = "feedback";
  els.feedback.innerHTML = "";
}

function updateButtons(roundFinished = false) {
  const flow = els.studyFlow.value;
  const waiting = Boolean(round && round.awaitingNext);

  els.checkBtn.textContent = flow === "blind" ? "Submit answer" : "Check answers";
  els.checkBtn.hidden = roundFinished || waiting;
  els.nextBtn.hidden = !waiting;
  els.showBtn.hidden = flow === "blind" || roundFinished;
  els.resetBtn.hidden = roundFinished;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function switchPracticalTab(tabName) {
  practicalTabButtons.forEach(button => {
    button.classList.toggle("active", button.dataset.practicalTab === tabName);
  });
  Object.entries(practicalPanels).forEach(([name, panel]) => {
    panel.hidden = name !== tabName;
  });
}

function renderExercise() {
  if (!EXERCISE) return;
  const exercises = EXERCISE.exercises || [EXERCISE];
  activeExerciseId = activeExerciseId || exercises[0]?.id;

  els.calculationExerciseTabs.innerHTML = exercises.map(exercise => `
    <button
      class="exercise-tab-button ${exercise.id === activeExerciseId ? "active" : ""}"
      type="button"
      data-exercise-tab="${escapeHtml(exercise.id)}"
    >
      ${escapeHtml(exercise.title)}
    </button>`).join("");

  els.calculationExerciseTabs.querySelectorAll("[data-exercise-tab]").forEach(button => {
    button.addEventListener("click", () => {
      activeExerciseId = button.dataset.exerciseTab;
      renderExercise();
    });
  });

  renderSelectedExercise();
}

function getActiveExercise() {
  const exercises = EXERCISE.exercises || [EXERCISE];
  return exercises.find(exercise => exercise.id === activeExerciseId) || exercises[0];
}

function renderSelectedExercise() {
  const exercise = getActiveExercise();

  if (!exercise.tables || !exercise.tables.length) {
    els.exerciseGiven.innerHTML = `
      <div class="feedback show">
        <b>${escapeHtml(exercise.title)}</b><br />
        ${escapeHtml(exercise.emptyMessage || "This exercise will be added later.")}
      </div>`;
    els.exerciseTables.innerHTML = "";
    return;
  }

  els.exerciseGiven.innerHTML = `
    ${exercise.description ? `<p class="hint">${escapeHtml(exercise.description)}</p>` : ""}
    <div class="given-grid">
      ${exercise.given.map(section => `
        <div class="given-card">
          <h3>${escapeHtml(section.title)}</h3>
          <ul>
            ${section.items.map(item => `<li>${escapeHtml(item)}</li>`).join("")}
          </ul>
        </div>`).join("")}
    </div>`;

  els.exerciseTables.innerHTML = exercise.tables.map(table => renderExerciseTable(exercise, table)).join("");

  exercise.tables.forEach(table => {
    document
      .querySelector(`[data-check-table="${table.id}"]`)
      .addEventListener("click", () => checkExerciseTable(table.id));
    document
      .querySelector(`[data-show-table="${table.id}"]`)
      .addEventListener("click", () => showExerciseAnswers(table.id));
  });
}

function renderExerciseTable(exercise, table) {
  const rowsHtml = table.rows.map((row, rowIndex) => {
    const classes = [row.type === "strong" ? "strong-row" : "", row.type === "total" ? "total-row" : ""].join(" ");
    return `
      <tr class="${classes}">
        <td>
          <span class="row-help" tabindex="0">
            ${escapeHtml(row.label)}
            ${row.hint ? `<span class="row-tooltip">${escapeHtml(row.hint)}</span>` : ""}
          </span>
        </td>
        ${row.answers.map((_, yearIndex) => `
          <td>
            <input
              type="text"
              inputmode="decimal"
              aria-label="${escapeHtml(row.label)} ${escapeHtml(exercise.years[yearIndex])}"
              data-exercise-input="${table.id}-${rowIndex}-${yearIndex}"
              placeholder="0"
            />
            <div class="cell-answer" data-exercise-answer="${table.id}-${rowIndex}-${yearIndex}"></div>
          </td>`).join("")}
      </tr>`;
  }).join("");

  return `
    <section class="card exercise-card">
      <h2>${escapeHtml(table.title)}</h2>
      <div class="table-wrap">
        <table class="exercise-table" aria-label="${escapeHtml(table.title)} calculation exercise">
          <thead>
            <tr>
              <th>Rows to fill</th>
              ${exercise.years.map(year => `<th>${escapeHtml(year)}</th>`).join("")}
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </div>
      <div class="button-row">
        <button type="button" data-check-table="${escapeHtml(table.id)}">Check answers</button>
        <button class="secondary" type="button" data-show-table="${escapeHtml(table.id)}">Show answers</button>
        <span class="score" id="exerciseScore-${escapeHtml(table.id)}"></span>
      </div>
    </section>`;
}

function parseNumericAnswer(input) {
  const raw = String(input || "").trim();
  if (raw === "/") return 0;

  const cleaned = raw
    .trim()
    .replace(/\s+/g, "")
    .replace(/€/g, "")
    .replace(/,/g, ".")
    .replace(/[−–—]/g, "-")
    .replace(/[×x]/gi, "*");

  if (!cleaned) return NaN;
  if (!/^[0-9+\-*/().]+$/.test(cleaned)) return NaN;

  try {
    const value = Function(`"use strict"; return (${cleaned});`)();
    return Number.isFinite(value) ? value : NaN;
  } catch {
    return NaN;
  }
}

function formatNumber(value) {
  return String(value).replace(".", ",");
}

function displayExpectedAnswer(row, yearIndex) {
  return row.displayAnswers?.[yearIndex] ?? formatNumber(row.answers[yearIndex]);
}

function checkExerciseTable(tableId) {
  const exercise = getActiveExercise();
  const table = exercise.tables.find(item => item.id === tableId);
  let score = 0;
  let total = 0;

  table.rows.forEach((row, rowIndex) => {
    row.answers.forEach((answer, yearIndex) => {
      total++;
      const input = document.querySelector(`[data-exercise-input="${table.id}-${rowIndex}-${yearIndex}"]`);
      const answerBox = document.querySelector(`[data-exercise-answer="${table.id}-${rowIndex}-${yearIndex}"]`);
      const value = parseNumericAnswer(input.value);
      const ok = Math.abs(value - answer) <= 0.01;

      input.classList.toggle("correct", ok);
      input.classList.toggle("wrong", !ok);
      answerBox.textContent = ok ? "Correct" : "Wrong";
      answerBox.className = `cell-answer show ${ok ? "correct" : "wrong"}`;
      if (ok) score++;
    });
  });

  document.getElementById(`exerciseScore-${table.id}`).textContent = `Score: ${score}/${total}`;
}

function showExerciseAnswers(tableId) {
  const exercise = getActiveExercise();
  const table = exercise.tables.find(item => item.id === tableId);

  table.rows.forEach((row, rowIndex) => {
    row.answers.forEach((answer, yearIndex) => {
      const input = document.querySelector(`[data-exercise-input="${table.id}-${rowIndex}-${yearIndex}"]`);
      const answerBox = document.querySelector(`[data-exercise-answer="${table.id}-${rowIndex}-${yearIndex}"]`);
      const value = parseNumericAnswer(input.value);
      const ok = Math.abs(value - answer) <= 0.01;

      input.classList.toggle("correct", ok);
      input.classList.toggle("wrong", !ok);
      answerBox.textContent = `Correct: ${displayExpectedAnswer(row, yearIndex)}`;
      answerBox.className = "cell-answer show";
    });
  });
}

function populateTableSelect() {
  TABLES.forEach(table => {
    const option = document.createElement("option");
    option.value = table.id;
    option.textContent = table.title;
    els.tableChoice.appendChild(option);
  });
}

async function init() {
  try {
    const [tablesResponse, exerciseResponse] = await Promise.all([
      fetch("data/tables.json"),
      fetch("data/calculation_exercise.json")
    ]);
    if (!tablesResponse.ok) throw new Error(`Could not load tables.json (${tablesResponse.status})`);
    if (!exerciseResponse.ok) throw new Error(`Could not load calculation_exercise.json (${exerciseResponse.status})`);
    TABLES = await tablesResponse.json();
    EXERCISE = await exerciseResponse.json();
    populateTableSelect();
    renderExercise();
    els.missingCount.max = Math.max(...TABLES.map(table => table.rows.length));
    newQuiz();
  } catch (error) {
    els.tableContainer.innerHTML = "";
    els.feedback.innerHTML = `<b>Data loading failed.</b> Start a local server from this folder, then open the site through that server.`;
    els.feedback.className = "feedback show";
    console.error(error);
  }
}

practicalTabButtons.forEach(button => {
  button.addEventListener("click", () => switchPracticalTab(button.dataset.practicalTab));
});
els.newQuizBtn.addEventListener("click", newQuiz);
els.checkBtn.addEventListener("click", checkAnswers);
els.nextBtn.addEventListener("click", nextQuestion);
els.showBtn.addEventListener("click", showAnswers);
els.resetBtn.addEventListener("click", resetSameQuiz);
els.mode.addEventListener("change", resetSameQuiz);
els.studyFlow.addEventListener("change", newQuiz);
els.tableChoice.addEventListener("change", newQuiz);

init();
