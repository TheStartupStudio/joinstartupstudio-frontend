import { useCallback } from 'react'
import { useMemo } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'

const AccordionItem = ({
  skill,
  active,
  hideExpanded,
  parent,
  hasFinishedCertOne,
  certificationType
}) => {
  const [activeKey, setActiveKey] = active
  const history = useHistory()
  const isDisabled = parent == 2 && !hasFinishedCertOne

  const changeRoute = (type) => {
    setActiveKey({ certificationType, id: skill.id, type: type })
    history.push(
      `/iamr-certification-system/${certificationType}/${skill.id}/${type}`
    )
    hideExpanded()
  }
  console.log('activeKey',activeKey)

  const isActiveLink = useCallback(
    (type) => {
      console.log('type',type)
      return skill.id === activeKey.id && activeKey.type === type && 
        (type !== 'instructions'
          ? activeKey.type !== 'certification-status'
          : activeKey.type === type)
        ? 'active'
        : ''
    },
    [skill, activeKey]
  )

  const showCollapse = useMemo(() => {
    return (
      skill.id === activeKey.id &&
      activeKey.type !== 'certification-status' &&
      activeKey.type !== 'instructions'
    )
  }, [skill, activeKey])

  return (
    <div
      className={`accordion-item accordion-data-item ps-3 px-0 ${isActiveLink(
        'content'
      )}`}
      key={skill.id}
    >
      <h2 className="accordion-header bg-transparent" id="headingTwo">
        <button
          className="accordion-button collapsed accordion_button accordion-button-inner accordion-button-text pb-0 pt-3"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target={isDisabled ? '#' : `#collapse_inner${skill.id}`}
          aria-expanded="false"
          aria-controls="collapseTwo"
          disabled={isDisabled}
          style={{ opacity: isDisabled ? '0.5' : '1' }}
          onClick={() => {
            if (isDisabled) {
              toast.error(
                'You must earn Market-Ready Certification 1 before you can access Market-Ready Certification 2'
              )
              return
            }
            setActiveKey({ certificationType, id: skill.id, type: 'content' })
            history.push(
              `/iamr-certification-system/${certificationType}/${skill.id}/instructions`
            )
          }}
        >
          <span
            className={`iamr-status-point me-2 ${skill.SkillStatus.status}`}
            title={`Status: ${skill.SkillStatus.status ?? 'Not started'}`}
          />
          {skill.title}
        </button>
      </h2>
      <div
        id={`collapse_inner${skill.id}`}
        className={`accordion-collapse collapse ps-4 ${
          showCollapse ? 'show' : ''
        }`}
        aria-labelledby="headingTwo"
        data-bs-parent="#accordionExample0"
      >
        <div className="accordion-body py-0">
          <div className="mt-0 pt-0">
            {/* <Link
              to={'#'}
              onClick={() => changeRoute('instructions')}
              className={`d-block accordion-link my-2 ${isActiveLink(
                'instructions'
              )}`}
            >
              Instructions & Questions
            </Link>

            <Link
              to={'#'}
              onClick={() => changeRoute('journal')}
              className={`d-block accordion-link my-2 ${isActiveLink(
                'journal'
              )}`}
            >
              Journal
            </Link> */}

            <Link
              to={'#'}
              onClick={() => changeRoute('uploads')}
              className={`d-block accordion-link my-2 ${isActiveLink(
                'uploads'
              )}`}
            >
              Student Uploads
            </Link>

            <Link
              to={'#'}
              onClick={() => changeRoute('feedback')}
              className={`d-block accordion-link my-2 ${isActiveLink(
                'feedback'
              )}`}
            >
              Feedback
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccordionItem
