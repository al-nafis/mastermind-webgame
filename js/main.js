let welcomeMenu, mainMenu, newGameMenu, optionsMenu, creditsMenu, soundOnBtn, soundOffBtn, menuScreen, gameScreen, dialogBox, game, codeMakerPalette, soundImg, guesses, decodeBtn, clearBtn, dialogBody;

let musicStatus = true;
const backgroundMusic = new Audio("sounds/Dreaming.ogg");

const textColor = "#ccc";
const textColorDisabled = "red";


// reusable methods
function getId(id) {
    return document.getElementById(id);
}

function createDiv() {
    return document.createElement("DIV");
}

function displayNone(view) {
    view.style.display = "none";
}

function displayBlock(view) {
    view.style.display = "block";
}

function displayFlex(view) {
    view.style.display = "flex";
}

function addClass(view, className) {
    view.classList.add(className);
}

function updateBackgroundColor(view, color) {
    view.style.backgroundColor = color;
}

function updateContentText(view, text) {
    view.textContent = text;
}

function updateSoundUiOn() {
    soundOffBtn.style.color = textColor;
    soundOffBtn.style.cursor = "pointer";
    soundOnBtn.style.color = textColorDisabled;
    soundOnBtn.style.cursor = "default";
}

function updateSoundUiOff() {
    soundOnBtn.style.color = textColor;
    soundOnBtn.style.cursor = "pointer";
    soundOffBtn.style.color = textColorDisabled;
    soundOffBtn.style.cursor = "default";
}
//reusable methods end

window.onload = function() {
    //screens
    welcomeMenu = getId("welcome-menu");
    mainMenu = getId("main-menu");
    newGameMenu = getId("new-game-menu");
    optionsMenu = getId("options-menu");
    creditsMenu = getId("credits-menu");
    menuScreen = getId("menu-screen");
    gameScreen = getId("game-screen");
    dialogBox = getId("dialog-box");

    //buttons
    soundOnBtn = getId("sound-on-btn");
    soundOffBtn = getId("sound-off-btn");
    
    //game screen items
    codeMakerPalette = getId("code-maker-palette");
    soundImg = getId("game-sound-btn");
    guesses = getId("guesses");
    decodeBtn = getId("decode-btn");
    clearBtn = getId("clear-btn");
    dialogBody = getId("dialog-body");
    
    displayNone(mainMenu);
    displayNone(newGameMenu);
    displayNone(optionsMenu);
    displayNone(creditsMenu);
    
    displayNone(gameScreen);
    displayNone(dialogBox);
    displayFlex(document.getElementsByTagName("main")[0]);
    
    backgroundMusic.preload = "auto";
    
    adjustGuessesHeight();
    
    //TESTING
    displayNone(menuScreen);
    displayBlock(gameScreen);
    game = new Game(Difficulty.BEGINNER);
    setupGameScreen();
//    backgroundMusic.loop = true;
//    backgroundMusic.play();
    //TESTING
}

window.onresize = function() {
    setTimeout(adjustGuessesHeight(), 100);
}

function play() {
    displayNone(welcomeMenu);
    displayBlock(mainMenu);
    backgroundMusic.loop = true;
    backgroundMusic.play();
}

function newGame() {
    displayNone(mainMenu);
    displayBlock(newGameMenu);
}

function options() {
    displayNone(mainMenu);
    displayBlock(optionsMenu);
    if (musicStatus) {
        updateSoundUiOn()
    } else {
        updateSoundUiOff();
    }
}

function credits() {
    displayNone(mainMenu);
    displayBlock(creditsMenu);
}

function back() {
    displayNone(newGameMenu);
    displayNone(optionsMenu);
    displayNone(creditsMenu);
    displayBlock(mainMenu);
}

function soundOn() {
    if (!musicStatus) {
        updateSoundUiOn();
        musicStatus = true;
        backgroundMusic.play();
    }
}

function soundOff() {
    if (musicStatus) {
        updateSoundUiOff();
        musicStatus = false;
        backgroundMusic.load();
    }
}

function startGame(difficultyLevel) {
    game = new Game(difficultyLevel);
    back();
    displayNone(menuScreen);
    displayBlock(gameScreen);
    setupGameScreen();
}

function setupGameScreen() {
    for (let i=0; i<game.codeMaker.length; i++) {
        const color = createDiv();
        addClass(color, "color-pegs-4");
        updateBackgroundColor(color, game.codeMaker[i]);
        codeMakerPalette.appendChild(color);
    }
    setupInitialGuessRow();
}

let currentRowCodePegs = [];
let currentRowKeyPegsHolder = [];
let emptyPegColor = "rgba(0, 0, 0, 0)";

