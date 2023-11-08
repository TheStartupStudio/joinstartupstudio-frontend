import React, { useEffect, useRef, useState } from 'react'
import { Container, Row } from 'react-bootstrap'
import {
  faAngleDown,
  faAngleUp,
  faBars,
  faBook,
  faSearch,
  faTrash
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './style.css'
import mySparkArticle from '../../assets/icons/Notebook.svg'
import mySparkPrompt from '../../assets/icons/comment-alt-lines.svg'
import mySparkResponse from '../../assets/icons/Group 1770.svg'
import mySparkConversation from '../../assets/icons/comments-alt.svg'
import mySparkBlack from '../../assets/icons/Asset 1.svg'
import axios from 'axios'
import qs from 'qs'

import moment from 'moment/moment'
import { useHistory } from 'react-router-dom'
import MySparkArchiveCard from './MySparkArchiveCard'
const authToken =
  process.env.MY_SPARK_TOKEN ??
  'dvNDAZv7ooEJnugmtCLwzHX6tkgRiuyIhBPJkFGpqfmTuCkcFllCeJaKyli1nKHP'

function MySparkArchivePage(props) {
  const [archivedDocuments, setArchivedDocuments] = useState([])
  useEffect(() => {
    let url = 'https://getmaze.com/api/v1/documents'

    // Define the parameters as an object
    const params = {
      // search: 'your_search_query',
      // search_by: 'name', // or any other value
      // template_id: 1, // or any other template ID
      // favorite: true, // or false
      sort_by: 'id', // or 'name'
      sort: 'desc', // or 'asc'
      per_page: 25 // or any other value
    }

    // Use qs.stringify to convert the parameters into a query string
    const queryString = qs.stringify(params)

    // Append the query string to the URL
    if (queryString) {
      url = `${url}?${queryString}`
    }

    const options = {
      method: 'GET',
      headers: {
        common: {
          Accept: 'application/json',
          Authorization: `Bearer ${authToken}`
        }
      },
      url
    }

    axios(options)
      .then((res) => {
        console.log('Response:', res.data?.data)
        setArchivedDocuments(res.data?.data)
        if (res?.data?.data?.id) {
          // setResponseData(res?.data?.data);
          // setResponseImage(res?.data?.data);
        } else {
          console.log('No valid ID in the response data.')
        }
      })
      .catch((e) => console.log(e))
  }, [])

  return (
    <Container fluid>
      <Row>
        <div className="col-12 col-xl-12 px-0">
          <div className="account-page-padding page-border">
            <div className="row ps-2">
              <div className="col-md-6">
                <h3 className="page-title mb-0">
                  MY SPARK | <span class={'rose-text'}>Archive</span>
                </h3>
              </div>
            </div>
            <div className="row ps-2">
              <div className="col-md-12 mt-4">
                <div className={'my-spark-archive__container'}>
                  <div className={'my-spark-archive__header-text'}>
                    <div className={'content-text'}>Content</div>
                    <div className={'archive-content-text'}>
                      Archive content
                    </div>
                  </div>
                  <div className={'row my-spark-archive__filters'}>
                    <div className={'col-md-12'}>
                      <div className={'my-spark-archive__search-filter'}>
                        <FontAwesomeIcon
                          icon={faSearch}
                          className="me-2 me-md-0 search-icon"
                        />

                        <input
                          placeholder={'Search Content'}
                          className={'search-input w-100'}
                        />
                      </div>
                    </div>
                  </div>
                  <div className={' my-spark-archive__cards'}>
                    {archivedDocuments?.map((document, index) => {
                      return (
                        <MySparkArchiveCard key={index} document={document} />
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Row>
    </Container>
  )
}

export default MySparkArchivePage
