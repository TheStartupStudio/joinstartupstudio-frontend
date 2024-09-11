import React, { useEffect, useState } from 'react'
import MyFailure from './MyFailure'
import { useDispatch, useSelector } from 'react-redux'
import {
  hideAddFailureModal,
  hideAddMentorModal,
  showAddFailureModal,
  showAddMentorModal
} from '../../../../redux/portfolio/Actions'
import SectionActions from '../../Components/Actions/SectionActions'
import AddEntryButton from '../../Components/Actions/AddEntryButton'
import MyFailureModal from '../../Components/Modals/MyFailureModal'
import failureImage from '../../../../assets/images/HS-Portfolio-Icons/failure.png'
import NoDataDisplay from '../../Components/DisplayData/NoDataDisplay'
import LTSButton from '../../../../components/LTSButtons/LTSButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons'
import CarouselComponent from '../../../../components/Carousel/CarouselComponent'
import { Carousel } from '../../../CarouselComponent'
import MyMentor from './MyMentor'
function MyFailures(props) {
  const dispatch = useDispatch()
  const mode = useSelector((state) => state.portfolio.mode)

  const [isEditSection, setIsEditSection] = useState(false)
  const showFailureModal = useSelector(
    (state) => state.portfolio.whoSection.myFailures.showAddFailureModal
  )

  const [myFailures, setMyFailures] = useState(null)

  useEffect(() => {
    if (props.data) setMyFailures(props.data)
  }, [props.data])

  const handleShowFailureModal = () => {
    dispatch(showAddFailureModal())
  }

  const handleHideFailureModal = () => {
    dispatch(hideAddFailureModal())
  }

  const handleShowModal = () => {
    dispatch(showAddFailureModal())
  }

  const handleHideModal = () => {
    dispatch(hideAddFailureModal())
  }

  const actions = [
    {
      type: 'edit',
      action: () => setIsEditSection(true),
      isDisplayed:
        mode === 'edit' && isEditSection === false && myFailures?.length > 0
    },
    {
      type: 'add',
      action: () => handleShowModal(),
      isDisplayed: mode === 'edit' && myFailures?.length === 0
    },

    {
      type: 'save',
      action: () => setIsEditSection(false),
      isDisplayed:
        mode === 'edit' && isEditSection === true && myFailures?.length > 0
    }
  ]

  const isSaving = useSelector(
    (state) => state.portfolio.whoSection.myFailures.isSaving
  )

  const [activeIndex, setActiveIndex] = useState(0)
  const [previousIndex, setPreviousIndex] = useState(null)
  const [direction, setDirection] = useState(null)

  const nextItem = () => {
    setDirection('next')
    setPreviousIndex(activeIndex)
    if (myFailures?.length - 1 === activeIndex) {
      setActiveIndex(0)
    } else {
      setActiveIndex(activeIndex + 1)
    }
  }

  const previousItem = () => {
    setDirection('prev')
    setPreviousIndex(activeIndex)
    if (activeIndex === 0) {
      setActiveIndex(myFailures?.length - 1)
    } else {
      setActiveIndex(activeIndex - 1)
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
  return (
    <div className={'d-flex flex-row h-100 '}>
      {/*{myFailures?.length > 0 ? (*/}
      {/*  myFailures?.map((myFailure, index) => {*/}
      {/*    return (*/}
      {/*      <React.Fragment key={myFailure?.id}>*/}
      {/*        <div*/}
      {/*          className={`carousel-slide-item ${*/}
      {/*            index === activeIndex ? 'active' : ''*/}
      {/*          } ${*/}
      {/*            index === activeIndex && direction === 'next' ? 'next' : ''*/}
      {/*          } */}
      {/*           ${index === activeIndex && direction === 'prev' ? 'prev' : ''}*/}
      {/*           ${*/}
      {/*             index === previousIndex && direction === 'next'*/}
      {/*               ? 'hide-item-next'*/}
      {/*               : ''*/}
      {/*           } */}
      {/*           */}
      {/*            ${*/}
      {/*              index === previousIndex && direction === 'prev'*/}
      {/*                ? 'hide-item-prev'*/}
      {/*                : ''*/}
      {/*            } */}
      {/*          */}
      {/*           `}*/}
      {/*        >*/}
      {/*          <MyFailure data={myFailure} isEditSection={isEditSection} />*/}
      {/*        </div>*/}
      {/*      </React.Fragment>*/}
      {/*    )*/}
      {/*  })*/}
      {/*) : (*/}
      {/*  <NoDataDisplay*/}
      {/*    src={failureImage}*/}
      {/*    text={'You don’t have any failures yet! Click the button to add one.'}*/}
      {/*  />*/}
      {/*)}*/}

      {/*<div className={'d-flex justify-content-center'}>*/}
      {/*  <div*/}
      {/*    className={'d-flex gap-3 align-items-center'}*/}
      {/*    style={{ zIndex: 4 }}*/}
      {/*  >*/}
      {/*    <FontAwesomeIcon*/}
      {/*      icon={faChevronLeft}*/}
      {/*      className='carousel-indicator-button'*/}
      {/*      onClick={previousItem}*/}
      {/*    />*/}
      {/*    /!*{Array.from({*!/*/}
      {/*    /!*  length: Math.ceil(items?.length / numOfCarouselItems)*!/*/}
      {/*    /!*})?.map((_, index) => (*!/*/}
      {/*    /!*  <div*!/*/}
      {/*    /!*    key={index}*!/*/}
      {/*    /!*    className={`carousel-indicator ${*!/*/}
      {/*    /!*      Math.floor(activeIndex / numOfCarouselItems) === index*!/*/}
      {/*    /!*        ? 'active'*!/*/}
      {/*    /!*        : ''*!/*/}
      {/*    /!*    }`}*!/*/}
      {/*    /!*    onClick={() =>*!/*/}
      {/*    /!*      changeIndexWithIndicator(index * numOfCarouselItems)*!/*/}
      {/*    /!*    }*!/*/}
      {/*    /!*  />*!/*/}
      {/*    /!*))}*!/*/}
      {/*    <FontAwesomeIcon*/}
      {/*      icon={faChevronRight}*/}
      {/*      className='carousel-indicator-button'*/}
      {/*      onClick={nextItem}*/}
      {/*    />*/}
      {/*  </div>*/}
      {/*</div>*/}
      {/*<CarouselComponent*/}
      {/*  items={myFailures}*/}
      {/*  renderItem={(item, isEditSection) => (*/}
      {/*    <MyFailure data={item} isEditSection={isEditSection} />*/}
      {/*  )}*/}
      {/*  isEditSection={isEditSection}*/}
      {/*  isSaving={isSaving}*/}
      {/*  noDataText={*/}
      {/*    'You don’t have any failures yet! Click the button to add one.'*/}
      {/*  }*/}
      {/*  noDataImage={failureImage}*/}
      {/*/>*/}

      <Carousel
        data={myFailures}
        itemsToShow={1}
        renderItems={(item) => {
          // return <>Test</>
          return <MyFailure data={item} isEditSection={isEditSection} />
        }}
      />

      {myFailures?.length > 0 && isEditSection && (
        <AddEntryButton
          title={`Add new "My Failures" section`}
          onClick={handleShowFailureModal}
        />
      )}
      <SectionActions actions={actions} />

      {showFailureModal && (
        <MyFailureModal
          onHide={handleHideFailureModal}
          show={showFailureModal}
          title={'Add Failure'}
          isSaving={isSaving}
        />
      )}
    </div>
  )
}

export default MyFailures
