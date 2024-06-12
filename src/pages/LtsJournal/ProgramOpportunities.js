import React, { useState } from 'react'
import AccordionItemWrapper from './UI/AccordionItemWrapper'

const ProgramOpportunities = (props) => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(null)
  const handleSelectImage = (data, index) => {
    setSelectedImage(data)
    setSelectedImageIndex(index)
  }

  const filterImage = (index) => {
    if (
      selectedImageIndex === null ||
      typeof selectedImageIndex === 'undefined'
    ) {
      return 'grayscale(0%)'
    } else {
      if (selectedImageIndex === index) {
        return 'grayscale(0%)'
      } else {
        return 'grayscale(100%)'
      }
    }
  }
  return (
    <AccordionItemWrapper
      isOpened={props.isOpened}
      handleAccordionClick={() => props.handleAccordionClick()}
      isExanded={props.isExpanded}
      title={props.title}
    >
      {props.isOpened && (
        <div
          style={{
            backgroundColor: '#fff'
          }}
        >
          <div
            className="accordion-content"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3,1fr)',
              paddingBottom: 0,
              gap: 25
            }}
          >
            {props.data?.map((data, index) => {
              return (
                <div key={index} onClick={() => handleSelectImage(data, index)}>
                  <img
                    src={data?.imageUrl}
                    style={{
                      width: '100%',
                      objectFit: 'contain',
                      marginBottom: 10,
                      height: 100,
                      gap: 6,
                      filter: filterImage(index)
                    }}
                    alt="url"
                  />
                </div>
              )
            })}
          </div>
          <div className="accordion-content">
            {props.data?.map((index) => {
              if (index === selectedImageIndex) {
                return (
                  <div>
                    <div
                      style={{
                        fontFamily: 'Montserrat',
                        backgroundColor: '#fff',
                        marginBottom: 20,
                        textAlign: 'start',
                        width: '100%'
                      }}
                      dangerouslySetInnerHTML={{
                        __html: selectedImage?.content
                      }}
                    />
                  </div>
                )
              }
            })}
          </div>
        </div>
      )}
    </AccordionItemWrapper>
  )
}

export default ProgramOpportunities
