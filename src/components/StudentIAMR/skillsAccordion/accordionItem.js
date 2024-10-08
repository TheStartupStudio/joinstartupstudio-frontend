import { useCallback,useRef } from 'react'
import { useMemo } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'

const AccordionItem = ({ skill, active, hideExpanded }) => {
  const [activeKey, setActiveKey] = active
  const history = useHistory()
  const { studentId } = useParams()
  const isFirstRender = useRef(true);

  const changeRoute = (type) => {
    setActiveKey({ id: skill.id, type: type })
    history.push(`/student-iamr/${studentId}/${skill.id}/${type}`)
    hideExpanded()
  }

  const isActiveLink = useCallback(
    (type) => {
      if (isFirstRender.current) {
        isFirstRender.current = false;
        return false;
      }
  
      return skill.id === activeKey.id  && 
        (type === 'content'
          ? activeKey.type !== 'certification-status'
          : activeKey.type === type)
        ? 'active'
        : ''
    },
    [skill, activeKey]
  );

  const showCollapse = useMemo(() => {
    return (
      skill.id === activeKey.id && activeKey.type !== 'certification-status' && active.type !== 'content'
    )
  }, [skill, activeKey])

  return (
    <div
      className={`accordion-item accordion-data-item ps-4 px-0 ${isActiveLink(
        'content'
      )}`}
      key={skill.id}
    >
      <h2 className='accordion-header' id='headingTwo'>
        <button
          className='accordion-button collapsed accordion_button accordion-button-inner accordion-button-text pb-0 ps-3'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target={`#collapse_inner${skill.id}`}
          aria-expanded='false'
          aria-controls='collapseTwo'
          onClick={() => {
            setActiveKey({ id: skill.id, type: 'content' })
            history.push(`/student-iamr/${studentId}/${skill.id}/content`)
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
        aria-labelledby='headingTwo'
        data-bs-parent='#accordionExample0'
      >
        <div className='accordion-body py-0'>
          <div className='mt-0 pt-0'>
            <Link
              to={'#'}
              onClick={() => changeRoute('uploads')}
              className={`d-block accordion-link my-2 ${isActiveLink(
                'uploads'
              )}`}
            >
              Student Uploads
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccordionItem
