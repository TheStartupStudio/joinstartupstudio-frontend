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
import platformBadgesReducer from './platformBadges/reducer'

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
  platformBadges:platformBadgesReducer
})
export default rootReducer
