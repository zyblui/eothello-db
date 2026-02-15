let patterns = [];
for (let i = 0; i < 60; i++) {
    patterns.push({
        corner33: [],
        corner52: [],
        row1: [],
        row2: [],
        row3: [],
        row4: [],
        edgex: [],
        diagonal4: [],
        diagonal5: [],
        diagonal6: [],
        diagonal7: [],
        diagonal8: []
    });
}
let patternsGrand = [];
for (let i = 0; i < 96; i++) {
    patternsGrand.push({
        corner33: [],
        corner52: [],
        row1: [],
        row2: [],
        row3: [],
        row4: [],
        row5: [],
        diagonal4: [],
        diagonal5: [],
        diagonal6: [],
        diagonal7: [],
        diagonal8: [],
        diagonal9: [],
        diagonal10: []
    });
}
let playerColor = 1;
let board = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, -1, 1, 0, 0, 0],
    [0, 0, 0, 1, -1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
];
let boardGrand = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, -1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, -1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];
const DIRECTIONS = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
const LETTERS = ["a", "b", "c", "d", "e", "f", "g", "h"];
const LETTERS_GRAND = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
function validMovesArr() {
    let situations = [];
    for (let m = 0; m <= 7; m++) {
        for (let n = 0; n <= 7; n++) {
            let placeResult = placeDisc(board, m, n, playerColor);
            if (placeResult.isValid) {
                situations.push(LETTERS[n] + (m + 1));
            }
        }
    }
    return situations;
}
function validMovesArrGrand() {
    let situations = [];
    for (let m = 0; m <= 9; m++) {
        for (let n = 0; n <= 9; n++) {
            let placeResult = placeDisc(boardGrand, m, n, playerColor);
            if (placeResult.isValid) {
                situations.push(LETTERS_GRAND[n] + (m + 1));
            }
        }
    }
    return situations;
}
function directionalFlip(currentBoard, x, y, direction, color) {//return value: is a valid directional flip
    let flipCounter = 0;
    do {
        flipCounter++;
        if (!(x + direction[0] * flipCounter >= 0 && x + direction[0] * flipCounter <= 7 && y + direction[1] * flipCounter >= 0 && y + direction[1] *
            flipCounter <= 7) || !currentBoard[x + direction[0] * flipCounter][y + direction[1] * flipCounter]) return false;
    } while (currentBoard[x + direction[0] * flipCounter][y + direction[1] * flipCounter] == -color);
    flipCounter--;
    if (!flipCounter) return false;
    for (let i = 1; i <= flipCounter; i++) {
        currentBoard[x + direction[0] * i][y + direction[1] * i] = color;
    }
    return true;
}
function placeDisc(currentBoard, x, y, color) {
    if (currentBoard[x][y]) return { isValid: false };
    let tempBoard = JSON.parse(JSON.stringify(currentBoard));
    let isValidMove = false;
    for (let i of DIRECTIONS) {
        if (directionalFlip(tempBoard, x, y, i, color)) {
            isValidMove = true;
        }
    }
    if (isValidMove) {
        tempBoard[x][y] = color;
        return {
            isValid: true,
            board: tempBoard
        };
    }
    return { isValid: false };
}
function pd(coord) {
    let y = LETTERS.indexOf(coord[0]);
    let x = Number(coord[1]) - 1;
    let placeResult = placeDisc(board, x, y, playerColor);
    if (!placeResult.isValid) return;
    board = placeResult.board;
    playerColor = -playerColor;
    if (!validMovesArr().length) playerColor = -playerColor;
}
function pdGrand(coord) {
    let y = LETTERS_GRAND.indexOf(coord[0]);
    let x = Number(coord.slice(1, 3)) - 1;
    let placeResult = placeDisc(boardGrand, x, y, playerColor);
    if (!placeResult.isValid) return;
    boardGrand = placeResult.board;
    playerColor = -playerColor;
    if (!validMovesArrGrand().length) playerColor = -playerColor;
}
function discCount(currentBoard) {
    let discs = {
        black: 0,
        white: 0
    };
    for (let i of currentBoard.flat()) {
        if (i == 1) discs.black++;
        else if (i == -1) discs.white++;
    }
    return discs;
}
let learnedPositions = 0;
function learn() {
    learnedPositions = 0;
    for (let i of data) if (i.type == 1 || !i.type) {
        for (let j of i.moves) {
            pd(j);
        }
        let discs = discCount(board);
        let blackAdvantage = 0;
        if (discs.black != discs.white) {
            blackAdvantage = (64 - discs.black - discs.white + Math.abs(discs.black - discs.white)) * ((discs.black < discs.white) ? 1 : -1);
        }
        playerColor = 1;
        board = [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, -1, 1, 0, 0, 0],
            [0, 0, 0, 1, -1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0]
        ];
        for (let j = 0; j < i.moves.length; j++) {
            pd(i.moves[j]);
            multiSet(j, blackAdvantage, 1);
            multiSet(j, blackAdvantage, -1);
        }
        playerColor = 1;
        board = [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, -1, 1, 0, 0, 0],
            [0, 0, 0, 1, -1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0]
        ];
        learnedPositions++;
    }
}
function learnGrand() {
    learnedPositions = 0;
    for (let i of data) {
        for (let j of i.moves) {
            pdGrand(j);
        }
        let discs = discCount(boardGrand);
        let blackAdvantage = 0;
        if (discs.black != discs.white) {
            blackAdvantage = (100 - discs.black - discs.white + Math.abs(discs.black - discs.white)) * ((discs.black < discs.white) ? 1 : -1);
        }
        playerColor = 1;
        boardGrand = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, -1, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, -1, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];
        for (let j = 0; j < i.moves.length; j++) {
            pdGrand(i.moves[j]);
            multiSetGrand(j, blackAdvantage, 1);
            multiSetGrand(j, blackAdvantage, -1);
        }
        playerColor = 1;
        boardGrand = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, -1, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, -1, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];
        learnedPositions++;
    }
}
function multiSet(j, evaluation, multiplier) {
    setPatternEval(j, "corner33", Math.min(
        getPatternNo(board[0][0] * multiplier, board[0][1] * multiplier, board[0][2] * multiplier, board[1][0] * multiplier, board[1][1] * multiplier, board[1][2] * multiplier, board[2][0] * multiplier, board[2][1] * multiplier, board[2][2] * multiplier),
        getPatternNo(board[0][0] * multiplier, board[1][0] * multiplier, board[2][0] * multiplier, board[0][1] * multiplier, board[1][1] * multiplier, board[2][1] * multiplier, board[0][2] * multiplier, board[1][2] * multiplier, board[2][2] * multiplier)
    ), evaluation * multiplier);
    setPatternEval(j, "corner33", Math.min(
        getPatternNo(board[0][7] * multiplier, board[0][6] * multiplier, board[0][5] * multiplier, board[1][7] * multiplier, board[1][6] * multiplier, board[1][5] * multiplier, board[2][7] * multiplier, board[2][6] * multiplier, board[2][5] * multiplier),
        getPatternNo(board[0][7] * multiplier, board[1][7] * multiplier, board[2][7] * multiplier, board[0][6] * multiplier, board[1][6] * multiplier, board[2][6] * multiplier, board[0][5] * multiplier, board[1][5] * multiplier, board[2][5] * multiplier)
    ), evaluation * multiplier);
    setPatternEval(j, "corner33", Math.min(
        getPatternNo(board[7][0] * multiplier, board[7][1] * multiplier, board[7][2] * multiplier, board[6][0] * multiplier, board[6][1] * multiplier, board[6][2] * multiplier, board[5][0] * multiplier, board[5][1] * multiplier, board[5][2] * multiplier),
        getPatternNo(board[7][0] * multiplier, board[6][0] * multiplier, board[5][0] * multiplier, board[7][1] * multiplier, board[6][1] * multiplier, board[5][1] * multiplier, board[7][2] * multiplier, board[6][2] * multiplier, board[5][2] * multiplier)
    ), evaluation * multiplier);
    setPatternEval(j, "corner33", Math.min(
        getPatternNo(board[7][7] * multiplier, board[7][6] * multiplier, board[7][5] * multiplier, board[6][7] * multiplier, board[6][6] * multiplier, board[6][5] * multiplier, board[5][7] * multiplier, board[5][6] * multiplier, board[5][5] * multiplier),
        getPatternNo(board[7][7] * multiplier, board[6][7] * multiplier, board[5][7] * multiplier, board[7][6] * multiplier, board[6][6] * multiplier, board[5][6] * multiplier, board[7][5] * multiplier, board[6][5] * multiplier, board[5][5] * multiplier)
    ), evaluation * multiplier);
    setPatternEval(j, "corner52",
        getPatternNo(board[0][0] * multiplier, board[0][1] * multiplier, board[0][2] * multiplier, board[0][3] * multiplier, board[0][4] * multiplier, board[1][0] * multiplier, board[1][1] * multiplier, board[1][2] * multiplier, board[1][3] * multiplier, board[1][4] * multiplier)
        , evaluation * multiplier);
    setPatternEval(j, "corner52",
        getPatternNo(board[0][0] * multiplier, board[1][0] * multiplier, board[2][0] * multiplier, board[3][0] * multiplier, board[4][0] * multiplier, board[0][1] * multiplier, board[1][1] * multiplier, board[2][1] * multiplier, board[3][1] * multiplier, board[4][1] * multiplier)
        , evaluation * multiplier);
    setPatternEval(j, "corner52",
        getPatternNo(board[7][0] * multiplier, board[7][1] * multiplier, board[7][2] * multiplier, board[7][3] * multiplier, board[7][4] * multiplier, board[6][0] * multiplier, board[6][1] * multiplier, board[6][2] * multiplier, board[6][3] * multiplier, board[6][4] * multiplier)
        , evaluation * multiplier);
    setPatternEval(j, "corner52",
        getPatternNo(board[7][0] * multiplier, board[6][0] * multiplier, board[5][0] * multiplier, board[4][0] * multiplier, board[3][0] * multiplier, board[7][1] * multiplier, board[6][1] * multiplier, board[5][1] * multiplier, board[4][1] * multiplier, board[3][1] * multiplier)
        , evaluation * multiplier);
    setPatternEval(j, "corner52",
        getPatternNo(board[0][7] * multiplier, board[0][6] * multiplier, board[0][5] * multiplier, board[0][4] * multiplier, board[0][3] * multiplier, board[1][7] * multiplier, board[1][6] * multiplier, board[1][5] * multiplier, board[1][4] * multiplier, board[1][3] * multiplier)
        , evaluation * multiplier);
    setPatternEval(j, "corner52",
        getPatternNo(board[0][7] * multiplier, board[1][7] * multiplier, board[2][7] * multiplier, board[3][7] * multiplier, board[4][7] * multiplier, board[0][6] * multiplier, board[1][6] * multiplier, board[2][6] * multiplier, board[3][6] * multiplier, board[4][6] * multiplier)
        , evaluation * multiplier);
    setPatternEval(j, "corner52",
        getPatternNo(board[7][7] * multiplier, board[6][7] * multiplier, board[5][7] * multiplier, board[4][7] * multiplier, board[3][7] * multiplier, board[7][6] * multiplier, board[6][6] * multiplier, board[5][6] * multiplier, board[4][6] * multiplier, board[3][6] * multiplier)
        , evaluation * multiplier);
    setPatternEval(j, "corner52",
        getPatternNo(board[7][7] * multiplier, board[7][6] * multiplier, board[7][5] * multiplier, board[7][4] * multiplier, board[7][3] * multiplier, board[6][7] * multiplier, board[6][6] * multiplier, board[6][5] * multiplier, board[6][4] * multiplier, board[6][3] * multiplier)
        , evaluation * multiplier);
    setPatternEval(j, "row1", Math.min(
        getPatternNo(board[0][0] * multiplier, board[0][1] * multiplier, board[0][2] * multiplier, board[0][3] * multiplier, board[0][4] * multiplier, board[0][5] * multiplier, board[0][6] * multiplier, board[0][7] * multiplier),
        getPatternNo(board[0][7] * multiplier, board[0][6] * multiplier, board[0][5] * multiplier, board[0][4] * multiplier, board[0][3] * multiplier, board[0][2] * multiplier, board[0][1] * multiplier, board[0][0] * multiplier)
    ), evaluation * multiplier);
    setPatternEval(j, "row1", Math.min(
        getPatternNo(board[7][0] * multiplier, board[7][1] * multiplier, board[7][2] * multiplier, board[7][3] * multiplier, board[7][4] * multiplier, board[7][5] * multiplier, board[7][6] * multiplier, board[7][7] * multiplier),
        getPatternNo(board[7][7] * multiplier, board[7][6] * multiplier, board[7][5] * multiplier, board[7][4] * multiplier, board[7][3] * multiplier, board[7][2] * multiplier, board[7][1] * multiplier, board[7][0] * multiplier)
    ), evaluation * multiplier);
    setPatternEval(j, "row1", Math.min(
        getPatternNo(board[0][0] * multiplier, board[1][0] * multiplier, board[2][0] * multiplier, board[3][0] * multiplier, board[4][0] * multiplier, board[5][0] * multiplier, board[6][0] * multiplier, board[7][0] * multiplier),
        getPatternNo(board[7][0] * multiplier, board[6][0] * multiplier, board[5][0] * multiplier, board[4][0] * multiplier, board[3][0] * multiplier, board[2][0] * multiplier, board[1][0] * multiplier, board[0][0] * multiplier)
    ), evaluation * multiplier);
    setPatternEval(j, "row1", Math.min(
        getPatternNo(board[0][7] * multiplier, board[1][7] * multiplier, board[2][7] * multiplier, board[3][7] * multiplier, board[4][7] * multiplier, board[5][7] * multiplier, board[6][7] * multiplier, board[7][7] * multiplier),
        getPatternNo(board[7][7] * multiplier, board[6][7] * multiplier, board[5][7] * multiplier, board[4][7] * multiplier, board[3][7] * multiplier, board[2][7] * multiplier, board[1][7] * multiplier, board[0][7] * multiplier)
    ), evaluation * multiplier);
    setPatternEval(j, "row2", Math.min(
        getPatternNo(board[1][0] * multiplier, board[1][1] * multiplier, board[1][2] * multiplier, board[1][3] * multiplier, board[1][4] * multiplier, board[1][5] * multiplier, board[1][6] * multiplier, board[1][7] * multiplier),
        getPatternNo(board[1][7] * multiplier, board[1][6] * multiplier, board[1][5] * multiplier, board[1][4] * multiplier, board[1][3] * multiplier, board[1][2] * multiplier, board[1][1] * multiplier, board[1][0] * multiplier)
    ), evaluation * multiplier);
    setPatternEval(j, "row2", Math.min(
        getPatternNo(board[6][0] * multiplier, board[6][1] * multiplier, board[6][2] * multiplier, board[6][3] * multiplier, board[6][4] * multiplier, board[6][5] * multiplier, board[6][6] * multiplier, board[6][7] * multiplier),
        getPatternNo(board[6][7] * multiplier, board[6][6] * multiplier, board[6][5] * multiplier, board[6][4] * multiplier, board[6][3] * multiplier, board[6][2] * multiplier, board[6][1] * multiplier, board[6][0] * multiplier)
    ), evaluation * multiplier);
    setPatternEval(j, "row2", Math.min(
        getPatternNo(board[0][1] * multiplier, board[1][1] * multiplier, board[2][1] * multiplier, board[3][1] * multiplier, board[4][1] * multiplier, board[5][1] * multiplier, board[6][1] * multiplier, board[7][1] * multiplier),
        getPatternNo(board[7][1] * multiplier, board[6][1] * multiplier, board[5][1] * multiplier, board[4][1] * multiplier, board[3][1] * multiplier, board[2][1] * multiplier, board[1][1] * multiplier, board[0][1] * multiplier)
    ), evaluation * multiplier);
    setPatternEval(j, "row2", Math.min(
        getPatternNo(board[0][6] * multiplier, board[1][6] * multiplier, board[2][6] * multiplier, board[3][6] * multiplier, board[4][6] * multiplier, board[5][6] * multiplier, board[6][6] * multiplier, board[7][6] * multiplier),
        getPatternNo(board[7][6] * multiplier, board[6][6] * multiplier, board[5][6] * multiplier, board[4][6] * multiplier, board[3][6] * multiplier, board[2][6] * multiplier, board[1][6] * multiplier, board[0][6] * multiplier)
    ), evaluation * multiplier);
    setPatternEval(j, "row3", Math.min(
        getPatternNo(board[2][0] * multiplier, board[2][1] * multiplier, board[2][2] * multiplier, board[2][3] * multiplier, board[2][4] * multiplier, board[2][5] * multiplier, board[2][6] * multiplier, board[2][7] * multiplier),
        getPatternNo(board[2][7] * multiplier, board[2][6] * multiplier, board[2][5] * multiplier, board[2][4] * multiplier, board[2][3] * multiplier, board[2][2] * multiplier, board[2][1] * multiplier, board[2][0] * multiplier)
    ), evaluation * multiplier);
    setPatternEval(j, "row3", Math.min(
        getPatternNo(board[5][0] * multiplier, board[5][1] * multiplier, board[5][2] * multiplier, board[5][3] * multiplier, board[5][4] * multiplier, board[5][5] * multiplier, board[5][6] * multiplier, board[5][7] * multiplier),
        getPatternNo(board[5][7] * multiplier, board[5][6] * multiplier, board[5][5] * multiplier, board[5][4] * multiplier, board[5][3] * multiplier, board[5][2] * multiplier, board[5][1] * multiplier, board[5][0] * multiplier)
    ), evaluation * multiplier);
    setPatternEval(j, "row3", Math.min(
        getPatternNo(board[0][2] * multiplier, board[1][2] * multiplier, board[2][2] * multiplier, board[3][2] * multiplier, board[4][2] * multiplier, board[5][2] * multiplier, board[6][2] * multiplier, board[7][2] * multiplier),
        getPatternNo(board[7][2] * multiplier, board[6][2] * multiplier, board[5][2] * multiplier, board[4][2] * multiplier, board[3][2] * multiplier, board[2][2] * multiplier, board[1][2] * multiplier, board[0][2] * multiplier)
    ), evaluation * multiplier);
    setPatternEval(j, "row3", Math.min(
        getPatternNo(board[0][5] * multiplier, board[1][5] * multiplier, board[2][5] * multiplier, board[3][5] * multiplier, board[4][5] * multiplier, board[5][5] * multiplier, board[6][5] * multiplier, board[7][5] * multiplier),
        getPatternNo(board[7][5] * multiplier, board[6][5] * multiplier, board[5][5] * multiplier, board[4][5] * multiplier, board[3][5] * multiplier, board[2][5] * multiplier, board[1][5] * multiplier, board[0][5] * multiplier)
    ), evaluation * multiplier);
    setPatternEval(j, "row4", Math.min(
        getPatternNo(board[3][0] * multiplier, board[3][1] * multiplier, board[3][2] * multiplier, board[3][3] * multiplier, board[3][4] * multiplier, board[3][5] * multiplier, board[3][6] * multiplier, board[3][7] * multiplier),
        getPatternNo(board[3][7] * multiplier, board[3][6] * multiplier, board[3][5] * multiplier, board[3][4] * multiplier, board[3][3] * multiplier, board[3][2] * multiplier, board[3][1] * multiplier, board[3][0] * multiplier)
    ), evaluation * multiplier);
    setPatternEval(j, "row4", Math.min(
        getPatternNo(board[4][0] * multiplier, board[4][1] * multiplier, board[4][2] * multiplier, board[4][3] * multiplier, board[4][4] * multiplier, board[4][5] * multiplier, board[4][6] * multiplier, board[4][7] * multiplier),
        getPatternNo(board[4][7] * multiplier, board[4][6] * multiplier, board[4][5] * multiplier, board[4][4] * multiplier, board[4][3] * multiplier, board[4][2] * multiplier, board[4][1] * multiplier, board[4][0] * multiplier)
    ), evaluation * multiplier);
    setPatternEval(j, "row4", Math.min(
        getPatternNo(board[0][3] * multiplier, board[1][3] * multiplier, board[2][3] * multiplier, board[3][3] * multiplier, board[4][3] * multiplier, board[5][3] * multiplier, board[6][3] * multiplier, board[7][3] * multiplier),
        getPatternNo(board[7][3] * multiplier, board[6][3] * multiplier, board[5][3] * multiplier, board[4][3] * multiplier, board[3][3] * multiplier, board[2][3] * multiplier, board[1][3] * multiplier, board[0][3] * multiplier)
    ), evaluation * multiplier);
    setPatternEval(j, "row4", Math.min(
        getPatternNo(board[0][4] * multiplier, board[1][4] * multiplier, board[2][4] * multiplier, board[3][4] * multiplier, board[4][4] * multiplier, board[5][4] * multiplier, board[6][4] * multiplier, board[7][4] * multiplier),
        getPatternNo(board[7][4] * multiplier, board[6][4] * multiplier, board[5][4] * multiplier, board[4][4] * multiplier, board[3][4] * multiplier, board[2][4] * multiplier, board[1][4] * multiplier, board[0][4] * multiplier)
    ), evaluation * multiplier);
    setPatternEval(j, "edgex", Math.min(
        getPatternNo(board[0][0] * multiplier, board[0][1] * multiplier, board[0][2] * multiplier, board[0][3] * multiplier, board[0][4] * multiplier, board[0][5] * multiplier, board[0][6] * multiplier, board[0][7] * multiplier, board[1][1] * multiplier, board[1][6] * multiplier),
        getPatternNo(board[0][7] * multiplier, board[0][6] * multiplier, board[0][5] * multiplier, board[0][4] * multiplier, board[0][3] * multiplier, board[0][2] * multiplier, board[0][1] * multiplier, board[0][0] * multiplier, board[1][6] * multiplier, board[1][1] * multiplier)
    ), evaluation * multiplier);
    setPatternEval(j, "edgex", Math.min(
        getPatternNo(board[7][0] * multiplier, board[7][1] * multiplier, board[7][2] * multiplier, board[7][3] * multiplier, board[7][4] * multiplier, board[7][5] * multiplier, board[7][6] * multiplier, board[7][7] * multiplier, board[6][1] * multiplier, board[6][6] * multiplier),
        getPatternNo(board[7][7] * multiplier, board[7][6] * multiplier, board[7][5] * multiplier, board[7][4] * multiplier, board[7][3] * multiplier, board[7][2] * multiplier, board[7][1] * multiplier, board[7][0] * multiplier, board[6][6] * multiplier, board[6][1] * multiplier)
    ), evaluation * multiplier);
    setPatternEval(j, "edgex", Math.min(
        getPatternNo(board[0][0] * multiplier, board[1][0] * multiplier, board[2][0] * multiplier, board[3][0] * multiplier, board[4][0] * multiplier, board[5][0] * multiplier, board[6][0] * multiplier, board[7][0] * multiplier, board[1][1] * multiplier, board[6][1] * multiplier),
        getPatternNo(board[7][0] * multiplier, board[6][0] * multiplier, board[5][0] * multiplier, board[4][0] * multiplier, board[3][0] * multiplier, board[2][0] * multiplier, board[1][0] * multiplier, board[0][0] * multiplier, board[6][1] * multiplier, board[1][1] * multiplier)
    ), evaluation * multiplier);
    setPatternEval(j, "edgex", Math.min(
        getPatternNo(board[0][7] * multiplier, board[1][7] * multiplier, board[2][7] * multiplier, board[3][7] * multiplier, board[4][7] * multiplier, board[5][7] * multiplier, board[6][7] * multiplier, board[7][7] * multiplier, board[1][6] * multiplier, board[6][6] * multiplier),
        getPatternNo(board[7][7] * multiplier, board[6][7] * multiplier, board[5][7] * multiplier, board[4][7] * multiplier, board[3][7] * multiplier, board[2][7] * multiplier, board[1][7] * multiplier, board[0][7] * multiplier, board[6][6] * multiplier, board[1][6] * multiplier)
    ), evaluation * multiplier);
    setPatternEval(j, "diagonal4", Math.min(
        getPatternNo(board[0][3] * multiplier, board[1][2] * multiplier, board[2][1] * multiplier, board[3][0] * multiplier),
        getPatternNo(board[3][0] * multiplier, board[2][1] * multiplier, board[1][2] * multiplier, board[0][3] * multiplier)
    ), evaluation * multiplier);
    setPatternEval(j, "diagonal4", Math.min(
        getPatternNo(board[0][4] * multiplier, board[1][5] * multiplier, board[2][6] * multiplier, board[3][7] * multiplier),
        getPatternNo(board[3][7] * multiplier, board[2][6] * multiplier, board[1][5] * multiplier, board[0][4] * multiplier)
    ), evaluation * multiplier);
    setPatternEval(j, "diagonal4", Math.min(
        getPatternNo(board[4][0] * multiplier, board[5][1] * multiplier, board[6][2] * multiplier, board[7][3] * multiplier),
        getPatternNo(board[7][3] * multiplier, board[6][2] * multiplier, board[5][1] * multiplier, board[4][0] * multiplier)
    ), evaluation * multiplier);
    setPatternEval(j, "diagonal4", Math.min(
        getPatternNo(board[4][7] * multiplier, board[5][6] * multiplier, board[6][5] * multiplier, board[7][4] * multiplier),
        getPatternNo(board[7][4] * multiplier, board[6][5] * multiplier, board[5][6] * multiplier, board[4][7] * multiplier)
    ), evaluation * multiplier);
    setPatternEval(j, "diagonal5", Math.min(
        getPatternNo(board[0][4] * multiplier, board[1][3] * multiplier, board[2][2] * multiplier, board[3][1] * multiplier, board[4][0] * multiplier),
        getPatternNo(board[4][0] * multiplier, board[3][1] * multiplier, board[2][2] * multiplier, board[1][3] * multiplier, board[0][4] * multiplier)
    ), evaluation * multiplier);
    setPatternEval(j, "diagonal5", Math.min(
        getPatternNo(board[7][4] * multiplier, board[6][3] * multiplier, board[5][2] * multiplier, board[4][1] * multiplier, board[3][0] * multiplier),
        getPatternNo(board[3][0] * multiplier, board[4][1] * multiplier, board[5][2] * multiplier, board[6][3] * multiplier, board[7][4] * multiplier)
    ), evaluation * multiplier);
    setPatternEval(j, "diagonal5", Math.min(
        getPatternNo(board[0][3] * multiplier, board[1][4] * multiplier, board[2][5] * multiplier, board[3][6] * multiplier, board[4][7] * multiplier),
        getPatternNo(board[4][7] * multiplier, board[3][6] * multiplier, board[2][5] * multiplier, board[1][4] * multiplier, board[0][3] * multiplier)
    ), evaluation * multiplier);
    setPatternEval(j, "diagonal5", Math.min(
        getPatternNo(board[7][3] * multiplier, board[6][4] * multiplier, board[5][5] * multiplier, board[4][6] * multiplier, board[3][7] * multiplier),
        getPatternNo(board[3][7] * multiplier, board[4][6] * multiplier, board[5][5] * multiplier, board[6][4] * multiplier, board[7][3] * multiplier)
    ), evaluation * multiplier);
    setPatternEval(j, "diagonal6", Math.min(
        getPatternNo(board[0][5] * multiplier, board[1][4] * multiplier, board[2][3] * multiplier, board[3][2] * multiplier, board[4][1] * multiplier, board[5][0] * multiplier),
        getPatternNo(board[5][0] * multiplier, board[4][1] * multiplier, board[3][2] * multiplier, board[2][3] * multiplier, board[1][4] * multiplier, board[0][5] * multiplier)
    ), evaluation * multiplier);
    setPatternEval(j, "diagonal6", Math.min(
        getPatternNo(board[0][2] * multiplier, board[1][3] * multiplier, board[2][4] * multiplier, board[3][5] * multiplier, board[4][6] * multiplier, board[5][7] * multiplier),
        getPatternNo(board[5][7] * multiplier, board[4][6] * multiplier, board[3][5] * multiplier, board[2][4] * multiplier, board[1][3] * multiplier, board[0][2] * multiplier)
    ), evaluation * multiplier);
    setPatternEval(j, "diagonal6", Math.min(
        getPatternNo(board[7][5] * multiplier, board[6][4] * multiplier, board[5][3] * multiplier, board[4][2] * multiplier, board[3][1] * multiplier, board[2][0] * multiplier),
        getPatternNo(board[2][0] * multiplier, board[3][1] * multiplier, board[4][2] * multiplier, board[5][3] * multiplier, board[6][4] * multiplier, board[7][5] * multiplier)
    ), evaluation * multiplier);
    setPatternEval(j, "diagonal6", Math.min(
        getPatternNo(board[7][2] * multiplier, board[6][3] * multiplier, board[5][4] * multiplier, board[4][5] * multiplier, board[3][6] * multiplier, board[2][7] * multiplier),
        getPatternNo(board[2][7] * multiplier, board[3][6] * multiplier, board[4][5] * multiplier, board[5][4] * multiplier, board[6][3] * multiplier, board[7][2] * multiplier)
    ), evaluation * multiplier);
    setPatternEval(j, "diagonal7", Math.min(
        getPatternNo(board[0][6] * multiplier, board[1][5] * multiplier, board[2][4] * multiplier, board[3][3] * multiplier, board[4][2] * multiplier, board[5][1] * multiplier, board[6][0] * multiplier),
        getPatternNo(board[6][0] * multiplier, board[5][1] * multiplier, board[4][2] * multiplier, board[3][3] * multiplier, board[2][4] * multiplier, board[1][5] * multiplier, board[0][6] * multiplier)
    ), evaluation * multiplier);
    setPatternEval(j, "diagonal7", Math.min(
        getPatternNo(board[0][1] * multiplier, board[1][2] * multiplier, board[2][3] * multiplier, board[3][4] * multiplier, board[4][5] * multiplier, board[5][6] * multiplier, board[6][7] * multiplier),
        getPatternNo(board[6][7] * multiplier, board[5][6] * multiplier, board[4][5] * multiplier, board[3][4] * multiplier, board[2][3] * multiplier, board[1][2] * multiplier, board[0][1] * multiplier)
    ), evaluation * multiplier);
    setPatternEval(j, "diagonal7", Math.min(
        getPatternNo(board[7][6] * multiplier, board[6][5] * multiplier, board[5][4] * multiplier, board[4][3] * multiplier, board[3][2] * multiplier, board[2][1] * multiplier, board[1][0] * multiplier),
        getPatternNo(board[1][0] * multiplier, board[2][1] * multiplier, board[3][2] * multiplier, board[4][3] * multiplier, board[5][4] * multiplier, board[6][5] * multiplier, board[7][6] * multiplier)
    ), evaluation * multiplier);
    setPatternEval(j, "diagonal7", Math.min(
        getPatternNo(board[7][1] * multiplier, board[6][2] * multiplier, board[5][3] * multiplier, board[4][4] * multiplier, board[3][5] * multiplier, board[2][6] * multiplier, board[1][7] * multiplier),
        getPatternNo(board[1][7] * multiplier, board[2][6] * multiplier, board[3][5] * multiplier, board[4][4] * multiplier, board[5][3] * multiplier, board[6][2] * multiplier, board[7][1] * multiplier)
    ), evaluation * multiplier);
    setPatternEval(j, "diagonal8", Math.min(
        getPatternNo(board[0][0] * multiplier, board[1][1] * multiplier, board[2][2] * multiplier, board[3][3] * multiplier, board[4][4] * multiplier, board[5][5] * multiplier, board[6][6] * multiplier, board[7][7] * multiplier),
        getPatternNo(board[7][7] * multiplier, board[6][6] * multiplier, board[5][5] * multiplier, board[4][4] * multiplier, board[3][3] * multiplier, board[2][2] * multiplier, board[1][1] * multiplier, board[0][0] * multiplier)
    ), evaluation * multiplier);
    setPatternEval(j, "diagonal8", Math.min(
        getPatternNo(board[0][7] * multiplier, board[1][6] * multiplier, board[2][5] * multiplier, board[3][4] * multiplier, board[4][3] * multiplier, board[5][2] * multiplier, board[6][1] * multiplier, board[7][0] * multiplier),
        getPatternNo(board[7][0] * multiplier, board[6][1] * multiplier, board[5][2] * multiplier, board[4][3] * multiplier, board[3][4] * multiplier, board[2][5] * multiplier, board[1][6] * multiplier, board[0][7] * multiplier)
    ), evaluation * multiplier);
}
function multiSetGrand(j, evaluation, multiplier) {
    setPatternEvalGrand(j, "corner33", Math.min(
        getPatternNo(boardGrand[0][0] * multiplier, boardGrand[0][1] * multiplier, boardGrand[0][2] * multiplier, boardGrand[1][0] * multiplier, boardGrand[1][1] * multiplier, boardGrand[1][2] * multiplier, boardGrand[2][0] * multiplier, boardGrand[2][1] * multiplier, boardGrand[2][2] * multiplier),
        getPatternNo(boardGrand[0][0] * multiplier, boardGrand[1][0] * multiplier, boardGrand[2][0] * multiplier, boardGrand[0][1] * multiplier, boardGrand[1][1] * multiplier, boardGrand[2][1] * multiplier, boardGrand[0][2] * multiplier, boardGrand[1][2] * multiplier, boardGrand[2][2] * multiplier)
    ), evaluation * multiplier);
    setPatternEvalGrand(j, "corner33", Math.min(
        getPatternNo(boardGrand[0][9] * multiplier, boardGrand[0][8] * multiplier, boardGrand[0][7] * multiplier, boardGrand[1][9] * multiplier, boardGrand[1][8] * multiplier, boardGrand[1][7] * multiplier, boardGrand[2][9] * multiplier, boardGrand[2][8] * multiplier, boardGrand[2][7] * multiplier),
        getPatternNo(boardGrand[0][9] * multiplier, boardGrand[1][9] * multiplier, boardGrand[2][9] * multiplier, boardGrand[0][8] * multiplier, boardGrand[1][8] * multiplier, boardGrand[2][8] * multiplier, boardGrand[0][7] * multiplier, boardGrand[1][7] * multiplier, boardGrand[2][7] * multiplier)
    ), evaluation * multiplier);
    setPatternEvalGrand(j, "corner33", Math.min(
        getPatternNo(boardGrand[9][0] * multiplier, boardGrand[9][1] * multiplier, boardGrand[9][2] * multiplier, boardGrand[8][0] * multiplier, boardGrand[8][1] * multiplier, boardGrand[8][2] * multiplier, boardGrand[7][0] * multiplier, boardGrand[7][1] * multiplier, boardGrand[7][2] * multiplier),
        getPatternNo(boardGrand[9][0] * multiplier, boardGrand[8][0] * multiplier, boardGrand[7][0] * multiplier, boardGrand[9][1] * multiplier, boardGrand[8][1] * multiplier, boardGrand[7][1] * multiplier, boardGrand[9][2] * multiplier, boardGrand[8][2] * multiplier, boardGrand[7][2] * multiplier)
    ), evaluation * multiplier);
    setPatternEvalGrand(j, "corner33", Math.min(
        getPatternNo(boardGrand[9][9] * multiplier, boardGrand[9][8] * multiplier, boardGrand[9][7] * multiplier, boardGrand[8][9] * multiplier, boardGrand[8][8] * multiplier, boardGrand[8][7] * multiplier, boardGrand[7][9] * multiplier, boardGrand[7][8] * multiplier, boardGrand[7][7] * multiplier),
        getPatternNo(boardGrand[9][9] * multiplier, boardGrand[8][9] * multiplier, boardGrand[7][9] * multiplier, boardGrand[9][8] * multiplier, boardGrand[8][8] * multiplier, boardGrand[7][8] * multiplier, boardGrand[9][7] * multiplier, boardGrand[8][7] * multiplier, boardGrand[7][7] * multiplier)
    ), evaluation * multiplier);
    setPatternEvalGrand(j, "corner52",
        getPatternNo(boardGrand[0][0] * multiplier, boardGrand[0][1] * multiplier, boardGrand[0][2] * multiplier, boardGrand[0][3] * multiplier, boardGrand[0][4] * multiplier, boardGrand[1][0] * multiplier, boardGrand[1][1] * multiplier, boardGrand[1][2] * multiplier, boardGrand[1][3] * multiplier, boardGrand[1][4] * multiplier)
        , evaluation * multiplier);
    setPatternEvalGrand(j, "corner52",
        getPatternNo(boardGrand[0][0] * multiplier, boardGrand[1][0] * multiplier, boardGrand[2][0] * multiplier, boardGrand[3][0] * multiplier, boardGrand[4][0] * multiplier, boardGrand[0][1] * multiplier, boardGrand[1][1] * multiplier, boardGrand[2][1] * multiplier, boardGrand[3][1] * multiplier, boardGrand[4][1] * multiplier)
        , evaluation * multiplier);
    setPatternEvalGrand(j, "corner52",
        getPatternNo(boardGrand[9][0] * multiplier, boardGrand[9][1] * multiplier, boardGrand[9][2] * multiplier, boardGrand[9][3] * multiplier, boardGrand[9][4] * multiplier, boardGrand[8][0] * multiplier, boardGrand[8][1] * multiplier, boardGrand[8][2] * multiplier, boardGrand[8][3] * multiplier, boardGrand[8][4] * multiplier)
        , evaluation * multiplier);
    setPatternEvalGrand(j, "corner52",
        getPatternNo(boardGrand[9][0] * multiplier, boardGrand[8][0] * multiplier, boardGrand[7][0] * multiplier, boardGrand[6][0] * multiplier, boardGrand[5][0] * multiplier, boardGrand[9][1] * multiplier, boardGrand[8][1] * multiplier, boardGrand[7][1] * multiplier, boardGrand[6][1] * multiplier, boardGrand[5][1] * multiplier)
        , evaluation * multiplier);
    setPatternEvalGrand(j, "corner52",
        getPatternNo(boardGrand[0][9] * multiplier, boardGrand[0][8] * multiplier, boardGrand[0][7] * multiplier, boardGrand[0][6] * multiplier, boardGrand[0][5] * multiplier, boardGrand[1][9] * multiplier, boardGrand[1][8] * multiplier, boardGrand[1][7] * multiplier, boardGrand[1][6] * multiplier, boardGrand[1][5] * multiplier)
        , evaluation * multiplier);
    setPatternEvalGrand(j, "corner52",
        getPatternNo(boardGrand[0][9] * multiplier, boardGrand[1][9] * multiplier, boardGrand[2][9] * multiplier, boardGrand[3][9] * multiplier, boardGrand[4][9] * multiplier, boardGrand[0][8] * multiplier, boardGrand[1][8] * multiplier, boardGrand[2][8] * multiplier, boardGrand[3][8] * multiplier, boardGrand[4][8] * multiplier)
        , evaluation * multiplier);
    setPatternEvalGrand(j, "corner52",
        getPatternNo(boardGrand[9][9] * multiplier, boardGrand[8][9] * multiplier, boardGrand[7][9] * multiplier, boardGrand[6][9] * multiplier, boardGrand[5][9] * multiplier, boardGrand[9][8] * multiplier, boardGrand[8][8] * multiplier, boardGrand[7][8] * multiplier, boardGrand[6][8] * multiplier, boardGrand[5][8] * multiplier)
        , evaluation * multiplier);
    setPatternEvalGrand(j, "corner52",
        getPatternNo(boardGrand[9][9] * multiplier, boardGrand[9][8] * multiplier, boardGrand[9][7] * multiplier, boardGrand[9][6] * multiplier, boardGrand[9][5] * multiplier, boardGrand[8][9] * multiplier, boardGrand[8][8] * multiplier, boardGrand[8][7] * multiplier, boardGrand[8][6] * multiplier, boardGrand[8][5] * multiplier)
        , evaluation * multiplier);
    setPatternEvalGrand(j, "row1", Math.min(
        getPatternNo(boardGrand[0][0] * multiplier, boardGrand[0][1] * multiplier, boardGrand[0][2] * multiplier, boardGrand[0][3] * multiplier, boardGrand[0][4] * multiplier, boardGrand[0][5] * multiplier, boardGrand[0][6] * multiplier, boardGrand[0][7] * multiplier, boardGrand[0][8] * multiplier, boardGrand[0][9] * multiplier),
        getPatternNo(boardGrand[0][9] * multiplier, boardGrand[0][8] * multiplier, boardGrand[0][7] * multiplier, boardGrand[0][6] * multiplier, boardGrand[0][5] * multiplier, boardGrand[0][4] * multiplier, boardGrand[0][3] * multiplier, boardGrand[0][2] * multiplier, boardGrand[0][1] * multiplier, boardGrand[0][0] * multiplier)
    ), evaluation * multiplier);
    setPatternEvalGrand(j, "row1", Math.min(
        getPatternNo(boardGrand[9][0] * multiplier, boardGrand[9][1] * multiplier, boardGrand[9][2] * multiplier, boardGrand[9][3] * multiplier, boardGrand[9][4] * multiplier, boardGrand[9][5] * multiplier, boardGrand[9][6] * multiplier, boardGrand[9][7] * multiplier, boardGrand[9][8] * multiplier, boardGrand[9][9] * multiplier),
        getPatternNo(boardGrand[9][9] * multiplier, boardGrand[9][8] * multiplier, boardGrand[9][7] * multiplier, boardGrand[9][6] * multiplier, boardGrand[9][5] * multiplier, boardGrand[9][4] * multiplier, boardGrand[9][3] * multiplier, boardGrand[9][2] * multiplier, boardGrand[9][1] * multiplier, boardGrand[9][0] * multiplier)
    ), evaluation * multiplier);
    setPatternEvalGrand(j, "row1", Math.min(
        getPatternNo(boardGrand[0][0] * multiplier, boardGrand[1][0] * multiplier, boardGrand[2][0] * multiplier, boardGrand[3][0] * multiplier, boardGrand[4][0] * multiplier, boardGrand[5][0] * multiplier, boardGrand[6][0] * multiplier, boardGrand[7][0] * multiplier, boardGrand[8][0] * multiplier, boardGrand[9][0] * multiplier),
        getPatternNo(boardGrand[9][0] * multiplier, boardGrand[8][0] * multiplier, boardGrand[7][0] * multiplier, boardGrand[6][0] * multiplier, boardGrand[5][0] * multiplier, boardGrand[4][0] * multiplier, boardGrand[3][0] * multiplier, boardGrand[2][0] * multiplier, boardGrand[1][0] * multiplier, boardGrand[0][0] * multiplier)
    ), evaluation * multiplier);
    setPatternEvalGrand(j, "row1", Math.min(
        getPatternNo(boardGrand[0][9] * multiplier, boardGrand[1][9] * multiplier, boardGrand[2][9] * multiplier, boardGrand[3][9] * multiplier, boardGrand[4][9] * multiplier, boardGrand[5][9] * multiplier, boardGrand[6][9] * multiplier, boardGrand[7][9] * multiplier, boardGrand[8][9] * multiplier, boardGrand[9][9] * multiplier),
        getPatternNo(boardGrand[9][9] * multiplier, boardGrand[8][9] * multiplier, boardGrand[7][9] * multiplier, boardGrand[6][9] * multiplier, boardGrand[5][9] * multiplier, boardGrand[4][9] * multiplier, boardGrand[3][9] * multiplier, boardGrand[2][9] * multiplier, boardGrand[1][9] * multiplier, boardGrand[0][9] * multiplier)
    ), evaluation * multiplier);
    setPatternEvalGrand(j, "row2", Math.min(
        getPatternNo(boardGrand[1][0] * multiplier, boardGrand[1][1] * multiplier, boardGrand[1][2] * multiplier, boardGrand[1][3] * multiplier, boardGrand[1][4] * multiplier, boardGrand[1][5] * multiplier, boardGrand[1][6] * multiplier, boardGrand[1][7] * multiplier, boardGrand[1][8] * multiplier, boardGrand[1][9] * multiplier),
        getPatternNo(boardGrand[1][9] * multiplier, boardGrand[1][8] * multiplier, boardGrand[1][7] * multiplier, boardGrand[1][6] * multiplier, boardGrand[1][5] * multiplier, boardGrand[1][4] * multiplier, boardGrand[1][3] * multiplier, boardGrand[1][2] * multiplier, boardGrand[1][1] * multiplier, boardGrand[1][0] * multiplier)
    ), evaluation * multiplier);
    setPatternEvalGrand(j, "row2", Math.min(
        getPatternNo(boardGrand[8][0] * multiplier, boardGrand[8][1] * multiplier, boardGrand[8][2] * multiplier, boardGrand[8][3] * multiplier, boardGrand[8][4] * multiplier, boardGrand[8][5] * multiplier, boardGrand[8][6] * multiplier, boardGrand[8][7] * multiplier, boardGrand[8][8] * multiplier, boardGrand[8][9] * multiplier),
        getPatternNo(boardGrand[8][9] * multiplier, boardGrand[8][8] * multiplier, boardGrand[8][7] * multiplier, boardGrand[8][6] * multiplier, boardGrand[8][5] * multiplier, boardGrand[8][4] * multiplier, boardGrand[8][3] * multiplier, boardGrand[8][2] * multiplier, boardGrand[8][1] * multiplier, boardGrand[8][0] * multiplier)
    ), evaluation * multiplier);
    setPatternEvalGrand(j, "row2", Math.min(
        getPatternNo(boardGrand[0][1] * multiplier, boardGrand[1][1] * multiplier, boardGrand[2][1] * multiplier, boardGrand[3][1] * multiplier, boardGrand[4][1] * multiplier, boardGrand[5][1] * multiplier, boardGrand[6][1] * multiplier, boardGrand[7][1] * multiplier, boardGrand[8][1] * multiplier, boardGrand[9][1] * multiplier),
        getPatternNo(boardGrand[9][1] * multiplier, boardGrand[8][1] * multiplier, boardGrand[7][1] * multiplier, boardGrand[6][1] * multiplier, boardGrand[5][1] * multiplier, boardGrand[4][1] * multiplier, boardGrand[3][1] * multiplier, boardGrand[2][1] * multiplier, boardGrand[1][1] * multiplier, boardGrand[0][1] * multiplier)
    ), evaluation * multiplier);
    setPatternEvalGrand(j, "row2", Math.min(
        getPatternNo(boardGrand[0][8] * multiplier, boardGrand[1][8] * multiplier, boardGrand[2][8] * multiplier, boardGrand[3][8] * multiplier, boardGrand[4][8] * multiplier, boardGrand[5][8] * multiplier, boardGrand[6][8] * multiplier, boardGrand[7][8] * multiplier, boardGrand[8][8] * multiplier, boardGrand[9][8] * multiplier),
        getPatternNo(boardGrand[9][8] * multiplier, boardGrand[8][8] * multiplier, boardGrand[7][8] * multiplier, boardGrand[6][8] * multiplier, boardGrand[5][8] * multiplier, boardGrand[4][8] * multiplier, boardGrand[3][8] * multiplier, boardGrand[2][8] * multiplier, boardGrand[1][8] * multiplier, boardGrand[0][8] * multiplier)
    ), evaluation * multiplier);
    setPatternEvalGrand(j, "row3", Math.min(
        getPatternNo(boardGrand[2][0] * multiplier, boardGrand[2][1] * multiplier, boardGrand[2][2] * multiplier, boardGrand[2][3] * multiplier, boardGrand[2][4] * multiplier, boardGrand[2][5] * multiplier, boardGrand[2][6] * multiplier, boardGrand[2][7] * multiplier, boardGrand[2][8] * multiplier, boardGrand[2][9] * multiplier),
        getPatternNo(boardGrand[2][9] * multiplier, boardGrand[2][8] * multiplier, boardGrand[2][7] * multiplier, boardGrand[2][6] * multiplier, boardGrand[2][5] * multiplier, boardGrand[2][4] * multiplier, boardGrand[2][3] * multiplier, boardGrand[2][2] * multiplier, boardGrand[2][1] * multiplier, boardGrand[2][0] * multiplier)
    ), evaluation * multiplier);
    setPatternEvalGrand(j, "row3", Math.min(
        getPatternNo(boardGrand[7][0] * multiplier, boardGrand[7][1] * multiplier, boardGrand[7][2] * multiplier, boardGrand[7][3] * multiplier, boardGrand[7][4] * multiplier, boardGrand[7][5] * multiplier, boardGrand[7][6] * multiplier, boardGrand[7][7] * multiplier, boardGrand[7][8] * multiplier, boardGrand[7][9] * multiplier),
        getPatternNo(boardGrand[7][9] * multiplier, boardGrand[7][8] * multiplier, boardGrand[7][7] * multiplier, boardGrand[7][6] * multiplier, boardGrand[7][5] * multiplier, boardGrand[7][4] * multiplier, boardGrand[7][3] * multiplier, boardGrand[7][2] * multiplier, boardGrand[7][1] * multiplier, boardGrand[7][0] * multiplier)
    ), evaluation * multiplier);
    setPatternEvalGrand(j, "row3", Math.min(
        getPatternNo(boardGrand[0][2] * multiplier, boardGrand[1][2] * multiplier, boardGrand[2][2] * multiplier, boardGrand[3][2] * multiplier, boardGrand[4][2] * multiplier, boardGrand[5][2] * multiplier, boardGrand[6][2] * multiplier, boardGrand[7][2] * multiplier, boardGrand[8][2] * multiplier, boardGrand[9][2] * multiplier),
        getPatternNo(boardGrand[9][2] * multiplier, boardGrand[8][2] * multiplier, boardGrand[7][2] * multiplier, boardGrand[6][2] * multiplier, boardGrand[5][2] * multiplier, boardGrand[4][2] * multiplier, boardGrand[3][2] * multiplier, boardGrand[2][2] * multiplier, boardGrand[1][2] * multiplier, boardGrand[0][2] * multiplier)
    ), evaluation * multiplier);
    setPatternEvalGrand(j, "row3", Math.min(
        getPatternNo(boardGrand[0][7] * multiplier, boardGrand[1][7] * multiplier, boardGrand[2][7] * multiplier, boardGrand[3][7] * multiplier, boardGrand[4][7] * multiplier, boardGrand[5][7] * multiplier, boardGrand[6][7] * multiplier, boardGrand[7][7] * multiplier, boardGrand[8][7] * multiplier, boardGrand[9][7] * multiplier),
        getPatternNo(boardGrand[9][7] * multiplier, boardGrand[8][7] * multiplier, boardGrand[7][7] * multiplier, boardGrand[6][7] * multiplier, boardGrand[5][7] * multiplier, boardGrand[4][7] * multiplier, boardGrand[3][7] * multiplier, boardGrand[2][7] * multiplier, boardGrand[1][7] * multiplier, boardGrand[0][7] * multiplier)
    ), evaluation * multiplier);
    setPatternEvalGrand(j, "row4", Math.min(
        getPatternNo(boardGrand[3][0] * multiplier, boardGrand[3][1] * multiplier, boardGrand[3][2] * multiplier, boardGrand[3][3] * multiplier, boardGrand[3][4] * multiplier, boardGrand[3][5] * multiplier, boardGrand[3][6] * multiplier, boardGrand[3][7] * multiplier, boardGrand[3][8] * multiplier, boardGrand[3][9] * multiplier),
        getPatternNo(boardGrand[3][9] * multiplier, boardGrand[3][8] * multiplier, boardGrand[3][7] * multiplier, boardGrand[3][6] * multiplier, boardGrand[3][5] * multiplier, boardGrand[3][4] * multiplier, boardGrand[3][3] * multiplier, boardGrand[3][2] * multiplier, boardGrand[3][1] * multiplier, boardGrand[3][0] * multiplier)
    ), evaluation * multiplier);
    setPatternEvalGrand(j, "row4", Math.min(
        getPatternNo(boardGrand[6][0] * multiplier, boardGrand[6][1] * multiplier, boardGrand[6][2] * multiplier, boardGrand[6][3] * multiplier, boardGrand[6][4] * multiplier, boardGrand[6][5] * multiplier, boardGrand[6][6] * multiplier, boardGrand[6][7] * multiplier, boardGrand[6][8] * multiplier, boardGrand[6][9] * multiplier),
        getPatternNo(boardGrand[6][9] * multiplier, boardGrand[6][8] * multiplier, boardGrand[6][7] * multiplier, boardGrand[6][6] * multiplier, boardGrand[6][5] * multiplier, boardGrand[6][4] * multiplier, boardGrand[6][3] * multiplier, boardGrand[6][2] * multiplier, boardGrand[6][1] * multiplier, boardGrand[6][0] * multiplier)
    ), evaluation * multiplier);
    setPatternEvalGrand(j, "row4", Math.min(
        getPatternNo(boardGrand[0][3] * multiplier, boardGrand[1][3] * multiplier, boardGrand[2][3] * multiplier, boardGrand[3][3] * multiplier, boardGrand[4][3] * multiplier, boardGrand[5][3] * multiplier, boardGrand[6][3] * multiplier, boardGrand[7][3] * multiplier, boardGrand[8][3] * multiplier, boardGrand[9][3] * multiplier),
        getPatternNo(boardGrand[9][3] * multiplier, boardGrand[8][3] * multiplier, boardGrand[7][3] * multiplier, boardGrand[6][3] * multiplier, boardGrand[5][3] * multiplier, boardGrand[4][3] * multiplier, boardGrand[3][3] * multiplier, boardGrand[2][3] * multiplier, boardGrand[1][3] * multiplier, boardGrand[0][3] * multiplier)
    ), evaluation * multiplier);
    setPatternEvalGrand(j, "row4", Math.min(
        getPatternNo(boardGrand[0][6] * multiplier, boardGrand[1][6] * multiplier, boardGrand[2][6] * multiplier, boardGrand[3][6] * multiplier, boardGrand[4][6] * multiplier, boardGrand[5][6] * multiplier, boardGrand[6][6] * multiplier, boardGrand[7][6] * multiplier, boardGrand[8][6] * multiplier, boardGrand[9][6] * multiplier),
        getPatternNo(boardGrand[9][6] * multiplier, boardGrand[8][6] * multiplier, boardGrand[7][6] * multiplier, boardGrand[6][6] * multiplier, boardGrand[5][6] * multiplier, boardGrand[4][6] * multiplier, boardGrand[3][6] * multiplier, boardGrand[2][6] * multiplier, boardGrand[1][6] * multiplier, boardGrand[0][6] * multiplier)
    ), evaluation * multiplier);
    setPatternEvalGrand(j, "row5", Math.min(
        getPatternNo(boardGrand[4][0] * multiplier, boardGrand[4][1] * multiplier, boardGrand[4][2] * multiplier, boardGrand[4][3] * multiplier, boardGrand[4][4] * multiplier, boardGrand[4][5] * multiplier, boardGrand[4][6] * multiplier, boardGrand[4][7] * multiplier, boardGrand[4][8] * multiplier, boardGrand[4][9] * multiplier),
        getPatternNo(boardGrand[4][9] * multiplier, boardGrand[4][8] * multiplier, boardGrand[4][7] * multiplier, boardGrand[4][6] * multiplier, boardGrand[4][5] * multiplier, boardGrand[4][4] * multiplier, boardGrand[4][3] * multiplier, boardGrand[4][2] * multiplier, boardGrand[4][1] * multiplier, boardGrand[4][0] * multiplier)
    ), evaluation * multiplier);
    setPatternEvalGrand(j, "row5", Math.min(
        getPatternNo(boardGrand[5][0] * multiplier, boardGrand[5][1] * multiplier, boardGrand[5][2] * multiplier, boardGrand[5][3] * multiplier, boardGrand[5][4] * multiplier, boardGrand[5][5] * multiplier, boardGrand[5][6] * multiplier, boardGrand[5][7] * multiplier, boardGrand[5][8] * multiplier, boardGrand[5][9] * multiplier),
        getPatternNo(boardGrand[5][9] * multiplier, boardGrand[5][8] * multiplier, boardGrand[5][7] * multiplier, boardGrand[5][6] * multiplier, boardGrand[5][5] * multiplier, boardGrand[5][4] * multiplier, boardGrand[5][3] * multiplier, boardGrand[5][2] * multiplier, boardGrand[5][1] * multiplier, boardGrand[5][0] * multiplier)
    ), evaluation * multiplier);
    setPatternEvalGrand(j, "row5", Math.min(
        getPatternNo(boardGrand[0][4] * multiplier, boardGrand[1][4] * multiplier, boardGrand[2][4] * multiplier, boardGrand[3][4] * multiplier, boardGrand[4][4] * multiplier, boardGrand[5][4] * multiplier, boardGrand[6][4] * multiplier, boardGrand[7][4] * multiplier, boardGrand[8][4] * multiplier, boardGrand[9][4] * multiplier),
        getPatternNo(boardGrand[9][4] * multiplier, boardGrand[8][4] * multiplier, boardGrand[7][4] * multiplier, boardGrand[6][4] * multiplier, boardGrand[5][4] * multiplier, boardGrand[4][4] * multiplier, boardGrand[3][4] * multiplier, boardGrand[2][4] * multiplier, boardGrand[1][4] * multiplier, boardGrand[0][4] * multiplier)
    ), evaluation * multiplier);
    setPatternEvalGrand(j, "row5", Math.min(
        getPatternNo(boardGrand[0][5] * multiplier, boardGrand[1][5] * multiplier, boardGrand[2][5] * multiplier, boardGrand[3][5] * multiplier, boardGrand[4][5] * multiplier, boardGrand[5][5] * multiplier, boardGrand[6][5] * multiplier, boardGrand[7][5] * multiplier, boardGrand[8][5] * multiplier, boardGrand[9][5] * multiplier),
        getPatternNo(boardGrand[9][5] * multiplier, boardGrand[8][5] * multiplier, boardGrand[7][5] * multiplier, boardGrand[6][5] * multiplier, boardGrand[5][5] * multiplier, boardGrand[4][5] * multiplier, boardGrand[3][5] * multiplier, boardGrand[2][5] * multiplier, boardGrand[1][5] * multiplier, boardGrand[0][5] * multiplier)
    ), evaluation * multiplier);
    setPatternEvalGrand(j, "diagonal4", Math.min(
        getPatternNo(boardGrand[0][3] * multiplier, boardGrand[1][2] * multiplier, boardGrand[2][1] * multiplier, boardGrand[3][0] * multiplier),
        getPatternNo(boardGrand[3][0] * multiplier, boardGrand[2][1] * multiplier, boardGrand[1][2] * multiplier, boardGrand[0][3] * multiplier)
    ), evaluation * multiplier);
    setPatternEvalGrand(j, "diagonal4", Math.min(
        getPatternNo(boardGrand[0][6] * multiplier, boardGrand[1][7] * multiplier, boardGrand[2][8] * multiplier, boardGrand[3][9] * multiplier),
        getPatternNo(boardGrand[3][9] * multiplier, boardGrand[2][8] * multiplier, boardGrand[1][7] * multiplier, boardGrand[0][6] * multiplier)
    ), evaluation * multiplier);
    setPatternEvalGrand(j, "diagonal4", Math.min(
        getPatternNo(boardGrand[6][0] * multiplier, boardGrand[7][1] * multiplier, boardGrand[8][2] * multiplier, boardGrand[9][3] * multiplier),
        getPatternNo(boardGrand[9][3] * multiplier, boardGrand[8][2] * multiplier, boardGrand[7][1] * multiplier, boardGrand[6][0] * multiplier)
    ), evaluation * multiplier);
    setPatternEvalGrand(j, "diagonal4", Math.min(
        getPatternNo(boardGrand[6][9] * multiplier, boardGrand[7][8] * multiplier, boardGrand[8][7] * multiplier, boardGrand[9][6] * multiplier),
        getPatternNo(boardGrand[9][6] * multiplier, boardGrand[8][7] * multiplier, boardGrand[7][8] * multiplier, boardGrand[6][9] * multiplier)
    ), evaluation * multiplier);
    setPatternEvalGrand(j, "diagonal5", Math.min(
        getPatternNo(boardGrand[0][4] * multiplier, boardGrand[1][3] * multiplier, boardGrand[2][2] * multiplier, boardGrand[3][1] * multiplier, boardGrand[4][0] * multiplier),
        getPatternNo(boardGrand[4][0] * multiplier, boardGrand[3][1] * multiplier, boardGrand[2][2] * multiplier, boardGrand[1][3] * multiplier, boardGrand[0][4] * multiplier)
    ), evaluation * multiplier);
    setPatternEvalGrand(j, "diagonal5", Math.min(
        getPatternNo(boardGrand[0][5] * multiplier, boardGrand[1][6] * multiplier, boardGrand[2][7] * multiplier, boardGrand[3][8] * multiplier, boardGrand[4][9] * multiplier),
        getPatternNo(boardGrand[4][9] * multiplier, boardGrand[3][8] * multiplier, boardGrand[2][7] * multiplier, boardGrand[1][6] * multiplier, boardGrand[0][5] * multiplier)
    ), evaluation * multiplier);
    setPatternEvalGrand(j, "diagonal5", Math.min(
        getPatternNo(boardGrand[5][0] * multiplier, boardGrand[6][1] * multiplier, boardGrand[7][2] * multiplier, boardGrand[8][3] * multiplier, boardGrand[9][4] * multiplier),
        getPatternNo(boardGrand[9][4] * multiplier, boardGrand[8][3] * multiplier, boardGrand[7][2] * multiplier, boardGrand[6][1] * multiplier, boardGrand[5][0] * multiplier)
    ), evaluation * multiplier);
    setPatternEvalGrand(j, "diagonal5", Math.min(
        getPatternNo(boardGrand[5][9] * multiplier, boardGrand[6][8] * multiplier, boardGrand[7][7] * multiplier, boardGrand[8][6] * multiplier, boardGrand[9][5] * multiplier),
        getPatternNo(boardGrand[9][5] * multiplier, boardGrand[8][6] * multiplier, boardGrand[7][7] * multiplier, boardGrand[6][8] * multiplier, boardGrand[5][9] * multiplier)
    ), evaluation * multiplier);
    setPatternEvalGrand(j, "diagonal6", Math.min(
        getPatternNo(boardGrand[0][5] * multiplier, boardGrand[1][4] * multiplier, boardGrand[2][3] * multiplier, boardGrand[3][2] * multiplier, boardGrand[4][1] * multiplier, boardGrand[5][0] * multiplier),
        getPatternNo(boardGrand[5][0] * multiplier, boardGrand[4][1] * multiplier, boardGrand[3][2] * multiplier, boardGrand[2][3] * multiplier, boardGrand[1][4] * multiplier, boardGrand[0][5] * multiplier)
    ), evaluation * multiplier);
    setPatternEvalGrand(j, "diagonal6", Math.min(
        getPatternNo(boardGrand[0][4] * multiplier, boardGrand[1][5] * multiplier, boardGrand[2][6] * multiplier, boardGrand[3][7] * multiplier, boardGrand[4][8] * multiplier, boardGrand[5][9] * multiplier),
        getPatternNo(boardGrand[5][9] * multiplier, boardGrand[4][8] * multiplier, boardGrand[3][7] * multiplier, boardGrand[2][6] * multiplier, boardGrand[1][5] * multiplier, boardGrand[0][4] * multiplier)
    ), evaluation * multiplier);
    setPatternEvalGrand(j, "diagonal6", Math.min(
        getPatternNo(boardGrand[4][0] * multiplier, boardGrand[5][1] * multiplier, boardGrand[6][2] * multiplier, boardGrand[7][3] * multiplier, boardGrand[8][4] * multiplier, boardGrand[9][5] * multiplier),
        getPatternNo(boardGrand[9][5] * multiplier, boardGrand[8][4] * multiplier, boardGrand[7][3] * multiplier, boardGrand[6][2] * multiplier, boardGrand[5][1] * multiplier, boardGrand[4][0] * multiplier)
    ), evaluation * multiplier);
    setPatternEvalGrand(j, "diagonal6", Math.min(
        getPatternNo(boardGrand[4][9] * multiplier, boardGrand[5][8] * multiplier, boardGrand[6][7] * multiplier, boardGrand[7][6] * multiplier, boardGrand[8][5] * multiplier, boardGrand[9][4] * multiplier),
        getPatternNo(boardGrand[9][4] * multiplier, boardGrand[8][5] * multiplier, boardGrand[7][6] * multiplier, boardGrand[6][7] * multiplier, boardGrand[5][8] * multiplier, boardGrand[4][9] * multiplier)
    ), evaluation * multiplier);
    setPatternEvalGrand(j, "diagonal7", Math.min(
        getPatternNo(boardGrand[0][6] * multiplier, boardGrand[1][5] * multiplier, boardGrand[2][4] * multiplier, boardGrand[3][3] * multiplier, boardGrand[4][2] * multiplier, boardGrand[5][1] * multiplier, boardGrand[6][0] * multiplier),
        getPatternNo(boardGrand[6][0] * multiplier, boardGrand[5][1] * multiplier, boardGrand[4][2] * multiplier, boardGrand[3][3] * multiplier, boardGrand[2][4] * multiplier, boardGrand[1][5] * multiplier, boardGrand[0][6] * multiplier)
    ), evaluation * multiplier);
    setPatternEvalGrand(j, "diagonal7", Math.min(
        getPatternNo(boardGrand[9][6] * multiplier, boardGrand[8][5] * multiplier, boardGrand[7][4] * multiplier, boardGrand[6][3] * multiplier, boardGrand[5][2] * multiplier, boardGrand[4][1] * multiplier, boardGrand[3][0] * multiplier),
        getPatternNo(boardGrand[3][0] * multiplier, boardGrand[4][1] * multiplier, boardGrand[5][2] * multiplier, boardGrand[6][3] * multiplier, boardGrand[7][4] * multiplier, boardGrand[8][5] * multiplier, boardGrand[9][6] * multiplier)
    ), evaluation * multiplier);
    setPatternEvalGrand(j, "diagonal7", Math.min(
        getPatternNo(boardGrand[0][3] * multiplier, boardGrand[1][4] * multiplier, boardGrand[2][5] * multiplier, boardGrand[3][6] * multiplier, boardGrand[4][7] * multiplier, boardGrand[5][8] * multiplier, boardGrand[6][9] * multiplier),
        getPatternNo(boardGrand[6][9] * multiplier, boardGrand[5][8] * multiplier, boardGrand[4][7] * multiplier, boardGrand[3][6] * multiplier, boardGrand[2][5] * multiplier, boardGrand[1][4] * multiplier, boardGrand[0][3] * multiplier)
    ), evaluation * multiplier);
    setPatternEvalGrand(j, "diagonal7", Math.min(
        getPatternNo(boardGrand[9][3] * multiplier, boardGrand[8][4] * multiplier, boardGrand[7][5] * multiplier, boardGrand[6][6] * multiplier, boardGrand[5][7] * multiplier, boardGrand[4][8] * multiplier, boardGrand[3][9] * multiplier),
        getPatternNo(boardGrand[3][9] * multiplier, boardGrand[4][8] * multiplier, boardGrand[5][7] * multiplier, boardGrand[6][6] * multiplier, boardGrand[7][5] * multiplier, boardGrand[8][4] * multiplier, boardGrand[9][3] * multiplier)
    ), evaluation * multiplier);
    setPatternEvalGrand(j, "diagonal8", Math.min(
        getPatternNo(boardGrand[0][7] * multiplier, boardGrand[1][6] * multiplier, boardGrand[2][5] * multiplier, boardGrand[3][4] * multiplier, boardGrand[4][3] * multiplier, boardGrand[5][2] * multiplier, boardGrand[6][1] * multiplier, boardGrand[7][0] * multiplier),
        getPatternNo(boardGrand[7][0] * multiplier, boardGrand[6][1] * multiplier, boardGrand[5][2] * multiplier, boardGrand[4][3] * multiplier, boardGrand[3][4] * multiplier, boardGrand[2][5] * multiplier, boardGrand[1][6] * multiplier, boardGrand[0][7] * multiplier)
    ), evaluation * multiplier);
    setPatternEvalGrand(j, "diagonal8", Math.min(
        getPatternNo(boardGrand[0][2] * multiplier, boardGrand[1][3] * multiplier, boardGrand[2][4] * multiplier, boardGrand[3][5] * multiplier, boardGrand[4][6] * multiplier, boardGrand[5][7] * multiplier, boardGrand[6][8] * multiplier, boardGrand[7][9] * multiplier),
        getPatternNo(boardGrand[7][9] * multiplier, boardGrand[6][8] * multiplier, boardGrand[5][7] * multiplier, boardGrand[4][6] * multiplier, boardGrand[3][5] * multiplier, boardGrand[2][4] * multiplier, boardGrand[1][3] * multiplier, boardGrand[0][2] * multiplier)
    ), evaluation * multiplier);
    setPatternEvalGrand(j, "diagonal8", Math.min(
        getPatternNo(boardGrand[9][7] * multiplier, boardGrand[8][6] * multiplier, boardGrand[7][5] * multiplier, boardGrand[6][4] * multiplier, boardGrand[5][3] * multiplier, boardGrand[4][2] * multiplier, boardGrand[3][1] * multiplier, boardGrand[2][0] * multiplier),
        getPatternNo(boardGrand[2][0] * multiplier, boardGrand[3][1] * multiplier, boardGrand[4][2] * multiplier, boardGrand[5][3] * multiplier, boardGrand[6][4] * multiplier, boardGrand[7][5] * multiplier, boardGrand[8][6] * multiplier, boardGrand[9][7] * multiplier)
    ), evaluation * multiplier);
    setPatternEvalGrand(j, "diagonal8", Math.min(
        getPatternNo(boardGrand[9][2] * multiplier, boardGrand[8][3] * multiplier, boardGrand[7][4] * multiplier, boardGrand[6][5] * multiplier, boardGrand[5][6] * multiplier, boardGrand[4][7] * multiplier, boardGrand[3][8] * multiplier, boardGrand[2][9] * multiplier),
        getPatternNo(boardGrand[2][9] * multiplier, boardGrand[3][8] * multiplier, boardGrand[4][7] * multiplier, boardGrand[5][6] * multiplier, boardGrand[6][5] * multiplier, boardGrand[7][4] * multiplier, boardGrand[8][3] * multiplier, boardGrand[9][2] * multiplier)
    ), evaluation * multiplier);
    setPatternEvalGrand(j, "diagonal9", Math.min(
        getPatternNo(boardGrand[0][8] * multiplier, boardGrand[1][7] * multiplier, boardGrand[2][6] * multiplier, boardGrand[3][5] * multiplier, boardGrand[4][4] * multiplier, boardGrand[5][3] * multiplier, boardGrand[6][2] * multiplier, boardGrand[7][1] * multiplier, boardGrand[8][0] * multiplier),
        getPatternNo(boardGrand[8][0] * multiplier, boardGrand[7][1] * multiplier, boardGrand[6][2] * multiplier, boardGrand[5][3] * multiplier, boardGrand[4][4] * multiplier, boardGrand[3][5] * multiplier, boardGrand[2][6] * multiplier, boardGrand[1][7] * multiplier, boardGrand[0][8] * multiplier)
    ), evaluation * multiplier);
    setPatternEvalGrand(j, "diagonal9", Math.min(
        getPatternNo(boardGrand[0][1] * multiplier, boardGrand[1][2] * multiplier, boardGrand[2][3] * multiplier, boardGrand[3][4] * multiplier, boardGrand[4][5] * multiplier, boardGrand[5][6] * multiplier, boardGrand[6][7] * multiplier, boardGrand[7][8] * multiplier, boardGrand[8][9] * multiplier),
        getPatternNo(boardGrand[1][0] * multiplier, boardGrand[2][1] * multiplier, boardGrand[3][2] * multiplier, boardGrand[4][3] * multiplier, boardGrand[5][4] * multiplier, boardGrand[6][5] * multiplier, boardGrand[7][6] * multiplier, boardGrand[8][7] * multiplier, boardGrand[9][8] * multiplier)
    ), evaluation * multiplier);
    setPatternEvalGrand(j, "diagonal9", Math.min(
        getPatternNo(boardGrand[9][8] * multiplier, boardGrand[8][7] * multiplier, boardGrand[7][6] * multiplier, boardGrand[6][5] * multiplier, boardGrand[5][4] * multiplier, boardGrand[4][3] * multiplier, boardGrand[3][2] * multiplier, boardGrand[2][1] * multiplier, boardGrand[1][0] * multiplier),
        getPatternNo(boardGrand[8][9] * multiplier, boardGrand[7][8] * multiplier, boardGrand[6][7] * multiplier, boardGrand[5][6] * multiplier, boardGrand[4][5] * multiplier, boardGrand[3][4] * multiplier, boardGrand[2][3] * multiplier, boardGrand[1][2] * multiplier, boardGrand[0][1] * multiplier)
    ), evaluation * multiplier);
    setPatternEvalGrand(j, "diagonal9", Math.min(
        getPatternNo(boardGrand[9][1] * multiplier, boardGrand[8][2] * multiplier, boardGrand[7][3] * multiplier, boardGrand[6][4] * multiplier, boardGrand[5][5] * multiplier, boardGrand[4][6] * multiplier, boardGrand[3][7] * multiplier, boardGrand[2][8] * multiplier, boardGrand[1][9] * multiplier),
        getPatternNo(boardGrand[1][9] * multiplier, boardGrand[2][8] * multiplier, boardGrand[3][7] * multiplier, boardGrand[4][6] * multiplier, boardGrand[5][5] * multiplier, boardGrand[6][4] * multiplier, boardGrand[7][3] * multiplier, boardGrand[8][2] * multiplier, boardGrand[9][1] * multiplier)
    ), evaluation * multiplier);
    setPatternEvalGrand(j, "diagonal10", Math.min(
        getPatternNo(boardGrand[0][0] * multiplier, boardGrand[1][1] * multiplier, boardGrand[2][2] * multiplier, boardGrand[3][3] * multiplier, boardGrand[4][4] * multiplier, boardGrand[5][5] * multiplier, boardGrand[6][6] * multiplier, boardGrand[7][7] * multiplier, boardGrand[8][8] * multiplier, boardGrand[9][9] * multiplier),
        getPatternNo(boardGrand[9][9] * multiplier, boardGrand[8][8] * multiplier, boardGrand[7][7] * multiplier, boardGrand[6][6] * multiplier, boardGrand[5][5] * multiplier, boardGrand[4][4] * multiplier, boardGrand[3][3] * multiplier, boardGrand[2][2] * multiplier, boardGrand[1][1] * multiplier, boardGrand[0][0] * multiplier)
    ), evaluation * multiplier);
    setPatternEvalGrand(j, "diagonal10", Math.min(
        getPatternNo(boardGrand[0][9] * multiplier, boardGrand[1][8] * multiplier, boardGrand[2][7] * multiplier, boardGrand[3][6] * multiplier, boardGrand[4][5] * multiplier, boardGrand[5][4] * multiplier, boardGrand[6][3] * multiplier, boardGrand[7][2] * multiplier, boardGrand[8][1] * multiplier, boardGrand[9][0] * multiplier),
        getPatternNo(boardGrand[9][0] * multiplier, boardGrand[8][1] * multiplier, boardGrand[7][2] * multiplier, boardGrand[6][3] * multiplier, boardGrand[5][4] * multiplier, boardGrand[4][5] * multiplier, boardGrand[3][6] * multiplier, boardGrand[2][7] * multiplier, boardGrand[1][8] * multiplier, boardGrand[0][9] * multiplier)
    ), evaluation * multiplier);
}
function getPatternNo() {
    let no = 0;
    for (let i = 0; i < arguments.length; i++) {
        //empty:0 black:1 white:2
        if (arguments[i] == 1) no += 1 * 3 ** (arguments.length - 1 - i);
        else if (arguments[i] == -1) no += 2 * 3 ** (arguments.length - 1 - i);
    }
    return no;
}
function setPatternEval(moveNumber, type, patternNumber, evaluation) {
    if (patterns[moveNumber][type][patternNumber]) {
        let pattern = patterns[moveNumber][type][patternNumber];
        pattern[0] = (evaluation + pattern[0] * pattern[1]) / (pattern[1] + 1);
        pattern[1]++;
    } else {
        patterns[moveNumber][type][patternNumber] = [evaluation, 1];
    }
}
function setPatternEvalGrand(moveNumber, type, patternNumber, evaluation) {
    if (patternsGrand[moveNumber][type][patternNumber]) {
        let pattern = patternsGrand[moveNumber][type][patternNumber];
        pattern[0] = (evaluation + pattern[0] * pattern[1]) / (pattern[1] + 1);
        pattern[1]++;
    } else {
        patternsGrand[moveNumber][type][patternNumber] = [evaluation, 1];
    }
}
function getTable() {
    let arr = JSON.parse(JSON.stringify(patterns));
    for (let i of arr) {
        for (let j in i) {
            for (let k = 0; k < i[j].length; k++) {
                if (i[j][k]) {
                    i[j][k] = i[j][k][0];
                } else {
                    i[j][k] = 0;
                }
            }
        }
    }
    return arr;
}
function interpolate() {//replaces "getTable"
    let arr = JSON.parse(JSON.stringify(patterns));
    for (let i of arr) {
        for (let j in i) {
            for (let k = 0; k < i[j].length; k++) {
                if (i[j][k]) {
                    i[j][k] = i[j][k][0];
                } else {
                    i[j][k] = null;
                }
            }
        }
    }
    let patternNames = ["corner33", "corner52", "row1", "row2", "row3", "row4", "edgex", "diagonal4", "diagonal5", "diagonal6", "diagonal7", "diagonal8"];
    let patternArrLen = [3 ** 9, 3 ** 10, 3 ** 8, 3 ** 8, 3 ** 8, 3 ** 8, 3 ** 10, 3 ** 4, 3 ** 5, 3 ** 6, 3 ** 7, 3 ** 8];
    for (let patternI = 0; patternI < patternNames.length; patternI++) {
        for (let i = 0; i < patternArrLen[patternI]; i++) {
            let index = [];
            for (let j = 0; j < 60; j++) {
                if (arr[j][patternNames[patternI]][i] || arr[j][patternNames[patternI]][i] === 0) index.push(j);
            }
            if (index.length == 0) continue;
            if (!index.includes(0)) {
                arr[0][patternNames[patternI]][i] = arr[index[0]][patternNames[patternI]][i];
                index.unshift(0);
            }
            if (!index.includes(59)) {
                arr[59][patternNames[patternI]][i] = arr[index[index.length - 1]][patternNames[patternI]][59];
                index.push(59);
            }
            for (let j = 1; j < 59; j++) {
                if (!index.includes(j)) {
                    let jIndex = [...index, j].sort((a, b) => a - b).indexOf(j);
                    arr[j][patternNames[patternI]][i] = (arr[index[jIndex - 1]][patternNames[patternI]][i] * (index[jIndex] - j)
                        + arr[index[jIndex]][patternNames[patternI]][i] * (j - index[jIndex - 1])) / (index[jIndex] -
                            index[jIndex - 1]);
                }
            }
        }
    }
    return arr;
}
function interpolateGrand() {
    let arr = JSON.parse(JSON.stringify(patternsGrand));
    for (let i of arr) {
        for (let j in i) {
            for (let k = 0; k < i[j].length; k++) {
                if (i[j][k]) {
                    i[j][k] = i[j][k][0];
                } else {
                    i[j][k] = null;
                }
            }
        }
    }
    let patternNames = ["corner33", "corner52", "row1", "row2", "row3", "row4", "row5", "diagonal4", "diagonal5", "diagonal6", "diagonal7", "diagonal8", "diagonal9", "diagonal10"];
    let patternArrLen = [3 ** 9, 3 ** 10, 3 ** 8, 3 ** 8, 3 ** 8, 3 ** 8, 3 ** 8, 3 ** 4, 3 ** 5, 3 ** 6, 3 ** 7, 3 ** 8, 3 ** 9, 3 ** 10];
    for (let patternI = 0; patternI < patternNames.length; patternI++) {
        for (let i = 0; i < patternArrLen[patternI]; i++) {
            let index = [];
            for (let j = 0; j < 96; j++) {
                if (arr[j][patternNames[patternI]][i] || arr[j][patternNames[patternI]][i] === 0) index.push(j);
            }
            if (index.length == 0) continue;
            if (!index.includes(0)) {
                arr[0][patternNames[patternI]][i] = arr[index[0]][patternNames[patternI]][i];
                index.unshift(0);
            }
            if (!index.includes(95)) {
                arr[95][patternNames[patternI]][i] = arr[index[index.length - 1]][patternNames[patternI]][95];
                index.push(95);
            }
            for (let j = 1; j < 95; j++) {
                if (!index.includes(j)) {
                    let jIndex = [...index, j].sort((a, b) => a - b).indexOf(j);
                    arr[j][patternNames[patternI]][i] = (arr[index[jIndex - 1]][patternNames[patternI]][i] * (index[jIndex] - j)
                        + arr[index[jIndex]][patternNames[patternI]][i] * (j - index[jIndex - 1])) / (index[jIndex] -
                            index[jIndex - 1]);
                }
            }
        }
    }
    return arr;
}
function getRandomData(num) {
    let randomData = [];
    for (let j = 0; j < num; j++) {
        board = [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, -1, 1, 0, 0, 0],
            [0, 0, 0, 1, -1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0]
        ];
        playerColor = 1;
        let moves = [];
        for (let i = 0; i < 64; i++) {
            let validMoves = validMovesArr();
            if (!validMoves.length) break;
            moves.push(validMoves[Math.floor(validMoves.length * Math.random())]);
            pd(moves[moves.length - 1]);
        }
        randomData.push({
            moves: moves,
            type: 1
        });
    }
    return randomData;
}
function removeInvalidGames(arr) {
    let resultArr = [];
    for (let i = 0; i < arr.length; i++) {
        board = [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, -1, 1, 0, 0, 0],
            [0, 0, 0, 1, -1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0]
        ];
        playerColor = 1;
        for (let j of arr[i].moves) {
            if (j == "--") {
                playerColor = -playerColor;
            } else {
                pd(j);
            }
            if (!validMovesArr().length) {
                resultArr.push(arr[i]);
            }
        }
    }
    return resultArr;
}
function flow(type) {
    console.log("selectType");
    for (let i = 0; i < data.length; i++) {
        let tempType = 0;
        if (data[i].type) tempType = data[i].type;
        if (tempType != type) data.splice(i, 1); i--;
    }
/*    console.log("removeInvalidGames")
    data = removeInvalidGames(data);
    data = data.slice(0, 100000)
*/    console.log("learn");
    learn();
    console.log("interpolate");
    let arr = interpolate();
    console.log("toFixed");
    for (let i = 0; i < arr.length; i++) {
        for (let j in arr[i]) {
            for (let k = 0; k < arr[i][j].length; k++) {
                if (arr[i][j][k]) arr[i][j][k] = Number(Number(arr[i][j][k]).toFixed(3));
                else arr[i][j][k] = 0;
            }
        }
    }
    console.log("str");
    let str = JSON.stringify(arr).replace(/,0,/g, ",,").replace(/,0,/g, ",,").replace(/,0,/g, ",,");
    return str;
}
function flowGrand() {
    console.log("selectType");
    for (let i = 0; i < data.length; i++) { if (!data[i].type || data[i].type != 2) { data.splice(i, 1); i--; } }
    console.log("removeInvalidGames");
    //data = removeInvalidGames(data);
    data = data.slice(0, 100000);
    console.log("learn");
    learnGrand();
    console.log("interpolate");
    let arr = interpolateGrand();
    console.log("toFixed");
    for (let i = 0; i < arr.length; i++) {
        for (let j in arr[i]) {
            for (let k = 0; k < arr[i][j].length; k++) {
                if (arr[i][j][k]) arr[i][j][k] = Number(Number(arr[i][j][k]).toFixed(3));
                else arr[i][j][k] = 0;
            }
        }
    }
    console.log("str");
    let str = JSON.stringify(arr).replace(/,0,/g, ",,").replace(/,0,/g, ",,").replace(/,0,/g, ",,");
    return str;
}