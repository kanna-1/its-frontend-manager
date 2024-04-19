import React, { useEffect, useRef } from "react";
import Editor, { Monaco, OnMount } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { FeedbackType } from "./QuestionViewFeedback";

const language_map = {
  py: "python",
  c: "c",
};

export default function QuestionViewEditor({
  handleEditorChange,
  language,
  feedback,
  shouldApplyDecorations,
}: {
  handleEditorChange;
  language: string;
  feedback: FeedbackType[];
  shouldApplyDecorations: boolean;
}): React.JSX.Element {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);

  function applyDecorations(
    editor: monaco.editor.IStandaloneCodeEditor | null,
    feedback: FeedbackType[]
  ): monaco.editor.IEditorDecorationsCollection | undefined {
    if (!editor || !editor.getModel()) return;

    const decorations = feedback.map((fb) => ({
      range: new monaco.Range(fb.lineNumber, 1, fb.lineNumber, 1),
      options: {
        isWholeLine: true,
        inlineClassName: "highlightedLine",
      },
    }));
    return editor.createDecorationsCollection(decorations);
  }

  const handleEditorDidMount:OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
  };

  useEffect(() => {
    if (shouldApplyDecorations && feedback.length > 0) {
      const editor = editorRef.current;
      for (let i = 0; i < feedback.length; i++) {
        if (feedback[i].lineNumber != null) {
          applyDecorations(editor, feedback);
        }
      }
    }
  }, [feedback, shouldApplyDecorations]);

  return (
    <Editor
      language={language_map[language]}
      defaultValue={"\n\n\n\n\n\n\n\n\n\n"}
      onChange={handleEditorChange}
      height="100%"
      width="100%"
      onMount={handleEditorDidMount}
      options={{
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
      }}
    />
  );
}
