import React from 'react'
import AccordionItemWrapper from '../UI/AccordionItemWrapper'

const CurriculumOverview = (props) => {
  return (
    <AccordionItemWrapper
      isOpened={props.isOpened}
      handleAccordionClick={() => props.handleAccordionClick()}
      isExanded={props.isExpanded}
      title={props.title}
    >
      {props.isOpened && (
        <div className="accordion-content">
          {props.data?.map((data, index) => {
            return (
              <>
                <div>
                  <img
                    src={data?.imageUrl}
                    style={{
                      width: '100%',
                      // height: 100,
                      objectFit: 'contain',
                      marginBottom: 10
                    }}
                    alt="url"
                  />
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
      )}
    </AccordionItemWrapper>
  )
}

export default CurriculumOverview
