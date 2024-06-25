import React from 'react'
import AccordionItemWrapper from './UI/AccordionItemWrapper'

const ExpectedOutcomes = (props) => {
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
              minHeight: 260,
              marginBottom: 10
            }}
          >
            {props.data?.map((data, index) => {
              return (
                <React.Fragment key={index}>
                  {
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <img
                        src={data?.imageUrl}
                        style={{
                          width: data.width ?? '100%',
                          padding: data.padding ?? 0,
                          objectFit: 'contain'
                        }}
                        alt="url"
                      />
                    </div>
                  }
                  {
                    <div>
                      <div
                        style={{
                          fontFamily: 'Montserrat',
                          backgroundColor: '#fff',
                          marginBottom: 20,
                          textAlign: 'start',
                          width: '100%',
                          padding: '0 20px'
                        }}
                        dangerouslySetInnerHTML={{
                          __html: data?.content
                        }}
                      />
                    </div>
                  }
                </React.Fragment>
              )
            })}
          </div>
          {/*<div className="accordion-content" style={{ padding: '0 20px' }}>*/}
          {/*  {props.data?.map((data, index) => {*/}
          {/*    return (*/}
          {/*      <>*/}
          {/*        <div>*/}
          {/*          <div*/}
          {/*            style={{*/}
          {/*              fontFamily: 'Montserrat',*/}
          {/*              backgroundColor: '#fff',*/}
          {/*              marginBottom: 20,*/}
          {/*              textAlign: 'start',*/}
          {/*              width: '100%'*/}
          {/*            }}*/}
          {/*            dangerouslySetInnerHTML={{*/}
          {/*              __html: data?.content*/}
          {/*            }}*/}
          {/*          />*/}
          {/*        </div>*/}
          {/*      </>*/}
          {/*    )*/}
          {/*  })}*/}
          {/*</div>*/}
        </div>
      )}
    </AccordionItemWrapper>
  )
}

export default ExpectedOutcomes
