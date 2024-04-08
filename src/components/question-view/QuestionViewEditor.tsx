import React, { useEffect, useRef } from "react";
import Editor, { Monaco, OnMount } from "@monaco-editor/react";
import { FeedbackType } from "./QuestionViewFeedback";
import * as monaco from "monaco-editor";

export default function QuestionViewEditor({
  handleEditorChange,
  language,
  feedback,
  shouldApplyDecorations,
}: {
  handleEditorChange: (value: string | undefined) => void;
  language: string;
  feedback: FeedbackType[];
  shouldApplyDecorations: boolean;
}) {
  
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  

  function applyDecorations(editor: monaco.editor.IStandaloneCodeEditor | null,  feedback: FeedbackType[]) {
    if (!editor || !editor.getModel()) return;

    const decorations = feedback.map((fb, index) => ({
      range: new monaco.Range(fb.lineNumber, 1, fb.lineNumber, 1),
      options: {
        isWholeLine: true,
        inlineClassName: "highlightedLine",
      },
    }));

    return editor.deltaDecorations([], decorations);
  }

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
  };

  
  useEffect(() => {
    if (shouldApplyDecorations && feedback.length > 0) {
      console.log("feedback", feedback[0].lineNumber == null)
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
      language="python"
      defaultValue={`\n\n\n\n\n\n\n\n\n\n`}
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
