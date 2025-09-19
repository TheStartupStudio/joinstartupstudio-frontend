import React from 'react'
import userProfile from '../pages/MyAccount/userProfile'
import CSVUpload from '../components/CSVUpload'
import LtsJournal from '../pages/LtsJournal'
import TestJournal from '../pages/LtsJournal/MyCurriculum/CurriculumJournal'
import StudentJournals from '../pages/studentJournals'
import VerifyEmailByCode from '../pages/Register/verifyEmailByCode'
import AddOccupationItemForm from '../components/Pathways/CreateOccupation'
import MyCourseEntrepreneurship from '../pages/MyCourseEntrepreneurship'
import Payment from '../pages/Register/Payment'
import ConfirmEmail from '../pages/Register/ConfirmEmail'
import CheckEmail from '../pages/Register/CheckEmail'
import CheckSubscription from '../pages/Register/CheckSubscription'
import CancelSubscription from '../pages/Register/CancelSubscription'
import AuthSuccess from '../pages/Auth/Social-Login/AuthSuccess'
import PrivacyPolicy from '../pages/PrivacyPolicy'

const Iamr = React.lazy(() => import('../pages/Iamr'))
const TermsOfService = React.lazy(() => import('../pages/Terms/TermsOfService'))
const MyEvaluation = React.lazy(() => import('../pages/MyEvaluation'))
const MyInbox = React.lazy(() => import('../pages/MyInbox'))
const MyNotes = React.lazy(() => import('../pages/MyNotes'))
// const MySpark = React.lazy(() => import('../pages/MySpark'))
const SavedMedia = React.lazy(() => import('../pages/Saved'))
const Login = React.lazy(() => import('../pages/Auth/Login'))
const Register = React.lazy(() => import('../pages/Register'))
const SecurePage = React.lazy(() => import('../pages/Secure'))
const Pathways = React.lazy(() => import('../pages/Pathways'))
const Logout = React.lazy(() => import('../pages/Auth/LogOut'))
const VerifyEmail = React.lazy(() => import('../pages/Verify'))
const Briefings = React.lazy(() => import('../pages/Briefings'))
const Dashboard = React.lazy(() => import('../pages/Dashboard'))
const Portfolio = React.lazy(() => import('../pages/Portfolio'))
const Resources = React.lazy(() => import('../pages/Resources'))
const Spotlight = React.lazy(() => import('../pages/Spotlight'))
const MyStudents = React.lazy(() => import('../pages/MyStudents'))
const MyJournals = React.lazy(() => import('../pages/MyJournals'))
const MyAccount = React.lazy(() => import('../pages/MyAccount'))
const MyImmersion = React.lazy(() => import('../pages/MyImmersion'))
const MyCourseCredentials = React.lazy(() =>
  import('../pages/MyCourseCredentialsStudent')
)
const Steps = React.lazy(() => import('../pages/MyImmersion/Steps'))
const Resubscribe = React.lazy(() => import('../pages/Resubscribe'))
const MyClassroom = React.lazy(() => import('../pages/MyClassroom'))
const StudentIAMR = React.lazy(() => import('../pages/StudentIAMR'))
const StoryInMotion = React.lazy(() => import('../pages/StoryInMotion'))
const SampleNote = React.lazy(() => import('../pages/MyNotes/sampleNote'))
const Preview = React.lazy(() => import('../pages/StartupProfile/preview'))
const MyTraining = React.lazy(() => import('../pages/MyTraining/MyTraining'))
const LiveStream = React.lazy(() => import('../pages/StartupLive/livestream'))
const BeyondYourCourse = React.lazy(() => import('../pages/BeyondYourCourse'))
const MyPerformanceData = React.lazy(() => import('../pages/MyPerformanceData'))
const AllVideos = React.lazy(() =>
  import('../pages/BeyondYourCourse/allVideos')
)
const ProfilePreview = React.lazy(() =>
  import('../pages/MyAccount/profilePreview')
)
const MyMarketReadyGuide = React.lazy(() =>
  import('../pages/MyMarketReadyGuide')
)
const JournalsManagement = React.lazy(() =>
  import('../pages/JournalsManagement')
)
const ResetPassword = React.lazy(() =>
  import('../pages/Auth/Login/resetPassword')
)
const CreateAccount = React.lazy(() =>
  import('../pages/Auth/Login/createAccount')
)
const ForgotPassword = React.lazy(() =>
  import('../pages/Auth/Login/forgotPassword')
)
const MyCurriculum = React.lazy(() =>
  import('../pages/MyLearnToStartEDU/MyCurriculum/MyCurriculum')
)
const MyCertificationGuide = React.lazy(() =>
  import('../pages/MyLearnToStartEDU/MyCertificationGuide/MyCertificationGuide')
)
const IamrCertificationGuide = React.lazy(() =>
  import(
    '../pages/MyLearnToStartEDU/MyCertificationGuide/IamrCertificationGuide'
  )
)
const BeyondYourCourseVideo = React.lazy(() =>
  import('../pages/BeyondYourCourse/beyondYourCourseVideo')
)
const UserPortfolioProj = React.lazy(() =>
  import('../pages/StartupProfile/userProjects')
)
// const MySparkWidgetDetails = React.lazy(() =>
//   import('../pages/MySpark/Widgets/WidgetDetails')
// )
// const MySparkGeneratePage = React.lazy(() =>
//   import('../pages/MySpark/GeneratedResponsePage/GeneratedResponsePage')
// )
// const MySparkArchivePage = React.lazy(() =>
//   import('../pages/MySpark/ArchivePage/ArchivePage')
// )
const EditPortfolioNew = React.lazy(() =>
  import('../pages/PortfolioNew/editPortfolio')
)
const PasswordChangeRequired = React.lazy(() =>
  import('../pages/Auth/Login/passwordChangeRequired')
)
const JournalsManagement2 = React.lazy(() =>
  import('../pages/JournalsManagement/ManageAllJournals')
)
const InstructorData = React.lazy(() =>
  import('../components/admin/UserManagement/instructorData')
)
const IamrCertificationSystem = React.lazy(() =>
  import(
    '../pages/MyLearnToStartEDU/MyCertificationGuide/IamrCertificationSystem/IamrCertificationSystem'
  )
)
const Portfolio2024 = React.lazy(() => import('../pages/Portfolio2024/index'))
const TestPage = React.lazy(() => import('../pages/TestPage'))
const PeerPortfolio2024 = React.lazy(() =>
  import('../pages/Portfolio2024/peerPortfolio')
)

