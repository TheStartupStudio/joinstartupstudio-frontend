import React from 'react'
import AccordionItemWrapper from './AccordionItemWrapper'
import StepsBox from './Steps/StepsBox'

const CurriculumOverview = (props) => {
  return (
    <AccordionItemWrapper
      isOpened={props.isOpened}
      handleAccordionClick={() => props.handleAccordionClick()}
      isExanded={props.isExpanded}
      title={props.title}
    >
      {props.isOpened && (
        <div style={{ backgroundColor: '#fff' }}>
          <div
            style={{
              padding: '0px 20px',
              marginBottom: 20,
              backgroundColor: '#e4e9f4'
            }}
          >
            {props.data?.map((data, index) => {
              return (
                <React.Fragment key={index}>
                  <img
                    src={data?.imageUrl}
                    style={{
                      width: '100%',
                      // height: 100,
                      objectFit: 'contain',
                      marginBottom: 10
                    }}
                  />
                </React.Fragment>
              )
            })}
          </div>
          <div className="accordion-content" style={{ padding: '0 20px' }}>
            {props.data?.map((data, index) => {
              return (
                <>
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
                        __html: data?.content
                      }}
                    />
                  </div>
                </>
              )
            })}
          </div>
        </div>
      )}
    </AccordionItemWrapper>
  )
}

export default CurriculumOverview
