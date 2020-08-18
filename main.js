var game = new Game(Difficulty.BEGINNER);

window.onload = function() {
    document.getElementById("cm1").style.backgroundColor = game.codeMaker[0];
    document.getElementById("cm2").style.backgroundColor = game.codeMaker[1];
    document.getElementById("cm3").style.backgroundColor = game.codeMaker[2];
    document.getElementById("cm4").style.backgroundColor = game.codeMaker[3];
}

function getR() {
    return Math.floor(Math.random() * Colors.length);
}

function check() {
    codeBreaker = [
        Colors[getR()], 
        Colors[getR()], 
        Colors[getR()], 
        Colors[getR()]
    ];
    game.setCurrentCodeBreakerPattern(codeBreaker);
    
    var table = document.getElementById("game");
    var row = document.createElement("TR");
    
    //turn number column
    var turn = document.createElement("TD");
    turn.classList.add("turns");
    turn.innerHTML = game.turn;
    row.appendChild(turn);
    
    //breaker's code column
    var breakingCodesColumn = document.createElement("TD");
    for (var i=0; i<codeBreaker.length; i++) {
        var code = document.createElement("DIV");
        code.classList.add("box");
        code.style.backgroundColor = codeBreaker[i];
        breakingCodesColumn.appendChild(code);
    }
    
    row.appendChild(breakingCodesColumn);
            
    var codeMaker = [
        game.codeMaker[0],
        game.codeMaker[1],
        game.codeMaker[2],
        game.codeMaker[3]
    ];
    
    const feedback = game.getFeedback();
    game.incrementTurn();
    
    //feedback column
    var fb = document.createElement("TD");
    for(var i=0; i<feedback.length; i++) {
        var peg = document.createElement("DIV");
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