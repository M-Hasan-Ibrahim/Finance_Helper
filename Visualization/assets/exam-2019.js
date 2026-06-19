const yearTabs = document.querySelectorAll("[data-exam-tab]");
const yearPanels = document.querySelectorAll(".exam-year-panel");
const exam = document.querySelector("#exam2019Form");
const result = document.querySelector("#examResult");

yearTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    yearTabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle("active", active);
      item.setAttribute("aria-selected", String(active));
    });
    yearPanels.forEach((panel) => {
      panel.hidden = panel.id !== tab.dataset.examTab;
    });
  });
});

const letters = ["", "A", "B", "C", "D", "E", "F"];
document.querySelectorAll(".exam-matching-grid select").forEach((select) => {
  letters.forEach((letter) => {
    const option = document.createElement("option");
    option.value = letter;
    option.textContent = letter || "No letter";
    select.append(option);
  });
});

const answers = {
  q1: "true", q2: "false", q3: "true",
  q4: "true", q5: "false", q6: "true"
};
const explanations = {
  q1: "A good visualization uses space efficiently and shows meaningful detail.",
  q2: "Not always. Bar charts usually need zero; trend charts may use a clearly marked non-zero scale.",
  q3: "Greyscale has a natural light-to-dark ordering.",
  q4: "A clique appears as a dense square block in an adjacency matrix.",
  q5: "Rails constrain position, but do not necessarily determine size.",
  q6: "All three systems map values to position, color, size, shape, and other visual properties.",
  q7: "A = Data Tables, B = View Abstractions, C = Views, D = Data Transformations, E = Visual Mappings, F = View Transformations. Visual Design and Data Cleaning are blank."
};

function mark(question, correct, explanation) {
  question.classList.toggle("correct", correct);
  question.classList.toggle("incorrect", !correct);
  question.querySelector(".question-feedback").textContent =
    `${correct ? "Correct." : "Not quite."} ${explanation}`;
}

exam.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(exam);
  let score = 0;

  Object.entries(answers).forEach(([name, answer]) => {
    const correct = data.get(name) === answer;
    if (correct) score += 1;
    mark(exam.querySelector(`[data-question="${name}"]`), correct, explanations[name]);
  });

  const pipeline = {
    q7_view_abstractions: "B", q7_data_transformations: "D",
    q7_view_transformations: "F", q7_views: "C",
    q7_visual_mappings: "E", q7_visual_design: "",
    q7_data_cleaning: "", q7_data_tables: "A"
  };
  const q7Correct = Object.entries(pipeline).every(([name, answer]) => data.get(name) === answer);
  if (q7Correct) score += 1;
  mark(exam.querySelector('[data-question="q7"]'), q7Correct, explanations.q7);

  result.className = `quiz-result show ${score >= 6 ? "strong-score" : ""}`;
  result.innerHTML = `<strong>${score}/7</strong><span>Objective section score. Review your written answers using the model-answer panels below each question.</span>`;
  result.scrollIntoView({ behavior: "smooth", block: "center" });
});

document.querySelector("#resetExam").addEventListener("click", () => {
  exam.reset();
  exam.querySelectorAll(".quiz-question").forEach((question) => {
    question.classList.remove("correct", "incorrect");
    question.querySelector(".question-feedback").textContent = "";
  });
  exam.querySelectorAll("details").forEach((details) => {
    details.open = false;
  });
  result.className = "quiz-result";
  result.textContent = "";
  window.scrollTo({ top: 0, behavior: "smooth" });
});


