const questions = [
  { text: "Why must sustainable IT take a systemic view of the organization?", options: ["IT is independent of physical resources.", "Technical, economic, social, and environmental systems are interconnected.", "Only websites create environmental impacts.", "Employee behaviour is the only relevant factor."], answer: 1, explanation: "A sustainable IT strategy must account for interconnected systems and IT's dependence on energy, water, metals, and organizational decisions." },
  { text: "Which action is part of the Shift Project's six-area framework?", options: ["Measure the complete IT footprint", "Replace all equipment every year", "Eliminate environmental monitoring", "Focus only on employee emails"], answer: 0, explanation: "The framework begins with measuring the complete footprint and also covers culture, stakeholders, strategy, systems, and governance." },
  { text: "What should employee awareness prioritize?", options: ["Low-impact symbolic actions only", "High-impact actions such as reducing equipment production and extending lifetime", "Increasing data storage", "Replacing repair with recycling"], answer: 1, explanation: "Training should focus attention on the major impacts, especially equipment production and useful lifetime." },
  { text: "Approximately what annual IT footprint per employee is given for SNCF?", options: ["50 kgCO₂e", "500 kgCO₂e", "5,000 kgCO₂e", "50,000 kgCO₂e"], answer: 1, explanation: "The chapter gives an estimate of about 500 kgCO₂e per SNCF employee each year." },
  { text: "Which purchasing policy best supports sustainable IT?", options: ["Buy the most powerful equipment regardless of need", "Buy durable and repairable equipment matched to real needs", "Select products based only on purchase price", "Replace devices before warranties expire"], answer: 1, explanation: "Responsible purchasing favors durable, repairable, appropriately sized equipment and considers environmental and social criteria." },
  { text: "How can large organizations influence the IT market?", options: ["By removing all requirements from contracts", "By adding environmental and social requirements to supplier contracts", "By purchasing only from one provider", "By avoiding hardware reuse"], answer: 1, explanation: "Large purchasing volumes allow organizations to push suppliers toward stronger environmental and social practices." },
  { text: "What should sustainable IT governance provide?", options: ["Objectives, standards, assessment frameworks, KPIs, and responsible representatives", "Technical efficiency without organizational decisions", "A ban on all digital projects", "Only an annual carbon number"], answer: 0, explanation: "Governance connects strategic objectives to standards, architecture, assessment, indicators, and everyday team decisions." },
  { text: "Why should an organization impose limits on equipment, data, software, and services?", options: ["To act before physical environmental constraints impose harsher limits", "To ensure every application grows indefinitely", "To make all cloud resources permanent", "To avoid measuring resource use"], answer: 0, explanation: "Planned limits allow organizations to control demand before scarcity, pollution, or regulation forces abrupt constraints." },
  { text: "What should software teams question before developing a new application?", options: ["Whether the project has genuine business value and environmental justification", "Whether more frameworks can be added", "Whether data can be stored forever", "Whether the software can require newer devices"], answer: 0, explanation: "Useful, maintainable, efficient software begins by questioning the need and value of the proposed service." },
  { text: "What does the chapter recommend for unnecessary data?", options: ["Create it and archive it permanently", "Duplicate it across multiple systems", "Avoid creating it and do not store it indefinitely", "Move it to the cloud without review"], answer: 2, explanation: "Data sufficiency means avoiding unnecessary creation and defining retention, archiving, and deletion policies." },
  { text: "Why are environmental constraints needed alongside FinOps?", options: ["FinOps cannot track costs.", "Cost efficiency alone may encourage more consumption through rebound effects.", "Environmental constraints always increase resource use.", "FinOps applies only to physical servers."], answer: 1, explanation: "Better cost allocation can stimulate additional use, so explicit environmental limits are needed to control total demand." },
  { text: "What does IT for Green mean?", options: ["Using digital technology to reduce impacts outside IT for a useful environmental purpose", "Painting data centres green", "Measuring only the IT department's emissions", "Replacing all physical services with digital ones"], answer: 0, explanation: "IT for Green uses digital solutions to support environmental improvements in other activities." },
  { text: "What condition must an IT for Green solution satisfy?", options: ["Its environmental benefit must exceed the footprint of the digital system required", "It must use the newest possible hardware", "It must eliminate all human decisions", "Its own footprint does not need to be measured"], answer: 0, explanation: "The avoided impacts must be compared with the complete footprint of creating and operating the digital solution." },
  { text: "Why is Wi-Fi connectivity technically difficult on high-speed TGV trains?", options: ["Trains never pass through network cells.", "Speed, tunnels, cell handovers, and the train body's Faraday-cage effect complicate connections.", "Passenger devices cannot use Wi-Fi.", "Rail lines have no telecommunications infrastructure."], answer: 1, explanation: "High speed, rapid cell transitions, tunnels, and signal shielding make stable rail connectivity challenging." },
  { text: "Why are technical improvements alone insufficient for managing TGV streaming impacts?", options: ["They may create new uses and rebound effects, so usefulness and demand must also be managed.", "Compression always increases data volume.", "Technical improvements cannot reduce energy use.", "Passengers never change their behaviour."], answer: 0, explanation: "More efficient connectivity can encourage additional streaming, so limits, messaging, and service-need decisions remain necessary." }
];

const quiz = document.querySelector("#chapter5Quiz");
const questionHost = document.querySelector("#quizQuestions");
const result = document.querySelector("#quizResult");
const resetButton = document.querySelector("#resetQuiz");
const letters = ["A", "B", "C", "D"];

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
    const isCorrect = Number(formData.get(`q${index + 1}`)) === question.answer;
    if (isCorrect) score += 1;
    markQuestion(quiz.querySelector(`[data-question="q${index + 1}"]`), isCorrect, question.explanation);
  });

  const message = score === questions.length
    ? "Excellent - every answer is correct."
    : score >= 12
      ? "Great work. Review the highlighted questions and try for full marks."
      : "Review Chapter 5, then try again when you are ready.";

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
