# eothello-db
This repository contains all the games played on eothello(https://www.eothello.com).

The JavaScript file named `db.js` includes a large array `data`, in which each element represents a game.
## Sample
```javascript
{
    "no": 2699489,
    //no: # of the game, e.g. https://www.eothello.com/game/2699489
    "type": 3,
    //type: 1 = anti reversi, 2 = grand , 3 = octagon. Omitted when game type is standard.
    "players": ["scooby5463", "ssaarraa"],
    //players: [black player, white player]
    "elos": [1240, 1121],
    //players: [elo rating of black, elo rating of black]
    "moves": ["d5", "f4", "g5", "d6", "d7", "e7", "f7", "g7", "g6"],
    //moves: Only coords here; passes are not recorded
    "status": "White timed out"
    //status: "Black/White timed out", "Black/White resigned". Omitted when the game is finished normally.
}
```
