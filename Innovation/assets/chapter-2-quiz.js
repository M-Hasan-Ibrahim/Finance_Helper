const questions = [
  { text: "What distinguishes system thinking from an analytical approach?", options: ["It studies only the largest part of a problem.", "It studies interactions and the behaviour of the whole system.", "It avoids cause-and-effect relationships.", "It assumes that all systems are predictable."], answer: 1, explanation: "System thinking focuses on how interconnected elements collectively shape long-term system behaviour." },
  { text: "What is a system?", options: ["A collection of unrelated objects.", "A fixed plan with no external environment.", "A group of interconnected elements organized to achieve a purpose.", "Any problem containing more than two variables."], answer: 2, explanation: "A system consists of interconnected elements organized around a purpose." },
  { text: "Which example does the chapter classify as a complex system?", options: ["A bicycle", "A computer", "A city", "A single mechanical gear"], answer: 2, explanation: "A city contains many changing and interacting elements, making its behaviour complex." },
  { text: "What is emergent behaviour?", options: ["Behaviour imposed by one central component.", "Behaviour resulting from interactions among a system's parts.", "A predictable response caused by a single variable.", "A system returning immediately to equilibrium."], answer: 1, explanation: "Emergent behaviour arises from interactions, so it cannot always be understood by studying parts in isolation." },
  { text: "Why must causality not be confused with correlation?", options: ["Correlated variables always move in opposite directions.", "Causality applies only to simple systems.", "Variables can change together without one causing the other.", "Correlation can only be measured over short periods."], answer: 2, explanation: "Correlation shows that variables change together, but it does not prove that one causes the other." },
  { text: "What does a reinforcing feedback loop do?", options: ["Amplifies change and can produce continued growth or decline.", "Always stabilizes a system.", "Removes all delays from a system.", "Keeps every stock constant."], answer: 0, explanation: "A reinforcing loop strengthens an initial change, potentially creating accelerating growth or decline." },
  { text: "What is the main effect of a balancing feedback loop?", options: ["It creates exponential growth.", "It pushes the system toward equilibrium.", "It makes causality impossible to identify.", "It expands the system boundary."], answer: 1, explanation: "A balancing loop opposes change and tends to move a system toward a target or equilibrium." },
  { text: "Why can delays make system decisions difficult?", options: ["They prevent variables from being named.", "They separate an action from its result and can cause late or excessive reactions.", "They always turn balancing loops into reinforcing loops.", "They make all system changes reversible."], answer: 1, explanation: "When effects arrive later, decision-makers may misread the system and react too early, too late, or too strongly." },
  { text: "What is a tipping point?", options: ["A temporary correlation between two variables.", "A threshold after which a system rapidly shifts to another state.", "The moment when inflow equals outflow.", "The outer edge of a causal loop diagram."], answer: 1, explanation: "A tipping point is a threshold that can trigger a rapid and potentially difficult-to-reverse system change." },
  { text: "In a Causal Loop Diagram, what does a plus (+) link mean?", options: ["The variables change in the same direction.", "The variables have equal values.", "The relationship contains a delay.", "The variables change in opposite directions."], answer: 0, explanation: "A plus link means that an increase or decrease in one variable produces a change in the same direction in the other." },
  { text: "What is an important limitation of Causal Loop Diagrams?", options: ["They cannot show feedback loops.", "They are communication tools rather than simulations.", "They can represent only simple systems.", "They cannot include delays."], answer: 1, explanation: "CLDs help communicate structure and feedback, but they do not calculate or simulate behaviour over time." },
  { text: "Which option is an example of a stock?", options: ["Interest rate", "Water accumulated in a reservoir", "Monthly spending", "Births per year"], answer: 1, explanation: "A stock is a quantity accumulated over time, such as water, money, population, or atmospheric CO₂." },
  { text: "What happens when a stock's inflow equals its outflow?", options: ["The stock grows exponentially.", "The stock disappears.", "The stock remains in dynamic equilibrium.", "The outflow becomes a reinforcing loop."], answer: 2, explanation: "Equal inflow and outflow keep the stock level stable even though material may continue moving through it." },
  { text: "How should a system boundary be chosen?", options: ["It must always include the entire world.", "It depends on the question being studied.", "It should contain physical components only.", "It is naturally fixed and cannot be changed."], answer: 1, explanation: "There is no single natural boundary; the relevant boundary depends on the purpose and question of the analysis." },
  { text: "Which interventions are generally the most powerful?", options: ["Changing small numerical parameters only.", "Changing information display colors.", "Changing the system's goals and underlying paradigms.", "Treating isolated symptoms without changing structure."], answer: 2, explanation: "Goals and paradigms shape the whole system, so changing them has high leverage even though it is difficult." }
];

window.innovationQuizQuestions = questions;

const quiz = document.querySelector("#chapter2Quiz");
const questionHost = document.querySelector("#quizQuestions");
const result = document.querySelector("#quizResult");
const resetButton = document.querySelector("#resetQuiz");
const letters = ["1", "2", "3", "4"];

questionHost.innerHTML = questions.map((question, index) => `
  <fieldset class="quiz-question" data-question="q${index + 1}">
    <legend><span>${index + 1}</span> ${question.text}</legend>
    ${question.options.map((option, optionIndex) => `<label><input type="radio" name="q${index + 1}" value="${optionIndex}" /> ${letters[optionIndex]}. ${option}</label>`).join("")}
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
    const selected = formData.get(`q${index + 1}`);
    const isCorrect = selected !== null && Number(selected) === question.answer;
    if (isCorrect) score += 1;
    markQuestion(quiz.querySelector(`[data-question="q${index + 1}"]`), isCorrect, question.explanation);
  });

  const message = score === questions.length
    ? "Excellent — every answer is correct."
    : score >= 12
      ? "Great work. Review the highlighted questions and try for full marks."
      : "Review Chapter 2, then try again when you are ready.";

  result.className = `quiz-result show ${score >= 12 ? "strong-score" : ""}`;
  result.innerHTML = `<strong>${score}/${questions.length}</strong><span>${message}</span>`;
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
