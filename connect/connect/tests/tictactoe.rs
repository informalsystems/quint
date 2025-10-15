use quint_connect::{run as quint_run, *};
use serde::Deserialize;
use std::collections::HashMap;

#[derive(Eq, PartialEq, Deserialize, Debug)]
#[serde(tag = "tag")]
enum Player {
    X,
    O,
}

type Position = (usize, usize);
type GameBoard = [[Option<Player>; 3]; 3];

#[derive(Default, Debug)]
struct TicTacToe {
    board: GameBoard,
}

impl TicTacToe {
    fn move_to(&mut self, pos: Position, player: Player) {
        let (x, y) = pos;
        // spec starts at 1... convert back to zero based indexing.
        let prev = self.board[y - 1][x - 1].replace(player);
        assert!(prev.is_none(), "moving to ocupied cell");
    }
}

#[derive(Deserialize, Debug)]
#[serde(tag = "tag", content = "value")]
enum Square {
    Occupied(Player),
    Empty,
}

#[derive(Deserialize, Debug)]
struct SpecBoard(HashMap<usize, HashMap<usize, Square>>);

impl From<SpecBoard> for GameBoard {
    fn from(value: SpecBoard) -> Self {
        let mut board = Self::default();
        for (x, col) in value.0 {
            for (y, square) in col {
                if let Square::Occupied(player) = square {
                    board[y - 1][x - 1] = Some(player);
                }
            }
        }
        board
    }
}

#[derive(Default)]
struct TicTacToeDriver {
    game: TicTacToe,
}

impl Driver for TicTacToeDriver {
    fn step(&mut self, step: &Step) -> Status {
        switch! {
            (self, step) {
                init => self.game = TicTacToe::default(),
                MoveO(coordinate) => self.game.move_to(coordinate, Player::O),
                MoveX(corner: Option<Position>, coordinate: Option<Position>) => {
                    match corner.or(coordinate) {
                        Some(pos) => self.game.move_to(pos, Player::X),
                        None => self.game.move_to((2, 2), Player::X),
                    }
                }
            }
        }
    }

    fn check(&self, step: Step) {
        if let Some(spec_board) = step.get::<SpecBoard>("board") {
            assert_eq!(
                self.game.board,
                Into::<GameBoard>::into(spec_board),
                "spec and game board don not match"
            );
        }
    }
}

#[quint_run(spec = "tests/fixtures/tictactoe.qnt", max_samples = 10)]
fn test_tictactoe() -> impl Driver {
    TicTacToeDriver::default()
}
