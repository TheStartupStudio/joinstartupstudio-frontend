import CarouselComponent from '../components/Carousel/CarouselComponent'

import React, { useRef, useState } from 'react'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react'
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'

// Import Swiper styles
// import 'swiper/css'
// import 'swiper/css/pagination'
// import 'swiper/css/navigation'

// import './styles.css'

import Pagination from 'swiper/modules/pagination/pagination'
import Navigation from 'swiper/modules/navigation/navigation'

function Slider() {
  return (
    <>
      <Swiper
        slidesPerView={2}
        spaceBetween={30}
        loop={true}
        pagination={{
          clickable: true
        }}
        navigation={true}
        modules={[Pagination, Navigation]}
        className='mySwiper'
      >
        <SwiperSlide>Slide 1</SwiperSlide>
        <SwiperSlide>Slide 2</SwiperSlide>
        <SwiperSlide>Slide 3</SwiperSlide>
        <SwiperSlide>Slide 4</SwiperSlide>
        <SwiperSlide>Slide 5</SwiperSlide>
        <SwiperSlide>Slide 6</SwiperSlide>
        <SwiperSlide>Slide 7</SwiperSlide>
        <SwiperSlide>Slide 8</SwiperSlide>
        <SwiperSlide>Slide 9</SwiperSlide>
      </Swiper>
    </>
  )
}

const TestPage = () => {
  const products = [
    { id: 1, name: 'Product 1', color: '#f28b82' },
    { id: 2, name: 'Product 2', color: '#fbbc04' },
    { id: 3, name: 'Product 3', color: '#34a853' },
    { id: 4, name: 'Product 4', color: '#4285f4' },
    { id: 5, name: 'Product 5', color: '#ab47bc' }
  ]

  const renderProduct = (item) => (
    <div
      className='product-card'
      style={{
        backgroundColor: item.color,
        // padding: '20px',
        borderRadius: '10px'
      }}
    >
      <h2>{item.name}</h2>
    </div>
  )

  return (
    <>
      <Slider />
      {/*<CarouselComponent*/}
      {/*  data={products}*/}
      {/*  itemsToShow={3}*/}
      {/*  renderItems={renderProduct}*/}
      {/*/>*/}
      {/*<CarouselComponent*/}
      {/*  data={products}*/}
      {/*  itemsToShow={2}*/}
      {/*  renderItems={renderProduct}*/}
      {/*/>*/}
    </>
  )
}

export default TestPage
