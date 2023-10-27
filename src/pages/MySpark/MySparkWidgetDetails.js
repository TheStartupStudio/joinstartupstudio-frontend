import React, { useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Collapse, Container, Row } from 'react-bootstrap'
import './style.css'
import { FormattedMessage } from 'react-intl'

const MySparkInput = (props) => {
  const showStyle = {
    height: 'auto'
  }
  const hideStyle = {
    height: '0',
    paddingTop: '0',
    paddingBottom: '0'
  }
  return (
    <div className={'my-spark_widget-details__input_container'}>
      <label
        htmlFor={props.name}
        className={'my-spark_widget-details__input_label'}
      >
        <FormattedMessage id={`my_spark.input-label_${props.name}`} />
      </label>
      <FormattedMessage id={`my_spark.input-placeholder_${props.name}`}>
        {(placeholder) => (
          <input
            className="my-1 py-2 px-2 w-100 my-spark_widget-details__input text-dark"
            type="text"
            name={props.name}
            placeholder={placeholder}
          />
        )}
      </FormattedMessage>
      <div className={'my-spark_input-description'}>
        <FormattedMessage id={`my_spark.input-description_${props.name}`} />
      </div>
    </div>
  )
}

function MySparkWidgetDetails(props) {
  const [name, setName] = useState('')
  const [title, setTitle] = useState('')
  const [keywords, setKeywords] = useState('')
  const [subheadings, setSubheadings] = useState('')
  const [length, setLength] = useState('')

  const location = useLocation()
  const history = useHistory()

  const handleSubmit = (event) => {
    event.preventDefault()

    // Create a new article object with the form data
    const article = {
      name: name,
      title: title,
      keywords: keywords,
      subheadings: subheadings,
      length: length
    }

    // Save the article to the database or send it to a backend API
    // ...

    // Clear the form
    setName('')
    setTitle('')
    setKeywords('')
    setSubheadings('')
    setLength('')
  }

  const [showAdvanced, setShowAdvanced] = useState(false)
  const handleAdvancedClick = () => {
    setShowAdvanced((prevState) => !prevState)
  }

  const handleGenerateClick = () => {
    history.push(`/my-spark/generate-page`, {
      widgetTitle: location?.state?.widgetTitle?.toUpperCase()
    })
  }

  const showStyle = {
    height: 'auto'
  }
  const hideStyle = {
    height: '0',
    paddingTop: '0',
    paddingBottom: '0'
  }

  return (
    <Container fluid>
      <Row>
        <div className="col-12 col-xl-12 px-0">
          <div className="account-page-padding page-border">
            <div className="row ps-2">
              <div className="col-md-6">
                <h3 className="page-title mb-0">MY SPARK</h3>
              </div>
            </div>

            <div className={'my-spark_widget-details__container '}>
              <div className={'my-spark_widget-details__header_container'}>
                <div className={'my-spark_widget-details__title'}>
                  {location?.state?.widgetTitle?.toUpperCase()}
                </div>
              </div>
              <div className={'my-spark-widget-details__inputs_container'}>
                <MySparkInput name={'name'} />
                <MySparkInput name={'title'} />
                <MySparkInput name={'keywords'} />
                <MySparkInput name={'subheadings'} />
                <MySparkInput name={'length'} />

                {/*<div*/}
                {/*  className={`advanced-inputs`}*/}
                {/*  style={showAdvanced ? showStyle : hideStyle}*/}
                {/*>*/}
                {/*  <MySparkInput name={'language'} />*/}
                {/*  <MySparkInput name={'creativity'} />*/}
                {/*  <MySparkInput name={'variations'} />*/}
                {/*</div>*/}
                <Collapse in={showAdvanced} className={`advanced-inputs`}>
                  <div id="example-collapse-text">
                    <MySparkInput name={'language'} />
                    <MySparkInput name={'creativity'} />
                    <MySparkInput name={'variations'} />
                  </div>
                </Collapse>

                <div className={'d-flex justify-content-between mt-2'}>
                  <div
                    className={'advanced-button_container'}
                    onClick={handleAdvancedClick}
                    aria-controls="example-collapse-text"
                    aria-expanded={showAdvanced}
                  >
                    <div className={'advanced-button'}>Advanced</div>
                  </div>
                  <div
                    className={'generate-button_container'}
                    onClick={handleGenerateClick}
                  >
                    <div className={'generate-button'}>Generate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Row>
    </Container>
  )
}

export default MySparkWidgetDetails
