/* Declare variables */
const MAX_ROUNDS = 5
let roundsCompleted = 0

let verification: boolean[] = [false, false]
let inputted: boolean[] = [false, false]

let localPlayer: Player
let foreignBetray: boolean
let foreignScore = 0

/* STATE enumeration */
enum STATE {
    INIT = 1,
    VER_PLAYER,
    VER_COMPLETE,
    GAME,
    POST_GAME
}
let state = STATE.INIT

/* Player class */
class Player {
    private isHuman: boolean
    private years: number
    private moves: boolean[]
    private ai: Ai

    constructor(isHuman: boolean) {
        this.isHuman = isHuman
        this.years = 0
        this.moves = []

        if (!this.isHuman) {
            this.ai = new Ai(this)
        }
    }

    public getMoves(): boolean[] {
        return this.moves
    }

    public getNextMove(): boolean {
        return this.moves[this.moves.length - 1]
    }

    public addMove(move: boolean): void {
        this.moves.push(move)
    }

    public addYears(years: number): void {
        this.years += years
    }

    public getYears(): number {
        return this.years
    }

    public isHumanPlayer(): boolean {
        return this.isHuman
    }

    public respond(): void {
        if (this.isHuman)
            return;

        radio.sendString(this.ai.getDecision() ? "cB" : "cA")
    }
}

/* Ai Class */
class Ai {
    private player: Player
    private aiMoves: boolean[]
    private enemyMoves: boolean[]
    private strategies: Strategy[]
    private currentStratIndex: number

    //this function is called to create the AI    
    constructor(player: Player) {
        this.player = player
        this.aiMoves = player.getMoves()
        this.enemyMoves = []
        this.strategies = []
        this.currentStratIndex = 0

        this.strategies.push(new Strategy1(this))
        this.strategies.push(new Strategy2(this))
        this.strategies.push(new Strategy3(this))
    }

    public getAiMoves(): boolean[] {
        return this.aiMoves
    }

    public getEnemyMoves(): boolean[] {
        let moves: boolean[] = []
        for (let i = 0; i < this.enemyMoves.length - 1; i++) {
            moves.push(this.enemyMoves[i])
        }
        return moves
    }

    public registerEnemyMove(enemyMove: boolean): void {
        this.enemyMoves.push(enemyMove)
    }

    public getDecision(): boolean {
        let decision = this.strategies[this.currentStratIndex].getNextMove()
        this.aiMoves.push(decision)
        return decision
    }
}

/* Strategy class */
class Strategy {
    protected parentAi: Ai

    constructor(ai: Ai) {
        this.parentAi = ai
    }

    getNextMove(): boolean {
        return true
    }
}

/* Strategy 1
    Tit for tat: copies the last move of the opponent
*/
class Strategy1 extends Strategy {

    constructor(ai: Ai) {
        super(ai)
    }

    getNextMove(): boolean {
        let enemyMoves = this.parentAi.getEnemyMoves()
        return enemyMoves.length > 0 ? enemyMoves[enemyMoves.length - 1] : true
    }

}

/* Unforgiving
    If the opponent has betrayed before, the AI will
    always betray.
*/
class Strategy2 extends Strategy {

    constructor(ai: Ai) {
        super(ai)
    }

    getNextMove(): boolean {
        let enemyMoves = this.parentAi.getEnemyMoves()
        for (let i = 0; i < enemyMoves.length; i++) {
            if (enemyMoves[i]) {
                return true
            }
        }
        return false
    }
}

/* Champion


*/
class Strategy3 extends Strategy {

    constructor(ai: Ai) {
        super(ai)
    }

    getNextMove(): boolean {
        let enemyMoves = this.parentAi.getEnemyMoves()
        let start = true
        let percent = 0
        let currentRound = enemyMoves.length - 1;

        if (currentRound < 6) {
            return false
        } else if (currentRound < 11) {
            return enemyMoves[enemyMoves.length - 1]
        } else {
            if (start) {
                for (let i = 0; i < 11; i++) {
                    if (enemyMoves[i]) {
                        percent += 1
                    }
                }
                start = false
            }

            if (enemyMoves[enemyMoves.length - 1] || percent > 5) {
                return enemyMoves[enemyMoves.length - 1]
            } else {
                return true
            }
        }

    }

}

