import React, { useEffect, useRef, useState } from 'react'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import { Alert, Container, Row } from 'react-bootstrap'
import '../style.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faSpinner } from '@fortawesome/free-solid-svg-icons'
import mySparkPrompt from '../../../assets/icons/comment-alt-lines.svg'
import moment from 'moment'
import LtsButton from '../../../components/LTSButtons/LTSButton'
import VerticalSeparator from '../../../components/Separators/VerticalSeparator'
import axiosInstance from '../../../utils/AxiosInstance'
import { addDocumentIcon, isEmptyObject } from '../mySparkHelpersFuncs'
import ContentContainer from './ContentContainer'
import MyContentModal from '../Modals/MyContentModal'
import DeleteSparkArchiveModal from '../Modals/DeleteArchiveModal'
import { toast } from 'react-toastify'
import FinalStepModal from '../Modals/FinalStepModal'
import { PDFDownloadLink } from '@react-pdf/renderer'
import PdfDocument from './PdfDocument'
import useWindowWidth from '../../../hooks/useWindowWidth'

function GeneratedResponsePage(props) {
  const [archivedDocument, setArchivedDocument] = useState({})
  const [unChangedArchivedDocument, setUnChangedArchivedDocument] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showMyContentModal, setShowMyContentModal] = useState(false)
  const [showDeleteSparkModal, setShowDeleteSparkModal] = useState(false)
  const [showFinalStepModal, setShowFinalStepModal] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const history = useHistory()
  const params = useParams()
  const locationState = useLocation().state
  const [isMyContentAdded, setIsMyContentAdded] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [existMyContent, setExistMyContent] = useState(false)
  const windowWidth = useWindowWidth()
  const [displayItem, setDisplayItem] = useState([
    {
      name: 'first-line',
      show: true
    },
    {
      name: 'second-line',
      show: true
    },
    {
      name: 'copy-button',
      show: true
    },
    {
      name: 'download-button',
      show: true
    },
    {
      name: 'save-button',
      show: true
    },
    {
      name: 'create-own-content',
      show: true
    }
  ])

  const [alignButtons, setAlignButtons] = useState([
    {
      type: 'copy',
      align: 'start'
    },
    {
      type: 'download',
      align: 'center'
    },
    {
      type: 'saveToArchive',
      align: 'end'
    }
  ])

  const { fromPage, data } = locationState ?? {}
  const [editingContent, setEditingContent] = useState('')

  // useEffect(() => {
  //   if (archivedDocument?.myContent?.length > 0) {
  //     shouldDisplayItem('create-own-content', false)
  //   } else {
  //     shouldDisplayItem('create-own-content', true)
  //   }
  // }, [archivedDocument?.myContent])

  // console.log('editingContent', editingContent)

  useEffect(() => {
    if (fromPage === 'widgets') {
      const icon = addDocumentIcon(data)
      let document = { ...data }
      document.icon = icon
      setArchivedDocument(document)
      setUnChangedArchivedDocument(document)
      setIsLoading(false)

      if (document?.type === 'image') {
        shouldDisplayItem('first-line', false)
        shouldDisplayItem('second-line', false)
        shouldDisplayItem('copy-button', false)
        shouldDisplayItem('download-button', false)
        shouldDisplayItem('create-own-content', false)
        buttonAlignment('saveToArchive', 'center')
      } else {
        shouldDisplayItem('copy-button', true)
        shouldDisplayItem('download-button', true)
        shouldDisplayItem('create-own-content', true)
      }

      if (document?.id) {
        shouldDisplayItem('download-button', true)
        shouldDisplayItem('save-button', false)
      } else if (!document?.id) {
        shouldDisplayItem('save-button', true)
      }

      if (document?.myContent?.length > 0) {
        shouldDisplayItem('create-own-content', false)
      }
    }
  }, [locationState])
  const location = useLocation()
  useEffect(() => {
    if (
      location.pathname?.includes('response') &&
      typeof fromPage === 'undefined'
    ) {
      setTimeout(() => {
        history.push('/my-spark/widgets')
      }, 2000)
    }
  }, [params, fromPage])

  useEffect(() => {
    if (
      fromPage === 'archive' ||
      fromPage === 'generatePage' ||
      typeof fromPage === 'undefined'
    ) {
      setIsLoading(true)
      if (params.id && params.id !== 0) {
        let url = `/mySparkArchive/${params.id}`
        axiosInstance
          .get(url)
          .then((res) => {
            const icon = addDocumentIcon(res.data)
            let document = { ...res.data }
            document.icon = icon
            setArchivedDocument(document)
            setUnChangedArchivedDocument(document)
            if (document?.myContent?.length > 0) {
              setIsMyContentAdded(true)
              buttonAlignment('download', 'end')
              shouldDisplayItem('first-line', true)
              shouldDisplayItem('second-line', false)
            }
            if (document?.type === 'image') {
              shouldDisplayItem('first-line', false)
              shouldDisplayItem('second-line', false)
              shouldDisplayItem('copy-button', false)
              shouldDisplayItem('download-button', false)
              shouldDisplayItem('create-own-content', false)
              buttonAlignment('saveToArchive', 'center')
            } else {
              shouldDisplayItem('copy-button', true)
              shouldDisplayItem('download-button', true)
              shouldDisplayItem('create-own-content', true)
            }

            if (document?.id) {
              shouldDisplayItem('download-button', true)
              shouldDisplayItem('save-button', false)
            } else if (!document?.id) {
              shouldDisplayItem('save-button', true)
            }

            if (document?.myContent?.length > 0) {
              shouldDisplayItem('create-own-content', false)
            }
            setIsLoading(false)
          })
          .catch((e) => {
            if (e?.response?.status === 404) {
              toast.error(e.response?.data?.message)
              setErrorMessage(e.response?.data?.message)
            }

            setIsLoading(false)
          })
      }
    }
  }, [params.id, isSaved])

  const handleEditContent = (e) => {
    setEditingContent(e)
  }
  useEffect(() => {
    setEditingContent(archivedDocument?.myContent)
  }, [archivedDocument?.myContent])
  const handleChangeDocumentContent = (myContent) => {
    setArchivedDocument({ ...archivedDocument, myContent })
  }

  const handleDeleteArchive = (myContent) => {
    setIsSaved(false)
    setIsLoading(true)
    let url = `/mySparkArchive/${params.id}`
    axiosInstance
      .delete(url)
      .then((res) => {
        toast.success('Your generated spark deleted successfully')
        setTimeout(() => {
          history.push('/my-spark/widgets')
        }, 2000)

        setIsLoading(false)
        setIsSaved(true)
        params.id = 0
      })
      .catch((e) => {
        console.log(e)
        toast.error('Your generated spark failed to delete')
        setIsLoading(false)
      })
  }

  const handleAddMyContent = () => {
    if (archivedDocument?.myContent?.length > 0) {
      setIsMyContentAdded(true)
      setShowMyContentModal(false)
      setShowFinalStepModal(false)
    }
  }

  const handleSaveEditedContent = () => {
    setArchivedDocument({ ...archivedDocument, myContent: editingContent })
    if (archivedDocument?.id) {
      axiosInstance
        .patch(`/mySparkArchive/${archivedDocument?.id}`, {
          myContent: editingContent
        })
        .then((res) => {
          const icon = addDocumentIcon(res?.data?.data)
          let document = { ...res?.data?.data }
          document.icon = icon
          setArchivedDocument(document)
          toast.success('Your generated spark edited successfully')
          setIsLoading(false)
        })
        .catch((e) => {
          console.log(e)
          toast.error('Your generated spark failed to edit')
          setIsLoading(false)
        })
    }
  }

  const handleSaveToArchive = () => {
    setIsLoading(true)
    axiosInstance
      .post(`/mySparkArchive`, archivedDocument)
      .then((res) => {
        const data = res?.data
        const icon = addDocumentIcon(data)
        let document = { ...data }
        document.icon = icon
        setArchivedDocument(document)
        toast.success('Your generated spark archived successfully')
        setIsLoading(false)
        shouldDisplayItem('create-own-content', false)
        history.push(`/my-spark/generate-page/${res?.data?.id}`, {
          fromPage: 'generatePage',
          data: document
        })
      })
      .catch((e) => {
        console.log(e)
        toast.error('Your generated spark failed to archive')
        setIsLoading(false)
      })
  }
  const timeAgo = moment(archivedDocument?.updatedAt).fromNow()
  const htmlRef = useRef(null)

  const copyToClipboard = () => {
    const range = document.createRange()
    const container = htmlRef.current
    if (container && container.style) {
      container.style.backgroundColor = 'white'
    }
    if (container && range) {
      range.selectNode(container)
    }
    const selection = window.getSelection()
    if (selection) {
      selection.removeAllRanges()
      selection.addRange(range)
      try {
        document.execCommand('copy')
        selection.removeAllRanges()
        container.style.backgroundColor = 'transparent'
        toast.success('Copied to clipboard successfully!')
      } catch (err) {
        console.error('Unable to copy to clipboard', err)
        selection.removeAllRanges()
        container.style.backgroundColor = 'transparent'
        toast.error('Error copying to clipboard')
      }
    }
  }

  const handleCopyClick = () => {
    if (!isEmptyObject(archivedDocument)) {
      copyToClipboard()
    }
  }

  useEffect(() => {
    setExistMyContent(
      archivedDocument?.myContent?.length > 0 || !!archivedDocument?.myContent
    )
  }, [archivedDocument?.myContent])

  const buttonAlignment = (type, align) => {
    let newButtons = [...alignButtons]
    let foundedButtonIndex = newButtons?.findIndex((aln) => aln.type === type)
    newButtons[foundedButtonIndex].align = align
    setAlignButtons(newButtons)
  }

  const shouldDisplayItem = (name, show) => {
    let newItems = [...displayItem]
    let foundedButtonIndex = newItems?.findIndex((aln) => aln.name === name)
    newItems[foundedButtonIndex].show = show
    setDisplayItem(newItems)
  }

  const alignButton = (type) => {
    return alignButtons?.find((btn) => btn.type === type)?.align
  }

  const showItem = (name) => {
    return displayItem?.find((btn) => btn.name === name)?.show
  }

  const isSavedArchive = () => {
    return !!archivedDocument.id
  }

  const myContentDisplayed = !!archivedDocument?.myContent && isMyContentAdded

  return (
    <>
      <Container fluid>
        <Row>
          <div className="col-12 col-xl-12 px-0">
            <div className="account-page-padding page-border">
              <div className="row ps-2">
                <div className="col-md-6">
                  <h3 className="page-title mb-0">MY SPARK</h3>
                </div>
              </div>

              <div
                className={
                  'my-spark_generate-page__container position-relative'
                }
              >
                <div
                  className={
                    'my-spark_generate-page__header_container d-flex justify-content-between'
                  }
                >
                  <div
                    className={`
                    grayish-blue-bg
                    my-spark_generate-page__icon-container
                    border-none
                    p-4
                    `}
                  >
                    <img
                      className="generate-page-type__icon "
                      src={archivedDocument?.icon}
                    />
                  </div>
                  <div
                    className={
                      'my-spark_generate-page__header_title my-spark-generate-page__border '
                    }
                    style={{ flex: 1 }}
                  >
                    <div className={'my-spark_generate-page__title'}>
                      {archivedDocument?.widgetName?.toUpperCase()}
                    </div>
                    <div></div>
                  </div>
                </div>
                <div
                  style={{ minHeight: errorMessage ? 500 : 300 }}
                  className={`grayish-blue-bg my-spark_generate-page__content ${
                    errorMessage
                      ? 'd-flex justify-content-center align-items-center w-100 '
                      : ''
                  }`}
                >
                  {!isEmptyObject(archivedDocument) ? (
                    <>
                      <div>
                        <div
                          className={
                            'my-spark_generate-page__generated-content-card'
                          }
                        >
                          <div
                            className={
                              'white-bg my-spark_generate-page__content-title_container'
                            }
                          >
                            <img
                              className="prompt-icon me-3"
                              src={mySparkPrompt}
                              alt={'my spark icon'}
                            />
                            <div
                              className={`my-spark_generate-page__content-title
                                ms-4 
                                d-flex 
                                align-items-center`}
                            >
                              {archivedDocument?.title}
                            </div>
                          </div>
                          <div
                            className={`${
                              !!archivedDocument?.myContent ? 'mb-2' : ''
                            }`}
                          >
                            <ContentContainer
                              content={archivedDocument?.mySparkContent}
                              title={'My Spark Content'}
                              archivedDocument={archivedDocument}
                              type={'mySparkContent'}
                            />
                          </div>

                          {archivedDocument?.type !== 'image' &&
                            myContentDisplayed && (
                              <ContentContainer
                                content={archivedDocument?.myContent}
                                title={'My Content'}
                                containEdit={existMyContent}
                                openEditBox={() => {
                                  setShowMyContentModal(true)
                                  setIsEdit(true)
                                }}
                                htmlRef={htmlRef}
                                type={'myContent'}
                              />
                            )}

                          <div
                            className={
                              'white-bg my-spark_generate-page__content-footer'
                            }
                          >
                            <div className={'time-ago'}>{timeAgo}</div>

                            {isSavedArchive() && (
                              <FontAwesomeIcon
                                icon={faTrash}
                                className="me-2 me-md-0 trash-icon"
                                onClick={() => setShowDeleteSparkModal(true)}
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      <div className={'d-flex justify-content-center'}>
                        <div style={{ width: '70%' }}>
                          {showItem('create-own-content') && (
                            <div className={'mt-3 mb-3'}>
                              <LtsButton
                                name={'Create your own'}
                                onClick={() => setShowMyContentModal(true)}
                              />
                            </div>
                          )}

                          <div className={'response-actions my-5'}>
                            {showItem('copy-button') && (
                              <LtsButton
                                name={'Copy'}
                                width={windowWidth < 700 ? '100%' : '70%'}
                                backgroundColor={
                                  isSavedArchive() || myContentDisplayed
                                    ? '#51C7DF'
                                    : '#BBBDBF'
                                }
                                align={alignButton('copy')}
                                onClick={() =>
                                  !myContentDisplayed
                                    ? setShowFinalStepModal(true)
                                    : handleCopyClick()
                                }
                              />
                            )}

                            {showItem('first-line') && <VerticalSeparator />}

                            {showItem('download-button') && (
                              <>
                                {myContentDisplayed ||
                                archivedDocument?.type === 'image' ? (
                                  <PDFDownloadLink
                                    document={
                                      <PdfDocument
                                        archivedDocument={archivedDocument}
                                      />
                                    }
                                    fileName={`${archivedDocument?.widgetName}.pdf`}
                                    className={'w-100 d-flex'}
                                  >
                                    {({ blob, url, loading, error }) => (
                                      <LtsButton
                                        name={'Download'}
                                        width={
                                          windowWidth < 700 ? '100%' : '70%'
                                        }
                                        align={alignButton('download')}
                                        backgroundColor={
                                          isSavedArchive() || myContentDisplayed
                                            ? '#99CC33'
                                            : '#BBBDBF'
                                        }
                                      />
                                    )}
                                  </PDFDownloadLink>
                                ) : (
                                  <LtsButton
                                    onClick={() => setShowFinalStepModal(true)}
                                    backgroundColor={
                                      isSavedArchive() || myContentDisplayed
                                        ? '#99CC33'
                                        : '#BBBDBF'
                                    }
                                    width={windowWidth < 700 ? '100%' : '70%'}
                                    name={'Download'}
                                  />
                                )}
                              </>
                            )}

                            {showItem('second-line') && <VerticalSeparator />}

                            {showItem('save-button') && (
                              <>
                                <LtsButton
                                  name={'Save to archive'}
                                  width={windowWidth < 700 ? '100%' : '70%'}
                                  backgroundColor={
                                    isSavedArchive() || myContentDisplayed
                                      ? '#FF3399'
                                      : '#BBBDBF'
                                  }
                                  align={alignButton('saveToArchive')}
                                  onClick={() =>
                                    !myContentDisplayed &&
                                    archivedDocument?.type !== 'image'
                                      ? setShowFinalStepModal(true)
                                      : handleSaveToArchive()
                                  }
                                />
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {errorMessage && (
                        <Alert variant="danger" className={'w-75'}>
                          <Alert.Heading>
                            Oh snap! You got an error!
                          </Alert.Heading>
                          <p>{errorMessage}</p>
                        </Alert>
                      )}
                    </>
                  )}
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
                {showMyContentModal && (
                  <MyContentModal
                    show={showMyContentModal}
                    onHide={() => {
                      setShowMyContentModal(false)

                      setShowFinalStepModal(false)

                      if (editingContent === '' || editingContent === null) {
                        shouldDisplayItem('create-own-content', true)
                      }
                    }}
                    content={
                      isEdit ? editingContent : archivedDocument?.myContent
                    }
                    title={archivedDocument?.widgetName}
                    handleChangeContent={(e) => {
                      if (isEdit) {
                        handleEditContent(e)
                      } else {
                        handleChangeDocumentContent(e)
                      }
                    }}
                    onSave={() => {
                      if (isEdit) {
                        handleSaveEditedContent()
                        setIsEdit(false)
                        // debugger
                        if (archivedDocument.myContent) {
                          shouldDisplayItem('create-own-content', false)
                        }
                        setShowMyContentModal(false)
                      } else {
                        handleAddMyContent()
                        setIsEdit(false)
                        if (archivedDocument.myContent) {
                          shouldDisplayItem('create-own-content', false)
                        }
                        setShowMyContentModal(false)
                      }
                    }}
                  />
                )}

                {showFinalStepModal && !showMyContentModal && (
                  <FinalStepModal
                    show={showFinalStepModal}
                    onHide={() => setShowFinalStepModal(false)}
                    confirmFinalStep={() => {
                      setShowMyContentModal(true)
                    }}
                  />
                )}
                {showDeleteSparkModal && (
                  <DeleteSparkArchiveModal
                    show={showDeleteSparkModal}
                    onHide={() => setShowDeleteSparkModal(false)}
                    title={archivedDocument?.widgetName}
                    onDelete={(e) => handleDeleteArchive(e)}
                    deleteFrom={'generatedPage'}
                  />
                )}
              </div>
            </div>
          </div>
        </Row>
      </Container>
    </>
  )
}

export default GeneratedResponsePage
