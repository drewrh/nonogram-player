import { useState } from "react"
import Row from "./Row"

const Board = () => {
  const [size, setSize] = useState(5)
  const [rows, setRows] = useState(new Array(size).fill(0).map(() => new Array(size).fill(0)))
  const [leftMouseDown, setLeftMouseDown] = useState(false)
  const [rightMouseDown, setRightMouseDown] = useState(false)

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
    } else if (button === 2) {
      newRows[rowIndex][columnIndex] = 2
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
    <div>
      {rows.map((row, index) => (
        <Row key={index} row={row} rowIndex={index} handleInput={handleInput} onHover={onHover} onMouseUp={onMouseUp} />
      ))}
    </div>
  )
}

export default Board