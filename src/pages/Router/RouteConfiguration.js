import React from 'react'
import userProfile from '../Profile/userProfile'
import CSVUpload from '../../components/CSVUpload'
import LtsJournal from '../LtsJournal'
import TestJournal from '../LtsJournal/TestJournal'
import StudentJournals from '../studentJournals'
import VerifyEmailByCode from '../Register/verifyEmailByCode'

const Iamr = React.lazy(() => import('../Iamr'))
const Terms = React.lazy(() => import('../Terms'))
const MyInbox = React.lazy(() => import('../MyInbox'))
const MyNotes = React.lazy(() => import('../MyNotes'))
const MySpark = React.lazy(() => import('../MySpark'))
const SavedMedia = React.lazy(() => import('../Saved'))
const Login = React.lazy(() => import('../Auth/Login'))
const Register = React.lazy(() => import('../Register'))
const SecurePage = React.lazy(() => import('../Secure'))
const Pathways = React.lazy(() => import('../Pathways'))
const Logout = React.lazy(() => import('../Auth/LogOut'))
const VerifyEmail = React.lazy(() => import('../Verify'))
const Briefings = React.lazy(() => import('../Briefings'))
const Dashboard = React.lazy(() => import('../Dashboard'))
const Portfolio = React.lazy(() => import('../Portfolio'))
const Resources = React.lazy(() => import('../Resources'))
const Spotlight = React.lazy(() => import('../Spotlight'))
const MyStudents = React.lazy(() => import('../MyStudents'))
const MyJournals = React.lazy(() => import('../MyJournals'))
const Profile = React.lazy(() => import('../Profile/index'))
const MyImmersion = React.lazy(() => import('../MyImmersion'))
const Steps = React.lazy(() => import('../MyImmersion/Steps'))
const Resubscribe = React.lazy(() => import('../Resubscribe'))
const MyClassroom = React.lazy(() => import('../MyClassroom'))
const StudentIAMR = React.lazy(() => import('../StudentIAMR'))
const StoryInMotion = React.lazy(() => import('../StoryInMotion'))
const SampleNote = React.lazy(() => import('../MyNotes/sampleNote'))
const Preview = React.lazy(() => import('../StartupProfile/preview'))
const MyTraining = React.lazy(() => import('../MyTraining/MyTraining'))
const LiveStream = React.lazy(() => import('../StartupLive/livestream'))
const BeyondYourCourse = React.lazy(() => import('../BeyondYourCourse'))
const MyPerformanceData = React.lazy(() => import('../MyPerformanceData'))
const UserManagement = React.lazy(() => import('../admin/UserManagement'))
const AllVideos = React.lazy(() => import('../BeyondYourCourse/allVideos'))
const ProfilePreview = React.lazy(() => import('../Profile/profilePreview'))
const MyMarketReadyGuide = React.lazy(() => import('../MyMarketReadyGuide'))
const JournalsManagement = React.lazy(() => import('../JournalsManagement'))
const ResetPassword = React.lazy(() => import('../Auth/Login/resetPassword'))
const CreateAccount = React.lazy(() => import('../Auth/Login/createAccount'))
const ForgotPassword = React.lazy(() => import('../Auth/Login/forgotPassword'))

