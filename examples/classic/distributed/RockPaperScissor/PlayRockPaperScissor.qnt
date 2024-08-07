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
        }
    }


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
            }
        }

    }


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

}

module PlayRockPaperScissor {
    import rockPaperScissor(Players= Set("Mahtab", "Zahra")).*    
}