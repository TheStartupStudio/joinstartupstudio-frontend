/**
 * Entry application component used to compose providers and render Routes.
 * */

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { BrowserRouter, useHistory, useLocation } from 'react-router-dom'
import Router from './Router'
import jQuery from 'jquery'
import { useDispatch, useSelector } from 'react-redux'
import { updateUserActivity } from './redux/user/Actions'
import useWindowFocus from './utils/hooks/useWindowFocus'
import socket from './utils/notificationSocket'
import useTabActive from './utils/hooks/useTabActive'
import { isFirstFocusedRender } from 'react-big-calendar/lib/utils/helpers'
import axiosInstance from './utils/AxiosInstance'

window.jQuery = jQuery

function App({ basename }) {
  // todo: loginTime, logoutTime, activeMinutes
  //

  const windowFocus = useWindowFocus()
  const tabActive = useTabActive()
  // console.log(
  //   '--------------[is window focused]-------------',
  //   `[${windowFocus}]`
  // )
  const userActivity = useSelector((state) => state.user?.userActivity)
  const isLoggedUser = useSelector((state) => state.user?.user)
  const loggedUser = useSelector((state) => state.user?.user?.user)
  // const [firstRenderedStartDate, setFirstRenderedStartDate] = useState(null)
  const dispatch = useDispatch()
  const [firstRenderedStartDate, setFirstRenderedStartDate] = useState(null)
  const [renderCount, setRenderCount] = useState(0)

  // console.log(renderCount)
  const convertMillisecondsToMinutesAndSeconds = (milliseconds) => {
    const minutes = Math.floor(milliseconds / (1000 * 60))
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000)

    const formattedResult = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`

    return formattedResult
  }

  // useEffect(() => {
  // console.log(document.hasFocus())

  // const handleVisibilityChange = () => {
  //   if (document.visibilityState === 'hidden') {
  //     handleBeforeUnload()
  //   }
  // }
  // const handleFocusChange = () => {
  //   if (document.hasFocus()) {
  //     const handleBeforeUnload2 = (e) => {
  //       axiosInstance
  //         .put('/myPerformanceData/updateActivity2', {
  //           isActive: true
  //         })
  //         .then((r) => {
  //           debugger
  //           console.log(r)
  //         })
  //     }
  //     handleBeforeUnload2()
  //   } else {
  //     const handleBeforeUnload2 = (e) => {
  //       axiosInstance
  //         .put('/myPerformanceData/updateActivity2', {
  //           isActive: false
  //         })
  //         .then((r) => {
  //           debugger
  //           console.log(r)
  //         })
  //     }
  //     handleBeforeUnload2()
  //   }
  // }

  //   const handleBeforeUnload = (e) => {
  //     debugger
  //     axiosInstance
  //       .put('/myPerformanceData/updateActivity', {
  //         isActive: false
  //       })
  //       .then((r) => {
  //         debugger
  //         console.log(r)
  //       })
  //   }
  //
  //   window.addEventListener('beforeunload', handleBeforeUnload)
  //
  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload)
  //   }
  // }, [])

  // useEffect(() => {
  // console.log(location)
  // console.log(history)
  // }, [location])

  // useEffect(() => {
  //   // const handleBeforeUnload2 = (e) => {
  //   //   axiosInstance
  //   //     .put('/myPerformanceData/updateActivity2', {
  //   //       isActive: true
  //   //     })
  //   //     .then((r) => {
  //   //       debugger
  //   //       console.log(r)
  //   //     })
  //   // }
  //   // handleBeforeUnload2()
  //   const handleChangeFocus = () => {
  //     sendData()
  //   }
  //
  //   const handlePageChange = () => {
  //     sendData()
  //     debugger
  //   }
  //
  //   const sendData = () => {
  //     axiosInstance
  //       .put('/myPerformanceData/updateActivity', {
  //         isActive: false
  //       })
  //       .then((response) => {
  //         debugger
  //         console.log(response)
  //       })
  //   }
  //
  //   window.addEventListener('blur', handleChangeFocus)
  //   window.addEventListener('focus', handleChangeFocus)
  //
  //   return () => {
  //     window.removeEventListener('blur', handleChangeFocus)
  //     window.removeEventListener('focus', handleChangeFocus)
  //   }
  // }, [])
  // console.log(
  //   `\x1b[32mActive minutes: [${convertMillisecondsToMinutesAndSeconds(
  //     userActivity.activeMinutes
  //   )}]\x1b[0m,\x1b[34mmilliseconds: [${userActivity.activeMinutes}]\x1b[0m`
  // )

  // // console.log(userActivity)
  // useEffect(() => {
  //   // console.log('************** isFocused', windowFocus)
  //
  //   const updateInvisibleActiveMinutes = +(
  //     +userActivity.activeMinutes +
  //     (new Date() -
  //       (userActivity.loginTime
  //         ? new Date(userActivity.loginTime)
  //         : new Date()))
  //   )
  //   if (windowFocus) {
  //     // debugger
  //     dispatch(
  //       updateUserActivity({
  //         loginTime: new Date(),
  //         logoutTime: new Date(
  //           new Date().getTime() +
  //             new Date(+userActivity.activeMinutes).getTime()
  //         ),
  //         activeMinutes: +userActivity.activeMinutes
  //       })
  //     )
  //
  //     // console.log('loginTime', new Date())
  //     //
  //     // console.log(
  //     //   'logoutTime',
  //     //
  //     //   new Date(
  //     //     new Date().getTime() + new Date(+userActivity.activeMinutes).getTime()
  //     //   )
  //     // )
  //   } else if (!windowFocus) {
  //     if (firstRenderedStartDate) {
  //       dispatch(
  //         updateUserActivity({
  //           loginTime: new Date(),
  //           logoutTime: new Date(),
  //           activeMinutes:
  //             +userActivity.activeMinutes +
  //             (new Date() - firstRenderedStartDate)
  //         })
  //       )
  //       setFirstRenderedStartDate(null)
  //     } else {
  //       dispatch(
  //         updateUserActivity({
  //           loginTime: new Date(),
  //           logoutTime: new Date(),
  //           activeMinutes: updateInvisibleActiveMinutes
  //         })
  //       )
  //     }
  //   }
  // }, [windowFocus])
  //
  // // useEffect(() => {
  // //   socket?.on('updatedActivity', (updatedUserActivity) => {
  // //     console.log('updated Activity', updatedUserActivity)
  // //     dispatch(updateUserActivity(updatedUserActivity))
  // //   })
  // //
  // //   return () => {
  // //     socket?.off('updatedActivity')
  // //   }
  // // }, [userActivity.activeMinutes])
  // // }, [windowFocus])
  // //
  //
  // useEffect(() => {
  //   //// // //
  //   if (+userActivity.activeMinutes !== 0 && windowFocus === false) {
  //     socket?.emit('updateActivity', {
  //       userId: loggedUser?.id,
  //       activeMinutes: +userActivity.activeMinutes,
  //       loginTime: userActivity.loginTime,
  //       logoutTime: userActivity.logoutTime
  //     })
  //     // Only subscribe to the event if necessary
  //     const handleUpdatedActivity = (updatedUserActivity) => {
  //       console.log('updated Activity', updatedUserActivity)
  //       dispatch(updateUserActivity(updatedUserActivity))
  //     }
  //
  //     socket?.on('updatedActivity', handleUpdatedActivity)
  //
  //     return () => {
  //       socket?.off('updatedActivity', handleUpdatedActivity)
  //     }
  //   }
  // }, [userActivity.activeMinutes])
  //
  // useEffect(() => {
  //   socket.emit('getUserActivity', loggedUser?.id)
  //
  //   socket.on('userActivityData', (data) => {
  //     dispatch(updateUserActivity(data))
  //   })
  //
  //   // setRenderCount((prevState) => prevState + 1)
  // }, [])
  return (
    <React.Suspense fallback={''}>
      <BrowserRouter basename={basename}>
        <Router />
      </BrowserRouter>
    </React.Suspense>
  )
}

export default App
