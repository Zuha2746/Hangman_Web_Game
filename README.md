# Hangman Web Game

A browser-based Hangman game built with Python and Flask.

## Features

- Random word selection from `words.txt`
- Easy-to-expand word list
- Six maximum wrong guesses
- On-screen keyboard
- Physical keyboard support (A-Z)
- New Game button that fully resets the keyboard
- SVG Hangman drawing with six stages
- Win and loss states
- Responsive layout for desktop and mobile
- Input validation and duplicate-guess protection

## Project structure

```text
hangman_web/
├── app.py
├── words.txt
├── requirements.txt
├── README.md
├── templates/
│   └── index.html
└── static/
    ├── style.css
    └── app.js
```

## Run on macOS

Open Terminal:

```bash
cd ~/Downloads/hangman_web
python3 -m pip install -r requirements.txt
python3 app.py
```

Then open:

http://127.0.0.1:5002

Press `Ctrl+C` in Terminal to stop the server.

## Adding more words

Open `words.txt` and put one normal word on each line:

```text
adventure
mountain
sunshine
```

You can add hundreds of words without changing `app.py`.
