const questions = [
  { text: "What is the main difference between weather and climate?", options: ["Weather is global, while climate is local.", "Weather is short-term, while climate describes long-term averages and variations.", "Weather concerns temperature only, while climate concerns rainfall only.", "There is no meaningful difference."], answer: 1, explanation: "Weather describes short-term conditions; climate describes long-term averages and variations." },
  { text: "How do greenhouse gases contribute to global warming?", options: ["They absorb heat emitted by Earth.", "They prevent sunlight from reaching Earth.", "They remove oxygen from the atmosphere.", "They cool the oceans directly."], answer: 0, explanation: "Greenhouse gases absorb heat emitted by Earth, strengthening the greenhouse effect." },
  { text: "Which greenhouse gas has a warming effect of about 25–28 times that of CO₂?", options: ["Methane (CH₄)", "Nitrous oxide (N₂O)", "Oxygen (O₂)", "Hydrogen (H₂)"], answer: 0, explanation: "Methane has approximately 25–28 times the warming effect of CO₂." },
  { text: "Why is CO₂ equivalent (CO₂e) used?", options: ["To measure only emissions from electricity.", "To compare the warming effects of different greenhouse gases.", "To calculate atmospheric oxygen.", "To measure renewable-energy production."], answer: 1, explanation: "CO₂e provides a common unit for comparing the warming effects of different gases." },
  { text: "Approximately how high were global greenhouse-gas emissions in 2023?", options: ["5.4 GtCO₂e", "24 GtCO₂e", "54 GtCO₂e", "154 GtCO₂e"], answer: 2, explanation: "Global emissions reached approximately 54 GtCO₂e in 2023." },
  { text: "What is required to stabilize global temperatures?", options: ["Keeping emissions at their current level.", "Reducing emissions by 10%.", "Reaching net-zero emissions.", "Replacing methane with carbon dioxide."], answer: 2, explanation: "Because CO₂ accumulates, stabilizing temperature requires net-zero emissions." },
  { text: "What warming range does the Paris Agreement aim to stay within?", options: ["0°C to 0.5°C", "1.5°C to 2°C", "2.5°C to 3°C", "4°C to 5°C"], answer: 1, explanation: "The Paris Agreement aims to limit warming to between 1.5°C and 2°C." },
  { text: "Which response focuses on reducing emissions or increasing carbon sinks?", options: ["Adaptation", "Resilience", "Mitigation", "Compensation"], answer: 2, explanation: "Mitigation reduces greenhouse-gas emissions or increases carbon sinks." },
  { text: "What does climate adaptation mean?", options: ["Preparing societies and infrastructure for climate consequences.", "Measuring historical emissions only.", "Replacing all electricity with hydrogen.", "Preventing every possible disruption."], answer: 0, explanation: "Adaptation prepares societies and infrastructure for climate impacts." },
  { text: "What is a carbon budget?", options: ["The annual cost of renewable-energy subsidies.", "The remaining CO₂ that can be emitted while retaining a chance of meeting a temperature target.", "The amount of carbon stored in all forests.", "A company's yearly energy bill."], answer: 1, explanation: "A carbon budget is the remaining amount of CO₂ compatible with a temperature target." },
  { text: "What is the approximate 2050 emissions objective per person per year?", options: ["0.2 tCO₂e", "2 tCO₂e", "12 tCO₂e", "20 tCO₂e"], answer: 1, explanation: "The chapter gives an objective of about 2 tCO₂e per person per year by 2050." },
  { text: "Which option is a low-carbon, non-renewable primary energy source?", options: ["Coal", "Solar energy", "Nuclear energy", "Biomass"], answer: 2, explanation: "Nuclear energy is low-carbon but relies on a non-renewable fuel." },
  { text: "Which sequence correctly represents the energy chain?", options: ["Useful → final → secondary → primary", "Primary → secondary → final → useful", "Primary → useful → final → secondary", "Secondary → primary → useful → final"], answer: 1, explanation: "Energy moves from primary to secondary, final, and then useful energy." },
  { text: "Why are electricity and hydrogen not considered primary energy sources?", options: ["They cannot be transported.", "They are energy carriers produced from other energy sources.", "They always create more emissions than coal.", "They cannot provide useful energy."], answer: 1, explanation: "Electricity and hydrogen carry energy that has been converted from primary sources." },
  { text: "Which combination does the chapter identify as necessary for the energy transition?", options: ["Cleaner energy + efficiency + sufficiency", "More fossil fuels + lower prices + more consumption", "Electrification only", "Nuclear energy only"], answer: 0, explanation: "The transition must combine cleaner energy, efficiency, and sufficiency." }
];

const quiz = document.querySelector("#chapter1Quiz");
const questionHost = document.querySelector("#quizQuestions");
const result = document.querySelector("#quizResult");
const resetButton = document.querySelector("#resetQuiz");
const letters = ["a", "b", "c", "d"];

questionHost.innerHTML = questions.map((question, index) => `
  <fieldset class="quiz-question" data-question="q${index + 1}">
    <legend><span>${index + 1}</span> ${question.text}</legend>
    ${question.options.map((option, optionIndex) => `<label><input type="radio" name="q${index + 1}" value="${optionIndex}" /> ${letters[optionIndex].toUpperCase()}. ${option}</label>`).join("")}
    <p class="question-feedback" aria-live="polite"></p>
  </fieldset>
`).join("");

function markQuestion(questionElement, isCorrect, explanation) {
  questionElement.classList.toggle("correct", isCorrect);
  questionElement.classList.toggle("incorrect", !isCorrect);
  questionElement.querySelector(".question-feedback").textContent = `${isCorrect ? "Correct." : "Not quite."} ${explanation}`;
}

quiz.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(quiz);
  let score = 0;

  questions.forEach((question, index) => {
    const isCorrect = Number(formData.get(`q${index + 1}`)) === question.answer;
    if (isCorrect) score += 1;
    markQuestion(quiz.querySelector(`[data-question="q${index + 1}"]`), isCorrect, question.explanation);
  });

  const message = score === 15
    ? "Excellent — every answer is correct."
    : score >= 12
      ? "Great work. Review the highlighted questions and try for full marks."
      : "Review Chapter 1, then try again when you are ready.";

  result.className = `quiz-result show ${score >= 12 ? "strong-score" : ""}`;
  result.innerHTML = `<strong>${score}/15</strong><span>${message}</span>`;
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
