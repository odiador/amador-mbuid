import React, { useState } from 'react';
import Editor from '@monaco-editor/react';

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  onValidation?: (isValid: boolean, errorMessage?: string) => void;
  height?: number;
  readOnly?: boolean;
}

const JsonEditor: React.FC<JsonEditorProps> = ({
  value,
  onChange,
  onValidation,
  height = 400,
  readOnly = false,
}) => {
  const [editorValue, setEditorValue] = useState(value);

  const handleEditorChange = (newValue: string | undefined) => {
    const currentValue = newValue || '';
    setEditorValue(currentValue);
    
    // Validar JSON
    try {
      if (currentValue.trim()) {
        JSON.parse(currentValue);
        onValidation?.(true);
      } else {
        onValidation?.(false, 'JSON vacío');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'JSON inválido';
      onValidation?.(false, errorMessage);
    }
    
    onChange(currentValue);
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <Editor
        height={height}
        defaultLanguage="json"
        value={editorValue}
        onChange={handleEditorChange}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          insertSpaces: true,
          formatOnPaste: true,
          formatOnType: true,
        }}
        theme="vs-light"
      />
    </div>
  );
};

export default JsonEditor;
