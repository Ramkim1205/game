const board = document.getElementById("game-board");
const resetButton = document.getElementById("reset-button");

const gridSize = 8; // 8x8 격자
let tiles = []; // 타일 배열
let selectedTile = null; // 첫 번째 타일을 선택한 변수

// 타일 이미지 또는 텍스트 설정 (여기서는 이모지로 사용)
const tileImages = ['🍎', '🍌', '🍒', '🍓', '🍇', '🍍', '🍉', '🍊'];

// 타일을 랜덤하게 배열하기 위한 함수
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // 배열 항목을 섞기
    }
    return array;
}

// 게임 보드 생성
function createBoard() {
    tiles = [];
    const totalTiles = gridSize * gridSize;
    const tilePairs = [...tileImages, ...tileImages]; // 타일 이미지 두 개씩
    const shuffledTiles = shuffle(tilePairs); // 랜덤하게 섞은 타일들

    // 타일 배열 생성 (2D 배열로 변환)
    for (let row = 0; row < gridSize; row++) {
        tiles[row] = [];
        for (let col = 0; col < gridSize; col++) {
            const tile = {
                id: row * gridSize + col,
                image: shuffledTiles.pop(),
                matched: false // 매칭된 타일인지 여부
            };
            tiles[row].push(tile);

            // 타일 요소 생성
            const tileElement = document.createElement("div");
            tileElement.classList.add("tile");
            tileElement.textContent = tile.image;
            tileElement.dataset.row = row;
            tileElement.dataset.col = col;
            tileElement.addEventListener("click", handleTileClick);
            board.appendChild(tileElement);
        }
    }
}

// 타일 클릭 처리 함수
function handleTileClick(event) {
    const clickedTile = event.target;
    const row = clickedTile.dataset.row;
    const col = clickedTile.dataset.col;

    // 이미 매칭된 타일을 클릭하면 아무 일도 일어나지 않도록
    if (tiles[row][col].matched) return;

    // 첫 번째 타일 선택
    if (!selectedTile) {
        selectedTile = { row, col };
        clickedTile.style.backgroundColor = "lightgray"; // 첫 번째 타일은 색 변경
    } else {
        // 두 번째 타일 선택
        const firstTile = tiles[selectedTile.row][selectedTile.col];
        const secondTile = tiles[row][col];

        // 두 타일이 일치하면 제거
        if (firstTile.image === secondTile.image) {
            firstTile.matched = true;
            secondTile.matched = true;

            // 두 타일 제거
            document.querySelector(`[data-row='${selectedTile.row}'][data-col='${selectedTile.col}']`).style.backgroundColor = "green";
            clickedTile.style.backgroundColor = "green";

            // 선택 초기화
            selectedTile = null;

            // 게임이 끝났는지 확인
            checkGameOver();
        } else {
            // 두 타일이 일치하지 않으면 색 원래대로 복구
            setTimeout(() => {
                document.querySelector(`[data-row='${selectedTile.row}'][data-col='${selectedTile.col}']`).style.backgroundColor = "";
                clickedTile.style.backgroundColor = "";
                selectedTile = null;
            }, 500);
        }
    }
}

// 게임 종료 체크
function checkGameOver() {
    const matchedTiles = tiles.flat().filter(tile => tile.matched);
    if (matchedTiles.length === tiles.length) {
        alert("게임 완료!");
        clearInterval(interval); // 게임 종료
    }
}

// 게임 초기화
function resetGame() {
    board.innerHTML = '';
    createBoard();
}

resetButton.addEventListener('click', resetGame);

// 게임 시작
createBoard();
