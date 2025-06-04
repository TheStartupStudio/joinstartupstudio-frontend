import React, { useEffect, useState } from 'react'
import axiosInstance from '../../utils/AxiosInstance'
import industrySkills from '../../assets/images/city.svg'
import recognitionOfSkillsIcon from '../../assets/images/user-star.svg'
import skillsInActionIcon from '../../assets/images/skills-action.svg'
import MainCard from '../../components/NewPortfolio/MainCard/index'
import EditCard from '../../components/NewPortfolio/EditCard/index'
import ReactQuill from 'react-quill'
import './Portfolio.css'
import MultiCard from '../../components/NewPortfolio/MultiCard/index'
import CarouselComponent from '../../components/Carousel/CarouselComponent'
import MentorCard from '../../components/NewPortfolio/MyMentors/index'


function StartCompetitiveness(props) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [competitivenessData, setCompetitivenessData] = useState({
    id: null,
    user_id: null,
    iss_skill_1: '1',
    iss_skill_2: '2',
    iss_skill_3: '3',
    its_skill_1: '4',
    its_skill_2: '5',
    its_skill_3: '6',
    is_explanation: '7',
    exprience_1: '8',
    exprience_2: '9',
    exprience_3: '0',
    exprience_1_explanation: '1',
    exprience_2_explanation: '2',
    exprience_3_explanation: '3',
    mentor_1: '4',
    mentor_2: '5',
    mentor_3: '6',
    mentor_1_explanation: '7',
    mentor_2_explanation: '8',
    mentor_3_explanation: '9'
  })
  const [showMoreMyStory, setShowMoreMyStory] = useState(false)
  const [editIndustrySkillsMode, setEditIndustrySkillsMode] = useState(false)
  const [editSkillsActionMode, setEditSkillsActionMode] = useState(false)
  const [editRecognitionMode, setEditRecognitionMode] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
    const [expandedCards, setExpandedCards] = useState(false);

    const myMentors = [
      {
          "id": 121,
          "userId": 128,
          "mentorImage": 'https://imgs.search.brave.com/LgTj_WkGxLqhmr0vMPlX80haq42bMkfdaZ6ovjRE9VM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTcw/NTUwMzk2Ny9waG90/by9jb25maWRlbnQt/YnVzaW5lc3N3b21h/bi1pbi1tb2Rlcm4t/b2ZmaWNlLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1fZjJz/QXRDVWtCQmdLSzhv/eERuekdzMkNMdllC/VE41amZPTGwxZ2xR/OHl3PQ',
          "mentorName": "ANASTASIA HALL",
          "mentorRole": "Direcotr of Learning & Development",
          "mentorCompany": "Learn to Start",
          "mentorDescription": "<p>Lorem ipsum dolor sit amet consectetur adipiscing elit. Elit quisque faucibus ex sapien vitae pellentesque sem. Sem placerat in id cursus mi pretium tellus. Tellus duis convallis tempus leo eu aenean sed. Sed diam urna tempor pulvinar vivamus fringilla lacus. Lacus nec metus bibendum egestas iaculis massa nisl. Nisl malesuada lacinia integer nunc posuere ut hendrerit.</p>",
          "showSection": true,
          "category": "my-mentors",
          "createdAt": "2024-10-30T19:49:31.000Z",
          "updatedAt": "2025-04-30T07:19:32.000Z"
      },
      {
          "id": 124,
          "userId": 128,
          "mentorImage": 'https://imgs.search.brave.com/LgTj_WkGxLqhmr0vMPlX80haq42bMkfdaZ6ovjRE9VM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTcw/NTUwMzk2Ny9waG90/by9jb25maWRlbnQt/YnVzaW5lc3N3b21h/bi1pbi1tb2Rlcm4t/b2ZmaWNlLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1fZjJz/QXRDVWtCQmdLSzhv/eERuekdzMkNMdllC/VE41amZPTGwxZ2xR/OHl3PQ',
          "mentorName": "test 1",
          "mentorRole": "Role",
          "mentorCompany": "Company",
          "mentorDescription": "Lorem ipsum dolor sit amet consectetur adipiscing elit. Elit quisque faucibus ex sapien vitae pellentesque sem. Sem placerat in id cursus mi pretium tellus. Tellus duis convallis tempus leo eu aenean sed. Sed diam urna tempor pulvinar vivamus fringilla lacus. Lacus nec metus bibendum egestas iaculis massa nisl. Nisl malesuada lacinia integer nunc posuere ut hendrerit.",
          "showSection": false,
          "category": "my-mentors",
          "createdAt": "2024-10-30T19:57:52.000Z",
          "updatedAt": "2025-04-28T00:01:47.000Z"
      },
      {
          "id": 129,
          "userId": 128,
          "mentorImage": 'https://imgs.search.brave.com/LgTj_WkGxLqhmr0vMPlX80haq42bMkfdaZ6ovjRE9VM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTcw/NTUwMzk2Ny9waG90/by9jb25maWRlbnQt/YnVzaW5lc3N3b21h/bi1pbi1tb2Rlcm4t/b2ZmaWNlLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1fZjJz/QXRDVWtCQmdLSzhv/eERuekdzMkNMdllC/VE41amZPTGwxZ2xR/OHl3PQ',
          "mentorName": "Test 2",
          "mentorRole": "Role",
          "mentorCompany": "Company",
          "mentorDescription": "Lorem ipsum dolor sit amet consectetur adipiscing elit. Elit quisque faucibus ex sapien vitae pellentesque sem. Sem placerat in id cursus mi pretium tellus. Tellus duis convallis tempus leo eu aenean sed. Sed diam urna tempor pulvinar vivamus fringilla lacus. Lacus nec metus bibendum egestas iaculis massa nisl. Nisl malesuada lacinia integer nunc posuere ut hendrerit.",
          "showSection": true,
          "category": "my-mentors",
          "createdAt": "2024-10-31T10:00:45.000Z",
          "updatedAt": "2024-10-31T10:00:45.000Z"
      },
      {
          "id": 141,
          "userId": 128,
          "mentorImage": 'https://imgs.search.brave.com/LgTj_WkGxLqhmr0vMPlX80haq42bMkfdaZ6ovjRE9VM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTcw/NTUwMzk2Ny9waG90/by9jb25maWRlbnQt/YnVzaW5lc3N3b21h/bi1pbi1tb2Rlcm4t/b2ZmaWNlLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1fZjJz/QXRDVWtCQmdLSzhv/eERuekdzMkNMdllC/VE41amZPTGwxZ2xR/OHl3PQ',
          "mentorName": "Test 3",
          "mentorRole": "dev",
          "mentorCompany": "learnttoostart",
          "mentorDescription": "<p>Lorem ipsum dolor sit amet consectetur adipiscing elit. Elit quisque faucibus ex sapien vitae pellentesque sem. Sem placerat in id cursus mi pretium tellus. Tellus duis convallis tempus leo eu aenean sed. Sed diam urna tempor pulvinar vivamus fringilla lacus. Lacus nec metus bibendum egestas iaculis massa nisl. Nisl malesuada lacinia integer nunc posuere ut hendrerit.</p>",
          "showSection": true,
          "category": "my-mentors",
          "createdAt": "2025-04-30T15:51:47.000Z",
          "updatedAt": "2025-04-30T15:51:47.000Z"
      }
  ]

  useEffect(() => {
    // const fetchCompetitivenessData = async () => {
    //   try {
    //     setIsLoading(true)
    //     const response = await axiosInstance.get(
    //       '/hsPortfolio/user-start-competitiveness'
    //     )
    //     const data = response.data['0'] || {
    //       id: null, // Make sure id is included in the default object
    //       user_id: null,
    //       iss_skill_1: '',
    //       iss_skill_2: '',
    //       iss_skill_3: '',
    //       its_skill_1: '',
    //       its_skill_2: '',
    //       its_skill_3: '',
    //       is_explanation: '',
    //       exprience_1: '',
    //       exprience_2: '',
    //       exprience_3: '',
    //       exprience_1_explanation: '',
    //       exprience_2_explanation: '',
    //       exprience_3_explanation: '',
    //       mentor_1: '',
    //       mentor_2: '',
    //       mentor_3: '',
    //       mentor_1_explanation: '',
    //       mentor_2_explanation: '',
    //       mentor_3_explanation: ''
    //     }
    //     setCompetitivenessData(data)
    //   } catch (err) {
    //     setError(err.message || 'Failed to fetch competitiveness data')
    //   } finally {
    //     setIsLoading(false)
    //   }
    // }

    // fetchCompetitivenessData()

    setIsLoading(false)
  }, [])



  const handleFormChange = (field, value) => {
    setCompetitivenessData((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSaveIndustrySkills = async () => {
    try {
      setIsLoading(true)
      const payload = {
        iss_skill_1: competitivenessData.iss_skill_1,
        iss_skill_2: competitivenessData.iss_skill_2,
        iss_skill_3: competitivenessData.iss_skill_3,
        its_skill_1: competitivenessData.its_skill_1,
        its_skill_2: competitivenessData.its_skill_2,
        its_skill_3: competitivenessData.its_skill_3,
        is_explanation: competitivenessData.is_explanation
      }

      let response
      if (competitivenessData.id) {
        response = await axiosInstance.put(
          `/hsPortfolio/start-competitiveness/${competitivenessData.id}`,
          payload
        )
      } else {
        response = await axiosInstance.post(
          `/hsPortfolio/start-competitiveness`,
          payload
        )
      }

      setCompetitivenessData((prev) => ({
        ...prev,
        ...response.data,
        id: response.data.id || prev.id // Ensure ID is retained
      }))
      setEditIndustrySkillsMode(false)
    } catch (err) {
      setError(err.message || 'Failed to save industry skills')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveSkillsAction = async () => {
    try {
      setIsLoading(true)
      const payload = {
        exprience_1: competitivenessData.exprience_1,
        exprience_2: competitivenessData.exprience_2,
        exprience_3: competitivenessData.exprience_3,
        exprience_1_explanation: competitivenessData.exprience_1_explanation,
        exprience_2_explanation: competitivenessData.exprience_2_explanation,
        exprience_3_explanation: competitivenessData.exprience_3_explanation
      }

      let response
      if (competitivenessData.id) {
        response = await axiosInstance.put(
          `/hsPortfolio/start-competitiveness/${competitivenessData.id}`,
          payload
        )
      } else {
        response = await axiosInstance.post(
          `/hsPortfolio/start-competitiveness`,
          payload
        )
      }

      setCompetitivenessData((prev) => ({
        ...prev,
        ...response.data,
        id: response.data.id || prev.id // Ensure ID is retained
      }))
      setEditSkillsActionMode(false)
    } catch (err) {
      setError(err.message || 'Failed to save skills in action')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveRecognition = async () => {
    try {
      setIsLoading(true)

      const payload = {
        mentor_1: competitivenessData.mentor_1,
        mentor_2: competitivenessData.mentor_2,
        mentor_3: competitivenessData.mentor_3,
        mentor_1_explanation: competitivenessData.mentor_1_explanation,
        mentor_2_explanation: competitivenessData.mentor_2_explanation,
        mentor_3_explanation: competitivenessData.mentor_3_explanation
      }

      let response
      if (competitivenessData.id) {
        response = await axiosInstance.put(
          `/hsPortfolio/start-competitiveness/${competitivenessData.id}`,
          payload
        )
      } else {
        response = await axiosInstance.post(
          `/hsPortfolio/start-competitiveness`,
          payload
        )
      }

      setCompetitivenessData((prev) => ({
        ...prev,
        ...response.data,
        id: response.data.id || prev.id // Ensure ID is retained
      }))
      setEditRecognitionMode(false)
    } catch (err) {
      setError(err.message || 'Failed to save recognition data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelEdit = () => {
    setEditIndustrySkillsMode(false)
    setEditSkillsActionMode(false)
    setEditRecognitionMode(false)
  }

  // Check if any data exists
  const hasIndustrySkillsData =
    competitivenessData?.iss_skill_1 ||
    competitivenessData?.iss_skill_2 ||
    competitivenessData?.iss_skill_3 ||
    competitivenessData?.its_skill_1 ||
    competitivenessData?.its_skill_2 ||
    competitivenessData?.its_skill_3 ||
    competitivenessData?.is_explanation

  const hasSkillsActionData =
    competitivenessData?.exprience_1 ||
    competitivenessData?.exprience_2 ||
    competitivenessData?.exprience_3

  const hasRecognitionData =
    competitivenessData?.mentor_1 ||
    competitivenessData?.mentor_2 ||
    competitivenessData?.mentor_3

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div>
      {/* Industry Skills Card */}
      {hasIndustrySkillsData ? (
        <MainCard
          title={'Industry Skills'}
          icon={industrySkills}
          onClick={() => setEditIndustrySkillsMode(true)}
        >
          <h6>Industry-Specific Skills</h6>
          <div className="start-competitiveness-container">
            <div className="portfolio-productivity-card">
              <img src={industrySkills} alt="Industry Skills" />
              <h5 className="title">
                Skill 1: Drawing
              </h5>
            </div>

            <div className="portfolio-productivity-card">
              <img src={industrySkills} alt="Industry Skills" />
              <h5 className="title">
                Skill 1: Drawing
              </h5>
            </div>

            <div className="portfolio-productivity-card">
              <img src={industrySkills} alt="Industry Skills" />
              <h5 className="title">
                Skill 1: Drawing
              </h5>
            </div>

          </div>

          <h6>Industry-Trascendent Skills</h6>
          <div className="start-competitiveness-container">
            <div className="portfolio-productivity-card">
              <img src={industrySkills} alt="Industry Skills" />
              <h5 className="title">
                Skill 1: Drawing
              </h5>
            </div>

            <div className="portfolio-productivity-card">
              <img src={industrySkills} alt="Industry Skills" />
              <h5 className="title">
                Skill 1: Drawing
              </h5>
            </div>

            <div className="portfolio-productivity-card">
              <img src={industrySkills} alt="Industry Skills" />
              <h5 className="title">
                Skill 1: Drawing
              </h5>
            </div>

          </div>


          <div className="start-competitivness-paragraph">
            <h6>How This Skill Combine to Increase My Value:</h6>
            <div>
              {(() => {
                const data = 'Lorem ipsum dolor sit amet consectetur adipiscing elit. Placerat in id cursus mi pretium tellus duis. Urna tempor pulvinar vivamus fringilla lacus nec metus. Integer nunc posuere ut hendrerit semper vel class. Conubia nostra inceptos himenaeos orci varius natoque penatibus. Mus donec rhoncus eros lobortis nulla molestie mattis. Purus est efficitur laoreet mauris pharetra vestibulum fusce. Sodales consequat magna ante condimentum neque at luctus. Ligula congue sollicitudin erat viverra ac tincidunt nam. Lectus commodo augue arcu dignissim velit aliquam imperdiet. Cras eleifend turpis fames primis vulputate ornare sagittis. Libero feugiat tristique accumsan maecenas potenti ultricies habitant. Cubilia curae hac habitasse platea dictumst lorem ipsum. Faucibus ex sapien vitae pellentesque sem placerat in. Tempus leo eu aenean sed diam urna tempor.'
                const text = data.replace(/<[^>]*>/g, '').trim() || '';
                const shouldTruncate = text.length > 350;

                return (
                  <>
                    {isExpanded ? text : text.slice(0, 350)}
                    {shouldTruncate && (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsExpanded(!isExpanded);
                        }}
                        style={{
                          color: 'rgb(0, 218, 218)',
                          cursor: 'pointer',
                          marginLeft: '5px',
                          fontWeight: '500'
                        }}
                      >
                        {isExpanded ? ' Read Less' : '... Read More'}
                      </span>
                    )}
                  </>
                );
              })()}
            </div>
          </div>


        </MainCard>
      ) : (
        <MainCard
          title={'Industry Skills'}
          icon={industrySkills}
          onClick={() => setEditIndustrySkillsMode(true)}
        />
      )}




      <MainCard
        title={'Skills in Action'}
        icon={skillsInActionIcon}
        onClick={() => setEditProblemMode(true)}
      >
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '30px',
          padding: '20px 0'
        }}>
          {/* The Problem Column */}
          <div className="portfolio-productivity-card" >

            <img
              src={'https://imgs.search.brave.com/zs0VPjbB8dBTv7b3zxrWNLYv-jhXXpbcpySxc_gBVLg/rs:fit:860:0:0:0/g:ce/aHR0cDovL3d3dy5z/aW1wbHlidXNpbmVz/cy5jby51ay93cC1j/b250ZW50L3VwbG9h/ZHMvc2l0ZXMvMy8y/MDI0LzA1L2VkaXRp/bmctaW1hZ2VzLWZv/ci1idXNpbmVzcy1t/YXJrZXRpbmcuanBn/P3c9ODE1'}
              alt="Problem"
            />
            <h5 className="title">
              Experience 1: Lorem Ipsum
            </h5>
          </div>

          {/* Why It's Worth Solving Column */}
          <div className="portfolio-productivity-card" >
            <img
              src={'https://imgs.search.brave.com/zs0VPjbB8dBTv7b3zxrWNLYv-jhXXpbcpySxc_gBVLg/rs:fit:860:0:0:0/g:ce/aHR0cDovL3d3dy5z/aW1wbHlidXNpbmVz/cy5jby51ay93cC1j/b250ZW50L3VwbG9h/ZHMvc2l0ZXMvMy8y/MDI0LzA1L2VkaXRp/bmctaW1hZ2VzLWZv/ci1idXNpbmVzcy1t/YXJrZXRpbmcuanBn/P3c9ODE1'}
              alt="Worth Solving"
            />
            <h5 className="title">
              Experience 2: Lorem Ipsum
            </h5>
          </div>

          {/* Executed Solution Column */}
          <div className="portfolio-productivity-card" >
            <img
              src={'https://imgs.search.brave.com/zs0VPjbB8dBTv7b3zxrWNLYv-jhXXpbcpySxc_gBVLg/rs:fit:860:0:0:0/g:ce/aHR0cDovL3d3dy5z/aW1wbHlidXNpbmVz/cy5jby51ay93cC1j/b250ZW50L3VwbG9h/ZHMvc2l0ZXMvMy8y/MDI0LzA1L2VkaXRp/bmctaW1hZ2VzLWZv/ci1idXNpbmVzcy1t/YXJrZXRpbmcuanBn/P3c9ODE1'}
              alt="Solution"
            />
            <h5 className="title">
              Experience 3: Lorem Ipsum
            </h5>
          </div>
        </div>
      </MainCard>


      <MultiCard
        title={'My Mentors'}
        icon={recognitionOfSkillsIcon}
      >
        {myMentors.length > 0 ? (
          <CarouselComponent
            className='my-mentors-card'
            data={myMentors}
            itemsToShow={3}
            renderItems={(item, index) => (
              <MentorCard
                mentor={item}
                width={'95%'}
                isExpanded={expandedCards}
                onToggleExpand={() => setExpandedCards(!expandedCards)}
              />
            )}
          />
        ) : (
          <div>No mentors to show</div>
        )}
      </MultiCard>



    </div>
  )
}

export default StartCompetitiveness
