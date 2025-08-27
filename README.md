
# Chess-Engine

## Chess Engine By Rikard

## Logic Data Structure
Piece.json


`
{
"piece": "K" | "P" | "Q" | "R" | "B" | "N",
"move-type": "leaper" | "slider",
"capture-Type": "same" | "different",
"flipped-for-black": true | false,
"vectors": [ [x,y], ... ],
"special": {
    "starting-pos-move": [ [x,y], ... ],
    "castle-l": [ [x,y], ... ],
    "castle-r": [ [x,y], ... ],
    "en-passant": [ [x,y], ... ]
}
}
`
## ROADMAP

-   [ ] Set up a basic chess game
    -   [X] Make a visual part for the chess engine.
        -   [X] Make a sprite object that has a draw function.
        -   [X] Finish sprite logic. Sprites should be able to be drawn anywhere but there needs to be logic that wraps around the sprite object in order to be able to spawn a sprite in any given tile on the chessboard.
        -   [X] When sprite logic is done, one should be able to drag pieces to other tiles. There should later be logic that blocks illegal moves.
        -   [X] Make the js read from a json file to be able to spawn in the starting formations etc. this can later be utilized to save formations/games to continue later.
    -   [X] Write the logic for the pieces
        -   [X] Make the logic modular by making a folder with json files containing logic such as possible moves for each piece i.e. K.json
    -   [X] Create functionality for the player to move the pieces
    -   [ ] Implement the logic
-   [ ] Create a basic chess engine now that you have made a functioning chess game.
    -   [ ] Make the computer be able to input
    -   [ ] Give it positive and negative feedback for behavior
    -   [ ] Train the chess engines against each other and crown the winner
