import { useState, useEffect } from "react"
import Menu from "./Menu"
import Row from "./Row"

type BoardProps = {
  numRows: number,
  numColumns: number
}

interface Size {
  width: number | undefined;
  height: number | undefined;
}

const Board = ({numRows, numColumns}: BoardProps) => {
  const [rows, setRows] = useState(new Array(numRows).fill(0).map(() => new Array(numColumns).fill(0)))
  const [leftMouseDown, setLeftMouseDown] = useState(false)
  const [rightMouseDown, setRightMouseDown] = useState(false)

  const [rowNums, setRowNums] = useState<Array<Array<number>>>([[]])
  const [columnNums, setColumnNums] = useState<Array<Array<number>>>([[]])
  const size: Size = useWindowSize();

  useEffect(() => {
    let newRowNums = []
    let newRows: any = []
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
    
    let newCols = newRows[0].map((col: any, i: any) => newRows.map((row:any) => row[i]))
    let newColNums = []
    for (let i = 0; i < numColumns; i++) {
      let randomColNums = []
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

    setRowNums(newRowNums)
    setColumnNums(newColNums)
  }, [])

  function getMax(array: any) {
    let max = -Infinity
    let index = -1
    array.forEach(function(a: any, i: any){
      if (a.length > max) {
        max = a.length
        index = i
      }
    })
    return max
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

  useEffect(() => {
    let col = (0.9 * window.innerWidth - Math.min(0.3 * window.innerHeight, 0.3 * window.innerWidth)) / (rows[0].length)
    let row = (0.9 * window.innerHeight - Math.min(0.2 * window.innerHeight, 0.2 * window.innerWidth)) / (rows.length)

    if (col < row) {
      document.documentElement.style.setProperty('--square-size', col + 'px');
    } else {
      document.documentElement.style.setProperty('--square-size', row + 'px');
    }
  }, [size, numRows, numColumns])

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
        <div className="menu-container">
          <Menu />
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
            <Row key={index} row={row} rowIndex={index} handleInput={handleInput} onHover={onHover} onMouseUp={onMouseUp} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Board