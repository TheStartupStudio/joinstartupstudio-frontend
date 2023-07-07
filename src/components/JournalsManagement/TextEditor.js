import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {
  Editor,
  EditorTools,
  EditorToolsSettings
} from '@progress/kendo-react-editor'
import '@progress/kendo-theme-default/dist/all.css'
import './TextEditor.css'
import { useRef } from 'react'

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
  ForeColor,
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

const paletteSettings = {
  palette: [
    '#333D3D',
    '#231F20',
    '#FF3399',
    '#f0d0c9',
    '#e2a293',
    '#d4735e',
    '#65281a',
    '#eddfda',
    '#dcc0b6',
    '#cba092',
    '#7b4b3a',
    '#fcecd5',
    '#f9d9ab',
    '#f6c781',
    '#c87d0e',
    '#e1dca5',
    '#d0c974',
    '#a29a36',
    '#514d1b',
    '#c6d9f0',
    '#8db3e2',
    '#548dd4',
    '#17365d'
  ],
  columns: 5,
  tileSize: 30
}

const colorPickerProps = {
  ...EditorToolsSettings.foreColor.colorPickerProps,
  paletteSettings
}
const fontFamilyList = [
  {
    text: 'Montserrat',
    value: 'Montserrat, sans-serif',
    style: {
      fontFamily: 'Montserrat, sans-serif'
    }
  }
]

const customFontFamilyProps = {
  ...EditorToolsSettings.fontName,
  items: fontFamilyList
}

const fontSizeToolSettings = {
  ...EditorToolsSettings.fontSize,
  items: [
    { text: '10', value: '10px' },
    { text: '10.2', value: '10.2px' },
    { text: '11', value: '11px' },
    { text: '12', value: '12px' },
    { text: '14', value: '14px' },
    { text: '15', value: '15px' },
    { text: '16', value: '16px' },
    { text: '18', value: '18px' },
    { text: '19', value: '19px' },
    { text: '20', value: '20px' },
    { text: '22', value: '22px' },
    { text: '36', value: '36px' }
  ]
}

const fontWeight = {
  ...EditorToolsSettings.bold,

  items: [
    { text: '400', value: '400' },
    { text: '500', value: '500' },
    { text: '600', value: '600' }
  ]
}

const CustomFontSize = EditorTools.createStyleDropDownList(fontSizeToolSettings)
const CustomFontWeight = EditorTools.createInlineFormatTool(fontWeight)
const FontFamilyCustom = EditorTools.createStyleDropDownList(
  customFontFamilyProps
)
const ForeColorCustom = (props) => {
  return <ForeColor {...props} colorPickerProps={colorPickerProps} />
}

const KendoTextEditor = (props) => {
  const defaultTools = [
    [Bold, Italic, Underline, Strikethrough],
    [Subscript, Superscript],
    [AlignLeft, AlignCenter, AlignRight, AlignJustify],
    [Indent, Outdent],
    [OrderedList, UnorderedList],
    ForeColorCustom,
    FontFamilyCustom,
    CustomFontSize,
    FormatBlock,
    [Undo, Redo],
    [Link, Unlink, InsertImage, ViewHtml]
  ]
  return (
    <>
      <Editor
        tools={props.tools ? props.tools : defaultTools}
        contentStyle={{
          height: props.minHeight ?? 600,
          minHeight: props.minHeight
        }}
        value={props.value}
        onChange={(e) => props.handleChange(e.html)}
      />
    </>
  )
}

export default KendoTextEditor
