import React, { useState, useEffect } from 'react'
import EvidenceBody from './EvidenceBody'
import axiosInstance from '../../../../utils/AxiosInstance'

const initialEvidenceData = [
  {
    selectedSkills: [],
    imageFile: null,
    imageUrl: null,
    linkInputValue: '',
    titleInputValue: '',
    type: 'evidence-1'
  },
  {
    selectedSkills: [],
    imageFile: null,
    imageUrl: null,
    linkInputValue: '',
    titleInputValue: '',
    type: 'evidence-2'
  },
  {
    selectedSkills: [],
    imageFile: null,
    imageUrl: null,
    linkInputValue: '',
    titleInputValue: '',
    type: 'evidence-3'
  }
]

const Evidences = (props) => {
  const {
    evidencesMenuItems: { menuItem1 = '', menuItem2 = '', menuItem3 = '' } = {},
    onChange,
    evidences
  } = props

  const [activeEvidence, setActiveEvidence] = useState(null)
  const [evidencesData, setEvidencesData] = useState(initialEvidenceData)
  // console.log('evidencesData', evidencesData)
  useEffect(() => {
    onChange?.(evidencesData)
  }, [evidencesData])

  useEffect(() => {
    if (props.evidences) {
      setEvidencesData(props.evidences)
      setActiveEvidence('evidence-1')
    }
  }, [])

  const getEvidenceName = () => {
    switch (activeEvidence) {
      case 'evidence-1':
        return menuItem1
      case 'evidence-2':
        return menuItem2
      case 'evidence-3':
        return menuItem3
      default:
        return ''
    }
  }

  const onChangeEvidenceData = (data, type) => {
    setEvidencesData((prevState) => {
      return prevState.map((item) => {
        if (item.type === type) {
          const updatedData = { ...item, ...data }
          return updatedData
        } else {
          return item
        }
      })
    })
  }

  const getActiveData = (type) => {
    return evidencesData?.find((item) => item.type === type)
  }

  const deleteImage = (deleteSuccess, type) => {
    const foundedEvidence = getActiveData(type)
    if (deleteSuccess) {
      axiosInstance
        .delete(
          `/hsPortfolio/myProjects/evidences/${foundedEvidence?.id}/image`
        )
        .then((res) => {
          setEvidencesData(
            evidencesData.map((evidence) => {
              if (evidence.id === foundedEvidence.id) {
                return { ...evidence, imageUrl: null }
              } else {
                return evidence
              }
            })
          )
        })
        .catch(() => {})
    }
  }

  const deleteImageFile = (deleteSuccess, type) => {
    const foundedEvidence = getActiveData(type)

    setEvidencesData(
      evidencesData.map((evidence) => {
        if (evidence.id === foundedEvidence.id) {
          return { ...evidence, imageFile: '' }
        } else {
          return evidence
        }
      })
    )
  }

  return (
    <div className={'evidences-container'}>
      <div className={`evidences-nav overflow-hidden`}>
        <div
          className={`evidence-nav-item ${
            activeEvidence === 'evidence-1' ? 'active' : ''
          } py-3`}
          onClick={() => setActiveEvidence('evidence-1')}
        >
          Content upload #1
        </div>
        <div
          className={`evidence-nav-item ${
            activeEvidence === 'evidence-2' ? 'active' : ''
          } py-3`}
          onClick={() => setActiveEvidence('evidence-2')}
        >
          Content upload #2
        </div>
        <div
          className={`evidence-nav-item ${
            activeEvidence === 'evidence-3' ? 'active' : ''
          } py-3`}
          onClick={() => setActiveEvidence('evidence-3')}
        >
          Content upload #3
        </div>
      </div>
      {activeEvidence === 'evidence-1' && (
        <div>
          <EvidenceBody
            evidenceType={activeEvidence}
            evidenceName={getEvidenceName()}
            initialData={getActiveData('evidence-1')}
            evidencesData={evidencesData}
            onChangeEvidenceData={(data) =>
              onChangeEvidenceData(data, activeEvidence)
            }
            projectType={props.projectType}
            deleteEvidenceImage={(data) => deleteImage(data, 'evidence-1')}
            deleteEvidenceImageFile={(data) =>
              deleteImageFile(data, 'evidence-1')
            }
          />
        </div>
      )}
      {activeEvidence === 'evidence-2' && (
        <div>
          <EvidenceBody
            evidenceType={activeEvidence}
            evidenceName={getEvidenceName()}
            initialData={getActiveData('evidence-2')}
            evidencesData={evidencesData}
            onChangeEvidenceData={(data) =>
              onChangeEvidenceData(data, activeEvidence)
            }
            projectType={props.projectType}
            deleteEvidenceImage={(data) => deleteImage(data, 'evidence-2')}
            deleteEvidenceImageFile={(data) =>
              deleteImageFile(data, 'evidence-2')
            }
          />
        </div>
      )}
      {activeEvidence === 'evidence-3' && (
        <div>
          <EvidenceBody
            evidenceType={activeEvidence}
            evidenceName={getEvidenceName()}
            initialData={getActiveData('evidence-3')}
            evidencesData={evidencesData}
            onChangeEvidenceData={(data) =>
              onChangeEvidenceData(data, activeEvidence)
            }
            projectType={props.projectType}
            deleteEvidenceImage={(data) => deleteImage(data, 'evidence-3')}
            deleteEvidenceImageFile={(data) =>
              deleteImageFile(data, 'evidence-3')
            }
          />
        </div>
      )}
    </div>
  )
}

export default Evidences