// const PublicPortfolio2024 = React.lazy(() =>
//   import('../pages/NewPortfolio/index')
// )


const PublicPortfolio2024 = React.lazy(() =>
  import('../pages/Academy-Portfolio/index')
)

const StudentPortfolio2024 = React.lazy(() =>
  import('../pages/Portfolio2024/studentPortfolio')
)
const MySchoolContainer = React.lazy(() => import('../pages/admin/MySchool'))
const MyGuestSpeakersContainer = React.lazy(() =>
  import('../pages/admin/MyGuestSpeakers')
)
// const CoursesVcredentialsContainer = React.lazy(() =>
//   import('../pages/admin/CoursesVCredentials')
// )
const MyImmersionContainer = React.lazy(() =>
  import('../pages/admin/MyImmersion')
)

// const MyCourseCredentialsContainerStudent = React.lazy(() =>
//   import('../pages/admin/MyCourseAndCredentials')
// )

const MyCourseAndCredentialsContainer = React.lazy(() =>
  import('../pages/admin/MyCourseAndCredentials')
)

const WelcomeToCourse = React.lazy(() =>
  import('../pages/WelcomeToCourse/index')
)
const ExplorePlatform = React.lazy(() =>
  import('../pages/WelcomeToCourse/ExplorePlatform')
)
const ExploreCourse = React.lazy(() =>
  import('../pages/WelcomeToCourse/ExploreCourse')
)
const ContactUs = React.lazy(() => import('../pages/ContactUs/index'))
const LeadershipJournal = React.lazy(() =>
  import('../pages/LeadershipJournal/index')
)

const AcademyPortfolio = React.lazy(() =>
  import('../pages/Academy-Portfolio/index')
)

