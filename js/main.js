let mainMenu, newGameMenu, optionsMenu, creditsMenu, soundOnBtn, soundOffBtn, menuScreen, gameScreen;

let soundStatus = true;

const textColor = "#ccc";
const textColorDisabled = "red";

let game;

window.onload = function() {
    //screens
    mainMenu = document.getElementById("main-menu");
    newGameMenu = document.getElementById("new-game-menu");
    optionsMenu = document.getElementById("options-menu");
    creditsMenu = document.getElementById("credits-menu");
    menuScreen = document.getElementById("menu-screen");
    gameScreen = document.getElementById("game-screen");

    //buttons
    soundOnBtn = document.getElementById("sound-on-btn");
    soundOffBtn = document.getElementById("sound-off-btn");
    
    newGameMenu.style.display = "none";
    optionsMenu.style.display = "none";
    creditsMenu.style.display = "none";
    
    gameScreen.style.display = "none";
}

function newGame() {
    mainMenu.style.display = "none";
    newGameMenu.style.display = "block";
}

function options() {
    mainMenu.style.display = "none";
    optionsMenu.style.display = "block";
    if (soundStatus) {
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
    if (!soundStatus) {
        soundOffBtn.style.color = textColor;
        soundOffBtn.style.cursor = "pointer";
        soundOnBtn.style.color = textColorDisabled;
        soundOnBtn.style.cursor = "default";
        soundStatus = true;
    }
}

function soundOff() {
    if (soundStatus) {
        soundOnBtn.style.color = textColor;
        soundOnBtn.style.cursor = "pointer";
        soundOffBtn.style.color = textColorDisabled;
        soundOffBtn.style.cursor = "default";
        soundStatus = false;
    }
}

function startGame(difficultyLevel) {
    game = new Game(difficultyLevel);
    back();
    menuScreen.style.display = "none";
    gameScreen.style.display = "block";
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