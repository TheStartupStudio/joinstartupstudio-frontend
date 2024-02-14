import React from 'react'
import CustomSpinner from '../../components/CustomSpinner'

const Dot = ({
  backgroundColor,
  width,
  height,
  gap,
  children,
  containsStripes
}) => (
  <div
    style={{
      backgroundColor,
      width,
      height,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap
    }}
  >
    {containsStripes && (
      <>
        <div
          style={{
            backgroundColor: '#fff',
            height: '60%',
            width: '10%',
            borderRadius: 10
          }}
        ></div>
        <div
          style={{
            backgroundColor: '#fff',
            height: '60%',
            width: '10%',
            borderRadius: 10
          }}
        ></div>
        <div
          style={{
            backgroundColor: '#fff',
            height: '60%',
            width: '10%',
            borderRadius: 10
          }}
        ></div>
      </>
    )}

    {children && children}
  </div>
)
export const ProgressCard = ({ title, progress, loading }) => {
  return (
    <div
      className={
        'p-4 w-100 position-relative border-2 performance-data-slider w-100 h-100 d-flex align-items-center flex-column justify-content-center'
      }
    >
      <div style={{ fontWeight: 600 }} className={'text-center'}>
        {title}
      </div>
      <div className={'w-100 pt-4 pb-3'}>
        <ProgressBar progress={progress} loading={loading} />
      </div>
      <div
        className={'d-flex justify-content-center align-items-center'}
        style={{ fontWeight: 600, minHeight: 30 }}
      >
        {loading ? <CustomSpinner color={'primary'} /> : `${progress ?? 0}%`}
      </div>
    </div>
  )
}
export const ProgressBar = ({ progress, loading }) => {
  const ProgressDot = ({ backgroundColor, width, height, gap }) => (
    <div
      className="progress-dot"
      style={{
        ...dotStyle,
        width,
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow:
          'rgba(0, 0, 0, 0.10) 0px 31px 100px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px'
      }}
    >
      <Dot backgroundColor="#e8e8e8" width="80%" height="80%" gap="">
        <Dot backgroundColor="#68c5c8" width="95%" height="95%" gap="">
          <Dot backgroundColor="#8bd2d5" width="80%" height="80%" gap="">
            <Dot
              backgroundColor="#68c5c8"
              width="80%"
              height="80%"
              gap="10%"
              containsStripes={true}
            ></Dot>
          </Dot>
        </Dot>
      </Dot>
    </div>
  )
  const progressStyle = {
    width: `${progress}%`,
    // background: `linear-gradient(to right, #FFC0CB, #DDA0DD, #9400D3)`,
    background: `linear-gradient(to right, #FF3399, #51C7DF)`,
    height: 40,
    position: 'relative',
    overflow: 'unset'
  }
  const dotStyle = {
    position: 'absolute',
    right: -29.5,
    width: 50,
    height: 50,
    borderRadius: '50%',
    background: '#fff',
    zIndex: 2
  }

  const overlayStyle = {
    position: 'absolute',
    width: `${100}%`,
    height: 40,
    zIndex: 1,
    background: `repeating-linear-gradient(
      135deg,
      rgba(0, 0, 0, 0.1),
      rgba(0, 0, 0, 0.1) 10px,
      rgba(0, 0, 0, 0.15) 10px,
      rgba(0, 0, 0, 0.15) 20px
    )`
  }

  return (
    <div
      className="progress w-100 h-100 position-relative "
      style={{
        overflow: 'unset'
      }}
    >
      <div className="progress-bar" style={progressStyle}>
        {/*<div className="progress-dot" style={dotStyle}></div>*/}
        <ProgressDot width="60px" height="60px" />
        <div className={'progress-bar-overlay'} style={overlayStyle}></div>
      </div>
    </div>
  )
}

export const DisplayRectangleData = ({
  name,
  value,
  backgroundColor,
  loading
}) => {
  return (
    <div className={'col-md-4 d-flex align-items-center p-3'}>
      <div
        style={{
          backgroundColor: backgroundColor ?? '#ace7ec'
        }}
        className={
          'p-4 performance-data-card w-100 h-100 d-flex align-items-center flex-column justify-content-center'
        }
      >
        <div className={'text-center'} style={{ fontWeight: 600 }}>
          {name}
        </div>
        {loading ? (
          <CustomSpinner />
        ) : (
          <div
            className={'text-center'}
            style={{ fontWeight: 700, fontSize: 40 }}
          >
            {value}
          </div>
        )}
      </div>
    </div>
  )
}
