import { useState, useEffect } from "react"
import Row from "./Row"

type BoardProps = {
  numRows: number,
  numColumns: number
}

const Board = ({numRows, numColumns}: BoardProps) => {
  const [rows, setRows] = useState(new Array(numRows).fill(0).map(() => new Array(numColumns + 1).fill(0)))
  const [leftMouseDown, setLeftMouseDown] = useState(false)
  const [rightMouseDown, setRightMouseDown] = useState(false)

  const [rowNums, setRowNums] = useState([[2], [2, 1], [1, 1], [3], [1, 1, 1]])
  const [columnNums, setColumnNums] = useState([[4], [1, 1], [2], [2], [1, 1, 1]])

  useEffect(() => {
    const newRows = [...rows]
    if (numRows > rows.length) {
      newRows.push(new Array(numColumns).fill(0))
    } else {
      newRows.pop()
    }
    setRows(newRows)
  }, [numRows])

  useEffect(() => {
    const newRows = [...rows]
    if (numColumns > rows[0].length) {
      newRows.forEach(row => row.push(0))
    } else {
      newRows.forEach(row => row.pop())
    }
    setRows(newRows)
  }, [numColumns])

  const handleInput = (button: number, rowIndex: number, columnIndex: number) => {    
    if (button === 0) {
      setLeftMouseDown(true)
    } else if (button === 2) {
      setRightMouseDown(true)
    }
    
    const newRows = [...rows]
    let value = rows[rowIndex][columnIndex]

    if (button === 0 && (value === 0 || value === 2)) {
      newRows[rowIndex][columnIndex] = 1
    } else if (button === 0 && value === 1) {
      newRows[rowIndex][columnIndex] = 0
    }
    
    if (button === 2 && (value === 0 || value === 1)) {
      newRows[rowIndex][columnIndex] = 2
    } else if (button === 2 && value === 2) {
      newRows[rowIndex][columnIndex] = 0
    }

    setRows(newRows)
  }

  const onMouseUp = () => {
    setLeftMouseDown(false)
    setRightMouseDown(false)
  }

  const onHover = (rowIndex : number, columnIndex : number) => {
    if (leftMouseDown) {
      handleInput(0, rowIndex, columnIndex)
    } else if (rightMouseDown) {
      handleInput(2, rowIndex, columnIndex)
    }
  }

  return (
    <div className="board-nums">
      <div className="row-nums">
        {rowNums.map((row) => (
          <div className="row-nums-list alternating-color">
            {row.map((number) => <div className="test" key={number.toString()}>{number}</div>)}
          </div>
        ))}
      </div>
      <div>
        <div className="column-nums">
          {columnNums.map((row) => (
            <div className="column-nums-list alternating-color">
              {row.map((number) => <div key={number.toString()}>{number}</div>)}
            </div>
          ))}
        </div>
        <div className="board">
          {rows.map((row, index) => (
            <Row key={index} row={row} rowIndex={index} handleInput={handleInput} onHover={onHover} onMouseUp={onMouseUp} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Board