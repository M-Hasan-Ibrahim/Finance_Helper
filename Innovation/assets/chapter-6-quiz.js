const questions = [
  { text: "Approximately what share of global greenhouse-gas emissions comes from digital technology?", options: ["0.1-0.5%", "3-4.4%", "12-15%", "More than 30%"], answer: 1, explanation: "The chapter estimates digital technology at approximately 3-4.4% of global greenhouse-gas emissions." },
  { text: "What does the growth in average web-page weight illustrate?", options: ["Digital services have become much lighter since 1995.", "Web services often accumulate increasing complexity and resource demand.", "Older devices always load modern pages faster.", "Page weight has no effect on networks or devices."], answer: 1, explanation: "The increase from about 14 KB in 1995 to roughly 3 MB illustrates the growing complexity and weight of digital services." },
  { text: "What does the chapter say about roughly 70% of requested digital features?", options: ["They are essential for accessibility.", "They are rarely or never used.", "They reduce manufacturing impacts.", "They are required by law."], answer: 1, explanation: "Many requested features receive little or no use, creating avoidable complexity from the design stage." },
  { text: "Which life-cycle stage can account for 60-70% of a digital device's impacts?", options: ["Manufacturing", "Daily charging only", "Software updates", "End-user training"], answer: 0, explanation: "Manufacturing can dominate impacts because it requires mineral extraction, water, energy, chemicals, and assembly." },
  { text: "Which action is among the strongest ways to reduce equipment impacts?", options: ["Replace devices whenever a faster model appears", "Extend device lifetime through protection and repair", "Keep unused devices in storage", "Increase the number of connected devices"], answer: 1, explanation: "Keeping and repairing equipment for longer avoids or delays the large impacts of manufacturing replacements." },
  { text: "Approximately what share of Internet traffic may be video and streaming?", options: ["1-5%", "10-20%", "40-80%", "Exactly 100%"], answer: 2, explanation: "The chapter estimates that video and streaming represent approximately 40-80% of Internet traffic." },
  { text: "During which phases does artificial intelligence consume energy and water?", options: ["Training only", "Inference only", "Training and inference", "Neither phase"], answer: 2, explanation: "AI requires computing resources during model training and during inference when users submit requests." },
  { text: "For popular generative AI systems, why can inference become especially important?", options: ["Daily user requests can collectively consume more energy than initial training.", "Inference requires no servers.", "Every request permanently reduces energy use.", "Training is repeated for every user prompt."], answer: 0, explanation: "Large numbers of user requests can make ongoing inference energy greater than the one-time training phase." },
  { text: "What is digital eco-design?", options: ["A one-time visual redesign", "A continuous process that reduces impacts across design, development, use, and end of life", "A method for increasing feature counts", "A policy limited to recycling hardware"], answer: 1, explanation: "Eco-design considers environmental impacts throughout the digital service's life cycle and improves them continuously." },
  { text: "How is responsible digital technology broader than eco-design alone?", options: ["It also includes accessibility, ethics, security, privacy, usefulness, and social sustainability.", "It focuses only on faster performance.", "It excludes environmental concerns.", "It applies only to individual users."], answer: 0, explanation: "Responsible digital technology combines environmental performance with inclusion, ethics, security, privacy, usefulness, and broader sustainability." },
  { text: "What characterizes a low-tech solution?", options: ["Maximum complexity and automation", "Simpler technology using fewer resources and limited energy while providing the needed service", "The newest hardware regardless of need", "A service with no maintenance plan"], answer: 1, explanation: "Low-tech solutions meet real needs with simpler, resource-light, energy-limited technologies." },
  { text: "Which individual practice reduces unnecessary video-related demand?", options: ["Always use the highest resolution", "Disable video when it is not useful and choose lower resolutions", "Stream the same content on several devices", "Leave automatic video enabled"], answer: 1, explanation: "Lower resolution and disabling unnecessary video reduce data transfer and processing demand." },
  { text: "Which web eco-design practice reduces network requests and third-party dependence?", options: ["Add more trackers and external scripts", "Reduce scripts, trackers, network calls, and external services", "Autoplay all media", "Duplicate every library"], answer: 1, explanation: "Limiting scripts, trackers, calls, and external services reduces data transfer, processing, and dependencies." },
  { text: "Why should eco-design support slow connections and older devices?", options: ["To extend hardware usefulness and improve accessibility", "To force users to replace equipment", "To increase page weight", "To prevent service decommissioning"], answer: 0, explanation: "Compatibility reduces premature equipment replacement and makes services more inclusive and resilient." },
  { text: "Which property must a well-written good-practice rule have?", options: ["It should combine many unrelated objectives.", "It should be objectively verifiable.", "It should avoid stating a difficulty level.", "It should use vague language that cannot be tested."], answer: 1, explanation: "A useful rule should be positive, clear, understandable, objectively verifiable, and assigned a difficulty level." }
];

window.innovationQuizQuestions = questions;

const quiz = document.querySelector("#chapter6Quiz");
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
    ? "Excellent - every answer is correct."
    : score >= 12
      ? "Great work. Review the highlighted questions and try for full marks."
      : "Review Chapter 6, then try again when you are ready.";

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
