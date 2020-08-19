const Difficulty = {
    BEGINNER: "Beginner", // 6 colors + 4 code pegs + no duplicate
    DEVELOPER: "Developer", // 6 colors + 4 code pegs + duplicate
    ENGINEER: "Engineer", // 6 colors + 6 code pegs + duplicate
}

const Colors = ["red", "blue", "green", "yellow", "white", "black"];

class Game {
    
    constructor(difficultyLevel) {
        this.difficultyLevel = difficultyLevel;
        this.totalMatch = 0;
        this.turn = 1;
        this.codeMaker = getCodeMakerPattern();
        this.currentCodeBreakerPattern = [];
        
        //private function
        function getCodeMakerPattern() {
            const pattern = [];
            let totalCodePegs = 4;
            
            if (difficultyLevel == Difficulty.BEGINNER) {
                const cMaker = Colors.slice();
                for (let i=0; i<totalCodePegs; i++) {
                    let index = Math.floor(Math.random() * cMaker.length);
                    pattern.push(cMaker[index]);
                    cMaker.splice(index,1);
                }
            } else {
                if (difficultyLevel == Difficulty.ENGINEER) {
                    totalCodePegs = 6;
                }
                for (let i=0; i<totalCodePegs; i++) {
                    let index = Math.floor(Math.random() * Colors.length);
                    pattern.push(Colors[index]);
                }
            }

            return pattern;
        }
    }
    
    getFeedback() {
        const parallelMatch = "parallelMatch";
        const lineMatch = "lineMatch";
        const parallelMatchColor = "black";
        const lineMatchColor = "white";
        const feedback = [];
        const cMaker = this.codeMaker.slice();
        const cBreaker = this.currentCodeBreakerPattern.slice();
        
        //checking for exact match
        for (let i=0; i<cMaker.length; i++) {
            if (cMaker[i] == cBreaker[i]) {
                feedback.push(parallelMatchColor);
                cMaker[i] = parallelMatch;
                cBreaker[i] = parallelMatch;
            }
        }
        
        //checking for line match
        for (let i=0; i<cMaker.length; i++) {
            if (cMaker[i] != parallelMatch && cMaker[i] != lineMatch) {
                for (let j=0; j<cBreaker.length; j++) {
                    if (cBreaker[j] != parallelMatch && cBreaker[j] != lineMatch) {
                        if (cMaker[i] == cBreaker[j]) {
                            feedback.push(lineMatchColor);
                            cMaker[i] = lineMatch;
                            cBreaker[j] = lineMatch;
                        }
                    }
                }
            }
        }
        
        //test
        console.log("Turn: " + this.turn);
        console.log("Code Maker: " + cMaker);
        console.log("Code Breaker: " + cBreaker);
        console.log("Feedback: " + feedback);
        console.log("------------------------------");
        
        return feedback;
    }
    
    isGameOver() {
        if (this.totalMatch == this.codeMaker.length) {
            return true;
        } else {
            return false;
        }
    }
}