const quiz = document.querySelector("#chapter2Quiz");
const result = document.querySelector("#quizResult");
const resetButton = document.querySelector("#resetQuiz");

const explanations = {
  q1: "Parallel coordinates display many dimensions and reveal value distributions along their axes.",
  q2: "Filtering and selection reduce clutter and make patterns easier to see.",
  q3: "Histograms aggregate values into bins, while box plots summarize distributions using quartiles and outliers.",
  q4: "Marks are visible objects—such as points, lines, and areas—used to encode data.",
  q5: "Points, lines, areas, and volumes are the standard mark types."
};

function markQuestion(question, isCorrect, explanation) {
  question.classList.toggle("correct", isCorrect);
  question.classList.toggle("incorrect", !isCorrect);
  question.querySelector(".question-feedback").textContent =
    `${isCorrect ? "Correct." : "Not quite."} ${explanation}`;
}

function exactSelection(formData, name, expected) {
  const selected = formData.getAll(name).sort();
  return selected.join(",") === [...expected].sort().join(",");
}

quiz.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(quiz);
  let score = 0;

  const q1Correct = exactSelection(formData, "q1", ["a", "b"]);
  if (q1Correct) score += 1;
  markQuestion(quiz.querySelector('[data-question="q1"]'), q1Correct, explanations.q1);

  const q3Correct = exactSelection(formData, "q3", ["a", "d"]);
  if (q3Correct) score += 1;
  markQuestion(quiz.querySelector('[data-question="q3"]'), q3Correct, explanations.q3);

  const answers = { q2: "true", q4: "b", q5: "a" };
  Object.entries(answers).forEach(([name, answer]) => {
    const isCorrect = formData.get(name) === answer;
    if (isCorrect) score += 1;
    markQuestion(quiz.querySelector(`[data-question="${name}"]`), isCorrect, explanations[name]);
  });

  result.className = `quiz-result show ${score >= 4 ? "strong-score" : ""}`;
  result.innerHTML = `<strong>${score}/5</strong><span>${score === 5 ? "Excellent—every answer is correct." : score >= 4 ? "Great work. Review the highlighted question and try for full marks." : "Review Chapter 2 and try again when ready."}</span>`;
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
