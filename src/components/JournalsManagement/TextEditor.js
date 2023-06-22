import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Editor, EditorTools } from '@progress/kendo-react-editor'
import '@progress/kendo-theme-default/dist/all.css'

const {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Subscript,
  Superscript,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Indent,
  Outdent,
  OrderedList,
  UnorderedList,
  Undo,
  Redo,
  FontSize,
  FontName,
  FormatBlock,
  Link,
  Unlink,
  InsertImage,
  ViewHtml,
  InsertTable,
  AddRowBefore,
  AddRowAfter,
  AddColumnBefore,
  AddColumnAfter,
  DeleteRow,
  DeleteColumn,
  DeleteTable,
  MergeCells,
  SplitCell
} = EditorTools
const KendoTextEditor = (props) => {
  const defaultTools = [
    [Bold, Italic, Underline, Strikethrough],
    [Subscript, Superscript],
    [AlignLeft, AlignCenter, AlignRight, AlignJustify],
    [Indent, Outdent],
    [OrderedList, UnorderedList],
    FontSize,
    FontName,
    FormatBlock,
    [Undo, Redo],
    [Link, Unlink, InsertImage, ViewHtml]
  ]
  return (
    <Editor
      tools={props.tools ? props.tools : defaultTools}
      contentStyle={{
        height: props.minHeight ?? 600,
        minHeight: props.minHeight
      }}
      value={props.value}
      onChange={(e) => props.handleChange(e.html)}

      // defaultContent={content}
    />
  )
}

export default KendoTextEditor
