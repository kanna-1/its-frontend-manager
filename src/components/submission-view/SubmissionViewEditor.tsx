import React, { useRef } from "react";
import Editor from "@monaco-editor/react";
import * as monaco from "monaco-editor";

export default function SubmissionViewEditor({
  code,
}: {
  code: string;
}): React.JSX.Element {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  function handleEditorDidMount(editor: monaco.editor.IStandaloneCodeEditor): void  {
    editorRef.current = editor;
  }
  return (
    <Editor
      value={code}
      height="100%"
      width="100%"
      onMount={handleEditorDidMount}
      options={{
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        readOnly: true,
      }}
    />
  );
}
