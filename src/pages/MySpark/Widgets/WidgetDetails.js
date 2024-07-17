import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Container, Row, Spinner } from 'react-bootstrap'
import '../style.css'
import { widgetInputData } from '../widgetInputData'

import WidgetInputs from './WidgetInputs'

import axiosInstance from '../../../utils/AxiosInstance'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import LtsButton from '../../../components/LTSButtons/LTSButton'
import useWindowWidth from '../../../hooks/useWindowWidth'
import { useDispatch } from 'react-redux'
import { setBackButton } from '../../../redux/backButtonReducer'

function WidgetDetails(props) {
  const [widgetInputs, setWidgetInputs] = useState([])
  const [requestData, setRequestData] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const windowWidth = useWindowWidth()
  const dispatch = useDispatch()
  const location = useLocation()
  const history = useHistory()
  const widgetName = location?.state?.widgetName
  const widgetType = location?.state?.widgetType
  const widgetApiType = location?.state?.widgetApiType
  function reduceInputs(inputs, nonPromptFields) {
    return inputs?.reduce(
      (result, input) => {
        const isExcluded = nonPromptFields?.some(
          (field) => field === input?.title
        )
        if (!isExcluded) {
          result.prompt[input?.title] = input?.value
        } else {
          result.nonPrompt[input?.title?.toLowerCase()] = input?.value
        }
        return result
      },
      { prompt: {}, nonPrompt: {} }
    )
  }

  useEffect(() => {
    dispatch(setBackButton(true, 'my-spark/widgets'))

    return () => {
      dispatch(setBackButton(false, ''))
    }
  }, [dispatch])

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
      prompt: {
        ...prompt,
        Template: widgetType
      },
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

  const [generateButtonClicked, setGenerateButtonClicked] = useState(false)
  const handleGenerateClick = async () => {
    setGenerateButtonClicked(true)

    setIsLoading(true)
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

    try {
      if (
        !widgetInputs?.some(
          (inp) => inp?.validation?.isRequired && inp?.value?.length === 0
        )
      ) {
        const response = await axiosInstance.post(
          `/mySparkArchive/getMazeAPI/${widgetApiType}`,
          { ...newReqData, widgetName, widgetType }
        )
        history.push(`/my-spark/generate-page/${'response'}`, {
          fromPage: 'widgets',
          data: response.data
        })
        setIsLoading(false)
      } else {
        setIsLoading(false)
      }
    } catch (error) {
      console.error(error)
      setIsLoading(false)
    }
  }
  const updateInputValues = (state, inputName, value) => {
    return state.map((input) =>
      input?.title === inputName ? { ...input, value } : input
    )
  }

  const handleInputChange = (inputName, value) => {
    const updatedInputs = updateInputValues(widgetInputs, inputName, value)
    setWidgetInputs(updatedInputs)
  }

  return (
    <Container fluid className={''}>
      <Row>
        <div className='col-12 col-xl-12 px-0'>
          <div className='account-page-padding page-border '>
            <div className='row ps-2'>
              <div className='col-md-6'>
                <h3 className='page-title mb-0'>MY SPARK</h3>
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
                <WidgetInputs
                  widgetInputs={widgetInputs}
                  showAdvanced={showAdvanced}
                  onChange={(inputName, value) => {
                    handleInputChange(inputName, value)
                  }}
                  onBlur={(inputName, value) => console.log(inputName, value)}
                  generateButtonClicked={generateButtonClicked}
                  displayedErrors={null}
                />

                <div className={'widget-details__buttons mt-2'}>
                  <LtsButton
                    name={'Advanced'}
                    width={windowWidth < 700 ? '100%' : '40%'}
                    backgroundColor={'#fff'}
                    color={'#707070'}
                    border={'1px solid #707070'}
                    onClick={() => handleAdvancedClick()}
                    ariaExpanded={showAdvanced}
                    align={'start'}
                    fontSize={12}
                  />
                  <LtsButton
                    name={'Generate'}
                    width={windowWidth < 700 ? '100%' : '40%'}
                    backgroundColor={'#51C7DF'}
                    onClick={() => handleGenerateClick()}
                    align={'end'}
                    fontSize={12}
                  />
                </div>
                {isLoading && (
                  <div className='my-spark__loader '>
                    <FontAwesomeIcon
                      icon={faSpinner}
                      className='my-spark__spinner'
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

export default WidgetDetails
