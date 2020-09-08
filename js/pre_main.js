let welcomeMenu, mainMenu, newGameMenu, optionsMenu, soundOnBtn, soundOffBtn, menuScreen, gameScreen, loadingScreen, dialogBox, game, codeMakerPalette, codeMakerPaletteOverlay, howToPlay, difficultyLevelDisplay,soundImg, guesses, dialogHeader, dialogTitle, dialogCloseBtn, dialogBody, dialogButtons, dialogRestartBtn, dialogQuitBtn, dialogReviewBtn, textColor;

let codeMakerCodePegs = [];
let guessCodeRows = [];
let currentRowCodePegs = [];
let currentRowKeyPegsHolder = [];
let emptyPegColor = "rgba(0, 0, 0, 0)";

let musicStatus = true;
const backgroundMusic = new Audio("sounds/sound.ogg");

const textColorDisabled = "#525252";
const animationDuration = 300;
const animationDurationMedium = 1000;
const animationDurationSlow = 1500;
const loadingDuration = 2000;
const temporaryDialogDuration = 1500;

const DialogCases = {
    PEGS_FILLED: "All pegs are filled",
    PEG_NOT_FILLED: "All pegs must be filled",
    DUPLICATES: "Duplicates are not allowed in Beginner level",
    GAME_OVER_WIN: "Congrats! You have decoded the pattern successfully",
    GAME_OVER_LOSE: "You have failed to decode the pattern",
    RESTART_GAME: "Are you sure you want to restart the game?",
    QUIT_GAME: "Are you sure sure you want to quit the game?"
}

const NavigationStyle = {
    SWIPE_LEFT: "swipeLeft",
    SWIPE_RIGHT: "swipeRight",
    SWIPE_UP: "swipeUp",
    SWIPE_DOWN: "swipeDown",
    FADE: "fade"
}

const AnimationStyle = {
    FADE_IN: "fadeIn",
    FADE_IN_FLEX: "fadeInFlex",
    FADE_OUT: "fadeOut",
    PALETTE_SLIDE_IN: "paletteSlideIn",
    PALETTE_SLIDE_OUT: "paletteSlideOut",
}


// reusable ui methods
function viewById(id) {
    return document.getElementById(id);
}

function createDiv() {
    return document.createElement("DIV");
}

function displayNone(view) {
    view.style.display = "none";
}

function displayNoneAll(viewArray) {
    for (let i=0; i<viewArray.length; i++) {
        viewArray[i].style.display = "none";
    }
}

function displayBlock(view) {
    view.style.display = "block";
}

function displayBlockAll(viewArray) {
    for (let i=0; i<viewArray.length; i++) {
        viewArray[i].style.display = "block";
    }
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

function addClass(view, className) {
    view.classList.add(className);
}

function removeClass(view, className) {
    view.classList.remove(className);
}

function getRandomColor() {
    return Colors[Math.floor(Math.random() * Colors.length)];
}

function animateCodemakerPalette() {
    for (let i=0; i<game.codeMaker.length; i++) {
        updateBackgroundColor(codeMakerCodePegs[i], getRandomColor());
    }
}

function animate(view, animationStyle) {
    let animationClassName;
    let animDuration = animationDuration;
    switch (animationStyle) {
        case AnimationStyle.FADE_IN:
            animationClassName = "fadeIn";
            displayBlock(view);
            break;
        case AnimationStyle.FADE_IN_FLEX:
            animationClassName = "fadeIn";
            displayFlex(view);
            break;
        case AnimationStyle.FADE_OUT:
            animationClassName = "fadeOut";
            setTimeout(function() {
                displayNone(view);
            }, animDuration);
            break;
        case AnimationStyle.PALETTE_SLIDE_IN:
            animDuration = animationDurationSlow;
            animationClassName = "paletteSlideIn";
            setTimeout(function() {
                view.style.transform = "translateX(0%)";
            }, animDuration);
            break;
        case AnimationStyle.PALETTE_SLIDE_OUT:
            animDuration = animationDurationSlow;
            animationClassName = "paletteSlideOut";
            setTimeout(function() {
                view.style.transform = "translateX(100%)";
            }, animDuration);
            break;
    }
    
    addClass(view, animationClassName);
    setTimeout(function() {
        removeClass(view, animationClassName);
    }, animDuration);
}

function navigate(navigateFrom, navigateTo, navigationStyle) {
    let navigateFromClassName,  navigateToClassName;
    switch (navigationStyle) {
        case NavigationStyle.SWIPE_LEFT:
            navigateFromClassName = "swipeLeftOut";
            navigateToClassName = "swipeLeftIn";
            break;
        case NavigationStyle.SWIPE_RIGHT:
            navigateFromClassName = "swipeRightOut";
            navigateToClassName = "swipeRightIn";
            break;
        case NavigationStyle.FADE:
            navigateFromClassName = "fadeOut";
            navigateToClassName = "fadeIn";
            break;
    }
    displayBlock(navigateTo);
    addClass(navigateFrom, navigateFromClassName);
    addClass(navigateTo, navigateToClassName);
    setTimeout(function() {
        displayNone(navigateFrom);
        removeClass(navigateFrom, navigateFromClassName);
        removeClass(navigateTo, navigateToClassName);
    }, animationDuration);
};

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

function showDialog(dialogCase) {
    updateContentText(dialogBody, dialogCase);
    animate(dialogBox, AnimationStyle.FADE_IN_FLEX);
    
    switch (dialogCase) {
        case DialogCases.RESTART_GAME:
            updateContentText(dialogTitle, "Restart");
            updateContentText(dialogRestartBtn, "Yes");
            displayBlockAll([dialogHeader, dialogRestartBtn]);
            displayNoneAll([dialogQuitBtn, dialogReviewBtn]);
            displayFlex(dialogButtons);
            break;
        case DialogCases.QUIT_GAME:
            updateContentText(dialogTitle, "Quit");
            updateContentText(dialogQuitBtn, "Yes");
            displayBlockAll([dialogHeader, dialogQuitBtn]);
            displayNoneAll([dialogRestartBtn, dialogReviewBtn]);
            displayFlex(dialogButtons);
            break;
        case DialogCases.GAME_OVER_WIN:
        case DialogCases.GAME_OVER_LOSE:
            updateContentText(dialogTitle, "Game Over");
            updateContentText(dialogQuitBtn, "Menu");
            updateContentText(dialogRestartBtn, "Restart");
            displayNone(dialogCloseBtn);
            displayBlockAll([dialogHeader, dialogRestartBtn, dialogReviewBtn, dialogQuitBtn]);
            displayFlex(dialogButtons);
            break;
        case DialogCases.PEGS_FILLED:
        case DialogCases.PEG_NOT_FILLED:
        case DialogCases.DUPLICATES:
        default:
            setTimeout(function() {
                closeDialog()
            }, temporaryDialogDuration);
    }
}