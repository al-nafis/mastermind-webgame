let welcomeMenu, mainMenu, newGameMenu, optionsMenu, creditsMenu, soundOnBtn, soundOffBtn, menuScreen, gameScreen, game, codeMakerPalette, soundImg, guesses, decodeBtn;

let musicStatus = true;
//let isGameOver = false;
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
    
    //game screen items
    codeMakerPalette = document.getElementById("code-maker-palette");
    soundImg = document.getElementById("game-sound-btn");
    guesses = document.getElementById("guesses");
    decodeBtn = document.getElementById("decode-btn");
    
    mainMenu.style.display = "none";
    newGameMenu.style.display = "none";
    optionsMenu.style.display = "none";
    creditsMenu.style.display = "none";
    
    gameScreen.style.display = "none";
    document.getElementById("main-screen").style.display = "flex";
    
    backgroundMusic.preload = "auto";
    
    adjustGuessesHeight();
    
    //TESTING
    menuScreen.style.display = "none";
    gameScreen.style.display = "block";
    game = new Game(Difficulty.BEGINNER);
    setupGameScreen();
    backgroundMusic.loop = true;
    backgroundMusic.play();
    //TESTING
}

window.onresize = function() {
    setTimeout(adjustGuessesHeight(), 100);
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

function setupGameScreen() {
    console.log(game.codeMaker);
    for (let i=0; i<game.codeMaker.length; i++) {
        const color = document.createElement("DIV");
        color.classList.add("color-pegs-4");
        color.style.background = game.codeMaker[i];
        codeMakerPalette.appendChild(color);
    }
    setupInitialGuessRow();
}

function decode() {
    game.attempt++;
    setupInitialGuessRow();
    guesses.scrollTop = 0;
    
    if (game.isGameOver()) {
        decodeBtn.disabled = true;
    }
}

let currentRowCodePegsHolder = [];
let currentRowCodePegs = [];
let currentRowKeyPegsHolder = [];

function setupInitialGuessRow() {
    currentRowCodePegsHolder = []
    currentRowCodePegs = [];
    currentRowKeyPegsHolder = [];
    
    const row = document.createElement("DIV");
    row.classList.add("row");
    guesses.prepend(row);
    
    const attemptNumber = document.createElement("DIV");
    attemptNumber.classList.add("attempt-number");
    row.appendChild(attemptNumber);
    
    const p = document.createElement("P");
    p.textContent = game.attempt;
    attemptNumber.appendChild(p);
    
    
    const guessPalette = document.createElement("DIV");
    guessPalette.classList.add("guess-palette");
    row.appendChild(guessPalette);
    
    for (let i=0; i<game.codeMaker.length; i++) {
        const pegHolder = document.createElement("DIV");
        if (game.difficultyLevel == Difficulty.ENGINEER) {
            pegHolder.classList.add("code-peg-holder-6pegs");
        } else {
            pegHolder.classList.add("code-peg-holder-4pegs");
        }
        guessPalette.appendChild(pegHolder);
        currentRowCodePegsHolder.push(pegHolder);
    }
    
    
    const feedbackHolder = document.createElement("DIV");
    feedbackHolder.classList.add("feedback-holder");
    row.appendChild(feedbackHolder);
    
    const feedbackHolderInnerDiv = document.createElement("DIV");
    feedbackHolder.appendChild(feedbackHolderInnerDiv);
    
    let eachRowKeyPegs = 2;
    if (game.difficultyLevel == Difficulty.ENGINEER) {
        eachRowKeyPegs = 3;
    }
    
    for (let i=0; i<2; i++) {
        const keyPegHolderOuterDiv = document.createElement("DIV");
        feedbackHolderInnerDiv.appendChild(keyPegHolderOuterDiv);
        
        for (let j=0; j<eachRowKeyPegs; j++) {
            const keyPegHolder = document.createElement("DIV");
            keyPegHolder.classList.add("key-peg-holder");
            keyPegHolderOuterDiv.appendChild(keyPegHolder);
            currentRowKeyPegsHolder.push(keyPegHolder);
        }
    }
    
//    TESTING
    
    console.log(currentRowCodePegsHolder);
    console.log(currentRowKeyPegsHolder);
    
//    TESTING
    
    
    if (!musicStatus) {
        soundImg.src = "images/mute.png";
    }
}

function toggleSound() {
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

function adjustGuessesHeight() {
    const wind = window.outerHeight;
    if (wind < 750) {
        guesses.style.maxHeight =(wind - 283) + "px";
    } else {
        guesses.style.maxHeight ="465px";
    }
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
    turn.innerHTML = game.attempt;
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
    game.attempt++;
    
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