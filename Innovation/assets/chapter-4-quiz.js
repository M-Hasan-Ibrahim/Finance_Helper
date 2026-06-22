const questions = [
  { text: "Which method is best suited to comparing the environmental impacts of products, services, or technical solutions?", options: ["Life Cycle Assessment", "A financial audit", "Scope 1 reporting only", "Power Usage Effectiveness"], answer: 0, explanation: "Life Cycle Assessment compares multiple impacts across the full life cycle of a product or service." },
  { text: "What does the GHG Protocol provide?", options: ["A repair standard for electronic devices", "An international standard for organizational carbon accounting", "A cloud-pricing calculator", "A method for measuring biodiversity only"], answer: 1, explanation: "The GHG Protocol is the widely used international framework for organizational greenhouse-gas accounting." },
  { text: "Which IT-related source belongs to Scope 1?", options: ["Purchased electricity", "Manufacturing a laptop", "Fuel used by a backup generator", "An external cloud service"], answer: 2, explanation: "Scope 1 covers direct emissions, including fuel combustion in backup generators and refrigerant leaks." },
  { text: "Which source is generally classified as Scope 2?", options: ["Purchased electricity", "Equipment manufacturing", "Employee commuting", "Cloud-provider hardware"], answer: 0, explanation: "Scope 2 covers indirect emissions from purchased electricity." },
  { text: "Equipment manufacturing and external cloud services are generally included in which scope?", options: ["Scope 1", "Scope 2", "Scope 3", "They are outside all scopes"], answer: 2, explanation: "Manufacturing, transport, disposal, cloud, and other external IT services are generally Scope 3." },
  { text: "What does location-based electricity accounting use?", options: ["The supplier's marketing claims", "The average electricity mix where power is physically consumed", "Only renewable-energy certificates", "The electricity mix where the device was manufactured"], answer: 1, explanation: "Location-based accounting reflects the regional grid mix at the place of physical consumption." },
  { text: "Why may market-based renewable certificates fail to represent physical electricity consumption?", options: ["Certificates always increase electricity use.", "They may not create new renewable production at the same place and time.", "They measure water rather than electricity.", "They include manufacturing emissions twice."], answer: 1, explanation: "Certificates do not necessarily add renewable generation or match the location and timing of actual consumption." },
  { text: "What is the purpose of an LCA functional unit?", options: ["To define the exact service being evaluated", "To list every employee in an organization", "To calculate a data centre's floor area", "To select an electricity supplier"], answer: 0, explanation: "The functional unit precisely defines the service used as the basis for comparison, such as watching a film for one hour." },
  { text: "Why can estimates for an action such as sending an email vary greatly?", options: ["Emails have no measurable infrastructure.", "Results depend on assumptions about devices, lifespan, country, network, and usage.", "All studies use identical boundaries.", "Only the email's text length matters."], answer: 1, explanation: "Different boundaries and assumptions can substantially change an environmental estimate." },
  { text: "What question does consequential analysis primarily answer?", options: ["How should existing infrastructure emissions be allocated?", "What emissions are directly caused or avoided by a change?", "How much did the organization spend?", "Which reporting standard is most popular?"], answer: 1, explanation: "Consequential analysis evaluates the physical change in emissions resulting from a decision or change in usage." },
  { text: "Why does sending one fewer email usually avoid very little immediate impact?", options: ["Email has no environmental footprint.", "One email rarely changes the number of servers or devices required.", "Email electricity is always renewable.", "Attributional analysis prohibits reduction actions."], answer: 1, explanation: "The infrastructure remains in place, so a tiny usage change generally causes little immediate physical change." },
  { text: "Which description best fits bottom-up measurement?", options: ["Quick estimates based mainly on spending ratios", "A detailed inventory of equipment, energy, manufacturing impacts, and lifetimes", "Measurement based only on company revenue", "A method that ignores device quantities"], answer: 1, explanation: "Bottom-up measurement builds a detailed technical inventory and is more accurate but data intensive." },
  { text: "Why can replacing working equipment too early increase total emissions?", options: ["New devices never save electricity.", "Manufacturing emissions may exceed the operational savings.", "Old equipment has no manufacturing footprint.", "Electricity use is always Scope 3."], answer: 1, explanation: "The embodied impact of manufacturing a replacement may be larger than the electricity saved during use." },
  { text: "What does a data-centre PUE close to 1 indicate?", options: ["The data centre uses no water.", "Little additional energy is used beyond the IT equipment.", "All hardware has been recycled.", "The electricity is carbon free."], answer: 1, explanation: "A PUE near 1 means cooling and facility overhead are small relative to IT equipment energy." },
  { text: "Why is moving to the cloud not automatically environmentally beneficial?", options: ["Cloud systems never use efficient hardware.", "Complete impacts such as manufacturing, water, replacement, and rebound effects must still be measured.", "Cloud services cannot use renewable electricity.", "Cloud emissions belong only to Scope 1."], answer: 1, explanation: "Efficiency or carbon-neutrality claims do not replace a complete assessment of the cloud service's physical impacts." },
  { text: "Why should product carbon footprints provided by manufacturers be used carefully?", options: ["They are always intentionally false.", "Results depend strongly on assumptions, scope, lifetime, usage scenario, and methodology.", "They never include manufacturing.", "They are only useful for Scope 2."], answer: 1, explanation: "Manufacturer footprints can be useful, but comparisons require checking boundaries, assumptions, lifetimes, scenarios, and methods." },
  { text: "What does the bottom-up annualized-impact formula mainly show?", options: ["Only electricity matters for workplace IT.", "Equipment lifetime has no effect on annualized impact.", "Embodied construction and end-of-life impacts must be considered together with use-phase electricity.", "A bottom-up approach removes the need for inventories."], answer: 2, explanation: "Annual impact combines embodied impacts spread over equipment lifetime with annual electricity use multiplied by its emission factor." },
  { text: "When is a top-down measurement approach useful?", options: ["When a complete detailed inventory is already available.", "When only high-level financial, location, or ratio data is available and an order of magnitude is needed.", "When the goal is to avoid making assumptions.", "When Scope 3 must be ignored."], answer: 1, explanation: "Top-down methods provide quicker approximate results when detailed technical inventories are unavailable." },
  { text: "What is the best way to reduce the Scope 2 emissions of a data centre?", options: ["Buy renewable certificates and stop the analysis there.", "Move accounting emissions elsewhere without questioning usage.", "Focus only on server efficiency without changing demand.", "Combine real electricity-demand reductions, efficiency, lower location-based carbon intensity, and preferably direct low-carbon supply."], answer: 3, explanation: "Credible Scope 2 reduction combines lower demand, efficient operation, a cleaner physical grid or location, and genuine low-carbon supply rather than accounting claims alone." }
];

window.innovationQuizQuestions = questions;

const quiz = document.querySelector("#chapter4Quiz");
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
      : "Review Chapter 4, then try again when you are ready.";

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
