let welcomeMenu, mainMenu, newGameMenu, optionsMenu, creditsMenu, soundOnBtn, soundOffBtn, menuScreen, gameScreen, game;

let musicStatus = true;
const backgroundMusic = new Audio("sounds/Dreaming.ogg");

const textColor = "#ccc";
const textColorDisabled = "red";

window.onload = function() {
    //screens
    welcomeMenu = document.getElementById("welcome-menu");
    mainMenu = document.getElementById("main-menu");
    newGameMenu = document.getElementById("new-game-menu");
    optionsMenu = document.getElementById("options-menu");
    creditsMenu = document.getElementById("credits-menu");
    menuScreen = document.getElementById("menu-screen");
    gameScreen = document.getElementById("game-screen");

    //buttons
    soundOnBtn = document.getElementById("sound-on-btn");
    soundOffBtn = document.getElementById("sound-off-btn");
    
    mainMenu.style.display = "none";
    newGameMenu.style.display = "none";
    optionsMenu.style.display = "none";
    creditsMenu.style.display = "none";
    
    gameScreen.style.display = "none";
    document.getElementById("main-screen").style.display = "flex";
    
    backgroundMusic.preload = "auto";
    
    //TESTING
    menuScreen.style.display = "none";
    gameScreen.style.display = "block";
    game = new Game(Difficulty.BEGINNER);
    setupGameScreen();
    backgroundMusic.loop = true;
    backgroundMusic.play();
    
    //TESTING
}

function play() {
    welcomeMenu.style.display = "none";
    mainMenu.style.display = "block";
    backgroundMusic.loop = true;
    backgroundMusic.play();
}

function newGame() {
    mainMenu.style.display = "none";
    newGameMenu.style.display = "block";
}

function options() {
    mainMenu.style.display = "none";
    optionsMenu.style.display = "block";
    if (musicStatus) {
        soundOffBtn.style.color = textColor;
        soundOffBtn.style.cursor = "pointer";
        soundOnBtn.style.color = textColorDisabled;
        soundOnBtn.style.cursor = "default";
    } else {
        soundOnBtn.style.color = textColor;
        soundOnBtn.style.cursor = "pointer";
        soundOffBtn.style.color = textColorDisabled;
        soundOffBtn.style.cursor = "default";
    }
}

function credits() {
    mainMenu.style.display = "none";
    creditsMenu.style.display = "block";
}

function back() {
    newGameMenu.style.display = "none";
    optionsMenu.style.display = "none";
    creditsMenu.style.display = "none";
    mainMenu.style.display = "block";
}

function soundOn() {
    if (!musicStatus) {
        soundOffBtn.style.color = textColor;
        soundOffBtn.style.cursor = "pointer";
        soundOnBtn.style.color = textColorDisabled;
        soundOnBtn.style.cursor = "default";
        musicStatus = true;
        backgroundMusic.play();
    }
}

function soundOff() {
    if (musicStatus) {
        soundOnBtn.style.color = textColor;
        soundOnBtn.style.cursor = "pointer";
        soundOffBtn.style.color = textColorDisabled;
        soundOffBtn.style.cursor = "default";
        musicStatus = false;
        backgroundMusic.load();
    }
}

function startGame(difficultyLevel) {
    game = new Game(difficultyLevel);
    back();
    menuScreen.style.display = "none";
    gameScreen.style.display = "block";
    setupGameScreen();
}

const guesses = [];

function setupGameScreen() {
    const row = document.createElement("DIV");
    row.classList.add("row");
    row.textContent = game.turn;
    document.getElementById("guesses").appendChild(row);
}

function toggleSound() {
    const soundImg = document.getElementById("game-sound-btn");
    if (musicStatus) {
        musicStatus = false;
        backgroundMusic.load();
        soundImg.src = "images/mute.png";
    } else {
        musicStatus = true;
        backgroundMusic.play();
        soundImg.src = "images/unmute.png";
    }
}

function decode() {
    const guesses = document.getElementById("guesses");
    const row = document.createElement("DIV");
    row.classList.add("row");
    game.turn++;
    row.textContent = game.turn;
    guesses.prepend(row);
    guesses.scrollTop = 0;
}

function check() {
    const codeBreaker = [];
    for (let i=0; i<game.codeMaker.length; i++) {
        codeBreaker.push(Colors[Math.floor(Math.random() * Colors.length)]);
    }
    game.currentCodeBreakerPattern = codeBreaker;
    
    const table = document.getElementById("game");
    const row = document.createElement("TR");
    
    //turn number column
    const turn = document.createElement("TD");
    turn.classList.add("turns");
    turn.innerHTML = game.turn;
    row.appendChild(turn);
    
    //breaker's code column
    const breakingCodesColumn = document.createElement("TD");
    for (let i=0; i<codeBreaker.length; i++) {
        const code = document.createElement("DIV");
        code.classList.add("box");
        code.style.backgroundColor = codeBreaker[i];
        breakingCodesColumn.appendChild(code);
    }
    
    row.appendChild(breakingCodesColumn);
            
    const codeMaker = [
        game.codeMaker[0],
        game.codeMaker[1],
        game.codeMaker[2],
        game.codeMaker[3]
    ];
    
    const feedback = game.getFeedback();
    game.turn++;
    
    //feedback column
    const fb = document.createElement("TD");
    for(let i=0; i<feedback.length; i++) {
        const peg = document.createElement("DIV");
        peg.classList.add("peg");
        peg.style.backgroundColor = feedback[i];
        fb.appendChild(peg);
    }
    row.appendChild(fb);
    
    table.appendChild(row);
    
    //checking for game over
    if (game.isGameOver()) {
        document.getElementById("gs").innerHTML += "Game Over";
        document.getElementById("check").disabled = true;
    }
}