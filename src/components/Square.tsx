import markedCell from "../images/marked-cell.svg"
import filledCell from "../images/filled-cell.svg"

const Square = ({value} : Square) => {
  if (value == 0) {
    return (<div className="square"></div>)
  } else if (value == 1) {
    return (
     <div className="square">
       <img className="cell-fill" src={filledCell} alt="Square that is filled in." />
     </div>
    )
  } else {
    return (
      <div className="square">
        <img className="cell-fill" src={markedCell} alt="Square with an X mark." />
      </div>
    )
  }
}

export default Square