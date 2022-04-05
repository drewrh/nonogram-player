import { faArrowsRotate, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const Menu = ({emptyBoard, newBoard, time}: Menu) => {
  
  return (
    <div className="menu">
      <div className="title">
        PICROSS
      </div>
      <div className="clock">
        {time}
      </div>
      <div className="menu-controls">
    <FontAwesomeIcon icon={faTrash} onClick={() => {emptyBoard()}} />
    <FontAwesomeIcon icon={faArrowsRotate} onClick={() => {newBoard()}} />
  </div>
    </div>
  )
}

export default Menu