const exam2018 = document.querySelector("#exam2018Form");
const exam2018Result = document.querySelector("#exam2018Result");
const answers2018 = {
  "2018q1": "false", "2018q2": "false", "2018q3": "false",
  "2018q4": "true", "2018q5": "false", "2018q6": "false"
};
const explanations2018 = {
  "2018q1": "A good visualization should be understandable for its intended users and intended task. It does not need to be understandable by every possible user.",
  "2018q2": "Bar charts usually should start at zero because bar length encodes magnitude. But line charts or trend charts can use a non-zero baseline if the axis is clear and not misleading.",
  "2018q3": "Greyscale is useful for relative/order judgments, because light-to-dark has an order. It is not good for exact absolute values, because exact grey levels are hard to read and depend on context/background.",
  "2018q4": "Treemaps are designed for hierarchical data, especially when the hierarchy is homogeneous and when you want a compact, space-filling view. They show hierarchy using containment/nested rectangles. However, node-link trees are better for tracing exact paths/topology.",
  "2018q5": "In many visualizations, position is chosen by the designer or by a layout algorithm. For example, in abstract data or graph layouts, positions are not directly given by the data.",
  "2018q6": "Interactive visualization is especially useful for exploration, when the user does not know exactly what to look for yet."
};

exam2018.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(exam2018);
  let score = 0;
  Object.entries(answers2018).forEach(([name, answer]) => {
    const correct = data.get(name) === answer;
    if (correct) score += 1;
    mark(exam2018.querySelector(`[data-question="${name}"]`), correct, explanations2018[name]);
  });
  exam2018Result.className = `quiz-result show ${score >= 5 ? "strong-score" : ""}`;
  exam2018Result.innerHTML = `<strong>${score}/6</strong><span>Objective section score. Review Questions 7–15 using the provided answers.</span>`;
  exam2018Result.scrollIntoView({ behavior: "smooth", block: "center" });
});

document.querySelector("#resetExam2018").addEventListener("click", () => {
  exam2018.reset();
  exam2018.querySelectorAll(".quiz-question").forEach((question) => { question.classList.remove("correct", "incorrect"); question.querySelector(".question-feedback").textContent = ""; });
  exam2018.querySelectorAll("details").forEach((details) => { details.open = false; });
  exam2018Result.className = "quiz-result"; exam2018Result.textContent = "";
  window.scrollTo({ top: 0, behavior: "smooth" });
});const exam2017 = document.querySelector("#exam2017Form");
const exam2017Result = document.querySelector("#exam2017Result");
const answers2017 = {
  "2017q1": "false", "2017q2": "true", "2017q3": "true",
  "2017q4": "false", "2017q5": "false", "2017q6": "false"
};
const explanations2017 = {
  "2017q1": "Not always. Bar charts usually need zero, but a clearly labeled trend chart may use a non-zero baseline.",
  "2017q2": "D3 selections bind data to visual elements and their graphical properties.",
  "2017q3": "Visualization design connects user tasks, representations, and interaction.",
  "2017q4": "Treemaps encode hierarchical containment and node attributes, not edge attributes.",
  "2017q5": "A clique appears as a dense filled square block in an adjacency matrix.",
  "2017q6": "Visualization, statistics, and machine learning are complementary approaches."
};

exam2017.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(exam2017);
  let score = 0;
  Object.entries(answers2017).forEach(([name, answer]) => {
    const correct = data.get(name) === answer;
    if (correct) score += 1;
    mark(exam2017.querySelector(`[data-question="${name}"]`), correct, explanations2017[name]);
  });
  exam2017Result.className = `quiz-result show ${score >= 5 ? "strong-score" : ""}`;
  exam2017Result.innerHTML = `<strong>${score}/6</strong><span>Objective section score. Review Questions 7–13 using their model answers.</span>`;
  exam2017Result.scrollIntoView({ behavior: "smooth", block: "center" });
});

document.querySelector("#resetExam2017").addEventListener("click", () => {
  exam2017.reset();
  exam2017.querySelectorAll(".quiz-question").forEach((question) => {
    question.classList.remove("correct", "incorrect");
    question.querySelector(".question-feedback").textContent = "";
  });
  exam2017.querySelectorAll("details").forEach((details) => { details.open = false; });
  exam2017Result.className = "quiz-result";
  exam2017Result.textContent = "";
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const requestedYear = window.location.hash.replace("#", "");
if (["2019", "2018", "2017"].includes(requestedYear)) {
  document.querySelector(`[data-exam-tab="exam${requestedYear}"]`)?.click();
}