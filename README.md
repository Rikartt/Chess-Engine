
# Chess-Engine

## Chess Engine By Rikard

## Logic Data Structure
Piece.json



`{`
`"piece": "K" | "P" | "Q" | "R" | "B" | "N",`
`"move-type": "leaper" | "slider",`
`"capture-Type": "same" | "different",`
`"flipped-for-black": true | false,`
`"vectors": [ [x,y], ... ],`
`"special": {`
`    "starting-pos-move": [ [x,y], ... ],`
`    "castle-l": [ [x,y], ... ],`
`    "castle-r": [ [x,y], ... ],`
`    "en-passant": [ [x,y], ... ]`
`}`
`}`

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
        -   [X] Make the script read the logic from the logic folder.
            -   [X] Restructure async function calling and have everything inside a single init() function using await
            -   [X] Write the logic-reading function(s)
        -   [ ] Make the script use the logic to determine possible movable squares for the dragged piece and then draw half opaque circles on the possible squares.
            -   [X] Write a function that takes a piece's idx and returns possible moves/captures.
                -   [X] The function is written but doesn't fully work yet. Following are the things left to do until the parent point can be checked
                -   [X] The flipped for black attribute should be 'flipped for white'. Luckily you have the flippedcoefficient in the reading code so you just have to change the logic data.
                -   [X] Only list pieces that are the opposite color as captures. And make captures possible at all, for some reason it doesn't work yet. This prevents future friendly fire.
                -   [X] Capturing only works for leapers as of now. Make it work for sliders, and make sliders work at all because right now it doesn't.
                -   Fix issues:
                    -   [ ] When a capture is possible, the function seems to list ALL possible moves as captures even though there's just one
                    -   [ ] start using the global logic checker to change the global variables such as, castling possible and other special moves. Do this by adding isUnmoved variable to each piece object.
            -   [ ] Write a function that takes said moves and captures and draws previously mentioned half opaque circles over them
                -   [X] moves
                -   [ ] captures
        -   [ ] Make capturing possible
        -   [ ] Have the game determine when someone has won.
-   [ ] Create a basic chess engine now that you have made a functioning chess game.
    -   [ ] Make the computer be able to input
    -   [ ] Give it positive and negative feedback for behavior
    -   [ ] Train the chess engines against each other and crown the winner
