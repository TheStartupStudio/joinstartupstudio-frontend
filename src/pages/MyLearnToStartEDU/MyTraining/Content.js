import React from 'react'

const Content = ({ selectedItem }) => {
  return (
    <div className="content">
      <h1>{selectedItem.name}</h1>
      <p>{selectedItem.text}</p>
      <img src={selectedItem.image} alt={selectedItem.name} />
    </div>
  )
}

export default Content
