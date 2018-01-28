// Point: [int, int]
// Board: Array[Point]

const getNeighbors = ([x, y]) => [
  [x - 1, y - 1], [x, y - 1], [x + 1, y - 1],
  [x - 1, y], /*            */ [x + 1, y],
  [x - 1, y + 1], [x, y + 1], [x + 1, y + 1]
]

const getAliveNeighborsCount = (board, p) => {
  const neighbors = getNeighbors(p)
  return neighbors.reduce(
    (acc, [xn, yn]) => acc + (
      board.find(([xb, yb]) => xn === xb && yn === yb) !== undefined ? 1 : 0
    ),
    0
  )
}

const getDeadNeighbors = (board, p) => {
  const neighbors = getNeighbors(p)
  return neighbors.reduce((acc, [xn, yn]) => [
    ...acc,
    ...(board.find(([xb, yb]) => xn === xb && yn === yb) === undefined ? [[xn, yn]] : [])
  ], [])
}

const parseBoard = (input) => input
  .split('\n')
  .map((row, y) => row
    .split('')
    .reduce((acc, col, x) => col === 'x' ? [...acc, [x, y]] : acc,
      [])
  ).reduce((acc, x) => acc.concat(x), [])

const evolve = (board) => board
  .reduce(
    (acc, cell, _, cboard) => {
      const cellNeighborCount = getAliveNeighborsCount(board, cell)
      return [
        ...acc,
        ...cellNeighborCount === 3 || cellNeighborCount === 2 ? [cell] : [],
        ...(
          getDeadNeighbors(board, cell).reduce(
            (accd, pd) => acc.find(([xc, yc]) => xc === pd[0] && yc === pd[1]) === undefined &&
            getAliveNeighborsCount(board, pd) === 3 ? [...accd, pd] : accd, []
          )
        )
      ]
    }
    , [])

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
setInterval(() => {
  board = evolve(board)
  console.log(renderToStr(board))
  console.log('----------', board.length)
}, 100)
// console.log(getAliveNeighborsCount(exampleBoard, [1, 1]))
// console.log(getDeadNeighbors(exampleBoard, [1, 1]))
