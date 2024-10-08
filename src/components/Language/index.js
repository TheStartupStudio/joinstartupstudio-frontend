import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { changeLocale } from '../../redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'

export default function Language() {
  const dispatch = useDispatch()
  const currentLanguage = useSelector((state) => state.lang.locale)
  const [showLanguageDropDown, setShowLanguageDropDown] = useState(false)
  const languages = ['en', 'es']
  const languageName = {
    en: 'English',
    es: 'Español'
  }

  const changeLanguage = (language) => {
    localStorage.setItem('currentLanguage', language)
    dispatch(changeLocale(language))
    setShowLanguageDropDown((preState) => !preState)
  }

  const hideLanguageDropDown = () => {
    if (showLanguageDropDown) {
      setTimeout(() => {
        setShowLanguageDropDown(false)
      }, 200)
    }
  }

  return (
    <div
      id='language'
      className='dropdown lang-dropdown'
      tabIndex='0'
      onBlur={() => hideLanguageDropDown()}
    >
      <div
        className='dropdown-trigger'
        onClick={() => {
          setShowLanguageDropDown((preState) => !preState)
        }}
      >
        <a
          className='lang-dropdown-selected'
          aria-haspopup='true'
          aria-controls='dropdown-menu'
        >
          <span className='lang-dropdown-selected-text'>
            {languageName[currentLanguage]}
          </span>
          <span className='lang-dropdown-icon'>
            <FontAwesomeIcon icon={faCaretDown} />
          </span>
        </a>
      </div>
      <div
        id='dropdown-menu'
        className={`dropdown-menu${
          showLanguageDropDown ? 'show lang-dropdown-margin' : ''
        }`}
      >
        <div className='dropdown-content text-center lang-content'>
          {languages.map((language, index) => (
            <a
              href={window.location.href}
              className={`dropdown-item dropdown-item-padding ${
                currentLanguage === language
                  ? 'has-background-primary has-text-white-bis'
                  : ''
              }`}
              key={index}
              onClick={() => {
                changeLanguage(language)
              }}
            >
              {languageName[language]}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
