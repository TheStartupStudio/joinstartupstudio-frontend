import avator from '../../../assets/images/profile-image.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faAward } from '@fortawesome/free-solid-svg-icons'
import './index.css'

export const Certification = (props) => {
  return (
    <div
      className='col-6 col-sm-4 col-md-4 col-xl-3 text-center mb-4'
      onClick={props.click && props.modal}
    >
      <div className='Certification py-3'>
        <a
          href={
            props.data.credential_url?.startsWith('http')
              ? props.data.credential_url
              : `https://${props.data.credential_url}`
          }
          target='_blank'
        >
          {props.data.image ? (
            <img src={props.data.image} alt='' />
          ) : (
            <>
              <div
                // style={{ height: '150px' }}
                className='d-flex justify-content-center align-items-center license-image'
              >
                <FontAwesomeIcon
                  icon={faAward}
                  style={{
                    width: '52px',
                    height: '72px',
                    color: '#BBBDBF'
                  }}
                />
              </div>
            </>
          )}
          <p className='mb-0 mt-3'>{props.data.name}</p>
          <div className='px-3'>
            <button className='lts-button view-credential-btn align-center mt-4'>
              <span className='mx-auto'>View</span>
            </button>
          </div>
        </a>
      </div>
    </div>
  )
}
