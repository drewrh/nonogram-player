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

  const [rowNums, setRowNums] = useState([[2], [2, 1], [1, 1], [3], [1, 1, 1]])
  const [columnNums, setColumnNums] = useState([[4], [1, 1], [2], [2], [1, 1, 1]])
  const size: Size = useWindowSize();

  function getMax(array: any) {
    let max = -Infinity;
    let index = -1;
    array.forEach(function(a: any, i: any){
      if (a.length > max) {
        max = a.length;
        index = i;
      }
    });
    return max
  }

  function useWindowSize(): Size {
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [windowSize, setWindowSize] = useState<Size>({
      width: undefined,
      height: undefined,
    });

    useEffect(() => {
      // Handler to call on window resize
      function handleResize() {
        // Set window width/height to state
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }

      // Add event listener
      window.addEventListener("resize", handleResize);

      // Call handler right away so state gets updated with initial window size
      handleResize();

      // Remove event listener on cleanup
      return () => window.removeEventListener("resize", handleResize);
    }, []); // Empty array ensures that effect is only run on mount

    return windowSize;
  }

  useEffect(() => {
    let col = (0.8 * window.innerWidth) / (rows[0].length + getMax(rowNums))
    let row = (window.innerHeight) / (rows.length + getMax(columnNums))

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
              {row.map((number, j) => <div key={j}>{number}</div>)}
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