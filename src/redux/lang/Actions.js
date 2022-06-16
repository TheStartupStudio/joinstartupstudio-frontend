import { CHANGE_LOCALE } from './Types'
import { Auth } from 'aws-amplify'

export const changeLocale = (locale) => async () => {
  localStorage.setItem('currentLanguage', locale)
  const currentUser = await Auth.currentAuthenticatedUser({ bypassCache: true })
    .then((res) => res)
    .catch((err) => err)
  await Auth.updateUserAttributes(currentUser, {
    'custom:language': locale
  })
    .then((res) => res)
    .catch((err) => err)
  return {
    type: CHANGE_LOCALE,
    payload: locale
  }
}
