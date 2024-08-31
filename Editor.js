import React, { useState } from 'react';
import { Editor, EditorState, RichUtils } from 'draft-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAlignLeft, faAlignCenter, faAlignRight, faBold, faItalic, faUnderline, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import 'draft-js/dist/Draft.css';
import './Editor.css';

const EditorComponent = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [fontSize, setFontSize] = useState('16px');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontColor, setFontColor] = useState('#000000');
  const [textTransform, setTextTransform] = useState('none');
  const [alignment, setAlignment] = useState('left');

  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const onBoldClick = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'BOLD'));
  };

  const onItalicClick = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'ITALIC'));
  };

  const onUnderlineClick = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'UNDERLINE'));
  };

  const onFontSizeChange = (e) => {
    setFontSize(e.target.value);
  };

  const onFontFamilyChange = (e) => {
    setFontFamily(e.target.value);
  };

  const onFontColorChange = (e) => {
    setFontColor(e.target.value);
  };

  const onTextTransformChange = (e) => {
    setTextTransform(e.target.value);
  };

  const onTextAlignClick = (align) => {
    const contentState = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const blockMap = contentState.getBlockMap();
    const newContentState = contentState.merge({
      blockMap: blockMap.map((block) => {
        if (selection.hasFocus && selection.getStartKey() === block.getKey()) {
          return block.set('data', block.getData().set('alignment', align));
        }
        return block;
      })
    });
    const newEditorState = EditorState.push(editorState, newContentState, 'change-block-data');
    setEditorState(newEditorState);
    setAlignment(align);
  };

  const onClearClick = () => {
    setEditorState(EditorState.createEmpty());
  };

  const customStyleMap = {
    BOLD: { fontWeight: 'bold' },
    ITALIC: { fontStyle: 'italic' },
    UNDERLINE: { textDecoration: 'underline' },
    FONT_SIZE: (size) => ({ fontSize: size }),
    FONT_FAMILY: (family) => ({ fontFamily: family }),
    COLOR: (color) => ({ color: color }),
    TEXT_TRANSFORM: (transform) => ({ textTransform: transform }),
    TEXT_ALIGN: (align) => ({ textAlign: align })
  };

  const editorStyles = {
    fontSize: fontSize,
    fontFamily: fontFamily,
    color: fontColor,
    textTransform: textTransform,
    textAlign: alignment
  };

  const getWordAndLetterCount = () => {
    const content = editorState.getCurrentContent().getPlainText();
    const words = content.trim().split(/\s+/).length;
    const letters = content.replace(/\s+/g, '').length;
    return { words, letters };
  };

  return (
    <div className="editor-container">
      <div className="toolbar">
        <button className="toolbar-button" onClick={onBoldClick}><FontAwesomeIcon icon={faBold} /></button>
        <button className="toolbar-button" onClick={onItalicClick}><FontAwesomeIcon icon={faItalic} /></button>
        <button className="toolbar-button" onClick={onUnderlineClick}><FontAwesomeIcon icon={faUnderline} /></button>
        <select className="toolbar-select" onChange={onFontSizeChange} value={fontSize}>
          <option value="12px">12px</option>
          <option value="14px">14px</option>
          <option value="16px">16px</option>
          <option value="18px">18px</option>
          <option value="20px">20px</option>
        </select>
        <select className="toolbar-select" onChange={onFontFamilyChange} value={fontFamily}>
          <option value="Arial">Arial</option>
          <option value="Courier New">Courier New</option>
          <option value="Georgia">Georgia</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Verdana">Verdana</option>
        </select>
        <input type="color" className="toolbar-color-picker" onChange={onFontColorChange} value={fontColor} />
        <select className="toolbar-select" onChange={onTextTransformChange} value={textTransform}>
          <option value="none">None</option>
          <option value="uppercase">Uppercase</option>
          <option value="lowercase">Lowercase</option>
          <option value="capitalize">Capitalize</option>
        </select>
        <button className="toolbar-button" onClick={() => onTextAlignClick('left')} title="Left Align"><FontAwesomeIcon icon={faAlignLeft} /></button>
        <button className="toolbar-button" onClick={() => onTextAlignClick('center')} title="Center Align"><FontAwesomeIcon icon={faAlignCenter} /></button>
        <button className="toolbar-button" onClick={() => onTextAlignClick('right')} title="Right Align"><FontAwesomeIcon icon={faAlignRight} /></button>
        <button className="toolbar-button" onClick={onClearClick} title="Clear"><FontAwesomeIcon icon={faTrashAlt} /></button>
      </div>
      <div className="editor" style={editorStyles}>
        <Editor
          editorState={editorState}
          onChange={setEditorState}
          handleKeyCommand={handleKeyCommand}
          customStyleMap={customStyleMap}
        />
      </div>
      <div className="status-bar">
        <span>Words: {getWordAndLetterCount().words} </span>
        <span>Letters: {getWordAndLetterCount().letters}</span>
      </div>
    </div>
  );
};

export default EditorComponent;
