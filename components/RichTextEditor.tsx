
import React, { useRef, useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const ToolbarButton = ({ cmd, icon, title }: { cmd: string; icon: string; title: string }) => (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        execCommand(cmd);
      }}
      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-gray-600 transition-colors"
      title={title}
    >
      <i className={`fas ${icon}`}></i>
    </button>
  );

  return (
    <div className="border border-gray-200 rounded-xl bg-white overflow-hidden focus-within:ring-2 focus-within:ring-amber-500/20 focus-within:border-amber-500 transition-all">
      <div className="flex items-center gap-1 p-1 bg-gray-50 border-b border-gray-200">
        <ToolbarButton cmd="bold" icon="fa-bold" title="Bold" />
        <ToolbarButton cmd="italic" icon="fa-italic" title="Italic" />
        <ToolbarButton cmd="underline" icon="fa-underline" title="Underline" />
        <div className="w-px h-4 bg-gray-300 mx-1" />
        <ToolbarButton cmd="insertUnorderedList" icon="fa-list-ul" title="Bullet List" />
        <ToolbarButton cmd="insertOrderedList" icon="fa-list-ol" title="Numbered List" />
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="p-4 min-h-[150px] max-h-[300px] overflow-y-auto text-sm text-gray-800 focus:outline-none prose prose-sm max-w-none"
        data-placeholder={placeholder}
        style={{
          outline: 'none',
        }}
      />
      {(!value || value === '<br>') && (
        <div className="absolute top-12 left-4 pointer-events-none text-gray-400 text-sm italic">
          {placeholder}
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;
