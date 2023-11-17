import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Container, Row, Spinner } from 'react-bootstrap'
import './style.css'
import { widgetInputData } from './widgetInputData'

import MySparkWidgetInputs from './MySparkWidgetInputs'
import axios from 'axios'
import qs from 'qs'
import axiosInstance from '../../utils/AxiosInstance'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
const authToken =
  process.env.MY_SPARK_TOKEN ??
  'dvNDAZv7ooEJnugmtCLwzHX6tkgRiuyIhBPJkFGpqfmTuCkcFllCeJaKyli1nKHP'

// console.log('process.env.MY_SPARK_TOKEN', process.env.MY_SPARK_TOKEN)
function MySparkWidgetDetails(props) {
  const [widgetInputs, setWidgetInputs] = useState([])
  const [requestData, setRequestData] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const location = useLocation()
  const history = useHistory()
  const widgetName = location?.state?.widgetName
  const widgetType = location?.state?.widgetType
  const widgetApiType = location?.state?.widgetApiType

  function reduceInputs(inputs, nonPromptFields) {
    return inputs?.reduce(
      (result, input) => {
        const isExcluded = nonPromptFields?.some(
          (field) => field === input.title
        )
        if (!isExcluded) {
          result.prompt[input.title] = input.value
        } else {
          result.nonPrompt[input.title.toLowerCase()] = input.value
        }
        return result
      },
      { prompt: {}, nonPrompt: {} }
    )
  }

  useEffect(() => {
    let nonPromptFields = []
    switch (widgetApiType) {
      case 'document':
        nonPromptFields.push('Name', 'Creativity')
        break
      case 'image':
        nonPromptFields.push(
          'Name',
          'Description',
          'Style',
          'Medium',
          'Filter',
          'Resolution'
        )
        break
      default:
        console.log('')
    }

    const { prompt, nonPrompt } = reduceInputs(widgetInputs, nonPromptFields)
    setRequestData({
      prompt,
      ...nonPrompt
    })
  }, [widgetInputs])

  useEffect(() => {
    if (widgetType) {
      setWidgetInputs(widgetInputData[widgetType])
    }
  }, [widgetType])

  const [showAdvanced, setShowAdvanced] = useState(false)
  const handleAdvancedClick = () => {
    setShowAdvanced((prevState) => !prevState)
  }

  const handleGenerateClick = () => {
    let url = 'https://getmaze.com/api/v1/'
    switch (widgetApiType) {
      case 'document':
        url += 'documents'
        break
      case 'image':
        url += 'images'
        break
      default:
        console.log('')
    }

    let newPrompt = ''
    const promptEntries = Object.entries(requestData.prompt)
    for (let i = 0; i < promptEntries.length; i++) {
      const [key, value] = promptEntries[i]

      newPrompt += `\n${key}:${value}`

      if (i < promptEntries.length - 1) {
        newPrompt += ','
      }
    }

    let newReqData = {}
    switch (widgetApiType) {
      case 'document':
        newReqData = {
          prompt: newPrompt,
          name: requestData.name,
          creativity: requestData.creativity
        }
        break
      case 'image':
        newReqData = {
          prompt: newPrompt,
          name: requestData.name,
          description: requestData.description,
          style: requestData.style,
          medium: requestData.medium,
          filter: requestData.filter,
          resolution: requestData.resolution
        }
        requestData.style === 'None' && delete newReqData.style
        requestData.medium === 'None' && delete newReqData.medium
        requestData.filter === 'None' && delete newReqData.filter
        requestData.resolution === 'None' && delete newReqData.resolution

        break
      default:
        console.log('')
    }

    let data = qs.stringify(newReqData)
    const options = {
      method: 'POST',
      headers: {
        common: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${authToken}`
        }
      },
      data: data,
      url
    }
    setIsLoading(true)
    axios(options)
      .then((res) => {
        console.log('Response:', res.data?.data)
        if (res?.data?.data?.id) {
          const {
            name: title,
            result: mySparkContent,
            resolution: imageResolution
          } = res?.data?.data

          const imageUrl = res?.data?.data?.url

          const newData = {
            widgetName,
            mySparkContent,
            imageUrl,
            myContent: null,
            type: widgetType,
            title,
            imageResolution
          }
          if (widgetType === 'image') {
            const match = newData.imageUrl.match(/\/images\/([\w-]+)\.jpg/)
            const imageId = match ? match[1] : null
            axiosInstance
              .get(`/mySparkArchive/getImage/${imageId}`)
              .then(({ data }) => {
                newData.imageUrl = data.imageUrl
                history.push(`/my-spark/generate-page/${'response'}`, {
                  fromPage: 'widgets',
                  data: newData
                })
                setIsLoading(false)
              })
              .catch((reason) => toast.error('Error while saving image!'))
          } else {
            history.push(`/my-spark/generate-page/${'response'}`, {
              fromPage: 'widgets',
              data: newData
            })
          }
        } else {
          setIsLoading(false)
          console.log('No valid ID in the response data.')
        }
      })
      .catch((e) => console.log(e))
  }

  const updateInputValues = (state, inputName, value) => {
    return state.map((input) =>
      input.title === inputName ? { ...input, value } : input
    )
  }

  const handleInputChange = (inputName, value) => {
    const updatedInputs = updateInputValues(widgetInputs, inputName, value)
    setWidgetInputs(updatedInputs)
  }

  return (
    <Container fluid className={''}>
      <Row>
        <div className="col-12 col-xl-12 px-0">
          <div className="account-page-padding page-border ">
            <div className="row ps-2">
              <div className="col-md-6">
                <h3 className="page-title mb-0">MY SPARK</h3>
              </div>
            </div>

            <div className={'my-spark_widget-details__container '}>
              <div className={'my-spark_widget-details__header_container'}>
                <div className={'my-spark_widget-details__title'}>
                  {location?.state?.widgetName?.toUpperCase()}
                </div>
              </div>
              <div
                className={
                  'my-spark-widget-details__inputs_container position-relative'
                }
              >
                <MySparkWidgetInputs
                  widgetInputs={widgetInputs}
                  showAdvanced={showAdvanced}
                  onChange={(inputName, value) => {
                    handleInputChange(inputName, value)
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
                {isLoading && (
                  <div className="my-spark__loader ">
                    <FontAwesomeIcon
                      icon={faSpinner}
                      className="my-spark__spinner"
                      spin
                      size={'lg'}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Row>
    </Container>
  )
}

export default MySparkWidgetDetails
