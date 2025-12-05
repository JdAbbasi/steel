import React, { useState, useEffect } from 'react';
import { Search, Database, ArrowRight, Loader2, History, Lock, Unlock, Settings, Moon, Sun, BookOpen, RefreshCw, Shield } from 'lucide-react';
import DocumentUploader from './components/DocumentUploader';
import AnalysisResultCard from './components/AnalysisResultCard';
import LoadingAnalysis from './components/LoadingAnalysis';
import ManualEntryManager from './components/ManualEntryManager';
import ReferenceInfo from './components/ReferenceInfo';
import Tooltip from './components/Tooltip';
import { checkHtsCode, extractDocumentHeadings } from './services/geminiService';
import { 
  saveContextToDb, 
  getContextFromDb, 
  clearContextInDb,
  saveEntryToDb,
  getEntriesFromDb,
  deleteEntryFromDb
} from './services/dbService';
import { AnalysisResult, DocumentContext, ManualEntry } from './types';

function App() {
  const [documentContext, setDocumentContext] = useState<DocumentContext | null>(null);
  const [manualEntries, setManualEntries] = useState<ManualEntry[]>([]);
  const [htsInput, setHtsInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isScanningDoc, setIsScanningDoc] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [searchedHts, setSearchedHts] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<{code: string, found: boolean}[]>([]);
  
  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') as 'light' | 'dark' || 'light';
    }
    return 'light';
  });

  // Admin State
  const [viewMode, setViewMode] = useState<'user' | 'admin'>('user');
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminTab, setAdminTab] = useState<'document' | 'manual'>('document');

  // Apply Theme
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Load Context and Entries from DB on Mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedContext = await getContextFromDb();
        if (savedContext) setDocumentContext(savedContext);
        
        const savedEntries = await getEntriesFromDb();
        setManualEntries(savedEntries);
      } catch (e) {
        console.error("Failed to load saved data", e);
      }
    };
    loadData();
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleContextUpdate = async (ctx: DocumentContext | null) => {
    setDocumentContext(ctx);
    if (ctx) {
      await saveContextToDb(ctx);
    } else {
      await clearContextInDb();
    }
  };

  const handleManualEntryAdd = async (entry: ManualEntry) => {
    await saveEntryToDb(entry);
    setManualEntries(prev => [...prev, entry]);
  };

  const handleManualEntryUpdate = async (entry: ManualEntry) => {
    await saveEntryToDb(entry);
    setManualEntries(prev => prev.map(e => e.id === entry.id ? entry : e));
  };

  const handleManualEntryDelete = async (id: string) => {
    await deleteEntryFromDb(id);
    setManualEntries(prev => prev.filter(e => e.id !== id));
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!htsInput.trim()) return;
    
    // Allow search if either document OR manual entries exist
    const hasData = documentContext || manualEntries.length > 0;
    if (!hasData) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await checkHtsCode(documentContext, manualEntries, htsInput);
      setResult(data);
      setSearchedHts(htsInput);
      setHistory(prev => [{ code: htsInput, found: data.found }, ...prev.slice(0, 4)]);
    } catch (err: any) {
      setError("Failed to analyze the HTS code. Please check your API key and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleScanHeadings = async () => {
    if (!documentContext) return;
    setIsScanningDoc(true);
    try {
      const headings = await extractDocumentHeadings(documentContext);
      const updatedContext = { ...documentContext, extractedHeadings: headings };
      setDocumentContext(updatedContext);
      await saveContextToDb(updatedContext);
    } catch (err) {
      console.error(err);
      alert("Failed to scan document headings.");
    } finally {
      setIsScanningDoc(false);
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === '332') {
      setIsAdminAuthenticated(true);
      setError(null);
    } else {
      alert("Incorrect Password");
    }
  };

  const toggleAdminView = () => {
    if (viewMode === 'user') {
      setViewMode('admin');
    } else {
      setViewMode('user');
    }
  };
  
  const isSystemReady = documentContext || manualEntries.length > 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-indigo-100 dark:selection:bg-indigo-900 flex flex-col transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Tooltip content="Return to Search" position="bottom">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setViewMode('user')} role="button">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-blue-600 dark:text-white hidden sm:block">
                HTS ALUMINUM and STEEL Derivative Analyzer
              </h1>
            </div>
          </Tooltip>
          
          <div className="flex items-center gap-3">
            <Tooltip content={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'} position="bottom">
               <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
            </Tooltip>

            <Tooltip content={viewMode === 'admin' ? 'Exit Admin Panel' : 'Enter Admin Panel'} position="bottom">
              <button
                onClick={toggleAdminView}
                className={`p-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium ${
                  viewMode === 'admin' 
                    ? 'bg-slate-800 text-white hover:bg-slate-700 dark:bg-indigo-600 dark:hover:bg-indigo-500' 
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                {viewMode === 'admin' ? (
                   <>
                     <ArrowRight className="w-4 h-4" /> <span className="hidden sm:inline">Exit Admin</span>
                   </>
                ) : (
                   <>
                     <Settings className="w-4 h-4" /> <span className="hidden sm:inline">Admin</span>
                   </>
                )}
              </button>
            </Tooltip>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full">
        
        {/* ADMIN VIEW */}
        {viewMode === 'admin' && (
          <div className="max-w-4xl mx-auto">
            {!isAdminAuthenticated ? (
              <div className="max-w-md mx-auto bg-white dark:bg-slate-900 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 animate-fade-in-up transition-colors">
                <div className="text-center mb-6">
                  <div className="bg-slate-100 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8 text-slate-600 dark:text-slate-400" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Admin Access Required</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Please enter the administrator password to manage reference data.</p>
                </div>
                <form onSubmit={handleAdminLogin}>
                  <Tooltip content="Enter admin password (332)" fullWidth>
                    <input
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none mb-4 transition-colors"
                      placeholder="Enter Password"
                      autoFocus
                    />
                  </Tooltip>
                  <Tooltip content="Validate Credentials" fullWidth>
                    <button
                      type="submit"
                      className="w-full bg-slate-900 dark:bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2"
                    >
                      <Unlock className="w-4 h-4" /> Unlock Panel
                    </button>
                  </Tooltip>
                </form>
              </div>
            ) : (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Settings className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Reference Data Management
                  </h2>
                  <Tooltip content="Logout of Admin Panel">
                    <button 
                      onClick={() => setIsAdminAuthenticated(false)}
                      className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium"
                    >
                      Lock Panel
                    </button>
                  </Tooltip>
                </div>

                {/* Tabbed Interface */}
                <div className="flex border-b border-slate-200 dark:border-slate-700 mb-6">
                  <button
                    onClick={() => setAdminTab('document')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                      adminTab === 'document' 
                        ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400' 
                        : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                  >
                    Document Reference
                  </button>
                  <button
                    onClick={() => setAdminTab('manual')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                      adminTab === 'manual' 
                        ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400' 
                        : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                  >
                    Manual Entries
                  </button>
                </div>
                
                {adminTab === 'document' ? (
                  <>
                    <DocumentUploader 
                      onContextSet={handleContextUpdate} 
                      currentContext={documentContext} 
                    />
                    
                    {documentContext && (
                      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 transition-colors">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Covered HTS Headings
                          </h3>
                          <Tooltip content="Analyze document to list all headings">
                            <button 
                              onClick={handleScanHeadings}
                              disabled={isScanningDoc}
                              className="text-xs flex items-center gap-1 bg-indigo-50 dark:bg-slate-800 text-indigo-700 dark:text-indigo-400 px-3 py-1.5 rounded-md hover:bg-indigo-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                            >
                              {isScanningDoc ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                              {isScanningDoc ? 'Scanning...' : 'Scan Document'}
                            </button>
                          </Tooltip>
                        </div>
                        
                        {documentContext.extractedHeadings ? (
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase text-xs">
                                <tr>
                                  <th className="px-4 py-3 rounded-tl-lg">Heading</th>
                                  <th className="px-4 py-3 rounded-tr-lg">Detail</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {documentContext.extractedHeadings.length > 0 ? (
                                  documentContext.extractedHeadings.map((h, i) => (
                                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                      <td className="px-4 py-3 font-mono font-medium text-slate-800 dark:text-slate-200 w-24">{h.heading}</td>
                                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{h.description}</td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan={2} className="px-4 py-3 text-center text-slate-500 italic">No headings found.</td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="text-center py-6 text-slate-500 dark:text-slate-400 text-sm border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-lg">
                            Click "Scan Document" to list all HTS headings found in the file.
                          </div>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <ManualEntryManager 
                    entries={manualEntries}
                    onAdd={handleManualEntryAdd}
                    onUpdate={handleManualEntryUpdate}
                    onDelete={handleManualEntryDelete}
                  />
                )}

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-200">
                  <p className="font-semibold mb-1">Instructions:</p>
                  <p>You can manage reference data via two methods:</p>
                  <ul className="list-disc ml-5 mt-1 space-y-1">
                    <li><strong>Document Reference:</strong> Upload a comprehensive PDF or text of the derivative list.</li>
                    <li><strong>Manual Entries:</strong> Add specific HTS codes and rules directly into the database. These override or supplement the document.</li>
                  </ul>
                </div>

                <Tooltip content="Go back to the main search screen" fullWidth>
                  <button
                    onClick={() => setViewMode('user')}
                    className="w-full bg-indigo-600 dark:bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 dark:hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowRight className="w-4 h-4" /> Return to Search
                  </button>
                </Tooltip>
              </div>
            )}
          </div>
        )}

        {/* USER VIEW */}
        {viewMode === 'user' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            
            {/* Left Column: Search & Status */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* System Status Card */}
              <div className={`p-6 rounded-xl border transition-colors ${
                isSystemReady 
                  ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/10 dark:border-emerald-800' 
                  : 'bg-amber-50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-800'
              }`}>
                <div className="flex items-start gap-4">
                   <div className={`p-3 rounded-full shrink-0 ${
                     isSystemReady 
                       ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400' 
                       : 'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400'
                   }`}>
                      {isSystemReady ? <Database className="w-6 h-6" /> : <AlertCircleIcon className="w-6 h-6" />}
                   </div>
                   <div>
                     <h3 className={`font-bold ${
                       isSystemReady 
                         ? 'text-emerald-900 dark:text-emerald-100' 
                         : 'text-amber-900 dark:text-amber-100'
                     }`}>
                       {isSystemReady ? 'System Online' : 'Reference Data Missing'}
                     </h3>
                     <p className={`text-sm mt-1 ${
                       isSystemReady 
                         ? 'text-emerald-700 dark:text-emerald-300' 
                         : 'text-amber-700 dark:text-amber-300'
                     }`}>
                       {documentContext 
                         ? `Analyzing against: ${documentContext.name}`
                         : manualEntries.length > 0 
                           ? `Using ${manualEntries.length} manual entry rules.`
                           : 'Please contact the administrator to load the HTS Derivative reference document.'}
                     </p>
                     {/* Show pill if manual entries are also present */}
                     {documentContext && manualEntries.length > 0 && (
                        <span className="inline-block mt-2 px-2 py-0.5 text-xs font-semibold bg-white/50 dark:bg-black/20 rounded text-emerald-800 dark:text-emerald-200">
                          + {manualEntries.length} Manual Rules
                        </span>
                     )}
                   </div>
                </div>
              </div>

              {/* Search Form - Only visible if data exists */}
              {isSystemReady && (
                <section>
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
                    <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4 flex items-center gap-2">
                       Verify Compliance
                    </h2>
                    <form onSubmit={handleSearch}>
                      <label htmlFor="hts-input" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Enter HTS Code
                      </label>
                      <div className="relative">
                        <Tooltip content="Enter a numeric HTS code (e.g. 7604.10.10)" fullWidth>
                          <input
                            id="hts-input"
                            type="text"
                            value={htsInput}
                            onChange={(e) => setHtsInput(e.target.value.replace(/[^0-9.]/g, ''))}
                            placeholder="e.g., 7604.10.10"
                            className="w-full pl-4 pr-12 py-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none font-mono text-lg transition-colors"
                            disabled={isLoading}
                          />
                        </Tooltip>
                        <div className="absolute right-3 top-3.5 text-slate-400 dark:text-slate-500 pointer-events-none">
                          <Search className="w-5 h-5" />
                        </div>
                      </div>
                      <Tooltip content="Analyze the code against the reference document" fullWidth>
                        <button
                          type="submit"
                          disabled={!htsInput || isLoading}
                          className="w-full mt-4 bg-indigo-600 dark:bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 dark:hover:bg-indigo-500 focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-900 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" /> Analyzing...
                            </>
                          ) : (
                            <>
                              Check Code <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </Tooltip>
                    </form>
                  </div>
                </section>
              )}

              {/* History */}
              {history.length > 0 && (
                <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4 transition-colors">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-3">
                    <History className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase">Recent Checks</span>
                  </div>
                  <div className="space-y-2">
                    {history.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="font-mono text-slate-700 dark:text-slate-300">{item.code}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          item.found 
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' 
                            : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                        }`}>
                          {item.found ? 'Derivative' : 'Not Found'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Results & Reference */}
            <div className="lg:col-span-7">
              {!isSystemReady ? (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 transition-colors">
                  <Lock className="w-16 h-16 mb-4 text-slate-300 dark:text-slate-700" />
                  <h3 className="text-lg font-medium text-slate-600 dark:text-slate-300 mb-2">Restricted Access</h3>
                  <p className="max-w-xs">Analysis features are disabled until reference data is loaded by an administrator.</p>
                </div>
              ) : isLoading ? (
                <LoadingAnalysis />
              ) : (
                <div className="space-y-6">
                  {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-red-700 dark:text-red-300 flex items-start gap-3 transition-colors">
                      <Loader2 className="w-5 h-5 shrink-0 mt-0.5 animate-spin" />
                      <p>{error}</p>
                    </div>
                  )}

                  {result ? (
                    <AnalysisResultCard result={result} htsCode={searchedHts} />
                  ) : (
                    !error && (
                      <div className="flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 shadow-sm transition-colors">
                        <Search className="w-16 h-16 mb-4 text-indigo-100 dark:text-slate-800" />
                        <h3 className="text-lg font-medium text-slate-600 dark:text-slate-300">Ready to Analyze</h3>
                        <p>Enter an HTS code to check against the loaded reference document.</p>
                      </div>
                    )
                  )}
                  
                  {/* Reference Info Section - Always visible when system is ready */}
                  <ReferenceInfo />
                </div>
              )}
            </div>

          </div>
        )}

      </main>

      {/* Footer Watermark */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">
            All rights reserved. Junaid Abbasi.
          </p>
        </div>
      </footer>
    </div>
  );
}

// Icon helper for the amber status
function AlertCircleIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
  )
}

export default App;