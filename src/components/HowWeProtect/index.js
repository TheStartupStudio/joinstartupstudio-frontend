import { Modal, ModalBody } from 'reactstrap'
import leftArrow from '../../assets/images/academy-icons/left-arrow.png'
import AWS from '../../assets/images/academy-icons/AWS.png'
import Security from '../../assets/images/academy-icons/Security.png'
import Shield from '../../assets/images/academy-icons/Shield.png'

function HowWeProtect({ isOpen, setIsOpen }) {
  function toggleModal() {
    setIsOpen((prev) => !prev)
  }

  return (
    <Modal isOpen={isOpen} toggle={toggleModal} style={{ maxWidth: '1100px' }}>
      <span
        onClick={toggleModal}
        className=' cursor-pointer'
        style={{ zIndex: '1' }}
      >
        <img className='left-arrow-modal' src={leftArrow} alt='left' />
      </span>
      <ModalBody>
        <div
          className='mt-4-4 d-flex gap-4 align-items-center'
          style={{ paddingInline: '10rem' }}
        >
          <div className=''>
            <h5 className='fs-15 fw-light text-uppercase text-black lh-sm'>
              A Partnership for <br />
              <span className='fs-24 fw-bold'>Security</span>
            </h5>
            <p className='fs-18 fw-light text-black'>
              The Learn to Start e-Learning Platform integrates the resources of
              Amazon Web Services and the security of Amazon Cognito to provide
              its participants with a powerful and secure online experience.
            </p>
          </div>
          <img src={AWS} alt='aws' className='w-100' />
        </div>
        <div className='px-5 d-flex gap-5'>
          <div>
            <h5 className='fs-15 fw-light text-uppercase text-black lh-sm text-nowrap'>
              Keeping your login <br />
              <span className='fs-24 fw-bold text-nowrap'>Safe and Secure</span>
            </h5>
            <img className='w-100' src={Shield} alt='shield' />
          </div>
          <div className='align-self-end'>
            <p className='fs-18 fw-light text-black'>
              Amazon Cognito provides a secure login experience that controls
              and gives access to resources to authorized users.
            </p>
            <p className='fs-18 fw-light text-black'>
              With adaptive authentication to help protect user accounts, Amazon
              Cognito detects unusual sign-in activity, such as sign-in attempts
              from new locations and devices, and either prompts users for
              additional verification or blocks the sign-in request. Users can
              verify their identities using SMS or a Time-based One-time
              Password (TOTP) generator, such as Google Authenticator.
            </p>
            <p className='fs-18 fw-light text-black'>
              Amazon Cognito helps protect users from unauthorized access to
              their accounts using compromised credentials. When Amazon Cognito
              detects users have entered credentials that have been compromised
              elsewhere, it prompts them to change their password.
            </p>
          </div>
        </div>
        <div className='px-5 gap-5 d-flex mt-5'>
          <div>
            <h5 className='fs-15 fw-light text-uppercase text-black lh-sm text-nowrap'>
              Globally Recognized <br />
              <span className='fs-24 fw-bold text-nowrap'>
                Compliance Standards
              </span>
            </h5>
            <p className='fs-18 fw-light text-black'>
              Amazon Cognito is a standards-based Identity Provider and supports
              identity and access management standards, such as Oauth 2.0, SAML
              2.0, and OpenID Connect.
            </p>
            <p className='fs-18 fw-light text-black'>
              With Amazon Cognito, users can sign in through social identity
              providers such as Google, Facebook, and Amazon, and through
              enterprise identity providers such as Microsoft Active Directory
              via SAML.
            </p>
            <p className='fs-18 fw-light text-black'>
              Amazon Cognito supports multi-factor authentication and encryption
              of data-at-rest and in-transit. Amazon Cognito is HIPAA eligible
              and PCI DSS, SOC, ISO/IEC 27001, ISO/IEC 27017, ISO/IEC 27018, and
              ISO 9001 compliant.
            </p>
          </div>
          <img className='w-100' src={Security} alt='security' />
        </div>
      </ModalBody>
    </Modal>
  )
}

export default HowWeProtect
