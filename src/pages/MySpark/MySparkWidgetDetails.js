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

const authToken =
  process.env.MY_SPARK_TOKEN ??
  'dvNDAZv7ooEJnugmtCLwzHX6tkgRiuyIhBPJkFGpqfmTuCkcFllCeJaKyli1nKHP'

function MySparkWidgetDetails(props) {
  const [widgetInputs, setWidgetInputs] = useState([])
  const [requestData, setRequestData] = useState({})
  const [responseData, setResponseData] = useState('')
  const [responseImage, setResponseImage] = useState(null)
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
    // https://getmaze.com/api/v1/images
    // const url = 'https://getmaze.com/api/v1/documents'

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
    // const newReqData = {
    //   prompt: newPrompt,
    //   name: requestData.name,
    //   creativity: requestData.creativity
    // }

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

    console.log(newReqData)

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
    console.log('options', options)
    setIsLoading(true)
    axios(options)
      .then((res) => {
        console.log('Response:', res.data?.data)
        debugger
        if (res?.data?.data?.id) {
          setResponseImage(res?.data?.data)

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
          console.log(newData)
          history.push(`/my-spark/generate-page/${'newReneratedResponse'}`, {
            fromPage: 'widgets',
            data: newData
          })

          // axiosInstance.post(`/mySparkArchive`, newData).then((res) => {
          //   setResponseData(res?.data)
          //   history.push(`/my-spark/generate-page/${res?.data?.id}`, {
          //     // isNewGeneratedResponse: true,
          //     fromPage: 'widgets',
          //     data: newData
          //   })
          //   setIsLoading(false)
          // })
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

  const testString =
    'Title: Understanding Atoms and Quantum Theory in Modern Chemistry\n\nKeywords: atoms, quantum theory\n\nIntroduction:\n- Brief overview of the importance of atoms and quantum theory in modern chemistry\n\nQuantum Theory:\n- Explanation of the basic principles of quantum theory\n- Wave-particle duality and the uncertainty principle\n- Quantum numbers and their significance in describing atomic structure\n- Quantum mechanical model of the atom\n\nAtoms:\n- Historical background on the discovery of atoms\n- Atomic structure and the different subatomic particles (protons, neutrons, electrons)\n- Atomic mass and atomic number\n- Electron configuration and energy levels\n- Periodic table and its organization based on atomic structure\n\nApplications of Quantum Theory in Chemistry:\n- Understanding chemical bonding and molecular structure using quantum theory\n- Quantum mechanics and spectroscopy\n- Quantum chemical calculations and computational chemistry\n- Quantum dots and their applications in nanotechnology\n- Quantum cryptography and its role in secure communication\n\nConclusion:\n- Recap of the importance of atoms and quantum theory in modern chemistry\n- Future prospects and advancements in the field\n\nLength: Medium (around 1000-1500 words)\n\nLanguage: English\n\nVariations: The variations could include adding more specific subheadings within the Quantum Theory and Atoms sections, such as "Quantum Entanglement" or "Isotopes and Atomic Mass." Additionally, the length of the article could be adjusted to be shorter or longer based on the desired depth of coverage.'

  function formatText(text) {
    text = text?.replace(/\n\n/g, '<br/><br/>')
    text = text?.replace(/\n/g, '<br/>')
    return text
  }
  const formattedString = formatText(responseData?.result)

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
              {/*<div dangerouslySetInnerHTML={{ __html: formattedString }} />*/}
              {/*<div className={'d-flex justify-content-center'}>*/}
              {/*  {responseImage && (*/}
              {/*    <img*/}
              {/*      src={responseImage?.url}*/}
              {/*      alt={responseImage?.name}*/}
              {/*      style={{*/}
              {/*        width: +responseImage?.resolution?.split('x')[0],*/}
              {/*        height: +responseImage?.resolution?.split('x')[1]*/}
              {/*      }}*/}
              {/*    />*/}
              {/*  )}*/}
              {/*</div>*/}
            </div>
          </div>
        </div>
      </Row>
    </Container>
  )
}

export default MySparkWidgetDetails
