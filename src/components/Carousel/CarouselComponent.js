import React, { useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react'
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'
import './Carousel.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons'
import Pagination from 'swiper/modules/pagination/pagination'
import Navigation from 'swiper/modules/navigation/navigation'

// import { Swiper } from 'swiper'
// import { SwiperSlide } from 'swiper/vue'
// import { SwiperSlide } from 'swiper/vue'

const CarouselComponent = ({
  data,
  itemsToShow = 1,
  breakPoints = [],
  renderItems,
  transitionDuration = '0.5s',
  transitionTimingFunction = 'ease-in-out'
}) => {
  const [currentItemsToShow, setCurrentItemsToShow] = useState(itemsToShow)

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      let newItemsToShow = itemsToShow

      for (const breakpoint of breakPoints) {
        if (width >= breakpoint.width) {
          newItemsToShow = breakpoint.itemsToShow
        }
      }

      setCurrentItemsToShow(newItemsToShow)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [breakPoints, itemsToShow])

  return (
    <div
      className=''
      style={{
        maxWidth: 1200,
        width: '100%',
        margin: '0 auto',
        overflow: 'hidden'
      }}
    >
      <Swiper
        modules={[Navigation, Pagination]}
        slidesPerView={currentItemsToShow}
        // spaceBetween={30}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }}
        pagination={{ clickable: true }}
        style={{
          transitionDuration: `${transitionDuration}`,
          transitionTimingFunction: `${transitionTimingFunction}`
        }}
      >
        {data?.map((item, index) => (
          <SwiperSlide key={index}>
            <div
              // className='carousel-slide-item'
              // style={{
              //   width: `${100 / currentItemsToShow}%`
              // }}
              style={{ width: '100%' }}
            >
              {renderItems(item, index)}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom navigation buttons */}
      {/*<div className='d-flex mt-4 gap-4 justify-content-center'>*/}
      {/*  <FontAwesomeIcon*/}
      {/*    icon={faChevronLeft}*/}
      {/*    className='swiper-button-prev carousel-indicator-button me-4'*/}
      {/*  />*/}
      {/*  <FontAwesomeIcon*/}
      {/*    icon={faChevronRight}*/}
      {/*    className='swiper-button-next carousel-indicator-button ms-4'*/}
      {/*  />*/}
      {/*</div>*/}
    </div>
  )
}

export default CarouselComponent

// import React, { useState, useEffect } from 'react'
// import './Carousel.css'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import {
//   faChevronLeft,
//   faChevronRight
// } from '@fortawesome/free-solid-svg-icons'
//
// const CarouselComponent = ({
//   data,
//   itemsToShow = 1,
//   breakPoints = [],
//   renderItems,
//   transitionDuration = '0.5s',
//   transitionTimingFunction = 'ease-in-out'
// }) => {
//   const [activeIndex, setActiveIndex] = useState(0)
//   const [currentItemsToShow, setCurrentItemsToShow] = useState(itemsToShow)
//   const [totalPages, setTotalPages] = useState(
//     Math.ceil(data?.length / itemsToShow)
//   )
//   const totalItems = data?.length
//
//   const displayIndicators = totalPages > 1
//
//   const updateIndex = (direction) => {
//     setActiveIndex((prevIndex) => {
//       let newIndex = prevIndex + direction
//
//       if (newIndex < 0) {
//         newIndex = totalPages - 1
//       } else if (newIndex >= totalPages) {
//         newIndex = 0
//       }
//
//       return newIndex
//     })
//   }
//
//   useEffect(() => {
//     const handleResize = () => {
//       const width = window.innerWidth
//       let newItemsToShow = itemsToShow
//
//       for (const breakpoint of breakPoints) {
//         if (width >= breakpoint.width) {
//           newItemsToShow = breakpoint.itemsToShow
//         }
//       }
//
//       setCurrentItemsToShow(newItemsToShow)
//     }
//
//     handleResize()
//     window.addEventListener('resize', handleResize)
//
//     return () => {
//       window.removeEventListener('resize', handleResize)
//     }
//   }, [breakPoints, itemsToShow])
//
//   useEffect(() => {
//     const newTotalPages = Math.ceil(totalItems / currentItemsToShow)
//     setTotalPages(newTotalPages)
//
//     setActiveIndex((prevIndex) => Math.min(prevIndex, newTotalPages - 1))
//   }, [currentItemsToShow, totalItems])
//
//   return (
//     <div className='my-carousel'>
//       <div
//         className='inner'
//         style={{
//           transform: `translateX(-${activeIndex * 100}%)`,
//           transition: `transform ${transitionDuration} ${transitionTimingFunction}`
//         }}
//       >
//         {data?.map((item, index) => (
//           <div
//             key={index}
//             className='carousel-slide-item'
//             style={{
//               width: `${100 / currentItemsToShow}%`
//             }}
//           >
//             {renderItems(item, index)}
//           </div>
//         ))}
//       </div>
//
//       {displayIndicators && (
//         <div className='d-flex mt-4 gap-4 justify-content-center'>
//           <FontAwesomeIcon
//             icon={faChevronLeft}
//             className='carousel-indicator-button me-4'
//             onClick={() => updateIndex(-1)}
//           />
//           {Array.from({ length: totalPages }).map((_, index) => (
//             <div
//               key={index}
//               className={`carousel-indicator ${
//                 activeIndex === index ? 'active' : ''
//               }`}
//               onClick={() => setActiveIndex(index)}
//             />
//           ))}
//           <FontAwesomeIcon
//             icon={faChevronRight}
//             className='carousel-indicator-button ms-4'
//             onClick={() => updateIndex(1)}
//           />
//         </div>
//       )}
//     </div>
//   )
// }
// export default CarouselComponent
