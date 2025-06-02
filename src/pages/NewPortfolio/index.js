import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './Portfolio.css'
import whoami from '../../assets/images/whoami.png'
import WhoAmI from './whoami'
import WhatCanIDo from './whatcanido'
import HowDoIProveIt from './howdoiproveit'

import {
  getMyCompetitiveness,
  getMyCredentials,
  getMyEducations,
  getMyFailures,
  getMyImmersions,
  getMyMentors,
  getMyRelationships,
  getMyWorkExperiences,
  getSharingSettings,
  getUserBasicInfo,
  getUserStory,
  getMyProjectsAPI,
  getProjects
} from '../../redux/portfolio/Actions'
import Start from './start'
import StartProd from './startProd'
import StartCompetitiveness from './startcompetitiveness'
import blankProfile from '../../assets/images/academy-icons/blankProfile.jpg'

const Portfolio = (props) => {
  const dispatch = useDispatch()
  const [activeSection, setActiveSection] = useState('who-am-i')
  const [refreshData, setRefreshData] = useState(false)

  useEffect(() => {
    // Dispatch all the actions when the component mounts
    dispatch(getUserBasicInfo())
    dispatch(getUserStory())
    dispatch(getMyWorkExperiences())
    dispatch(getMyEducations())
    dispatch(getMyCredentials())
    dispatch(getMyCompetitiveness())
    dispatch(getMyImmersions())
    dispatch(getMyRelationships())
    dispatch(getMyMentors())
    dispatch(getMyFailures())
    dispatch(getSharingSettings())
    dispatch(getProjects()), dispatch(getMyEducations())
  }, [dispatch, refreshData]) // The effect will only run when dispatch changes

  // const { userBasicInfo } = useSelector((state) => state.portfolio.whoSection)
  

    const userBasicInfo = {
    "id": 4,
    "userId": 128,
    "thumbnailUrl": "https://demo-startupstudio-drive.s3.amazonaws.com/users/128/b2a816e8b564ca6618fb10a6d870d8e9-1748304012319.png",
    "videoUrl": "https://www.youtube.com/watch?v=tpodNruOVoI",
    "valueProposition": "<p>loorem ipsum dolore sit ae</p>",
    "story": "<p><span style=\"color: rgb(100, 107, 107);\">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</span><span style=\"color: rgb(100, 107, 107); background-color: rgb(255, 255, 255);\">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation sadasdullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</span></p>",
    "userImageUrl": blankProfile,
    "userTitle": "Student",
    "name": "Testing ",
    "organization": "Organization",
    "socialMediaLinks": {
        "linkedIn": "/testing",
        "instagram": "/test",
        "facebook": "/test"
    },
    "primaryInterest": "test 1"
}

  // const { myRelationships } = useSelector((state) => state.portfolio.whoSection)

  const myRelationships = {
    "id": 4,
    "userId": 128,
    "teamRole": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod teasdasdasdas</p>",
    "collaborationStyle": "<p>WhoAmI WhoAmI Who mI sed do eiusmod te&nbsp;<span style=\"background-color: rgb(255, 255, 255);\">Lorem ipsum dolor</span></p>",
    "leadershipPhilosophy": "<p>WhoAmI WhoAmI sed do eiusmod te&nbsp;<span style=\"background-color: rgb(255, 255, 255);\">Lorem ipsum dolor</span></p>",
    "showRelationships": 1
}

  // const { myFailures } = useSelector((state) => state.portfolio.whoSection)

  const myFailures = [
    {
        "id": 22,
        "userId": 128,
        "thumbnailUrl": "https://demo-startupstudio-drive.s3.amazonaws.com/users/128/b28ae874a41fa16bf44f4e6f45249f1c-1745924237703.png",
        "videoUrl": "https://www.instagram.com/baby_gift_shop_ks/",
        "failure": "<p>An&nbsp;IP address&nbsp;is&nbsp;<span style=\"background-color: rgba(0, 0, 0, 0);\">a unique identifier assigned to every device connected to the internet or a local network, allowing it to communicate with other devices</span>. It serves two main functions: identifying the device and providing its location within the network to establish a path for communication.6</p><p><br></p><p>There are two standards for IP addresses: IPv4 and IPv6. IPv4 uses 32 binary bits to create a single unique address, typically displayed as four numbers separated by periods, such as 192.0.2.1.46&nbsp;IPv6, which uses 128 bits, was introduced to accommodate the growing number of devices and to address the exhaustion of IPv4 addresses.6</p><p>IP addresses can be either public, visible to the internet, or private, used within a local network.5&nbsp;They can also be static, remaining the same, or dynamic, changing periodically</p>",
        "pivot": "<p>test</p>",
        "outcomes": "<p>test</p>",
        "showSection": true,
        "createdAt": "2025-04-29T10:57:20.000Z",
        "updatedAt": "2025-05-29T13:34:33.000Z"
    },
    {
        "id": 26,
        "userId": 128,
        "thumbnailUrl": "https://demo-startupstudio-drive.s3.amazonaws.com/users/128/5e9cc3268073d1ab0a5a83dc5e207134-1748304976230.png",
        "videoUrl": "https://www.youtube.com/watch?v=tpodNruOVoI",
        "failure": "<p>CTK KOSOVA</p>",
        "pivot": "<p>CTK KOSOVA</p>",
        "outcomes": "<p>CTK KOSOVA</p>",
        "showSection": true,
        "createdAt": "2025-05-27T00:16:42.000Z",
        "updatedAt": "2025-05-27T00:16:42.000Z"
    }
]

  // const { myMentors } = useSelector((state) => state.portfolio.whoSection)

  const myMentors = [
    {
        "id": 121,
        "userId": 128,
        "mentorImage": "https://demo-startupstudio-drive.s3.amazonaws.com/users/128/82233fffc644d0111ccad13a675a000b-1745798486131.png",
        "mentorName": "gary conroy",
        "mentorRole": "CEO",
        "mentorCompany": "LearntoStart",
        "mentorDescription": "<p><br></p>",
        "showSection": true,
        "category": "my-mentors",
        "createdAt": "2024-10-30T19:49:31.000Z",
        "updatedAt": "2025-04-30T07:19:32.000Z"
    },
    {
        "id": 124,
        "userId": 128,
        "mentorImage": "https://demo-startupstudio-drive.s3.amazonaws.com/users/128/555593ab839908e8513cf4ef4b6b0437-1745798507484.png",
        "mentorName": "test 3",
        "mentorRole": "",
        "mentorCompany": "",
        "mentorDescription": "",
        "showSection": false,
        "category": "my-mentors",
        "createdAt": "2024-10-30T19:57:52.000Z",
        "updatedAt": "2025-04-28T00:01:47.000Z"
    },
    {
        "id": 129,
        "userId": 128,
        "mentorImage": "https://imgs.search.brave.com/HjKh16NtLdsTc_VET0nNqWzEL3L1tIJekNu_0H69Yu0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/azEyLmNvbS93cC1j/b250ZW50L3VwbG9h/ZHMvMjAyNC8wMS9T/YW1wbGVIaWdoU2No/b29sTGVzc29ucy1j/b3B5LndlYnA",
        "mentorName": "Test 4",
        "mentorRole": "",
        "mentorCompany": "",
        "mentorDescription": "",
        "showSection": true,
        "category": "my-mentors",
        "createdAt": "2024-10-31T10:00:45.000Z",
        "updatedAt": "2024-10-31T10:00:45.000Z"
    },
    {
        "id": 141,
        "userId": 128,
        "mentorImage": "https://demo-startupstudio-drive.s3.amazonaws.com/users/128/77128f342866d68854b2b854f666fc5d-1746028305975.png",
        "mentorName": "valdrin",
        "mentorRole": "dev",
        "mentorCompany": "learnttoostart",
        "mentorDescription": "<p>learnttoostart&nbsp;learnttoostart&nbsp;learnttoostart</p>",
        "showSection": true,
        "category": "my-mentors",
        "createdAt": "2025-04-30T15:51:47.000Z",
        "updatedAt": "2025-04-30T15:51:47.000Z"
    }
]
  // const { myProjects } = useSelector((state) => state.portfolio.whatSection)

  const myProjects = [
    {
        "id": 917,
        "title": "Lorem ipsum dolor sit amet consectetur adipiscing elit. Consectetur adipiscing elit quisque faucibus ex sapien vitae. Ex sapien vitae pellentesque sem placerat in id. Placerat in id cursus mi pretium tellus duis. Pretium tellus duis convallis tempus leo eu aenean.",
        "updatedAt": "2025-05-26T17:57:05.000Z",
        "createdAt": "2025-05-26T17:51:38.000Z",
        "children": [
            {
                "id": 918,
                "type": "learn",
                "showSection": true,
                "editorContent": "<p>test</p>",
                "userId": 128,
                "parentId": 917,
                "title": null,
                "createdAt": "2025-05-26T17:51:38.000Z",
                "updatedAt": "2025-05-26T17:57:05.000Z",
                "evidences": [
                    {
                        "id": 1438,
                        "type": "evidence-1",
                        "userId": 128,
                        "imageUrl": "https://demo-startupstudio-drive.s3.amazonaws.com/users/128/cce31829559f1645dbb11d585bc10980-1748281910315.png",
                        "linkInputValue": "test",
                        "evidenceTitle": "test",
                        "createdAt": "2025-05-26T17:51:39.000Z",
                        "updatedAt": "2025-05-26T17:57:06.000Z",
                        "projectId": 918,
                        "selectedSkills": []
                    },
                    {
                        "id": 1439,
                        "type": "evidence-2",
                        "userId": 128,
                        "imageUrl": "https://demo-startupstudio-drive.s3.amazonaws.com/users/128/96b5d6b838f5cb22416a711b946f1aa9-1748281916259.png",
                        "linkInputValue": "test",
                        "evidenceTitle": "test",
                        "createdAt": "2025-05-26T17:51:39.000Z",
                        "updatedAt": "2025-05-26T17:57:06.000Z",
                        "projectId": 918,
                        "selectedSkills": []
                    },
                    {
                        "id": 1440,
                        "type": "evidence-3",
                        "userId": 128,
                        "imageUrl": "https://demo-startupstudio-drive.s3.amazonaws.com/users/128/0d6a24934c625b10063533f59696fc05-1748281918985.png",
                        "linkInputValue": "test",
                        "evidenceTitle": "test",
                        "createdAt": "2025-05-26T17:51:39.000Z",
                        "updatedAt": "2025-05-26T17:57:06.000Z",
                        "projectId": 918,
                        "selectedSkills": []
                    }
                ]
            },
            {
                "id": 919,
                "type": "develop",
                "showSection": true,
                "editorContent": "<p>test 2</p>",
                "userId": 128,
                "parentId": 917,
                "title": null,
                "createdAt": "2025-05-26T17:51:38.000Z",
                "updatedAt": "2025-05-26T17:57:05.000Z",
                "evidences": [
                    {
                        "id": 1441,
                        "type": "evidence-1",
                        "userId": 128,
                        "imageUrl": "https://demo-startupstudio-drive.s3.amazonaws.com/users/128/6107978d6e07b1f8a50f9fba60c74105-1748281947416.png",
                        "linkInputValue": "test 2",
                        "evidenceTitle": "testt 2",
                        "createdAt": "2025-05-26T17:51:39.000Z",
                        "updatedAt": "2025-05-26T17:57:07.000Z",
                        "projectId": 919,
                        "selectedSkills": []
                    },
                    {
                        "id": 1442,
                        "type": "evidence-2",
                        "userId": 128,
                        "imageUrl": "https://demo-startupstudio-drive.s3.amazonaws.com/users/128/1dce613918ad560917f56b835b7c057d-1748281950962.png",
                        "linkInputValue": "das",
                        "evidenceTitle": "rwa",
                        "createdAt": "2025-05-26T17:51:39.000Z",
                        "updatedAt": "2025-05-26T17:57:07.000Z",
                        "projectId": 919,
                        "selectedSkills": []
                    },
                    {
                        "id": 1443,
                        "type": "evidence-3",
                        "userId": 128,
                        "imageUrl": "https://demo-startupstudio-drive.s3.amazonaws.com/users/128/8bd621f8751615b071edb94a632916a1-1748281957487.webp",
                        "linkInputValue": "asdasda",
                        "evidenceTitle": "dasda",
                        "createdAt": "2025-05-26T17:51:39.000Z",
                        "updatedAt": "2025-05-26T17:57:07.000Z",
                        "projectId": 919,
                        "selectedSkills": []
                    }
                ]
            },
            {
                "id": 920,
                "type": "brand",
                "showSection": true,
                "editorContent": "<p>test 3</p>",
                "userId": 128,
                "parentId": 917,
                "title": null,
                "createdAt": "2025-05-26T17:51:38.000Z",
                "updatedAt": "2025-05-26T17:57:05.000Z",
                "evidences": [
                    {
                        "id": 1444,
                        "type": "evidence-1",
                        "userId": 128,
                        "imageUrl": "https://demo-startupstudio-drive.s3.amazonaws.com/users/128/03e687794d35dc9d9940d32b17c17012-1748281969228.png",
                        "linkInputValue": "test",
                        "evidenceTitle": "test",
                        "createdAt": "2025-05-26T17:51:39.000Z",
                        "updatedAt": "2025-05-26T17:57:08.000Z",
                        "projectId": 920,
                        "selectedSkills": []
                    },
                    {
                        "id": 1445,
                        "type": "evidence-2",
                        "userId": 128,
                        "imageUrl": "https://demo-startupstudio-drive.s3.amazonaws.com/users/128/de525b59fc5d01e2bc3d83e2692ae9be-1748281972085.webp",
                        "linkInputValue": "dasda",
                        "evidenceTitle": "asdas",
                        "createdAt": "2025-05-26T17:51:39.000Z",
                        "updatedAt": "2025-05-26T17:57:08.000Z",
                        "projectId": 920,
                        "selectedSkills": []
                    },
                    {
                        "id": 1446,
                        "type": "evidence-3",
                        "userId": 128,
                        "imageUrl": "https://demo-startupstudio-drive.s3.amazonaws.com/users/128/ff165f739f70e277b7e9792b585174dd-1748281977759.webp",
                        "linkInputValue": "asdasd",
                        "evidenceTitle": "asdasd",
                        "createdAt": "2025-05-26T17:51:39.000Z",
                        "updatedAt": "2025-05-26T17:57:08.000Z",
                        "projectId": 920,
                        "selectedSkills": []
                    }
                ]
            }
        ]
    }
]
  const { myAlignments } = useSelector((state) => state.portfolio.howSection)
  const { myProductivity } = useSelector((state) => state.portfolio.howSection)

  // const { educations } = myAlignments

  const educations = [
    {
        "id": 23,
        "user_id": 128,
        "school_logo": "https://demo-startupstudio-drive.s3.amazonaws.com/users/128/32979043701994f42dda8f53ed8ee5e6-1748300819859.jpg",
        "school_name": "test",
        "date_started": "2025-04-26T22:00:00.000Z",
        "date_graduated": null,
        "current_education": true,
        "skills_developed": "<p> <span style=\"color: rgb(156, 220, 254);\">organization_logo</span></p>",
        "opportunities_experienced": "<p> <span style=\"color: rgb(156, 220, 254);\">organization_logo</span></p>",
        "network_of_mentors": "<p> <span style=\"color: rgb(156, 220, 254);\">organization_logo</span></p>",
        "created_at": "2025-05-26T23:07:08.000Z",
        "updated_at": "2025-05-26T23:07:08.000Z"
    }
]
  // const { workExperiences } = myProductivity

  const workExperiences = [
    {
        "id": 7,
        "user_id": 128,
        "organization_logo": "https://demo-startupstudio-drive.s3.amazonaws.com/users/128/c96c90776f07fe11bc4b3e25fc3cca52-1748300871946.png",
        "organization_name": " organization_logo",
        "date_started": "2025-04-27T22:00:00.000Z",
        "date_graduated": null,
        "current_involved": true,
        "skills_developed": "<p> <span style=\"color: rgb(156, 220, 254);\">organization_logo</span></p>",
        "opportunities_experienced": "<p> <span style=\"color: rgb(156, 220, 254);\">organization_logo</span></p>",
        "network_of_mentors": "<p> <span style=\"color: rgb(156, 220, 254);\">organization_logo</span></p>",
        "created_at": "2025-05-26T23:08:00.000Z",
        "updated_at": "2025-05-26T23:08:00.000Z"
    }
]

const communityInvolvements = [
  {
        "id": 7,
        "user_id": 128,
        "organization_logo": "https://demo-startupstudio-drive.s3.amazonaws.com/users/128/c96c90776f07fe11bc4b3e25fc3cca52-1748300871946.png",
        "organization_name": " organization_logo",
        "date_started": "2025-04-27T22:00:00.000Z",
        "date_graduated": null,
        "current_involved": true,
        "skills_developed": "<p> <span style=\"color: rgb(156, 220, 254);\">organization_logo</span></p>",
        "opportunities_experienced": "<p> <span style=\"color: rgb(156, 220, 254);\">organization_logo</span></p>",
        "network_of_mentors": "<p> <span style=\"color: rgb(156, 220, 254);\">organization_logo</span></p>",
        "created_at": "2025-05-26T23:08:00.000Z",
        "updated_at": "2025-05-26T23:08:00.000Z"
    }
]

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'who-am-i':
        return (
          <WhoAmI
            sectionTitle={'WHO AM I?'}
            sectionDescription={
              'LTS participants communicate the value they have produced in themselves through Story, Relationship, Mentorship and Failure'
            }
            userBasicInfo={userBasicInfo}
            myRelationships={myRelationships}
            myFailures={myFailures}
            myMentors={myMentors}
          />
        )
      case 'what-can-i-do':
        return (
          <WhatCanIDo
            sectionTitle={'WHAT CAN I DO?'}
            sectionDescription={
              'LTS participants communicate the value they have produced in themselves through the outcomes of Learn, Develop and Brand'
            }
            myProjects={myProjects}
            setRefreshData={setRefreshData}
          />
        )
      case 'how-do-i-prove-it':
        return (
          <HowDoIProveIt
            sectionTitle={'HOW DO I PROVE IT?'}
            sectionDescription={
              'LTS participants communicate the value they have produced in themselves through the outcomes of Alignment, Productivity, and Competitiveness. '
            }
            educations={educations}
            communityInvolvements = {communityInvolvements}
            workExprience={workExperiences}
          />
        )
      case 'start':
        return (
          <Start
            sectionTitle={'START:ALIGNMENT'}
            sectionDescription={
              'My ability to prove the quality of my outcomes through the test metrics of alignment, productivity, and competitiveness.'
            }
          />
        )
      default:
        return (
          <WhoAmI
            sectionTitle={'WHO AM I?'}
            sectionDescription={
              'LTS participants communicate the value they have produced in themselves through Story, Relationship, Mentorship and Failure'
            }
            userBasicInfo={userBasicInfo?.data}
            myRelationships={myRelationships?.data}
            myFailures={myFailures?.data}
            myMentors={myMentors?.data}
          />
        )
    }
  }

  return (
    <div>
      <div className='porfolio-header'>
        <h3>MY PORTFOLIO</h3>
        <p>
          Complete your assigned tasks, works towards building out your
          Market-Ready Portfolio and develop you Market-Ready skills.
        </p>
      </div>
      <div className='portfolio-container'>
        <div className='portfolio-navbar'>
          <div
            className={`portfolio-navbar-item ${
              activeSection === 'who-am-i' ? 'active' : ''
            }`}
            onClick={() => setActiveSection('who-am-i')}
          >
            Who am I?
          </div>
          <div
            className={`portfolio-navbar-item ${
              activeSection === 'what-can-i-do' ? 'active' : ''
            }`}
            onClick={() => setActiveSection('what-can-i-do')}
          >
            What Can I Do?
          </div>
          <div
            className={`portfolio-navbar-item ${
              activeSection === 'how-do-i-prove-it' ? 'active' : ''
            }`}
            onClick={() => setActiveSection('how-do-i-prove-it')}
          >
            How Do I Prove it?
          </div>
          <div
            className={`portfolio-navbar-item ${
              activeSection === 'start' ? 'active' : ''
            }`}
            onClick={() => setActiveSection('start')}
          >
            Start
          </div>
        </div>

        {renderActiveSection()}
      </div>
    </div>
  )
}

export default Portfolio
