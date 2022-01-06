import { useStopwatch } from 'react-timer-hook'

const Menu = () => {
  const {
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    reset,
  } = useStopwatch({ autoStart: true });

  return (
    <div className="menu">
      <div className="title">
        PICROSS
      </div>
      <div className="clock">
        {hours.toLocaleString('en-US', {minimumIntegerDigits: 2})}:{minutes.toLocaleString('en-US', {minimumIntegerDigits: 2})}:{seconds.toLocaleString('en-US', {minimumIntegerDigits: 2})}
      </div>
    </div>
  )
}

export default Menu