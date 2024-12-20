const board = document.getElementById("game-board");
const resetButton = document.getElementById("reset-button");

const gridSize = 8; // 8x8 격자
let tiles = []; // 타일 배열
let selectedTile = null;

// 타일 이미지 또는 텍스트 설정 (여기서는 숫자로 사용)
const tileImages = ['🍎', '🍌', '🍒', '🍓', '🍇', '🍍', '🍉', '🍊'];

function createBoard() {
    tiles = [];
    // 타일 배열 생성 (짝을 맞춰서 타일을 두 개씩 넣기)
    const totalTiles = gridSize * gridSize;
    const tilePairs = [...tileImages, ...tileImages]; // 타일 이미지 두 개씩
    const shuffledTiles = shuffle(tilePairs);

    // 타일을 2차원 배열로 변환
    for (let row = 0; row < gridSize; row++) {
        tiles[row] = [];
        for (let col = 0; col < gridSize; col++) {
            const tile = {
                id: row * gridSize + col,
                image: shuffledTiles.pop(),
                matched: false
            };
            tiles[row].push(tile);
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

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // 배열 항목을 섞기
    }
    return array;
}

function handleTileClick(event) {
    const clickedTile = event.target;
    const row = clickedTile.dataset.row;
    const col = clickedTile.dataset.col;

    if (selectedTile) {
        // 두 번째 타일 선택
        if (tiles[row][col].image === tiles[selectedTile.row][selectedTile.col].image) {
            // 일치하면 매칭 처리
            tiles[row][col].matched = true;
            tiles[selectedTile.row][selectedTile.col].matched = true;
            clickedTile.style.backgroundColor = "green";
            document.querySelector(`[data-row='${selectedTile.row}'][data-col='${selectedTile.col}']`).style.backgroundColor = "green";
            selectedTile = null;
        } else {
            // 일치하지 않으면 원래 상태로 돌리기
            setTimeout(() => {
                clickedTile.style.backgroundColor = "";
                document.querySelector(`[data-row='${selectedTile.row}'][data-col='${selectedTile.col}']`).style.backgroundColor = "";
                selectedTile = null;
            }, 500);
        }
    } else {
        // 첫 번째 타일 선택
        selectedTile = { row, col };
    }
}

function resetGame() {
    board.innerHTML = '';
    createBoard();
}

resetButton.addEventListener('click', resetGame);

createBoard(); // 게임 보드 생성
