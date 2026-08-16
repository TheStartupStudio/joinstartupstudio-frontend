import React from 'react'
import studioOsLogo from '../../assets/images/studioos-logo-horizontal.png'
import './index.css'

const PLATFORM_BASE = 'https://joinstudioos.com'

export default function PlatformFooter() {
  return (
    <footer className='platform-site-footer'>
      <div className='platform-site-footer__wrap'>
        <div className='platform-site-footer__grid'>
          <div className='platform-site-footer__brand'>
            <img
              className='platform-site-footer__logo'
              src={studioOsLogo}
              alt='StudioOS, Powered by Learn to Start'
            />
            <p>
              A virtual studio where people build themselves. Powered by Learn
              to Start.
            </p>
            <div className='platform-site-footer__social'>
              <a
                href='https://open.spotify.com/show/0LZ1HxvXnMf6IAdyY8M9q3'
                aria-label='Listen on Spotify'
                target='_blank'
                rel='noopener noreferrer'
              >
                <svg viewBox='0 0 24 24' aria-hidden='true'>
                  <path d='M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm4.3 14.4a.63.63 0 0 1-.86.2c-2.37-1.45-5.34-1.77-8.85-.97a.62.62 0 1 1-.28-1.22c3.83-.88 7.13-.5 9.79 1.12.3.19.4.58.2.87zm1.2-2.7a.78.78 0 0 1-1.08.26c-2.71-1.67-6.85-2.15-10.06-1.18a.79.79 0 1 1-.46-1.51c3.66-1.11 8.22-.57 11.34 1.35.37.23.49.72.26 1.08zm.1-2.8C14.94 9.03 9.12 8.83 5.79 9.83a.94.94 0 1 1-.54-1.8c3.82-1.16 10.2-.93 14.23 1.44a.94.94 0 0 1-.96 1.63z' />
                </svg>
              </a>
              <a
                href='https://www.linkedin.com/company/lts-startup-studio'
                aria-label='StudioOS on LinkedIn'
                target='_blank'
                rel='noopener noreferrer'
              >
                <svg viewBox='0 0 24 24' aria-hidden='true'>
                  <path d='M6.94 8.5H3.56V20h3.38V8.5zM5.25 3.5a1.97 1.97 0 1 0 0 3.94 1.97 1.97 0 0 0 0-3.94zM20.44 20h.01v-6.4c0-3.14-.68-5.56-4.34-5.56-1.76 0-2.94.97-3.42 1.88h-.05V8.5H9.4V20h3.38v-5.63c0-1.48.28-2.92 2.12-2.92 1.81 0 1.83 1.7 1.83 3.02V20h3.71z' />
                </svg>
              </a>
              <a
                href='https://www.instagram.com/joinstudioos'
                aria-label='StudioOS on Instagram'
                target='_blank'
                rel='noopener noreferrer'
              >
                <svg viewBox='0 0 24 24' aria-hidden='true'>
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M12 2c-2.72 0-3.06.01-4.13.06-1.06.05-1.79.22-2.43.47a4.9 4.9 0 0 0-1.77 1.15A4.9 4.9 0 0 0 2.53 5.44c-.25.64-.42 1.37-.47 2.43C2.01 8.94 2 9.28 2 12s.01 3.06.06 4.13c.05 1.06.22 1.79.47 2.43a4.9 4.9 0 0 0 1.15 1.77 4.9 4.9 0 0 0 1.77 1.15c.64.25 1.37.42 2.43.47C8.94 21.99 9.28 22 12 22s3.06-.01 4.13-.06c1.06-.05 1.79-.22 2.43-.47a4.9 4.9 0 0 0 1.77-1.15 4.9 4.9 0 0 0 1.15-1.77c.25-.64.42-1.37.47-2.43.05-1.07.06-1.41.06-4.13s-.01-3.06-.06-4.13c-.05-1.06-.22-1.79-.47-2.43a4.9 4.9 0 0 0-1.15-1.77 4.9 4.9 0 0 0-1.77-1.15c-.64-.25-1.37-.42-2.43-.47C15.06 2.01 14.72 2 12 2zm0 2.16c2.67 0 2.99.01 4.04.06.98.04 1.5.2 1.86.34.47.18.8.4 1.15.75.35.35.57.68.75 1.15.14.36.3.88.34 1.86.05 1.05.06 1.37.06 4.04s-.01 2.99-.06 4.04c-.04.98-.2 1.5-.34 1.86-.18.47-.4.8-.75 1.15-.35.35-.68.57-1.15.75-.36.14-.88.3-1.86.34-1.05.05-1.37.06-4.04.06s-2.99-.01-4.04-.06c-.98-.04-1.5-.2-1.86-.34a3.1 3.1 0 0 1-1.15-.75 3.1 3.1 0 0 1-.75-1.15c-.14-.36-.3-.88-.34-1.86-.05-1.05-.06-1.37-.06-4.04s.01-2.99.06-4.04c.04-.98.2-1.5.34-1.86.18-.47.4-.8.75-1.15.35-.35.68-.57 1.15-.75.36-.14.88-.3 1.86-.34 1.05-.05 1.37-.06 4.04-.06zm0 3.68a4.16 4.16 0 1 0 0 8.32 4.16 4.16 0 0 0 0-8.32zm0 6.86a2.7 2.7 0 1 1 0-5.4 2.7 2.7 0 0 1 0 5.4zm5.3-7.03a.97.97 0 1 1-1.94 0 .97.97 0 0 1 1.94 0z'
                  />
                </svg>
              </a>
              <a
                href='https://www.facebook.com/joinstudioos'
                aria-label='StudioOS on Facebook'
                target='_blank'
                rel='noopener noreferrer'
              >
                <svg viewBox='0 0 24 24' aria-hidden='true'>
                  <path d='M15.12 8.5H13.5V7c0-.66.44-.81.75-.81h1.83V3.13L13.53 3.1c-2.6 0-3.44 1.94-3.44 3.19V8.5H8.5v3h1.59V21h3.41v-9.5h2.14l.32-3z' />
                </svg>
              </a>
            </div>
          </div>

          <div className='platform-site-footer__col'>
            <h5>The Studio</h5>
            <a href={`${PLATFORM_BASE}/course.html`}>
              The Course in Entrepreneurship
            </a>
            <a href={`${PLATFORM_BASE}/journals.html`}>
              The Market-Ready Journals
            </a>
            <a href={`${PLATFORM_BASE}/portfolio.html`}>
              The Market-Ready Portfolio
            </a>
          </div>

          <div className='platform-site-footer__col'>
            <h5>Compare</h5>
            <a href={`${PLATFORM_BASE}/alternatives-to-a-business-degree.html`}>
              Alternatives to a Business Degree
            </a>
            <a href={`${PLATFORM_BASE}/for-career-changers.html`}>
              For Career Changers
            </a>
            <a href={`${PLATFORM_BASE}/for-first-time-builders.html`}>
              For First-Time Builders
            </a>
            <a href={`${PLATFORM_BASE}/studioos-vs-foundr.html`}>
              Foundr Comparison
            </a>
          </div>

          <div className='platform-site-footer__col'>
            <h5>Company</h5>
            <a href={`${PLATFORM_BASE}/about.html`}>About Us</a>
            <a href={`${PLATFORM_BASE}/contact.html`}>Contact Us</a>
            <a
              href='https://learntostart.com'
              target='_blank'
              rel='noopener noreferrer'
            >
              Learn to Start
            </a>
          </div>

          <div className='platform-site-footer__col'>
            <h5>For Teams</h5>
            <a href={`${PLATFORM_BASE}/group-seats.html`}>Group Seats</a>
            <a href={`${PLATFORM_BASE}/partner-program.html`}>Partner Program</a>
          </div>
        </div>

        <div className='platform-site-footer__bottom'>
          <span>
            &copy; Learn to Start LLC 2026 | StudioOS, Powered by Learn to Start
          </span>
          <span>
            <a href={`${PLATFORM_BASE}/privacy.html`}>Privacy</a>
            &nbsp;&nbsp;
            <a href={`${PLATFORM_BASE}/terms.html`}>Terms</a>
          </span>
        </div>
      </div>
    </footer>
  )
}
