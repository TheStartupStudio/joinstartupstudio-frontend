import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axiosInstance from '../../utils/AxiosInstance'
import IntlMessages from '../../utils/IntlMessages'
import { changeSidebarState } from '../../redux'
import Video from '../../components/Video'
import ReactPaginate from 'react-paginate'
import { Link, useHistory } from 'react-router-dom'
import '../Saved/index.css'
import { setBackButton } from '../../redux/backButtonReducer'
import './index.css'
import Select from 'react-select'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import ModalInput from '../../components/ModalInput/ModalInput'
import searchJ from '../../assets/images/academy-icons/search.png'
import { injectIntl } from 'react-intl';

function GuidanceEncouragement({ intl }) {
  const history = useHistory(); // Add this hook
  
  const [pageTitle, setPageTitle] = useState('')
  const [pageDescription, setPageDescription] = useState('')
  const [pageVideos, setPageVideos] = useState([])
  const [currentPageVideos, setCurrentPageVideos] = useState([])
  const [pageCount, setPageCount] = useState(0)
  const [itemOffset, setItemOffset] = useState(0)
  const currentLanguage = useSelector((state) => state.lang.locale)
  const [connections, setConnections] = useState([])
  const videosPerPage = 9
  const [activeLevel, setActiveLevel] = useState(0);
  const levels = [
    { id: 1, title: "Encouragement Videos" },
    { id: 2, title: "Career Guidance Videos" },
    { id: 3, title: "Story in Motion Podcast Episodes" }
  ];
   const [selectedLanguage, setSelectedLanguage] = useState(null);
   const [filterBy,setFilterBy]=useState(null);

   const filters=[
    {value:'tl',label:'Title'},
    {value:'dt',label:'Date'},
   ]
  
    const options = [
      { value: 'en', label: 'English' },
      { value: 'es', label: 'Spanish' }
    ]
  
    const handleChange = (selectedOption) => {
      setSelectedLanguage(selectedOption)
      console.log('Selected Language:', selectedOption.value)
    }

    const handleFilter=(selectedFilter)=>{
      setFilterBy(selectedFilter)
    }
    const handleJournalSearch = (e) => {
      const keyword = e.target.value.toLowerCase();

      if (!keyword) {
        const endOffset = itemOffset + videosPerPage;
        setCurrentPageVideos(pageVideos.slice(itemOffset, endOffset));
        return;
      }

      const filteredVideos = pageVideos.filter(
        (video) =>
          video.title.toLowerCase().includes(keyword) ||
          video.description.toLowerCase().includes(keyword)
      );

      setCurrentPageVideos(filteredVideos);
    }

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setBackButton(true, 'story-in-motion'))

    return () => {
      dispatch(setBackButton(false, ''))
    }
  }, [dispatch])

  useEffect(() => {
    dispatch(changeSidebarState(false))
  }, [dispatch])

  useEffect(() => {
    const endOffset = itemOffset + videosPerPage
    setCurrentPageVideos(pageVideos.slice(itemOffset, endOffset))
    setPageCount(Math.ceil(pageVideos.length / videosPerPage))
  }, [pageVideos, itemOffset, videosPerPage])

  const handlePageClick = (event) => {
    const newOffset = (event.selected * videosPerPage) % pageVideos.length
    setItemOffset(newOffset)
  }

  useEffect(() => {
    if (window.location.href.includes('encouragement/videos')) {
      setActiveLevel(0)
    } else if (window.location.href.includes('master-classes/videos')) {
      setActiveLevel(1)
    } else if (window.location.href.includes('story-in-motion/videos')) {
      setActiveLevel(2)
    }
    getUserConnections()
  }, [])

  useEffect(() => {
    switch(activeLevel) {
      case 0: // Encouragement Videos
        setPageTitle('MASTER CLASSES | ENCOURAGEMENT VIDEOS')
        setPageDescription('beyond_your_course.encouragement_description')
        getEncouragementVideos()
        break;
      case 1: // Career Guidance Videos
        setPageTitle('MASTER CLASSES | CAREER GUIDANCE')
        setPageDescription('beyond_your_course.master_classes_description')
        getMasterClassVideos()
        break;
      case 2: // Story in Motion Podcast Episodes
        setPageTitle('MASTER CLASSES | STORY IN MOTION PODCAST EPISODES')
        setPageDescription('startup_live.startup_archive_description')
        getStartupLiveVideos()
        break;
      default:
        break;
    }
  }, [activeLevel])

  const getUserConnections = async () => {
    await axiosInstance.get('/connect').then((res) => {
      setConnections(res.data.data)
    })
  }

  const getEncouragementVideos = async () => {
    await axiosInstance
      .get(`/contents/by-type/guidance`)
      .then((response) => {
        setPageVideos(response.data)
        setItemOffset(0);
      })
      .catch((err) => err)
  }

  const getMasterClassVideos = async () => {
    await axiosInstance
      .get(`/contents/by-type/master`)
      .then((response) => {
        setPageVideos(response.data)
        setItemOffset(0);
      })
      .catch((err) => err)
  }

  const getStartupLiveVideos = async () => {
    await axiosInstance
      .get(`/contents/by-type/story-in-motion`)
      .then((response) => {
        setPageVideos(response.data)
        setItemOffset(0);
      })
      .catch((err) => err)
  }

  // Add this function to determine the subtitle based on URL
  const getSubtitle = () => {
    if (window.location.href.includes('encouragement/videos')) {
      return 'Encouragement Videos';
    } else if (window.location.href.includes('master-classes/videos')) {
      return 'Career Guidance';
    } else if (window.location.href.includes('startup-live/videos')) {
      return 'Story in Motion Podcast Episodes';
    }
    return '';
  };

  const handleLevelChange = (index) => {
    setActiveLevel(index);
    switch(index) {
      case 0:
        history.push('/encouragement/videos');
        break;
      case 1:
        history.push('/master-classes/videos');
        break;
      case 2:
        history.push('/story-in-motion/videos');
        break;
      default:
        break;
    }
  };

  return (
    <div id='main-body'>
      <div>
        <div className='row'>
          <div className='col-12 col-xl-12'>
            <div className='account-padding-page'>
              <div
                style={
                  pageVideos && pageVideos.length < 1
                    ? { height: '1000px' }
                    : null
                }
              >
                <div style={{margin:'0 1rem'}}>
                  <div style={{marginBottom:'2rem'}}>
                    <Link to='/beyond-your-course' style={{color:'#000000'}}>Master Classes &gt; </Link>
                    <span>{getSubtitle()}</span>
                  </div>
                 <div className='d-flex justify-content-between'>
                <div>
                <h3 className='page-title'>
                    {pageTitle && <span> {pageTitle} </span>}
                  </h3>
                  <p className='page-description' style={{fontSize:'15px'}}>
                    {pageDescription && (
                      <IntlMessages id={`${pageDescription}`} />
                    )}
                  </p>
                </div>
                  <div
                 style={{
                                  display: 'inline-block',
                                  borderRadius: '8px',
                                  background:
                                    'linear-gradient(to bottom, #FF3399 0%, #51C7DF 100%)',
                                  padding: '1px', // Adjust this value to control border thickness
                                  height: '58px',
                                  boxShadow: '0px 4px 10px 0px #00000040'
                                }}>  
                    <Select
                                             options={options}
                                             value={selectedLanguage}
                                             onChange={handleChange}
                                             placeholder='Select Language'
                                             menuPortalTarget={document.body}
                                             isSearchable={false}
                                             styles={{
                                               menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                               control: (base) => ({
                                                 ...base,
                                                 width: '250px', // Fixed width
                                                 minHeight: '40px', // Fixed height
                                                 overflow: 'hidden',
                                                 border: 'none', // Remove the default border
                                                 borderRadius: '6px' // Slightly smaller than the outer container radius
                                               }),
                                               singleValue: (base) => ({
                                                 ...base,
                                                 whiteSpace: 'nowrap',
                                                 overflow: 'hidden',
                                                 textOverflow: 'ellipsis'
                                               })
                                             }}
                                             components={{
                                               IndicatorSeparator: () => null // Remove separator
                                             }}
                                           /></div>
                 </div>
              
                </div>
           <div className='gradient-background-master'>
                <div className="level-navigation">
                  {levels.map((level, index) => (
                    <div
                      key={level.id}
                     
                      className={`course-level ${activeLevel === index ? 'active-level-master' : ''}`}
                      onClick={() => handleLevelChange(index)}
                    >
                      {level.title}
                    </div>
                  ))}
                </div>
                <div className="d-flex justify-content-between">
                <div className="search-input-wrapper">
                    <div className='justify-content-between'>
            <div>
              <ModalInput
              
               className='course-btn search-journal'
               onChange={handleJournalSearch}
                id={'searchBar'}
                type={'search'}
                labelTitle={intl.formatMessage({
                  id: 'my_journal.search_lessons_',
                  defaultMessage: 'Search lessons'
                })}
                imgSrc={searchJ}
                imageStyle={{ filter: 'grayscale(1)' }}
              />
            </div>
          </div>
          </div>
                <div
                 style={{
                                  display: 'inline-block',
                                  borderRadius: '8px',
                                  background:
                                    'linear-gradient(to bottom, #FF3399 0%, #51C7DF 100%)',
                                  padding: '1px', // Adjust this value to control border thickness
                                  height: '58px',
                                  boxShadow: '0px 4px 10px 0px #00000040',
                             
                                }}>  
                    <Select
                                             options={filters}
                                             value={filterBy}
                                             onChange={handleFilter}
                                             placeholder='Sort By'
                                             menuPortalTarget={document.body}
                                             isSearchable={false}
                                             styles={{
                                               menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                               control: (base) => ({
                                                 ...base,
                                                 width: '157px', // Fixed width
                                                 minHeight: '40px', // Fixed height
                                                 overflow: 'hidden',
                                                 border: 'none', // Remove the default border
                                                 borderRadius: '6px' // Slightly smaller than the outer container radius
                                               }),
                                               singleValue: (base) => ({
                                                 ...base,
                                                 whiteSpace: 'nowrap',
                                                 overflow: 'hidden',
                                                 textOverflow: 'ellipsis'
                                               })
                                             }}
                                             components={{
                                               IndicatorSeparator: () => null // Remove separator
                                             }}
                                           /></div>

                                           </div>
                 
                <div className='row videos-container '>
                  {currentPageVideos?.map((video, index) => (
                    <Video
                      id={video.id}
                      key={index}
                      thumbnail={video.thumbnail}
                      title={video.title}
                      description={video.description}
                      page={
                        window.location.href.includes('story-in-motion/videos')
                          ? 'story-in-motion'
                          : pageTitle === 'CAREER GUIDANCE'
                          ? 'master-classes'
                          : 'encouragement'
                      }
                      videoData={video}
                      connections={connections}
                      type={'view-all'}
                    />
                  ))}
                  
                  {/* Pagination moved inside videos-container */}
                  {pageVideos.length > videosPerPage && (
                    <div className='w-100 d-flex justify-content-center mt-4'>
                      <div className="pagination-info">
                        <ReactPaginate
                          previousLabel="<<"
                          nextLabel=">>"
                          breakLabel="..."
                          pageCount={pageCount}
                          marginPagesDisplayed={1}
                          pageRangeDisplayed={3}
                          onPageChange={handlePageClick}
                          containerClassName="pagination custom-pagination"
                          pageClassName="page-item"
                          pageLinkClassName="page-link"
                          previousClassName="page-item"
                          previousLinkClassName="page-link"
                          nextClassName="page-item" 
                          nextLinkClassName="page-link"
                          breakClassName="page-item"
                          breakLinkClassName="page-link"
                          activeClassName="active"
                        />
                      </div>
                    </div>
                  )}
                </div>
                </div>
              </div>
            </div>
          </div>
          {/* <div className='col-12 col-xl-3 px-2 mt-3'> */}
          {/* <ShowMessenger /> */}
          {/* <NotesButton /> */}
          {/* </div> */}
        </div>
      </div>
    </div>
  )
}

// Export the component wrapped with injectIntl
export default injectIntl(GuidanceEncouragement);
