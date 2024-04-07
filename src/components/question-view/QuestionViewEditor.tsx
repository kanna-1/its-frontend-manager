import React, { useEffect, useRef, useState } from "react";
import Editor, { Monaco } from "@monaco-editor/react";
import { FeedbackType } from "./QuestionViewFeedback";
import { getCodeFeedback } from "@/actions/getCodeFeedback";

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
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  

  function applyDecorations(editor: any, monaco: any, feedback: FeedbackType[]) {
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

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    monacoRef.current = monaco;
  }
  
  useEffect(() => {
    if (shouldApplyDecorations && feedback.length > 0) {
      console.log("feedback", feedback[0].lineNumber == null)
      const editor = editorRef.current;
      const monaco = monacoRef.current;
      
      for (let i = 0; i < feedback.length; i++) {
        console.log("test")
        if (feedback[i].lineNumber != null) {
          console.log("hi")
          applyDecorations(editor, monaco, feedback);
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
