const keyboard = document.querySelector("#keyboard");
const wordEl = document.querySelector("#word");
const wrongEl = document.querySelector("#wrong");
const triedEl = document.querySelector("#tried");
const wordLengthEl = document.querySelector("#wordLength");
const messageEl = document.querySelector("#message");
const drawingLabel = document.querySelector("#drawingLabel");
const newGameBtn = document.querySelector("#newGame");

const letters = "abcdefghijklmnopqrstuvwxyz".split("");

const drawingParts = [
    ".head",
    ".body",
    ".arm-left",
    ".arm-right",
    ".leg-left",
    ".leg-right"
];


function buildKeyboard() {
    keyboard.innerHTML = "";

    letters.forEach(letter => {
        const button = document.createElement("button");

        button.className = "key";
        button.type = "button";
        button.textContent = letter.toUpperCase();
        button.dataset.letter = letter;
        button.setAttribute("aria-label", `Guess ${letter}`);

        button.addEventListener("click", () => makeGuess(letter));

        keyboard.appendChild(button);
    });
}


function renderDrawing(wrong) {
    drawingParts.forEach((selector, index) => {
        document.querySelector(selector).style.opacity =
            index < wrong ? "1" : "0";
    });

    const labels = [
        "You're safe for now.",
        "Head's up — one mistake.",
        "The pressure is on.",
        "Careful — keep guessing.",
        "Almost there.",
        "One chance left!",
        "Game over."
    ];

    drawingLabel.textContent = labels[Math.min(wrong, 6)];
}


function render(state) {
    wordEl.innerHTML = "";

    state.display.forEach(letter => {
        const span = document.createElement("span");
        span.textContent = letter === "_" ? "" : letter.toUpperCase();
        wordEl.appendChild(span);
    });

    wrongEl.textContent = state.wrong;
    triedEl.textContent = state.guessed.length;
    wordLengthEl.textContent = state.word_length;

    // Completely reset keyboard state before applying the new state.
    document.querySelectorAll(".key").forEach(button => {
        const letter = button.dataset.letter;

        button.classList.remove("correct", "wrong");
        button.disabled = false;

        if (state.guessed.includes(letter)) {
            button.disabled = true;

            if (state.display.includes(letter)) {
                button.classList.add("correct");
            } else {
                button.classList.add("wrong");
            }
        }

        if (state.status !== "playing") {
            button.disabled = true;
        }
    });

    renderDrawing(state.wrong);

    messageEl.className = "message";

    if (state.status === "playing") {
        messageEl.textContent = "Pick a letter to begin.";
    } else if (state.status === "won") {
        messageEl.textContent = "You won! Perfect guess.";
        messageEl.classList.add("win");
    } else {
        messageEl.textContent =
            `Game over — the word was "${state.word}".`;
        messageEl.classList.add("loss");
    }
}


async function makeGuess(letter) {
    try {
        const response = await fetch("/api/guess", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ letter })
        });

        const data = await response.json();

        if (!response.ok) {
            messageEl.textContent =
                data.error || "Something went wrong.";
            messageEl.className = "message loss";
            return;
        }

        render(data);

    } catch (error) {
        messageEl.textContent =
            "Could not connect to the game server.";
        messageEl.className = "message loss";
    }
}


async function newGame() {
    newGameBtn.disabled = true;

    try {
        const response = await fetch("/api/new", {
            method: "POST"
        });

        if (!response.ok) {
            throw new Error("Could not start a new game.");
        }

        const data = await response.json();
        render(data);

    } catch (error) {
        messageEl.textContent = "Could not start a new game.";
        messageEl.className = "message loss";
    } finally {
        newGameBtn.disabled = false;
    }
}


document.addEventListener("keydown", event => {
    const letter = event.key.toLowerCase();

    if (/^[a-z]$/.test(letter)) {
        const button =
            document.querySelector(`[data-letter="${letter}"]`);

        if (button && !button.disabled) {
            makeGuess(letter);
        }
    }
});


newGameBtn.addEventListener("click", newGame);

buildKeyboard();

fetch("/api/game")
    .then(response => response.json())
    .then(render)
    .catch(() => {
        messageEl.textContent =
            "Could not load the game.";
        messageEl.className = "message loss";
    });
