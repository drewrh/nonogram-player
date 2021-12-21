import Square from "./Square"

type Row = {
  row: Array<boolean>,
  rowIndex: number,
  handleClick: (row : number, column : number) => void
}

const Row = ({row, rowIndex, handleClick} : Row) => {
  return (
    <div>
      {row.map((square, columnIndex) => (
        <span onMouseDown={() => {handleClick(rowIndex, columnIndex)}}>
          <Square key={columnIndex} value={square} />
        </span>
      ))}
    </div>
  )
}

export default Row