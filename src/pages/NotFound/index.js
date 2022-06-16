import NotFoundImg from '../../assets/images/not-found.png'
function NotFound() {
  return (
    <div
      className='grey-box mx-auto my-auto'
      style={{ minHeight: 'calc(100vh - 90px)', width: '100%' }}
    >
      <div className='container row mx-auto p-2 p-md-5 pb-0'>
        <div className='not-found my-auto mx-auto row p-md-5'>
          <div
            className='col col-12 col-md-8 col-xs-10 my-auto mx-auto'
            style={{ textAlign: 'center' }}
          >
            <h1>404</h1>
            <p>This is not the page you're looking for.</p>
            <p>
              We’re sorry. Whatever you were looking for isn’t here. Let’s try
              getting you back on the right path. Try heading back to the main
              page, or if you have an account, you can log in here.
            </p>
            <p>
              Or, if you think there’s been a mistake, you can email us at
              mycourse@joinstartupstudio.com
            </p>
          </div>
          <div className='row'>
            <div
              className='col col-12 col-md-6 col-xs-10 not-found-img m-xs-auto'
              style={{ marginTop: '-10%' }}
            >
              <img
                src={NotFoundImg}
                className='img-fluid'
                style={{ width: '80%' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound
