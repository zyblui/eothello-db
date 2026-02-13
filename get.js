let data = [];
let regex = /server_game\.initializeServerGame\([\S\s]*?\)/;
let pagesFetched = 0;
function get(initialVal, num) {
    pagesFetched++;
    let myRequest = new Request("https://www.eothello.com/game/" + initialVal);
    fetch(myRequest)
        .then((response) => response.text())
        .then((response) => {
            if (isValidGame(response)) {
                data.push({
                    no: getNo(response),
                    type: getGameType(response),
                    players: getPlayerNames(response),
                    scores: getPlayerScores(response),
                    moves: getMoves(response)
                });
            }
        }).then((r) => {
            if (num == 1) return;
            get(initialVal + 1, num - 1);
        });
}
function multiGet(initialVal, num) {
    pagesFetched = 0;
    num /= 10;
    for (let i = 0; i < 10; i++) {
        get(initialVal + i * num, num);
    }
}
function isValidGame(str) {
    return /\[".*"\],/.exec(str) != null;
}
function getPlayerNames(str) {
    let result = str.match(/<a href="https:\/\/www\.eothello\.com\/player\/[\s\S]*?<\/a>/g);
    result[0] = result[0].replace(/<a href="https:\/\/www\.eothello\.com\/player\/\d*?">/, "").replace(/<\/a>/, "").trim();
    result[1] = result[1].replace(/<a href="https:\/\/www\.eothello\.com\/player\/\d*?">/, "").replace(/<\/a>/, "").trim();
    return [result[0], result[1]];
}
function getPlayerScores(str) {
    let result = str.match(/<div class="col-6">[\s\S]*?<\/div>/g);
    result[4] = result[4].replace("<div class=\"col-6\">", "").replace("</div>", "").trim();
    result[5] = result[5].replace("<div class=\"col-6\">", "").replace("</div>", "").trim();
    return [Number(result[4]), Number(result[5])];
}
function getMoves(str) {
    let result = str.match(/\[".*"\],/g);
    result[0] = result[0].replace("\"],", "\"]");
    return JSON.parse(result[0]);
}
function getGameType(str) {
    let result = str.match(/server_game\.initializeServerGame\([\s\S]*?,\s*?\[.*?\],\s*?"[\s\S]*?",\s*?"[\s\S]*?",\s*?\d/g);
    result[0] = result[0][result[0].length - 1];
    return Number(result[0]);
}
function getNo(str) {
    let result = str.match(/server_game\.initializeServerGame\([\s\S]*?,/g);
    result[0] = result[0].replace("server_game.initializeServerGame(", "").replace(",", "").trim();
    return Number(result[0]);
}
function generateLink() {
    let a = document.createElement("a");
    let blo = new Blob(["data=" + JSON.stringify(data)], {
        type: "application/json"
    });
    let bloURL = URL.createObjectURL(blo);
    a.href = bloURL;
    a.innerText = "click";
    a.download = "download";
    document.querySelector("body").appendChild(a);
}
function sortData() {
    data.sort(function (a, b) { return a.no - b.no + (b.moves.length - a.moves.length) * 0.001; });
}
function merge(additionalData) {
    data.push(...additionalData);
    sortData();
    target = data.length - 1;
    for (let i = 0; i < target; i++) {
        if (data[i].no == data[i + 1].no) {
            data.splice(i + 1, 1);
            i--;
            target--;
        }
    }
}