var gameOn = true;
var score = 0;
window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);
document.onkeydown = function(e) {
    e = e || window.event;
    let gameBoard = readGameBoard();
    if (e.keyCode == 38) {
        console.log("UP");
        console.log(gameBoard);
        gameBoard = move("up", gameBoard);
        renderBoard(gameBoard);
    } else if (e.keyCode == 39) {
        console.log("RIGHT");
        gameBoard = move("right", gameBoard);
        renderBoard(gameBoard);
    } else if (e.keyCode == 40) {
        console.log("DOWN");
        gameBoard = move("down", gameBoard);
        renderBoard(gameBoard);
    } else if (e.keyCode == 37) {
        console.log("LEFT");
        gameBoard = move("left", gameBoard);
        renderBoard(gameBoard);
    }
    renderWithColor(gameBoard);

    // renderBoard(gameBoard);
}

function move(direction, gameBoard) {
    if (direction == "down") {
        var succ = moveDown(gameBoard);
        if (succ) {
            putRandomTile(gameBoard);
        }
        return gameBoard;
    } else if (direction == "right") {
        gameBoard = rotate(gameBoard, 1);
        var succ = moveDown(gameBoard);
        if (succ) {
            putRandomTile(gameBoard);
        }
        gameBoard = rotate(gameBoard, 3);
        return gameBoard;
    } else if (direction == "up") {
        gameBoard = rotate(gameBoard, 2);
        var succ = moveDown(gameBoard);
        if (succ) {
            putRandomTile(gameBoard);
        }
        gameBoard = rotate(gameBoard, 2);
        return gameBoard;
    } else if (direction == "left") {
        gameBoard = rotate(gameBoard, 3);
        var succ = moveDown(gameBoard);
        if (succ) {
            putRandomTile(gameBoard);
        }
        gameBoard = rotate(gameBoard, 1);
        return gameBoard;
    }
}

function start() {
    // init gameBoard
    let gameBoard = [
        [],
        [],
        [],
        []
    ];
    for (var x = 0; x < 4; x++) {
        for (var y = 0; y < 4; y++) {
            gameBoard[x].push(0);
        }
    }

    // put 2 random tiles
    var rand_tile_1 = randomTile(gameBoard);
    var rand_tile_2 = randomTile(gameBoard);
    while (rand_tile_1 == rand_tile_2) {
        rand_tile_2 = randomTile(gameBoard);
    }

    gameBoard[Math.floor(rand_tile_1 / 4)][rand_tile_1 % 4] = 2;
    gameBoard[Math.floor(rand_tile_2 / 4)][rand_tile_2 % 4] = 2;

    // renderBoard(gameBoard);
    renderWithColor(gameBoard);

    gameOn = true;
}

function getEmptyTitle(gameBoard) {
    let emptyTiles = [];
    for (var x = 0; x < 4; x++) {
        for (var y = 0; y < 4; y++) {
            if (gameBoard[x][y] == 0) {
                emptyTiles.push(x * 4 + y);
            }
        }
    }
    return emptyTiles;
}

function putRandomTile(gameBoard) {
    var tile = randomTile(gameBoard);
    gameBoard[Math.floor(tile / 4)][tile % 4] = 2;
}

function readGameBoard() {
    let gameBoard = [
        [],
        [],
        [],
        []
    ];
    for (var x = 0; x < 4; x++) {
        for (var y = 0; y < 4; y++) {
            gameBoard[x][y] = parseInt(document.getElementById("t-" + (x + 1) + "-" + (y + 1)).innerHTML);
        }
    }
    return gameBoard;
}

function randomTile(gameBoard) {
    let emptyTiles = getEmptyTitle(gameBoard);
    return emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
}

function renderBoard(gameBoard) {
    for (var x = 0; x < 4; x++) {
        for (var y = 0; y < 4; y++) {
            document.getElementById("t-" + (x + 1) + "-" + (y + 1)).innerHTML = gameBoard[x][y];
        }
    }
}

function renderWithColor(gameBoard) {
    for (var x = 0; x < 4; x++) {
        for (var y = 0; y < 4; y++) {
            var div = document.getElementById("t-" + (x + 1) + "-" + (y + 1));
            div.innerHTML = gameBoard[x][y];
            div.className = "color-for-" + gameBoard[x][y];
        }
    }
    // render score
    document.getElementById("score").innerHTML = "score: " + score;
    document.getElementById("max").innerHTML = "max: " + getMax(gameBoard);
}

function moveDown(board) {
    if (!canMoveDown) {
        return false;
    }
    for (var c = 0; c < board[0].length; c++) {
        var zero = -1; //0 if we looped past a 0, 1 if tiles combined
        var curr = -1; //current tile value
        var currInd = board.length; //index of current tile location
        for (var r = board.length - 1; r >= 0; r--) {
            if (zero == 0) {
                if (board[r][c] == 0) { //skips 0s if we previously looped past a 0
                    continue;
                }
                if (board[r][c] != curr) { //moves tiles past 0s
                    board[--currInd][c] = board[r][c];
                    board[r][c] = 0;
                    curr = board[currInd][c];
                    zero = 0;
                } else { //means that the tile before 0s is same as current
                    score += board[currInd--][c] *= 2;
                    curr = -1;
                    board[r][c] = 0;
                    zero = 1; //originally as 1 is zero as result of moving and real 0, 1means cannot combine
                }
            } else if (zero == 1) { //always will move tile after combine
                curr = board[currInd][c] = board[r][c];
                board[r][c] = 0;
                zero = 0;
            } else if (board[r][c] == 0) { //loop past first zero in sequence
                zero = 0;
            } else {
                if (board[r][c] == curr) { //if two adjacent tiles are equal
                    score += board[currInd][c] *= 2;
                    board[r][c] = 0;
                    curr = -1;
                    zero = 0;
                } else {
                    currInd--;
                    curr = board[r][c];
                }
            }
        }

    }
    return true;
}

function canMoveDown(board) {
    for (var c = 0; c < board[0].length; c++) {
        var zero = -1; //0 if we looped past a 0
        var curr = -1; //to keep track of current tile value unless 0

        for (var r = board.length - 1; r >= 0; r--) {
            if (zero != 0) {
                if (board[r][c] == 0) { //if we loop past a 0
                    zero = 0;
                } else {
                    if (board[r][c] == curr) { //if we can combine two tiles
                        return true;
                    }
                    curr = board[r][c];
                }
            } else {
                if (board[r][c] != 0) { //only when we looped past a 0, means this tile can be moved 
                    return true;
                }
            }
        }
    }
}

function rotate(gameBoard, num) {
    for (var i = 0; i < num; i++) {
        gameBoard = rotateClockwise(gameBoard);
    }
    return gameBoard;
}

function rotateClockwise(gameBoard) {
    var newBoard = new Array(4);
    for (var i = 0; i < 4; i++) {
        newBoard[i] = new Array(4);
    }

    for (var j = 0; j < 4; j++) {
        for (var k = 0; k < 4; k++) {
            // console.log(gameBoard);
            newBoard[k][4 - 1 - j] = gameBoard[j][k];
        }
    }

    return newBoard;
}

function getMax(gameBoard) {
    var max = 2;
    for (var j = 0; j < 4; j++) {
        for (var k = 0; k < 4; k++) {
            if (gameBoard[j][k] > max) {
                max = gameBoard[j][k];
            }
        }
    }
    return max;
}