const LeaderBoardPage = React.lazy(() =>
  import('../pages/LeaderBoardPage/index')
)

const StartupForumPage = React.lazy(() =>
  import('../pages/StartupForumPage/index')
)

const StartupForumComments = React.lazy(() =>
  import('../pages/StartupForumPage/CommentSection')
)

const AdminDashboardPage = React.lazy(() =>
  import('../pages/AdminDashboard')
)

export const adminRoutes = [
  { path: '/instructor-data/:id?', component: InstructorData, breadcrumb: '' },
  {
    path: '/admin-dashboard',
    component: AdminDashboardPage,
    breadcrumb: 'Admin Dashboard'
  },
  {
    path: '/my-school/:page?',
    component: MySchoolContainer,
    breadcrumb: 'My School'
  },
  {
    path: '/my-immersion-admin',
    component: MyImmersionContainer,
    breadcrumb: 'My Immersion'
  },
  {
    path: '/my-courses-management',
    component: MyCourseAndCredentialsContainer,
    breadcrumb: 'My Course & Credentials'
  }
]

export const mutualRoutes = [
  { path: '/dashboard', component: Dashboard, exact: true },
  { path: '/subscribe', component: CheckSubscription, exact: true },
  { path: '/payment', component: Payment, exact: true },
  { path: '/cancel-payment', component: CancelSubscription, exact: true },
  { path: '/pathways', component: Pathways, exact: true },
  { path: '/my-classroom', component: MyClassroom, exact: true },
  { path: '/my-classroom/request/:id', component: MyClassroom },
  { path: '/savedMedia', component: SavedMedia },
  { path: '/csv-upload', component: CSVUpload },
  { path: '/portfolio', component: Portfolio },
  { path: '/my-portfolio', component: AcademyPortfolio, exact: true },
  { path: '/beyond-your-course', component: BeyondYourCourse, exact: true },
  { path: '/beyond-your-course/:id', component: BeyondYourCourse, exact: true },
  { path: '/story-in-motion', component: StoryInMotion },
  { path: '/UserProject/:uid', component: UserPortfolioProj },
  { path: '/:page/videos', component: AllVideos },
  { path: '/spotlight', component: Spotlight, exact: true },
  { path: '/startup-livestream', component: LiveStream, exact: true },
  { path: '/account', component: MyAccount, exact: true },
  { path: '/profile-preview', component: ProfilePreview, exact: true },
  { path: '/my-journal/:month/:id', component: MyJournals, exact: true },
  { path: '/verify', component: VerifyEmail },
  { path: '/my-account', component: MyAccount, exact: true },
  { path: '/logout', component: Logout },
  { path: '/leadership-journal', component: LeadershipJournal, exact: true },
  // { path: '/leader-board', component: LeaderBoardPage, exact: true },
  // { path: '/startup-forum', component: StartupForumPage, exact: true },
  // { path: '/startup-forum/following', component: StartupForumPage, exact: true },
  // { path: '/startup-forum/introductions', component: StartupForumPage, exact: true },
  // { path: '/startup-forum/announcements', component: StartupForumPage, exact: true },
  // { path: '/startup-forum/celebrations', component: StartupForumPage, exact: true },
  // { path: '/startup-forum/ideas-feedback', component: StartupForumPage, exact: true },
  // { path: '/startup-forum/misc-topics', component: StartupForumPage, exact: true },
  // { path: '/startup-forum/:id', component: StartupForumComments, exact: true },
  {
    path: '/iamr',
    component: IamrCertificationSystem,
    exact: true
  },
  {
    path: '/public-portfolio/:username',
    component: PublicPortfolio2024,
    exact: true
  },
  {
    path: '/iamr/:certificationType?/:id?/:type?',
    component: IamrCertificationSystem
  },
  { path: '/terms', component: TermsOfService },
  // { path: '/my-spark/archive', component: MySparkArchivePage, exact: true },
  // { path: '/my-spark/widgets', component: MySpark, exact: true },
  // { path: '/my-spark/widgets/:widgetName', component: MySparkWidgetDetails },
  { path: '/sample-note', component: SampleNote },
  { path: '/:page/video/:id', component: BeyondYourCourseVideo },
  {
    path: '/peer-portfolio/:username',
    component: PeerPortfolio2024,
    exact: true
  },
  {
    path: '/pathways/:occupationId?/:occupationJobId?',
    component: Pathways,
    props: { category: 'my-training' }
  },
  {
    path: '/my-course-in-entrepreneurship/journal',
    component: LtsJournal,
    props: { category: 'entrepreneurship' }
  },
  { path: '/archived-portfolio', component: EditPortfolioNew, exact: true },
  { path: '/hs4-journal/', component: LtsJournal, props: { category: 'hs4' } },
  { path: '/hs3-journal/', component: LtsJournal, props: { category: 'hs3' } },
  { path: '/hs2-journal/', component: LtsJournal, props: { category: 'hs2' } },
  { path: '/hs1-journal/', component: LtsJournal, props: { category: 'hs1' } },
  // {
  //   path: '/my-spark/generate-page/:id',
  //   component: MySparkGeneratePage,
  //   exact: true
  // },
  // {
  //   path: '/my-spark/generate-page/response',
  //   component: MySparkGeneratePage,
  //   exact: true
  // },
  {
    path: '/my-mentorship/',
    component: LtsJournal,
    props: { category: 'my-mentorship' }
  },
  {
    path: '/market-ready/',
    component: LtsJournal,
    props: { category: 'market-ready' }
  },
  {
    path: '/student-leadership/',
    component: LtsJournal,
    props: { category: 'student-leadership' }
  },
  {
    path: '/lts-journal/',
    component: LtsJournal,
    props: { category: 'student-lts' }
  },
  {
    path: '/student-personal-finance/',
    component: LtsJournal,
    props: { category: 'student-personal-finance' }
  },
  {
    path: '/wellness-journal/',
    component: LtsJournal,
    props: { category: 'student-wellnes' }
  },
  {
    path: '/my-course-credentials',
    component: MyCourseCredentials,
    exact: true
  },
  {
    path: '/my-course-in-entrepreneurship',
    component: MyCourseEntrepreneurship,
    exact: true
  }
]

