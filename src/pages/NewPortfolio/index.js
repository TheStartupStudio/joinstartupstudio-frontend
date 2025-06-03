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
     "thumbnailUrl": "https://imgs.search.brave.com/38IO7tZqTz6u3VDGFzE2Gg2bfshvjexjv4LUIGdV2h8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/YXZlcnkuY29tL2Js/b2cvd3AtY29udGVu/dC91cGxvYWRzLzIw/MjEvMDMvYmxvZy1o/ZXJvLWJlc3RpbWFn/ZXJlc291cmNlcy0z/MDAweDExMzQtMS1z/Y2FsZWQuanBn",
    "videoUrl": "https://www.youtube.com/watch?v=iL87nv4pQsk",
    "valueProposition": "<p>Lorem ipsum dolor sit amet consectetur adipiscing elit. Consectetur adipiscing elit quisque faucibus ex sapien vitae. Ex sapien vitae pellentesque sem placerat in id. Placerat in id cursus mi pretium tellus duis. Pretium tellus duis convallis tempus leo eu aenean.</p>",
    "story": "<p><span style=\"color: rgb(0, 0, 0);\">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</span><span style=\"color: rgb(100, 107, 107); background-color: rgb(255, 255, 255);\">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation sadasdullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</span></p>",
    "userImageUrl": blankProfile,
    "userTitle": "Student",
    "name": "Testing ",
    "organization": "Organization",
    "socialMediaLinks": {
        "linkedIn": "/testing",
        "instagram": "/test",
        "facebook": "/test"
    },
    "primaryInterest": "Lorem ipsum dolor sit amet."
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
        "thumbnailUrl": "https://imgs.search.brave.com/C0OsfontM1F1-tzzwxhasUer0HscrpGqrCkjFuHE6_k/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTMx/MDgxNDA0MS9waG90/by9wb3J0cmFpdC1v/Zi1hLWJ1c2luZXNz/d29tYW4tc3RhbmRp/bmctaW4tYS1hLW1v/ZGVybi1vZmZpY2Uu/anBnP3M9NjEyeDYx/MiZ3PTAmaz0yMCZj/PXJMRFlFR2FHZmJG/cTZtSlBMYzJGSGpj/NktCS3lKRVR1Mzh5/NGEzeDExY009",
        "videoUrl": "https://www.instagram.com/baby_gift_shop_ks/",
        "failure": "<p>An&nbsp;IP address&nbsp;is&nbsp;<span style=\"background-color: rgba(0, 0, 0, 0);\">a unique identifier assigned to every device connected to the internet or a local network, allowing it to communicate with other devices</span>. It serves two main functions: identifying the device and providing its location within the network to establish a path for communication.6</p><p><br></p><p>There are two standards for IP addresses: IPv4 and IPv6. IPv4 uses 32 binary bits to create a single unique address, typically displayed as four numbers separated by periods, such as 192.0.2.1.46&nbsp;IPv6, which uses 128 bits, was introduced to accommodate the growing number of devices and to address the exhaustion of IPv4 addresses.6</p><p>IP addresses can be either public, visible to the internet, or private, used within a local network.5&nbsp;They can also be static, remaining the same, or dynamic, changing periodically</p>",
        "pivot": "<p>Lorem ipsum dolor sit amet consectetur adipiscing elit. Elit quisque faucibus ex sapien vitae pellentesque sem. Sem placerat in id cursus mi pretium tellus. Tellus duis convallis tempus leo eu aenean sed. Sed diam urna tempor pulvinar vivamus fringilla lacus. Lacus nec metus bibendum egestas iaculis massa nisl. Nisl malesuada lacinia integer nunc posuere ut hendrerit.</p>",
        "outcomes": "<p>Lorem ipsum dolor sit amet consectetur adipiscing elit. Elit quisque faucibus ex sapien vitae pellentesque sem. Sem placerat in id cursus mi pretium tellus. Tellus duis convallis tempus leo eu aenean sed. Sed diam urna tempor pulvinar vivamus fringilla lacus. Lacus nec metus bibendum egestas iaculis massa nisl. Nisl malesuada lacinia integer nunc posuere ut hendrerit.</p>",
        "showSection": true,
        "createdAt": "2025-04-29T10:57:20.000Z",
        "updatedAt": "2025-05-29T13:34:33.000Z"
    },
    {
        "id": 26,
        "userId": 128,
        "thumbnailUrl": "https://imgs.search.brave.com/C0OsfontM1F1-tzzwxhasUer0HscrpGqrCkjFuHE6_k/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTMx/MDgxNDA0MS9waG90/by9wb3J0cmFpdC1v/Zi1hLWJ1c2luZXNz/d29tYW4tc3RhbmRp/bmctaW4tYS1hLW1v/ZGVybi1vZmZpY2Uu/anBnP3M9NjEyeDYx/MiZ3PTAmaz0yMCZj/PXJMRFlFR2FHZmJG/cTZtSlBMYzJGSGpj/NktCS3lKRVR1Mzh5/NGEzeDExY009",
        "videoUrl": "https://www.youtube.com/watch?v=tpodNruOVoI",
        "failure": "<p>Lorem ipsum dolor sit amet consectetur adipiscing elit. Elit quisque faucibus ex sapien vitae pellentesque sem. Sem placerat in id cursus mi pretium tellus. Tellus duis convallis tempus leo eu aenean sed. Sed diam urna tempor pulvinar vivamus fringilla lacus. Lacus nec metus bibendum egestas iaculis massa nisl. Nisl malesuada lacinia integer nunc posuere ut hendrerit.</p>",
        "pivot": "<p>Lorem ipsum dolor sit amet consectetur adipiscing elit. Elit quisque faucibus ex sapien vitae pellentesque sem. Sem placerat in id cursus mi pretium tellus. Tellus duis convallis tempus leo eu aenean sed. Sed diam urna tempor pulvinar vivamus fringilla lacus. Lacus nec metus bibendum egestas iaculis massa nisl. Nisl malesuada lacinia integer nunc posuere ut hendrerit.</p>",
        "outcomes": "<p>Lorem ipsum dolor sit amet consectetur adipiscing elit. Elit quisque faucibus ex sapien vitae pellentesque sem. Sem placerat in id cursus mi pretium tellus. Tellus duis convallis tempus leo eu aenean sed. Sed diam urna tempor pulvinar vivamus fringilla lacus. Lacus nec metus bibendum egestas iaculis massa nisl. Nisl malesuada lacinia integer nunc posuere ut hendrerit.</p>",
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
        "mentorImage": "https://imgs.search.brave.com/N0IMP2_psp_grI84_apZtPasE8zZjN7QiZbEu6KK20k/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvNTQx/OTc1ODAyL3Bob3Rv/L2Nsb3NlLXVwLW9u/LWRpc2N1c3Npb24u/anBnP3M9NjEyeDYx/MiZ3PTAmaz0yMCZj/PVpSWlhrQzZURVgy/eHRxVHdCakJtVW1B/NUU3bnFoUXVfWHlV/cUs3eHQyaW89",
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
        "mentorImage": "https://imgs.search.brave.com/HjKh16NtLdsTc_VET0nNqWzEL3L1tIJekNu_0H69Yu0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/azEyLmNvbS93cC1j/b250ZW50L3VwbG9h/ZHMvMjAyNC8wMS9T/YW1wbGVIaWdoU2No/b29sTGVzc29ucy1j/b3B5LndlYnA",
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
        "mentorImage": "https://imgs.search.brave.com/73VFQ40UIpwarjtLXppElfGKiMZpl5KYyhtfXwzLJS8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTQ0/NjkzNDExOC9waG90/by9oYXBweS1idXNp/bmVzcy1tYW4tbGlz/dGVuaW5nLXRvLWEt/ZGlzY3Vzc2lvbi1p/bi1hbi1vZmZpY2Uu/anBnP3M9NjEyeDYx/MiZ3PTAmaz0yMCZj/PWppR2l2dHNYblYw/clpleDVQRWF3UllW/eU5OemhrbnR5WkRO/ZUxYZzdIMEE9",
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
  // const { myProjects } = useSelector((state) => state.portfolio.whatSection)

  const myProjects = [
    {
        "id": 917,
        "title": 'A New Aluminum Spotlight',
        "updatedAt": "2025-05-26T17:57:05.000Z",
        "createdAt": "2025-05-26T17:51:38.000Z",
        "children": [
            {
                "id": 918,
                "type": "learn",
                "showSection": true,
                "editorContent": "<p>Lorem ipsum dolor sit amet consectetur adipiscing elit. Placerat in id cursus mi pretium tellus duis. Urna tempor pulvinar vivamus fringilla lacus nec metus. Integer nunc posuere ut hendrerit semper vel class. Conubia nostra inceptos himenaeos orci varius natoque penatibus. Mus donec rhoncus eros lobortis nulla molestie mattis. Purus est efficitur laoreet mauris pharetra vestibulum fusce. Sodales consequat magna ante condimentum neque at luctus. Ligula congue sollicitudin erat viverra ac tincidunt nam. Lectus commodo augue arcu dignissim velit aliquam imperdiet. Cras eleifend turpis fames primis vulputate ornare sagittis. Libero feugiat tristique accumsan maecenas potenti ultricies habitant. Cubilia curae hac habitasse platea dictumst lorem ipsum. Faucibus ex sapien vitae pellentesque sem placerat in. Tempus leo eu aenean sed diam urna tempor.</p>",
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
                        "imageUrl": "https://imgs.search.brave.com/TnFM-Yy1z8ROaeCDcM-Yb5ZDEIUYuznPuTCcSYx5Q60/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuZnJlZWltYWdl/cy5jb20vaW1hZ2Vz/L2xhcmdlLXByZXZp/ZXdzLzA1Zi9taW5p/bWFsaXN0LWxhcHRv/cC1kZXNpZ24tMDQx/MC01NzA5OTcwLmpw/Zz9mbXQ",
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
                        "imageUrl": "https://imgs.search.brave.com/TnFM-Yy1z8ROaeCDcM-Yb5ZDEIUYuznPuTCcSYx5Q60/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuZnJlZWltYWdl/cy5jb20vaW1hZ2Vz/L2xhcmdlLXByZXZp/ZXdzLzA1Zi9taW5p/bWFsaXN0LWxhcHRv/cC1kZXNpZ24tMDQx/MC01NzA5OTcwLmpw/Zz9mbXQ",
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
                        "imageUrl": "https://imgs.search.brave.com/TnFM-Yy1z8ROaeCDcM-Yb5ZDEIUYuznPuTCcSYx5Q60/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuZnJlZWltYWdl/cy5jb20vaW1hZ2Vz/L2xhcmdlLXByZXZp/ZXdzLzA1Zi9taW5p/bWFsaXN0LWxhcHRv/cC1kZXNpZ24tMDQx/MC01NzA5OTcwLmpw/Zz9mbXQ",
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
                "editorContent": "<p>Lorem ipsum dolor sit amet consectetur adipiscing elit. Placerat in id cursus mi pretium tellus duis. Urna tempor pulvinar vivamus fringilla lacus nec metus. Integer nunc posuere ut hendrerit semper vel class. Conubia nostra inceptos himenaeos orci varius natoque penatibus. Mus donec rhoncus eros lobortis nulla molestie mattis. Purus est efficitur laoreet mauris pharetra vestibulum fusce. Sodales consequat magna ante condimentum neque at luctus. Ligula congue sollicitudin erat viverra ac tincidunt nam. Lectus commodo augue arcu dignissim velit aliquam imperdiet. Cras eleifend turpis fames primis vulputate ornare sagittis. Libero feugiat tristique accumsan maecenas potenti ultricies habitant. Cubilia curae hac habitasse platea dictumst lorem ipsum. Faucibus ex sapien vitae pellentesque sem placerat in. Tempus leo eu aenean sed diam urna tempor.</p>",
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
                        "imageUrl": "https://imgs.search.brave.com/TnFM-Yy1z8ROaeCDcM-Yb5ZDEIUYuznPuTCcSYx5Q60/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuZnJlZWltYWdl/cy5jb20vaW1hZ2Vz/L2xhcmdlLXByZXZp/ZXdzLzA1Zi9taW5p/bWFsaXN0LWxhcHRv/cC1kZXNpZ24tMDQx/MC01NzA5OTcwLmpw/Zz9mbXQ",
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
                        "imageUrl": "https://imgs.search.brave.com/TnFM-Yy1z8ROaeCDcM-Yb5ZDEIUYuznPuTCcSYx5Q60/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuZnJlZWltYWdl/cy5jb20vaW1hZ2Vz/L2xhcmdlLXByZXZp/ZXdzLzA1Zi9taW5p/bWFsaXN0LWxhcHRv/cC1kZXNpZ24tMDQx/MC01NzA5OTcwLmpw/Zz9mbXQ",
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
                        "imageUrl": "https://imgs.search.brave.com/TnFM-Yy1z8ROaeCDcM-Yb5ZDEIUYuznPuTCcSYx5Q60/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuZnJlZWltYWdl/cy5jb20vaW1hZ2Vz/L2xhcmdlLXByZXZp/ZXdzLzA1Zi9taW5p/bWFsaXN0LWxhcHRv/cC1kZXNpZ24tMDQx/MC01NzA5OTcwLmpw/Zz9mbXQ",
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
                "editorContent": "<p>Lorem ipsum dolor sit amet consectetur adipiscing elit. Placerat in id cursus mi pretium tellus duis. Urna tempor pulvinar vivamus fringilla lacus nec metus. Integer nunc posuere ut hendrerit semper vel class. Conubia nostra inceptos himenaeos orci varius natoque penatibus. Mus donec rhoncus eros lobortis nulla molestie mattis. Purus est efficitur laoreet mauris pharetra vestibulum fusce. Sodales consequat magna ante condimentum neque at luctus. Ligula congue sollicitudin erat viverra ac tincidunt nam. Lectus commodo augue arcu dignissim velit aliquam imperdiet. Cras eleifend turpis fames primis vulputate ornare sagittis. Libero feugiat tristique accumsan maecenas potenti ultricies habitant. Cubilia curae hac habitasse platea dictumst lorem ipsum. Faucibus ex sapien vitae pellentesque sem placerat in. Tempus leo eu aenean sed diam urna tempor.</p>",
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
                        "imageUrl": "https://imgs.search.brave.com/TnFM-Yy1z8ROaeCDcM-Yb5ZDEIUYuznPuTCcSYx5Q60/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuZnJlZWltYWdl/cy5jb20vaW1hZ2Vz/L2xhcmdlLXByZXZp/ZXdzLzA1Zi9taW5p/bWFsaXN0LWxhcHRv/cC1kZXNpZ24tMDQx/MC01NzA5OTcwLmpw/Zz9mbXQ",
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
        "skills_developed": "<p> Lorem ipsum dolor sit amet consectetur adipiscing elit. Placerat in id cursus mi pretium tellus duis. Urna tempor pulvinar vivamus fringilla lacus nec metus. Integer nunc posuere ut hendrerit semper vel class. Conubia nostra inceptos himenaeos orci varius natoque penatibus. Mus donec rhoncus eros lobortis nulla molestie mattis. Purus est efficitur laoreet mauris pharetra vestibulum fusce. Sodales consequat magna ante condimentum neque at luctus. Ligula congue sollicitudin erat viverra ac tincidunt nam. Lectus commodo augue arcu dignissim velit aliquam imperdiet. Cras eleifend turpis fames primis vulputate ornare sagittis. Libero feugiat tristique accumsan maecenas potenti ultricies habitant. Cubilia curae hac habitasse platea dictumst lorem ipsum. Faucibus ex sapien vitae pellentesque sem placerat in. Tempus leo eu aenean sed diam urna tempor.</p>",
        "opportunities_experienced": "<p> Lorem ipsum dolor sit amet consectetur adipiscing elit. Placerat in id cursus mi pretium tellus duis. Urna tempor pulvinar vivamus fringilla lacus nec metus. Integer nunc posuere ut hendrerit semper vel class. Conubia nostra inceptos himenaeos orci varius natoque penatibus. Mus donec rhoncus eros lobortis nulla molestie mattis. Purus est efficitur laoreet mauris pharetra vestibulum fusce. Sodales consequat magna ante condimentum neque at luctus. Ligula congue sollicitudin erat viverra ac tincidunt nam. Lectus commodo augue arcu dignissim velit aliquam imperdiet. Cras eleifend turpis fames primis vulputate ornare sagittis. Libero feugiat tristique accumsan maecenas potenti ultricies habitant. Cubilia curae hac habitasse platea dictumst lorem ipsum. Faucibus ex sapien vitae pellentesque sem placerat in. Tempus leo eu aenean sed diam urna tempor.</p>",
        "network_of_mentors": "<p> Lorem ipsum dolor sit amet consectetur adipiscing elit. Placerat in id cursus mi pretium tellus duis. Urna tempor pulvinar vivamus fringilla lacus nec metus. Integer nunc posuere ut hendrerit semper vel class. Conubia nostra inceptos himenaeos orci varius natoque penatibus. Mus donec rhoncus eros lobortis nulla molestie mattis. Purus est efficitur laoreet mauris pharetra vestibulum fusce. Sodales consequat magna ante condimentum neque at luctus. Ligula congue sollicitudin erat viverra ac tincidunt nam. Lectus commodo augue arcu dignissim velit aliquam imperdiet. Cras eleifend turpis fames primis vulputate ornare sagittis. Libero feugiat tristique accumsan maecenas potenti ultricies habitant. Cubilia curae hac habitasse platea dictumst lorem ipsum. Faucibus ex sapien vitae pellentesque sem placerat in. Tempus leo eu aenean sed diam urna tempor.</p>",
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
        "organization_name": "My Organization 1",
        "date_started": "2025-04-27T22:00:00.000Z",
        "date_graduated": null,
        "current_involved": true,
        "skills_developed": "<p> Lorem ipsum dolor sit amet consectetur adipiscing elit. Placerat in id cursus mi pretium tellus duis. Urna tempor pulvinar vivamus fringilla lacus nec metus. Integer nunc posuere ut hendrerit semper vel class. Conubia nostra inceptos himenaeos orci varius natoque penatibus. Mus donec rhoncus eros lobortis nulla molestie mattis. Purus est efficitur laoreet mauris pharetra vestibulum fusce. Sodales consequat magna ante condimentum neque at luctus. Ligula congue sollicitudin erat viverra ac tincidunt nam. Lectus commodo augue arcu dignissim velit aliquam imperdiet. Cras eleifend turpis fames primis vulputate ornare sagittis. Libero feugiat tristique accumsan maecenas potenti ultricies habitant. Cubilia curae hac habitasse platea dictumst lorem ipsum. Faucibus ex sapien vitae pellentesque sem placerat in. Tempus leo eu aenean sed diam urna tempor.</p>",
        "opportunities_experienced": "<p> Lorem ipsum dolor sit amet consectetur adipiscing elit. Placerat in id cursus mi pretium tellus duis. Urna tempor pulvinar vivamus fringilla lacus nec metus. Integer nunc posuere ut hendrerit semper vel class. Conubia nostra inceptos himenaeos orci varius natoque penatibus. Mus donec rhoncus eros lobortis nulla molestie mattis. Purus est efficitur laoreet mauris pharetra vestibulum fusce. Sodales consequat magna ante condimentum neque at luctus. Ligula congue sollicitudin erat viverra ac tincidunt nam. Lectus commodo augue arcu dignissim velit aliquam imperdiet. Cras eleifend turpis fames primis vulputate ornare sagittis. Libero feugiat tristique accumsan maecenas potenti ultricies habitant. Cubilia curae hac habitasse platea dictumst lorem ipsum. Faucibus ex sapien vitae pellentesque sem placerat in. Tempus leo eu aenean sed diam urna tempor.</p>",
        "network_of_mentors": "<p> Lorem ipsum dolor sit amet consectetur adipiscing elit. Placerat in id cursus mi pretium tellus duis. Urna tempor pulvinar vivamus fringilla lacus nec metus. Integer nunc posuere ut hendrerit semper vel class. Conubia nostra inceptos himenaeos orci varius natoque penatibus. Mus donec rhoncus eros lobortis nulla molestie mattis. Purus est efficitur laoreet mauris pharetra vestibulum fusce. Sodales consequat magna ante condimentum neque at luctus. Ligula congue sollicitudin erat viverra ac tincidunt nam. Lectus commodo augue arcu dignissim velit aliquam imperdiet. Cras eleifend turpis fames primis vulputate ornare sagittis. Libero feugiat tristique accumsan maecenas potenti ultricies habitant. Cubilia curae hac habitasse platea dictumst lorem ipsum. Faucibus ex sapien vitae pellentesque sem placerat in. Tempus leo eu aenean sed diam urna tempor.</p>",
        "created_at": "2025-05-26T23:08:00.000Z",
        "updated_at": "2025-05-26T23:08:00.000Z"
    }
]

const communityInvolvements = [
  {
        "id": 7,
        "user_id": 128,
        "organization_logo": "https://demo-startupstudio-drive.s3.amazonaws.com/users/128/c96c90776f07fe11bc4b3e25fc3cca52-1748300871946.png",
        "organization_name": "My Organization 2",
        "date_started": "2025-04-27T22:00:00.000Z",
        "date_graduated": null,
        "current_involved": true,
        "skills_developed": "<p> Lorem ipsum dolor sit amet consectetur adipiscing elit. Placerat in id cursus mi pretium tellus duis. Urna tempor pulvinar vivamus fringilla lacus nec metus. Integer nunc posuere ut hendrerit semper vel class. Conubia nostra inceptos himenaeos orci varius natoque penatibus. Mus donec rhoncus eros lobortis nulla molestie mattis. Purus est efficitur laoreet mauris pharetra vestibulum fusce. Sodales consequat magna ante condimentum neque at luctus. Ligula congue sollicitudin erat viverra ac tincidunt nam. Lectus commodo augue arcu dignissim velit aliquam imperdiet. Cras eleifend turpis fames primis vulputate ornare sagittis. Libero feugiat tristique accumsan maecenas potenti ultricies habitant. Cubilia curae hac habitasse platea dictumst lorem ipsum. Faucibus ex sapien vitae pellentesque sem placerat in. Tempus leo eu aenean sed diam urna tempor.</p>",
        "opportunities_experienced": "<p> Lorem ipsum dolor sit amet consectetur adipiscing elit. Placerat in id cursus mi pretium tellus duis. Urna tempor pulvinar vivamus fringilla lacus nec metus. Integer nunc posuere ut hendrerit semper vel class. Conubia nostra inceptos himenaeos orci varius natoque penatibus. Mus donec rhoncus eros lobortis nulla molestie mattis. Purus est efficitur laoreet mauris pharetra vestibulum fusce. Sodales consequat magna ante condimentum neque at luctus. Ligula congue sollicitudin erat viverra ac tincidunt nam. Lectus commodo augue arcu dignissim velit aliquam imperdiet. Cras eleifend turpis fames primis vulputate ornare sagittis. Libero feugiat tristique accumsan maecenas potenti ultricies habitant. Cubilia curae hac habitasse platea dictumst lorem ipsum. Faucibus ex sapien vitae pellentesque sem placerat in. Tempus leo eu aenean sed diam urna tempor.</p>",
        "network_of_mentors": "<p> Lorem ipsum dolor sit amet consectetur adipiscing elit. Placerat in id cursus mi pretium tellus duis. Urna tempor pulvinar vivamus fringilla lacus nec metus. Integer nunc posuere ut hendrerit semper vel class. Conubia nostra inceptos himenaeos orci varius natoque penatibus. Mus donec rhoncus eros lobortis nulla molestie mattis. Purus est efficitur laoreet mauris pharetra vestibulum fusce. Sodales consequat magna ante condimentum neque at luctus. Ligula congue sollicitudin erat viverra ac tincidunt nam. Lectus commodo augue arcu dignissim velit aliquam imperdiet. Cras eleifend turpis fames primis vulputate ornare sagittis. Libero feugiat tristique accumsan maecenas potenti ultricies habitant. Cubilia curae hac habitasse platea dictumst lorem ipsum. Faucibus ex sapien vitae pellentesque sem placerat in. Tempus leo eu aenean sed diam urna tempor.</p>",
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
            userBasicInfo={userBasicInfo}
            myRelationships={myRelationships}
            myFailures={myFailures}
            myMentors={myMentors}
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
