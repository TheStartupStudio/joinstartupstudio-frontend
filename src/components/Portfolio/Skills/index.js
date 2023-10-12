import React, { useEffect, useState } from 'react'
import IntlMessages from '../../../utils/IntlMessages'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt, faPlus } from '@fortawesome/free-solid-svg-icons'
import { SkillBoxEditModal } from './skillBoxEditModal'
import RemoveSkill from './RemoveSkill'
import axiosInstance from '../../../utils/AxiosInstance'
import './index.css'
import SkillBoxButton from './skillBox'
import { toast } from 'react-toastify'
import PortfolioSection from '../../../pages/PortfolioNew/PortfolioSection'
import { VerifyButton } from '../../../pages/PortfolioNew/editPortfolio'
import { useHistory } from 'react-router-dom'
import useWindowWidth from '../../../utils/hooks/useWindowWidth'

export const Skills = (props) => {
  const [showSkillBoxModal, setShowSkillBoxModal] = useState(false)
  const [savingLoading, setSavingLoading] = useState(false)
  const [showRemoveSkill, setShowRemoveSkill] = useState(false)
  const [allSkill, setAllSkills] = useState([])
  const [selcetedSkills, setSelectedSkills] = useState([])
  const [userSkill, setUserSkill] = useState([])
  const [newSkill, setNewSkill] = useState()
  const [removeSkill, setRemoveSkill] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [approvedSkills, setApprovedSkills] = useState([])

  // useEffect(() => {
  //   setUserSkill(props.skills)
  // }, [props.skills])
  const [isPreview, setIsPreview] = useState(null)

  useEffect(() => {
    setIsPreview(props.isPreview)
  }, [props.isPreview])

  const remove = async () => {
    await axiosInstance
      .delete('/skills/multiple', { data: removeSkill })
      .then((data) => {
        toast.success(<IntlMessages id="alerts.success_change" />)

        setShowRemoveSkill(false)

        setUserSkill(
          userSkill.filter((skill) => removeSkill.indexOf(skill.name) < 0)
        )
        setRemoveSkill([])
        setTimeout(() => {
          GetSkillsFromDB()
        }, 4000)
      })
      .catch(() => {
        setShowRemoveSkill(false)
        toast.success(<IntlMessages id="alerts.success_change" />)
        getUserSkills()
        GetSkillsFromDB()
      })
  }

  useEffect(() => {
    setApprovedSkills(props.approvedSkills)
  }, [props.approvedSkills])
  // const getIAMRSkills = async () => {
  //   try {
  //     const { data } = await axiosInstance.get('/iamr/skills')
  //     const approvedSkills = data.skills.reduce((accumulator, skill) => {
  //       if (
  //         skill.SkillStatus.status === 'approved' ||
  //         skill.SkillStatus.status === 'proficient'
  //       ) {
  //         accumulator.push(skill)
  //       }
  //       return accumulator
  //     }, [])
  //     console.log(approvedSkills)
  //
  //     setApprovedSkills(approvedSkills)
  //   } catch (error) {
  //     console.error('error', error)
  //   }
  // }

  const editAddedSelectedSkill = (name) => {
    let array = selcetedSkills
    const index = array.indexOf(name)
    if (index > -1) {
      array.splice(index, 1)
    }
    setSelectedSkills(array)
  }

  const editRemoveSkill = (name) => {
    let array = removeSkill
    const index = array.indexOf(name)
    if (index > -1) {
      array.splice(index, 1)
    }
    setRemoveSkill(array)
  }

  const update = async () => {
    await axiosInstance
      .post('/skills/multiple', { data: selcetedSkills })
      .then((data) => {
        toast.success(<IntlMessages id="alerts.success_change" />)
        selcetedSkills.map((skill) => {
          setUserSkill((old) => [...old, { name: skill }])
        })
        setShowSkillBoxModal(false)
        setTimeout(() => {
          GetSkillsFromDB()
          // getUserSkills()
        }, 5000)
        setSelectedSkills([])
      })
      .catch(() => {
        toast.success(<IntlMessages id="alerts.success_change" />)
        // setTimeout(() => {
        selcetedSkills.map((skill) => {
          setUserSkill((old) => [...old, { name: skill }])
        })
        getUserSkills()
        GetSkillsFromDB()
        setSelectedSkills([])
        setShowSkillBoxModal(false)
        // }, 5000)
      })
  }

  const getUserSkills = async () => {
    setIsLoading(true)
    await axiosInstance
      .get('/users')
      .then((response) => {
        setUserSkill(response.data.Skills)
        setIsLoading(false)
      })
      .catch((err) => err)
  }

  const GetSkillsFromDB = async () => {
    await axiosInstance
      .get('/skills/recomendet')
      .then((data) => {
        setAllSkills(data.data)
      })
      .catch((data) => setAllSkills(data.data))
  }

  useEffect(() => {
    getUserSkills()
    GetSkillsFromDB()
  }, [])
  // useEffect(() => {
  //   getIAMRSkills()
  //   // console.log('inside SKILLS')
  // }, [])
  const history = useHistory()
  // const isPreview = history.location.pathname.includes('preview')

  const windowWidth = useWindowWidth()

  const skillsContainerWidth = () => {
    if (isPreview) {
      return '100%'
    } else {
      if (windowWidth < 700) {
        return '70%'
      } else {
        return '85%'
      }
    }
  }

  const verifyButtonContainerWidth = () => {
    if (windowWidth < 700) {
      return '30%'
    } else {
      return '15%'
    }
  }

  const verifyButtonWidth = () => {
    if (windowWidth < 700) {
      return '100%'
    } else {
      return '75%'
    }
  }
  // console.log(approvedSkills)
  return (
    <>
      {!isLoading ? (
        approvedSkills?.length ? (
          <PortfolioSection
            title={'Market-ready certified skills'}
            isEdit={false}
            isAdd={false}
            onEdit={
              userSkill && userSkill.length > 0
                ? () => {
                    setShowRemoveSkill(true)
                  }
                : () => {
                    setShowRemoveSkill(false)
                    toast.error('You dont have any skills selected!')
                  }
            }
            onAdd={() => setShowSkillBoxModal(true)}
            // handleShowInPortfolio={updateShowPreference}
          >
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ width: skillsContainerWidth() }}>
                <div className="w-100 ">
                  <div className="row">
                    {/*{userSkill && userSkill.length > 0 ? (*/}
                    {approvedSkills?.map((data) => (
                      <div className="col-md-3 col-sm-6" key={data.id}>
                        <SkillBoxButton
                          data={data}
                          from={'index'}
                          from0={'public'}
                          key={data.id}
                        />
                      </div>
                    ))}
                    {/*) : (*/}

                    {/*)}*/}
                  </div>
                </div>
              </div>
            </div>
          </PortfolioSection>
        ) : (
          <PortfolioSection
            title={'Market-ready certified skills'}
            isAdd={false}
            onAdd={() => {
              setShowSkillBoxModal(true)
            }}
          >
            <div className="col-xl-12 col-md-3 col-sm-6">
              {/* <SkillBoxButton
                data={{ name: 'add' }}
                from={'index'}
                isEmpty={true}
                openModal={() => {
                  setShowSkillBoxModal(true)
                }}
              /> */}
              <h6 className="text-center">No certified skills</h6>
            </div>
          </PortfolioSection>
        )
      ) : (
        <></>
      )}
      {/* <SkillBoxEditModal
        allSkill={allSkill}
        show={showSkillBoxModal}
        onHide={() => {
          // setNewSkill()

          // props.closeSkillBox()
          setShowSkillBoxModal(false)
          setSelectedSkills([])
        }}
        setAllSkills={(data) => {
          setAllSkills(data)
        }}
        editAddedSelectedSkill={(data) => editAddedSelectedSkill(data)}
        selcetedSkills={selcetedSkills}
        setSelectedSkills={(data) => setSelectedSkills(data)}
        loading={savingLoading}
        recomendetSkill={allSkill && allSkill}
        setLoading={() => setSavingLoading()}
        onSave={() => {
          if (selcetedSkills.length == 0) {
            return toast.error('No skill is selected')
          }
          update()
        }}
        newSkill={newSkill}
        setNewSkill={(data) => setNewSkill(data)}
      /> */}
      <RemoveSkill
        show={showRemoveSkill}
        onHide={() => {
          setRemoveSkill([])
          // props.closeRemoveSkill()
          setShowRemoveSkill(false)
        }}
        userSkill={userSkill}
        selcetedSkills={selcetedSkills}
        setSelectedSkills={(data) => setSelectedSkills(data)}
        loading={savingLoading}
        recomendetSkill={allSkill && allSkill}
        setRemoveSkill={(data) => setRemoveSkill(data)}
        setLoading={() => setSavingLoading()}
        onSave={() => {
          if (removeSkill.length == 0) {
            return toast.error('No skill is selected')
          }
          remove()
        }}
        editRemoveSkill={(skill) => editRemoveSkill(skill)}
        newSkill={newSkill}
        setNewSkill={(data) => setNewSkill(data)}
      />
    </>
  )
}

/*
     te all skills jon te gjitha skill perveq skill qe i ka useri
     to all skills only skills than
     not are in is the skill that user have */
