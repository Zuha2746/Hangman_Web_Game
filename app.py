from flask import Flask, jsonify, render_template, request
from pathlib import Path
import random

app = Flask(__name__)

BASE_DIR = Path(__file__).resolve().parent
WORDS_FILE = BASE_DIR / "words.txt"
MAX_WRONG = 6


def load_words():
    """Load clean, unique words from words.txt."""
    if not WORDS_FILE.exists():
        raise FileNotFoundError("words.txt was not found.")

    words = []

    with WORDS_FILE.open("r", encoding="utf-8") as file:
        for line in file:
            word = line.strip().lower()

            # Keep only normal alphabetic words.
            if word and word.isalpha() and word not in words:
                words.append(word)

    if not words:
        raise ValueError("words.txt must contain at least one valid word.")

    return words


WORDS = load_words()


def new_game():
    return {
        "word": random.choice(WORDS),
        "guessed": [],
        "wrong": 0
    }


game = new_game()


def game_status():
    if all(letter in game["guessed"] for letter in game["word"]):
        return "won"

    if game["wrong"] >= MAX_WRONG:
        return "lost"

    return "playing"


def public_state():
    status = game_status()

    return {
        "display": [
            letter if letter in game["guessed"] else "_"
            for letter in game["word"]
        ],
        "guessed": game["guessed"],
        "wrong": game["wrong"],
        "max_wrong": MAX_WRONG,
        "status": status,
        "word_length": len(game["word"]),
        "word": game["word"] if status == "lost" else None
    }


@app.get("/")
def home():
    return render_template("index.html")


@app.get("/api/game")
def get_game():
    return jsonify(public_state())


@app.post("/api/new")
def restart():
    global game
    game = new_game()
    return jsonify(public_state())


@app.post("/api/guess")
def guess():
    data = request.get_json(silent=True) or {}
    letter = str(data.get("letter", "")).strip().lower()

    if len(letter) != 1 or not letter.isalpha():
        return jsonify({"error": "Please enter exactly one letter."}), 400

    if game_status() != "playing":
        return jsonify({"error": "The game is over. Start a new game."}), 400

    if letter in game["guessed"]:
        return jsonify({"error": "You already guessed that letter."}), 400

    game["guessed"].append(letter)

    if letter not in game["word"]:
        game["wrong"] += 1

    return jsonify(public_state())


if __name__ == "__main__":
    app.run(debug=True, port=5003)

