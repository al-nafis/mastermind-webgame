# mastermind-webgame

Welcome to Mastermind!

This webgame is developed with pure JavaScript, SCSS/CSS and HTML. Feel free to take a look at the source.

To play or see the game live, <a href="http://mastermind.mnafis.com" target="_blank">Click Here</a>!

## How to Play

The Objective of the game is to break the existing code pattern that is hidden under the heartbeat.

![htp_heartbeat](images/htp_heartbeat.png)

The code is the sequence of different colored pegs. You get a specific number of attempts. For each attempt, you will try to guess the right combination of the code pegs. You will select colors and add them to the current attempt row by clicking or tapping them from the Color Palette

![htp_palette](images/htp_palette.png)

You can also on tap the CLEAR button the to clear the current row before you get a feedback. Once you have filled  the current row with colors, hit the BREAK button.

![htp_buttons](images/htp_buttons.png)

You will get a feedback on the right side of your guessed pattern. The feedback will be either BLACK or WHITE pegs.

![htp_buttons](images/htp_row.png)

- BLACK PEG means one of your guess pegs have the correct color and position
- WHITE PEG means One of your guess pegs have the corrent color but wrong position

Based on the feedback, you will compare previous attempts to each other and use logic to figure out what the right pattern would be.

Good Luck!


## Things to Improve
- edge browser support
- small laptop screen support