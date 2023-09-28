import React, { useEffect, useState } from 'react'
import { Container, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import { FormattedMessage } from 'react-intl'
import { toast } from 'react-toastify'
import useDidMountEffect from './didMountEffect'
import axiosInstance from '../../utils/AxiosInstance'
import IntlMessages from '../../utils/IntlMessages'
import { ShowMessenger } from '../../utils/helpers'
import ConnectionRequestsBox from '../../components/Connections/connectionRequestBox'
import TagBox from '../../components/Connections/tagBox'
import BlockedUserModal from '../../components/Modals/Connections/blockedUserModal'
import RemoveConnectionModal from '../../components/Modals/Connections/removeConnectionModal'
import RespondConnectionModal from '../../components/Modals/Connections/respondConnectionModal'
import { WarningModal } from '../../components/Modals/Connections/warningModal'
import { ApprovedConnections } from '../../components/Connections/approvedConnections'
import ConnectionsSlider from '../../components/Slider'
import searchIcon from '../../assets/images/search-icon.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
import Tooltip from 'react-bootstrap/Tooltip'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import _ from 'lodash'
import MisconductModal from '../../components/Modals/misconductModal'

function MyConnections() {
  const [loading, setLoading] = useState(false)
  const [connections, setConnections] = useState([])
  const [connectionRequests, setConnectionRequests] = useState([])
  // const [recommendedConnections, setRecommendedConnections] = useState([])
  const [allUsers, setAllUsers] = useState([])
  // const [allTags, setAllTags] = useState([])
  // const [selectedTags, setSelectedTags] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [respondConnectionModal1, setRespondConnectionModal] = useState(false)
  const [blockedUserModal, setBlockedUserModal] = useState(false)
  const [currentResponseId, setCurrentResponseId] = useState('')
  const [searchingUsers, setSearchingUsers] = useState(false)
  // const [recommendedUsersTags, setRecommendedUsersTags] = useState([])
  // const [selectedRecommendedTags, setSelectedRecommendedTags] = useState([])
  // const [allRecommendedConnections, setAllRecommendedConnections] = useState([])
  const [width, setWidth] = useState(null)
  // const [filteringRecommendedConnections, setFilteringRecommendedConnections] =
  //   useState(false)
  const [currentModalStatus, setCurrentModalStatus] = useState('')
  const userId = useSelector((state) => state.user.user.user.id)
  const lastLogin = useSelector((state) => state.user.user.user.last_login)
  const [showWarningModal, setShowWarningModal] = useState(false)
  const [connectionRequestId, setConnectionRequestId] = useState()
  const [connectionRequestData, setConnectionRequestData] = useState()
  const [showRemoveConnectionModal, setShowRemoveConnectionModal] =
    useState(false)
  const [connectiontoBeRemoved, setConnectiontoBeRemoved] = useState()
  const [latestRemovedConnection, setLatestRemovedConnection] = useState()
  const [removingLoader, setRemovingLoader] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const paramId = useParams().id
  const [connectionPage, setConnectionPage] = useState(0)
  const [connectionsCount, setConnectionsCount] = useState(0)

  // useEffect(() => {

  // }, [paramId])

  useEffect(() => {
    const myWidth = window.innerWidth
    setWidth(myWidth)

    // getRecommendedConnections()
    getConnectionRequests()
    getConnections()
    // getAllUsers()
    // getAllTags()

    if (lastLogin === null && !localStorage.getItem('agreedConnections'))
      setShowWarningModal(true)
  }, [])

  const resize = () => {
    setWidth(window.innerWidth)
  }

  useEffect(() => {
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [])

  useEffect(() => {
    if (connectionRequestId) return

    if (window.location.href.includes('request')) {
      const connectionRequest = connectionRequests.find(
        (cR) => cR.connectionId === parseInt(paramId)
      )

      if (connectionRequest) {
        setConnectionRequestId(paramId)
        setConnectionRequestData(connectionRequest)
        setRespondConnectionModal(true)
        setCurrentResponseId(parseInt(paramId))
      }
    }
  }, [connectionRequests])

  // useEffect(() => {
  //   filterUsers(searchedUsers)
  // }, [selectedTags])

  // useEffect(() => {
  //   filterRecommendedUsers()
  // }, [])

  // useDidMountEffect(() => {
  //   filterUsers()
  // }, [selectedTags])

  // useDidMountEffect(() => {
  //   filterRecommendedUsers()
  // }, [selectedRecommendedTags])

  const getConnections = async () => {
    await axiosInstance.get(`/connect/${connectionPage + 1}`).then((res) => {
      setConnections([...connections, ...res.data.data])
      setConnectionPage(connectionPage + 1)
      setConnectionsCount(res.data.count)
    })
  }

  const getConnectionRequests = async () => {
    await axiosInstance.get('/connect/request').then((res) => {
      setConnectionRequests(res.data.data)
    })
  }

  // const getRecommendedConnections = () => {
  //   axiosInstance
  //     .get('/connect/recommended')
  //     .then((res) => {
  //       if (res.data.users.length) {
  //         setRecommendedConnections(res.data.users)
  //         setAllRecommendedConnections(res.data.users)
  //         setRecommendedUsersTags(res.data.tags)
  //       }
  //     })
  //     .catch((e) => e)
  // }

  const toggleRespondConnectionModal = (id) => {
    const connectionRequest = connectionRequests.find(
      (cR) => cR.connectionId === parseInt(id)
    )

    if (connectionRequest) {
      setConnectionRequestData(connectionRequest)
      setRespondConnectionModal(true)
      setCurrentResponseId(parseInt(id))
    }
  }

  const toggleBlockedUserModal = () => {
    // setCurrentResponseId(id)
    setBlockedUserModal(!blockedUserModal)
  }

  const respondConnection = async (status_input) => {
    setRespondConnectionModal(false)
    if (status_input === 2) return blockUser()

    await axiosInstance
      .put('/connect', {
        id: currentResponseId,
        status: status_input
      })
      .then((res) => {
        const connection = connectionRequests.find(
          (connection) => connection.connectionId === currentResponseId
        )
        setConnectionRequests(
          connectionRequests.filter(
            (connection) => connection.connectionId !== currentResponseId
          )
        )
        if (res.data.status === 1) {
          connection.status = 'accept'
          setConnections([connection, ...connections])
          // let changedUserIndex = allUsers.findIndex(
          //   (x) => x.connectionId === currentResponseId
          // )
          // updateUserStatus(allUsers[changedUserIndex].id, 'accept')
          toast.success(<IntlMessages id="connection.accept_request" />)
        }

        if (res.data.status === 0) {
          // let changedUserIndex = allUsers.findIndex(
          //   (x) => x.connectionId === currentResponseId
          // )
          // changedUserIndex > -1 &&
          //   updateUserStatus(allUsers[changedUserIndex].id, null)

          setCurrentModalStatus('ignore')
          setBlockedUserModal(true)
        }

        // setRespondConnectionModal(false)
        setConnectionRequestData()
        setCurrentResponseId()
      })
      .catch((e) => {
        setRespondConnectionModal(false)
        toast.error(<IntlMessages id="alerts.something_went_wrong" />)
      })
  }

  const newConnectionRequest = async (id, connectionId) => {
    await axiosInstance
      .post('/connect', {
        toUserId: id
      })
      .then((res) => {
        updateUserStatus(id, 'requested')
        toast.success(<IntlMessages id="connection.request.successful" />)
      })
      .catch((e) =>
        toast.error(<IntlMessages id="alerts.something_went_wrong" />)
      )
  }

  const removeConnection = () => {
    setRemovingLoader(true)
    if (!connectiontoBeRemoved) {
      setShowRemoveConnectionModal(false)
      setRemovingLoader(false)
      return
    }

    axiosInstance
      .delete(`/connect/${connectiontoBeRemoved.id}`)
      .then(() => {
        toast.success('Connection removed successfully!')
        setConnections(
          connections.filter(
            (connection) => connection.id !== connectiontoBeRemoved.id
          )
        )
        setShowRemoveConnectionModal(false)
        setRemovingLoader(false)
        setConnectiontoBeRemoved()
        setLatestRemovedConnection(connectiontoBeRemoved.id)
      })
      .catch((e) => {
        setShowRemoveConnectionModal(false)
        setRemovingLoader(false)
        setConnectiontoBeRemoved()
        return toast.error(<IntlMessages id="alerts.something_went_wrong" />)
      })
  }

  const blockAndReport = () => {
    setShowRemoveConnectionModal(false)
    setRemovingLoader(false)

    axiosInstance
      .post('/connect/block', {
        toUserId: connectiontoBeRemoved.id
      })
      .then(() => {
        setConnections(
          connections.filter(
            (connection) => connection.id !== connectiontoBeRemoved.id
          )
        )
        setLatestRemovedConnection(connectiontoBeRemoved.id)
        setCurrentModalStatus('block-report-allowed')
        setBlockedUserModal(true)
      })
      .catch(() => {
        setConnectiontoBeRemoved()
        return toast.error(<IntlMessages id="alerts.something_went_wrong" />)
      })
  }

  const getAllUsers = _.debounce((keyword) => {
    if (keyword.length < 3) {
      setLoading(false)
      setSearchingUsers(false)
      return
    }

    setLoading(true)
    setSearchingUsers(true)

    axiosInstance
      .get(`/connect/filter-users?keyword=${keyword}`)
      .then((res) => {
        const users = res.data

        for (let i = 0; i < users.length; i++) {
          if (users[i].oneUser.length > 0) {
            if (
              users[i].oneUser[0].status == 'request' &&
              users[i].oneUser[0].user_action_id === userId
            ) {
              users[i].status = 'requested'
            } else {
              users[i].status = users[i].oneUser[0].status
              users[i].connectionId = users[i].oneUser[0].id
            }
          } else if (users[i].twoUser.length > 0) {
            if (users[i].twoUser.length > 0) {
              if (
                users[i].twoUser[0].status == 'request' &&
                users[i].twoUser[0].user_action_id === userId
              ) {
                users[i].status = 'requested'
              } else {
                users[i].status = users[i].twoUser[0].status
                users[i].connectionId = users[i].twoUser[0].id
              }
            }
          }
        }

        setAllUsers(users)
        filterUsers(users)
        setLoading(false)
      })
      .catch((e) => {
        setLoading(false)
      })
  }, 500)

  // const getAllTags = async () => {
  //   await axiosInstance.get('/tags').then((res) => {
  //     setAllTags(res.data)
  //   })
  // }

  const blockUser = async () => {
    const connection = connectionRequests.find(
      (connection) => connection.connectionId === currentResponseId
    )

    await axiosInstance
      .post('/connect/block', {
        toUserId: connection.id
      })
      .then((res) => {
        setConnectionRequests(
          connectionRequests.filter(
            (connection) => connection.connectionId !== currentResponseId
          )
        )

        setFilteredUsers(
          filteredUsers.filter(
            (connection) => connection.connectionId !== currentResponseId
          )
        )

        setAllUsers(
          allUsers.filter(
            (connection) => connection.connectionId !== currentResponseId
          )
        )
        setRespondConnectionModal(false)
        setCurrentModalStatus('block')
        setBlockedUserModal(true)
        setConnectionRequestData()
        setCurrentResponseId()
      })
      .catch((e) => e)
  }

  const handleSearch = (event) => {
    const { value } = event.target
    if (value !== '') {
      // setRecommendedConnections(allRecommendedConnections)
      getAllUsers(value)
    } else {
      setSearchingUsers(false)
      // setSelectedRecommendedTags([])
      // setSelectedTags([])
      setFilteredUsers([])
      setAllUsers([])
    }
  }

  const filterUsers = (users = false) => {
    if (users) {
      return setFilteredUsers(users)
    }

    const filteredAllUsers = allUsers?.filter((filteredUsers) => {
      if (filteredUsers.status === 'block') return false
      // if (selectedTags.length) {
      //   if (!filteredUsers.Tags.length) return false
      //   let tagCondition = false
      //   for (let i = 0; i < filteredUsers.Tags.length; i++) {
      //     if (selectedTags.includes(filteredUsers.Tags[i].id)) {
      //       tagCondition = true
      //     }
      //   }
      //   if (!tagCondition) return false
      // }

      return filteredUsers
    })
    setFilteredUsers(filteredAllUsers)
  }

  // const filterRecommendedUsers = () => {
  //   if (!selectedRecommendedTags.length) {
  //     setFilteringRecommendedConnections(false)
  //     return setRecommendedConnections(allRecommendedConnections)
  //   }

  //   setFilteringRecommendedConnections(true)
  //   const filteredAllUsers = allRecommendedConnections?.filter(
  //     (filteredUsers) => {
  //       if (filteredUsers.status === 'block') return false

  //       // if (filteredUsers.Tags.length < selectedRecommendedTags.length)
  //       //   return false
  //       if (selectedRecommendedTags.length) {
  //         if (!filteredUsers.Tags.length) return false
  //         const user_tags_ids = filteredUsers.Tags.map((tag) => {
  //           return tag.id
  //         })

  //         // const found = user_tags_ids.some(
  //         //   (r) => selectedRecommendedTags.indexOf(r) >= 0
  //         // )
  //         for (let i = 0; i < selectedRecommendedTags.length; i++) {
  //           if (!user_tags_ids.includes(selectedRecommendedTags[i]))
  //             return false
  //         }

  //         // if (!found) return false
  //       }
  //       return true
  //     }
  //   )
  //   setRecommendedConnections(filteredAllUsers)
  // }

  const updateUserStatus = (id, status) => {
    let changedUserIndex = allUsers.findIndex((x) => x.id === id)
    if (changedUserIndex < 0) return

    const updatedAllUsers = [...allUsers]

    updatedAllUsers[changedUserIndex].status = status

    setAllUsers(updatedAllUsers)

    // let changedUserIndexRecommended = recommendedConnections.findIndex(
    //   (x) => x.id === id
    // )
    // if (changedUserIndexRecommended < 0) return

    // const updatedAllRecommended = [...recommendedConnections]

    // updatedAllRecommended[changedUserIndexRecommended].status = status

    // setRecommendedConnections(updatedAllRecommended)
  }

  // const toggleTag = (id, tagState) => {
  //   if (tagState) {
  //     const newSelectedTags = [...selectedTags]
  //     newSelectedTags.push(id)
  //     setSelectedTags(newSelectedTags)
  //   } else {
  //     const newSelectedTags = selectedTags.filter((tag) => tag !== id)
  //     setSelectedTags(newSelectedTags)
  //   }
  // }

  // const toggleRecommendedTag = (id, tagState) => {
  //   if (tagState) {
  //     const newSelectedTags = [...selectedRecommendedTags]
  //     newSelectedTags.push(id)
  //     setSelectedRecommendedTags(newSelectedTags)
  //   } else {
  //     const newSelectedTags = selectedRecommendedTags.filter(
  //       (tag) => tag !== id
  //     )

  //     setSelectedRecommendedTags(newSelectedTags)
  //   }
  // }

  return (
    <Container fluid>
      <Row>
        <div className="col-12 col-xl-12 px-0">
          <div className="account-page-padding page-border">
            <div className="row ps-2">
              <div className="col-md-6">
                <h3 className="page-title mb-0">
                  <IntlMessages id="connection.page_title" />
                </h3>
                <p className="page-description mb-0">
                  <IntlMessages id="connection.page_description" />
                </p>
              </div>
              {/*<div className="col-md-6 mt-3 mt-md-0">*/}
              {/*  <div className="connections-search h-100">*/}
              {/*    <div className="input-group h-100">*/}
              {/*      <div className="input-group-prepend my-auto">*/}
              {/*        <button*/}
              {/*          className="btn btn-outline-secondary my-2 ms-2"*/}
              {/*          type="button"*/}
              {/*          id="button-addon1"*/}
              {/*        >*/}
              {/*          <img src={searchIcon} alt="#" width="90%" />*/}
              {/*        </button>*/}
              {/*      </div>*/}
              {/*      <FormattedMessage*/}
              {/*        id="connection.search_community"*/}
              {/*        defaultMessage="connection.search_community"*/}
              {/*      >*/}
              {/*        {(placeholder) => (*/}
              {/*          <input*/}
              {/*            type="text"*/}
              {/*            className="form-control"*/}
              {/*            name="searchedNote"*/}
              {/*            placeholder={placeholder}*/}
              {/*            aria-describedby="button-addon1"*/}
              {/*            onChange={(e) => {*/}
              {/*              // setLoading(true)*/}
              {/*              handleSearch(e)*/}
              {/*            }}*/}
              {/*          />*/}
              {/*        )}*/}
              {/*      </FormattedMessage>*/}
              {/*    </div>*/}
              {/*  </div>*/}
              {/*</div>*/}
            </div>
            {searchingUsers ? (
              <div className="row mt-5 ps-2">
                <h3 className="page-title text-capitalize">
                  My search results
                </h3>
                {/* <p className='page-description mb-0'>Select tags to filter:</p>
                <div className='mt-0'>
                  {allTags &&
                    allTags.map((tag) => {
                      return (
                        <TagBox key={tag.id} data={tag} toggleTag={toggleTag} />
                      )
                    })}
                </div> */}
                <div className="container-fluid content-center">
                  <div className="mb-5 row d-flex ps-2">
                    {loading && (
                      <h4 className="text-center mt-4">
                        <IntlMessages id="general.loading" />
                      </h4>
                    )}
                    {filteredUsers.length > 0 && (
                      <ConnectionsSlider
                        data={filteredUsers}
                        removeConnection={(user) => {
                          setConnectiontoBeRemoved(user)
                          setShowRemoveConnectionModal(true)
                        }}
                        newConnectionRequest={newConnectionRequest}
                        width={width}
                        toggleRespondConnectionModal={
                          toggleRespondConnectionModal
                        }
                      />
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="row ps-2 mx-auto mt-5">
                {/* <div className='row mx-auto ms-0 ps-0'>
                  <h3 className='my-connection-titles ms-0 ps-0'>
                    <IntlMessages id='connection.my_requests' />
                  </h3>
                  {connectionRequests.length === 0 ? (
                    <p className='page-description fw-light ms-0 ps-0'>
                      <IntlMessages id='connection.no_requests' />
                    </p>
                  ) : (
                    <ConnectionsSlider
                      data={connectionRequests}
                      newConnectionRequest={newConnectionRequest}
                      toggleRespondConnectionModal={
                        toggleRespondConnectionModal
                      }
                      width={width}
                    />
                  )}
                </div> */}

                {/* <div className='row mx-auto mt-5 m-0 p-0'>
                  <div className='ms-0 ps-0'>
                    <div className='d-flex'>
                      <h3 className='my-connection-titles ms-0 ps-0 mb-0'>
                        <IntlMessages id='connection.recommended_requests' />
                      </h3>
                      <OverlayTrigger
                        overlay={(props) => (
                          <Tooltip {...props}>
                            Recommendations are based on your selected tags in
                            My Account. <br />
                            To change your filters, please edit your tags in My
                            Account.
                          </Tooltip>
                        )}
                        placement='top'
                      >
                        <FontAwesomeIcon
                          icon={faQuestionCircle}
                          className='ms-2 my-auto'
                          style={{ color: '#707070' }}
                        />
                      </OverlayTrigger>
                    </div>

                    <div className='ms-3 mt-2'>
                      <div className='ms-2'>
                        {recommendedUsersTags.length > 0 && (
                          <p className='page-description mb-0'>
                            Click on a tag below to show potential connections
                            who also have also used this tag.
                          </p>
                        )}
                        {recommendedUsersTags &&
                          recommendedUsersTags.map((tag) => {
                            return (
                              <TagBox
                                key={tag.id}
                                data={tag}
                                toggleTag={toggleRecommendedTag}
                              />
                            )
                          })}
                      </div>

                      {recommendedConnections.length === 0 && (
                        <p className='page-description fw-light ms-0 ps-0'>
                          You don’t have any recommended connection requests
                          yet!
                        </p>
                      )}

                      {recommendedConnections.length > 0 && (
                        <ConnectionsSlider
                          data={recommendedConnections}
                          keyDiffer={filteringRecommendedConnections}
                          newConnectionRequest={newConnectionRequest}
                          width={width}
                        />
                      )}
                    </div>
                  </div>
                </div> */}

                <div className="mb-md-5 mx-auto row mt-5 m-0 p-0">
                  <ApprovedConnections
                    connections={connections}
                    newConnectionRequest={newConnectionRequest}
                    toggleRespondConnectionModal={toggleRespondConnectionModal}
                    removeConnection={(user) => {
                      setConnectiontoBeRemoved(user)
                      setShowRemoveConnectionModal(true)
                    }}
                    loadMore={getConnections}
                    connectionsCount={connectionsCount}
                    connectionPage={connectionPage}
                    width={width}
                    latestRemovedConnection={latestRemovedConnection}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        {/*<div className="col-12 col-xl-3 px-2">*/}
        {/*  <ConnectionRequestsBox*/}
        {/*    count={connectionsCount}*/}
        {/*    requests_count={connectionRequests.length}*/}
        {/*    type={'no-margin'}*/}
        {/*  />*/}
        {/*  <ShowMessenger />*/}
        {/*</div>*/}
      </Row>
      {respondConnectionModal1 && (
        <RespondConnectionModal
          show={respondConnectionModal1}
          onHide={() => {
            setRespondConnectionModal(false)
            setConnectionRequestData()
            setCurrentResponseId()
          }}
          respondConnection={respondConnection}
          connectionRequestData={connectionRequestData}
          data="test"
        />
      )}

      <BlockedUserModal
        show={blockedUserModal}
        onHide={() => {
          toggleBlockedUserModal()
          connectiontoBeRemoved && setShowReportModal(true)
          setCurrentModalStatus()
        }}
        reportUser={() => {
          toggleBlockedUserModal()
          setShowReportModal(true)
        }}
        hideModal={toggleBlockedUserModal}
        status={currentModalStatus}
        data="test"
      />

      <WarningModal
        show={showWarningModal}
        onHide={() => setShowWarningModal(false)}
      />

      <RemoveConnectionModal
        show={showRemoveConnectionModal}
        onHide={() => {
          setShowRemoveConnectionModal(false)
          setConnectiontoBeRemoved()
          setRemovingLoader(false)
        }}
        removeConnection={removeConnection}
        blockAndReport={blockAndReport}
        removingLoader={removingLoader}
      />
      <MisconductModal
        show={showReportModal}
        onHide={() => {
          setShowReportModal(false)
          setConnectiontoBeRemoved()
        }}
        type={'report-connection'}
        connectiontoBeRemoved={connectiontoBeRemoved}
      />
    </Container>
  )
}

export default MyConnections
