import React from 'react'
import { Carousel } from './CarouselComponent'

const TestPage = () => {
  const products = [
    { id: 1, name: 'Product 1', color: '#f28b82' },
    { id: 2, name: 'Product 2', color: '#fbbc04' },
    { id: 3, name: 'Product 3', color: '#34a853' },
    { id: 4, name: 'Product 4', color: '#4285f4' },
    { id: 5, name: 'Product 5', color: '#ab47bc' }
  ]

  // Render function to display each product
  const renderProduct = (item) => (
    <div
      className='product-card'
      style={{
        backgroundColor: item.color,
        padding: '20px',
        borderRadius: '10px'
      }}
    >
      <h2>{item.name}</h2>
    </div>
  )

  return (
    <>
      <Carousel data={products} itemsToShow={3} renderItems={renderProduct} />
      <Carousel data={products} itemsToShow={2} renderItems={renderProduct} />
    </>
  )
}

export default TestPage
