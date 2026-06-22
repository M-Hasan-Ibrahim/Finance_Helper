const questions = [
  { text: "What does the 2020 AGEC Law address in relation to software?", options: ["It requires all software to use artificial intelligence.", "It limits software obsolescence by separating security updates from optional updates.", "It prohibits security updates on older devices.", "It applies only to data-centre cooling."], answer: 1, explanation: "The AGEC Law helps limit software obsolescence by distinguishing essential security updates from optional changes." },
  { text: "What is one objective of the 2021 REEN Law?", options: ["Promoting education, reuse, refurbishment, and monitoring of digital impacts", "Increasing mandatory device replacement", "Removing environmental reporting", "Prohibiting web accessibility standards"], answer: 0, explanation: "The REEN Law promotes awareness, reuse, refurbishment, and better monitoring of digital environmental impacts." },
  { text: "What does RGESN stand for?", options: ["Regional Guide for Energy-Saving Networks", "General Framework for the Eco-design of Digital Services", "Regulation for Global Electronic Security Numbers", "Reference Guide for Environmental Server Networks"], answer: 1, explanation: "RGESN is the General Framework for the Eco-design of Digital Services." },
  { text: "Which French framework focuses on accessibility?", options: ["RGAA", "RGPD", "RGS", "RGI"], answer: 0, explanation: "RGAA is the French framework for digital accessibility." },
  { text: "Which framework focuses on personal-data protection?", options: ["RGESN", "RGI", "RGPD", "RGS"], answer: 2, explanation: "RGPD governs personal-data protection, while the other frameworks address eco-design, interoperability, or security." },
  { text: "How should RGESN be used before development?", options: ["Ignore criteria until deployment", "Understand and select the relevant criteria", "Calculate only hosting costs", "Publish a maturity score before defining the service"], answer: 1, explanation: "Before development, teams should identify and select the RGESN criteria relevant to the project." },
  { text: "What should teams do with RGESN during development?", options: ["Verify compliance and monitor KPIs", "Remove all measurements", "Audit only after the service is retired", "Focus exclusively on visual branding"], answer: 0, explanation: "During development, RGESN supports compliance checks and monitoring of environmental indicators." },
  { text: "How many eco-design criteria are included in the 2024 RGESN framework?", options: ["9", "42", "78", "115"], answer: 2, explanation: "The 2024 RGESN edition contains 78 criteria organized into nine topics." },
  { text: "Why must the scope of an environmental measurement tool be understood?", options: ["Every tool measures the entire digital system identically.", "Tools may assess different layers such as frontend, network, backend, cloud, or servers.", "Measurement scope affects price only.", "Tool scope is unrelated to result comparisons."], answer: 1, explanation: "Results are not directly comparable when tools examine different parts of the system." },
  { text: "What does environmental measurement contribute to eco-design?", options: ["It establishes a baseline, identifies harmful elements, and verifies improvements.", "It replaces the need to implement changes.", "It guarantees that every feature is useful.", "It measures financial revenue only."], answer: 0, explanation: "Measurement supports continuous improvement by showing the initial state, priorities, and actual results." },
  { text: "What is decoded data?", options: ["Only the HTTP headers sent through the network", "The complete resource size after decompression", "The number of user accounts", "Data deleted after a session"], answer: 1, explanation: "Decoded data is the full size of resources after transfer compression has been removed." },
  { text: "Which resource generally needs direct file optimization rather than relying mainly on transfer compression?", options: ["HTML", "JSON", "JavaScript", "Images"], answer: 3, explanation: "Images, audio, video, fonts, PDFs, and ZIP files generally need the source files themselves to be optimized." },
  { text: "What does proportionate technology mean?", options: ["Always choose the most complex CMS and framework.", "Match the technical solution to the actual service need.", "Use artificial intelligence for every feature.", "Build for maximum hypothetical traffic regardless of reality."], answer: 1, explanation: "A sober service uses technology whose complexity and scale are proportionate to its genuine requirements." },
  { text: "What is a digital service's functional unit?", options: ["The actual service delivered, such as buying a ticket or reading an article", "The number of servers in a data centre", "The legal name of the development team", "The total number of possible features"], answer: 0, explanation: "The functional unit defines the real user service that the digital system is intended to provide." },
  { text: "Which design choice best supports a sober user journey?", options: ["Display every possible feature at once", "Add steps so users remain longer", "Help users complete their goal directly and leave quickly", "Use heavy technology even for simple content"], answer: 2, explanation: "Sober design prioritizes useful functions, direct content, fewer steps, and efficient completion of the user's goal." },
  { text: "Why does the legal and reference framework not remove the need for critical thinking?", options: ["Legal references are unrelated to eco-design.", "RGESN applies only to public institutions.", "Criteria guide decisions, but teams still need to interpret needs, trade-offs, metrics, and context.", "Technical metrics are always more important than user needs."], answer: 2, explanation: "Frameworks structure decisions, but teams must still judge relevance, trade-offs, measurement limits, and the real context of use." }
];

window.innovationQuizQuestions = questions;

const quiz = document.querySelector("#chapter7Quiz");
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
      : "Review Chapter 7, then try again when you are ready.";

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
