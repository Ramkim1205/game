// 테트로미노es 배열에서 각 블록에 color 추가
const tetrominoes = [
    { shape: [[1, 1, 1], [0, 1, 0]], color: 'cyan' }, // T형 블록
    { shape: [[1, 1], [1, 1]], color: 'yellow' }, // O형 블록
    { shape: [[1, 1, 0], [0, 1, 1]], color: 'green' }, // S형 블록
    { shape: [[0, 1, 1], [1, 1, 0]], color: 'red' }, // Z형 블록
    { shape: [[1, 0, 0], [1, 1, 1]], color: 'orange' }, // L형 블록
    { shape: [[0, 0, 1], [1, 1, 1]], color: 'blue' }, // J형 블록
    { shape: [[1, 1, 1, 1]], color: 'purple' } // I형 블록
];

// 게임 상태 초기화
let currentTetromino = { shape: [], color: '' }; // 색상을 고정하기 위해 초기화
let currentPos = { x: 3, y: 0 }; // 블록이 시작되는 위치

let gameStarted = false;
let score = 0;
let interval;

const rows = 20; // 게임 보드의 세로 크기
const cols = 10; // 게임 보드의 가로 크기

// 보드 배열 초기화
let board = Array.from({ length: rows }, () => Array(cols).fill(0)); // 0: 비어있음, 1: 블록 있음

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
    currentPos = { x: 3, y: 0 }; // 첫 블록을 화면 상단 중앙에 위치
    currentTetromino = tetrominoes[Math.floor(Math.random() * tetrominoes.length)]; // 첫 블록 설정
    interval = setInterval(moveTetrominoDown, 500); // 500ms마다 블록을 한 칸씩 내려옴
    drawTetromino();  // 첫 번째 블록을 보드에 그려줍니다.
}

// 게임 보드 그리기
function drawBoard() {
    const boardElement = document.getElementById("board");
    let children = boardElement.children;

    // board 배열을 순회하면서 색상 적용
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (board[row][col] === 1) {
                // 블록이 있는 곳은 그 고유 색상으로 표시
                children[row * cols + col].style.backgroundColor = currentTetromino.color;
            } else {
                // 빈 칸은 하늘색
                children[row * cols + col].style.backgroundColor = '#87CEEB';
            }
        }
    }
    updateScore(); // 점수 업데이트
}

// 점수 업데이트
function updateScore() {
    document.getElementById('score').innerText = `Score: ${score}`;
}

// 테트로미노 그리기
function drawTetromino() {
    const boardElement = document.getElementById("board");
    let children = boardElement.children;

    // board 배열을 순회하면서 색상 적용
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (board[row][col] === 1) {
                // children에서 해당 위치의 div를 찾고 색상 적용
                children[row * cols + col].style.backgroundColor = currentTetromino.color;
            } else {
                // 빈 칸은 하늘색
                children[row * cols + col].style.backgroundColor = '#87CEEB';
            }
        }
    }
    updateScore(); // 점수 업데이트
}

// 블록을 한 칸 내려주는 함수
function moveTetrominoDown() {
    currentPos.y++; // y값 증가 (블록이 내려가도록)

    // 충돌이 발생하면 고정하고 새 블록 생성
    if (isCollision() || checkGameOver()) {
        fixTetromino();
        currentPos = { x: 3, y: 0 }; // 블록을 다시 시작 위치로 초기화
        currentTetromino = tetrominoes[Math.floor(Math.random() * tetrominoes.length)]; // 새로운 블록 생성
    }
    drawTetromino(); // 블록 그리기
}

// 충돌 체크 함수
function isCollision() {
    for (let row = 0; row < currentTetromino.shape.length; row++) {
        for (let col = 0; col < currentTetromino.shape[row].length; col++) {
            if (currentTetromino.shape[row][col] === 1) {
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
    // 블록을 board 배열에 고정
    for (let row = 0; row < currentTetromino.shape.length; row++) {
        for (let col = 0; col < currentTetromino.shape[row].length; col++) {
            if (currentTetromino.shape[row][col] === 1) {
                // 유효한 위치에만 블록을 고정
                if (currentPos.y + row >= 0 && currentPos.y + row < rows && currentPos.x + col >= 0 && currentPos.x + col < cols) {
                    board[currentPos.y + row][currentPos.x + col] = 1;
                }
            }
        }
    }

    // 새 테트로미노 생성
    currentTetromino = tetrominoes[Math.floor(Math.random() * tetrominoes.length)];
    currentPos = { x: 3, y: 0 }; // 블록 위치 초기화

    // 가득 찬 줄 삭제
    clearFullLines();
}

// 줄 삭제 처리
function clearFullLines() {
    for (let row = rows - 1; row >= 0; row--) {
        if (board[row].every(cell => cell === 1)) {
            // 가득 찬 줄 삭제
            board.splice(row, 1);
            board.unshift(Array(cols).fill(0)); // 맨 위에 빈 줄 추가
            score += 10; // 점수 증가
        }
    }
    drawTetromino(); // 화면 업데이트
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
    const rotatedTetromino = currentTetromino.shape[0].map((_, index) =>
        currentTetromino.shape.map(row => row[index])
    ).reverse();

    currentTetromino.shape = rotatedTetromino;
    if (isCollision()) {
        currentTetromino.shape = rotatedTetromino.reverse(); // 회전 불가하면 원래 모양으로 되돌림
    }
    drawTetromino();
}

// 게임 오버 체크
function checkGameOver() {
    // 블록이 상단에 닿았을 때
    for (let col = 0; col < currentTetromino.shape[0].length; col++) {
        if (board[0][currentPos.x + col] === 1) {
            alert("Game Over");
            clearInterval(interval); // 게임 종료
            return true;
        }
    }
    return false;
}

// 게임 보드의 div 생성
function initializeBoard() {
    const boardElement = document.getElementById("board");
    boardElement.innerHTML = ''; // 이전에 그린 보드 초기화

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const block = document.createElement("div");
            block.classList.add("block");
            block.style.backgroundColor = '#87CEEB';  // 초기 하늘색 배경
            boardElement.appendChild(block);
        }
    }
}

// 게임 시작 시 초기화 함수 호출
initializeBoard();  // 보드의 div 요소를 미리 생성
