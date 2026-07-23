function mainMsg(e) {
    if (e.type == "analysis") {

        document.getElementById("analysisContent").innerHTML = "";
        for (let i of e.analysis) {
            let analysisLine = document.createElement("div");
            analysisLine.classList.add("analysis-line");
            let evaluationSpan = document.createElement("span");
            evaluationSpan.innerText = ((i.evaluation >= 0) ? "+" : "") + i.evaluation.toFixed(2);
            evaluationSpan.classList.add(((i.evaluation >= 0) == (document.getElementById("inputBoard").playerColor == 1)) ? "black" : "white");
            analysisLine.appendChild(evaluationSpan);
            let text = document.createTextNode(" " + i.coord);
            analysisLine.appendChild(text);
            document.getElementById("analysisContent").appendChild(analysisLine);
            let hr = document.createElement("hr");
            document.getElementById("analysisContent").appendChild(hr);
        }
        document.getElementById("nodesNumber").innerText = e.nodes;
        document.getElementById("inputBoard").pd(e.analysis[0].coord);
    }
}
let searchDepth = 6, exactDepth = 12, computerColor = -1;
document.getElementById("inputBoard").afterPlacingDisc = function () {
    if (document.getElementById("inputBoard").playerColor == computerColor) workerMsg({
        type: "computerPlay",
        board: document.getElementById("inputBoard").board,
        color: document.getElementById("inputBoard").playerColor,
        depth: searchDepth,
        exactDepth: exactDepth
    });
};
document.getElementById("computerRoleBlack").addEventListener("click", function () {
    computerColor = 1;
});
document.getElementById("computerRoleWhite").addEventListener("click", function () {
    computerColor = -1;
});
document.getElementById("computerRoleNeither").addEventListener("click", function () {
    computerColor = 0;
});