const ChooseLogin = React.lazy(() =>
  import('../Auth/Login/ChooseLogin/HSChooseLogin')
)
const MyCurriculum = React.lazy(() =>
  import('../MyLearnToStartEDU/MyCurriculum/MyCurriculum')
)
const MyCertificationGuide = React.lazy(() =>
  import('../MyLearnToStartEDU/MyCertificationGuide/MyCertificationGuide')
)
const IamrCertificationGuide = React.lazy(() =>
  import('../MyLearnToStartEDU/MyCertificationGuide/IamrCertificationGuide')
)
const BeyondYourCourseVideo = React.lazy(() =>
  import('../BeyondYourCourse/beyondYourCourseVideo')
)
const UserPortfolioProj = React.lazy(() =>
  import('../StartupProfile/userProjects')
)
const MySparkWidgetDetails = React.lazy(() =>
  import('../MySpark/Widgets/WidgetDetails')
)
const MySparkGeneratePage = React.lazy(() =>
  import('../MySpark/GeneratedResponsePage/GeneratedResponsePage')
)
const MySparkArchivePage = React.lazy(() =>
  import('../MySpark/ArchivePage/ArchivePage')
)
const PreviewPortfolioNew = React.lazy(() =>
  import('../PortfolioNew/previewPortfolio')
)
const EditPortfolioNew = React.lazy(() =>
  import('../PortfolioNew/editPortfolio')
)
const PasswordChangeRequired = React.lazy(() =>
  import('../Auth/Login/passwordChangeRequired')
)
const JournalsManagement2 = React.lazy(() =>
  import('../JournalsManagement/JournalsManagement2')
)
const InstructorData = React.lazy(() =>
  import('../../components/admin/UserManagement/instructorData')
)
const IamrCertificationSystem = React.lazy(() =>
  import(
    '../MyLearnToStartEDU/MyCertificationGuide/IamrCertificationSystem/IamrCertificationSystem'
  )
)

export const adminRoutes = [
  { path: '/instructor-data/:id?', component: InstructorData },
  { path: '/user-management', component: UserManagement }
]

export const authRoutes = [
  { path: '/dashboard', component: Dashboard, exact: true },
  { path: '/beyond-your-course', component: BeyondYourCourse, exact: true },
  { path: '/beyond-your-course/:id', component: BeyondYourCourse, exact: true },
  { path: '/my-immersion', component: MyImmersion, exact: true },
  { path: '/my-immersion/:step', component: Steps },
  { path: '/terms', component: Terms },
  { path: '/preview-portfolio', component: PreviewPortfolioNew },
  { path: '/edit-portfolio', component: EditPortfolioNew, exact: true },
  { path: '/resources', component: Resources },
  { path: '/my-students', component: MyStudents },
  { path: '/iamr-certification-guide', component: IamrCertificationGuide },
  { path: '/my-certification-guide', component: MyCertificationGuide },
  { path: '/my-curriculum', component: MyCurriculum },
  { path: '/portfolio', component: Portfolio },
  { path: '/csv-upload', component: CSVUpload },
  { path: '/savedMedia', component: SavedMedia },
  { path: '/story-in-motion', component: StoryInMotion },
  { path: '/UserProject/:uid', component: UserPortfolioProj },
  { path: '/PreviewMyStartupProfile/:id', component: Preview },
  { path: '/:page/videos', component: AllVideos },
  { path: '/spotlight', component: Spotlight, exact: true },
  { path: '/startup-livestream', component: LiveStream, exact: true },
  { path: '/account', component: Profile, exact: true },
  { path: '/account/:id', component: userProfile, exact: true },
  { path: '/profile-preview', component: ProfilePreview, exact: true },
  { path: '/my-journal/:month/:id', component: MyJournals, exact: true },
  { path: '/my-account', component: Profile, exact: true },
  { path: '/verify', component: VerifyEmail },
  { path: '/logout', component: Logout },
  { path: '/briefings', component: Briefings },
  { path: '/iamr', component: Iamr },
  { path: '/student-iamr/:studentId/:id?/:type?', component: StudentIAMR },
  { path: '/my-inbox', component: MyInbox },
  { path: '/my-spark/archive', component: MySparkArchivePage, exact: true },
  { path: '/my-spark/widgets', component: MySpark, exact: true },
  { path: '/my-spark/widgets/:widgetName', component: MySparkWidgetDetails },
  { path: '/edit-journals2', component: JournalsManagement2, exact: true },
  { path: '/edit-journals', component: JournalsManagement, exact: true },
  { path: '/my-notes/:id', component: MyNotes, exact: true },
  { path: '/sample-note', component: SampleNote },
  { path: '/:page/video/:id', component: BeyondYourCourseVideo },
  { path: '/my-classroom', component: MyClassroom, exact: true },
  { path: '/my-classroom/request/:id', component: MyClassroom },
  { path: '/my-performance-data/:id?', component: MyPerformanceData },
  {
    path: '/my-spark/generate-page/:id',
    component: MySparkGeneratePage,
    exact: true
  },
  {
    path: '/my-spark/generate-page/response',
    component: MySparkGeneratePage,
    exact: true
  },
  {
    path: '/edit-journals2/:type/:journalId',
    component: JournalsManagement2,
    exact: true
  },
  {
    path: '/My-Market-Ready-Guide',
    component: MyMarketReadyGuide,
    exact: true
  },
  {
    path: '/iamr-certification-system/:certificationType?/:id?/:type?',
    component: IamrCertificationSystem
  },
  {
    path: '/edit-portfolio/recommendation/:id',
    component: EditPortfolioNew,
    exact: true
  },
  {
    path: '/iamr-certification-system',
    component: IamrCertificationSystem,
    exact: true
  }
]

