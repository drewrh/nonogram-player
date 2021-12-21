import { useState, useEffect } from "react"
import Row from "./Row"

const Board = () => {
  const [size, setSize] = useState(5)
  const [rows, setRows] = useState(new Array(size).fill(false).map(() => new Array(size).fill(false)))

  const handleClick = (rowIndex : number, columnIndex : number) => {
    const newRows = [...rows]
    newRows[rowIndex][columnIndex] = rows[rowIndex][columnIndex] ? false : true
    setRows(newRows)
  }

  return (
    <div>
      {rows.map((row, index) => (
        <Row key={index} row={row} rowIndex={index} handleClick={handleClick}/>
      ))}
    </div>
  )
}

export default Board