export const instructorRoutes = [
  // authRoutes
  { path: '/test-page', component: TestPage },
  { path: '/my-immersion', component: MyImmersion, exact: true },
  { path: '/my-immersion/:step', component: Steps },
  { path: '/old-portfolio', component: EditPortfolioNew, exact: true },
  { path: '/resources', component: Resources },
  { path: '/my-students', component: MyStudents },
  { path: '/iamr-certification-guide', component: IamrCertificationGuide },
  { path: '/my-certification-guide', component: MyCertificationGuide },
  { path: '/my-curriculum', component: MyCurriculum },
  { path: '/PreviewMyStartupProfile/:id', component: Preview },
  { path: '/account/:id', component: userProfile, exact: true },
  { path: '/briefings', component: Briefings },
  { path: '/student-iamr/:studentId/:id?/:type?', component: StudentIAMR },
  { path: '/my-evaluation', component: MyEvaluation },
  { path: '/my-inbox', component: MyInbox },
  { path: '/edit-journals2', component: JournalsManagement2, exact: true },
  { path: '/edit-journals', component: JournalsManagement, exact: true },
  { path: '/my-notes/:id?', component: MyNotes },
  { path: '/my-performance-data/:id?', component: MyPerformanceData },
  {
    path: '/edit-journals2/:type/:journalId',
    component: JournalsManagement2,
    exact: true
  },
  // {
  //   path: '/iamr-certification-system/:certificationType?/:id?/:type?',
  //   component: IamrCertificationSystem
  // },
  // {
  //   path: '/iamr-certification-system',
  //   component: IamrCertificationSystem,
  //   exact: true
  // },

  // authRoutesWithProps
  {
    path: '/student-portfolio/:username',
    component: StudentPortfolio2024,
    exact: true
  },
  {
    path: '/my-training',
    component: MyTraining,
    props: { category: 'my-training' }
  },
  {
    path: '/students-journals/:studentId',
    component: StudentJournals,
    props: { category: 'my-training' }
  },

  {
    path: '/new-hs1-journal/',
    component: TestJournal,
    props: { category: 'hs1' }
  },
  {
    path: '/new-hs2-journal/',
    component: TestJournal,
    props: { category: 'hs2' }
  },
  {
    path: '/new-hs3-journal/',
    component: TestJournal,
    props: { category: 'hs3' }
  },
  {
    path: '/new-hs4-journal/',
    component: TestJournal,
    props: { category: 'hs4' }
  },
  {
    path: '/new-hs1-journal/:type/',
    component: TestJournal,
    props: { category: 'new-hs1' }
  },
  {
    path: '/new-hs2-journal/:type/',
    component: TestJournal,
    props: { category: 'new-hs2' }
  },
  {
    path: '/new-hs3journal/:type/',
    component: TestJournal,
    props: { category: 'new-hs3' }
  },
  {
    path: '/new-hs4-journal/:type/',
    component: TestJournal,
    props: { category: 'new-hs4' }
  },
  {
    path: '/financial-literacy/',
    component: TestJournal,
    props: { category: 'financial-literacy' }
  }
]

