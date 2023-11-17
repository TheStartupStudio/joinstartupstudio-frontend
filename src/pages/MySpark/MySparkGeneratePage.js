import React, { useEffect, useState } from 'react'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import { Alert, Container, Row } from 'react-bootstrap'
import './style.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faSpinner } from '@fortawesome/free-solid-svg-icons'
import mySparkPrompt from '../../assets/icons/comment-alt-lines.svg'
import moment from 'moment'
import LtsButton from '../../components/LTSButtons/LTSButton'
import VerticalSeparator from '../../Separators/VerticalSeparator'
import axiosInstance from '../../utils/AxiosInstance'
import {
  addDocumentIcon,
  HTMLToString,
  imageResolutionToPercentage,
  isEmptyObject
} from './mySparkHelpersFuncs'
import GeneratePageContentContainer from './GeneratePageContentContainer'
import MyContentModal from './MyContentModal'
import DeleteSparkArchiveModal from './DeleteSparkArchiveModal'
import { toast } from 'react-toastify'
import MySparkFinalStepModal from './MySparkFinalStepModal'
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
  Image
} from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  }
})

const MyDoc = ({ archivedDocument }) => {
  return (
    <Document>
      <Page size="A4">
        <View style={styles.page}>
          <View style={styles.section}>
            <Text style={{ fontSize: 14 }}>
              {archivedDocument?.widgetName?.toUpperCase()}
            </Text>
          </View>
          <View style={styles.section}>
            <Text>{archivedDocument?.title}</Text>
          </View>
          <View style={styles.section}>
            <Text></Text>
          </View>
        </View>
        <View style={{ ...styles.page, backgroundColor: '#fff' }}>
          <View style={styles.section}>
            {archivedDocument.type !== 'image' && (
              <Text>{HTMLToString(archivedDocument?.myContent)}</Text>
            )}
            {archivedDocument.type === 'image' && (
              <View style={{ display: 'flex', justifyContent: 'center' }}>
                <Image
                  src={archivedDocument?.imageUrl}
                  alt={archivedDocument?.name}
                  style={{
                    marginHorizontal: 'auto',
                    width: imageResolutionToPercentage(
                      archivedDocument?.imageResolution
                    ).width,
                    height: imageResolutionToPercentage(
                      archivedDocument?.imageResolution
                    ).height
                  }}
                />
              </View>
            )}
          </View>
        </View>
      </Page>
    </Document>
  )
}
function MySparkGeneratePage(props) {
  const [archivedDocument, setArchivedDocument] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showMyContentModal, setShowMyContentModal] = useState(false)
  const [showDeleteSparkModal, setShowDeleteSparkModal] = useState(false)
  const [showFinalStepModal, setShowFinalStepModal] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const history = useHistory()
  const params = useParams()
  const locationState = useLocation().state
  const [isArchived, setIsArchived] = useState(false)
  const [isDeleted, setIsDeleted] = useState(false)
  const [myContentAdded, setMyContentAdded] = useState(false)
  const [isEdit, setIsEdit] = useState(false)

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
      type: 'save',
      align: 'end'
    }
  ])

  const { fromPage, data } = locationState ?? {}
  const [editingContent, setEditingContent] = useState('')

  useEffect(() => {
    if (archivedDocument?.myContent?.length > 0) {
      shouldDisplayItem('create-own-content', false)
    }
  }, [archivedDocument?.myContent])

  useEffect(() => {
    if (fromPage === 'widgets') {
      const icon = addDocumentIcon(data)
      let document = { ...data }
      document.icon = icon
      setArchivedDocument(document)
      setIsLoading(false)

      if (document?.type === 'image') {
        shouldDisplayItem('first-line', false)
        shouldDisplayItem('second-line', false)
        shouldDisplayItem('copy-button', false)
        shouldDisplayItem('download-button', false)
        shouldDisplayItem('create-own-content', false)
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

  useEffect(() => {
    if (
      fromPage === 'archive' ||
      fromPage === 'generatePage' ||
      typeof fromPage === 'undefined'
    ) {
      setIsLoading(true)
      console.log('params.id', params.id)
      if (params.id && params.id !== 0) {
        let url = `/mySparkArchive/${params.id}`
        axiosInstance
          .get(url)
          .then((res) => {
            const icon = addDocumentIcon(res.data)
            let document = { ...res.data }
            document.icon = icon
            setArchivedDocument(document)
            if (document?.myContent?.length > 0) {
              setMyContentAdded(true)
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
            setIsArchived(true)
          })
          .catch((e) => {
            if (e?.response?.status === 404) {
              toast.error(e.response?.data?.message)
              setErrorMessage(e.response?.data?.message)
            }

            setIsLoading(false)
            setIsArchived(false)
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

  const handleMyContentAdded = () => {
    if (archivedDocument?.myContent?.length > 0) {
      setMyContentAdded(true)
      setShowMyContentModal(false)
      setShowFinalStepModal(false)
    }
  }

  // todo: edit content locally if response is not saved
  const handleMyContentEdited = () => {
    setArchivedDocument({ ...archivedDocument, myContent: editingContent })
    axiosInstance
      .patch(`/mySparkArchive/${archivedDocument?.id}`, {
        myContent: editingContent
      })
      .then((res) => {
        const icon = addDocumentIcon(res?.data?.data)
        let document = { ...res?.data?.data }
        document.icon = icon
        debugger
        setArchivedDocument(document)
        setIsArchived(true)
        toast.success('Your generated spark edited successfully')
        setIsLoading(false)
      })
      .catch((e) => {
        console.log(e)
        toast.error('Your generated spark failed to edit')
        setIsLoading(false)
        setIsArchived(false)
      })
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
        setIsArchived(true)
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
        setIsArchived(false)
      })
  }
  const timeAgo = moment(archivedDocument?.updatedAt).fromNow()

  const handleCopyClick = () => {
    if (!isEmptyObject(archivedDocument)) {
      navigator.clipboard
        .writeText(
          `My Spark Content: \n ${archivedDocument?.mySparkContent} ${
            archivedDocument?.myContent?.length
              ? `\n\n My Content: \n ${archivedDocument?.myContent}`
              : ''
          }`
        )
        .then(() => {
          toast.success('Text copied to clipboard')
        })
        .catch((err) => {
          toast.error('Unable to copy text to clipboard')
        })
    }
  }

  const existMyContent = () => {
    return (
      archivedDocument?.myContent?.length > 0 || !!archivedDocument?.myContent
    )
  }

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

  console.log(showItem('create-own-content'))
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
                      'my-spark_generate-page__header_title my-spark-generate-page__border d-flex align-items-center justify-content-between'
                    }
                    style={{ flex: 1 }}
                  >
                    <div className={'my-spark_generate-page__title ms-5'}>
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
                            <GeneratePageContentContainer
                              content={archivedDocument?.mySparkContent}
                              title={'My Spark Content'}
                              // isImage={isImage()}
                              archivedDocument={archivedDocument}
                            />
                          </div>

                          {archivedDocument?.type !== 'image' &&
                            !!archivedDocument?.myContent &&
                            myContentAdded && (
                              <GeneratePageContentContainer
                                content={archivedDocument?.myContent}
                                title={'My Content'}
                                containEdit={existMyContent()}
                                openEditBox={() => {
                                  setShowMyContentModal(true)
                                  setIsEdit(true)
                                }}
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
                            // archivedDocument?.type !== 'image' &&
                            // !(
                            //   !!archivedDocument?.myContent && myContentAdded
                            // )
                            <div className={'mt-3 mb-3'}>
                              <LtsButton
                                name={'Create your own'}
                                onClick={() => setShowMyContentModal(true)}
                              />
                            </div>
                          )}

                          <div
                            className={'d-flex justify-content-between my-5'}
                          >
                            {showItem('copy-button') && (
                              <LtsButton
                                name={'Copy'}
                                width={'70%'}
                                backgroundColor={
                                  isSavedArchive() ? '#51C7DF' : '#BBBDBF'
                                }
                                align={'start'}
                                onClick={() => handleCopyClick()}
                              />
                            )}

                            {showItem('first-line') && <VerticalSeparator />}

                            {showItem('download-button') && (
                              <PDFDownloadLink
                                document={
                                  <MyDoc archivedDocument={archivedDocument} />
                                }
                                fileName={`${archivedDocument?.widgetName}.pdf`}
                                className={'w-100'}
                              >
                                {({ blob, url, loading, error }) => {
                                  if (loading) {
                                    return (
                                      <LtsButton
                                        name={'Loading document...'}
                                        width={'70%'}
                                        align={alignButton('download')}
                                        backgroundColor={
                                          isSavedArchive()
                                            ? '#99CC33'
                                            : '#BBBDBF'
                                        }
                                      />
                                    )
                                  } else {
                                    return (
                                      <LtsButton
                                        name={'Download'}
                                        width={'70%'}
                                        align={alignButton('download')}
                                        backgroundColor={
                                          isSavedArchive()
                                            ? '#99CC33'
                                            : '#BBBDBF'
                                        }
                                      />
                                    )
                                  }
                                }}
                              </PDFDownloadLink>
                            )}

                            {showItem('second-line') && <VerticalSeparator />}

                            {showItem('save-button') && (
                              <>
                                <LtsButton
                                  name={'Save to archive'}
                                  width={'70%'}
                                  backgroundColor={
                                    isSavedArchive() ? '#FF3399' : '#BBBDBF'
                                  }
                                  align={alignButton('saveToArchive')}
                                  onClick={() =>
                                    !existMyContent() &&
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
                      setIsEdit(true)
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
                        handleMyContentEdited()
                        setIsEdit(false)
                        setShowMyContentModal(false)
                      } else {
                        handleMyContentAdded()
                        setIsEdit(false)
                        setShowMyContentModal(false)
                      }
                    }}
                  />
                )}

                {showDeleteSparkModal && (
                  <DeleteSparkArchiveModal
                    show={showDeleteSparkModal}
                    onHide={() => setShowDeleteSparkModal(false)}
                    title={archivedDocument?.widgetName}
                    onDelete={(e) => handleDeleteArchive(e)}
                  />
                )}
                {showFinalStepModal && (
                  <MySparkFinalStepModal
                    show={showFinalStepModal}
                    onHide={() => setShowFinalStepModal(false)}
                    confirmFinalStep={() => {
                      setShowMyContentModal(true)
                    }}
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

export default MySparkGeneratePage
