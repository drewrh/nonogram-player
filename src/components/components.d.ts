interface BoardProps {
  numRows: number;
  numColumns: number;
}

interface ControlsProps {
  numRows: number;
  numColumns: number;
  changeNumRows: any;
  changeNumColumns: any;
}

type RowProps = {
  row: Array<number>,
  rowIndex: number,
  handleInput: (button: number, row : number, column : number) => void,
  onMouseOver: (row : number, column : number) => void,
  onMouseUp: () => void
}

interface Size {
  width: number | undefined;
  height: number | undefined;
}

interface Square {
  value: number;
} 