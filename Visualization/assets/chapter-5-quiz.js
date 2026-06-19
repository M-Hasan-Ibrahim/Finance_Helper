const quiz = document.querySelector("#chapter5Quiz");
const result = document.querySelector("#quizResult");
const resetButton = document.querySelector("#resetQuiz");

const matrixPatterns = {
  a: Array.from({ length: 7 }, (_, row) =>
    Array.from({ length: 7 }, (_, column) => row !== column)
  ),
  b: [
    [0, 1, 1, 0, 0],
    [1, 0, 1, 0, 0],
    [1, 1, 0, 1, 1],
    [0, 0, 1, 0, 1],
    [0, 0, 1, 1, 0]
  ],
  c: [
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [1, 1, 0, 1],
    [0, 0, 1, 0]
  ]
};

Object.entries(matrixPatterns).forEach(([name, pattern]) => {
  const matrix = document.querySelector(`[data-matrix="${name}"]`);
  matrix.style.setProperty("--matrix-size", pattern.length);
  pattern.flat().forEach((connected) => {
    const cell = document.createElement("span");
    cell.className = `matrix-cell ${connected ? "connected" : "empty"}`;
    matrix.append(cell);
  });
});

const structureOptions = [
  "Fully connected component (clique)",
  "Single node connecting two cliques",
  "Bipartite graph"
];

document.querySelectorAll(".matrix-card select").forEach((select) => {
  structureOptions.forEach((text) => {
    const option = document.createElement("option");
    option.value = text;
    option.textContent = text;
    select.append(option);
  });
});

const answers = {
  q1: "true",
  q3: "c",
  q4: "b",
  q5: "a",
  q6: "false",
  q7: "false",
  q8: "c",
  q9: "a",
  q10: "false"
};

const explanations = {
  q1: "Node-link diagrams primarily reveal relationships and graph structure.",
  q2: "A dense block is a clique; two dense blocks joined through a bridge indicate two cliques; off-diagonal blocks indicate a bipartite graph.",
  q3: "Animation helps preserve the user's mental map while the view changes.",
  q4: "Treemaps encode attributes such as size and color efficiently, but hierarchy can be harder to perceive.",
  q5: "The strongest distortion occurs near the transition between focus and context.",
  q6: "Trees may be vertical, horizontal, radial, or use another layout suited to the task.",
  q7: "Specific layout optimization problems can be NP-hard, but graph drawing as a whole is not always NP-hard.",
  q8: "Adjacency matrices avoid edge-crossing clutter and scale well for dense graphs.",
  q9: "A graph is an abstract object and exists independently of any drawing.",
  q10: "Matrices still require a row and column ordering, so they do not remove every layout decision."
};

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

  const q2Correct =
    formData.get("q2a") === structureOptions[0] &&
    formData.get("q2b") === structureOptions[1] &&
    formData.get("q2c") === structureOptions[2];
  if (q2Correct) score += 1;
  markQuestion(quiz.querySelector('[data-question="q2"]'), q2Correct, explanations.q2);

  result.className = `quiz-result show ${score >= 8 ? "strong-score" : ""}`;
  result.innerHTML = `<strong>${score}/10</strong><span>${score === 10 ? "Excellent - every answer is correct." : score >= 8 ? "Great work. Review the highlighted questions and try for full marks." : "Review Chapter 5 and try again when ready."}</span>`;
  result.scrollIntoView({ behavior: "smooth", block: "center" });
});

resetButton.addEventListener("click", () => {
  quiz.reset();
  quiz.querySelectorAll(".quiz-question").forEach((question) => {
    question.classList.remove("correct", "incorrect");
    question.querySelector(".question-feedback").textContent = "";
  });
  result.className = "quiz-result";
  result.textContent = "";
  window.scrollTo({ top: 0, behavior: "smooth" });
});
