import React from 'react'
import IntlMessages from '../../utils/IntlMessages'
import PaymentForm from '../../components/Pay'
import RegisterSupermanGraphic from '../../assets/images/register-superman-graphic.png'
import RegisterProofGraphic from '../../assets/images/register-proof-graphic.png'
import Empowerment from '../../assets/images/empowerment.png'
import Performance from '../../assets/images/performance.png'
import Wellness from '../../assets/images/wellness.png'
import MyStartuplive from '../../assets/images/startuplive.png'
import MyPortfolio from '../../assets/images/my-portfolio.png'
import BeyondLearnToStart from '../../assets/images/beyond-lts.png'
import Spotlight from '../../assets/images/spotlight.png'
import MyCommunity from '../../assets/images/my-community.png'
import Marketplace from '../../assets/images/marketplace.png'
import StoryInMotion from '../../assets/images/story-in-motion.png'
import RegisterBottomGraphic from '../../assets/images/register-graphic.png'
import Footer from '../../components/Footer'

function Register() {
  return (
    <>
      <div className='container-fluid secure-page-padding'>
        <div className='row mx-0'>
          <div className='col-12 col-lg-12 col-md-12 '>
            <div className='row register-header'>
              <div className='col-10 col-lg-10 '>
                <h4 className='mt-5 pt-5 mt-md-0 pt-md-0'>
                  <IntlMessages id='register.get_ready_to_embark' />{' '}
                  <span style={{ color: '#01C5D1', fontWeight: '600' }}>
                    <IntlMessages id='register.journey' />
                  </span>{' '}
                  <IntlMessages id='register.unlike_any_other' />
                </h4>
              </div>
              <div className='col-2 col-lg-2'>
                <img
                  src={RegisterSupermanGraphic}
                  className='register-superman-graphic-small mt-1 pt-5 pt-md-0 mt-md-0'
                  alt=''
                />
              </div>
            </div>
            <div className='row mx-0 mt-5'>
              <h4 className='text-center register-page-welocme-text-header'>
                <IntlMessages id='register.welcome_to' />
              </h4>
            </div>
            <div
              className='row mx-auto text-center 
            '
            >
              <div className='col-12 text-center register-page-welocme-text-header-image px-0'>
                <img
                  src={RegisterProofGraphic}
                  alt=''
                  className='text-center
                '
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='container-fluid px-0 mt-4'>
        <div className='row mx-0'>
          <div className='col-12 col-lg-12 col-md-12 p-0'>
            <div className='grey-box mt-3 register-section'>
              <div className='row mt-3'>
                <div className='main-section-title-text-register text-center mt-0 mt-md-3 gx-0'>
                  <h4>
                    <IntlMessages id='register.what_is' />
                  </h4>
                  <h1>
                    <IntlMessages id='register.learn_to_start' />
                  </h1>
                </div>
              </div>
              <div className='row mt-3 content-text-wrapper px-4 px-md-5'>
                <p>
                  <IntlMessages id='register.learn_to_start_p1' />
                </p>
                <p>
                  <IntlMessages id='register.learn_to_start_p2' />
                </p>
              </div>
              <div className='content-text-wrapper row mt-3 px-md-5'>
                <div className='col-4 col-lg-4 '>
                  <img src={Empowerment} alt='Empowerment' className='me-5 ' />
                </div>
                <div className='col-4 col-lg-4 text-center'>
                  <img src={Performance} alt='Performance' />
                </div>
                <div className='col-4 col-lg-4 text-end'>
                  <img src={Wellness} alt='Wellness' />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='container-fluid p-md-5'>
        <div className='row mx-0 px-md-5'>
          <div className='col-12 col-lg-12 px-md-5 col-md-12'>
            <div className='row mx-md-0 '>
              <div className='main-section-title-text-register text-center mb-4 px-md-5'>
                <h4>
                  <IntlMessages id='register.powerful' />
                </h4>
                <h1>
                  <IntlMessages id='register.platform' />
                </h1>
              </div>
            </div>
            <div className='row mt-2'>
              <div className='col-12 col-md-3'>
                <img
                  src={MyStartuplive}
                  width={'95%'}
                  alt='My Startup Live'
                  className='mb-4 mb-md-0'
                />
              </div>
              <div className='col-12 col-md-9 content-text-wrapper my-auto'>
                <h4>
                  <IntlMessages id='register.my_startup_live' />
                </h4>
                <p>
                  <IntlMessages id='register.my_startup_live_text' />
                </p>
              </div>
            </div>
            <div className='row mt-4'>
              <div className='col-12 col-md-9 content-text-wrapper my-auto order-2 order-md-0'>
                <h4>
                  <IntlMessages id='register.my_portfolio' />
                </h4>
                <p>
                  <IntlMessages id='register.my_portfolio_text' />
                </p>
              </div>
              <div className='col-12 col-md-3 mb-4 my-md-0'>
                <img src={MyPortfolio} width={'95%'} alt='My Portfolio' />
              </div>
            </div>
            <div className='row mt-4'>
              <div className='col-12 col-md-3 my-4 my-mb-0'>
                <img
                  src={BeyondLearnToStart}
                  width={'95%'}
                  alt='Beyond Learn To Start'
                />
              </div>
              <div className='col-12 col-md-9 content-text-wrapper my-auto'>
                <h4>
                  <IntlMessages id='navigation.beyond_your_course' />
                </h4>
                <p>
                  <IntlMessages id='register.beyond_learn_to_start' />
                </p>
              </div>
            </div>
            <div className='row mt-4'>
              <div className='col-12 col-md-9 content-text-wrapper my-auto'>
                <h4>
                  <IntlMessages id='register.spotlight' />
                </h4>
                <p>
                  <IntlMessages id='register.spotlight_text' />
                </p>
              </div>
              <div className='col-12 col-md-3 my-4 my-mb-0'>
                <img src={Spotlight} width={'95%'} alt='Spotlight' />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='container-fluid px-0'>
        <div className='row mx-0'>
          <div className='col-12 col-lg-12 col-md-12 px-0'>
            <div className='grey-box mt-3 register-section'>
              <div className='row mt-3'>
                <div className='main-section-title-text-register text-center mt-3'>
                  <h1>
                    <IntlMessages id='register.coming_spring' />
                  </h1>
                </div>
              </div>
              <div className='row mt-3 justify-content-around'>
                <div className='col-12 col-lg-3 content-text-wrapper'>
                  <div className='text-center'>
                    <img
                      src={MyCommunity}
                      style={{ width: '100%' }}
                      alt='My Community'
                    />
                  </div>
                  <h5 className='mt-2'>
                    <IntlMessages id='register.spotlight' />
                  </h5>
                  <p className=''>
                    {' '}
                    <IntlMessages id='register.spotlight_text_1' />
                  </p>
                </div>
                <div className='col-12 col-lg-3 content-text-wrapper'>
                  <div className='text-center'>
                    <img
                      src={Marketplace}
                      style={{ width: '100%' }}
                      alt='Marketplace'
                    />
                  </div>
                  <h5 className='mt-2'>
                    <IntlMessages id='register.my_marketplace' />
                  </h5>
                  <p className=''>
                    {' '}
                    <IntlMessages id='register.my_marketplace_text' />
                  </p>
                </div>
                <div className='col-12 col-lg-3 content-text-wrapper '>
                  <div className='text-center'>
                    <img
                      src={StoryInMotion}
                      style={{ width: '100%' }}
                      alt='Story In Motion'
                    />
                  </div>
                  <h5 className='mt-2'>
                    <IntlMessages id='register.story_in_motion' />
                  </h5>
                  <p className=''>
                    {' '}
                    <IntlMessages id='register.story_in_motion_text' />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='container-fluid p-0'>
        <div className='row mx-0 p-0'>
          <div className='col-12 col-lg-12 col-md-12 p-0 '>
            <div className='black-box register-section'>
              <div className='row mt-3 px-md-5'>
                <div className='main-section-title-text-register  text-center mt-3'>
                  <h1>
                    <IntlMessages id='register.outcomes' />
                  </h1>
                  <h4>
                    <IntlMessages id='register.outcomes_text' />
                  </h4>
                </div>
                <div className='col-12 col-md-6 mt-5'>
                  <ul>
                    <li className='mb-3'>
                      <IntlMessages id='register.outcomes_text1' />
                    </li>
                    <li className='mb-3'>
                      <IntlMessages id='register.outcomes_text2' />
                    </li>
                    <li className='mb-3'>
                      <IntlMessages id='register.outcomes_text3' />
                    </li>
                    <li className='mb-3'>
                      <IntlMessages id='register.outcomes_text4' />
                    </li>
                    <li className='mb-3'>
                      <IntlMessages id='register.outcomes_text5' />
                    </li>
                    <li className='mb-3'>
                      <IntlMessages id='register.outcomes_text6' />
                    </li>
                    <li>
                      <IntlMessages id='register.outcomes_text7' />
                    </li>
                  </ul>
                </div>
                <div className='col-12 col-md-6 mt-5'>
                  <ul>
                    <li className='mb-3'>
                      <IntlMessages id='register.outcomes_text8' />
                    </li>
                    <li className='mb-3'>
                      <IntlMessages id='register.outcomes_text9' />
                    </li>
                    <li className='mb-3'>
                      <IntlMessages id='register.outcomes_text10' />
                    </li>
                    <li className='mb-3'>
                      <IntlMessages id='register.outcomes_text11' />
                    </li>
                    <li className='mb-3'>
                      <IntlMessages id='register.outcomes_text12' />
                    </li>
                    <li>
                      <IntlMessages id='register.outcomes_text13' />
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='container-fluid p-0'>
        <div className='row'>
          <div className='col-12 col-lg-12 col-md-12 register-section'>
            <div className='main-section-title-text-register text-center px-md-5 pb-3'>
              <h4>
                <IntlMessages id='register.are_you' />
              </h4>
              <h1>
                <IntlMessages id='register.ready_to_start' />
              </h1>
            </div>
            <div className='mt-2 content-text-wrapper pb-4 px-5'>
              <h6>
                <IntlMessages id='register.who_should_join_this_platform' />
              </h6>
              <p>
                <IntlMessages id='register.who_should_join_this_platform_text' />
              </p>
              <h6 className='mt-3'>
                <IntlMessages id='register.how_much_does_this_platform_cost' />
              </h6>
              <p>
                <IntlMessages id='register.how_much_does_this_platform_cost_text' />
              </p>
              <h6 className='mt-3'>
                <IntlMessages id='register.cancel_my_subscription' />
              </h6>
              <p>
                <IntlMessages id='register.cancel_my_subscription_text' />
              </p>
            </div>
            <div className='text-center monthly-payment mt-2 px-2 px-md-5'>
              <h3 className='pb-4'>
                <IntlMessages id='register.monthly_payment' />
              </h3>
              <PaymentForm />
            </div>
            <div className='mt-5 text-center lts-registration-logo-end'>
              <img
                src={RegisterBottomGraphic}
                className='mt-3 mb-5'
                alt='Register Bottom Graphics'
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Register
