import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faVimeo,
  faLinkedinIn,
  faSpotify
} from '@fortawesome/free-brands-svg-icons'
import facebookLogo from '../../assets/images/academy-icons/facebook-logo-white.svg'
import discordLogo from '../../assets/images/academy-icons/icons8-discord.svg'
import instaLogo from '../../assets/images/academy-icons/icons8-instagram.svg'
import linkedinLogo from '../../assets/images/academy-icons/Icon awesome-linkedin.svg'
import spotifyLogo from '../../assets/images/academy-icons/Icon awesome-spotify.svg'
import xIconImage from '../../assets/images/X-icon.png'

export default function Footer(props) {
  return (
    // <div style={{ position: 'relative' }} className='footer-cont'>
    <section className={props.className} id='footer'>
      <div className='container-fluid'>
        <div className='row mx-md-4 footer-copyright'>
          <div className='col-sm-12 col-lg-4 text-align-left-footer'>
            <p>© POWERED BY LEARN TO START LLC 2025</p>
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
          <div className='col-md-3 col-sm-12 col-lg-4 text-align-right-footer' style={{marginTop:'10px'}}>
            <div className='footer-menu'>
              <ul className='mt-2 mt-lg-0'>
                <li>
                  <a
                    href='https://open.spotify.com/show/0LZ1HxvXnMf6IAdyY8M9q3'
                    rel='noreferrer'
                    target='_blank'
                  >
                    <img src={spotifyLogo} alt='spotify' />
                  </a>
                </li>
                <li>
                  <a
                    href='https://www.facebook.com/share/18ZBgvn5cw/?mibextid=wwXIfr'
                    rel='noreferrer'
                    target='_blank'
                  >
                    <img src={facebookLogo} alt='X (Twitter)' />
                  </a>
                </li>
                <li>
                  <a
                    href='https://www.linkedin.com/company/learntostart/'
                    rel='noreferrer'
                    target='_blank'
                  >
                    <img src={linkedinLogo} alt='linkedin' />
                  </a>
                </li>
                <li>
                  <a
                    href='https://discord.gg/AVGxnNJrpp'
                    rel='noreferrer'
                    target='_blank'
                  >
                    <img src={discordLogo} alt='discord' />
                  </a>
                </li>
                <li>
                  <a
                    href='https://www.instagram.com/mylearntostart/'
                    rel='noreferrer'
                    target='_blank'
                  >
                    <img src={instaLogo} alt='Insta' />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
    // </div>
  )
}
