import { useHistory } from 'react-router-dom'
import { getCertificationType } from '../../../../utils/helpers'
import { useParams } from 'react-router-dom/cjs/react-router-dom.min'

const CertificationAccordionItem = ({
  status,
  active,
  id,
  hideExpanded,
  finishedContent,
  certificationType
}) => {
  const [activeKey, setActiveKey] = active
  const history = useHistory()
  return (
    <div
      className={`accordion-item accordion-data-item  px-0  ${
        activeKey.id == id &&
        activeKey.type === 'certification-status' &&
        finishedContent
          ? 'active'
          : ''
      }`}
    >
      <h2
        className='accordion-header'
        id='headingTwo'
        onClick={() => {
          history.push(`/iamr/${certificationType}/${id}/certification-status`)
          setActiveKey({
            certificationType,
            id: id,
            type: 'certification-status'
          })
          hideExpanded()
        }}
      >
        <button
          className='grouping-string accordion-button collapsed accordion_button accordion-button-inner accordion-button-text pb-0'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target={`#collapse_inner-certificate-${id}`}
          aria-expanded='false'
          aria-controls='collapseTwo'
          style={{ opacity: !finishedContent ? '0.5' : 1, color: '#BBBDC0' }}
          disabled={!finishedContent}
        >
          {/* <span className={`iamr-status-point me-2 ${status}`}></span> */}
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
