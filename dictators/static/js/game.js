var roomCode = document.getElementById("game_board").getAttribute("room_code");
var char_choice = document.getElementById("game_board").getAttribute("char_choice");

var connectionString = 'ws://' + window.location.host + '/ws/play/' + roomCode + '/';
var gameSocket = new WebSocket(connectionString);
// Game board for maintaing the state of the game
// var gameBoard = [
//     -1, -1, -1,
//     -1, -1, -1,
//     -1, -1, -1,
// ];

let gameBoard = []

// Winning indexes.
winIndices = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]
let moveCount = 0; //Number of moves done
let myturn = true; // Boolean variable to get the turn of the player.

// Add the click event listener on every block.
let elementArray = document.getElementsByClassName('square');
for (var i = 0; i < elementArray.length; i++){
    elementArray[i].addEventListener("click", event=>{
        const index = event.target.getAttribute('data-index');
        if(gameBoard[index] == -1){
            if(!myturn){
                alert("Wait for other to place the move")
            }
            else{
                myturn = false;
                document.getElementById("alert_move").style.display = 'none'; // Hide
                make_move(index, char_choice);
            }
        }
    })
}

// Make a move
function make_move(index, player){
    console.log('this is game board', gameBoard)

    index = parseInt(index);
    let data = {
        "event": "MOVE",
        "message": {
            "index": index,
            "player": player
        }
    }

    if(gameBoard[index] == -1){
        // if the valid move, update the gameboard
        // state and send the move to the server.
        moveCount++;
        if(player == 'X')
            gameBoard[index] = 1;
        else if(player == 'O')
            gameBoard[index] = 0;
        else{
            alert("Invalid character choice");
            return false;
        }
        gameSocket.send(JSON.stringify(data))
    }
    // place the move in the game box.
    elementArray[index].innerHTML = player;
    // check for the winner
    const win = checkWinner();
    if(myturn){
        // if player winner, send the END event.
        if(win){
            data = {
                "event": "END",
                "message": `${player} is a winner. Play again?`
            }
            gameSocket.send(JSON.stringify(data))
        }
        else if(!win && moveCount == 9){
            data = {
                "event": "END",
                "message": "It's a draw. Play again?"
            }
            gameSocket.send(JSON.stringify(data))
        }
    }
}

// function to reset the game.
function reset(){
    // gameBoard = [
    //     -1, -1, -1,
    //     -1, -1, -1,
    //     -1, -1, -1,
    // ];
    moveCount = 0;
    myturn = true;
    document.getElementById("alert_move").style.display = 'inline';
    for (var i = 0; i < elementArray.length; i++){
        elementArray[i].innerHTML = "";
    }
}

// check if their is winning move
const check = (winIndex) => {
    if (
      gameBoard[winIndex[0]] !== -1 &&
      gameBoard[winIndex[0]] === gameBoard[winIndex[1]] &&
      gameBoard[winIndex[0]] === gameBoard[winIndex[2]]
    )   return true;
    return false;
};

// function to check if player is winner.
function checkWinner(){
    let win = false;
    if (moveCount >= 5) {
      winIndices.forEach((w) => {
        if (check(w)) {
          win = true;
          windex = w;
        }
      });
    }
    return win;
}

const tick = () => {

}

// Main function which handles the connection
// of websocket.
function connect() {
    gameSocket.onopen = function open(event) {
        console.log('WebSockets connection created.');
        // on websocket open, send the START event.
        gameSocket.send(JSON.stringify({
            "event": "START",
            "message": ""
        }));
    };

    gameSocket.onclose = function (e) {
        console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
        setTimeout(function () {
            connect();
        }, 1000);
    };
    // Sending the info about the room
    gameSocket.onmessage = function (e) {
        // On getting the message from the server
        // Do the appropriate steps on each event.
        console.log('on message event', e)
        let data = JSON.parse(e.data);
        data = data["payload"];
        let message = data['message'];
        let event = data["event"];
        switch (event) {
            case "START":
                reset();
                break;
            case "END":
                alert(message);
                reset();
                break;
            case "MOVE":
                if(message["player"] !== char_choice){
                    make_move(message["index"], message["player"])
                    myturn = true;
                    document.getElementById("alert_move").style.display = 'inline';
                }
                break;
            case "GAME_BOARD":
                gameBoard = message;
                break;
            case "TICK":
                console.log(message);
                break;
            default:
                console.log("No event")
        }
    };

    if (gameSocket.readyState === WebSocket.OPEN) {
        gameSocket.onopen();
    }
}

//call the connect function at the start.
connect();