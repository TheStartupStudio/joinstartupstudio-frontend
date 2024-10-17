import React, { useState, useRef, useEffect } from 'react'
import { Editor, EditorTools } from '@progress/kendo-react-editor'
import { getFormattedDate } from '../utils/helpers'
import ReactSelect from 'react-select'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEye,
  faEyeSlash,
  faQuestion
} from '@fortawesome/free-solid-svg-icons'
import ReactQuill from 'react-quill'

const TextInput = ({ title, name, value, handleChange, showError, error }) => (
  <div className='content-item__container'>
    <label className='content-item__title'>{title}:</label>
    <input
      className='content-item__description'
      type='text'
      name={name}
      onChange={handleChange}
      value={value}
    />
    {showError && error && <small className='ps-1'>{error}</small>}
  </div>
)

const DateInput = ({ title, name, value, handleChange, showError, error }) => (
  <div className='content-item__container'>
    <label className='content-item__title'>{title}:</label>
    <input
      className='content-item__description'
      type='date'
      name={name}
      onChange={handleChange}
      value={getFormattedDate(value)}
    />
    {showError && error && <small className='ps-1'>{error}</small>}
  </div>
)

const QuillEditor = ({ title, name, value, onChange, showError, error }) => {
  const quillModules = {
    toolbar: [
      [{ header: '1' }, { header: '2' }],
      [
        'bold',
        'italic',
        'underline',
        { list: 'ordered' },
        { list: 'bullet' },
        { align: [] },
        'blockquote',
        'link'
      ]
    ]
  }

  const quillFormats = [
    'header',
    'bold',
    'italic',
    'underline',
    'list',
    'bullet',
    'link',
    'blockquote',
    'align'
  ]

  return (
    <>
      <label className='content-item__title'>{title}:</label>
      <ReactQuill
        theme='snow'
        name='textQuillStandart'
        modules={quillModules}
        formats={quillFormats}
        onChange={(e) => onChange?.(e, name)}
        value={value ?? ''}
      />
    </>
  )
}

const QuillEditorBox = ({ title, name, value, onChange, showError, error }) => {
  const quillModules = {
    toolbar: [
      [{ header: '1' }, { header: '2' }],
      [
        'bold',
        'italic',
        'underline',
        { list: 'ordered' },
        { list: 'bullet' },
        { align: [] },
        'blockquote',
        'link'
      ]
    ]
  }

  const quillFormats = [
    'header',
    'bold',
    'italic',
    'underline',
    'list',
    'bullet',
    'link',
    'blockquote',
    'align'
  ]

  return (
    <div className='content-item__container'>
      <label className='content-item__title'>{title}:</label>
      <ReactQuill
        theme='snow'
        name='textQuillStandart'
        modules={quillModules}
        formats={quillFormats}
        onChange={(e) => onChange?.(e, name)}
        value={value ?? ''}
      />
      {showError && error && <small className='ps-1'>{error}</small>}
    </div>
  )
}

const TextEditor = ({ title, name, value, handleChange, showError, error }) => {
  return (
    <div className='content-item__container'>
      <label className='content-item__title'>{title}:</label>
      <Editor
        name={name}
        resizable={true}
        style={{ height: 100, maxHeight: 250, minWidth: 555, minHeight: 170 }}
        tools={[
          [EditorTools.Bold, EditorTools.Italic, EditorTools.Underline],
          [EditorTools.Undo, EditorTools.Redo],
          [EditorTools.Link, EditorTools.Unlink],
          [
            EditorTools.AlignLeft,
            EditorTools.AlignCenter,
            EditorTools.AlignRight
          ],
          [
            EditorTools.OrderedList,
            EditorTools.UnorderedList,
            EditorTools.Indent,
            EditorTools.Outdent
          ]
        ]}
        value={value}
        onChange={(e) => handleChange(e, name)}
      />
      {showError && error && <small className='ps-1'>{error}</small>}
    </div>
  )
}

const SelectInput = ({
  title,
  name,
  value,
  options,
  handleChange,
  showError,
  error
}) => (
  <div className='customUI-item content-item__container'>
    <label className='content-item__title'>{title}:</label>
    <ReactSelect
      className='basic-single'
      classNamePrefix='select'
      defaultValue={value}
      isSearchable={false}
      name={name}
      options={options}
      onChange={handleChange}
    />
    {showError && error && <small className='ps-1'>{error}</small>}
  </div>
)
const LtsGradientButton = ({
  children,
  className,
  onClick,
  style,
  showError,
  error
}) => {
  return (
    <div className='customUI-item ltsGradientButton__container'>
      {' '}
      <span
        className={`ltsGradientButton__button ${className}`}
        style={style}
        onClick={onClick}
      >
        {children}
      </span>
      {showError && error && <small className='ps-1'>{error}</small>}
    </div>
  )
}
const CustomInput = ({
  placeholder = '',
  type,
  value,
  handleChange = () => {},
  name,
  showError = false,
  error = '',
  showHint = false,
  hintText = ''
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const [hintMenu, setHintMenu] = useState(false)
  return (
    <div className='customUI-item customInput__container d-flex flex-column align-items-center position-relative'>
      <input
        type={showPassword ? 'text' : type}
        name={name}
        className='customInput w-100 my-2'
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
      />

      {type === 'password' && (
        <FontAwesomeIcon
          icon={showPassword ? faEye : faEyeSlash}
          className='pw-revelared__icon'
          onClick={() => setShowPassword((state) => !state)}
        />
      )}
      {showHint && (
        <span
          className='hint-icon'
          onClick={() => setHintMenu((state) => !state)}
        >
          <FontAwesomeIcon icon={faQuestion} />
        </span>
      )}

      {hintMenu && <div className='hint-menu'>{hintText}</div>}

      {showError && error && <small className='ps-1 '>{error}</small>}
    </div>
  )
}

const LtsButton = ({
  disabled,
  className,
  text,
  background,
  width,
  color,
  border,
  onClick,
  type
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`customUI-item LtsButton ${className}`}
      onClick={onClick}
      style={{
        background: background,
        width: width,
        color: color,
        border: border,
        borderRadius: '10px'
      }}
    >
      {text}
    </button>
  )
}
const CustomCheckbox = ({ handleChange, checked, text, name, value }) => {
  return (
    <div className='customUI-item customCheckbox__container d-flex py-1'>
      <input
        type='checkbox'
        className='customCheckbox'
        onChange={handleChange}
        checked={checked}
        name={name}
        value={value}
      />
      {text}
    </div>
  )
}

export {
  TextInput,
  DateInput,
  TextEditor,
  SelectInput,
  LtsGradientButton,
  CustomInput,
  LtsButton,
  CustomCheckbox,
  QuillEditor,
  QuillEditorBox
}
