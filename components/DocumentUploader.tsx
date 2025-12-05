import React, { useState, useRef } from 'react';
import { Upload, FileText, X, CheckCircle2 } from 'lucide-react';
import { DocumentContext } from '../types';
import Tooltip from './Tooltip';

interface DocumentUploaderProps {
  onContextSet: (ctx: DocumentContext | null) => void;
  currentContext: DocumentContext | null;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ onContextSet, currentContext }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [textInput, setTextInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert("Please upload a valid PDF file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      onContextSet({
        type: 'file',
        content: base64String,
        mimeType: 'application/pdf',
        name: file.name
      });
    };
    reader.readAsDataURL(file);
  };

  const handleTextSubmit = () => {
    if (!textInput.trim()) return;
    onContextSet({
      type: 'text',
      content: textInput,
      name: 'Pasted Text Content'
    });
  };

  const clearContext = () => {
    onContextSet(null);
    setTextInput('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (currentContext) {
    return (
      <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-6 flex items-center justify-between shadow-sm transition-colors">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-100 dark:bg-emerald-800 p-3 rounded-full">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-300" />
          </div>
          <div>
            <h3 className="font-semibold text-emerald-900 dark:text-emerald-100">Knowledge Base Active</h3>
            <p className="text-sm text-emerald-700 dark:text-emerald-300">Using: {currentContext.name}</p>
          </div>
        </div>
        <Tooltip content="Remove reference document">
          <button 
            onClick={clearContext}
            className="p-2 hover:bg-emerald-100 dark:hover:bg-emerald-800 rounded-lg transition-colors text-emerald-700 dark:text-emerald-400"
            title="Remove document"
          >
            <X className="w-5 h-5" />
          </button>
        </Tooltip>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
      <div className="border-b border-slate-200 dark:border-slate-700 flex">
        <div className="flex-1">
          <Tooltip content="Upload a PDF file" fullWidth position="bottom">
            <button
              className={`w-full py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'upload' 
                  ? 'bg-indigo-50 dark:bg-slate-800 text-indigo-700 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
              onClick={() => setActiveTab('upload')}
            >
              <Upload className="w-4 h-4" /> Upload PDF
            </button>
          </Tooltip>
        </div>
        <div className="flex-1">
          <Tooltip content="Paste text content directly" fullWidth position="bottom">
            <button
              className={`w-full py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'paste' 
                  ? 'bg-indigo-50 dark:bg-slate-800 text-indigo-700 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
              onClick={() => setActiveTab('paste')}
            >
              <FileText className="w-4 h-4" /> Paste Text
            </button>
          </Tooltip>
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'upload' ? (
          <div className="text-center">
            <Tooltip content="Click to browse for a PDF file" fullWidth>
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-8 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
                <div className="bg-indigo-100 dark:bg-slate-800 group-hover:bg-indigo-200 dark:group-hover:bg-slate-700 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
                  <Upload className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <p className="text-slate-700 dark:text-slate-300 font-medium mb-1">Click to upload document</p>
                <p className="text-sm text-slate-500 dark:text-slate-500">PDF format supported (e.g., your derivative HTS list)</p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  accept="application/pdf" 
                  className="hidden" 
                />
              </div>
            </Tooltip>
          </div>
        ) : (
          <div>
            <Tooltip content="Paste text from MS Word/Doc here" fullWidth>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Paste the content of your MS Doc here..."
                className="w-full h-40 p-4 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none text-sm font-mono text-slate-700 dark:text-slate-300 resize-none transition-colors"
              />
            </Tooltip>
            <Tooltip content="Load this text as reference data" fullWidth>
              <button
                onClick={handleTextSubmit}
                disabled={!textInput.trim()}
                className="mt-4 w-full bg-indigo-600 dark:bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 dark:hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Set as Knowledge Base
              </button>
            </Tooltip>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentUploader;