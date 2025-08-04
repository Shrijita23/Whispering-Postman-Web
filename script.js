const villagers = [
    { name: "Daphne", hint: "She has kneelength hair which everyone admires." },
    { name: "Alec", hint: "He is the best harp player villagers ever heard of." },
    { name: "Lydia", hint: "She has a thing for cats. People think of her whenever they see any cat." },
    { name: "Nikos", hint: "He is the teacher in the village school, and loves teaching kids." },
    { name: "Iris", hint: "She just loves her garden! Specially the fresh Olive saplings from Athens." },
    { name: "Linus", hint: "He is the charming farmer guy, who takes care of anyone sick in the village too." },
    { name: "Lena", hint: "She weaves beautiful patterns into soft woolen clothes, and is known for her kindness." },
    { name: "Theo", hint: "He is the blacksmith, known for his strength and skill in crafting tools." },
    { name: "Mira", hint: "She is the healer, using herbs and remedies to help the sick." },
    { name: "Orion", hint: "He is the storyteller, sharing tales of old with the children, being their favourite." },
    { name: "Cassia", hint: "She is the baker, known for her delicious bread and pastries, always welcoming with a smile." },
    { name: "Elias", hint: "He is the carpenter, crafting furniture and repairing homes with great care." },
    { name: "Selene", hint: "She is the seer, known for her visions and wisdom, often sought for advice by the villagers." },
    { name: "Lukas", hint: "He is the fisherman, bringing fresh fish from the nearby river, always cheerful and friendly." }
];

const letters = [
    { hint: "Guess the person with a passion for plants and contact with her for fresh Olives", receiver: "Iris" },
    { hint: "Guess the person who can clearly play harp magically good", receiver: "Alec" },
    { hint: "Guess the person who recently taught the kids about the legend of Troy", receiver: "Nikos" },
    { hint: "Guess the person whom you always can be seen buying catfood", receiver: "Lydia" },
    { hint: "Guess the person who was taking care of Iapetus when he had a fever", receiver: "Linus" },
    { hint: "Guess the person combing her kneelength hair gracefully", receiver: "Daphne" },
    { hint: "Guess the person who is known for her beautiful woolen clothes", receiver: "Lena" },
    { hint: "Guess the person who is the strongest in the village, and can lift heavy things easily", receiver: "Theo" },
    { hint: "Guess the person who is always seen with a basket of herbs, helping the sick", receiver: "Mira" },
    { hint: "Guess the person who tells the best stories to the children, making them laugh and learn", receiver: "Orion" },
    { hint: "Guess the person who bakes the most delicious bread and pastries, always with a smile", receiver: "Cassia" },
    { hint: "Guess the person who crafts beautiful furniture and repairs homes with great care", receiver: "Elias" },
    { hint: "Guess the person who is known for her visions and wisdom, often sought for advice", receiver: "Selene" },
    { hint: "Guess the person who brings fresh fish from the nearby river, always cheerful", receiver: "Lukas" }
];

// Game state
let score = 0;
let currentDay = 1;
const maxDays = 3;
const questionsPerDay = 3;
let questionIndex = 0;
let currentVillagers = [];
let currentLetter = {};
let availableLetters = [...letters];
let timerInterval;
let timeLeft = 30;

// DOM elements
const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("game");
const dayEndScreen = document.getElementById("dayEndScreen");
const finalScreen = document.getElementById("finalScreen");
const villagerList = document.getElementById("villagerList");
const letterHint = document.getElementById("letterHint");
const answerInput = document.getElementById("answerInput");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const finalScore = document.getElementById("finalScore");
const dayEndMessage = document.getElementById("dayEndMessage");
const cumulativeScore = document.getElementById("cumulativeScore");

// Utility: Shuffle
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

// Start game
document.getElementById("startBtn").addEventListener("click", () => {
    startScreen.style.display = "none";
    gameScreen.style.display = "block";
    startDay();
});

// Start new day
function startDay() {
    questionIndex = 0;
    timeLeft = 30;
    currentVillagers = shuffle([...villagers]).slice(0, 5);
    loadQuestion();
}

// Load question
function loadQuestion() {
    clearInterval(timerInterval);
    if (questionIndex >= questionsPerDay) {
        endDay();
        return;
    }
    // Select a letter matching one of the current villagers
    let validLetters = availableLetters.filter(l => currentVillagers.some(v => v.name === l.receiver));
    if (validLetters.length === 0) {
        endDay();
        return;
    }
    currentLetter = validLetters[Math.floor(Math.random() * validLetters.length)];
    // Remove from available pool
    availableLetters = availableLetters.filter(l => l.receiver !== currentLetter.receiver);

    // Show villagers
    villagerList.innerHTML = "";
    currentVillagers.forEach(v => {
        let li = document.createElement("li");
        li.textContent = `${v.name}: ${v.hint}`;
        villagerList.appendChild(li);
    });

    // Show letter
    letterHint.textContent = currentLetter.hint;
    answerInput.value = "";
    scoreDisplay.textContent = `Score: ${score}`;
    startTimer();
}

// Timer
function startTimer() {
    timeLeft = 30;
    timerDisplay.textContent = `Time left: ${timeLeft}s`;
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Time left: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            nextQuestion();
        }
    }, 1000);
}

// Check answer
function checkAnswer() {
    clearInterval(timerInterval);
    let ans = answerInput.value.trim();
    if (ans.toLowerCase() === currentLetter.receiver.toLowerCase()) {
        score++;
        document.getElementById("feedback").textContent = "Yay! You guessed it right!";
        feedback.style.color = "green";
    } else {
        document.getElementById("feedback").textContent = `Oh no! Correct answer was ${currentLetter.receiver}`;
        feedback.style.color = "red";
    }
}

// Go to next question
function nextQuestion() {
    questionIndex++;
    loadQuestion();
}

// Submit button
document.getElementById("submitBtn").addEventListener("click", () => {
    checkAnswer();
    nextQuestion();
});

// Skip button
document.getElementById("skipBtn").addEventListener("click", () => {
    nextQuestion();
});

// Enter key = submit
answerInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        checkAnswer();
        nextQuestion();
    }
});

// End of day
function endDay() {
    gameScreen.style.display = "none";
    dayEndScreen.style.display = "block";
    dayEndMessage.textContent = `Day ${currentDay} completed!`;
    cumulativeScore.textContent = `Your cumulative score: ${score}`;
}

// Continue to next day
document.getElementById("continueBtn").addEventListener("click", () => {
    dayEndScreen.style.display = "none";
    currentDay++;
    if (currentDay <= maxDays) {
        gameScreen.style.display = "block";
        startDay();
    } else {
        endGame();
    }
});

// End game
function endGame() {
    dayEndScreen.style.display = "none";
    finalScreen.style.display = "block";
    finalScore.textContent = `Your final score: ${score}`;
}
