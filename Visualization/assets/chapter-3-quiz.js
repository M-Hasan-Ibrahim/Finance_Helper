const quiz = document.querySelector("#chapter3Quiz");
const result = document.querySelector("#quizResult");
const resetButton = document.querySelector("#resetQuiz");
const orderingList = document.querySelector("#mantraOrder");

const correctOrder = ["Overview first", "Zoom and filter", "Details on demand"];
const answers = { q1: "b", q2: "d", q3: "b", q5: "d" };
const explanations = {
  q1: "The model is iterative, with loops around data foraging, interpretation, and presentation.",
  q2: "Analytic tasks describe the questions and activities a visualization must support.",
  q3: "Computers may process huge datasets, but human perception and cognition remain limited.",
  q5: "Select is an interaction category; click is a physical input action."
};

let draggedItem = null;

function shuffledOrder() {
  const items = [...correctOrder];
  do {
    items.sort(() => Math.random() - 0.5);
  } while (items.every((item, index) => item === correctOrder[index]));
  return items;
}

function renderOrdering(items = shuffledOrder()) {
  orderingList.innerHTML = "";
  items.forEach((text) => {
    const item = document.createElement("li");
    item.className = "ordering-item";
    item.draggable = true;
    item.dataset.value = text;
    item.innerHTML = `
      <span class="drag-handle" aria-hidden="true">☰</span>
      <strong>${text}</strong>
      <span class="order-controls">
        <button type="button" data-move="up" aria-label="Move ${text} up">↑</button>
        <button type="button" data-move="down" aria-label="Move ${text} down">↓</button>
      </span>
    `;
    orderingList.append(item);
  });
}

orderingList.addEventListener("dragstart", (event) => {
  draggedItem = event.target.closest(".ordering-item");
  if (draggedItem) draggedItem.classList.add("dragging");
});

orderingList.addEventListener("dragend", () => {
  if (draggedItem) draggedItem.classList.remove("dragging");
  draggedItem = null;
});

orderingList.addEventListener("dragover", (event) => {
  event.preventDefault();
  const target = event.target.closest(".ordering-item");
  if (!draggedItem || !target || target === draggedItem) return;
  const box = target.getBoundingClientRect();
  const insertAfter = event.clientY > box.top + box.height / 2;
  orderingList.insertBefore(draggedItem, insertAfter ? target.nextSibling : target);
});

orderingList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-move]");
  if (!button) return;
  const item = button.closest(".ordering-item");
  if (button.dataset.move === "up" && item.previousElementSibling) {
    orderingList.insertBefore(item, item.previousElementSibling);
  }
  if (button.dataset.move === "down" && item.nextElementSibling) {
    orderingList.insertBefore(item.nextElementSibling, item);
  }
});

function markQuestion(question, isCorrect, explanation) {
  question.classList.toggle("correct", isCorrect);
  question.classList.toggle("incorrect", !isCorrect);
  question.querySelector(".question-feedback").textContent =
    `${isCorrect ? "Correct." : "Not quite."} ${explanation}`;
}

quiz.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(quiz);
  let score = 0;

  Object.entries(answers).forEach(([name, answer]) => {
    const isCorrect = formData.get(name) === answer;
    if (isCorrect) score += 1;
    markQuestion(quiz.querySelector(`[data-question="${name}"]`), isCorrect, explanations[name]);
  });

  const currentOrder = [...orderingList.children].map((item) => item.dataset.value);
  const orderCorrect = currentOrder.every((item, index) => item === correctOrder[index]);
  if (orderCorrect) score += 1;
  markQuestion(
    quiz.querySelector('[data-question="q4"]'),
    orderCorrect,
    "The sequence is: Overview first → Zoom and filter → Details on demand."
  );

  result.className = `quiz-result show ${score >= 4 ? "strong-score" : ""}`;
  result.innerHTML = `<strong>${score}/5</strong><span>${score === 5 ? "Excellent—every answer is correct." : score >= 4 ? "Great work. Review the highlighted question and try for full marks." : "Review Chapter 3 and try again when ready."}</span>`;
  result.scrollIntoView({ behavior: "smooth", block: "center" });
});

resetButton.addEventListener("click", () => {
  quiz.reset();
  renderOrdering();
  quiz.querySelectorAll(".quiz-question").forEach((question) => {
    question.classList.remove("correct", "incorrect");
    question.querySelector(".question-feedback").textContent = "";
  });
  result.className = "quiz-result";
  result.textContent = "";
  window.scrollTo({ top: 0, behavior: "smooth" });
});

renderOrdering();
