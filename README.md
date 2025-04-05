# eothello-db
This repository contains all the games played on eothello(https://www.eothello.com).

The JavaScript file named `db.js` includes a large array `data`, in which each element represents a game in the following format:
```javascript
{
  "no": [No. of the game],
  "type": [Type of the game],
  "players": [[Username of Black], [Username of White]],
  "scores": [[Elo score of Black], [Elo score of White]],
  "moves": [[1st move made by Black], [2nd move made by White], [3rd move made by Black], ..., [2nd last move], [the last move]]
}
```
