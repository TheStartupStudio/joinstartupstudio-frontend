import React, { useEffect, useState, useCallback } from 'react'
import _ from 'lodash'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import IntlMessages from '../../utils/IntlMessages'
import ConnectionBox from './connectionBox'
import searchIcon from '../../assets/images/search-icon.png'
import './style.css'
import axiosInstance from '../../utils/AxiosInstance'

export const ApprovedConnections = (props) => {
  const [loadingData, setLoadingData] = useState(true)
  const [searchLoader, setSearchLoader] = useState(false)
  const [showLimit, setShowLimit] = useState(0)
  const [connectionIndex, setConnectionIndex] = useState(1)
  const [debouncedState, setDebouncedState] = useState('')
  const [filteredConnections, setFilteredConnections] = useState([])

  useEffect(() => {
    if (props.width >= 1800) {
      setShowLimit(4)
      setConnectionIndex(4)
    } else if (props.width > 1340 && props.width <= 1800) {
      setShowLimit(3)
      setConnectionIndex(3)
    } else if (props.width > 1200 && props.width <= 1340) {
      setShowLimit(2)
      setConnectionIndex(2)
    } else if (props.width > 860 && props.width <= 1200) {
      setShowLimit(3)
      setConnectionIndex(3)
    } else if (props.width > 620 && props.width <= 860) {
      setShowLimit(2)
      setConnectionIndex(2)
    } else {
      setShowLimit(1)
      setConnectionIndex(1)
    }
  }, [props.width])

  useEffect(() => {
    setLoadingData(false)
  }, [props.connections])

  useEffect(() => {
    if (filteredConnections.length > 0) {
      setFilteredConnections(
        filteredConnections.filter(
          (connection) => connection.id !== props.latestRemovedConnection
        )
      )
    }
  }, [props.latestRemovedConnection])

  useEffect(() => {
    debouncedState.length > 2 ? setSearchLoader(true) : setSearchLoader(false)
  }, [debouncedState])

  const handleChange = (event) => {
    let searchedKeyword = event.target.value.replace(/\s\s+/g, ' ')
    if (searchedKeyword.length > 2) {
      setDebouncedState(searchedKeyword)
      debounce(searchedKeyword)
    } else {
      filteredConnections.length > 0 && setFilteredConnections([])
      setDebouncedState('')
    }
  }

  const debounce = useCallback(
    _.debounce((_searchVal) => {
      setDebouncedState(_searchVal)
      axiosInstance
        .get(`/connect/filter-connections?keyword=${_searchVal}`)
        .then((res) => {
          setFilteredConnections(res.data.data)
          setSearchLoader(false)
        })
        .catch((e) => e)
    }, 500),
    []
  )

  const loadMoreData = () => {
    if (showLimit < props.connectionsCount) {
      return setShowLimit(props.connectionsCount)
    }
    setLoadingData(true)
    props.loadMore()
  }

  return (
    <div className="m-0 p-0">
      <h3 className="my-connection-titles ms-0 ps-0">
        {/*<IntlMessages id='connection.page_title' />*/}
        My Classroom Portfolios
      </h3>
      {props.connections.length === 0 ? (
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
                // placeholder={'SEARCH YOUR CONNECTIONS'}
                placeholder={'SEARCH MY CLASSROOM PORTFOLIOS'}
                aria-describedby="button-addon1"
                onChange={handleChange}
              />
            </div>
          </div>
          {debouncedState.length > 2 ? (
            !searchLoader ? (
              filteredConnections.length > 0 ? (
                <div className="approved-connections-container mt-2 mt-md-0">
                  <div className="mx-3 ps-0 text-center">
                    <div className="all-approved-connections">
                      {filteredConnections?.map((user, index) => (
                        <ConnectionBox
                          key={index}
                          data={user}
                          removeConnection={props.removeConnection}
                          newConnectionRequest={props.newConnectionRequest}
                          toggleRespondConnectionModal={
                            props.toggleRespondConnectionModal
                          }
                          from={'approved-connections'}
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
                {props.connections.length > 0 &&
                  props.connections?.map(
                    (user, index) =>
                      index < showLimit && (
                        <ConnectionBox
                          key={index}
                          data={user}
                          removeConnection={props.removeConnection}
                          newConnectionRequest={props.newConnectionRequest}
                          toggleRespondConnectionModal={
                            props.toggleRespondConnectionModal
                          }
                          from={'approved-connections'}
                        />
                      )
                  )}

                {props.connections.length <= showLimit &&
                  connectionIndex -
                    (props.connections.length % connectionIndex) <
                    connectionIndex &&
                  [
                    ...Array(
                      connectionIndex -
                        (props.connections.length % connectionIndex)
                    )
                  ].map((item, index) => (
                    <div
                      className="col-auto my-connection-box mt-3 mx-2 p-3 empty-connection-box"
                      key={index}
                    ></div>
                  ))}
              </div>
              {(props.connectionsCount > props.connections.length ||
                props.connections.length > showLimit) &&
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
