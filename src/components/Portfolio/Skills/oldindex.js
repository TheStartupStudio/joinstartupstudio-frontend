import React, { useEffect, useState } from 'react'
import IntlMessages from '../../../utils/IntlMessages'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt, faPlus } from '@fortawesome/free-solid-svg-icons'
import SkillBox from './oldskillBox'
import axiosInstance from '../../../utils/AxiosInstance'
import AddPersonalSkill from './oldaddPersonalSkill'
import { toast } from 'react-toastify'

export const Skills = (props) => {
  const [userSkills, setUserSkills] = useState([])
  const [loading, setLoading] = useState(false)
  const [showAddPersonalSkillModal, setShowAddPersonalSkillModal] =
    useState(false)
  const [skillName, SetSkillName] = useState('')

  const addNewSkill = async () => {
    axiosInstance
      .post('/skills/user', { name: skillName })
      .then((res) => {
        toast.success(
          <IntlMessages id='portfolio.add_personal_skill_success' />
        )
        setTimeout(() => {
          setUserSkills([
            ...userSkills,
            { id: res.data.id, name: res.data.name }
          ])
          SetSkillName('')
          closeModal('AddPersonalSkill')
        }, 5000)
      })
      .catch((err) => {
        if (err.response.status === 403) {
          toast.error(<IntlMessages id='portfolio.add_personal_skill_error' />)
          setTimeout(() => {
            closeModal('AddPersonalSkill')
            SetSkillName('')
          }, 5000)
        }
      })
  }

  const openModal = (name) => {
    if (name == 'AddPersonalSkill') {
      setShowAddPersonalSkillModal(true)
    }
  }

  const closeModal = (name) => {
    if (name == 'AddPersonalSkill') {
      setShowAddPersonalSkillModal(false)
    }
  }

  useEffect(() => {
    getUserSkills()
  }, [])

  const getUserSkills = async () => {
    setLoading(true)
    await axiosInstance
      .get('/users')
      .then((response) => {
        setUserSkills(response.data.Skills)
        setLoading(false)
      })
      .catch((err) => setLoading(false))
  }
  return (
    <div>
      <div className='my-account profile-tags-div mx-0 mt-4'>
        <h4 className='m-3'>
          <IntlMessages id='portfolio.skills_title' />
          <span className='float-end'>
            <FontAwesomeIcon
              icon={faPlus}
              className='mx-4'
              onClick={() => openModal('AddPersonalSkill')}
            />
            <FontAwesomeIcon icon={faPencilAlt} onClick={() => alert('0')} />
          </span>
        </h4>
        <div className='w-100 ms-3'>
          {loading ? (
            <IntlMessages id={'general.loading'} />
          ) : !typeof userSkills != 'undefined' ? (
            userSkills?.map((data) => <SkillBox data={data} />)
          ) : (
            <SkillBox />
          )}
        </div>
      </div>
      <AddPersonalSkill
        show={showAddPersonalSkillModal}
        onHide={() => closeModal('AddPersonalSkill')}
        skillname={skillName}
        setskillname={(data) => SetSkillName(data)}
        onSave={() => addNewSkill()}
        loading={loading}
      />
    </div>
  )
}
