let questions = [];
let currentQuestion = 0;
let correctAnswers = 0;
let wrongAnswers = 0;
let attempted = 0;
let selectedAnswer = null;
let timeLeft;
let timerRunning = false;
let extraTime = 0;
let startTime;

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLM"; // Custom looping system

function startTest() {
    let numQuestions = parseInt(document.getElementById("numQuestions").value);
    let maxInt = parseInt(document.getElementById("maxInt").value);
    let setMinutes = parseInt(document.getElementById("setMinutes").value);
    let setSeconds = parseInt(document.getElementById("setSeconds").value);

    if (numQuestions < 1 || maxInt < 1 || maxInt >= 14 || setMinutes < 1|| setMinutes > 30 || setSeconds > 59 || setSeconds < 0) {
        alert("Enter valid values!");
        return;
    }

    timeLeft = setMinutes * 60+setSeconds;
    startTime = new Date(); // Start hidden clock
    generateQuestions(numQuestions, maxInt);

    document.getElementById("setup").style.display = "none";
    document.getElementById("test").style.display = "block";

    startTimer();
    loadQuestion();
}

function startTimer() {
    timerRunning = true;
    let timerInterval = setInterval(() => {
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        document.getElementById("timeLeft").innerText =
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        if (timeLeft > 0) {
            timeLeft--;
        } else {
            if (timerRunning) {
                document.getElementById("timeUpMessage").innerText =
                    `Time up! You attempted ${attempted} questions till now. Keep practicing!`;
                document.getElementById("timeUpMessage").style.color = "navy";
                timerRunning = false;
            }
            extraTime++;
        }
    }, 1000);
}

function generateQuestions(num, maxInt) {
    questions = [];
    for (let i = 0; i < num; i++) {
        let letter = alphabet[Math.floor(Math.random() * 26)];
        let num = Math.floor(Math.random() * maxInt) + 1;
        let isAddition = Math.random() < 0.5;

        let answer;
        if (isAddition) {
            answer = alphabet[alphabet.indexOf(letter) + num];
            questions.push({ question: `${letter} + ${num} = ?`, answer });
        } else {
            let letterIndex = alphabet.indexOf(letter);
            let possibleAnswers = [];
            if (letterIndex - num >= 0) possibleAnswers.push(alphabet[letterIndex - num]);
            if (letterIndex >= 26 && letterIndex - num >= 26 - maxInt) possibleAnswers.push(alphabet[letterIndex - num + 26]);

            if (possibleAnswers.length > 0) {
                answer = possibleAnswers[Math.floor(Math.random() * possibleAnswers.length)];
                questions.push({ question: `${letter} - ${num} = ?`, answer });
            } else {
                i--; // Ensure valid question generation
            }
        }
    }
}

function loadQuestion() {
    let q = questions[currentQuestion];
    document.getElementById("questionNumber").innerText = `Question ${currentQuestion + 1} of ${questions.length}`;
    document.getElementById("question").innerText = q.question;
    document.getElementById("options").innerHTML = "";
    document.getElementById("feedback").innerText = "";

    let options = [q.answer, ...generateWrongOptions(q.answer)];
    options.sort(() => Math.random() - 0.5);

    options.forEach(option => {
        let btn = document.createElement("button");
        btn.innerText = option;
        btn.onclick = () => selectOption(btn, option);
        document.getElementById("options").appendChild(btn);
    });

    selectedAnswer = null;
}

function generateWrongOptions(correct) {
    let options = [];
    while (options.length < 3) {
        let rand = alphabet[Math.floor(Math.random() * 26)];
        if (!options.includes(rand) && rand !== correct) options.push(rand);
    }
    return options;
}

function selectOption(button, answer) {
    document.querySelectorAll("#options button").forEach(btn => {
        btn.classList.remove("selected");
    });
    button.classList.add("selected");
    selectedAnswer = answer;
}

function saveAnswer() {
    if (selectedAnswer === null) return;

    attempted++;
    let correctAnswer = questions[currentQuestion].answer;
    let feedback = document.getElementById("feedback");

    if (selectedAnswer === correctAnswer) {
        correctAnswers++;
        feedback.innerText = "Very Good! Your answer is correct!";
        feedback.style.color = "green";
    } else {
        wrongAnswers++;
        feedback.innerText = `Oops! That was wrong! Correct answer: ${correctAnswer}`;
        feedback.style.color = "red";
    }

    document.querySelectorAll("#options button").forEach(btn => {
        btn.onclick = null; // Disable answer changes
    });

    if (attempted === questions.length) submitTest(); // Auto-submit if all answered
}

function nextQuestion() {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        loadQuestion();
    } else {
        submitTest();
    }
}

function submitTest() {
    document.getElementById("test").style.display = "none";
    document.getElementById("result").style.display = "block";

    let endTime = new Date();
    let totalTime = Math.floor((endTime - startTime) / 1000);
    let minutesTaken = Math.floor(totalTime / 60);
    let secondsTaken = totalTime % 60;

    document.getElementById("score").innerHTML = `<span class="correct">Correct: ${correctAnswers}</span>`;
document.getElementById("wrong").innerHTML = `<span class="wrong">Wrong: ${wrongAnswers}</span>`;
document.getElementById("unattempted").innerHTML = `<span class="unattempted">Unattempted: ${questions.length - attempted}</span>`;
document.getElementById("timeTaken").innerHTML = `<span class="time">Time Taken: ${minutesTaken}m ${secondsTaken}s</span>`;
}
​
