import { CHANGE_LOCALE } from './Types'

export const defaultLocale = 'en'
export const localeOptions = [
  { id: 'en', name: 'English' },
  { id: 'es', name: 'Español' }
]

const INIT_STATE = {
  locale:
    localStorage.getItem('currentLanguage') &&
    localeOptions.filter(
      (x) => x.id === localStorage.getItem('currentLanguage')
    ).length > 0
      ? localStorage.getItem('currentLanguage')
      : defaultLocale
}

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case CHANGE_LOCALE:
      return { ...state, locale: action.payload }

    default:
      return { ...state }
  }
}
