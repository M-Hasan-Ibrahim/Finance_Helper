(() => {
  const quiz = document.querySelector(".quiz-form");
  const questionHost = document.querySelector("#quizQuestions");
  const result = document.querySelector("#quizResult");
  const resetButton = document.querySelector("#resetQuiz");
  const questionData = window.innovationQuizQuestions;

  if (!quiz || !questionHost || !result || !resetButton || !Array.isArray(questionData)) return;

  const questions = [...quiz.querySelectorAll(".quiz-question")];
  const submitButton = quiz.querySelector('.quiz-actions button[type="submit"]');

  const actions = quiz.querySelector(".quiz-actions");
  let currentQuestion = 0;
  let mode = "all";

  const modeSwitch = document.createElement("div");
  modeSwitch.className = "quiz-mode-switch";
  modeSwitch.setAttribute("role", "group");
  modeSwitch.setAttribute("aria-label", "Quiz display mode");
  modeSwitch.innerHTML = `
    <span>Quiz format</span>
    <button class="active" type="button" data-quiz-mode="all" aria-pressed="true">All questions</button>
    <button type="button" data-quiz-mode="single" aria-pressed="false">One at a time</button>
  `;

  const progress = document.createElement("div");
  progress.className = "quiz-progress";
  progress.hidden = true;
  progress.innerHTML = `
    <div class="quiz-progress-heading">
      <strong id="quizProgressText">Question 1 of ${questions.length}</strong>
      <span>Keys 1-4 answer · Enter goes next · click a number to navigate</span>
    </div>
    <div class="quiz-indicators" role="navigation" aria-label="Quiz questions"></div>
  `;

  const singleControls = document.createElement("div");
  singleControls.className = "single-question-controls";
  singleControls.hidden = true;
  singleControls.innerHTML = `
    <button class="secondary-button" type="button" data-question-action="previous">&larr; Previous</button>
    <button type="button" data-question-action="next">Next question &rarr;</button>
  `;

  const modeLayout = document.createElement("div");
  modeLayout.className = "quiz-mode-layout";
  const questionColumn = document.createElement("div");
  questionColumn.className = "quiz-question-column";
  quiz.querySelector(".article-header").after(modeSwitch, modeLayout);
  questionColumn.append(questionHost, singleControls);
  modeLayout.append(questionColumn, progress);

  const indicatorHost = progress.querySelector(".quiz-indicators");
  const progressText = progress.querySelector("#quizProgressText");
  const indicators = questions.map((_, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = String(index + 1);
    button.setAttribute("aria-label", `Go to question ${index + 1}`);
    button.addEventListener("click", () => showQuestion(index));
    indicatorHost.append(button);
    return button;
  });

  const previousButton = singleControls.querySelector('[data-question-action="previous"]');
  const nextButton = singleControls.querySelector('[data-question-action="next"]');

  function selectedAnswer(index) {
    return quiz.querySelector(`input[name="q${index + 1}"]:checked`);
  }

  function evaluateQuestion(index) {
    const selected = selectedAnswer(index);
    if (!selected) return null;

    const isCorrect = Number(selected.value) === questionData[index].answer;
    const question = questions[index];
    question.classList.toggle("correct", isCorrect);
    question.classList.toggle("incorrect", !isCorrect);
    question.querySelector(".question-feedback").textContent =
      `${isCorrect ? "Correct." : "Not quite."} ${questionData[index].explanation}`;

    indicators[index].classList.toggle("correct", isCorrect);
    indicators[index].classList.toggle("incorrect", !isCorrect);
    indicators[index].setAttribute(
      "aria-label",
      `Question ${index + 1}: ${isCorrect ? "correct" : "incorrect"}`
    );
    return isCorrect;
  }

  function answeredCount() {
    return questions.reduce((count, _, index) => count + (selectedAnswer(index) ? 1 : 0), 0);
  }

  function showFinalScore() {
    let score = 0;
    questions.forEach((_, index) => {
      if (evaluateQuestion(index)) score += 1;
    });
    const strongScore = Math.ceil(questions.length * 0.8);
    const message = score === questions.length
      ? "Excellent - every answer is correct."
      : score >= strongScore
        ? "Great work. Use the indicators to review your answers."
        : "Review the red questions, then try again.";
    result.className = `quiz-result show ${score >= strongScore ? "strong-score" : ""}`;
    result.innerHTML = `<strong>${score}/${questions.length}</strong><span>${message}</span>`;
    result.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function showQuestion(index) {
    currentQuestion = Math.max(0, Math.min(index, questions.length - 1));
    questions.forEach((question, questionIndex) => {
      question.hidden = mode === "single" && questionIndex !== currentQuestion;
    });
    indicators.forEach((indicator, indicatorIndex) => {
      const active = indicatorIndex === currentQuestion;
      indicator.classList.toggle("active", active);
      indicator.setAttribute("aria-current", active ? "step" : "false");
    });
    progressText.textContent = `Question ${currentQuestion + 1} of ${questions.length} · ${answeredCount()} answered`;
    previousButton.disabled = currentQuestion === 0;
    nextButton.disabled = !selectedAnswer(currentQuestion);
    nextButton.textContent = currentQuestion === questions.length - 1 ? "Finish quiz" : "Next question →";
  }

  function setMode(nextMode) {
    mode = nextMode;
    modeSwitch.querySelectorAll("[data-quiz-mode]").forEach((button) => {
      const active = button.dataset.quizMode === mode;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    const singleMode = mode === "single";
    progress.hidden = !singleMode;
    singleControls.hidden = !singleMode;
    submitButton.hidden = singleMode;
    actions.classList.toggle("single-mode-actions", singleMode);
    quiz.classList.toggle("single-question-mode", singleMode);

    if (singleMode) {
      questions.forEach((question, index) => {
        indicators[index].classList.toggle("correct", question.classList.contains("correct"));
        indicators[index].classList.toggle("incorrect", question.classList.contains("incorrect"));
      });
      showQuestion(currentQuestion);
    } else {
      questions.forEach((question) => { question.hidden = false; });
    }
  }

  modeSwitch.addEventListener("click", (event) => {
    const button = event.target.closest("[data-quiz-mode]");
    if (button) setMode(button.dataset.quizMode);
  });

  questionHost.addEventListener("change", (event) => {
    if (!event.target.matches('input[type="radio"]')) return;
    const index = Number(event.target.name.slice(1)) - 1;
    if (mode === "single") {
      const question = questions[index];
      question.classList.remove("correct", "incorrect");
      question.querySelector(".question-feedback").textContent = "";
      indicators[index].classList.remove("correct", "incorrect");
      indicators[index].setAttribute("aria-label", `Go to question ${index + 1}`);
      showQuestion(index);
    }
  });

  function advanceQuestion() {
    if (!selectedAnswer(currentQuestion)) return;
    evaluateQuestion(currentQuestion);
    if (currentQuestion < questions.length - 1) {
      showQuestion(currentQuestion + 1);
      questions[currentQuestion].scrollIntoView({ behavior: "smooth", block: "center" });
    } else if (answeredCount() === questions.length) {
      showFinalScore();
    } else {
      const firstUnanswered = questions.findIndex((_, index) => !selectedAnswer(index));
      showQuestion(firstUnanswered);
    }
  }

  previousButton.addEventListener("click", () => showQuestion(currentQuestion - 1));
  nextButton.addEventListener("click", advanceQuestion);

  document.addEventListener("keydown", (event) => {
    if (mode !== "single" || event.altKey || event.ctrlKey || event.metaKey) return;
    const activeTag = document.activeElement?.tagName;
    if (["TEXTAREA", "SELECT"].includes(activeTag)) return;
    if (activeTag === "INPUT" && document.activeElement.type !== "radio") return;

    const optionNumber = Number(event.key);
    const currentOptions = [...questions[currentQuestion].querySelectorAll('input[type="radio"]')];
    if (Number.isInteger(optionNumber) && optionNumber >= 1 && optionNumber <= currentOptions.length) {
      event.preventDefault();
      const option = currentOptions[optionNumber - 1];
      option.checked = true;
      option.dispatchEvent(new Event("change", { bubbles: true }));
      option.focus();
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      advanceQuestion();
    }
  });

  resetButton.addEventListener("click", () => {
    currentQuestion = 0;
    indicators.forEach((indicator, index) => {
      indicator.className = "";
      indicator.setAttribute("aria-label", `Go to question ${index + 1}`);
    });
    result.className = "quiz-result";
    result.textContent = "";
    if (mode === "single") showQuestion(0);
  });

  setMode("all");
})();
