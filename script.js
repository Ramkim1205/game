// 게임 상태 초기화 (전역 변수로 선언)
let currentPos = { x: 3, y: 0 }; // 블록이 시작되는 위치
let currentTetromino = tetrominoes[0]; // 기본적으로 T형 블록

let gameStarted = false;
let score = 0;
let interval;

// 게임 시작 버튼 클릭 이벤트
document.getElementById('start-button').addEventListener('click', () => {
    if (!gameStarted) {
        gameStarted = true;
        alert('Game Started!');
        startGame();
    }
});

// 게임 시작 함수
function startGame() {
    interval = setInterval(moveTetrominoDown, 500); // 500ms마다 블록을 한 칸씩 내려옴
}

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
    updateScore();
}

// 점수 업데이트
function updateScore() {
    document.getElementById('score').innerText = `Score: ${score}`;
}

// 테트로미노 그리기
function drawTetromino() {
    for (let row = 0; row < currentTetromino.length; row++) {
        for (let col = 0; col < currentTetromino[row].length; col++) {
            if (currentTetromino[row][col] === 1) {
                board[currentPos.y + row][currentPos.x + col] = 1;
            }
        }
    }
    drawBoard(); // 보드 그리기
}

// 블록을 한 칸 내려주는 함수
function moveTetrominoDown() {
    currentPos.y++;
    if (isCollision()) {
        fixTetromino();
        currentPos = { x: 3, y: 0 }; // 블록을 다시 시작 위치로
        currentTetromino = tetrominoes[Math.floor(Math.random() * tetrominoes.length)]; // 새로운 블록 생성
    }
    drawTetromino(); // 블록 그리기
}

// 충돌 체크 함수
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

// 블록 고정 함수
function fixTetromino() {
    for (let row = 0; row < currentTetromino.length; row++) {
        for (let col = 0; col < currentTetromino[row].length; col++) {
            if (currentTetromino[row][col] === 1) {
                board[currentPos.y + row][currentPos.x + col] = 1;
            }
        }
    }
    clearFullLines(); // 가득 찬 줄 삭제
}

// 줄 삭제 처리
function clearFullLines() {
    for (let row = rows - 1; row >= 0; row--) {
        if (board[row].every(cell => cell === 1)) {
            board.splice(row, 1); // 줄 삭제
            board.unshift(Array(cols).fill(0)); // 맨 위에 빈 줄 추가
            score += 10; // 점수 증가
        }
    }
    drawBoard();
}

// 키 입력 처리
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

// 왼쪽으로 블록 이동
function moveTetrominoLeft() {
    currentPos.x--;
    if (isCollision()) currentPos.x++; // 충돌 시 원위치
    drawTetromino();
}

// 오른쪽으로 블록 이동
function moveTetrominoRight() {
    currentPos.x++;
    if (isCollision()) currentPos.x--; // 충돌 시 원위치
    drawTetromino();
}

// 블록 회전
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

// 게임 오버 체크
function checkGameOver() {
    if (isCollision() && currentPos.y === 0) {
        alert('Game Over');
        clearInterval(interval); // 게임 중단
    }
}
