<<<<<<< HEAD
// --max-samples=1

module rockPaperScissor {

    const Players: Set[str]
    type Move = Init | Rock | Paper | Scissor
    type GameStatus = Started | Pending | Draw | Finished(str)

    var P1State : str -> Move
    var P2State : str -> Move
    var winner : GameStatus

    var p1Name : str
    var p2Name : str


    action init = {
        nondet first_player = Players.oneOf();
        nondet second_player = Players.filter(x => x != first_player).oneOf();
        all{
            p1Name' = first_player,
            p2Name' = second_player,
            P1State' = Map(first_player -> Init),
            P2State' = Map(second_player -> Init),
            winner' = Started,
        }
    }

    action decideMoves(p1 : str, p2: str): bool = {
        nondet move1 = Set(Rock, Paper, Scissor).oneOf()
        nondet move2 = Set(Rock, Paper, Scissor).oneOf()
        all {
            P1State' = P1State.set(p1, move1),
            P2State' = P2State.set(p2, move2)
=======

module rock_paper_scissor {

    // Constants for player names
    const PLAYER1 : str
    const PLAYER2 : str

    // Enum types for the possible moves and game status
    type Move = Init | Rock | Paper | Scissor
    type GameStatus = Started | Pending | Draw | Winner(str)

    // Variables to hold the current state of each player's move and the game status
    var p1State : Move
    var p2State : Move
    var game : GameStatus

    // Initialize the game with both players in 'Init' state and game status as 'Started'
    action init = all {
        p1State' = Init,
        p2State' = Init,
        game' = Started
    }


    // Randomly decide moves for both players from the set of possible moves
    action decideMoves() = {
        nondet move1 = Set(Rock, Paper, Scissor).oneOf() // Non-deterministically pick a move for player 1
        nondet move2 = Set(Rock, Paper, Scissor).oneOf() // Non-deterministically pick a move for player 1
        all {
            p1State' = move1,
            p2State' = move2
>>>>>>> 26ef1a2b (Add new example to classic/distributed)
        }
    }


<<<<<<< HEAD
    action updateWinner (p1 : str, p2 : str): bool = any {

        if  (
            (P1State.get(p1) == Rock and P2State.get(p2) == Scissor) or
            (P1State.get(p1) == Paper and P2State.get(p2) == Rock) or
            (P1State.get(p1) == Scissor and P2State.get(p2) == Paper)
        ){
            winner' = Finished(p1)
        }
        else {
            if (
            (P1State.get(p1) == Rock and P2State.get(p2) == Paper) or
            (P1State.get(p1) == Paper and P2State.get(p2) == Scissor) or
            (P1State.get(p1) == Scissor and P2State.get(p2) == Rock)
        ){
            winner' = Finished(p2)
        }
            else{
                winner' = Draw
=======
    // Determine the winner based on the current moves of both players
    action updateWinner () = any {
        if (
            (p1State == Rock and p2State == Scissor) or
            (p1State == Paper and p2State == Rock) or
            (p1State == Scissor and p2State == Paper)
        ){
            game' = Winner(PLAYER1) // Player 1 wins if their move beats player 2's move
            
        } else {
            if (
            (p1State == Rock and p2State == Paper) or
            (p1State == Paper and p2State == Scissor) or
            (p1State == Scissor and p2State == Rock)
            ){

                game' = Winner(PLAYER2) // Player 2 wins if their move beats player 1's move
            } else {
                
                game' = Draw // It's a draw if both players chose the same move
>>>>>>> 26ef1a2b (Add new example to classic/distributed)
            }
        }

    }


<<<<<<< HEAD
    action step = if ((P1State.get(p1Name) == Init) or (P2State.get(p2Name) == Init))  all {

        p1Name' = p1Name,
        p2Name' = p2Name,
        decideMoves(p1Name, p2Name),
        winner' = Pending,

    } else {
        if(winner == Pending) all{
            P1State' = P1State.set(p1Name, P1State.get(p1Name)),
            P2State' = P2State.set(p2Name, P2State.get(p2Name)),
            updateWinner(p1Name, p2Name),
            p1Name' = p1Name,
            p2Name' = p2Name,
        }  else all {
            P1State' = P1State.set(p1Name, Init),
            P2State' = P2State.set(p2Name, Init),
            p1Name' = p1Name,
            p2Name' = p2Name,
            winner' = Started
        }
    }

    val winCondition1 = (
        (P1State.get(p1Name) == Paper and P2State.get(p2Name) == Rock)
        or
        (P1State.get(p1Name) == Rock and P2State.get(p2Name) == Scissor)
        or
        (P1State.get(p1Name) == Scissor and P2State.get(p2Name) == Paper)
    )

    val winCondition2 = (

        (P2State.get(p2Name) == Paper and P1State.get(p1Name) == Rock)
        or
        (P2State.get(p2Name) == Rock and P1State.get(p1Name) == Scissor)
        or
        (P2State.get(p2Name) == Scissor and P1State.get(p1Name) == Paper)
    )

    val winInv = (winCondition1 implies (winner == Finished(p1Name)) or (winCondition2 implies (winner == Finished(p2Name))))
=======
    action step = if ((p1State == Init) or (p2State == Init)) all {
        // Decide the moves if the game is in the initial state
        decideMoves,
        // Put the game in the Pending status when players have made their moves
        game' = Pending,
        
    } else {
        if (game == Pending) all{
            // Put the game on hold with each player's move for one round to decide the winner
            p1State' = p1State,
            p2State' = p2State,
            // Update the winner based on the current moves
            updateWinner,

        }  else all {
            // Reset the game if it's not pending
            p1State' = Init,
            p2State' = Init,
            game' = Started
        }
    }


    // Conditions to determine the winner based on players' moves
    val winCondition1 = (
        (p1State == Paper and p2State == Rock)
        or
        (p1State == Rock and p2State == Scissor)
        or
        (p1State == Scissor and p2State == Paper)
    )

    val winCondition2 = (
        (p2State == Paper and p1State == Rock)
        or
        (p2State == Rock and p1State == Scissor)
        or
        (p2State == Scissor and p1State == Paper)
    )

    // Invariant to check if the game status matches the expected winner
    val winInv = (winCondition1 implies (game == Winner(PLAYER1)) or (winCondition2 implies (game == Winner(PLAYER2))))
>>>>>>> 26ef1a2b (Add new example to classic/distributed)

}

module PlayRockPaperScissor {
<<<<<<< HEAD
    import rockPaperScissor(Players= Set("Mahtab", "Zahra")).*    
=======
    import rock_paper_scissor(PLAYER1 = "Mahtab", PLAYER2 = "Gabriela").*    
>>>>>>> 26ef1a2b (Add new example to classic/distributed)
}