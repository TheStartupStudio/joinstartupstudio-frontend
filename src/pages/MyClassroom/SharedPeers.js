import React, { useEffect, useState, useCallback } from 'react'
import _ from 'lodash'
import IntlMessages from '../../utils/IntlMessages'
import searchIcon from '../../assets/images/search-icon.png'
import '../../components/Connections/style.css'
import axiosInstance from '../../utils/AxiosInstance'
import SharedPeerBox from './SharedPeerBox'
import { useSelector } from 'react-redux'

export const SharedPeers = (props) => {
  const [loadingData, setLoadingData] = useState(true)
  const [searchLoader, setSearchLoader] = useState(false)
  const [showLimit, setShowLimit] = useState(0)
  const [peerIndex, setPeerIndex] = useState(1)
  const [debouncedState, setDebouncedState] = useState('')
  const [filteredPeers, setFilteredPeers] = useState([])
  const loggedUser = useSelector((state) => state?.user?.user?.user)
  useEffect(() => {
    if (props.width >= 1800) {
      setShowLimit(4)
      setPeerIndex(4)
    } else if (props.width > 1340 && props.width <= 1800) {
      setShowLimit(3)
      setPeerIndex(3)
    } else if (props.width > 1200 && props.width <= 1340) {
      setShowLimit(2)
      setPeerIndex(2)
    } else if (props.width > 860 && props.width <= 1200) {
      setShowLimit(3)
      setPeerIndex(3)
    } else if (props.width > 620 && props.width <= 860) {
      setShowLimit(2)
      setPeerIndex(2)
    } else {
      setShowLimit(1)
      setPeerIndex(1)
    }
  }, [props.width])

  useEffect(() => {
    setLoadingData(false)
  }, [props.peers])

  useEffect(() => {
    debouncedState.length > 2 ? setSearchLoader(true) : setSearchLoader(false)
  }, [debouncedState])

  const handleChange = (event) => {
    let searchedKeyword = event.target.value.replace(/\s\s+/g, ' ')
    if (searchedKeyword.length > 2) {
      setDebouncedState(searchedKeyword)
      debounce(searchedKeyword)
    } else {
      filteredPeers.length > 0 && setFilteredPeers([])
      setDebouncedState('')
    }
  }

  // eslint-disable-next-line
  const debounce = useCallback(
    _.debounce((_searchVal) => {
      setDebouncedState(_searchVal)
      const url =
        loggedUser.Role.id === 2
          ? `/peerSharing/peers/${_searchVal}/search/instructor/${loggedUser.id}`
          : `/peerSharing/peers/${_searchVal}/search`
      axiosInstance
        .get(url)
        .then((res) => {
          setFilteredPeers(res.data)
          setSearchLoader(false)
        })
        .catch((e) => e)
    }, 500),
    []
  )

  const loadMoreData = () => {
    if (showLimit < props.peersCount) {
      return setShowLimit(props.peersCount)
    }
    setLoadingData(true)
    props.loadMore()
  }

  return (
    <div className="m-0 p-0">
      <h3 className="my-connection-titles ms-0 ps-0">
        {/*<IntlMessages id="connection.page_title" />*/}
        My Classroom
      </h3>
      {props.peers.length === 0 ? (
        <div className="ms-3 ps-0">
          <p className="page-description fw-light ms-0 ps-0">
            <IntlMessages id="connection.no_connections" />
          </p>
        </div>
      ) : (
        <>
          <div className="connections-search" style={{ height: '48px' }}>
            <div className="input-group h-100">
              <div className="input-group-prepend my-auto">
                <button
                  className="btn btn-outline-secondary my-2 ms-2"
                  type="button"
                  id="button-addon1"
                >
                  <img src={searchIcon} alt="#" width="90%" />
                </button>
              </div>

              <input
                type="text"
                className="form-control"
                name="searchedNote"
                placeholder={'SEARCH YOUR PEERS'}
                aria-describedby="button-addon1"
                onChange={handleChange}
              />
            </div>
          </div>
          {debouncedState.length > 2 ? (
            !searchLoader ? (
              filteredPeers.length > 0 ? (
                <div className="approved-connections-container mt-2 mt-md-0">
                  <div className="mx-3 ps-0 text-center">
                    <div className="all-approved-connections">
                      {filteredPeers?.map((user, index) => (
                        <SharedPeerBox
                          key={index}
                          data={user}
                          from={'my-classroom'}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="search-results mt-2 mt-md-0">
                  <p className="load-data" style={{ cursor: 'inherit' }}>
                    No results found!
                  </p>
                </div>
              )
            ) : (
              <div className="search-results mt-2 mt-md-0">
                <p className="load-data" style={{ cursor: 'inherit' }}>
                  Searching...
                </p>
              </div>
            )
          ) : (
            <div className="mx-2 ps-0 mt-2 mt-md-0 text-center approved-connections-container">
              <div className="all-approved-connections">
                {props.peers.length > 0 &&
                  props.peers?.map(
                    (user, index) =>
                      index < showLimit && (
                        <SharedPeerBox
                          key={index}
                          data={user}
                          from={'my-classroom'}
                        />
                      )
                  )}

                {props.peers.length <= showLimit &&
                  peerIndex - (props.peers.length % peerIndex) < peerIndex &&
                  [...Array(peerIndex - (props.peers.length % peerIndex))].map(
                    (item, index) => (
                      <div
                        className="col-auto my-connection-box mt-3 mx-2 p-3 empty-connection-box"
                        key={index}
                      ></div>
                    )
                  )}
              </div>
              {(props.peersCount > props.peers.length ||
                props.peers.length > showLimit) &&
                !loadingData && (
                  <>
                    <hr
                      className="m-auto mt-3"
                      style={{ width: '20%', color: '#01c5d1' }}
                    />
                    <p
                      className="load-data mt-2"
                      onClick={() => {
                        loadMoreData()
                      }}
                    >
                      Load More
                    </p>
                  </>
                )}
              {loadingData && (
                <>
                  <hr
                    className="m-auto mt-3"
                    style={{ width: '20%', color: '#01c5d1' }}
                  />

                  <p className="mt-2 load-data" style={{ cursor: 'inherit' }}>
                    Loading Data...
                  </p>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
