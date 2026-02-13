function getMoveList(prevMoves) {
    let arr = [];
    for (let i of prevMoves) {
        if (i[0] != "--") arr.push(i[0]);
        if (i[1] && i[1] != "--") arr.push(i[1]);
    }
    return arr;
}
function searchMoveList(moveList) {
    let matchedData = [];
    outerFor: for (let i of data) {
        if (i.type != 1 && i.type != 0) continue;
        for (let j = 0; j < moveList.length; j++) {
            if (moveList[j] != i.moves[j]) continue outerFor;
        }
        matchedData.push(i);
    }
    return matchedData;
}
document.getElementById("inputBoard").onrender = function () {
    document.getElementById("results").innerHTML = "";
    let results = searchMoveList(getMoveList(document.getElementById("inputBoard").previousMoves)).slice(0, 100);
    for (let i of results) {
        let tempBoard = document.createElement("div");
        tempBoard.classList.add("board", "small");
        if (i.type == 0) tempBoard.classList.add("othello-board");
        else tempBoard.classList.add("anti-board");
        document.getElementById("results").appendChild(tempBoard);
        fillBoard(tempBoard);
        for (let j of i.moves) tempBoard.pd(j);
    }
};