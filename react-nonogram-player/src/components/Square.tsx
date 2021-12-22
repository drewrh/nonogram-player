import markedCell from "../images/marked-cell.svg"
import filledCell from "../images/filled-cell.svg"

type Square = {
  value: number,
}

const Square = ({value} : Square) => {
  if (value == 0) {
    return (<div className={'square'}></div>)
  } else if (value == 1) {
    return (
     <div className={'square'}>
       <img className="cell-fill" src={filledCell} />
     </div>
    )
  } else if (value == 2) {
    return (
      <div className={'square'}>
        <img className="cell-fill x-mark" src={markedCell} />
      </div>
    )
  } else {
    return (<div className={'square error-square'}></div>)
  }
}

export default Square