let board = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, -1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, -1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  
  board = [
    [0, -1, 0, -1, 0, -1, 0, -1, 0, -1],
    [-1, 0, -1, 0, -1, 0, -1, 0, -1, 0],
    [0, -1, 0, -1, 0, -1, 0, -1, 0, -1],
    [-1, 0, -1, 0, -1, 0, -1, 0, -1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
  ];
 

class Piece {
    constructor(row, col) {
        this.col = col;
        this.row = row;
    }
    compare(anotherPiece) {
        return anotherPiece.row == this.row && anotherPiece.col == this.col;
    }
}


let currentPlayer = 1
let findedFreePositions = [];
let readyToMove = null
billBoard()

function billBoard() {
    document.querySelector(".game").innerHTML = ""
    for(let row = 0; row < board.length; row++) {
        let rowDiv = document.createElement("div");
        rowDiv.setAttribute("class", "rowPiece")

        for(let col = 0; col < board.length; col++) {
            let columnDiv = document.createElement("div");
            let pieceType = null;
            console.log(board[row][col])
            board[row][col] == -1 ? pieceType = "black" :
            board[row][col] == 1 ? pieceType = "white" :
            board[row][col] == 0 ? pieceType = "empty" : pieceType = null;
            
            columnDiv.setAttribute("class", "piece")
            columnDiv.setAttribute("data-type", pieceType)
            columnDiv.setAttribute("data-position", `${row}-${col}`)
            columnDiv.setAttribute("row", row)
            columnDiv.setAttribute("col", col)

            columnDiv.addEventListener("click", movePiece)        
          rowDiv.append(columnDiv)
        }
        document.querySelector(".game").append(rowDiv)
    }
}


function movePiece(event) {
   let piece = event.target;
   let col = +piece.getAttribute("col");
   let row = +piece.getAttribute("row");
   let p  = new Piece(row, col);

  
   if(findedFreePositions.length > 0 && currentPlayer == 1) {
    enableToMove(p);
   }

   if(board[row][col] == currentPlayer && currentPlayer == 1) {
    findPosition(p)
   }

}




function enableToMove(piece) {
    let found = false;
    findedFreePositions.forEach(elem => {
        if(elem.compare(piece)) {
             found = true;
        }
    })

    
    if(found) {
        makeMove(piece)
    }
    else {
        findedFreePositions = []
        billBoard()
    }
}


function makeMove(pieceTo) {
let pieceFrom = readyToMove[0];
board[pieceFrom.row][pieceFrom.col] = 0
board[pieceTo.row][pieceTo.col] = currentPlayer
if(readyToMove[1]) {
    let pieceEnemy = readyToMove[1]
    board[pieceEnemy.row][pieceEnemy.col] = 0
}

let possibleMoves = getPossibleMove(currentPlayer, board)
if(possibleMoves.important && possibleMoves.moves.filter(elem => pieceTo.compare(elem.start)).length !== 0 && readyToMove[1]) {

}
else {
currentPlayer *= -1
enableToBotMove()
}

findedFreePositions = []
billBoard()
}



function findPosition(piece) {
let possibleMoves = getPossibleMove(currentPlayer, board)
possibleMoves.moves.forEach(move => {
    if(piece.compare(move.start)) {
        readyToMove = [piece, move.opponent]
        markPossibleStep(piece, move.finish)
    }
})
}


function markPossibleStep(piece, pieceFinish) {
   let elem = document.querySelector(`.piece[data-position="${pieceFinish.row}-${pieceFinish.col}"]`)
   findedFreePositions.push(pieceFinish)
   if(elem) {
    elem.style.background = "red"
   }
}



function getNumberOfChess(board) {
    return board.reduce((r, item) => {

        let res = item.reduce((res_row, piece) => {
            if(piece == -1)  res_row.black += 1
            else if(piece == 1)  res_row.white += 1
            return res_row;

        }, {white: 0, black: 0})
        
        r.white += res.white;
        r.black += res.black;
        return r;

    }, {white: 0, black: 0})

}

function getPossibleMove(player, board) {
  let moves = {important: false, moves: []}
  //moves[1 ... n] = {start: Class Piece (4,5), opponent: Class Piece (5,6), finish: Class Piece(6, 7) }

  let boardNew = [].concat(...board)
  let placeOfPiece = boardNew.reduce((r, item, index) => (item ==  player ? r.push([Math.floor(index/10), index%10]) : r, r), []) 
  
  let availableMoves  = placeOfPiece.map(position => {
    let piece = new Piece(position[0], position[1])
    let opponent = player * -1;
    let movesOfPiece = []

    try {
    if(board[piece.row - 1][piece.col + 1] == opponent &&
        board[piece.row - 2][piece.col + 2] == 0
    ) {
      movesOfPiece.push({start: piece, opponent: new Piece(piece.row - 1, piece.col + 1), finish: new Piece(piece.row - 2, piece.col + 2)})
    } 
   } catch (err){}

   try {
    if(board[piece.row - 1][piece.col - 1] == opponent &&
        board[piece.row - 2][piece.col - 2] == 0
    ) {
      movesOfPiece.push({start: piece, opponent: new Piece(piece.row - 1, piece.col - 1), finish: new Piece(piece.row - 2, piece.col - 2)})
    }
   } catch (err){}

   try {
    if(board[piece.row + 1][piece.col + 1] == opponent &&
        board[piece.row + 2][piece.col + 2] == 0
    ) {
      movesOfPiece.push({start: piece, opponent: new Piece(piece.row + 1, piece.col + 1), finish: new Piece(piece.row + 2, piece.col + 2)})
    }
   } catch (err){}
 
   try {
    if(board[piece.row + 1][piece.col - 1] == opponent &&
        board[piece.row + 2][piece.col - 2] == 0
    ) {
      movesOfPiece.push({start: piece, opponent: new Piece(piece.row + 1, piece.col - 1), finish: new Piece(piece.row + 2, piece.col - 2)})
    }
   } catch (err){}
//
   try {
    if(board[piece.row + opponent][piece.col - 1] === 0) {
        movesOfPiece.push({start: piece, finish: new Piece(piece.row + opponent, piece.col - 1)})
    }
   } catch(err) {}

   try {
    if(board[piece.row + opponent][piece.col + 1] === 0) {
        movesOfPiece.push({start: piece, finish: new Piece(piece.row + opponent, piece.col + 1)})
    }
   } catch(err) {}

   return movesOfPiece;
  })

  availableMoves = availableMoves.reduce((r,i) => r.concat(...i),[])

let obligatoryMoves  = availableMoves.filter(elem => elem.opponent)

if(obligatoryMoves.length > 0) {
    moves.important = true
    moves.moves = obligatoryMoves
    return moves
} 
else {
    moves.moves = availableMoves
    return moves
}   
}

function enableToBotMove() {
    let res = minimax(board, currentPlayer)
    
    setTimeout(() => {
        document.querySelector(`.piece[data-position="${res.index.finish.row}-${res.index.finish.col}"]`).style.background = "red"
    }, 500)
    setTimeout(() => {
       
         board[res.index.start.row][res.index.start.col] = 0
         board[res.index.finish.row][res.index.finish.col] = currentPlayer
         if(res.index.opponent) {
            board[res.index.opponent.row][res.index.opponent.col] = 0

         }
         billBoard()
         let getMoves = getPossibleMove(currentPlayer, board)
         if(getMoves.important && res.index.opponent) {
            enableToBotMove()
         }
         else {
            currentPlayer = currentPlayer * -1
         }
     
}, 1000)
}

function СountNumberOfMove(board) {
    let numberOfPiece = getNumberOfChess(board).white + getNumberOfChess(board).black
    if(numberOfPiece > 20) {
        return 3;
    }
    if(numberOfPiece > 15) {
        return 4;
    }
    if(numberOfPiece > 0) {
        return 5;
    }
}


let stepTEst = []
function minimax(localBoard, player, step=[]) {

localBoard = localBoard.map(elem => elem.slice())

let possibleMove = getPossibleMove(player, localBoard)

if(СountNumberOfMove(localBoard) < step.length) {
    return {score: -10}
}

if((getNumberOfChess(board).white - getNumberOfChess(localBoard).white >= 1) &&
(getNumberOfChess(board).black - getNumberOfChess(localBoard).black == 0)
) {

return {score: 20}
}

if((getNumberOfChess(board).black - getNumberOfChess(localBoard).black >= 1) &&
(getNumberOfChess(board).white - getNumberOfChess(localBoard).white == 0)
) {
return {score: -20}
}

if((getNumberOfChess(board).white - getNumberOfChess(localBoard).white) ==
(getNumberOfChess(board).black - getNumberOfChess(localBoard).black) &&
[1,2,3].includes((getNumberOfChess(board).white - getNumberOfChess(localBoard).white))
) {
return {score: 0}

}

 if(possibleMove.moves.length == 0 && player == -1) {
 return {score: -10}
}

 if(possibleMove.moves.length == 0 && player == 1) {
     return {score: 10}
 }



let moves = []
possibleMove.moves.forEach((item) => {
  let boardStep = localBoard.map(elem => elem.slice())
  let move = {}

  boardStep[item.start.row][item.start.col] = 0
  boardStep[item.finish.row][item.finish.col] = player
  if(item.opponent) {
    boardStep[item.opponent.row][item.opponent.col] = 0
  }
  let stepCopy = step.slice(0)
  stepCopy.push([item, player])

  let moveRepeat = getPossibleMove(player, localBoard)
  let result;
  if(moveRepeat.important && item.opponent) {
    result = minimax(boardStep, player, stepCopy)
  }
  else {
    result = minimax(boardStep, player*-1, stepCopy)
  }
  move.score = result.score;
  move.index = item
  
  moves.push(move)
})


var bestMove;
	if(player === -1) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = moves[i];
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = moves[i];
			}
		}
	}
	return bestMove


}


//Доработка
// + 1) создать функцию, для получения возможных ходов, которая будет возвращать объект из массива ходов, а также
//cвойство, являются ли эти ходы обязательными ( то есть бить противника)
// + 2) cоздать функцию, для показателя успеха, обычный вывод колл. шашек
// 3) создать функцию минимакс
// +) переделать текущие функции под функцию из пункта 1