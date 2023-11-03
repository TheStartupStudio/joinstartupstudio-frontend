import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Container, Row } from 'react-bootstrap'
import './style.css'
import { widgetInputData } from './widgetInputData'

import MySparkWidgetInputs from './MySparkWidgetInputs'
import axiosInstance from '../../utils/AxiosInstance'
import axios from 'axios'
import qs from 'qs'

function MySparkWidgetDetails(props) {
  const [shownWidgetInputs, setShownWidgetInputs] = useState([])
  const [hiddenWidgetInputs, setHiddenWidgetInputs] = useState([])
  const [prompt, setPrompt] = useState({})
  const [customFields, setCustomFields] = useState({})
  const [requestData, setRequestData] = useState({})
  const [responseData, setResponseData] = useState('')
  console.log(customFields)
  console.log(prompt)
  const location = useLocation()
  const history = useHistory()
  const widgetTitle = location?.state?.widgetTitle

  function reduceInputs(inputs, excludedFields) {
    return inputs.reduce(
      (result, input) => {
        const isExcluded = excludedFields.some((field) => field === input.title)
        if (!isExcluded) {
          result.prompt[input.title] = input.value
        } else {
          result.customFields[input.title.toLowerCase()] = input.value
        }
        return result
      },
      { prompt: {}, customFields: {} }
    )
  }

  useEffect(() => {
    const allInputs = [...shownWidgetInputs, ...hiddenWidgetInputs]
    const excludedFields = ['Name', 'Creativity']

    const { prompt, customFields } = reduceInputs(allInputs, excludedFields)
    setRequestData({
      prompt: JSON.stringify(prompt),
      ...customFields
    })
  }, [shownWidgetInputs, hiddenWidgetInputs])

  useEffect(() => {
    if (widgetTitle) {
      setShownWidgetInputs(widgetInputData[widgetTitle]?.shownWidgetInputs)
      setHiddenWidgetInputs(widgetInputData[widgetTitle]?.hiddenWidgetInputs)
    }
  }, [widgetTitle])

  const [showAdvanced, setShowAdvanced] = useState(false)
  const handleAdvancedClick = () => {
    setShowAdvanced((prevState) => !prevState)
  }

  console.log(requestData)
  const params = new URLSearchParams(requestData).toString()
  console.log(params)

  const authToken =
    'dvNDAZv7ooEJnugmtCLwzHX6tkgRiuyIhBPJkFGpqfmTuCkcFllCeJaKyli1nKHP'

  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${authToken}`
    }
  }
  const customAxios = axios.create({
    headers: {
      common: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${authToken}`
      }
    }
  })

  const handleGenerateClick = () => {
    // axios
    // .post('https://getmaze.com/api/v1/documents', requestData, config)
    console.log(qs.stringify(requestData))
    axios
      .post(
        `https://getmaze.com/api/v1/documents`,
        qs.stringify(requestData),
        config
      )
      .then((response) => {
        console.log('Response:', response.data)
        setResponseData(response?.data?.data?.result)
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }

  const updateInputValues = (state, inputName, value) => {
    return state.map((input) =>
      input.title === inputName ? { ...input, value } : input
    )
  }

  const handleInputChange = (inputName, value, type) => {
    let updatedInputs
    switch (type) {
      case 'shownInputs':
        updatedInputs = updateInputValues(shownWidgetInputs, inputName, value)
        setShownWidgetInputs(updatedInputs)
        break
      case 'hiddenInputs':
        updatedInputs = updateInputValues(hiddenWidgetInputs, inputName, value)
        setHiddenWidgetInputs(updatedInputs)
        break
      default:
        console.log(`Unhandled type: ${type}`)
    }
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
                <MySparkWidgetInputs
                  shownInputs={shownWidgetInputs}
                  hiddenInputs={hiddenWidgetInputs}
                  showAdvanced={showAdvanced}
                  onChange={(inputName, value, type) => {
                    handleInputChange(inputName, value, type)
                  }}
                />

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
              <div>{responseData}</div>
            </div>
          </div>
        </div>
      </Row>
    </Container>
  )
}

export default MySparkWidgetDetails
