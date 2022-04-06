import { useState, useEffect, useLayoutEffect } from "react"
import { useStopwatch } from 'react-timer-hook'
import Menu from "../Menu"
import Row from "../Row"
import { convertTime, generateSolvablePuzzle, hasWon, useWindowSize } from "./effects"

const Board = () => {
  const [numRows, setNumRows] = useState(10)
  const [numCols, setNumCols] = useState(10)
  const [rows, setRows] = useState(new Array(numRows).fill(0).map(() => new Array(numCols).fill(0)))
  const [rowNums, setRowNums] = useState<Array<Array<number>>>([[]])
  const [columnNums, setColumnNums] = useState<Array<Array<number>>>([[]])
  const [solution, setSolution] = useState<Array<Array<boolean>>>([[]])
  const [playerWon, setPlayerWon] = useState(false)
  const [leftMouseDown, setLeftMouseDown] = useState(false)
  const [rightMouseDown, setRightMouseDown] = useState(false)
  const windowSize: Size = useWindowSize()
  const {
    seconds,
    minutes,
    hours,
    pause: pauseStopwatch,
    reset: resetStopwatch,
  } = useStopwatch({ autoStart: true });

  useLayoutEffect(() => {
    document.documentElement.style.setProperty('--square-size', calcSquareSize() + 'px');
    const {rowNums, colNums, solution} = generateSolvablePuzzle(numRows, numCols)
    setRowNums(rowNums)
    setColumnNums(colNums)
    setSolution(solution)
  }, [])

  const calcSquareSize: () => number = () => {
    const col = (0.9 * window.innerWidth - Math.min(0.3 * window.innerHeight, 0.3 * window.innerWidth)) / (rows[0].length)
    const row = (0.9 * window.innerHeight - Math.min(0.2 * window.innerHeight, 0.2 * window.innerWidth)) / (rows.length)
    return col < row ? col : row
  }

  useEffect(() => {
    if (!playerWon && hasWon(rows, solution)) {
      pauseStopwatch()
      setPlayerWon(true)
      console.log("User wins")
    }
  }, [rows])

  useEffect(() => {
    document.documentElement.style.setProperty('--square-size', calcSquareSize() + 'px');
  }, [windowSize, numRows, numCols])

  useEffect(() => {
    const newRows = [...rows]
    if (numRows > rows.length) {
      rowNums.push([])
      newRows.push(new Array(numCols).fill(0))
    } else if (numRows < rows.length) {
      newRows.pop()
      rowNums.pop()
    }
    setRows(newRows)
  }, [numRows])

  useEffect(() => {
    const newRows = [...rows]
    if (numCols > rows[0].length) {
      columnNums.push([])
      newRows.forEach(row => row.push(0))
    } else if (numCols < rows[0].length) {
      newRows.forEach(row => row.pop())
      columnNums.pop()
    }
    setRows(newRows)
  }, [numCols])

  const handleInput = (button: number, rowIndex: number, columnIndex: number) => {    
    if (button === 0) {
      setLeftMouseDown(true)
    } else if (button === 2) {
      setRightMouseDown(true)
    }
    
    const newRows = [...rows]
    const value = rows[rowIndex][columnIndex]

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

  const emptyBoard = () => {
    setRows(new Array(numRows).fill(0).map(() => new Array(numCols).fill(0)))
  }

  const newBoard = () => {
    emptyBoard()
    const {rowNums, colNums, solution} = generateSolvablePuzzle(numRows, numCols)
    setRowNums(rowNums)
    setColumnNums(colNums)
    setSolution(solution)
    resetStopwatch()
  }

  return (
    <div className="board-nums">
      <div className="row-nums">
        <div className="menu-container">
          <Menu emptyBoard={emptyBoard} newBoard={newBoard} time={convertTime(hours, minutes, seconds)}/>
        </div>
        <div>
          {rowNums.map((row, i) => (
          <div key={i} className="row-nums-list alternating-color">
            {row.map((number, j) => <div className="row-num" key={j}>{number}</div>)}
          </div>
        ))}
        </div>
      </div>
      <div>
        <div className="column-nums">
          {columnNums.map((row, i) => (
            <div key={i} className="column-nums-list alternating-color">
              {row.map((number, j) => <div className="column-num" key={j}>{number}</div>)}
            </div>
          ))}
        </div>
        <div className="board">
          {rows.map((row, index) => (
            <Row key={index} row={row} rowIndex={index} handleInput={handleInput} onMouseOver={onHover} onMouseUp={onMouseUp} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Board