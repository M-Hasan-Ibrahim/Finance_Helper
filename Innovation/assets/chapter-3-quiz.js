const questions = [
  { text: "During which stages does digital technology create environmental impacts?", options: ["Use only", "Manufacturing and use only", "Manufacturing, use, and end of life", "End of life only"], answer: 2, explanation: "Digital impacts occur throughout the entire life cycle: manufacturing, use, and end of life." },
  { text: "What does double materiality examine?", options: ["Only the carbon emissions of data centres", "Both digital technology's environmental impacts and environmental risks to digital organizations", "The financial value of two digital products", "Only the recyclability of electronic devices"], answer: 1, explanation: "Double materiality considers impacts in both directions: digital technology affects the environment, and environmental change creates risks for organizations." },
  { text: "Approximately how many types of metals may be required to manufacture digital equipment?", options: ["Fewer than 5", "About 10", "More than 50", "More than 500"], answer: 2, explanation: "The chapter states that digital equipment can require more than 50 types of metals." },
  { text: "Why can declining ore quality increase environmental impacts?", options: ["Less metal needs to be processed.", "More energy, water, and material must be used to extract the same amount of metal.", "Mining becomes completely automated.", "The metals become easier to recycle."], answer: 1, explanation: "Lower-quality ores require processing more material and using more resources for the same metal output." },
  { text: "What does the chapter identify as a major circularity problem?", options: ["All metals are recycled too frequently.", "Most devices contain only renewable materials.", "Many metals are poorly recycled and much electronic waste is not collected.", "Recycling creates more devices than consumers need."], answer: 2, explanation: "Digital circularity remains weak because metal recycling rates are low and much e-waste escapes collection." },
  { text: "Approximately how much pure water may be required to produce one electronic chip?", options: ["3.2 litres", "12 litres", "32 litres", "320 litres"], answer: 2, explanation: "The chapter gives an estimate of around 32 litres of pure water for one electronic chip." },
  { text: "What share of French electricity consumption did digital technology represent in 2022?", options: ["1%", "4%", "11%", "25%"], answer: 2, explanation: "Digital technology represented approximately 11% of French electricity consumption in 2022." },
  { text: "Why does device manufacturing dominate France's digital emissions?", options: ["France has no data centres.", "France's electricity is relatively low carbon.", "French devices require no electricity during use.", "Manufacturing occurs entirely within France."], answer: 1, explanation: "Because French electricity is relatively low carbon, the embodied emissions from manufacturing account for a larger share." },
  { text: "Which action directly addresses the large manufacturing share of digital impacts?", options: ["Replacing devices more often", "Extending equipment lifetime", "Increasing video resolution", "Building more infrastructure"], answer: 1, explanation: "Keeping equipment longer avoids or delays the manufacturing impacts of replacement devices." },
  { text: "Why can total digital consumption rise even when computing becomes more efficient?", options: ["Efficiency always increases energy use per operation.", "The number of devices and operations can grow faster than efficiency improves.", "Efficient equipment cannot connect to networks.", "Efficiency eliminates the need for infrastructure."], answer: 1, explanation: "Per-operation savings can be overwhelmed when total usage, data, devices, and infrastructure grow faster." },
  { text: "What is the rebound effect, also called the Jevons paradox?", options: ["Efficiency makes a service harder to use and reduces demand.", "Efficiency lowers cost or effort, encouraging more use and cancelling some expected savings.", "Old devices become more efficient at end of life.", "Resource scarcity automatically reduces all digital usage."], answer: 1, explanation: "The rebound effect occurs when efficiency stimulates additional consumption that offsets expected environmental gains." },
  { text: "When is optimization most likely to deliver lasting environmental benefits?", options: ["When total consumption has limits or constraints", "When services are made free", "When all demand is encouraged", "When infrastructure expands automatically"], answer: 0, explanation: "Efficiency is more likely to reduce total impact when limits prevent usage growth from absorbing the savings." },
  { text: "How can new digital infrastructure create additional demand?", options: ["Companies encourage new uses to make the infrastructure profitable.", "Infrastructure permanently fixes the number of users.", "New infrastructure makes digital services unavailable.", "Infrastructure removes economic incentives."], answer: 0, explanation: "Once infrastructure exists, firms have incentives to increase usage and revenue, so infrastructure can generate new needs." },
  { text: "What is the purpose of France's REEN law?", options: ["To increase electronic-waste exports", "To reduce the environmental footprint of digital technology", "To prohibit all cloud services", "To replace regulation with voluntary advertising"], answer: 1, explanation: "The REEN law was introduced to reduce digital technology's environmental footprint." },
  { text: "Which actions does the chapter describe as the most effective systemic interventions?", options: ["Improving technical efficiency only", "Changing rules, objectives, business models, and underlying paradigms", "Increasing data production without limits", "Treating electronic waste only after disposal"], answer: 1, explanation: "High-leverage action changes the structures, incentives, goals, and beliefs that drive continued digital growth." },
  { text: "Which statement best describes the stock/flow view of the digital system?", options: ["Data, terminals, and infrastructures are flows, while traffic is a stock.", "Only electricity consumption matters because physical equipment is negligible.", "Digital technology has no meaningful stocks because it is immaterial.", "Data and infrastructure can be treated as growing stocks, while traffic, production, and usage are flows that feed the system."], answer: 3, explanation: "Data and infrastructure accumulate as stocks, while production, traffic, and usage act as flows that expand and sustain the digital system." },
  { text: "Why are regulation and digital sobriety preferable to waiting for scarcity or pollution to limit growth?", options: ["Resource scarcity has no effect on digital systems.", "Regulation eliminates all environmental impacts instantly.", "Sobriety is only a communication strategy.", "Regulation and sobriety are chosen balancing loops, while scarcity and environmental damage are suffered balancing loops."], answer: 3, explanation: "Planned regulation and sobriety constrain growth deliberately, instead of allowing harmful physical limits to impose change after damage occurs." },
  { text: "What is the best interpretation of the opposition between IT for Green and IT for Brown?", options: ["Digital technology is always environmentally beneficial if it uses artificial intelligence.", "The environmental value of digital technology depends on the final purpose and system it reinforces.", "Green IT only concerns recycling computers.", "IT for Brown means old technology, while IT for Green means new technology."], answer: 1, explanation: "A digital solution must be judged by the wider activity and system it supports, not by digital technology alone." }
];

window.innovationQuizQuestions = questions;

const quiz = document.querySelector("#chapter3Quiz");
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

  const strongScore = Math.ceil(questions.length * 0.8);
  const message = score === questions.length
    ? "Excellent - every answer is correct."
    : score >= strongScore
      ? "Great work. Review the highlighted questions and try for full marks."
      : "Review Chapter 3, then try again when you are ready.";

  result.className = `quiz-result show ${score >= strongScore ? "strong-score" : ""}`;
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
