type Square = {
  value: boolean
}

const Square = ({value} : Square) => {
  return (
    <div className={value ? 'filled-square' : 'empty-square'}></div>
  )
}

export default Square