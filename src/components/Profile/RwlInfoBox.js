import React from 'react'
import readImg from '../../assets/images/read_watch_listen_Read_with typo2.png'
import watchImg from '../../assets/images/read_watch_listen_Watch_with typo1.png'
import listenImg from '../../assets/images/read_watch_listen_Listen_with typo1.png'

const RwlInfoBox = ({ dashboardWidget }) => {
  return (
    <div
      className='col-lg-6 col-12 mt-4 row px-md-4 gx-0 float-end ps-auto ms-auto'
      style={{
        backgroundColor: '#F8F7F7',
        minHeight: '166px',
        height: '250px',
        fontWeight: '600'
      }}
    >
      <div
        className='read-section w-100 border-bottom row gx-0'
        style={{ height: '33.3%' }}
      >
        <div className=' col-5 col-md-3 text-start text-md-start read-watch-listen-image-div px-4 py-3 d-flex justify-content-center align-items-center'>
          {/* <div className='read-bg__img'></div> */}
          <div className='d-flex justify-content-center align-items-center h-75 w-75'>
            <img src={readImg} alt='' className='w-100 h-100' />
          </div>
        </div>
        <div
          style={{ float: 'right' }}
          className={'text-start my-auto col-7 read-watch-listen-text-div'}
        >
          <p className='my-0 text-start read-watch-listen-title'>
            {dashboardWidget?.read?.title}
          </p>
          <p
            className='text-start my-0 read-watch-listen-author'
            style={{ fontSize: '10px' }}
          >
            {dashboardWidget?.read?.author}
          </p>
        </div>
      </div>
      {/* second */}
      <div
        className='read-section w-100 border-bottom row gx-0'
        style={{ height: '33.3%' }}
      >
        <div className='col-5 col-md-3 text-start text-md-start read-watch-listen-image-div px-4 py-3 d-flex justify-content-center align-items-center'>
          {/* <div className='watch-bg__img'></div> */}
          <div className='d-flex justify-content-center align-items-center h-75 w-75'>
            <img src={watchImg} alt='' className='w-100 h-100' />
          </div>
        </div>
        <div
          style={{ float: 'right' }}
          className={
            'text-start my-auto col-7 col-md-9 read-watch-listen-text-div'
          }
        >
          <p className='my-0 text-start w-100 read-watch-listen-title'>
            {dashboardWidget?.watch?.title}
          </p>
          <p
            className='text-start my-0 read-watch-listen-author'
            style={{ fontSize: '10px' }}
          >
            {dashboardWidget?.watch?.author}
          </p>
        </div>
      </div>
      {/* third  */}
      <div
        className='read-section w-100 row gx-0'
        style={{ borderBottom: '0px', height: '33.3%' }}
      >
        <div className='col-5 col-md-3 text-start text-md-start read-watch-listen-image-div px-4 py-3 d-flex justify-content-center align-items-center'>
          {/* <div className='listen-bg__img'></div> */}
          <div className='d-flex justify-content-center align-items-center h-75 w-75'>
            <img src={listenImg} alt='' className='w-100 h-100' />
          </div>
        </div>
        <div
          style={{ float: 'right' }}
          className={'text-center my-auto col-7 read-watch-listen-text-div'}
        >
          <p className='my-0 text-start read-watch-listen-title'>
            {dashboardWidget?.listen?.title}
          </p>
          <p
            className='text-start my-0 read-watch-listen-author'
            style={{ fontSize: '10px' }}
          >
            {dashboardWidget?.listen?.author}
          </p>
        </div>
      </div>
    </div>
  )
}

export default RwlInfoBox
