const gameContainer = document.getElementById("game-container");
const blanks = document.querySelectorAll(".blank");
const successPopup = document.getElementById("success-popup");
const failurePopup = document.getElementById("failure-popup");
const catGif = document.getElementById("cat-gif");

const word = "BAT";
let droppedLetters = {};


const idleGif = "idle.gif";
const successGif = "successGif.gif";
const failureGif = "failureGif.gif";

function createFloatingLetters() {
    document.querySelectorAll('.letter').forEach(letter => letter.remove());

    for (let i = 0; i < word.length; i++) {
        const letter = document.createElement('div');
        letter.classList.add('letter');
        letter.textContent = word[i];

        letter.style.left = `${Math.random() * (window.innerWidth - 100)}px`;
        letter.style.top = `${Math.random() * (window.innerHeight - 100)}px`;

        letter.dataset.vx = (Math.random() * 2 - 1);
        letter.dataset.vy = (Math.random() * 2 - 1);

        letter.draggable = true;
        letter.id = `letter-${i}`;

        letter.addEventListener("dragstart", e => {
            e.dataTransfer.setData("text/plain", letter.textContent);
        });

        gameContainer.appendChild(letter);
    }
}

function moveLetters() {
    const letters = document.querySelectorAll('.letter');

    letters.forEach(letter => {
        let x = parseFloat(letter.style.left);
        let y = parseFloat(letter.style.top);
        let vx = parseFloat(letter.dataset.vx);
        let vy = parseFloat(letter.dataset.vy);

        x += vx;
        y += vy;

        if (x <= 0 || x >= window.innerWidth - letter.offsetWidth) {
            vx = -vx;
            letter.dataset.vx = vx;
        }
        if (y <= 0 || y >= window.innerHeight - letter.offsetHeight) {
            vy = -vy;
            letter.dataset.vy = vy;
        }

        letter.style.left = `${x}px`;
        letter.style.top = `${y}px`;
    });

    requestAnimationFrame(moveLetters);
}

function setupDropZones() {
    blanks.forEach(blank => {
        blank.addEventListener("dragover", e => e.preventDefault());

        blank.addEventListener("dragenter", () => {
            blank.classList.add("over");
        });

        blank.addEventListener("dragleave", () => {
            blank.classList.remove("over");
        });

        blank.addEventListener("drop", e => {
            e.preventDefault();
            blank.classList.remove("over");

            const draggedLetter = e.dataTransfer.getData("text/plain");
            blank.textContent = draggedLetter;
            droppedLetters[blank.dataset.letter] = draggedLetter;

            checkIfCorrect();
        });
    });
}

function checkIfCorrect() {
    let isCorrect = true;
    blanks.forEach(blank => {
        if (blank.textContent !== blank.dataset.letter) {
            isCorrect = false;
        }
    });

    if (Object.keys(droppedLetters).length === word.length) {
        if (isCorrect) {
            successPopup.classList.add("show");
            failurePopup.classList.remove("show");
            document.body.classList.add("success-bg");
            catGif.src = successGif;
        } else {
            failurePopup.classList.add("show");
            successPopup.classList.remove("show");
            document.body.classList.add("fail-bg");
            catGif.src = failureGif;
        }
        document.getElementById("play-again").style.display = "block";
    }
}

document.getElementById("play-again").addEventListener("click", () => {
    droppedLetters = {};
    blanks.forEach(blank => blank.textContent = "");
    document.body.className = ""; 
    catGif.src = idleGif;
    document.getElementById("play-again").style.display = "none";
    successPopup.classList.remove("show");
    failurePopup.classList.remove("show");
    createFloatingLetters();
});

createFloatingLetters();
moveLetters();
setupDropZones();
