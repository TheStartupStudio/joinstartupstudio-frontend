import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons'
import NoDataDisplay from '../../pages/Portfolio2024/Components/DisplayData/NoDataDisplay'

const CarouselComponent = ({
  items = [],
  renderItem,
  numOfCarouselItems = 1,
  itemClassnames,
  isEditSection = false,
  noDataText = 'No data available!',
  noDataImage,
  noDataClassnames
}) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [previousIndex, setPreviousIndex] = useState(null)
  const [direction, setDirection] = useState(null)

  const onNext = () => {
    setDirection('next')
    setPreviousIndex(activeIndex)
    // if (items?.length - 1 === activeIndex) {
    if (items?.length - numOfCarouselItems === activeIndex) {
      setActiveIndex(0)
    } else {
      // setActiveIndex(activeIndex + 1)
      setActiveIndex(activeIndex + numOfCarouselItems)
    }
  }

  const onPrevious = () => {
    setDirection('prev')
    setPreviousIndex(activeIndex)
    if (activeIndex === 0) {
      // setActiveIndex(items?.length - 1)
      setActiveIndex(items?.length - numOfCarouselItems)
    } else {
      // setActiveIndex(activeIndex - 1)
      setActiveIndex(activeIndex - numOfCarouselItems)
    }
  }

  const changeIndexWithIndicator = (index) => {
    setPreviousIndex(activeIndex)
    if (index > activeIndex) {
      setDirection('next')
    } else {
      setDirection('prev')
    }
    setActiveIndex(index)
  }

  const getActiveClass = (index) => {
    for (let i = 0; i < numOfCarouselItems; i++) {
      if (index === activeIndex + i) {
        return 'active'
      }
    }
    return ''
  }

  const getNextClass = (index) => {
    for (let i = 0; i < numOfCarouselItems; i++) {
      if (index === activeIndex + i && direction === 'next') {
        return 'next'
      }
    }
    return ''
  }

  const getHideItemNextClass = (index) => {
    for (let i = 0; i < numOfCarouselItems; i++) {
      // if (index === previousIndex && direction === 'next') {
      //   return 'hide-item-next'
      // }
      if (index === previousIndex + i && direction === 'next') {
        return 'hide-item-next'
      }
    }
    return ''
  }

  const getClassNames = (index) => {
    const classes = ['carousel-slide-item']

    const activeClass = getActiveClass(index)
    if (activeClass) classes.push(activeClass)

    // if (index === activeIndex && direction === 'next') classes.push('next')
    const nextClass = getNextClass(index)
    if (nextClass) classes.push(nextClass)

    if (index === activeIndex && direction === 'prev') classes.push('prev')

    // if (index === previousIndex && direction === 'next')
    //   classes.push('hide-item-next')
    const hideItemNextClass = getHideItemNextClass(index)
    if (hideItemNextClass) classes.push(hideItemNextClass)

    if (index === previousIndex && direction === 'prev')
      classes.push('hide-item-prev')

    return classes.join(' ')
  }

  const getStyle = (index) => {
    for (let i = 0; i < numOfCarouselItems; i++) {
      if (index === activeIndex + i && direction === 'next') {
        return {
          marginLeft: 300
        }
      }
    }
    return {}
  }

  return (
    <div className={'d-flex flex-column gap-4 w-100'}>
      <>
        {items?.length > 0 ? (
          // <div className={'d-flex w-100 '}>
          <div className={'d-flex'}>
            {items?.map((item, index) => {
              return (
                <React.Fragment key={item?.id}>
                  <div
                    className={getClassNames(index)}
                    // style={getStyle(index)}
                  >
                    {renderItem(item, isEditSection)}
                  </div>
                </React.Fragment>
              )
            })}
          </div>
        ) : (
          // </div>
          <NoDataDisplay
            src={noDataImage}
            text={noDataText}
            classNames={noDataClassnames}
          />
        )}

        <div className={'d-flex justify-content-center'}>
          <div
            className={'d-flex gap-3 align-items-center'}
            style={{ zIndex: 4 }}
          >
            <FontAwesomeIcon
              icon={faChevronLeft}
              className='carousel-indicator-button'
              onClick={onPrevious}
            />
            {Array.from({
              length: Math.ceil(items?.length / numOfCarouselItems)
            })?.map((_, index) => (
              <div
                key={index}
                className={`carousel-indicator ${
                  Math.floor(activeIndex / numOfCarouselItems) === index
                    ? 'active'
                    : ''
                }`}
                onClick={() =>
                  changeIndexWithIndicator(index * numOfCarouselItems)
                }
              />
            ))}
            <FontAwesomeIcon
              icon={faChevronRight}
              className='carousel-indicator-button'
              onClick={onNext}
            />
          </div>
        </div>
      </>
    </div>
  )
}

export default CarouselComponent
