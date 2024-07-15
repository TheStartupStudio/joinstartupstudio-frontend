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
import StudentJournals from './pages/studentJournals'
import TestJournal from './pages/LtsJournal/TestJournal'
import UserProfile from './pages/Profile/userProfile'

const MyTraining = React.lazy(() => import('./pages/MyTraining/MyTraining'))
const Login = React.lazy(() => import('./pages/Auth/Login'))
// const ChooseLogin = React.lazy(() => import('./pages/Auth/Login/ChooseLogin'))
const ChooseLogin = React.lazy(() =>
  import('./pages/Auth/Login/ChooseLogin/HSChooseLogin')
)
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
const MyImmersion = React.lazy(() => import('./pages/MyImmersion'))
const Steps = React.lazy(() => import('./pages/MyImmersion/Steps'))
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
const IamrCertificationGuide = React.lazy(() =>
  import(
    './pages/MyLearnToStartEDU/MyCertificationGuide/IamrCertificationGuide'
  )
)

const IamrCertificationSystem = React.lazy(() =>
  import(
    './pages/MyLearnToStartEDU/MyCertificationGuide/IamrCertificationSystem/IamrCertificationSystem'
  )
)
const Pathways = React.lazy(() => import('./pages/Pathways'))

const EditPortfolio = React.lazy(() =>
  import('./pages/Portfolio/editPortfolio')
)
const MyStudents = React.lazy(() => import('./pages/MyStudents'))
const Resources = React.lazy(() => import('./pages/Resources'))
const Preview = React.lazy(() => import('./pages/StartupProfile/preview'))

