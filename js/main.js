let welcomeMenu, mainMenu, newGameMenu, optionsMenu, 
    creditsMenu, soundOnBtn, soundOffBtn, menuScreen, 
    gameScreen, dialogBox, game, codeMakerPalette, 
    codeMakerPaletteOverlay, soundImg, guesses, decodeBtn, 
    clearBtn, dialogHeader, dialogTitle, dialogCloseBtn, 
    dialogBody, dialogButtons, dialogRestartBtn, dialogQuitBtn;

let codeMakerCodePegs = [];
let guessCodeRows = [];
let currentRowCodePegs = [];
let currentRowKeyPegsHolder = [];
let emptyPegColor = "rgba(0, 0, 0, 0)";
let textColor = "";

let musicStatus = true;
const backgroundMusic = new Audio("sounds/Dreaming.ogg");

const textColorDisabled = "red";

const DialogCases = {
    PEGS_FILLED: "All pegs are filled",
    PEG_NOT_FILLED: "All pegs must be filled",
    DUPLICATES: "Duplicates are not allowed in Beginner level",
    GAME_OVER_WIN: "Congrats! You have decoded the pattern successfully",
    GAME_OVER_LOSE: "You have failed to decode the pattern",
    RESTART_GAME: "Are you sure you want to restart the game?",
    QUIT_GAME: "Are you sure sure you want to quit the game?"
}


// reusable ui methods
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
//reusable ui methods end

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
    codeMakerPaletteOverlay = getId("code-maker-palette-overlay");
    soundImg = getId("game-sound-btn");
    guesses = getId("guesses");
    decodeBtn = getId("decode-btn");
    clearBtn = getId("clear-btn");
    dialogHeader = getId("dialog-header");
    dialogTitle = getId("dialog-title");
    dialogCloseBtn = getId("dialog-close-btn");
    dialogBody = getId("dialog-body");
    dialogButtons = getId("dialog-buttons");
    dialogRestartBtn = getId("dialog-restart-btn");
    dialogQuitBtn = getId("dialog-quit-btn");
    
    displayNone(mainMenu);
    displayNone(newGameMenu);
    displayNone(optionsMenu);
    displayNone(creditsMenu);
    
    displayNone(gameScreen);
    displayNone(dialogBox);
    displayFlex(document.getElementsByTagName("main")[0]);
    
    textColor = document.getElementsByTagName('body')[0].style.color
    
    backgroundMusic.preload = "auto";
    
    adjustGuessesHeight();
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
    //music status
    if (musicStatus) {
        soundImg.src = "images/unmute.png";
    } else {
        soundImg.src = "images/mute.png";
    }
    
    for (let i=0; i<game.codeMaker.length; i++) {
        const color = createDiv();
        addClass(color, "code-maker-color-peg");
        updateBackgroundColor(color, game.codeMaker[i]);
        codeMakerPalette.appendChild(color);
        codeMakerCodePegs.push(color);
    }
    setupInitialGuessRow();
}

function setupInitialGuessRow() {
    currentRowCodePegs = [];
    currentRowKeyPegsHolder = [];
    game.currentCodeBreakerPattern = [];
    
    //adding a row
    const row = createDiv();
    addClass(row, "row");
    guesses.prepend(row);
    guessCodeRows.push(row);
    
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
}

function onClickCodePeg(color) {
    let allPegsFilled = true;
    for (let i=0; i<currentRowCodePegs.length; i++) {
        if (game.difficultyLevel == Difficulty.BEGINNER && 
            currentRowCodePegs[i].style.backgroundColor == color) {
            showDialog(DialogCases.DUPLICATES);
            allPegsFilled = false;
            break;
        } else if(currentRowCodePegs[i].style.backgroundColor == emptyPegColor) {
            updateBackgroundColor(currentRowCodePegs[i], color);
            game.currentCodeBreakerPattern.push(color);
            allPegsFilled = false;
            break;
        }
    }
    if (allPegsFilled) {
        showDialog(DialogCases.PEGS_FILLED);
    }
}

function decode() {
    //checking if all pegs are filled
    let allPegsFilled = true;
    for (let i=0; i<currentRowCodePegs.length; i++) {
        if (currentRowCodePegs[i].style.backgroundColor == emptyPegColor) {
            allPegsFilled = false;
        }
    };
    
    if (allPegsFilled) {
        const feedback = game.getFeedback();

        //updating feedback ui
        for ( let i=0; i< feedback.length; i++) {
            const keyPeg = createDiv();
            updateBackgroundColor(keyPeg, feedback[i]);
            currentRowKeyPegsHolder[i].appendChild(keyPeg);
        }

        //checking if the game is over
        if (game.isGameOver() && game.userWon) {
            displayNone(codeMakerPaletteOverlay);
            showDialog(DialogCases.GAME_OVER_WIN);
        } else if (game.isGameOver() && !game.userWon) {
            displayNone(codeMakerPaletteOverlay);
            showDialog(DialogCases.GAME_OVER_LOSE);
        } else {
            game.attempt++;
            setupInitialGuessRow();
            guesses.scrollTop = 0;
        }
    } else {
        showDialog(DialogCases.PEG_NOT_FILLED);
    }
}

function clearRow() {
    currentRowCodePegs.forEach(function(item) {
        updateBackgroundColor(item, emptyPegColor);
    });
    game.currentCodeBreakerPattern = [];
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

function onClickQuitButton() {
    showDialog(DialogCases.QUIT_GAME);
}

function onClickRestartButton() {
    showDialog(DialogCases.RESTART_GAME);
}

function adjustGuessesHeight() {
    const wind = window.outerHeight;
    if (wind < 750) {
        guesses.style.maxHeight =(wind - 283) + "px";
    } else {
        guesses.style.maxHeight ="465px";
    }
}

function showDialog(dialogCase) {
    const temporaryDialogTime = 1500;
    
    updateContentText(dialogBody, dialogCase);
    displayFlex(dialogBox);
    
    switch (dialogCase) {
        case DialogCases.RESTART_GAME:
            updateContentText(dialogTitle, "Restart");
            updateContentText(dialogRestartBtn, "Yes");
            displayBlock(dialogHeader);
            displayNone(dialogQuitBtn);
            displayBlock(dialogRestartBtn);
            displayFlex(dialogButtons);
            break;
        case DialogCases.QUIT_GAME:
            updateContentText(dialogTitle, "Quit");
            updateContentText(dialogQuitBtn, "Yes");
            displayBlock(dialogHeader);
            displayBlock(dialogQuitBtn);
            displayNone(dialogRestartBtn);
            displayFlex(dialogButtons);
            break;
        case DialogCases.GAME_OVER_WIN:
        case DialogCases.GAME_OVER_LOSE:
            updateContentText(dialogTitle, "Game Over");
            updateContentText(dialogQuitBtn, "Menu");
            updateContentText(dialogRestartBtn, "Restart");
            displayNone(dialogCloseBtn);
            displayBlock(dialogHeader);
            displayBlock(dialogRestartBtn);
            displayBlock(dialogQuitBtn);
            displayFlex(dialogButtons);
            break;
        default:
            setTimeout(function() {
                closeDialog()
            }, temporaryDialogTime);
    }
}

function closeDialog() {
    updateContentText(dialogTitle, "");
    updateContentText(dialogBody, "");
    updateContentText(dialogQuitBtn, "");
    updateContentText(dialogRestartBtn, "");
    displayNone(dialogBox);
    displayBlock(dialogCloseBtn);
    displayNone(dialogHeader);
    displayNone(dialogRestartBtn);
    displayNone(dialogQuitBtn);
    displayNone(dialogButtons);
}

function resetGameScreen() {
    displayBlock(codeMakerPaletteOverlay);
    
    for (let i=0; i<codeMakerCodePegs.length; i++) {
        codeMakerCodePegs[i].remove();
    }
    
    for (let i=0; i<guessCodeRows.length; i++) {
        guessCodeRows[i].remove();
    };
    
}

function restartGame() {
    console.log("restart game");
    resetGameScreen();
    const difficultyLevel = game.difficultyLevel;
    game = new Game(difficultyLevel);
    setupGameScreen();
    closeDialog();
}

function quitGame() {
    console.log("quit game");
    resetGameScreen();
    closeDialog();
    displayBlock(menuScreen);
    displayNone(gameScreen);
}