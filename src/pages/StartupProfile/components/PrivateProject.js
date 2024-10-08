import React from 'react'
import NotFoundImg from '../../../assets/images/not-found.png'
import { Link } from 'react-router-dom'
import '../style/index.css'

const PrivateProject = (props) => {
  return (
    <div
      className='grey-box mx-auto my-auto'
      style={{ minHeight: 'calc(100vh - 90px)', width: '100%' }}
    >
      <div className='container row mx-auto p-2 p-md-5 pb-0'>
        <div className='not-found my-auto mx-auto row p-md-5'>
          <span className='page-title mt-5 mt-md-auto'>
            Go to <Link to={'/MyStartupProfile'}> MyProjects</Link>
          </span>
          <div
            className='col col-12 col-md-8 col-xs-10 my-auto mx-auto'
            style={{ textAlign: 'center' }}
          >
            <h1 className='page-title'>Oh no! </h1>
            <p>This Project is private.</p>
            <p>We’re sorry. The project you were looking for is private.</p>
          </div>
          <div className='row'>
            <div
              className='col col-12 col-md-6 col-xs-10 not-found-img m-xs-auto mt-5 mt-md-0'
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

export default PrivateProject
