// confg
const TOTALANSWERSNUMBER = 4;
const TIMEFORNEXTQUESTION = 7;
//////
const theQuestion = document.querySelector(".quiz-info .count span");
const bulletsMark = document.querySelector(".bullets-container");
const questionTitleContainer = document.querySelector(".quiz-area");
const mainContainer = document.querySelector(".answers");
const submit = document.querySelector(".submit-answer");
const bulletsContainer = document.querySelector(".bullets");
const results = document.querySelector(".results");
const countDownElement = document.querySelector(".count-down");

let timeInterval;
let countQuestions = 0;
const answersNumber = TOTALANSWERSNUMBER;
let rightAnswers = 0;
async function ajax() {
  try {
    const response = await fetch("apiQuestions.json");
    const data = await response.json();
    const totalQuestion = data.length;
    createBullets(totalQuestion);
    addQuestions(data[countQuestions], totalQuestion);
    countDown(TIMEFORNEXTQUESTION, totalQuestion);
    handleSubmit(data, totalQuestion);
  } catch (er) {
    questionTitleContainer.innerHTML = "something went wrong ❌";
  }
}
ajax();
function handleSubmit(data, totalQuestion) {
  submit.addEventListener("click", function () {
    const rightAnswer = data[countQuestions].right_answer;
    countQuestions++;
    checkAnswer(rightAnswer);
    addQuestions(data[countQuestions], totalQuestion);
    handleBullets();
    countDown(TIMEFORNEXTQUESTION, totalQuestion);
    showResults(totalQuestion);
  });
}

function createBullets(num) {
  theQuestion.innerHTML = num;
  for (let i = 0; i < num; i++) {
    const bullets = document.createElement("span");
    if (i === 0) bullets.classList.add("mark");
    bulletsMark.appendChild(bullets);
  }
}

function addQuestions(questionData, count) {
  if (count === countQuestions) return;
  createQuetionHeader();
  function createQuetionHeader() {
    const currentQuestionContainer = document.createElement("h2");
    const currentQuestionText = document.createTextNode(questionData.title);
    currentQuestionContainer.appendChild(currentQuestionText);
    questionTitleContainer.appendChild(currentQuestionContainer);
  }
  createAnswers();
  function createAnswers() {
    for (let i = 1; i <= answersNumber; i++) {
      const answersContainer = document.createElement("div");
      answersContainer.classList.add("answers");
      const chosenAnswerInput = document.createElement("input");
      chosenAnswerInput.type = "radio";
      chosenAnswerInput.id = `answer_${i}`;
      chosenAnswerInput.dataset.answer = questionData[`answer_${i}`];
      chosenAnswerInput.setAttribute("name", "answers");
      if (i === 1) chosenAnswerInput.checked = true;
      answersContainer.appendChild(chosenAnswerInput);
      const answerLabel = document.createElement("label");
      answerLabel.htmlFor = `answer_${i}`;
      answersContainer.appendChild(answerLabel);
      const answersOptions = document.createTextNode(
        questionData[`answer_${i}`]
      );
      answerLabel.appendChild(answersOptions);
      mainContainer.appendChild(answersContainer);
    }
  }
}

function checkAnswer(rightAnswer) {
  const allAnswers = document.getElementsByName("answers");
  const theChosenAnswer = Array.from(allAnswers).find(
    (answer) => answer.checked
  );
  if (theChosenAnswer.dataset.answer === rightAnswer) rightAnswers++;

  questionTitleContainer.innerHTML = "";
  mainContainer.innerHTML = "";
}

function handleBullets() {
  const bullets = document.querySelectorAll(".bullets .bullets-container span");
  Array.from(bullets).forEach((butllet, index) => {
    if (index === countQuestions) {
      butllet.classList.add("mark");
    }
  });
}

function showResults(totalQuestion) {
  if (countQuestions !== totalQuestion) return;
  removeFromDisplay();
  function checkResult() {
    if (rightAnswers > totalQuestion / 2 && rightAnswers < totalQuestion) {
      return `<span class="good">Good</span>, ${rightAnswers} from ${totalQuestion}`;
    } else if (rightAnswers === totalQuestion) {
      return `<span class="perfect">perfect</span>, ${rightAnswers} from ${totalQuestion}`;
    } else {
      return `<span class="bad">bad</span>, ${rightAnswers} from ${totalQuestion}`;
    }
  }
  results.innerHTML = checkResult();
  function removeFromDisplay() {
    questionTitleContainer.remove();
    mainContainer.remove();
    submit.remove();
    bulletsContainer.remove();
  }
}

function countDown(duration, totalQuestion) {
  clearInterval(timeInterval);
  if (countQuestions === totalQuestion) return;
  timeInterval = setInterval(() => {
    let minutes = parseInt(duration / 60);
    let second = parseInt(duration % 60);
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    second = second < 10 ? `0${second}` : `0${second}`;
    countDownElement.innerHTML = `${minutes}:${second}`;
    --duration;
    if (duration < 0) {
      clearInterval(timeInterval);
      submit.click();
    }
  }, 1000);
}
