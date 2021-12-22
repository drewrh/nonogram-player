type Square = {
  value: number,
}

const Square = ({value} : Square) => {
  if (value == 0) {
    return (<div className={'square empty-square'}></div>)
  } else if (value == 1) {
    return (<div className={'square filled-square'}></div>)
  } else if (value == 2) {
    return (<div className={'square marked-square'}></div>)
  } else {
    return (<div className={'square error-square'}></div>)
  }
}

export default Square