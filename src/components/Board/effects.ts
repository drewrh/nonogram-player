// separating functionality like this allows for better unit testing
// you can get clear inputs and outputs and limit the scope of changes
// when they come up in the future
const calcRows: (numRows: number, numColumns: number) => BoardRowData = (numRows, numColumns) => {
  // arrays can be constants
  // the value here is a reference to an array, not the array values themselves
  const newRowNums = []
  const newRows: Array<Array<number>> = []

  for (let i = 0; i < numRows; i++) {
    let randomRowNums = []
    let randomRow = []
    let count = 0

    for (let j = 0; j < numColumns; j++) {
      if (Math.random() < 0.5) {
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

const setRowsColumns: (
 	setRowNums: (newVal: Array<Array<number>>) => void,
 	setColumnNums: (newVal: Array<Array<number>>) => void,
  numRows: number,
  numColumns: number,
) => void = (
 	setRowNums,
 	setColumnNums,
  numRows,
  numColumns,
) => {
  const { newRows, newRowNums } = calcRows(numRows, numColumns)
  const newColNums = calcCols({ newRows, newRowNums }, numRows, numColumns)
  
  setRowNums(newRowNums)
  setColumnNums(newColNums)
}

export default setRowsColumns
