import React, { useState } from 'react'
import Unsplash1 from '../../../assets/images/unsplash-1.png'
import Unsplash2 from '../../../assets/images/unsplash-2.png'
import Unsplash3 from '../../../assets/images/unsplash-3.png'
import { useHistory } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faMapMarked,
  faPen,
  faPencilAlt,
  faTimes,
  faTrashAlt
} from '@fortawesome/free-solid-svg-icons'
import DeleteProject from './Modals/DeleteProject'

const ProjectCard = (props) => {
  const [deleteProject, setOpenDeleteProject] = useState(false)

  const navigate = useHistory()
  return (
    <div
      className='ProjectCard px-0 position-relative mx-2'
      style={{}}
      // onClick={
      //   props.from == 'Newest-Projects'
      //     ? () => {
      //         navigate.push('/PublishedProject/' + props.data.slug)
      //       }
      //     : props.from == 'test' && 'a'
      // }
      // onClick={() => {
      //   navigate.push('/PublishedProject/' + props.data.id)
      // }}
    >
      <img
        src={props.data.image ? props.data.image : Unsplash1}
        style={{ width: '100%', height: '55%', objectFit: 'cover' }}
        className=''
        onClick={() => {
          navigate.push('/PublishedProject/' + props.data.id)
        }}
      />
      {props.editAble && (
        <div className='icons-option position-absolute d-flex'>
          <FontAwesomeIcon
            icon={faPencilAlt}
            style={{ fontSize: '20px' }}
            className={' project-icon'}
            onClick={() => {
              navigate.push('/editProject/' + props.data.id)
            }}
          />
          <FontAwesomeIcon
            icon={faTrashAlt}
            className={'mt-2 project-icon'}
            style={{ fontSize: '20px' }}
            onClick={() => {
              setOpenDeleteProject(true)
            }}
          />
        </div>
      )}
      <div className='d-flex flex-row pt-2 ps-1 px-2'>
        <img
          src={props.data.image ? props.data.image : Unsplash2}
          style={{ width: '22px', height: '22px', objectFit: 'cover' }}
          className='Project-image me-1 px-0 mx-0 py-0 my-0 mt-1'
        />
        <div
          className='d-flex flex-column my-auto w-100'
          onClick={() => {
            navigate.push('/PublishedProject/' + props.data.id)
          }}
        >
          <span className='mt-1 NewestProjectsByTheCommunity_card_title my-0 py-0 gy-0 ps-1'>
            {props.data.company_name}
          </span>
          <span className='NewestProjectsByTheCommunity_card_slogan pt-1 ps-1'>
            {props.data.company_slogan}
          </span>
        </div>
      </div>
      <p
        className='NewestProjectsByTheCommunity_card_description px-2 mb-2'
        onClick={() => {
          navigate.push('/PublishedProject/' + props.data.id)
        }}
      >
        {props.data.description.length > 100
          ? props.data.description.substring(0, 100) + ' ...'
          : props.data.description}
      </p>
      <DeleteProject
        show={deleteProject}
        deleteProject={(id) => {
          setOpenDeleteProject(false)
          props.deleteProject(id)
        }}
        onHide={() => setOpenDeleteProject(false)}
        data={props.data}
      />
    </div>
  )
}

export default ProjectCard
