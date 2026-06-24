const quiz = document.querySelector("#chapter4Quiz");
const result = document.querySelector("#quizResult");
const resetButton = document.querySelector("#resetQuiz");
const matchingBank = document.querySelector("#matchingBank");
const matchingGrid = document.querySelector("#matchingGrid");

const explanations = {
  q1: "Target detection is a pre-attentive task when the target visually pops out.",
  q2: "Position and color can be read independently; the other pairs interfere more strongly.",
  q3: "Greyscale luminance is ordered from lighter to darker, even if distant comparisons are less precise.",
  q4: "Separability describes independent reading; integral variables interfere or are perceived together.",
  q5: "A simple color difference, such as one red mark among grey marks, can pop out quickly.",
  q6: "None of the statements is correct. Rainbow scales are difficult to order and can create false visual boundaries.",
  q7: "A present target is normally found faster than an absent target, which requires a more exhaustive search.",
  q8: "Shape alone can pop out pre-attentively, while conjunctions such as color plus shape require slower search.",
  q9: "Contrast depends on the brightness or luminance difference between foreground and background.",
  q10: "Selective finds targets; associative groups them; quantitative reads values; orderable ranks them; discriminability counts distinguishable levels.",
  q11: "The difference between foreground and background is contrast."
};

const matches = [
  { operation: "Selective", id: "selective", definition: "Targets can be found based on this visual attribute." },
  { operation: "Orderable", id: "orderable", definition: "We can rank targets based on this attribute." },
  { operation: "Quantitative", id: "quantitative", definition: "We can read the numerical value of a target based on this attribute." },
  { operation: "Discriminability", id: "discriminability", definition: "How many nuances of this visual attribute can we separate." },
  { operation: "Associative", id: "associative", definition: "Targets can be grouped based on this visual attribute." }
];

let draggedCard = null;
let selectedCard = null;

function normalize(value) {
  return value.trim().toLowerCase().replace(/[-_]/g, " ").replace(/\s+/g, " ");
}