export const authRoutesWithProps = [
  { path: '/pathways', component: Pathways, exact: true, props: {} },
  { path: '/hs4-journal/', component: LtsJournal, props: { category: 'hs4' } },
  { path: '/hs3-journal/', component: LtsJournal, props: { category: 'hs3' } },
  { path: '/hs2-journal/', component: LtsJournal, props: { category: 'hs2' } },
  { path: '/hs1-journal/', component: LtsJournal, props: { category: 'hs1' } },
  {
    path: '/user-portfolio/:username',
    component: PreviewPortfolioNew,
    exact: true,
    props: { isPublicView: false }
  },
  {
    path: '/pathways/:occupationId?/:occupationJobId?',
    component: Pathways,
    props: { category: 'my-training' }
  },
  {
    path: '/my-training',
    component: MyTraining,
    props: { category: 'my-training' }
  },
  {
    path: '/market-ready/',
    component: LtsJournal,
    props: { category: 'market-ready' }
  },
  {
    path: '/students-journals/:studentId',
    component: StudentJournals,
    props: { category: 'my-training' }
  },
  {
    path: '/student-leadership/',
    component: LtsJournal,
    props: { category: 'student-leadership' }
  },
  {
    path: '/student-personal-finance/',
    component: LtsJournal,
    props: { category: 'student-personal-finance' }
  },
  {
    path: '/student-wellnes/',
    component: LtsJournal,
    props: { category: 'student-wellnes' }
  },
  {
    path: '/student-lts/',
    component: LtsJournal,
    props: { category: 'student-lts' }
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
    path: '/hs3-hs4-journal/',
    component: TestJournal,
    props: { category: 'hs3&hs4' }
  },
  {
    path: '/financial-literacy/',
    component: TestJournal,
    props: { category: 'financial-literacy' }
  }
]

export const publicRoutes = [
  { path: '/verify-email', component: VerifyEmailByCode, exact: false },
  { path: '/lts-secure', component: SecurePage, exact: true },
  { path: '/forgot-password', component: ForgotPassword, exact: true },
  { path: '/reset-password', component: ResetPassword, exact: true },
  { path: '/create-account', component: CreateAccount, exact: true },
  { path: '/terms', component: Terms, exact: true },
  { path: '/my-immersion', component: MyImmersion, exact: false },
  { path: '/verify', component: VerifyEmail, exact: false },
  { path: '/ims-login', component: Login, exact: false },
  { path: '/', component: ChooseLogin, exact: true },
  { path: '/logout', component: Logout, exact: false },
  { path: '/register', component: Register, exact: true },
  { path: '/trial-ended', component: Resubscribe, exact: true },
  { path: '/subscription-ended', component: Resubscribe, exact: true },
  {
    path: '/password-change-required',
    component: PasswordChangeRequired,
    exact: false
  },
  {
    path: '/user-portfolio/:username',
    component: PreviewPortfolioNew,
    props: { isPublicView: true },
    exact: true
  }
]

export const redirects = [
  { from: '/register', to: '/dashboard' },
  { from: '/ims-login', to: '/dashboard' },
  { from: '/', to: '/dashboard', exact: true }
]