function setupInitialGuessRow() {
    currentRowCodePegs = [];
    currentRowKeyPegsHolder = [];
    
    //adding a row
    const row = createDiv();
    addClass(row, "row");
    guesses.prepend(row);
    
    //attempt Number
    const attemptNumber = createDiv();
    addClass(attemptNumber, "attempt-number");
    row.appendChild(attemptNumber);
    
    const attemptNumberInnerDiv = createDiv();
    attemptNumberInnerDiv.textContent = game.attempt;
    attemptNumber.appendChild(attemptNumberInnerDiv);
    
    //guess palette
    const guessPalette = createDiv();
    addClass(guessPalette, "guess-palette");
    row.appendChild(guessPalette);
    
    for (let i=0; i<game.codeMaker.length; i++) {
        const pegHolder = createDiv();
        if (game.difficultyLevel == Difficulty.ENGINEER) {
            addClass(pegHolder, "code-peg-holder-6pegs");
        } else {
            addClass(pegHolder, "code-peg-holder-4pegs");
        }
        guessPalette.appendChild(pegHolder);
        
        const codePeg = createDiv();
        updateBackgroundColor(codePeg, emptyPegColor);
        pegHolder.appendChild(codePeg);
        currentRowCodePegs.push(codePeg);
    }
    
    //feedback
    const feedbackHolder = createDiv();
    addClass(feedbackHolder, "feedback-holder");
    row.appendChild(feedbackHolder);
    
    const feedbackHolderInnerDiv = createDiv();
    feedbackHolder.appendChild(feedbackHolderInnerDiv);
    
    let eachRowKeyPegs = 2;
    if (game.difficultyLevel == Difficulty.ENGINEER) {
        eachRowKeyPegs = 3;
    }
    
    for (let i=0; i<2; i++) {
        const keyPegHolderOuterDiv = createDiv();
        feedbackHolderInnerDiv.appendChild(keyPegHolderOuterDiv);
        
        for (let j=0; j<eachRowKeyPegs; j++) {
            const keyPegHolder = createDiv();
            addClass(keyPegHolder, "key-peg-holder");
            keyPegHolderOuterDiv.appendChild(keyPegHolder);
            currentRowKeyPegsHolder.push(keyPegHolder);
        }
    }
    
    //music status
    if (!musicStatus) {
        soundImg.src = "images/mute.png";
    }
}

function onClickCodePeg(color) {
    let allPegsFilled = true;
    for (let i=0; i<currentRowCodePegs.length; i++) {
        if (game.difficultyLevel == Difficulty.BEGINNER && currentRowCodePegs[i].style.backgroundColor == color) {
            showDialog(true, "Duplicates not allowed in Beginner level");
            allPegsFilled = false;
            break;
        } else if(currentRowCodePegs[i].style.backgroundColor == emptyPegColor) {
            updateBackgroundColor(currentRowCodePegs[i], color);
            allPegsFilled = false;
            break;
        }
    }
    if (allPegsFilled) {
        showDialog(true, "All pegs are filled");
    }
}

function showDialog(isTemporary, body) {
    const dialogTime = 2000;
    if (isTemporary) {
        updateContentText(dialogBody, body);
        displayFlex(dialogBox);
        setTimeout(function() {
            closeDialog()
        }, dialogTime);
    }
}

function closeDialog() {
    updateContentText(dialogBody, "");
    displayNone(dialogBox);
}

function decode() {
    game.attempt++;
    setupInitialGuessRow();
    guesses.scrollTop = 0;
    
    if (game.isGameOver()) {
        decodeBtn.disabled = true;
        clearBtn.disabled = true;
    }
}

function clearRow() {
    currentRowCodePegs.forEach(function(item) {
        updateBackgroundColor(item, emptyPegColor);
    });
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
    
    const table = getId("game");
    const row = document.createElement("TR");
    
    //turn number column
    const turn = document.createElement("TD");
    addClass(turn, "turns");
    turn.innerHTML = game.attempt;
    row.appendChild(turn);
    
    //breaker's code column
    const breakingCodesColumn = document.createElement("TD");
    for (let i=0; i<codeBreaker.length; i++) {
        const code = createDiv();
        addClass(code, "box");
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
        const peg = createDiv();
        addClass(peg, "peg");
        peg.style.backgroundColor = feedback[i];
        fb.appendChild(peg);
    }
    row.appendChild(fb);
    
    table.appendChild(row);
    
    //checking for game over
    if (game.isGameOver()) {
        getId("gs").innerHTML += "Game Over";
        getId("check").disabled = true;
    }
}