function shuffled(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function createMatchCard(item) {
  const card = document.createElement("button");
  card.type = "button";
  card.className = "match-card";
  card.draggable = true;
  card.dataset.id = item.id;
  card.textContent = item.definition;
  card.setAttribute("aria-pressed", "false");
  return card;
}

function moveCard(card, destination) {
  const existing = destination.querySelector(".match-card");
  if (existing && existing !== card) matchingBank.append(existing);
  destination.append(card);
  if (selectedCard) {
    selectedCard.classList.remove("selected");
    selectedCard.setAttribute("aria-pressed", "false");
  }
  selectedCard = null;
}

function renderMatching() {
  matchingBank.innerHTML = "";
  matchingGrid.innerHTML = "";
  selectedCard = null;

  shuffled(matches).forEach((item) => matchingBank.append(createMatchCard(item)));
  matches.forEach((item) => {
    const row = document.createElement("div");
    row.className = "matching-row";
    row.innerHTML = `<strong>${item.operation}</strong><div class="match-slot" data-answer="${item.id}" tabindex="0" role="button" aria-label="Place definition for ${item.operation}"><span>Drop definition here</span></div>`;
    matchingGrid.append(row);
  });
}

function setSelectedCard(card) {
  if (selectedCard) {
    selectedCard.classList.remove("selected");
    selectedCard.setAttribute("aria-pressed", "false");
  }
  selectedCard = selectedCard === card ? null : card;
  if (selectedCard) {
    selectedCard.classList.add("selected");
    selectedCard.setAttribute("aria-pressed", "true");
  }
}

document.addEventListener("click", (event) => {
  const card = event.target.closest(".match-card");
  if (card) {
    setSelectedCard(card);
    return;
  }
  const slot = event.target.closest(".match-slot");
  if (slot && selectedCard) moveCard(selectedCard, slot);
});

document.addEventListener("keydown", (event) => {
  const slot = event.target.closest(".match-slot");
  if (slot && selectedCard && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    moveCard(selectedCard, slot);
  }
});

document.addEventListener("dragstart", (event) => {
  draggedCard = event.target.closest(".match-card");
  if (draggedCard) draggedCard.classList.add("dragging");
});

document.addEventListener("dragend", () => {
  if (draggedCard) draggedCard.classList.remove("dragging");
  draggedCard = null;
});

[matchingBank, matchingGrid].forEach((container) => {
  container.addEventListener("dragover", (event) => event.preventDefault());
  container.addEventListener("drop", (event) => {
    event.preventDefault();
    if (!draggedCard) return;
    const slot = event.target.closest(".match-slot");
    moveCard(draggedCard, slot || matchingBank);
  });
});

function markQuestion(question, isCorrect, explanation) {
  question.classList.toggle("correct", isCorrect);
  question.classList.toggle("incorrect", !isCorrect);
  question.querySelector(".question-feedback").textContent = `${isCorrect ? "Correct." : "Not quite."} ${explanation}`;
}

quiz.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(quiz);
  let score = 0;

  const q1Answer = normalize(formData.get("q1") || "");
  const q1Correct = ["target", "target detection"].includes(q1Answer);
  if (q1Correct) score += 1;
  markQuestion(quiz.querySelector('[data-question="q1"]'), q1Correct, explanations.q1);

  const q2Selected = formData.getAll("q2");
  const q2Correct = q2Selected.length === 1 && q2Selected[0] === "d";
  if (q2Correct) score += 1;
  markQuestion(quiz.querySelector('[data-question="q2"]'), q2Correct, explanations.q2);

  const simpleAnswers = { q3: "true", q4: "b", q5: "true", q7: "true", q8: "true" };
  Object.entries(simpleAnswers).forEach(([name, answer]) => {
    const isCorrect = formData.get(name) === answer;
    if (isCorrect) score += 1;
    markQuestion(quiz.querySelector(`[data-question="${name}"]`), isCorrect, explanations[name]);
  });

  const q6Selected = formData.getAll("q6");
  const q6Correct = q6Selected.length === 1 && q6Selected[0] === "e";
  if (q6Correct) score += 1;
  markQuestion(quiz.querySelector('[data-question="q6"]'), q6Correct, explanations.q6);

  const q9Answer = normalize(formData.get("q9") || "");
  const q9Correct = ["brightness", "luminance"].includes(q9Answer);
  if (q9Correct) score += 1;
  markQuestion(quiz.querySelector('[data-question="q9"]'), q9Correct, explanations.q9);


  const q11Answer = normalize(formData.get("q11") || "");
  const q11Correct = q11Answer === "contrast";
  if (q11Correct) score += 1;
  markQuestion(quiz.querySelector('[data-question="q11"]'), q11Correct, explanations.q11);
  const q10Correct = [...matchingGrid.querySelectorAll(".match-slot")].every((slot) => {
    const card = slot.querySelector(".match-card");
    return card && card.dataset.id === slot.dataset.answer;
  });
  if (q10Correct) score += 1;
  markQuestion(quiz.querySelector('[data-question="q10"]'), q10Correct, explanations.q10);

  result.className = `quiz-result show ${score >= 9 ? "strong-score" : ""}`;
  result.innerHTML = `<strong>${score}/11</strong><span>${score === 11 ? "Excellent—every answer is correct." : score >= 9 ? "Great work. Review the highlighted questions and try for full marks." : "Review Chapter 4 and try again when ready."}</span>`;
  result.scrollIntoView({ behavior: "smooth", block: "center" });
});

resetButton.addEventListener("click", () => {
  quiz.reset();
  renderMatching();
  quiz.querySelectorAll(".quiz-question").forEach((question) => {
    question.classList.remove("correct", "incorrect");
    question.querySelector(".question-feedback").textContent = "";
  });
  result.className = "quiz-result";
  result.textContent = "";
  window.scrollTo({ top: 0, behavior: "smooth" });
});

renderMatching();