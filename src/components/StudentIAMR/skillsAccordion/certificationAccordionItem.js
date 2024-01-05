import { useHistory, useParams } from 'react-router-dom'

const CertificationAccordionItem = ({ status, active, id, hideExpanded }) => {
  const [activeKey, setActiveKey] = active
  const history = useHistory()
  const { studentId } = useParams()

  return (
    <div
      className={`accordion-item accordion-data-item px-0 ${
        activeKey.id == id && activeKey.type === 'certification-status'
          ? 'active'
          : ''
      }`}
    >
      <h2
        className='accordion-header'
        id='headingTwo'
        onClick={() => {
          history.push(`/student-iamr/${studentId}/${id}/certification-status`)
          setActiveKey({ id: id, type: 'certification-status' })
          hideExpanded()
        }}
      >
        <button
          className='accordion-button collapsed accordion_button accordion-button-inner accordion-button-text pb-0 text-secondary'
          style={{fontWeight:'600'}}
          type='button'
          data-bs-toggle='collapse'
          data-bs-target={`#collapse_inner-certificate-${id}`}
          aria-expanded='false'
          aria-controls='collapseTwo'
        >
          <span className={` me-2 `}></span>
          CERTIFICATION
        </button>
      </h2>
      <div
        id={`collapse_inner-certificate-${id}`}
        className={`accordion-collapse collapse ps-4 `}
        aria-labelledby='headingTwo'
        data-bs-parent='#accordionExample0'
      ></div>
    </div>
  )
}

export default CertificationAccordionItem
