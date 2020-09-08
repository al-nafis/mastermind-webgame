window.onload = function() {
    //screens
    welcomeMenu = viewById("welcome-menu");
    mainMenu = viewById("main-menu");
    newGameMenu = viewById("new-game-menu");
    optionsMenu = viewById("options-menu");
    menuScreen = viewById("menu-screen");
    gameScreen = viewById("game-screen");
    loadingScreen = viewById("loading-screen");
    dialogBox = viewById("dialog-box");

    //buttons
    soundOnBtn = viewById("sound-on-btn");
    soundOffBtn = viewById("sound-off-btn");
    
    //game screen items
    howToPlay = viewById("how-to-play");
    difficultyLevelDisplay = viewById("difficulty-level-display");
    codeMakerPalette = viewById("code-maker-palette");
    codeMakerPaletteOverlay = viewById("code-maker-palette-overlay");
    soundImg = viewById("game-sound-btn");
    guesses = viewById("guesses");
    dialogHeader = viewById("dialog-header");
    dialogTitle = viewById("dialog-title");
    dialogCloseBtn = viewById("dialog-close-btn");
    dialogBody = viewById("dialog-body");
    dialogButtons = viewById("dialog-buttons");
    dialogRestartBtn = viewById("dialog-restart-btn");
    dialogQuitBtn = viewById("dialog-quit-btn");
    dialogReviewBtn = viewById("dialog-review-btn");
    
    displayNone(mainMenu);
    displayNone(newGameMenu);
    displayNone(optionsMenu);
    displayNone(gameScreen);
    displayNone(dialogBox);
    
    textColor = document.getElementsByTagName('body')[0].style.color
    
    backgroundMusic.preload = "auto";
    
    adjustGuessesHeight();
    
    setTimeout(function() {
        displayFlex(document.getElementsByTagName("main")[0]);
    }, 1000);
}

window.onresize = function() {
    setTimeout(adjustGuessesHeight(), 100);
}

function play() {
    navigate(welcomeMenu, mainMenu, NavigationStyle.FADE);
    backgroundMusic.loop = true;
    backgroundMusic.play();
}

function newGame() {
    navigate(mainMenu, newGameMenu, NavigationStyle.SWIPE_LEFT);
}

function options() {
    navigate(mainMenu, optionsMenu, NavigationStyle.SWIPE_LEFT);
    if (musicStatus) {
        updateSoundUiOn()
    } else {
        updateSoundUiOff();
    }
}

function back() {
    navigate(newGameMenu, mainMenu, NavigationStyle.SWIPE_RIGHT);
    navigate(optionsMenu, mainMenu, NavigationStyle.SWIPE_RIGHT);
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
    navigate(menuScreen, loadingScreen, NavigationStyle.FADE);
    setTimeout(function() {
        navigate(loadingScreen, gameScreen, NavigationStyle.FADE);
        back();
        setupGameScreen();
    }, loadingDuration);
}

function setupGameScreen() {
    //music status
    if (musicStatus) {
        soundImg.src = "images/unmute.png";
    } else {
        soundImg.src = "images/mute.png";
    }
    
    updateContentText(difficultyLevelDisplay, game.difficultyLevel);
    displayBlock(codeMakerPaletteOverlay);
    
    //setup the codemaker's pattern
    setTimeout(function() {
        for (let i=0; i<game.codeMaker.length; i++) {
            const color = createDiv();
            addClass(color, "code-maker-color-peg");
            updateBackgroundColor(color, getRandomColor());
            codeMakerPalette.appendChild(color);
            codeMakerCodePegs.push(color);
        }
        const intervalSetter = setInterval(animateCodemakerPalette, animationDurationSlow / 5);   
        animate(codeMakerPaletteOverlay, AnimationStyle.PALETTE_SLIDE_IN);
        setTimeout(function() {
            clearInterval(intervalSetter);
            for (let i=0; i<game.codeMaker.length; i++) {
                updateBackgroundColor(codeMakerCodePegs[i], game.codeMaker[i]);
            }
        }, animationDurationSlow);
    }, animationDuration);
    
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

function breakCode() {
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
            animate(codeMakerPaletteOverlay, AnimationStyle.PALETTE_SLIDE_OUT);
            setTimeout(function() {
                displayNone(codeMakerPaletteOverlay);
                showDialog(DialogCases.GAME_OVER_WIN);
            }, animationDurationSlow);
            disablePaletteAndButtons(true);
        } else if (game.isGameOver() && !game.userWon) {
            animate(codeMakerPaletteOverlay, AnimationStyle.PALETTE_SLIDE_OUT);
            setTimeout(function() {
                displayNone(codeMakerPaletteOverlay);
                showDialog(DialogCases.GAME_OVER_LOSE);
            }, animationDurationSlow);
            disablePaletteAndButtons(true);
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

function onClickHtpButton() {
    animate(howToPlay, AnimationStyle.FADE_IN);
    viewById("htp-body").scrollTop = 0;
}

function closeHtp() {
    animate(howToPlay, AnimationStyle.FADE_OUT);
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

function closeDialog() {
    animate(dialogBox, AnimationStyle.FADE_OUT);
    setTimeout(function() {
        updateContentText(dialogTitle, "");
        updateContentText(dialogBody, "");
        updateContentText(dialogQuitBtn, "");
        updateContentText(dialogRestartBtn, "");
        displayBlock(dialogCloseBtn);
        displayNone(dialogHeader);
        displayNone(dialogRestartBtn);
        displayNone(dialogReviewBtn);
        displayNone(dialogQuitBtn);
        displayNone(dialogButtons);
    }, animationDuration);
}

function disablePaletteAndButtons(isDisabled) {
    let clickEnabledValue;
    if (isDisabled) {
        clickEnabledValue = "none";
    } else {
        clickEnabledValue = "auto";
    }
    viewById("color-red").style.pointerEvents = clickEnabledValue;
    viewById("color-blue").style.pointerEvents = clickEnabledValue;
    viewById("color-green").style.pointerEvents = clickEnabledValue;
    viewById("color-yellow").style.pointerEvents = clickEnabledValue;
    viewById("color-white").style.pointerEvents = clickEnabledValue;
    viewById("color-black").style.pointerEvents = clickEnabledValue;
    viewById("break-btn").disabled = isDisabled;
    viewById("clear-btn").disabled = isDisabled;
}

function resetGameScreen() {
    updateContentText(difficultyLevelDisplay, "");
    codeMakerPaletteOverlay.style.transform = "translateX(-100%)";
    
    for (let i=0; i<codeMakerCodePegs.length; i++) {
        codeMakerCodePegs[i].remove();
    }
    codeMakerCodePegs = [];
    
    for (let i=0; i<guessCodeRows.length; i++) {
        guessCodeRows[i].remove();
    };
    guessCodeRows = [];
}

function reviewGame() {
    closeDialog();
    disablePaletteAndButtons(true);
}

function restartGame() {
    disablePaletteAndButtons(false);
    resetGameScreen();
    closeDialog();
    navigate(gameScreen, loadingScreen, NavigationStyle.FADE);
    setTimeout(function() {
        navigate(loadingScreen, gameScreen, NavigationStyle.FADE);
        const difficultyLevel = game.difficultyLevel;
        game = new Game(difficultyLevel);
        setupGameScreen()
    }, loadingDuration);;
}

function quitGame() {
    disablePaletteAndButtons(false);
    resetGameScreen();
    closeDialog();
    navigate(gameScreen, loadingScreen, NavigationStyle.FADE);
    setTimeout(function() {
        navigate(loadingScreen, menuScreen, NavigationStyle.FADE);
    }, loadingDuration);
}