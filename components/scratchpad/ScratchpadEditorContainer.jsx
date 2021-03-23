import React from 'react';
import { connect } from 'react-redux';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

const mapStateToProps = (state) => ({
  value: state.editor.code,
  language: window.MONACO_MODES[state.editor.lang],
  theme: 'vs-light',
  mainSize: state.ui.main.size,
  pretestSize: state.ui.pretest.size,
  recordSize: state.ui.records.size,
});
const mapDispatchToProps = (dispatch) => ({
  handleUpdateCode: (code) => {
    dispatch({
      type: 'SCRATCHPAD_EDITOR_UPDATE_CODE',
      payload: code,
    });
  },
});

@connect(mapStateToProps, mapDispatchToProps)
export default class MonacoEditor extends React.PureComponent {
  componentDidMount() {
    const value = this.props.value || '';
    const { language, theme } = this.props;
    this.model = monaco.editor.createModel(value, language, monaco.Uri.parse('file://model'));
    if (this.containerElement) {
      this.editor = monaco.editor.create(
        this.containerElement,
        {
          theme,
          lineNumbers: true,
          glyphMargin: true,
          lightbulb: {
            enabled: true,
          },
          model: this.model,
        }
      );
      this._subscription = this.editor.onDidChangeModelContent((event) => {
        if (!this.__prevent_trigger_change_event) {
          this.props.handleUpdateCode(this.editor.getValue(), event);
        }
      });
      window.editor = this.editor;
    }
  }

  componentDidUpdate(prevProps) {
    const {
      value, language, theme, mainSize, recordSize, pretestSize,
    } = this.props;
    const { editor, model } = this;
    if (this.props.value != null && this.props.value !== model.getValue()) {
      this.__prevent_trigger_change_event = true;
      editor.pushUndoStop();
      model.pushEditOperations(
        [],
        [
          {
            range: model.getFullModelRange(),
            text: value,
          },
        ]
      );
      editor.pushUndoStop();
      this.__prevent_trigger_change_event = false;
    }
    if (prevProps.language !== language) {
      monaco.editor.setModelLanguage(model, language);
      editor.updateOptions({ mode: language });
    }
    if (prevProps.theme !== theme) monaco.editor.setTheme(theme);
    if (editor) {
      if (prevProps.mainSize !== mainSize
        || prevProps.recordSize !== recordSize
        || prevProps.pretestSize !== pretestSize) editor.layout();
    }
  }

  componentWillUnmount() {
    if (this.editor) this.editor.dispose();
    if (this.model) this.model.dispose();
    if (this._subscription) this._subscription.dispose();
  }

  assignRef = (component) => {
    this.containerElement = component;
  };

  render() {
    return (
      <div
        ref={this.assignRef}
        style={{
          height: '100%',
          width: '100%',
        }}
        className="ScratchpadMonacoEditor"
      />
    );
  }
}
