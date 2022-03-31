import Square from "./Square"

const Row = ({row, rowIndex, handleInput, onHover, onMouseUp} : RowProps) => {
  return (
    <div className="row">
      {row.map((square, columnIndex) => (
        <div key={columnIndex} onContextMenu={(e)=> e.preventDefault()} onMouseDown={(e) => {handleInput(e.button, rowIndex, columnIndex)}} onMouseUp={() => {onMouseUp()}} onMouseOver={() => {onHover(rowIndex, columnIndex)}}>
          <Square value={square} />
        </div>
      ))}
    </div>
  )
}

export default Row