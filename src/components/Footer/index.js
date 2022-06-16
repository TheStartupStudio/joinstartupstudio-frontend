import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faVimeo,
  faLinkedinIn,
  faTwitter,
  faSpotify
} from '@fortawesome/free-brands-svg-icons'

export default function Footer() {
  return (
    <section id='footer'>
      <div className='container-fluid'>
        <div className='row footer-copyright'>
          <div
            className='col-sm-12 col-lg-4 text-align-left-footer'
            style={{ paddingLeft: '20px' }}
          >
            <p>© POWERED BY THE STARTUP STUDIO</p>
          </div>
          <div className='col-md-12 col-sm-12 col-lg-4 text-align-center-footer'>
            <a
              href='https://learntostart.com'
              rel='noreferrer'
              target='_blank'
              style={{ fontSize: '12px', color: '#fff' }}
            >
              LEARNTOSTART.COM
            </a>
          </div>
          <div className='col-md-3 col-sm-12 col-lg-4 text-align-right-footer'>
            <div className='footer-menu' style={{ paddingRight: '20px' }}>
              <ul>
                {/* <li>
                  <a
                    href='https://www.facebook.com/learntostart/'
                    rel='noreferrer'
                    target='_blank'
                  >
                    <FontAwesomeIcon icon={faFacebookF} />
                  </a>
                </li> */}
                <li>
                  <a
                    href='https://twitter.com/learntostart'
                    rel='noreferrer'
                    target='_blank'
                  >
                    <FontAwesomeIcon icon={faTwitter} />
                  </a>
                </li>
                <li>
                  <a
                    href='https://www.linkedin.com/company/learntostart/'
                    rel='noreferrer'
                    target='_blank'
                  >
                    <FontAwesomeIcon icon={faLinkedinIn} />
                  </a>
                </li>
                <li>
                  <a
                    href='https://vimeo.com/showcase/9368302'
                    rel='noreferrer'
                    target='_blank'
                  >
                    <FontAwesomeIcon icon={faVimeo} />
                  </a>
                </li>
                <li>
                  <a
                    href='https://open.spotify.com/show/0LZ1HxvXnMf6IAdyY8M9q3'
                    rel='noreferrer'
                    target='_blank'
                  >
                    <FontAwesomeIcon icon={faSpotify} />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
