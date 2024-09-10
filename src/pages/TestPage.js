import React, { useState } from 'react'
import './Carousel.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons'

export const Carousel = ({ itemsToShow = 1 }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const products = [
    { id: 1, name: 'Product 1', color: '#f28b82' },
    { id: 2, name: 'Product 2', color: '#fbbc04' },
    { id: 3, name: 'Product 3', color: '#34a853' },
    { id: 4, name: 'Product 4', color: '#4285f4' },
    { id: 5, name: 'Product 5', color: '#ab47bc' }
  ]

  console.log('itemsToShow', itemsToShow)
  const totalItems = products.length
  console.log('totalItems', totalItems)
  const totalPages = Math.ceil(totalItems / itemsToShow)
  console.log('totalPages', totalPages)
  const updateIndex = (direction) => {
    setActiveIndex((prevIndex) => {
      let newIndex = prevIndex + direction
      if (newIndex < 0) {
        newIndex = 0
      } else if (newIndex >= totalPages) {
        newIndex = totalPages - 1
      }
      return newIndex
    })
  }

  return (
    <div className='my-carousel'>
      <div
        className='inner'
        style={{
          // transform: `translateX(-${activeIndex * (100 / totalPages)}%)`
          transform: `translateX(-${activeIndex * 100}%)`
        }}
      >
        {products.map((item, index) => (
          <div
            key={index}
            className='carousel-slide-item'
            style={{ width: `${100 / itemsToShow}%` }}
          >
            <div
              className='product-card'
              style={{ backgroundColor: item.color }}
            >
              <h2>{item.name}</h2>
            </div>
          </div>
        ))}
      </div>
      <div className='d-flex'>
        <FontAwesomeIcon
          icon={faChevronLeft}
          className='carousel-indicator-button'
          onClick={() => updateIndex(-1)}
        />
        {Array.from({ length: totalPages }).map((_, index) => (
          <div
            key={index}
            className={`carousel-indicator ${
              activeIndex === index ? 'active' : ''
            }`}
            onClick={() => setActiveIndex(index)}
          />
        ))}
        <FontAwesomeIcon
          icon={faChevronRight}
          className='carousel-indicator-button'
          onClick={() => updateIndex(1)}
        />
      </div>
    </div>
  )
}

const TestPage = () => {
  return (
    <>
      <Carousel itemsToShow={3} /> {/* For showing 3 items */}
      <Carousel itemsToShow={2} /> {/* For showing 2 items */}
    </>
  )
}

export default TestPage
