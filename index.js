// Point: [int, int]
// Board: Array[Point]

const getNeighbors = ([x, y]) => [
  [x - 1, y - 1], [x, y - 1], [x + 1, y - 1],
  [x - 1, y], /*            */ [x + 1, y],
  [x - 1, y + 1], [x, y + 1], [x + 1, y + 1]
]

const getAliveNeighborsCount = (board, p) => {
  const neighbors = getNeighbors(p)
  return neighbors.map(([xn, yn]) =>
    board.find(([xb, yb]) => xn === xb && yn === yb)
  ).filter(x => x !== undefined).length
}

const getDeadNeighbors = (board, p) => {
  const neighbors = getNeighbors(p)
  return neighbors.map(([xn, yn]) =>
    (board.find(([xb, yb]) => xn === xb && yn === yb) === undefined
      ? [xn, yn]
      : undefined
    )
  ).filter(x => x !== undefined)
}

const parseBoard = (input) => input
  .split('\n')
  .map((row, y) => row
    .split('')
    .reduce((acc, col, x) => col === 'x' ? [...acc, [x, y]] : acc,
      [])
  ).reduce((acc, x) => acc.concat(x), [])

const evolve = (board) => cleanboard(board
  .reduce(
    (acc, cell) => {
      const cellNeighborCount = getAliveNeighborsCount(board, cell)
      return [
        ...acc,
        ...cellNeighborCount === 3 || cellNeighborCount === 2 ? [cell] : [],
        ...(
          getDeadNeighbors(board, cell)
          .reduce((acc, pd) =>
            getAliveNeighborsCount(board, pd) === 3 ? [...acc, pd] : acc, []
          )
        )
      ]
      // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
    }
    , [])
)

const renderToStr = (board) => {
  // What happens when we have negative x's and y's?
  const ys = board.map(([x, y]) => y)
  const maxY = Math.max(...ys)
  return Array
    .apply(null, {length: maxY + 1})
    .map((_, y) => {
      const row = board.filter(([xb, yb]) => yb === y)
      const xs = row.map(([xr, yr]) => xr)
      const maxX = Math.max(...xs)
      return Array
        .apply(null, {length: maxX + 1})
        .map((_, x) => xs.find(xr => xr === x) === undefined ? ' ' : 'x')
        .join('')
    }
    ).join('\n')
}

const b1 = parseBoard(`
                  xx
                 x   x
 xx             x     x
 xx             x   x xx
                x     x
                 x   x
                  xx


`)
var board = b1
const cleanboard = (board) => board.filter(([x1, y1], pos, arr) => arr.findIndex(([x2, y2]) => x1 === x2 && y1 === y2) === pos)
setInterval(() => {
  board = evolve(board)
  console.log(renderToStr(board))
  console.log('----------', board.length)
}, 100)
// console.log(getAliveNeighborsCount(exampleBoard, [1, 1]))
// console.log(getDeadNeighbors(exampleBoard, [1, 1]))
