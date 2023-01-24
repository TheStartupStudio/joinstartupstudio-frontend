import useIamrInboxContext from './iamrInboxContext'

const LoadingAnimation = () => {
  const { loading } = useIamrInboxContext()

  return loading ? (
    <div className='d-flex justify-content-center align-items-center flex-column my-5 py-5'>
      <div className='lds-facebook'>
        <div></div>
        <div></div>
        <div></div>
      </div>
      {/* <p style={{ color: '#01c5d1' }}>Loading, please wait!</p> */}
    </div>
  ) : null
}

export default LoadingAnimation
