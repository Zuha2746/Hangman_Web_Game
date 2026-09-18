# Hangman Web Game

A simple browser-based Hangman game made using Python, Flask, HTML, CSS, and JavaScript.

## Features

* Random word selection from `words.txt`
* On-screen keyboard
* Physical keyboard support
* 6 wrong guesses allowed
* Hangman drawing with 6 stages
* Win and loss states
* New Game button
* Duplicate guess protection
* Input validation
* Responsive design

## Project Structure

```text
Hangman_Web_Game/
├── app.py
├── words.txt
├── requirements.txt
├── README.md
├── templates/
│   └── index.html
└── static/
    ├── app.js
    └── style.css
```

## How to Run

First, clone the repository:

```bash
git clone https://github.com/Zuha2746/Hangman_Web_Game.git
cd Hangman_Web_Game
```

Install the required package:

```bash
python3 -m pip install -r requirements.txt
```

Run the application:

```bash
python3 app.py
```

Then open:

```text
http://127.0.0.1:5003
```

Press `Ctrl + C` in the terminal to stop the server.

## Adding Words

To add more words, open `words.txt` and add one word per line.

For example:

```text
adventure
mountain
sunshine
aircraft
computer
```

The words are loaded automatically when the application starts.

## Controls

You can guess letters using either:

* The on-screen keyboard
* Your physical keyboard

Click **New Game** to start a new round.

## About

This was one of my projects for practicing Python and learning how a Python backend can work with a web frontend.