export const studentRoutes = [
  // AuthRoutes
  {
    path: '/create-occupation/:occupationGroupId',
    component: AddOccupationItemForm
  },

  { path: '/my-immersion', component: MyImmersion, exact: true },
  { path: '/my-immersion/:step', component: Steps },
  { path: '/iamr/:certificationType?/:id?/:type?', component: Iamr },
  { path: '/my-notes/:id?', component: MyNotes, exact: true },
  {
    path: '/My-Market-Ready-Guide',
    component: IamrCertificationGuide,
    exact: true
  },
  {
    path: '/edit-portfolio/recommendation/:id',
    component: EditPortfolioNew,
    exact: true
  }
]

export const publicRoutes = [
  { path: '/explore-the-platform', component: ExplorePlatform, exact: true },
  { path: '/explore-the-course', component: ExploreCourse, exact: true },
  { path: '/contact', component: ContactUs, exact: true },
  { path: '/verify-email', component: VerifyEmailByCode, exact: false },
  { path: '/lts-secure', component: SecurePage, exact: true },
  { path: '/forgot-password', component: ForgotPassword, exact: true },
  { path: '/reset-password', component: ResetPassword, exact: true },
  { path: '/create-account', component: CreateAccount, exact: true },
  { path: '/terms', component: TermsOfService, exact: true },
  { path: '/my-immersion', component: MyImmersion, exact: false },
  { path: '/verify', component: VerifyEmail, exact: false },
  { path: '/', component: Login, exact: true },
  { path: '/auth-success', component: AuthSuccess, exact: true },
  { path: '/logout', component: Logout, exact: false },
  { path: '/register', component: Register, exact: true },
  { path: '/check-email', component: CheckEmail, exact: true },
  { path: '/trial-ended', component: Resubscribe, exact: true },
  { path: '/subscription-ended', component: Resubscribe, exact: true },
  { path: '/confirm-email', component: ConfirmEmail, exact: true },
  { path: '/privacy-policy', component: PrivacyPolicy, exact: true },
  {
    path: '/password-change-required',
    component: PasswordChangeRequired,
    exact: false
  },
  {
    path: '/public-portfolio/:username',
    component: PublicPortfolio2024,
    exact: true
  }
  // {
  //   path: '/student-portfolio/:username',
  //   component: PreviewPortfolioNew,
  //   props: { isPublicView: true },
  //   exact: true
  // }
]

export const redirects = [
  { from: '/register', to: '/dashboard' },
  { from: '/ims-login', to: '/dashboard' },
  { from: '/', to: '/dashboard', exact: true },
  // Only redirect to subscribe if user exists but doesn't have subscription
  {
    from: '*',
    to: '/subscribe',
    condition: (user) =>
      window.location.pathname !== '/auth-success' &&
      user?.user?.is_active === true &&
      !user?.user?.stripe_subscription_id
  },
  // Default catch-all redirect to home
  {
    from: '*',
    to: '/',
    exact: false
  }
]
