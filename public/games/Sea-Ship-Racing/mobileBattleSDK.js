let player_id;

window.addEventListener(
  "message",
  (event) => {
    if (event.data && event.data.type == "game.init") {
      player_id = event.data.player_id;
    }
  },
  false
);

function onScore(score) {
  if (player_id) {
    parent.postMessage(
      {
        type: "score",
        body: {
          player_id,
          score,
        },
      },
      "*"
    );
  } else {
    console.log("player_id error!");
  }
}

function onGameOver(score) {
  console.log("Game Over");
  if (player_id) {
    parent.postMessage(
      {
        type: "gameOver",
        body: {
          player_id,
          score,
        },
      },
      "*"
    );
  } else {
    console.log("player_id error!");
  }
}

function onGameStart() {
  console.log("Game Start");
  if (player_id) {
    parent.postMessage(
      {
        type: "gameStart",
        body: {
          player_id,
        },
      },
      "*"
    );
  } else {
    console.log("player_id error!");
  }
}

function onGameInit() {
  console.log("Game Init");
  if (player_id) {
    parent.postMessage(
      {
        type: "gameInit",
        body: {
          player_id,
        },
      },
      "*"
    );
  } else {
    console.log("player_id error!");
  }
}

function onGameEnd() {
  console.log("Game End");
  if (player_id) {
    parent.postMessage(
      {
        type: "gameEnd",
        body: {
          player_id,
        },
      },
      "*"
    );
  } else {
    console.log("player_id error!");
  }
}

function onGameRestart() {
  console.log("Game Restart");
  if (player_id) {
    parent.postMessage(
      {
        type: "gameRestart",
        body: {
          player_id,
        },
      },
      "*"
    );
  } else {
    console.log("player_id error!");
  }
}
