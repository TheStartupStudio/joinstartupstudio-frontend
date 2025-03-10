import 'react-circular-progressbar/dist/styles.css'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'

function CircularProgress({ percentage, level }) {
  return (
    <div style={{ width: 135, height: 135 }}>
      <CircularProgressbar
        value={percentage}
        text={`${percentage}%`}
        styles={buildStyles({
          textColor: '#51C7DF',
          pathColor: '#38bdf8',
          trailColor: '#e0f2fe',
          textSize: '25px',
          strokeLinecap: 'butt'
        })}
      />
      <div
        style={{
          textAlign: 'center',
          marginTop: '-45px',
          fontSize: '14px',
          color: '#6c757d'
        }}
      >
        Level {level}
      </div>
    </div>
  )
}

export default CircularProgress
