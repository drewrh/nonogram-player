import { useEffect, useState } from "react"
import NonogramSolver from "../../classes/NonogramSolver"

const calcRows: (numRows: number, numColumns: number) => BoardRowData = (numRows, numColumns) => {
  const newRowNums = []
  const newRows: Array<Array<number>> = []

  for (let i = 0; i < numRows; i++) {
    const randomRowNums = []
    const randomRow = []
    let count = 0

    for (let j = 0; j < numColumns; j++) {
      if (Math.random() < 0.6) {
        count++
        randomRow.push(1)
      } else {
        if (count !== 0) {randomRowNums.push(count)}
        count = 0
        randomRow.push(0)
      }
    }

    if (count !== 0) {randomRowNums.push(count)}
    if (randomRowNums.length === 0) {randomRowNums.push(0)}

    newRowNums.push(randomRowNums)
    newRows.push(randomRow)
  }

  return {
    newRowNums,
    newRows,
  }
}

const calcCols: (rows: BoardRowData, numRows: number, numColumns: number) => Array<Array<number>> = (rows, numRows, numColumns) => {
  const newCols = rows.newRows[0].map((col, i) => rows.newRows.map((row) => row[i]))
  const newColNums = []

  for (let i = 0; i < numColumns; i++) {
    const randomColNums = []
    let count = 0

    for (let j = 0; j < numRows; j++) {
      if (newCols[i][j] === 1) {
        count++
      } else {
        if (count !== 0) {randomColNums.push(count)}
        count = 0
      }
    }

    if (count !== 0) {randomColNums.push(count)}
    if (randomColNums.length === 0) {randomColNums.push(0)}

    newColNums.push(randomColNums)
  }

  return newColNums
}

export const createNums: (
  numRows: number,
  numColumns: number,
) => RowColNums = (
  numRows,
  numColumns,
) => {
  const { newRows, newRowNums } = calcRows(numRows, numColumns)
  const newColNums = calcCols({ newRows, newRowNums }, numRows, numColumns)
  
  return {newRowNums, newColNums}
}

export const generateSolvablePuzzle = (numRows: number, numColumns: number) => {
  const {newRowNums, newColNums} = createNums(numRows, numColumns)
  let rowNums = newRowNums
  let colNums = newColNums
  let solver = new NonogramSolver(newRowNums, newColNums, numColumns, numRows)
  let solution = solver.solve()
  let count = 1
  while (!solution) {
    const {newRowNums, newColNums} = createNums(numRows, numColumns)
    rowNums = newRowNums
    colNums = newColNums
    solver = new NonogramSolver(newRowNums, newColNums, numColumns, numRows)
    solution = solver.solve()
    count++
  }
  console.log(`Total puzzles generated: ${count}`)
  return {rowNums, colNums, solution}
}

export const useWindowSize: () => Size = () => {
  const [windowSize, setWindowSize] = useState<Size>({
    width: undefined,
    height: undefined,
  })

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
    window.addEventListener("resize", handleResize)
    handleResize()
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return windowSize
}

export const convertTime = (hours: number, minutes: number, seconds: number) => {
  const locale = (time: number) => {
    return time.toLocaleString('en-US', {minimumIntegerDigits: 2})
  }
  return `${locale(hours)}:${locale(minutes)}:${locale(seconds)}`
}

export const hasWon = (answer: Array<Array<number>>, solution: Array<Array<boolean>>) => {
  if (answer[0] === undefined || answer[0][0] === undefined || solution[0] === undefined || solution[0][0] === undefined) {return false}
  for (let i = 0; i < answer.length; i++) {
    for (let j = 0; j < answer[i].length; j++) {
      if ((answer[i][j] === 1 && solution[i][j] === false) || (answer[i][j] === 0 && solution[i][j] === true)) {return false}
    }
  }
  return true
}