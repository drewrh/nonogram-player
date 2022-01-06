type ControlsProps = {
  numRows: number,
  numColumns: number,
  changeNumRows: any,
  changeNumColumns: any
}

const Controls = ({numRows, numColumns, changeNumRows, changeNumColumns}: ControlsProps) => {
  return (
    <div>
      <input type="number" min={5} value={numRows} onChange={(e) => {changeNumRows(e)}}></input>
      <input type="number" min={5} value={numColumns} onChange={(e) => {changeNumColumns(e)}}></input>
    </div>
  )
}

export default Controls