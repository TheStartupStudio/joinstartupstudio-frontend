/* Top Level Route file */

import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { useSelector, connect } from 'react-redux'
import { IntlProvider } from 'react-intl'
import AppLocale from './lang'
import Layout from './pages/Layout'
import PublicLayout from './pages/Layout/publicLayout'
import CSVUpload from './components/CSVUpload'
import VerifyEmailByCode from './pages/Register/verifyEmailByCode'
import LtsJournal from './pages/LtsJournal'
import MyCourseEntrepreneurship from './pages/MyCourseEntrepreneurship'
import PublishedProject from './pages/StartupProfile/components/published'
import EditProject from './pages/StartupProfile/pages/edit'
import StudentJournals from './pages/studentJournals'
import IamrContents from './pages/Iamr/IamrContentsAccordion'
import ImrContent from './pages/Iamr/ImrContent'
import TestJournal from './pages/LtsJournal/TestJournal'

const Login = React.lazy(() => import('./pages/Auth/Login'))
const ChooseLogin = React.lazy(() => import('./pages/Auth/Login/ChooseLogin'))
const SecurePage = React.lazy(() => import('../src/pages/Secure'))
const ForgotPassword = React.lazy(() =>
  import('./pages/Auth/Login/forgotPassword')
)
const ResetPassword = React.lazy(() =>
  import('./pages/Auth/Login/resetPassword')
)
const CreateAccount = React.lazy(() =>
  import('./pages/Auth/Login/createAccount')
)
const NotFound = React.lazy(() => import('../src/pages/NotFound'))

const Terms = React.lazy(() => import('./pages/Terms'))
const Register = React.lazy(() => import('./pages/Register'))
const Dashboard = React.lazy(() => import('./pages/Dashboard'))
const Portfolio = React.lazy(() => import('./pages/Portfolio'))
const MyCurriculum = React.lazy(() =>
  import('./pages/MyLearnToStartEDU/MyCurriculum/MyCurriculum')
)
const MyCertificationGuide = React.lazy(() =>
  import('./pages/MyLearnToStartEDU/MyCertificationGuide/MyCertificationGuide')
)
const EditPortfolio = React.lazy(() =>
  import('./pages/Portfolio/editPortfolio')
)
const MyStudents = React.lazy(() => import('./pages/MyStudents'))
const Resources = React.lazy(() => import('./pages/Resources'))
const Preview = React.lazy(() => import('./pages/StartupProfile/preview'))

const SavedMedia = React.lazy(() => import('./pages/Saved'))
const Resubscribe = React.lazy(() => import('./pages/Resubscribe'))
const StartupLive = React.lazy(() => import('./pages/StartupLive'))
const Spotlight = React.lazy(() => import('./pages/Spotlight'))
const LiveStream = React.lazy(() => import('./pages/StartupLive/livestream'))
const AllVideos = React.lazy(() => import('./pages/BeyondYourCourse/allVideos'))
const BeyondYourCourse = React.lazy(() => import('./pages/BeyondYourCourse'))
const BeyondYourCourseVideo = React.lazy(() =>
  import('../src/pages/BeyondYourCourse/beyondYourCourseVideo')
)
const Profile = React.lazy(() => import('./pages/Profile/index'))
const ProfilePreview = React.lazy(() =>
  import('./pages/Profile/profilePreview')
)
const MyMarketReadyGuide = React.lazy(() =>
  import('./pages/MyMarketReadyGuide')
)
const PublicProfile = React.lazy(() => import('./pages/Profile/publicProfile'))
const PublicPortfolio = React.lazy(() =>
  import('./pages/Portfolio/publicPortfolio')
)

const PreviewPublicPortfolio = React.lazy(() =>
  import('./pages/PortfolioNew/previewPublicPortfolio')
)
const UserPortfolioProj = React.lazy(() =>
  import('./pages/StartupProfile/userProjects')
)
const Iamr = React.lazy(() => import('../src/pages/Iamr'))

const MyNotes = React.lazy(() => import('../src/pages/MyNotes'))
const SampleNote = React.lazy(() => import('../src/pages/MyNotes/sampleNote'))
const MyJournals = React.lazy(() => import('../src/pages/MyJournals'))
const Logout = React.lazy(() => import('./pages/Auth/LogOut'))
const VerifyEmail = React.lazy(() => import('./pages/Verify'))
const MyConnections = React.lazy(() => import('./pages/MyConnections'))
const StoryInMotion = React.lazy(() => import('./pages/StoryInMotion'))
const MyStartupProfile = React.lazy(() => import('./pages/StartupProfile'))
const PreviewPortfolioNew = React.lazy(() =>
  import('./pages/PortfolioNew/previewPortfolio')
)
const EditPortfolioNew = React.lazy(() =>
  import('./pages/PortfolioNew/editPortfolio')
)

