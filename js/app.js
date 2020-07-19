let currentQuestion = {};
let currentQuestionNum = 0;
let totalQuestions = 10;
let currentScore = 0;
let chosenOperators = [];

/**
 * Utility function to generate a random number based on max
 * @param {number} max
 */
function getRandomNumber(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function getRandomNumberInRange(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

/**
 * Utility function to shuffle the items in an array
 * @param {object} arr
 */
function shuffleArray(arr) {
    return arr.sort(function (a, b) { return Math.random() - 0.5 })
}

function findCorrectAnswer(question) {
    switch(question.operator) {
        case "+":
            return question.left + question.right;
        case "-":
            return question.left - question.right;
        case "*":
            return question.left * question.right;
        case "/":
            return question.left / question.right;  
    }
}

function generateWrongAnswer(question, correctAnswer) {
    const MAX_DEVIATION = 5;
    const FALSE_RANGE = 0;
    const TRUE_RANGE = 2;  

    let deviation = getRandomNumberInRange( 1, MAX_DEVIATION + 1 );
    let isPlus = getRandomNumberInRange( FALSE_RANGE, TRUE_RANGE );
    let wrongAnswer = {};
    wrongAnswer.number = isPlus ? correctAnswer.number + deviation : correctAnswer.number - deviation;
    wrongAnswer.correct = false;

    // Does this wrong answer already exist in the list?
    if (question.answers.find(a => a.number === wrongAnswer.number)) {
        return generateWrongAnswer(question, correctAnswer);
    }

    return wrongAnswer;
}

function generateQuestion() {
    const OPERAND_MIN = 1;
    const OPERAND_MAX = 9;
    const NUM_WRONG_ANSWERS = 3;

    let question = {};
    question.left = getRandomNumberInRange( OPERAND_MIN, OPERAND_MAX );
    question.right = getRandomNumberInRange( OPERAND_MIN, OPERAND_MAX );
    question.operator = chosenOperators[getRandomNumber(chosenOperators.length)];

    question.answers = [];

    let correctAnswer = {};
    correctAnswer.number = findCorrectAnswer(question);
    correctAnswer.correct = true;

    for (let i = 0; i < NUM_WRONG_ANSWERS; i++) {
        let wrongAnswer = generateWrongAnswer(question, correctAnswer);
        question.answers.push(wrongAnswer);
    }

    question.answers.push(correctAnswer);
    question.answers = shuffleArray(question.answers);

    return question;
}

function writeCurrentScore() {
    let scoreEl = document.querySelector('.currentScore');
    scoreEl.innerText = currentScore;
}

function writeCurrentQuestion() {
    let expressionEl = document.querySelector(".expression");
    expressionEl.innerText = `${currentQuestion.left} ${currentQuestion.operator} ${currentQuestion.right}`;

    let answerEls = document.querySelectorAll("#answers ul li");

    for (let i = 0; i < answerEls.length; i++) {
        let answer = currentQuestion.answers[i];
        answerEls[i].innerText = answer.number;
    }
}

function writeCurrentQuestionNum() {
    let currentProblemEl = document.querySelector('.currentProblem');
    currentProblemEl.innerText = currentQuestionNum;
}

function handleNextQuestion() {
    currentQuestionNum++;

    if (currentQuestionNum > totalQuestions) runEndGame();
    else {
        currentQuestion = generateQuestion();

        writeCurrentScore();
        writeCurrentQuestion();
        writeCurrentQuestionNum();
    }
}

function handleOperatorMenu() {
    hideGameEls();
    hideScoreEl();
    showOperatorEl();
    let startButton = document.querySelector('#btnStartOver');
    startButton.innerText = 'START';
}

function handleStartButtonClicked(action) {
    if (action === 'START' && chosenOperators.length > 0) {
        runStartGame();
    }
    else runResetGame();
}

function hideGameEls() { hideElements('.show-hide'); }
function showGameEls() { showElements('.show-hide'); }

function hideScoreEl() { hideElement('#problem p'); }
function showScoreEl() { showElement('#problem p'); }

function showOperatorEl() { showElement('.operator-select'); }
function hideOperatorEl() { hideElement('.operator-select'); }

function hideElement(selector) {
    let element = document.querySelector(selector);
    element.classList.add('hidden');
}

function showElement(selector) {
    let element = document.querySelector(selector);
    element.classList.remove('hidden');
}

function hideElements(selector) {
    let elements = document.querySelectorAll(selector);
    elements.forEach(e => e.classList.add('hidden'));
}

function showElements(selector) {
    let elements = document.querySelectorAll(selector);
    elements.forEach(e => e.classList.remove('hidden'));
}

function runEndGame() {
    hideGameEls();
    writeCurrentScore();
}

function runStartGame() {
    hideOperatorEl();
    showGameEls();
    showScoreEl();
    handleNextQuestion();

    let startButton = document.querySelector('#btnStartOver');
    startButton.innerText = 'START OVER';
}

function runResetGame() {
    currentQuestionNum = 0;
    currentScore = 0;
    chosenOperators = [];

    let operatorEls = document.querySelectorAll('.operator-select li');
    operatorEls.forEach(o => o.classList.remove('selected'));

    handleOperatorMenu();
}

function addClickListeners() {
    let operatorEls = document.querySelectorAll('.operator-select li');
    operatorEls.forEach(e => e.addEventListener('click', (event) => {
        let clickedOperator = event.target.innerText;

        if (!chosenOperators.includes(clickedOperator)) {
            chosenOperators.push(clickedOperator);
            event.target.classList.add('selected');
        }
        else {
            chosenOperators = chosenOperators.filter(o => o != clickedOperator);
            event.target.classList.remove('selected');
        }
    }));

    let answerEls = document.querySelectorAll('#answers ul li');
    answerEls.forEach(e => e.addEventListener('click', (event) => {
        let number = event.target.innerText;
        let answer = currentQuestion.answers.find(a => a.number == number);

        if (answer.correct) { currentScore++; }

        handleNextQuestion();
    })); 

    let startOverEl = document.querySelector('#btnStartOver');
    startOverEl.addEventListener('click', (event) => {
        handleStartButtonClicked(event.target.innerText);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    addClickListeners();
    handleOperatorMenu();    
});