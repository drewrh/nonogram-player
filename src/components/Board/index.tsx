import { useState, useEffect, useLayoutEffect } from "react"
import { useStopwatch } from 'react-timer-hook'
import NonogramSolver from "../../classes/NonogramSolver"
import Menu from "../Menu"
import Row from "../Row"
import createNums from "./effects"

const Board = ({numRows, numColumns}: BoardProps) => {
  const [rows, setRows] = useState(new Array(numRows).fill(0).map(() => new Array(numColumns).fill(0)))
  const [leftMouseDown, setLeftMouseDown] = useState(false)
  const [rightMouseDown, setRightMouseDown] = useState(false)
  const [rowNums, setRowNums] = useState<Array<Array<number>>>([[]])
  const [columnNums, setColumnNums] = useState<Array<Array<number>>>([[]])
  const windowSize: Size = useWindowSize()
  const {
    seconds,
    minutes,
    hours,
    start,
    pause,
    reset: resetStopwatch,
  } = useStopwatch({ autoStart: true });

  useLayoutEffect(() => {
    document.documentElement.style.setProperty('--square-size', calcSquareSize() + 'px');
  })

  useEffect(() => {
    const {rowNums, colNums} = generateSolvablePuzzle(numRows, numColumns)
    setRowNums(rowNums)
    setColumnNums(colNums)
  }, [])

  const generateSolvablePuzzle = (numRows: number, numColumns: number) => {
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
    console.log(solution)
    console.log(`Total puzzles generated: ${count}`)
    return {rowNums, colNums}
  }


  function useWindowSize(): Size {
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

  const calcSquareSize: () => number = () => {
    const col = (0.9 * window.innerWidth - Math.min(0.3 * window.innerHeight, 0.3 * window.innerWidth)) / (rows[0].length)
    const row = (0.9 * window.innerHeight - Math.min(0.2 * window.innerHeight, 0.2 * window.innerWidth)) / (rows.length)

    return col < row ? col : row
  }

  useEffect(() => {
    document.documentElement.style.setProperty('--square-size', calcSquareSize() + 'px');
  }, [windowSize, numRows, numColumns])

  useEffect(() => {
    const newRows = [...rows]
    if (numRows > rows.length) {
      rowNums.push([])
      newRows.push(new Array(numColumns).fill(0))
    } else if (numRows < rows.length) {
      newRows.pop()
      rowNums.pop()
    }
    setRows(newRows)
  }, [numRows])

  useEffect(() => {
    const newRows = [...rows]
    if (numColumns > rows[0].length) {
      columnNums.push([])
      newRows.forEach(row => row.push(0))
    } else if (numColumns < rows[0].length) {
      newRows.forEach(row => row.pop())
      columnNums.pop()
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
    setRows(new Array(numRows).fill(0).map(() => new Array(numColumns).fill(0)))
  }

  const newBoard = () => {
    emptyBoard()
    const {rowNums, colNums} = generateSolvablePuzzle(numRows, numColumns)
    setRowNums(rowNums)
    setColumnNums(colNums)
    resetStopwatch()
  }

  const convertTime = (time: number) => {
    return time.toLocaleString('en-US', {minimumIntegerDigits: 2})
  }

  return (
    <div className="board-nums">
      <div className="row-nums">
        <div className="menu-container">
          <Menu emptyBoard={emptyBoard} newBoard={newBoard} time={`${convertTime(hours)}:${convertTime(minutes)}:${convertTime(seconds)}`}/>
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