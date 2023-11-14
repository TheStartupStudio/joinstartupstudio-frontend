import React, { useEffect, useRef, useState } from 'react'
import { Container, Row, Pagination } from 'react-bootstrap'
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
import MySparkArchiveCard from './MySparkArchiveCard'
import axiosInstance from '../../utils/AxiosInstance'
import { addDocumentIcons } from './mySparkHelpersFuncs'
import { toast } from 'react-toastify'
import { useHistory } from 'react-router-dom'
import DeleteSparkArchiveModal from '../DeleteSparkArchiveModal'
import { debounce } from 'lodash'

function MySparkArchivePage(props) {
  const [archivedDocuments, setArchivedDocuments] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const history = useHistory()
  const [showDeleteSparkModal, setShowDeleteSparkModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')

  const debouncedSearch = debounce((value) => {
    // Call the search function with the debounced value
    console.log('Debounced search:', value)
    // Update the search logic here, including the API call
    getData(value)
  }, 300) // 300 milliseconds debounce time, adjust as needed

  const DEFAULT_PAGE_SIZE = 10
  useEffect(() => {
    getData('')
  }, [currentPage])

  const getData = (searchTerm) => {
    // let url = '/mySparkArchive'
    let url = `/mySparkArchive?page=${currentPage}&pageSize=${DEFAULT_PAGE_SIZE}`

    if (searchTerm?.length > 1) {
      url += `&search=${searchTerm}`
    }
    axiosInstance
      .get(url)
      .then((res) => {
        console.log('Response:', res.data)
        const { sparks, totalItems } = res.data
        const documents = addDocumentIcons(res.data.sparks)
        setTotalPages(Math.ceil(totalItems / DEFAULT_PAGE_SIZE))
        setArchivedDocuments(documents)
      })
      .catch((e) => console.log(e))
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }
  const handleDeleteArchive = (archiveId) => {
    setIsLoading(true)
    let url = `/mySparkArchive/${archiveId}`
    axiosInstance
      .delete(url)
      .then((res) => {
        toast.success(
          `Your archived spark with id: ${archiveId} deleted successfully`
        )
        let newArchivedDocuments = [...archivedDocuments]
        newArchivedDocuments = newArchivedDocuments.filter((doc) => {
          return doc.id !== archiveId
        })
        setArchivedDocuments(newArchivedDocuments)

        setIsLoading(false)
        setShowDeleteSparkModal(false)
      })
      .catch((e) => {
        console.log(e)
        toast.error('Your generated spark failed to delete')
        setIsLoading(false)
        setShowDeleteSparkModal(false)
      })
  }

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
                          onChange={(e) => {
                            setSearchTerm(e.target.value)
                            debouncedSearch(e.target.value)
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className={' my-spark-archive__cards'}>
                    {archivedDocuments?.map((document, index) => {
                      return (
                        <MySparkArchiveCard
                          key={index}
                          document={document}
                          onDeleteSpark={(archiveId) =>
                            handleDeleteArchive(archiveId)
                          }
                          showDeleteSparkModal={showDeleteSparkModal}
                        />
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Row>
      <div className={'my-spark-archive__pagination'}>
        <Pagination>
          <Pagination.Prev
            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
          />
          {[...Array(totalPages)?.keys()]?.map((page) => (
            <Pagination.Item
              key={page + 1}
              active={page + 1 === currentPage}
              onClick={() => handlePageChange(page + 1)}
            >
              {page + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() =>
              handlePageChange(Math.min(currentPage + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          />
        </Pagination>
      </div>
    </Container>
  )
}

export default MySparkArchivePage
