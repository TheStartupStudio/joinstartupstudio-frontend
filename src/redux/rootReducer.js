import { combineReducers } from 'redux'

import userReducer from './user/Reducer'
import langReducer from './lang/Reducer'
import generalReducer from './general/Reducer'
import courseReducer from './course/Reducer'
import journalReducer from './journal/Reducer'
import podcastReducer from './podcast/Reducer'
import dashboardReducer from './dashboard/Reducer'
import headerReducer from './header/Reducer'
import usersReducer from './users/Reducer'
import reflectionsTableReducer from './reflectionsTable/Reducer' 
import rwlJournalReducer from './rwl/reducer'
import performanceDataReducer from './myPerformanceData/reducer'
import myImmersionReducer from './myImmersion/reducer'
import PathwaysReducer from './pathways/reducer'

const rootReducer = combineReducers({
  user: userReducer,
  lang: langReducer,
  general: generalReducer,
  course: courseReducer,
  journal: journalReducer,
  podcast: podcastReducer,
  dashboard: dashboardReducer,
  header: headerReducer,
  users: usersReducer,
  reflectionsTable: reflectionsTableReducer,
  rwlJournal: rwlJournalReducer,
  myImmersion: myImmersionReducer,
  performanceData: performanceDataReducer,
  pathways: PathwaysReducer
})
export default rootReducer
