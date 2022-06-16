import { combineReducers } from 'redux'

import userReducer from './user/Reducer'
import langReducer from './lang/Reducer'
import generalReducer from './general/Reducer'
import courseReducer from './course/Reducer'
import journalReducer from './journal/Reducer'
import podcastReducer from './podcast/Reducer'

const rootReducer = combineReducers({
  user: userReducer,
  lang: langReducer,
  general: generalReducer,
  course: courseReducer,
  journal: journalReducer,
  podcast: podcastReducer
})
export default rootReducer
