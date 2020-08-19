let game;

window.onload = function() {
    game = new Game(Difficulty.ENGINEER);
    for (let i=0; i<game.codeMaker.length; i++) {
        document.getElementById("cm" + (i+1)).style.backgroundColor = game.codeMaker[i];
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