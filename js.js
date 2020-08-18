var colors = ["RED","BLUE","YELLOW","GREEN","WHITE","BLACK"];
var codeMakerSet = [];
var codeBreaker = [];
var turns = 1;

window.onload = function() {
    codeMakerSet = [colors[getRandomNumber(colors.length)],colors[getRandomNumber(colors.length)],colors[getRandomNumber(colors.length)],colors[getRandomNumber(colors.length)]];
    document.getElementById("cm1").style.backgroundColor = codeMakerSet[0];
    document.getElementById("cm2").style.backgroundColor = codeMakerSet[1];
    document.getElementById("cm3").style.backgroundColor = codeMakerSet[2];
    document.getElementById("cm4").style.backgroundColor = codeMakerSet[3];
}

function check() {    
    codeBreaker = [colors[getRandomNumber(colors.length)], colors[getRandomNumber(colors.length)], colors[getRandomNumber(colors.length)], colors[getRandomNumber(colors.length)]];
    
    var table = document.getElementById("game");
    var row = document.createElement("TR");
    
    //turn number column
    var turn = document.createElement("TD");
    turn.classList.add("turns");
    turn.innerHTML = turns;
    turns++;
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
            
    //check status
    var totalMatch = 0;
    var feedback = [];
    var codeMaker = [codeMakerSet[0],codeMakerSet[1],codeMakerSet[2],codeMakerSet[3]];
    
    //checking for exact parallel match
    for(var i=0; i<codeBreaker.length; i++) {
        if (codeBreaker[i] == codeMaker[i]) {
            feedback.push("black");
            codeBreaker[i] = "MATCHED";
            codeMaker[i] = "MATCHED";
            totalMatch++;
        }
    };
    
    //checking for line existence
    for(var i=0; i<codeBreaker.length; i++) {
        if (codeBreaker[i] != "CHECKED" && codeBreaker[i] != "MATCHED") {   
            for(var j=0; j<codeMaker.length; j++) {
                if (codeMaker[j] != "CHECKED" && codeMaker[j] != "MATCHED") {
                    if (codeBreaker[i] == codeMaker[j]) {
                        feedback.push("white");                       
                        codeBreaker[i] = "CHECKED";
                        codeMaker[j] = "CHECKED";
                    }
                }
            }
        }
    };
    
    //getting feedback
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

    
    //test
    console.log("Code Maker: " + codeMaker);
    console.log("Code Breaker: " + codeBreaker);
    console.log("Feedback: " + feedback);
    console.log("------------------------------");
    
    
    //checking for game over
    if (totalMatch == 4) {
        document.getElementById("gs").innerHTML += "Game Over";
        document.getElementById("check").disabled = true;
    }
}

function getRandomNumber(n) {
    return Math.floor(Math.random() * n);
}