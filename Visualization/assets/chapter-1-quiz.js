const quiz = document.querySelector("#chapter1Quiz");
const result = document.querySelector("#quizResult");
const resetButton = document.querySelector("#resetQuiz");

const pipelineOptions = [
  "Source Data",
  "Data Tables",
  "View Abstractions",
  "Views",
  "Data Transformations",
  "Visual Mappings / Visual Design",
  "View Transformations"
];

const answers = {
  q1: "c",
  q2: "false",
  q3: "a",
  q4: {
    q4a: "Source Data",
    q4b: "Data Tables",
    q4c: "View Abstractions",
    q4d: "Views",
    q4e: "Data Transformations",
    q4f: "Visual Mappings / Visual Design",
    q4g: "View Transformations"
  },
  q5: "b"
};

document.querySelectorAll(".pipeline-question select").forEach((select) => {
  pipelineOptions.forEach((optionText) => {
    const option = document.createElement("option");
    option.value = optionText;
    option.textContent = optionText;
    select.append(option);
  });
});

function markQuestion(question, isCorrect, message) {
  question.classList.toggle("correct", isCorrect);
  question.classList.toggle("incorrect", !isCorrect);
  const feedback = question.querySelector(".question-feedback");
  feedback.textContent = `${isCorrect ? "Correct." : "Not quite."} ${message}`;
}

quiz.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(quiz);
  let score = 0;

  const simpleQuestions = [
    ["q1", "The definition ends with “amplify cognition.”"],
    ["q2", "Visualization aims to support insight and thinking, not merely make pictures."],
    ["q3", "Scientific Visualization commonly uses direct spatial mappings."],
    ["q5", "Vision has the highest bandwidth among human senses."]
  ];

  simpleQuestions.forEach(([name, explanation]) => {
    const isCorrect = formData.get(name) === answers[name];
    if (isCorrect) score += 1;
    markQuestion(quiz.querySelector(`[data-question="${name}"]`), isCorrect, explanation);
  });

  const pipelineCorrect = Object.entries(answers.q4).every(
    ([name, answer]) => formData.get(name) === answer
  );
  if (pipelineCorrect) score += 1;
  markQuestion(
    quiz.querySelector('[data-question="q4"]'),
    pipelineCorrect,
    "A–D are the pipeline stages; E–G are the transformations between them."
  );

  result.className = `quiz-result show ${score >= 4 ? "strong-score" : ""}`;
  result.innerHTML = `<strong>${score}/5</strong><span>${score === 5 ? "Excellent—every answer is correct." : score >= 4 ? "Great work. Review the highlighted question and try for full marks." : "Review Chapter 1 and try again when ready."}</span>`;
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
