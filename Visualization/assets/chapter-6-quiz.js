const chartHost = document.querySelector("#mobilitySmallMultiples");
const svgNS = "http://www.w3.org/2000/svg";
const cities = [
  ["Amsterdam",  [98,108,95,125,110,145,105,135,18,22,28,34], [100,120,100,150,112,168,103,142,8,10,12,15], [102,130,108,165,120,185,110,155,25,30,35,42]],
  ["Atlanta",    [100,92,120,105,160,95,110,90,48,55,60,78], [98,90,112,100,145,92,105,85,40,44,48,55], [102,96,130,110,180,100,118,94,55,62,70,88]],
  ["Barcelona",  [100,112,98,130,105,145,115,125,8,10,12,16], [100,125,108,175,160,250,205,305,4,5,7,9], [102,118,100,150,112,170,125,145,10,12,14,18]],
  ["Berlin",     [100,112,105,128,108,142,115,132,38,46,55,68], [100,120,100,145,105,158,110,140,18,24,30,38], [102,126,108,160,115,175,122,150,28,35,42,52]],
  ["Helsinki",   [100,108,95,112,102,118,106,115,42,48,55,70], [100,105,98,110,101,116,104,112,35,42,48,58], [102,110,100,114,104,120,108,116,50,58,66,78]],
  ["London",     [100,115,102,140,110,155,115,145,20,24,28,35], [100,128,108,170,120,182,125,160,8,10,12,15], [102,122,105,158,115,172,120,150,16,20,24,30]],
  ["New York City",[100,110,95,125,105,138,110,130,32,38,45,58], [100,118,100,140,108,150,112,138,18,22,26,32], [102,125,105,150,112,165,118,145,42,50,58,70]],
  ["Paris",      [100,125,102,155,108,175,112,148,10,12,14,18], [100,115,98,140,104,155,108,135,5,7,8,10], [102,120,100,148,106,165,110,142,8,10,12,15]],
  ["Stockholm",  [100,108,102,115,108,122,112,118,55,62,70,82], [100,112,104,122,110,130,115,124,42,48,55,65], [102,115,108,128,115,138,120,130,65,72,80,92]]
];

function svgElement(name, attributes = {}, text = "") {
  const element = document.createElementNS(svgNS, name);
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
  if (text) element.textContent = text;
  return element;
}

function linePath(values, x, y, width, height) {
  return values.map((value, index) => {
    const px = x + (index / (values.length - 1)) * width;
    const py = y + height - (Math.min(value, 320) / 320) * height;
    return `${index ? "L" : "M"}${px.toFixed(1)},${py.toFixed(1)}`;
  }).join(" ");
}

const svg = svgElement("svg", { viewBox: "0 0 940 610", "aria-hidden": "true" });
svg.append(svgElement("text", { x: 18, y: 24, class: "mobility-title" }, "All modes, All cities"));
const colors = ["#f5a623", "#3155ff", "#222222"];
const panelWidth = 225;
const panelHeight = 128;
const gapsX = 45;
const gapsY = 68;

cities.forEach(([city, ...series], index) => {
  const column = index % 3;
  const row = Math.floor(index / 3);
  const x = 58 + column * (panelWidth + gapsX);
  const y = 58 + row * (panelHeight + gapsY);
  svg.append(svgElement("text", { x: x + panelWidth / 2, y: y - 10, class: "mobility-city" }, city));
  svg.append(svgElement("rect", { x, y, width: panelWidth, height: panelHeight, class: "mobility-panel" }));
  for (let grid = 1; grid < 8; grid += 1) {
    const gx = x + (grid / 8) * panelWidth;
    svg.append(svgElement("line", { x1: gx, y1: y, x2: gx, y2: y + panelHeight, class: "mobility-grid" }));
  }
  [100, 200, 300].forEach((tick) => {
    const gy = y + panelHeight - (tick / 320) * panelHeight;
    svg.append(svgElement("line", { x1: x, y1: gy, x2: x + panelWidth, y2: gy, class: "mobility-horizontal" }));
    if (column === 0) svg.append(svgElement("text", { x: x - 8, y: gy + 4, class: "mobility-tick" }, String(tick)));
  });
  series.forEach((values, seriesIndex) => {
    svg.append(svgElement("path", { d: linePath(values, x, y, panelWidth, panelHeight), stroke: colors[seriesIndex], class: "mobility-series" }));
  });
});

svg.append(svgElement("text", { x: 18, y: 320, class: "mobility-axis", transform: "rotate(-90 18 320)" }, "Relative Mobility"));
const legendX = 835;
[["driving", colors[0]], ["transit", colors[1]], ["walking", colors[2]]].forEach(([label, color], index) => {
  const y = 62 + index * 23;
  svg.append(svgElement("line", { x1: legendX, y1: y, x2: legendX + 20, y2: y, stroke: color, class: "mobility-series" }));
  svg.append(svgElement("text", { x: legendX + 27, y: y + 4, class: "mobility-legend" }, label));
});
chartHost.append(svg);
const quiz = document.querySelector("#chapter6Quiz");
const result = document.querySelector("#quizResult");
const resetButton = document.querySelector("#resetQuiz");

const answers = {
  q1: "b", q3: "b", q4: "a", q5: "b", q6: "a",
  q7: "false", q8: "d", q9: "a", q10: "c"
};

const explanations = {
  q1: "Tufte supports maximizing meaningful data density while preserving readability.",
  q2: "A chart can lie by hiding the baseline, hiding context, or exaggerating values through size.",
  q3: "Small multiples repeat the same visual structure for different subsets of data.",
  q4: "The same line-chart design is repeated across cities to support comparison.",
  q5: "Context provides the scale, baseline, history, and surrounding information needed for interpretation.",
  q6: "Escaping flatland means representing richer multidimensional information on a flat surface.",
  q7: "Not alwaysÃ¢â‚¬â€but scales must be explicit and non-misleading. Bar charts normally should begin at zero.",
  q8: "Data ink is the visual material that directly represents data. Data-ink ratio = data ink / total ink.",
  q9: "Lie factor = size of effect shown in the graphic / size of effect shown in the data.",
  q10: "The decorative monster adds clutter without improving understanding, making it chartjunk."
};

function markQuestion(question, isCorrect, explanation) {
  question.classList.toggle("correct", isCorrect);
  question.classList.toggle("incorrect", !isCorrect);
  question.querySelector(".question-feedback").textContent =
    `${isCorrect ? "Correct." : "Not quite."} ${explanation}`;
}

quiz.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(quiz);
  let score = 0;

  Object.entries(answers).forEach(([name, answer]) => {
    const isCorrect = formData.get(name) === answer;
    if (isCorrect) score += 1;
    markQuestion(quiz.querySelector(`[data-question="${name}"]`), isCorrect, explanations[name]);
  });

  const selectedQ2 = formData.getAll("q2").sort();
  const q2Correct = selectedQ2.join(",") === "b,d,f";
  if (q2Correct) score += 1;
  markQuestion(quiz.querySelector('[data-question="q2"]'), q2Correct, explanations.q2);

  result.className = `quiz-result show ${score >= 8 ? "strong-score" : ""}`;
  result.innerHTML = `<strong>${score}/10</strong><span>${score === 10 ? "ExcellentÃ¢â‚¬â€every answer is correct." : score >= 8 ? "Great work. Review the highlighted questions and try for full marks." : "Review Chapter 6 and try again when ready."}</span>`;
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
