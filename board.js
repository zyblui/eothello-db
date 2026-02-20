
const DIRECTIONS = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
const LETTERS = ["a", "b", "c", "d", "e", "f", "g", "h"];
let counter = 0n;
document.querySelectorAll(".board").forEach(function (e) {
    fillBoard(e);
});
function fillBoard(e) {
    if (e.filled) return;
    counter++;
    e.filled = true;
    let innerContainer = document.createElement("div");
    innerContainer.classList.add("inner-container");
    innerContainer.innerHTML = `
    <div class="dot dot-top dot-left"></div>
    <div class="dot dot-top dot-right"></div>
    <div class="dot dot-bottom dot-right"></div>
    <div class="dot dot-bottom dot-left"></div>
    `;
    for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) {
        let div = document.createElement("div");
        div.classList.add("grid", `r${i + 1}`, `c${j + 1}`);
        innerContainer.appendChild(div);
    }
    innerContainer.querySelector(".grid.r4.c4").classList.add("white");
    innerContainer.querySelector(".grid.r4.c5").classList.add("black");
    innerContainer.querySelector(".grid.r5.c4").classList.add("black");
    innerContainer.querySelector(".grid.r5.c5").classList.add("white");
    e.appendChild(innerContainer);
    e.innerHTML += `
    <div class="toggle">
        <label>
            <input type="radio" checked="checked" name="sideToMove${counter}" class="side-to-move-black" />
            <div class="score black-score"><div class="black-player"></div><div class="black-elo"></div><div class="score-inner">2</div></div></label><label><input type="radio" name="sideToMove${counter}" class="side-to-move-white" /><div
                class="score white-score"><div class="white-player"></div><div class="white-elo"></div><div class="score-inner">2</div></div>
        </label>
    </div>
    <div class="nav line">
        <button class="to-start-position"></button><button class="previous-move"></button><button class="next-move"></button><button
            class="last-move"></button>
    </div>
    <div class="board-operation line">
        <button class="setup-button"></button><button class="setup-clear"></button><button
            class="delete-move-button" class="menuButton menuButtonRed"></button>
    </div>
    <div class="disc-type line">
        <label>
            <input type="radio" checked="checked" class="setup-black" name="discType${counter}" />
            <div class="disc-type-black"></div></label><label><input type="radio" class="setup-white" name="discType${counter}" /><div
                class="disc-type-white"></div></label><label><input type="radio" class="setup-erase" name="discType${counter}" /><div
                class="disc-type-erase"></div>
        </label>
    </div>
    <div class="show-notation line">
        <button class="show-notation-button"></button>
    </div>
    <div class="notation"></div>
    `;
    if (e.blackPlayer) e.querySelector(".black-player").innerText = e.blackPlayer;
    if (e.blackElo) e.querySelector(".black-elo").innerText = e.blackElo;
    if (e.whitePlayer) e.querySelector(".white-player").innerText = e.whitePlayer;
    if (e.whiteElo) e.querySelector(".white-elo").innerText = e.whiteElo;
    e.board = [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, -1, 1, 0, 0, 0],
        [0, 0, 0, 1, -1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
    ];//1 for black, -1 for white
    e.initialPosition = [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, -1, 1, 0, 0, 0],
        [0, 0, 0, 1, -1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
    ];
    e.previousMoves = [];
    e.navigationPosition = [0, 0];
    e.playerColor = 1;
    e.lastCoord = {
        x: 0,/*1~8 */
        y: 0
    };
    e.setupMode = false;
    e.setupDisc = 1;

    for (let i = 0; i <= 7; i++) for (let j = 0; j <= 7; j++) e.querySelector(".r" + (i + 1) + ".c" + (j + 1))
        .addEventListener("click", function () {
            if (!e.setupMode) e.pd(LETTERS[j] + (i + 1));
            else {
                e.board[i][j] = e.setupDisc;
                e.initialPosition = structuredClone(e.board);
                e.lastCoord = {
                    x: 0,
                    y: 0
                };
                e.previousMoves = [];
                e.navigationPosition = [-1, 1];
                e.render();
            }
        });
    e.querySelector(".setup-button").addEventListener("click", function () {
        e.setupMode = !e.setupMode;
        if (e.setupMode) {
            e.querySelector(".setup-button").classList.add("selected");
            e.querySelector(".disc-type").classList.add("show");
        }
        else {
            e.querySelector(".setup-button").classList.remove("selected");
            e.querySelector(".disc-type").classList.remove("show");
        }
    });
    e.querySelector(".setup-black").addEventListener("click", function () {
        e.setupDisc = 1;
    });
    e.querySelector(".setup-white").addEventListener("click", function () {
        e.setupDisc = -1;
    });
    e.querySelector(".setup-erase").addEventListener("click", function () {
        e.setupDisc = 0;
    });
    e.querySelector(".setup-clear").addEventListener("click", function () {
        e.board = [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, -1, 1, 0, 0, 0],
            [0, 0, 0, 1, -1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0]
        ];
        e.initialPosition = structuredClone(e.board);
        e.lastCoord = {
            x: 0,
            y: 0
        };
        e.previousMoves = [];
        e.navigationPosition = [-1, 1];
        e.render();
    });
    e.querySelector(".side-to-move-black").addEventListener("click", function () {
        e.playerColor = 1;
        e.render();
    });
    e.querySelector(".side-to-move-white").addEventListener("click", function () {
        e.playerColor = -1;
        e.render();
    });
    e.querySelector(".show-notation-button").addEventListener("click", function () {
        if (e.querySelector(".show-notation-button").classList.contains("selected")) {
            e.querySelector(".show-notation-button").classList.remove("selected");
            e.querySelector(".notation").classList.remove("show");
        } else {
            e.querySelector(".show-notation-button").classList.add("selected");
            e.querySelector(".notation").classList.add("show");
        }
    });
    e.render = function () {
        let validMoves = e.validMovesArr();
        for (let i = 0; i <= 7; i++) for (let j = 0; j <= 7; j++) {
            e.querySelector(".r" + (i + 1) + ".c" + (j + 1)).classList.remove("black", "white", "move");
            if (e.board[i][j] == 1) {
                e.querySelector(".r" + (i + 1) + ".c" + (j + 1)).classList.add("black");
            } else if (e.board[i][j] == -1) {
                e.querySelector(".r" + (i + 1) + ".c" + (j + 1)).classList.add("white");
            } else if (validMoves.includes(i * 8 + j)) {
                e.querySelector(".r" + (i + 1) + ".c" + (j + 1)).classList.add("move");
            }
        }
        let discs = e.discCount(e.board);
        e.querySelector(".black-score .score-inner").innerText = discs.black;
        e.querySelector(".white-score .score-inner").innerText = discs.white;
        if (e.querySelector(".last-move-mark")) e.querySelector(".last-move-mark").classList.remove("last-move-mark");
        if (e.lastCoord.x != 0) e.querySelector(".r" + e.lastCoord.x + ".c" + e.lastCoord.y).classList.add("last-move-mark");
        e.querySelector(".notation").innerHTML = "";
        for (let i = 0; i < e.previousMoves.length; i++) {
            let span1 = document.createElement("span");
            span1.innerText = e.previousMoves[i][0];
            let spanContainer = document.createElement("span");
            spanContainer.appendChild(span1);
            span1.addEventListener("click", function () {
                e.navigate(i, 0);
            });
            if (e.previousMoves[i][1]) {
                let span2 = document.createElement("span");
                span2.innerText = e.previousMoves[i][1];
                spanContainer.appendChild(span2);
                span2.addEventListener("click", function () {
                    e.navigate(i, 1);
                });
            }
            e.querySelector(".notation").appendChild(spanContainer);
        }
        if (e.querySelector(".navigation-position")) e.querySelector(".navigation-position").classList.remove("navigation-position");
        if (e.querySelector(".notation").children[e.navigationPosition[0]]) e.querySelector(".notation").children[e
            .navigationPosition[0]].children[e.navigationPosition[1]].classList.add("navigation-position");
        if (e.playerColor == 1) e.querySelector(".side-to-move-black").checked = "checked";
        else e.querySelector(".side-to-move-white").checked = "checked";
        if (e.onrender) e.onrender();
    };
    e.navigate = function (moveNo, side/*0,1*/) {
        e.board = structuredClone(e.initialPosition);
        if (moveNo == -1) {
            e.lastCoord = {
                x: 0,
                y: 0
            };
        } else {
            for (let i = 0; i < moveNo; i++) {
                if (e.previousMoves[i][0] && e.previousMoves[i][0] != "--") e.board = e.placeDisc(e.board, Number(e
                    .previousMoves[i][0][1]) - 1, LETTERS.indexOf(e.previousMoves[i][0][0]), 1).board;
                if (e.previousMoves[i][1] && e.previousMoves[i][1] != "--") e.board = e.placeDisc(e.board, Number(e
                    .previousMoves[i][1][1]) - 1, LETTERS.indexOf(e.previousMoves[i][1][0]), -1).board;
            }
            if (e.previousMoves[moveNo][0] && e.previousMoves[moveNo][0] != "--") e.board = e.placeDisc(e.board, Number(e
                .previousMoves[moveNo][0][1]) - 1, LETTERS.indexOf(e.previousMoves[moveNo][0][0]), 1).board;
            if (side == 1 && e.previousMoves[moveNo][1] && e.previousMoves[moveNo][1] != "--") e.board = e.placeDisc(e.board,
                Number(e.previousMoves[moveNo][1][1]) - 1, LETTERS.indexOf(e.previousMoves[moveNo][1][0]), -1).board;
            if (e.previousMoves[moveNo][side] != "--") {
                e.lastCoord = {
                    x: Number(e.previousMoves[moveNo][side][1]),
                    y: LETTERS.indexOf(e.previousMoves[moveNo][side][0]) + 1
                };
            } else {
                e.lastCoord = {
                    x: 0,
                    y: 0
                };
            }
        }
        e.navigationPosition = [moveNo, side];
        if (side == 1) e.playerColor = 1;
        else e.playerColor = -1;
        e.render();
    };
    e.pd = function (coord, renderAndCheck = true) {
        let y = LETTERS.indexOf(coord[0]);
        let x = Number(coord[1]) - 1;
        let placeResult = e.placeDisc(e.board, x, y, e.playerColor);
        if (!placeResult.isValid) {
            if (!renderAndCheck) {
                e.playerColor = -e.playerColor;
                e.pd(coord, false);
            }
            return;

        }
        e.lastCoord = {
            x: x + 1,
            y: y + 1
        };
        e.board = placeResult.board;
        if (e.previousMoves.length) {
            if (e.playerColor == 1) {
                e.previousMoves.push([coord, ""]);
                if (!e.previousMoves[e.previousMoves.length - 2][1]) e.previousMoves[e.previousMoves.length - 2][1] = "--";
            } else {
                if (!e.previousMoves[e.previousMoves.length - 1][1]) e.previousMoves[e.previousMoves.length - 1][1] = coord;
                else e.previousMoves.push(["--", coord]);
            }
        } else {
            if (e.playerColor == 1) e.previousMoves = [[coord, ""]];
            else e.previousMoves = [["--", coord]];
        }
        e.navigationPosition = [e.previousMoves.length - 1, ((e.playerColor == 1) ? 0 : 1)];
        e.playerColor = -e.playerColor;
        if (renderAndCheck && !e.validMovesArr().length) e.playerColor = -e.playerColor;
        if (renderAndCheck) e.render();
    };
    e.validMovesArr = function () {
        let situations = [];
        for (let m = 0; m <= 7; m++) for (let n = 0; n <= 7; n++) {
            let placeResult = e.placeDisc(e.board, m, n, e.playerColor);
            if (placeResult.isValid) situations.push(m * 8 + n);
        }
        return situations;
    };
    e.placeDisc = function (currentBoard, x, y, color) {
        if (currentBoard[x][y]) return { isValid: false };
        let tempBoard = structuredClone(currentBoard);
        let isValidMove = false;
        for (let i of DIRECTIONS) {
            if (e.directionalFlip(tempBoard, x, y, i, color)) isValidMove = true;
        }
        if (isValidMove) {
            tempBoard[x][y] = color;
            return {
                isValid: true,
                board: tempBoard
            };
        }
        return { isValid: false };
    };
    e.directionalFlip = function (currentBoard, x, y, direction, color) {//return value: is a valid directional flip
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
    };
    e.discCount = function (currentBoard) {
        let discs = {
            black: 0,
            white: 0
        };
        for (let i of currentBoard.flat()) {
            if (i == 1) discs.black++;
            else if (i == -1) discs.white++;
        }
        return discs;
    };
    e.render();
    e.querySelector(".to-start-position").addEventListener("click", function () {
        e.navigate(-1, 1);
    });
    e.querySelector(".previous-move").addEventListener("click", function () {
        if (e.navigationPosition[1] == 1 && e.navigationPosition[0] >= 0) e.navigate(e.navigationPosition[0], 0);
        else if (e.navigationPosition[1] == 0) e.navigate(e.navigationPosition[0] - 1, 1);
    });
    e.querySelector(".next-move").addEventListener("click", function () {
        if (e.navigationPosition[1] == 0) {
            if (e.previousMoves[e.navigationPosition[0]][1] != "") e.navigate(e.navigationPosition[0], 1);
        }
        else if (e.previousMoves[e.navigationPosition[0] + 1]) e.navigate(e.navigationPosition[0] + 1, 0);
    });
    e.querySelector(".last-move").addEventListener("click", function () {
        e.navigate(e.previousMoves.length - 1, ((e.previousMoves[e.previousMoves.length - 1]) ? 1 : 0));
    });
    e.addEventListener("keydown", function (evt) {
        switch (evt.key) {
            case "ArrowLeft":
                e.querySelector(".previous-move").click();
                break;
            case "ArrowRight":
                e.querySelector(".next-move").click();
                break;
            case "ArrowUp":
                e.querySelector(".to-start-position").click();
                break;
            case "ArrowDown":
                e.querySelector(".last-move").click();
        }
    });
    e.querySelector(".delete-move-button").addEventListener("click", function () {
        if (e.navigationPosition[0] < 0) return;
        if (e.navigationPosition[1] == 0) {
            e.previousMoves = e.previousMoves.slice(0, e.navigationPosition[0]);
            e.navigate(e.navigationPosition[0] - 1, 1);
        } else {
            e.previousMoves = e.previousMoves.slice(0, e.navigationPosition[0] + 1);
            e.previousMoves[e.previousMoves.length - 1][1] = "";
            e.navigate(e.navigationPosition[0], 0);
        }
    });
}