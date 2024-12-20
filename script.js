let gameStarted = false;
let score = 0;
let interval;

document.getElementById('start-button').addEventListener('click', () => {
    if (!gameStarted) {
        gameStarted = true;
        alert('Game Started!');
        startGame();
    }
});

function startGame() {
    interval = setInterval(moveTetrominoDown, 500);
}

function drawBoard() {
    const boardElement = document.getElementById("board");
    boardElement.innerHTML = '';
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const block = document.createElement("div");
            block.classList.add("block");
            if (board[row][col] === 1) {
                block.style.backgroundColor = 'blue';
            }
            boardElement.appendChild(block);
        }
    }
    updateScore();
}

function moveTetrominoDown() {
    currentPos.y++;
    if (isCollision()) {
        fixTetromino();
        currentPos = { x: 3, y: 0 };
        currentTetromino = tetrominoes[Math.floor(Math.random() * tetrominoes.length)];
    }
    drawTetromino();
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        moveTetrominoLeft();
    } else if (event.key === 'ArrowRight') {
        moveTetrominoRight();
    } else if (event.key === 'ArrowUp') {
        rotateTetromino();
    } else if (event.key === 'ArrowDown') {
        moveTetrominoDown();
    }
});

function moveTetrominoLeft() {
    currentPos.x--;
    if (isCollision()) currentPos.x++;
    drawTetromino();
}

function moveTetrominoRight() {
    currentPos.x++;
    if (isCollision()) currentPos.x--;
    drawTetromino();
}

function rotateTetromino() {
    const rotatedTetromino = currentTetromino[0].map((_, index) =>
        currentTetromino.map(row => row[index])
    ).reverse();

    currentTetromino = rotatedTetromino;
    if (isCollision()) {
        currentTetromino = rotatedTetromino.reverse();
    }
    drawTetromino();
}

function isCollision() {
    for (let row = 0; row < currentTetromino.length; row++) {
        for (let col = 0; col < currentTetromino[row].length; col++) {
            if (currentTetromino[row][col] === 1) {
                if (
                    currentPos.y + row >= rows ||
                    currentPos.x + col < 0 ||
                    currentPos.x + col >= cols ||
                    board[currentPos.y + row][currentPos.x + col] === 1
                ) {
                    return true;
                }
            }
        }
    }
    return false;
}

function fixTetromino() {
    for (let row = 0; row < currentTetromino.length; row++) {
        for (let col = 0; col < currentTetromino[row].length; col++) {
            if (currentTetromino[row][col] === 1) {
                board[currentPos.y + row][currentPos.x + col] = 1;
            }
        }
    }
    clearFullLines();
}

function clearFullLines() {
    for (let row = rows - 1; row >= 0; row--) {
        if (board[row].every(cell => cell === 1)) {
            board.splice(row, 1);
            board.unshift(Array(cols).fill(0));
            score += 10;
        }
    }
    drawBoard();
}

function updateScore() {
    document.getElementById('score').innerText = `Score: ${score}`;
}

function checkGameOver() {
    if (isCollision() && currentPos.y === 0) {
        alert('Game Over');
        clearInterval(interval);
    }
}
