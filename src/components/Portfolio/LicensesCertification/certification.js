import avator from '../../../assets/images/profile-image.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faAward } from '@fortawesome/free-solid-svg-icons'
import './index.css'

export const Certification = (props) => {
  return (
    <div
      className="col-6 col-sm-4 col-md-4 col-xl-3 text-center "
      onClick={props.click && props.modal}
      style={{
        width: '90%'
        // display: 'flex',
        // justifyContent: 'center',
        // alignItems: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          border: '1px solid #E5E5E5'
        }}
      >
        <a
          href={
            props.data.credential_url?.startsWith('http')
              ? props.data.credential_url
              : `https://${props.data.credential_url}`
          }
          target="_blank"
          rel="noreferrer"
          className={'w-100'}
        >
          <p
            className="mb-0 mt-3"
            style={{
              textAlign: 'center',
              font: 'normal normal 600 16px/17px Montserrat',
              letterSpacing: 0.64,
              color: '#707070'
            }}
          >
            {props.data.name}
          </p>

          <div className="image-container">
            {props.data.image ? (
              <img src={props.data.image} alt="" />
            ) : (
              <>
                <div
                  // style={{ height: '150px' }}
                  className="d-flex justify-content-center align-items-center "
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
          </div>

          <div style={{ width: '100%' }}>
            <button
              className="lts-button view-credential-btn align-center mt-4"
              style={{
                width: '100%',
                textTransform: 'capitalize',
                font: 'normal normal 600 17px/17px Montserrat',
                letterSpacing: 0.68
              }}
            >
              <span className="mx-auto">View credential</span>
            </button>
          </div>
        </a>
      </div>
    </div>
  )
}
