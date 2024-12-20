document.getElementById('start-button').addEventListener('click', () => {
    alert('Game Started!');
});

const rows = 20;
const cols = 10;
let board = Array.from({ length: rows }, () => Array(cols).fill(0)); // 0: 비어있음, 1: 블록 있음

// 게임 보드 그리기
function drawBoard() {
    const boardElement = document.getElementById("board");
    boardElement.innerHTML = ''; // 이전에 그린 보드 비우기
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const block = document.createElement("div");
            block.classList.add("block");
            if (board[row][col] === 1) {
                block.style.backgroundColor = 'blue'; // 블록이 있으면 파란색으로 표시
            }
            boardElement.appendChild(block);
        }
    }
}

// 초기화
drawBoard();

const tetrominoes = [
    [[1, 1, 1], [0, 1, 0]], // T형 블록
    [[1, 1], [1, 1]], // O형 블록
    [[1, 1, 0], [0, 1, 1]], // S형 블록
    [[0, 1, 1], [1, 1, 0]], // Z형 블록
    [[1, 0, 0], [1, 1, 1]], // L형 블록
    [[0, 0, 1], [1, 1, 1]], // J형 블록
    [[1, 1, 1, 1]] // I형 블록
];

// 새로운 블록 생성
let currentTetromino = tetrominoes[0]; // 기본적으로 T형 블록
let currentPos = { x: 3, y: 0 }; // 블록이 시작되는 위치

function drawTetromino() {
    for (let row = 0; row < currentTetromino.length; row++) {
        for (let col = 0; col < currentTetromino[row].length; col++) {
            if (currentTetromino[row][col] === 1) {
                board[currentPos.y + row][currentPos.x + col] = 1;
            }
        }
    }
    drawBoard();
}

// 초기 테트로미노 그리기
drawTetromino();

function moveTetrominoDown() {
    currentPos.y++;
    if (isCollision()) {
        // 충돌시, 블록을 고정하고 새로운 블록을 생성
        fixTetromino();
        currentPos = { x: 3, y: 0 };
        currentTetromino = tetrominoes[Math.floor(Math.random() * tetrominoes.length)];
    }
    drawTetromino();
}

// 충돌 체크
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
    // 줄 삭제 처리 (추가 필요)
}

setInterval(moveTetrominoDown, 500); // 500ms마다 블록을 한 칸씩 내려옴

function rotateTetromino() {
    const rotatedTetromino = currentTetromino[0].map((_, index) =>
        currentTetromino.map(row => row[index])
    ).reverse();

    currentTetromino = rotatedTetromino;
    if (isCollision()) {
        currentTetromino = rotatedTetromino.reverse(); // 회전 불가하면 원래 모양으로 되돌림
    }
    drawTetromino();
}

function clearFullLines() {
    for (let row = rows - 1; row >= 0; row--) {
        if (board[row].every(cell => cell === 1)) {
            board.splice(row, 1); // 줄 삭제
            board.unshift(Array(cols).fill(0)); // 맨 위에 빈 줄 추가
        }
    }
    drawBoard();
}

function checkGameOver() {
    if (isCollision()) {
        alert('Game Over');
        clearInterval(interval); // 게임 중단
    }
}
