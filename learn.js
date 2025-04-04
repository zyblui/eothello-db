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
    })
}
let playerColor = 1
let board = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, -1, 1, 0, 0, 0],
    [0, 0, 0, 1, -1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
]
const DIRECTIONS = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
const LETTERS = ["a", "b", "c", "d", "e", "f", "g", "h"];
function validMovesArr() {
    let situations = []
    for (let m = 0; m <= 7; m++) {
        for (let n = 0; n <= 7; n++) {
            let placeResult = placeDisc(board, m, n, playerColor);
            if (placeResult.isValid) {
                situations.push(m * 8 + n)
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
        }
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
let learnedPositions = 0
function learn() {
    learnedPositions = 0
    for (let i of data) if (i.type == 1 || i.type == 0) {
        for (let j of i.moves) {
            pd(j);
        }
        let discs = discCount(board);
        let blackAdvantage = 0;
        if (discs.black != discs.white) {
            blackAdvantage = (64 - discs.black - discs.white + Math.abs(discs.black - discs.white)) * ((discs.black < discs.white) ? 1 : -1)
        }
        playerColor = 1
        board = [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, -1, 1, 0, 0, 0],
            [0, 0, 0, 1, -1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0]
        ]
        for (let j = 0; j < i.moves.length; j++) {
            pd(i.moves[j]);
            setPatternEval(j, "corner33", Math.min(
                getPatternNo(board[0][0], board[0][1], board[0][2], board[1][0], board[1][1], board[1][2], board[2][0], board[2][1], board[2][2]),
                getPatternNo(board[0][0], board[1][0], board[2][0], board[0][1], board[1][1], board[2][1], board[0][2], board[1][2], board[2][2])
            ), blackAdvantage)
            setPatternEval(j, "corner33", Math.min(
                getPatternNo(board[0][7], board[0][6], board[0][5], board[1][7], board[1][6], board[1][5], board[2][7], board[2][6], board[2][5]),
                getPatternNo(board[0][7], board[1][7], board[2][7], board[0][6], board[1][6], board[2][6], board[0][5], board[1][5], board[2][5])
            ), blackAdvantage)
            setPatternEval(j, "corner33", Math.min(
                getPatternNo(board[7][0], board[7][1], board[7][2], board[6][0], board[6][1], board[6][2], board[5][0], board[5][1], board[5][2]),
                getPatternNo(board[7][0], board[6][0], board[5][0], board[7][1], board[6][1], board[5][1], board[7][2], board[6][2], board[5][2])
            ), blackAdvantage)
            setPatternEval(j, "corner33", Math.min(
                getPatternNo(board[7][7], board[7][6], board[7][5], board[6][7], board[6][6], board[6][5], board[5][7], board[5][6], board[5][5]),
                getPatternNo(board[7][7], board[6][7], board[5][7], board[7][6], board[6][6], board[5][6], board[7][5], board[6][5], board[5][5])
            ), blackAdvantage)
            setPatternEval(j, "corner52",
                getPatternNo(board[0][0], board[0][1], board[0][2], board[0][3], board[0][4], board[1][0], board[1][1], board[1][2], board[1][3], board[1][4])
                , blackAdvantage)
            setPatternEval(j, "corner52",
                getPatternNo(board[0][0], board[1][0], board[2][0], board[3][0], board[4][0], board[0][1], board[1][1], board[2][1], board[3][1], board[4][1])
                , blackAdvantage)
            setPatternEval(j, "corner52",
                getPatternNo(board[7][0], board[7][1], board[7][2], board[7][3], board[7][4], board[6][0], board[6][1], board[6][2], board[6][3], board[6][4])
                , blackAdvantage)
            setPatternEval(j, "corner52",
                getPatternNo(board[7][0], board[6][0], board[5][0], board[4][0], board[3][0], board[7][1], board[6][1], board[5][1], board[4][1], board[3][1])
                , blackAdvantage)
            setPatternEval(j, "corner52",
                getPatternNo(board[0][7], board[0][6], board[0][5], board[0][4], board[0][3], board[1][7], board[1][6], board[1][5], board[1][4], board[1][3])
                , blackAdvantage)
            setPatternEval(j, "corner52",
                getPatternNo(board[0][7], board[1][7], board[2][7], board[3][7], board[4][7], board[0][6], board[1][6], board[2][6], board[3][6], board[4][6])
                , blackAdvantage)
            setPatternEval(j, "corner52",
                getPatternNo(board[7][7], board[6][7], board[5][7], board[4][7], board[3][7], board[7][6], board[6][6], board[5][6], board[4][6], board[3][6])
                , blackAdvantage)
            setPatternEval(j, "corner52",
                getPatternNo(board[7][7], board[7][6], board[7][5], board[7][4], board[7][3], board[6][7], board[6][6], board[6][5], board[6][4], board[6][3])
                , blackAdvantage)
            setPatternEval(j, "row1", Math.min(
                getPatternNo(board[0][0], board[0][1], board[0][2], board[0][3], board[0][4], board[0][5], board[0][6], board[0][7]),
                getPatternNo(board[0][7], board[0][6], board[0][5], board[0][4], board[0][3], board[0][2], board[0][1], board[0][0])
            ), blackAdvantage)
            setPatternEval(j, "row1", Math.min(
                getPatternNo(board[7][0], board[7][1], board[7][2], board[7][3], board[7][4], board[7][5], board[7][6], board[7][7]),
                getPatternNo(board[7][7], board[7][6], board[7][5], board[7][4], board[7][3], board[7][2], board[7][1], board[7][0])
            ), blackAdvantage)
            setPatternEval(j, "row1", Math.min(
                getPatternNo(board[0][0], board[1][0], board[2][0], board[3][0], board[4][0], board[5][0], board[6][0], board[7][0]),
                getPatternNo(board[7][0], board[6][0], board[5][0], board[4][0], board[3][0], board[2][0], board[1][0], board[0][0])
            ), blackAdvantage)
            setPatternEval(j, "row1", Math.min(
                getPatternNo(board[0][7], board[1][7], board[2][7], board[3][7], board[4][7], board[5][7], board[6][7], board[7][7]),
                getPatternNo(board[7][7], board[6][7], board[5][7], board[4][7], board[3][7], board[2][7], board[1][7], board[0][7])
            ), blackAdvantage)
            setPatternEval(j, "row2", Math.min(
                getPatternNo(board[1][0], board[1][1], board[1][2], board[1][3], board[1][4], board[1][5], board[1][6], board[1][7]),
                getPatternNo(board[1][7], board[1][6], board[1][5], board[1][4], board[1][3], board[1][2], board[1][1], board[1][0])
            ), blackAdvantage)
            setPatternEval(j, "row2", Math.min(
                getPatternNo(board[6][0], board[6][1], board[6][2], board[6][3], board[6][4], board[6][5], board[6][6], board[6][7]),
                getPatternNo(board[6][7], board[6][6], board[6][5], board[6][4], board[6][3], board[6][2], board[6][1], board[6][0])
            ), blackAdvantage)
            setPatternEval(j, "row2", Math.min(
                getPatternNo(board[0][1], board[1][1], board[2][1], board[3][1], board[4][1], board[5][1], board[6][1], board[7][1]),
                getPatternNo(board[7][1], board[6][1], board[5][1], board[4][1], board[3][1], board[2][1], board[1][1], board[0][1])
            ), blackAdvantage)
            setPatternEval(j, "row2", Math.min(
                getPatternNo(board[0][6], board[1][6], board[2][6], board[3][6], board[4][6], board[5][6], board[6][6], board[7][6]),
                getPatternNo(board[7][6], board[6][6], board[5][6], board[4][6], board[3][6], board[2][6], board[1][6], board[0][6])
            ), blackAdvantage)
            setPatternEval(j, "row3", Math.min(
                getPatternNo(board[2][0], board[2][1], board[2][2], board[2][3], board[2][4], board[2][5], board[2][6], board[2][7]),
                getPatternNo(board[2][7], board[2][6], board[2][5], board[2][4], board[2][3], board[2][2], board[2][1], board[2][0])
            ), blackAdvantage)
            setPatternEval(j, "row3", Math.min(
                getPatternNo(board[5][0], board[5][1], board[5][2], board[5][3], board[5][4], board[5][5], board[5][6], board[5][7]),
                getPatternNo(board[5][7], board[5][6], board[5][5], board[5][4], board[5][3], board[5][2], board[5][1], board[5][0])
            ), blackAdvantage)
            setPatternEval(j, "row3", Math.min(
                getPatternNo(board[0][2], board[1][2], board[2][2], board[3][2], board[4][2], board[5][2], board[6][2], board[7][2]),
                getPatternNo(board[7][2], board[6][2], board[5][2], board[4][2], board[3][2], board[2][2], board[1][2], board[0][2])
            ), blackAdvantage)
            setPatternEval(j, "row3", Math.min(
                getPatternNo(board[0][5], board[1][5], board[2][5], board[3][5], board[4][5], board[5][5], board[6][5], board[7][5]),
                getPatternNo(board[7][5], board[6][5], board[5][5], board[4][5], board[3][5], board[2][5], board[1][5], board[0][5])
            ), blackAdvantage)
            setPatternEval(j, "row4", Math.min(
                getPatternNo(board[3][0], board[3][1], board[3][2], board[3][3], board[3][4], board[3][5], board[3][6], board[3][7]),
                getPatternNo(board[3][7], board[3][6], board[3][5], board[3][4], board[3][3], board[3][2], board[3][1], board[3][0])
            ), blackAdvantage)
            setPatternEval(j, "row4", Math.min(
                getPatternNo(board[4][0], board[4][1], board[4][2], board[4][3], board[4][4], board[4][5], board[4][6], board[4][7]),
                getPatternNo(board[4][7], board[4][6], board[4][5], board[4][4], board[4][3], board[4][2], board[4][1], board[4][0])
            ), blackAdvantage)
            setPatternEval(j, "row4", Math.min(
                getPatternNo(board[0][3], board[1][3], board[2][3], board[3][3], board[4][3], board[5][3], board[6][3], board[7][3]),
                getPatternNo(board[7][3], board[6][3], board[5][3], board[4][3], board[3][3], board[2][3], board[1][3], board[0][3])
            ), blackAdvantage)
            setPatternEval(j, "row4", Math.min(
                getPatternNo(board[0][4], board[1][4], board[2][4], board[3][4], board[4][4], board[5][4], board[6][4], board[7][4]),
                getPatternNo(board[7][4], board[6][4], board[5][4], board[4][4], board[3][4], board[2][4], board[1][4], board[0][4])
            ), blackAdvantage)
            setPatternEval(j, "edgex", Math.min(
                getPatternNo(board[0][0], board[0][1], board[0][2], board[0][3], board[0][4], board[0][5], board[0][6], board[0][7], board[1][1], board[1][6]),
                getPatternNo(board[0][7], board[0][6], board[0][5], board[0][4], board[0][3], board[0][2], board[0][1], board[0][0], board[1][6], board[1][1])
            ), blackAdvantage)
            setPatternEval(j, "edgex", Math.min(
                getPatternNo(board[7][0], board[7][1], board[7][2], board[7][3], board[7][4], board[7][5], board[7][6], board[7][7], board[6][1], board[6][6]),
                getPatternNo(board[7][7], board[7][6], board[7][5], board[7][4], board[7][3], board[7][2], board[7][1], board[7][0], board[6][6], board[6][1])
            ), blackAdvantage)
            setPatternEval(j, "edgex", Math.min(
                getPatternNo(board[0][0], board[1][0], board[2][0], board[3][0], board[4][0], board[5][0], board[6][0], board[7][0], board[1][1], board[6][1]),
                getPatternNo(board[7][0], board[6][0], board[5][0], board[4][0], board[3][0], board[2][0], board[1][0], board[0][0], board[6][1], board[1][1])
            ), blackAdvantage)
            setPatternEval(j, "edgex", Math.min(
                getPatternNo(board[0][7], board[1][7], board[2][7], board[3][7], board[4][7], board[5][7], board[6][7], board[7][7], board[1][6], board[6][6]),
                getPatternNo(board[7][7], board[6][7], board[5][7], board[4][7], board[3][7], board[2][7], board[1][7], board[0][7], board[6][6], board[1][6])
            ), blackAdvantage)
            setPatternEval(j, "diagonal4", Math.min(
                getPatternNo(board[0][3], board[1][2], board[2][1], board[3][0]),
                getPatternNo(board[3][0], board[2][1], board[1][2], board[0][3])
            ), blackAdvantage)
            setPatternEval(j, "diagonal4", Math.min(
                getPatternNo(board[0][4], board[1][5], board[2][6], board[3][7]),
                getPatternNo(board[3][7], board[2][6], board[1][5], board[0][4])
            ), blackAdvantage)
            setPatternEval(j, "diagonal4", Math.min(
                getPatternNo(board[4][0], board[5][1], board[6][2], board[7][3]),
                getPatternNo(board[7][3], board[6][2], board[5][1], board[4][0])
            ), blackAdvantage)
            setPatternEval(j, "diagonal4", Math.min(
                getPatternNo(board[4][7], board[5][6], board[6][5], board[7][4]),
                getPatternNo(board[7][4], board[6][5], board[5][6], board[4][7])
            ), blackAdvantage)
            setPatternEval(j, "diagonal5", Math.min(
                getPatternNo(board[0][4], board[1][3], board[2][2], board[3][1], board[4][0]),
                getPatternNo(board[4][0], board[3][1], board[2][2], board[1][3], board[0][4])
            ), blackAdvantage)
            setPatternEval(j, "diagonal5", Math.min(
                getPatternNo(board[7][4], board[6][3], board[5][2], board[4][1], board[3][0]),
                getPatternNo(board[3][0], board[4][1], board[5][2], board[6][3], board[7][4])
            ), blackAdvantage)
            setPatternEval(j, "diagonal5", Math.min(
                getPatternNo(board[0][3], board[1][4], board[2][5], board[3][6], board[4][7]),
                getPatternNo(board[4][7], board[3][6], board[2][5], board[1][4], board[0][3])
            ), blackAdvantage)
            setPatternEval(j, "diagonal5", Math.min(
                getPatternNo(board[7][3], board[6][4], board[5][5], board[4][6], board[3][7]),
                getPatternNo(board[3][7], board[4][6], board[5][5], board[6][4], board[7][3])
            ), blackAdvantage)
            setPatternEval(j, "diagonal6", Math.min(
                getPatternNo(board[0][5], board[1][4], board[2][3], board[3][2], board[4][1], board[5][0]),
                getPatternNo(board[5][0], board[4][1], board[3][2], board[2][3], board[1][4], board[0][5])
            ), blackAdvantage)
            setPatternEval(j, "diagonal6", Math.min(
                getPatternNo(board[0][2], board[1][3], board[2][4], board[3][5], board[4][6], board[5][7]),
                getPatternNo(board[2][0], board[3][1], board[4][2], board[5][3], board[6][4], board[7][5])
            ), blackAdvantage)
            setPatternEval(j, "diagonal6", Math.min(
                getPatternNo(board[7][5], board[6][4], board[5][3], board[4][2], board[3][1], board[2][0]),
                getPatternNo(board[5][7], board[4][6], board[3][5], board[2][4], board[1][3], board[0][2])
            ), blackAdvantage)
            setPatternEval(j, "diagonal6", Math.min(
                getPatternNo(board[7][2], board[6][3], board[5][4], board[4][5], board[3][6], board[2][7]),
                getPatternNo(board[2][7], board[3][6], board[4][5], board[5][4], board[6][3], board[7][2])
            ), blackAdvantage)
            setPatternEval(j, "diagonal7", Math.min(
                getPatternNo(board[0][6], board[1][5], board[2][4], board[3][3], board[4][2], board[5][1], board[6][0]),
                getPatternNo(board[6][0], board[5][1], board[4][2], board[3][3], board[2][4], board[1][5], board[0][6])
            ), blackAdvantage)
            setPatternEval(j, "diagonal7", Math.min(
                getPatternNo(board[0][1], board[1][2], board[2][3], board[3][4], board[4][5], board[5][6], board[6][7]),
                getPatternNo(board[1][0], board[2][1], board[3][2], board[4][3], board[5][4], board[6][5], board[7][6])
            ), blackAdvantage)
            setPatternEval(j, "diagonal7", Math.min(
                getPatternNo(board[7][6], board[6][5], board[5][4], board[4][3], board[3][2], board[2][1], board[1][0]),
                getPatternNo(board[6][7], board[5][6], board[4][5], board[3][4], board[2][3], board[1][2], board[0][1])
            ), blackAdvantage)
            setPatternEval(j, "diagonal7", Math.min(
                getPatternNo(board[7][1], board[6][2], board[5][3], board[4][4], board[3][5], board[2][6], board[1][7]),
                getPatternNo(board[1][7], board[2][6], board[3][5], board[4][4], board[5][3], board[6][2], board[7][1])
            ), blackAdvantage)
            setPatternEval(j, "diagonal8", Math.min(
                getPatternNo(board[0][0], board[1][1], board[2][2], board[3][3], board[4][4], board[5][5], board[6][6], board[7][7]),
                getPatternNo(board[7][7], board[6][6], board[5][5], board[4][4], board[3][3], board[2][2], board[1][1], board[0][0])
            ), blackAdvantage)
            setPatternEval(j, "diagonal8", Math.min(
                getPatternNo(board[0][7], board[1][6], board[2][5], board[3][4], board[4][3], board[5][2], board[6][1], board[7][0]),
                getPatternNo(board[7][0], board[6][1], board[5][2], board[4][3], board[3][4], board[2][5], board[1][6], board[0][7])
            ), blackAdvantage)
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
        ]
        learnedPositions++;
    }
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
function getTable() {
    let arr = JSON.parse(JSON.stringify(patternTable))
    for (let i of arr) {
        for (let j in i) {
            for (let k = 0; k < i[j].length; k++) {
                if (i[j][k]) {
                    i[j][k] = i[j][k][0]
                } else {
                    i[j][k] = 0
                }
            }
        }
    }
    return arr;
}
function getRandomData(num){
    
}