/*
Resurrection
The AI will play 'silent' in the first 5 turns.
After 5 turns, the AI will play 'betray' if the
player had 'betray'ed the previous 5 turns. 
Otherwise, it follows "Tit for Tat".
*/
class Strategy4 extends Strategy {

    constructor(ai: Ai) {
        super(ai)
    }

    //return true if betray, return false if silent
    getNextMove() : boolean {
        let enemyMoves = this.parentAi.getEnemyMoves()       
        let currentRound = enemyMoves.length - 1;


    }

}

/* Grumpy Strategy:
The AI always plays 'silent', unless
they are "grumpy", in which they will
play 'betray'. */
class Strategy5 extends Strategy {

    constructor(ai: Ai) {
        super(ai)
    }

    //return true if betray, return false if silent
    getNextMove() : boolean {
        let enemyMoves = this.parentAi.getEnemyMoves()       
        let currentRound = enemyMoves.length - 1;


    }

}

/* Event handler for receiving the opponent's choice */
// cA - Silent
// cB - Betray
radio.onDataPacketReceived(({receivedString}) => {

    if (state == STATE.VER_PLAYER) {

        verification[1] = true

    } else if (state == STATE.GAME) {

        if (receivedString[0] == "c") {
            foreignBetray = receivedString[1] === "B"
            inputted[1] = true
        }

    }

})

/* function that handles button presses */
function handleInput(buttonName: string) {
    let stringToSend = buttonName === "A" ? "cA" : "cB"

    if (state == STATE.VER_PLAYER) {
        if (!verification[0]) {
            verification[0] = true
            localPlayer = new Player(buttonName === "A")
            radio.sendString(stringToSend)
        }
    } else if (state == STATE.GAME && !inputted[0] && localPlayer.isHumanPlayer()) {
        localPlayer.addMove(buttonName === "B")
        inputted[0] = true
        radio.sendString(stringToSend)
    }
}

/* Button A (Left) event handler */
input.onButtonPressed(Button.A, () => {
    handleInput("A")
})

/* Button B (Right) event handler */
input.onButtonPressed(Button.B, () => {
    handleInput("B")
})

/* Begins the player verification process */
function startVerification() {
    state = STATE.VER_PLAYER
    basic.showString("V")
}

/* Checks if the verification has finished */
function checkVerification() {
    if (verification[0] && verification[1]) {
        state = STATE.VER_COMPLETE
    }
}

/* Game loop */
function startGameLoop() {
    state = STATE.GAME
    let roundInitialised = false

    basic.forever(() => {

        if (state == STATE.GAME) {
            if (!roundInitialised) {
                basic.showNumber((roundsCompleted + 1))

                if (!localPlayer.isHumanPlayer()) {
                    localPlayer.respond()
                    inputted[0] = true
                }

            }

            if (inputted[0] && inputted[1]) {

                let localBetray = localPlayer.getNextMove()

                if (localBetray && foreignBetray) {
                    localPlayer.addYears(2)
                    foreignScore += 2
                } else if (!(localBetray) && !(foreignBetray)) {
                    localPlayer.addYears(1)
                    foreignScore += 1
                } else if (!(localBetray) && foreignBetray) {
                    localPlayer.addYears(3)
                } else {
                    foreignScore += 3
                }

                inputted = [false, false]
                roundsCompleted++
                roundInitialised = false
            }
        }

        if (roundsCompleted >= MAX_ROUNDS) {
            state = STATE.POST_GAME
        }
    })
}

/* Concludes the game */
function endGame() {
    basic.pause(500)
    let conclusion: string
    let localScore = localPlayer.getYears()

    if (localScore < foreignScore) {
        conclusion = "WIN"
    } else if (localScore > foreignScore) {
        conclusion = "LOSS"
    } else {
        conclusion = "DRAW"
    }
    basic.showString("" + conclusion + " " + localScore + ":" + foreignScore)
}

/* Main function */
function main() {
    basic.forever(() => {

        switch (state) {
            case STATE.INIT:
                startVerification()
                break
            case STATE.VER_PLAYER:
                checkVerification()
                break
            case STATE.VER_COMPLETE:
                startGameLoop()
                break
            case STATE.POST_GAME:
                endGame()
        }

    })
}

main()