const PasswordChangeRequired = React.lazy(() =>
  import('./pages/Auth/Login/passwordChangeRequired')
)

const JournalsManagement = React.lazy(() =>
  import('./pages/JournalsManagement')
)
const JournalsManagement2 = React.lazy(() =>
  import('./pages/JournalsManagement/JournalsManagement2')
)

const IAMRinbox = React.lazy(() => import('./pages/IAMRinbox'))
const StudentIAMR = React.lazy(() => import('../src/pages/StudentIAMR'))
const TestPage = React.lazy(() => import('../src/pages/LtsJournal/TestPage'))

function Router(props) {
  const currentAppLocale = AppLocale[props.locale]
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated)
  const clientBaseURL = `${process.env.REACT_APP_CLIENT_BASE_URL}`

  return (
    <IntlProvider
      locale={currentAppLocale.locale}
      messages={currentAppLocale.messages}
      onError={() => ''}
    >
      <React.Fragment>
        {isAuthenticated ? (
          <Layout>
            <Switch>
              <Route path="/dashboard" component={Dashboard} />
              <Route path="/savedMedia" component={SavedMedia} />
              <Route path="/csv-upload" component={CSVUpload} />
              <Route path="/portfolio" component={Portfolio} />
              <Route path="/my-curriculum" component={MyCurriculum} />
              <Route
                path="/my-certification-guide"
                component={MyCertificationGuide}
              />
              <Route path="/my-students" component={MyStudents} />
              <Route path="/resources" component={Resources} />
              <Route
                exact
                path="/edit-portfolio"
                component={EditPortfolioNew}
              />
              <Route
                exact
                path="/edit-portfolio/recommendation/:id"
                component={EditPortfolioNew}
              />
              <Route
                path="/preview-portfolio"
                component={PreviewPortfolioNew}
              />
              <Route exact path="/terms" component={Terms} />
              <Route
                exact
                path="/user-portfolio/:username"
                component={PreviewPublicPortfolio}
              />
              <Route
                exact
                path="/beyond-your-course"
                component={BeyondYourCourse}
              />
              <Route
                exact
                path="/beyond-your-course/:id"
                component={BeyondYourCourse}
              />
              <Route path="/story-in-motion" component={StoryInMotion} />
              {/* <Route path='/PrivateProject' component={PrivateProject} /> */}
              <Route path="/UserProject/:uid" component={UserPortfolioProj} />
              {/* <Route path='/MyStartupProfile' component={MyProjects} /> */}
              <Route path="/PreviewMyStartupProfile/:id" component={Preview} />
              <Route path="/:page/videos" component={AllVideos} />
              <Route exact path="/startup-live" component={StartupLive} />
              <Route exact path="/spotlight" component={Spotlight} />
              <Route exact path="/startup-livestream" component={LiveStream} />
              <Route exact path="/account" component={Profile} />
              <Route exact path="/profile-preview" component={ProfilePreview} />
              <Route
                path="/my-training/"
                component={(props) => (
                  <LtsJournal {...props} category="my-training" />
                )}
              />
              {/* Students journals */}
              {/* <Route
                path='/student-journals/:id/'
                component={StudentJournals}
              /> */}
              <Route
                path="/students-journals/:studentId"
                component={(props) => (
                  <StudentJournals {...props} category="my-training" />
                )}
              />
              {/* <Route
                path='/students/:studentId/'
                component={(props) => <StudentJournals {...props} category='hs1' />}
              />
              <Route
                path='/students/:studentId/'
                component={(props) => <StudentJournals {...props} category='hs2' />}
              />
              <Route
                path='/students/:studentId/'
                component={(props) => <StudentJournals {...props} category='hs3' />}
              />
              <Route
                path='/students/:studentId/'
                component={(props) => <StudentJournals {...props} category='hs4' />}
              />
              <Route
                path='/students/:studentId/'
                component={(props) => (
                  <StudentJournals {...props} category='market-ready' />
                )}
              /> */}
              {/* Students journals */}
              <Route
                path="/new-hs1-journal/"
                component={(props) => <TestJournal {...props} category="hs1" />}
              />{' '}
              <Route
                path="/new-hs2-journal/"
                component={(props) => (
                  <TestJournal {...props} category="new-hs2" />
                )}
              />{' '}
              <Route
                path="/new-hs1-journal/:type/"
                component={(props) => (
                  <TestJournal {...props} category="new-hs1" />
                )}
              />
              <Route
                path="/new-hs2-journal/:type/"
                component={(props) => (
                  <TestJournal {...props} category="new-hs2" />
                )}
              />
              {/*<Route*/}
              {/*  path="/new-hs1-journal/week/"*/}
              {/*  component={(props) => (*/}
              {/*    <TestJournal {...props} category="new-hs1" />*/}
              {/*  )}*/}
              {/*/>*/}
              <Route
                path="/new-hs1-journal/:journalId"
                component={<TestPage />}
              />
              <Route
                path="/hs1-journal/"
                component={(props) => <LtsJournal {...props} category="hs1" />}
              />
              <Route
                path="/hs2-journal/"
                component={(props) => <LtsJournal {...props} category="hs2" />}
              />
              <Route
                path="/hs3-journal/"
                component={(props) => <LtsJournal {...props} category="hs3" />}
              />
              <Route
                path="/hs4-journal/"
                component={(props) => <LtsJournal {...props} category="hs4" />}
              />
              <Route
                path="/market-ready/"
                component={(props) => (
                  <LtsJournal {...props} category="market-ready" />
                )}
              />
              <Route
                exact
                path="/My-Market-Ready-Guide"
                component={MyMarketReadyGuide}
              />
              {/* <Route
                exact
                path='/MyStartupProfile'
                component={MyStartupProfile}
              /> */}
              {/* <Route exact path='/editProject/:id' component={EditProject} />
              <Route
                exact
                path='/PublishedProject/:id'
                component={PublishedProject}
              /> */}
              <Route
                path="/:page/video/:id"
                component={BeyondYourCourseVideo}
              />
              <Route path="/sample-note" component={SampleNote} />
              <Route exact path="/my-notes/:id?" component={MyNotes} />
              <Route
                exact
                path="/my-journal/:month/:id"
                component={MyJournals}
              />
              <Route exact path="/my-account" component={Profile} />
              <Route path="/verify" component={VerifyEmail} />
              <Route path="/logout" component={Logout} />
              <Route exact path="/my-connections" component={MyConnections} />
              <Route
                exact
                path="/edit-journals"
                component={JournalsManagement}
              />
              <Route
                exact
                path="/edit-journals2"
                component={JournalsManagement2}
              />
              <Route
                exact
                path="/edit-journals2/:journalId"
                component={JournalsManagement2}
              />
              <Route
                exact
                path="/my-connections/request/:id"
                component={MyConnections}
              />
              <Route path="/iamr-inbox" component={IAMRinbox} />
              <Route
                path="/student-iamr/:studentId/:id?/:type?"
                component={StudentIAMR}
              />
              <Redirect from="/register" exact to="/dashboard" />
              <Redirect from="/ims-login" exact to="/dashboard" />
              <Route path="/iamr" component={Iamr} />
              <Route component={NotFound} />
            </Switch>
          </Layout>
        ) : (
          <PublicLayout>
            <Switch>
              <Route path="/verify-email" component={VerifyEmailByCode} />
              <Route exact path="/lts-secure" component={SecurePage} />
              <Route exact path="/forgot-password" component={ForgotPassword} />
              <Route exact path="/reset-password" component={ResetPassword} />
              <Route exact path="/create-account" component={CreateAccount} />
              <Route exact path="/terms" component={Terms} />
              <Route path="/register" component={Register} />
              <Route exact path="/trial-ended" component={Resubscribe} />
              <Route exact path="/subscription-ended" component={Resubscribe} />
              <Route path="/logout" component={Logout} />
              <Route exact path="/" component={ChooseLogin} />
              <Route path="/ims-login" component={Login} />
              <Route path="/verify" component={VerifyEmail} />
              <Route
                exact
                path="/user-portfolio/:username"
                component={PreviewPublicPortfolio}
              />
              <Route
                path="/password-change-required"
                component={PasswordChangeRequired}
              />
              <Route component={NotFound} />
            </Switch>
          </PublicLayout>
        )}
      </React.Fragment>
    </IntlProvider>
  )
}

const mapStateToProps = ({ lang }) => {
  const { locale } = lang
  return { locale }
}

export default connect(mapStateToProps, {})(Router)
