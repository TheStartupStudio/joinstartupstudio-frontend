import React from 'react'
import { Editor, EditorTools } from '@progress/kendo-react-editor'
import { formatDateString } from '../../utils/helpers'

const TextInput = ({ title, name, value, handleChange, showError, error }) => (
  <div className="edit_content-item-container">
    <label className="edit_content-item-title">{title}:</label>
    <input
      className="edit_content-item-description"
      type="text"
      name={name}
      onChange={handleChange}
      value={value}
    />
    {showError && error && <small className="ps-1">{error}</small>}
  </div>
)

const DateInput = ({ title, name, value, handleChange, showError, error }) => (
  <div className="edit_content-item-container">
    <label className="edit_content-item-title">{title}:</label>
    <input
      className="edit_content-item-description"
      type="date"
      name={name}
      onChange={handleChange}
      value={formatDateString(value)}
    />
    {showError && error && <small className="ps-1">{error}</small>}
  </div>
)

const TextEditor = ({ title, name, value, handleChange, showError, error }) => (
  <div className="edit_content-item-container">
    <label className="edit_content-item-title">{title}:</label>
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
    {showError && error && <small className="ps-1">{error}</small>}
  </div>
)

export { TextInput, DateInput, TextEditor }
