import React, { useCallback, useEffect, useState } from 'react'
import { Container, Row } from 'react-bootstrap'

import axiosInstance from '../../utils/AxiosInstance'
import IntlMessages from '../../utils/IntlMessages'

import { SharedPeers } from './SharedPeers'
import { useSelector } from 'react-redux'

function MyClassroom() {
  const [loading, setLoading] = useState(false)

  const [searchingUsers, setSearchingUsers] = useState(false)

  const [width, setWidth] = useState(null)

  const [peerPage, setPeerPage] = useState(0)
  const [peerCount, setPeerCount] = useState(0)
  const [sharedPeers, setSharedPeers] = useState([])
  const loggedUser = useSelector((state) => state?.user?.user?.user)

  useEffect(() => {
    const myWidth = window.innerWidth
    setWidth(myWidth)
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

  const getPeers = async () => {
    await axiosInstance
      .get(`/peerSharing/peers/${peerPage + 1}`)
      .then(({ data }) => {
        if (data) {
          setSharedPeers([...sharedPeers, ...data.rows])
          setPeerPage(peerPage + 1)
          setPeerCount(data.count)
        }
      })
  }
  const getInstructorPeers = async () => {
    await axiosInstance
      .get(`/peerSharing/peers/${peerPage + 1}/instructor/${loggedUser.id}`)
      .then(({ data }) => {
        if (data) {
          setSharedPeers([...sharedPeers, ...data.rows])
          setPeerPage(peerPage + 1)
          setPeerCount(data.count)
        }
      })
  }

  useEffect(() => {
    if (loggedUser.Role.id === 2) {
      getInstructorPeers()
    } else {
      getPeers()
    }
  }, [])

  return (
    <Container fluid>
      <Row>
        <div className="col-12 col-xl-12 px-0">
          <div className="account-page-padding page-border">
            <div className="row ps-2">
              <div className="col-md-6">
                <h3 className="page-title mb-0">My Portfolios</h3>
                <p className="page-description mb-0">
                  View the portfolios of your students.
                </p>
              </div>
            </div>
            {searchingUsers ? (
              <div className="row mt-5 ps-2">
                <h3 className="page-title text-capitalize">
                  My search results
                </h3>

                <div className="container-fluid content-center">
                  <div className="mb-5 row d-flex ps-2">
                    {loading && (
                      <h4 className="text-center mt-4">
                        <IntlMessages id="general.loading" />
                      </h4>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="row ps-2 mx-auto mt-5">
                <div className="mb-md-5 mx-auto row mt-5 m-0 p-0">
                  <SharedPeers
                    peers={sharedPeers}
                    loadMore={getPeers}
                    peersCount={peerCount}
                    peerPage={peerPage}
                    width={width}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </Row>
    </Container>
  )
}

export default MyClassroom
