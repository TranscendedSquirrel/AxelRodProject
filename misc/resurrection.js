/*Resurrection Strategy:
The AI will play 'silent' in the first 5 turns.
After 5 turns, the AI will play 'betray' if the
player had 'betray'ed the previous 5 turns. 
Otherwise, it follows "Tit for Tat".*/

//Players turns are stored in an array for the AI to use in certain conditions
let enemymoves: string[] = [];
//Both AI and enemy moves are set to 'nothing' by default
let aiMove: string = 'nothing'
let enemyMove: string = 'nothing'
//Both AI and enemy years are set to 0 by default
let aiYears: number = 0
let enemyYears: number = 0
//The turn going on is stored in "turn"
let turn: number = 1
//defections used to determine whether the AI defects
let defections: number = 0
//stores the length of the array to find the item at the end of the array for Tit for Tat
let enemyLastTurn: number = enemymoves.length()

//All code in this while statement will run over and over again as long as turn is less than 21 (>= 20)
while (turn < 21) {
	//This while statement used to stop the running of the code until the player presses a button
    while (enemyMove == 'nothing') {
		//If they press the A button, their choice is set to 'silent' and the while loop is exited
        input.onButtonPressed(Button.A, () => {
            enemyMove = 'silent'
			//If they choose 'silent', then the amount of defections in a row is reset to 0
            defections = 0
        })
		//If they press the B button, their choice is set to 'betray' and the while loop is exited
        input.onButtonPressed(Button.B, () => {
            enemyMove = 'betray'
			//If they choose 'betray', then the amount of defections in a row is incremented by 1
            defections += 1
        })
    }

	//During the first 5 turns, the AI will always be 'silent'
    if (turn <= 5) {
        aiMove = 'silent'
    } 
	//After 5 turns, the enemy will 'betray' if the player has 'betray'ed for the last 5 turns
	else if (turn >= 6 && defections >= 5) {
        aiMove = 'betray'
    } 
	//Otherwise, the AI's move is the players move from the previous turn
	else {
        aiMove = enemymoves[enemyLastTurn - 1]
    }

	//If both AI and player choose to be 'silent', both are given 3 years, and the amount of years is displayed to the player
    if (aiMove == 'silent' && enemyMove == 'silent') {
        aiYears += 3
        enemyYears += 3
        basic.showLeds(`
            . # # # .
            # . . . #
            . . # # .
            # . . . #
            . # # # .
        `)
    } 
	//If both AI and player choose to 'betray', both are given 4 years, and the amount of years is displayed to the player
	else if (aiMove == 'betray' && enemyMove == 'betray') {
        aiYears += 4
        enemyYears += 4
        basic.showLeds(`
            . . . # .
            . . # # .
            . # . # .
            # # # # #
            . . . # .
        `)
    } 
	//If the AI is 'silent' and the player 'betray's, the AI is given 5 years and the amount of years given to the player is displayed to them
	else if (aiMove == 'silent' && enemyMove == 'betray') {
        aiYears += 5
        basic.showLeds(`
            . # # # .
            # . . # #
            # . # . #
            # # . . #
            . # # # .
        `)
    } 
	//If the AI 'betray's and the player is 'silent', the player is given 5 years and the amount of years is displayed to them
	else if (aiMove == 'betray' && enemyMove == 'silent') {
        enemyYears += 5
        basic.showLeds(`
            # # # # #
            # . . . .
            # # # # .
            . . . . #
            # # # # .
        `)
    }

	//At the end of the turn, the players move is pushed onto the enemymoves array
    enemymoves.push(enemyMove)
	//The turn variable is incremented by 1
    turn += 1
	//And both AI and enemy moves are reset to 'nothing'
    aiMove = 'nothing'
    enemyMove = 'nothing'
}

//If the AI has less years than the player, then the player loses
if (aiYears < enemyYears) {
    basic.showString("Lose!")
} 
//If the player has less years than the AI, then the player wins
else if (aiYears > enemyYears) {
    basic.showString("Win!")
} 
//If the AI and enemy years are the same, it is a draw
else {
    basic.showString("Draw!")
}