import courseLogo from '../../assets/images/academy-icons/academy-logo-group.png'

function CheckEmail() {
  return (
    <>
      <div className='d-flex justify-content-center p-5'>
        <div className='d-flex align-items-center flex-column payment-main'>
          <img
            src={courseLogo}
            alt='course-logo'
            className='course-logo-image'
          />
          <h2 className='text-uppercase fs-24 fw-bold mt-5 text-black'>
            Check your email
          </h2>
          <p className='text-black fs-15'>
            We have sent you an email with a link to confirm your email address.
            Please check your inbox and click the link to complete your
            registration.
          </p>
          <p className='text-black fs-15'>
            If you don't see the email, please check your spam or junk folder.
          </p>
          <p className='text-black fs-15'>
            If you still don't see it, please click the button below to resend
            the email.
          </p>
          <button className='btn btn-primary mt-3'>Resend Email</button>
        </div>
      </div>
    </>
  )
}

export default CheckEmail
