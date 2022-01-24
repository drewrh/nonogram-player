interface BoardProps {
  numRows: number;
  numColumns: number;
}

interface Size {
  width: number | undefined;
  height: number | undefined;
}

interface ControlsProps {
  numRows: number;
  numColumns: number;
  changeNumRows: any;
  changeNumColumns: any;
}

interface Square {
  value: number;
}