const SavedMedia = React.lazy(() => import('./pages/Saved'))
const Resubscribe = React.lazy(() => import('./pages/Resubscribe'))
// const StartupLive = React.lazy(() => import('./pages/StartupLive'))
const Spotlight = React.lazy(() => import('./pages/Spotlight'))
const LiveStream = React.lazy(() => import('./pages/StartupLive/livestream'))
const AllVideos = React.lazy(() => import('./pages/BeyondYourCourse/allVideos'))
const BeyondYourCourse = React.lazy(() => import('./pages/BeyondYourCourse'))
const BeyondYourCourseVideo = React.lazy(() =>
  import('../src/pages/BeyondYourCourse/beyondYourCourseVideo')
)
const MyPerformanceData = React.lazy(() =>
  import('../src/pages/MyPerformanceData')
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
const MyClassroom = React.lazy(() => import('./pages/MyClassroom'))
const MySpark = React.lazy(() => import('./pages/MySpark'))
const MySparkWidgetDetails = React.lazy(() =>
  import('./pages/MySpark/Widgets/WidgetDetails')
)
const MySparkGeneratePage = React.lazy(() =>
  import('./pages/MySpark/GeneratedResponsePage/GeneratedResponsePage')
)
const MySparkArchivePage = React.lazy(() =>
  import('./pages/MySpark/ArchivePage/ArchivePage')
)
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

const MyInbox = React.lazy(() => import('./pages/MyInbox'))
const MyEvaluation = React.lazy(() => import('./pages/MyEvaluation'))
const StudentIAMR = React.lazy(() => import('../src/pages/StudentIAMR'))
const Briefings = React.lazy(() => import('../src/pages/Briefings'))
const UserManagement = React.lazy(() =>
  import('../src/pages/admin/UserManagement')
)
const InstructorData = React.lazy(() =>
  import('../src/components/admin/UserManagement/instructorData')
)

function Router(props) {
  const currentAppLocale = AppLocale[props.locale]
  const { isAuthenticated, user } = useSelector((state) => state.user)

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
              <Route path='/dashboard' component={Dashboard} />
              <Route path='/savedMedia' component={SavedMedia} />
              <Route path='/csv-upload' component={CSVUpload} />
              <Route path='/portfolio' component={Portfolio} />
              <Route path='/my-curriculum' component={MyCurriculum} />
              <Route
                path='/my-certification-guide'
                component={MyCertificationGuide}
              />
              <Route
                path='/iamr-certification-guide'
                component={IamrCertificationGuide}
              />
              <Route
                exact
                path='/iamr-certification-system'
                component={IamrCertificationSystem}
              />
              <Route
                path='/iamr-certification-system/:certificationType?/:id?/:type?'
                component={IamrCertificationSystem}
              />
              <Route path='/my-students' component={MyStudents} />
              <Route path='/resources' component={Resources} />
              <Route
                exact
                path='/edit-portfolio'
                component={EditPortfolioNew}
              />
              <Route
                exact
                path='/edit-portfolio/recommendation/:id'
                component={EditPortfolioNew}
              />
              <Route
                path='/preview-portfolio'
                component={PreviewPortfolioNew}
              />
              <Route
                exact
                path='/user-portfolio/:username'
                component={(props) => {
                  return <PreviewPortfolioNew {...props} isPublicView={false} />
                }}
              />
              <Route exact path='/terms' component={Terms} />
              <Route
                exact
                path='/beyond-your-course'
                component={BeyondYourCourse}
              />
              <Route
                exact
                path='/beyond-your-course/:id'
                component={BeyondYourCourse}
              />
              <Route exact path='/my-immersion' component={MyImmersion} />
              <Route path='/my-immersion/:step' component={Steps} />
              <Route
                exact
                path='/pathways'
                component={(props) => <Pathways {...props} />}
              />
              <Route
                path='/pathways/:occupationId?/:occupationJobId?'
                component={(props) => <Pathways {...props} />}
              />
              <Route path='/story-in-motion' component={StoryInMotion} />
              {/* <Route path='/PrivateProject' component={PrivateProject} /> */}
              <Route path='/UserProject/:uid' component={UserPortfolioProj} />
              {/* <Route path='/MyStartupProfile' component={MyProjects} /> */}
              <Route path='/PreviewMyStartupProfile/:id' component={Preview} />
              <Route path='/:page/videos' component={AllVideos} />
              {/* <Route exact path="/startup-live" component={StartupLive} /> */}
              <Route exact path='/spotlight' component={Spotlight} />
              <Route exact path='/startup-livestream' component={LiveStream} />
              <Route exact path='/account' component={Profile} />
              <Route exact path='/account/:id' component={UserProfile} />
              <Route exact path='/profile-preview' component={ProfilePreview} />
              <Route
                path='/my-training'
                component={(props) => (
                  <MyTraining {...props} category='my-training' />
                )}
              />
              <Route
                path='/students-journals/:studentId'
                component={(props) => (
                  <StudentJournals {...props} category='my-training' />
                )}
              />
              {/* Students journals */}
              <Route
                path='/new-hs1-journal/'
                component={(props) => <TestJournal {...props} category='hs1' />}
              />{' '}
              <Route
                path='/new-hs2-journal/'
                component={(props) => <TestJournal {...props} category='hs2' />}
              />{' '}
              <Route
                path='/hs3-hs4-journal/'
                component={(props) => (
                  <TestJournal {...props} category='hs3&hs4' />
                )}
              />
              <Route
                path='/financial-literacy/'
                component={(props) => (
                  <TestJournal {...props} category='financial-literacy' />
                )}
              />{' '}
              <Route
                path='/new-hs1-journal/:type/'
                component={(props) => (
                  <TestJournal {...props} category='new-hs1' />
                )}
              />
              <Route
                path='/new-hs2-journal/:type/'
                component={(props) => (
                  <TestJournal {...props} category='new-hs2' />
                )}
              />
              <Route
                path='/hs1-journal/'
                component={(props) => <LtsJournal {...props} category='hs1' />}
              />
              <Route
                path='/hs2-journal/'
                component={(props) => <LtsJournal {...props} category='hs2' />}
              />
              <Route
                path='/hs3-journal/'
                component={(props) => <LtsJournal {...props} category='hs3' />}
              />
              <Route
                path='/hs4-journal/'
                component={(props) => <LtsJournal {...props} category='hs4' />}
              />
              <Route
                path='/student-lts/'
                component={(props) => (
                  <LtsJournal {...props} category='student-lts' />
                )}
              />
              <Route
                path='/student-wellnes/'
                component={(props) => (
                  <LtsJournal {...props} category='student-wellnes' />
                )}
              />
              <Route
                path='/student-personal-finance/'
                component={(props) => (
                  <LtsJournal {...props} category='student-personal-finance' />
                )}
              />
              <Route
                path='/my-performance-data/:id?'
                component={MyPerformanceData}
              />
              <Route path='/instructor-data/:id?' component={InstructorData} />
              <Route
                path='/student-leadership/'
                component={(props) => (
                  <LtsJournal {...props} category='student-leadership' />
                )}
              />
              <Route
                path='/my-mentorship/'
                component={(props) => (
                  <LtsJournal {...props} category='my-mentorship' />
                )}
              />
              <Route
                path='/market-ready/'
                component={(props) => (
                  <LtsJournal {...props} category='market-ready' />
                )}
              />
              <Route
                exact
                path='/My-Market-Ready-Guide'
                component={MyMarketReadyGuide}
              />
              <Route
                path='/:page/video/:id'
                component={BeyondYourCourseVideo}
              />
              <Route path='/sample-note' component={SampleNote} />
              <Route exact path='/my-notes/:id?' component={MyNotes} />
              <Route
                exact
                path='/my-journal/:month/:id'
                component={MyJournals}
              />
              <Route exact path='/my-account' component={Profile} />
              <Route path='/verify' component={VerifyEmail} />
              <Route path='/logout' component={Logout} />
              <Route exact path='/my-classroom' component={MyClassroom} />
              <Route
                exact
                path='/edit-journals'
                component={JournalsManagement}
              />
              <Route
                exact
                path='/edit-journals2'
                component={JournalsManagement2}
              />
              <Route
                exact
                path='/edit-journals2/:type/:journalId'
                component={JournalsManagement2}
              />
              <Route
                exact
                path='/my-classroom/request/:id'
                component={MyClassroom}
              />
              <Route
                path='/my-spark/generate-page/response'
                exact
                component={MySparkGeneratePage}
              />
              <Route
                path='/my-spark/generate-page/:id'
                exact
                component={MySparkGeneratePage}
              />
              <Route exact path='/my-spark/widgets' component={MySpark} />
              <Route
                path='/my-spark/archive'
                exact
                component={MySparkArchivePage}
              />
              <Route
                path='/my-spark/widgets/:widgetName'
                exact
                component={MySparkWidgetDetails}
              />
              <Route path='/my-evaluation' component={MyEvaluation} />
              <Route path='/my-inbox' component={MyInbox} />
              <Route
                path='/student-iamr/:studentId/:id?/:type?'
                component={StudentIAMR}
              />
              <Route path='/briefings' component={Briefings} />
              {user.isAdmin && (
                <Route path='/user-management' component={UserManagement} />
              )}
              <Redirect from='/register' exact to='/dashboard' />
              <Redirect from='/ims-login' exact to='/dashboard' />
              <Redirect from='/' exact to='/dashboard' />
              <Route path='/iamr' component={Iamr} />
              <Route component={NotFound} />
            </Switch>
          </Layout>
        ) : (
          <PublicLayout>
            <Switch>
              <Route path='/verify-email' component={VerifyEmailByCode} />
              <Route exact path='/lts-secure' component={SecurePage} />
              <Route exact path='/forgot-password' component={ForgotPassword} />
              <Route exact path='/reset-password' component={ResetPassword} />
              <Route exact path='/create-account' component={CreateAccount} />
              <Route exact path='/terms' component={Terms} />
              <Route path='/register' component={Register} />
              <Route exact path='/trial-ended' component={Resubscribe} />
              <Route exact path='/subscription-ended' component={Resubscribe} />
              <Route path='/logout' component={Logout} />
              <Route exact path='/' component={ChooseLogin} />
              <Route path='/ims-login' component={Login} />
              <Route path='/verify' component={VerifyEmail} />
              <Route
                exact
                path='/user-portfolio/:username'
                component={(props) => {
                  return <PreviewPortfolioNew {...props} isPublicView={true} />
                }}
              />
              <Route
                path='/password-change-required'
                component={PasswordChangeRequired}
              />
              <Route path='/my-immersion' component={MyImmersion} />
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
