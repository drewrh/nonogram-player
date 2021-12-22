import { useState } from "react"
import Board from "./Board"
import Controls from "./Controls"

const Game = () => {
  const [numRows, setNumRows] = useState(5)
  const [numColumns, setNumColumns] = useState(5)

  const changeNumRows = (event: any) => {setNumRows(parseInt(event.target.value))}
  const changeNumColumns = (event: any) => {setNumColumns(parseInt(event.target.value))}

  return (
    <div>
      <Controls numRows={numRows} numColumns={numColumns} changeNumRows={changeNumRows} changeNumColumns={changeNumColumns} />
      <Board numRows={numRows} numColumns={numColumns} />
    </div>
  )
}

export default Game