/* Grumpy Strategy:
The AI always plays 'silent', unless
they are "grumpy", in which they will
play 'betray'. */

/*let aimoves: string[] = [];
let enemymoves: string[] = [];*/

//AI and Player (enemy) moves set to 'nothing' as default (haven't chosen)
let aiMove: string = 'nothing'
let enemyMove: string = 'nothing'
//AI and Player amount of years set to 0 by default and changes depending on the outcome of every round
let aiYears: number = 0
let enemyYears: number = 0
//Variable used to determine whether the AI is 'silent' or 'betray'
let aiHappiness: number = 7
//Variable used to break out of the main while loop after a certain amount of rounds
let turnsLeft: number = 20

//Everything in this while loop is executed over and over whilst turnsLeft is not 0
while (turnsLeft > 0) {
	//This delays the program until the player has chosen their move
    while (enemyMove == 'nothing') {
		//If the player presses the A button, their choice is 'silent'
        input.onButtonPressed(Button.A, () => {
            enemyMove = 'silent'
        })
		//If the player presses the B button, their choice is 'betray'
        input.onButtonPressed(Button.B, () => {
            enemyMove = 'betray'
        })
    }
	
	//If the happiness of the AI is greater than or equal to 5, then it's choice will be 'silent'
    if (aiHappiness >= 5) {
        aiMove = 'silent'
    } 
	//Otherwise (if it is less than 5), it's choice will be 'betray'
	else {
        aiMove = 'betray'
    }

	//If both AI and player choose 'silent', then they both get 3 Years
    if (aiMove == 'silent' && enemyMove == 'silent') {
        aiYears += 3
        enemyYears += 3
		//The amount of years the player gets is displayed to them
        basic.showLeds(`
            . # # # .
            # . . . #
            . . # # .
            # . . . # 
            . # # # .
        `)
    }
	//If both AI and player choose 'betray', then they both get 4 Years
	if (aiMove == 'betray' && enemyMove == 'betray') {
        aiYears += 4
        enemyYears += 4
		//The amount of years the player gets is displayed to them
        basic.showLeds(`
            . . . # .
            . . # # .
            . # . # .
            # # # # #
            . . . # .
        `)
    } 
	//If the AI chooses to be 'silent' and the player chooses to 'betray', then the AI gets 5 years and the player gets nothing
	if (aiMove == 'silent' && enemyMove == 'betray') {
        aiYears += 5
		//The amount of years the player gets is displayed to them
        basic.showLeds(`
            . # # # .
            # . . # #
            # . # . #
            # # . . #
            . # # # . 
        `)
    } 
	//If the AI chooses to 'betray' and the player chooses to be 'silent', then the player gets 5 years and the AI gets nothing
	if (aiMove == 'betray' && enemyMove == 'silent') {
        enemyYears += 5
		//The amount of years the player gets is displayed to them
        basic.showLeds(`
            # # # # #
            # . . . .
            # # # # .
            . . . . #
            # # # # . 
        `)
    }
	
	//If the player decided to be 'silent', then the AI's happiness increases
    if (enemyMove == 'silent') {
        aiHappiness += 1
    } 
	//If the player decided to 'betray', then the AI's happiness decreases
	else {
        aiHappiness -= 1
    }

	//Used to make sure the value of aiHappiness never goes below 0 or above 10
    if (aiHappiness < 0) {
        aiHappiness == 0
    } 
	if (aiHappiness > 10) {
        aiHappiness == 10
    }

	//At the end of the round, the variable turnsLeft is decreased by 1 to get closer to exiting the while loop
    turnsLeft -= 1
	//Also at the end of the round, the AI and player move is reset to 'nothing'
    aiMove = 'nothing'
    enemyMove = 'nothing'

}

//If the AI has more years left than the player, the player wins
if (aiYears > enemyYears) {
    basic.showString("Player wins!")
} 
//If the player has more years left than the AI, the AI wins
if (enemyYears > aiYears) {
    basic.showString("AI wins!")
} 
//If both player and AI have the same amount of years left, it is a draw
else {
    basic.showString("Draw!")
}
