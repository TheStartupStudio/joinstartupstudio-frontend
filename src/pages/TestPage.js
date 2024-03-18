import React, { useEffect, useState } from 'react'
import LtsButton from '../components/LTSButtons/LTSButton'
import useIdle from '../utils/hooks/useIdleTimeout'
import useIdleTimeout from '../utils/hooks/useIdleTimeout'

const UserActivityTracker = ({ userId }) => {
  const [activeTime, setActiveTime] = useState(0)
  let lastActiveTime = Date.now()

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const now = Date.now()
        setActiveTime(activeTime + (now - lastActiveTime))
        lastActiveTime = now
      } else {
        sendActivityData(userId, activeTime)
      }
    }

    const sendActivityData = async (userId, time) => {
      try {
        console.log('Request send' + ' ' + { userId } + '-' + { time })
        // await axios.post('/api/activity', { userId, activeTime: time });
      } catch (error) {
        console.error('Error sending activity data:', error)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      sendActivityData(userId, activeTime)
    }
  }, [userId, activeTime])

  return (
    <div>
      <p>Active Time: {Math.floor(activeTime / 1000)} seconds</p>
    </div>
  )
}

function TestPage(props) {
  function msToTime(duration) {
    let milliseconds = parseInt((duration % 1000) / 100)
    let seconds = Math.floor((duration / 1000) % 60)
    let minutes = Math.floor((duration / (1000 * 60)) % 60)
    let hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
    let days = Math.floor(duration / (1000 * 60 * 60 * 24))

    let result = ''
    if (days > 0) result += days + 'd '
    if (hours > 0) result += hours + 'h '
    if (minutes > 0) result += minutes + 'm '
    if (seconds > 0) result += seconds + 's '

    return result.trim()
  }
  // const [activeTime, setActiveTime] = useState({
  //   loginTime: '',
  //   logoutTime: '',
  //   activeMinutes: 0
  // })
  //
  // const handleUpdateActivity = () => {
  //   setActiveTime({
  //     loginTime: new Date(),
  //     logoutTime: new Date(),
  //     activeMinutes: 2
  //   })
  // }
  const { isActiveUser, expireTime } = useIdleTimeout()
  const [activeSeconds, setActiveSeconds] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      if (isActiveUser) {
        setActiveSeconds((prevSeconds) => prevSeconds + 1)
      }
    }, 1000) // Update every second

    return () => clearInterval(interval)
  }, [isActiveUser])
  console.log('seconds', activeSeconds)

  return (
    <div className={'d-flex align-items-center justify-content-center vh-100'}>
      <div>
        <div
          className={
            'd-flex align-items-center flex-column justify-content-center'
          }
          style={{ height: 50 }}
        >
          <UserActivityTracker />
          {/*Is active user: {isActiveUser.toString()} <br />*/}
          {/*Expire Time: {expireTime}*/}
          {/*<br />*/}
          {/*/!*Active Minutes: {msToTime(activeTime.activeMinutes)}*!/*/}
          {/*Active Time: {activeSeconds}*/}
          {/*<div>*/}
          {/*  {isIdle ? <p>Idle</p> : <p>Active</p>}*/}
          {/*  <p>Time passed: {timePassed} ms</p>*/}
          {/*</div>*/}
        </div>
        {/*{Object.entries(activeTime).map(([key, value], index) => {*/}
        {/*  return (*/}
        {/*    <div>*/}
        {/*      {key.toString()}: {value.toString()}*/}
        {/*    </div>*/}
        {/*  )*/}
        {/*})}*/}
        {/*<LtsButton name={'Send Request'} onClick={handleUpdateActivity} />*/}
      </div>
    </div>
  )
}

export default TestPage

//////////////////////
const msToTime = (duration) => {
  const seconds = Math.floor((duration / 1000) % 60)
  const minutes = Math.floor((duration / (1000 * 60)) % 60)
  const hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
}

function pad(num) {
  return num < 10 ? `0${num}` : num
}

function TimeTracker(props) {
  const [activeTime, setActiveTime] = useState({
    startTime: null,
    endTime: null,
    activeMinutes: 0
  })

  useEffect(() => {
    setActiveTime({
      ...activeTime,
      startTime: new Date(),
      endTime: null
    })
  }, [activeTime?.activeMinutes])

  const handleUpdateActivity = () => {
    let elapsedTime
    if (new Date() - activeTime?.startTime) {
      elapsedTime = new Date() - activeTime?.startTime
    }

    const activeMinutes = activeTime?.activeMinutes + elapsedTime
    setActiveTime({
      ...activeTime,
      startTime: null,
      endTime: new Date(),
      activeMinutes
    })
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh'
      }}
    >
      <div>
        <div style={{ height: 50 }}>
          Active Minutes: {msToTime(activeTime.activeMinutes)}
        </div>

        <div>
          Start time: {msToTime(activeTime.startTime) ?? activeTime.startTime}
        </div>
        <div>
          End time: {msToTime(activeTime.endTime) ?? activeTime.endTime}
        </div>

        <button name={'Send Request'} onClick={handleUpdateActivity}>
          Send Request
        </button>
      </div>
    </div>
  )
}
