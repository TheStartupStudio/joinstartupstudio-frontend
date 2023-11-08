import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Container, Row } from 'react-bootstrap'
import './style.css'
import { widgetInputData } from './widgetInputData'

import MySparkWidgetInputs from './MySparkWidgetInputs'
import axios from 'axios'
import qs from 'qs'

const authToken =
  process.env.MY_SPARK_TOKEN ??
  'dvNDAZv7ooEJnugmtCLwzHX6tkgRiuyIhBPJkFGpqfmTuCkcFllCeJaKyli1nKHP'

function MySparkWidgetDetails(props) {
  const [widgetInputs, setWidgetInputs] = useState([])
  const [requestData, setRequestData] = useState({})
  const [responseData, setResponseData] = useState('')
  const [responseImage, setResponseImage] = useState(null)

  const location = useLocation()
  const history = useHistory()
  const widgetTitle = location?.state?.widgetTitle
  const widgetType = location?.state?.widgetType

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
    let excludedFields = []
    switch (widgetType) {
      case 'document':
        excludedFields.push('Name', 'Creativity')
        break
      case 'image':
        excludedFields.push(
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

    const { prompt, customFields } = reduceInputs(widgetInputs, excludedFields)
    console.log(prompt, customFields)
    setRequestData({
      prompt,
      ...customFields
    })
  }, [widgetInputs])

  useEffect(() => {
    const formattedWidgetTitle = widgetTitle?.split(' ')?.join('-')
    if (widgetTitle) {
      setWidgetInputs(widgetInputData[formattedWidgetTitle])
    }
  }, [widgetTitle])

  const [showAdvanced, setShowAdvanced] = useState(false)
  const handleAdvancedClick = () => {
    setShowAdvanced((prevState) => !prevState)
  }

  const handleGenerateClick = () => {
    // https://getmaze.com/api/v1/images
    // const url = 'https://getmaze.com/api/v1/documents'

    let url = 'https://getmaze.com/api/v1/'
    switch (widgetType) {
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

    console.log(requestData)

    let newReqData = {}
    switch (widgetType) {
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

    axios(options)
      .then((res) => {
        console.log('Response:', res.data?.data)

        if (res?.data?.data?.id) {
          setResponseData(res?.data?.data)
          setResponseImage(res?.data?.data)
          history.push(`/my-spark/generate-page/${res?.data?.data?.id}`, {
            responseData: res?.data?.data,
            widgetType,
            widgetTitle
          })
        } else {
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
