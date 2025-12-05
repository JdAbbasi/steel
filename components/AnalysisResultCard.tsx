import React, { useState } from 'react';
import { CheckCircle, AlertCircle, Info, Layers, ChevronRight, BookOpen, BarChart3, FileCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { AnalysisResult, MetalType, DerivativeMatch } from '../types';

interface AnalysisResultCardProps {
  result: AnalysisResult;
  htsCode: string;
}

const HighlightedDetail: React.FC<{ text: string }> = ({ text }) => {
  // Splits text by:
  // 1. HTS Codes: 4+ digits, optionally followed by dots and more digits (e.g., 7604, 7604.10.10)
  // 2. Keywords: Heading, Subheading, Chapter, Note (case-insensitive)
  const parts = text.split(/(\b\d{4}(?:\.\d+)*\b|\b(?:Heading|Subheading|Chapter|Note)s?\b)/gi);

  return (
    <span>
      {parts.map((part, i) => {
        // HTS Code detection (digits and dots)
        if (/^\d{4}(?:\.\d+)*$/.test(part)) {
          return (
            <span key={i} className="font-mono font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/40 px-1 py-0.5 rounded text-xs mx-0.5 border border-blue-100 dark:border-blue-800/50">
              {part}
            </span>
          );
        }
        // Keyword detection
        if (/^(Heading|Subheading|Chapter|Note)s?$/i.test(part)) {
          return (
            <span key={i} className="font-semibold text-slate-800 dark:text-slate-200 decoration-slate-300 dark:decoration-slate-600 underline decoration-dotted underline-offset-2">
              {part}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
};

const MatchItem: React.FC<{ match: DerivativeMatch; index: number }> = ({ match, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const isAluminum = match.metalType === MetalType.ALUMINUM;
  const isSteel = match.metalType === MetalType.STEEL;
  const isBoth = match.metalType === MetalType.BOTH;
  
  // Check if text is long enough to warrant truncation
  const shouldTruncate = match.matchDetail.length > 120;

  // Colors adapted for dark mode
  let borderColor = "border-slate-200 dark:border-slate-700";
  let badgeColor = "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
  let iconColor = "text-slate-500 dark:text-slate-400";
  let containerBg = "bg-white dark:bg-slate-850";

  if (isAluminum) {
    borderColor = "border-blue-200 dark:border-blue-800";
    badgeColor = "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
    iconColor = "text-blue-600 dark:text-blue-400";
    containerBg = "bg-white dark:bg-slate-850";
  } else if (isSteel) {
    borderColor = "border-orange-200 dark:border-orange-800";
    badgeColor = "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
    iconColor = "text-orange-600 dark:text-orange-400";
    containerBg = "bg-white dark:bg-slate-850";
  } else if (isBoth) {
    borderColor = "border-purple-200 dark:border-purple-800";
    badgeColor = "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
    iconColor = "text-purple-600 dark:text-purple-400";
    containerBg = "bg-white dark:bg-slate-850";
  }

  // Confidence Color Logic
  const getConfidenceStyle = (level: string) => {
    switch(level) {
      case 'High': return 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-900/20 dark:border-emerald-800';
      case 'Medium': return 'text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-900/20 dark:border-amber-800';
      case 'Low': return 'text-slate-600 bg-slate-50 border-slate-200 dark:text-slate-400 dark:bg-slate-800 dark:border-slate-700';
      default: return 'text-slate-600 bg-slate-50 border-slate-200 dark:text-slate-400 dark:bg-slate-800 dark:border-slate-700';
    }
  };

  const confidenceStyle = getConfidenceStyle(match.confidence);

  return (
    <div className={`${containerBg} rounded-lg border ${borderColor} p-4 shadow-sm mb-3 transition-colors`}>
      <div className="flex flex-wrap items-start justify-between mb-2 gap-2">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-md ${badgeColor} bg-opacity-20`}>
            <Layers className={`w-4 h-4 ${iconColor}`} />
          </div>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm md:text-base">
            {match.derivativeCategory}
          </h4>
        </div>
        
        <div className="flex items-center gap-2">
          {match.confidence && (
            <span className={`flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${confidenceStyle}`}>
              <BarChart3 className="w-3 h-3" />
              {match.confidence}
            </span>
          )}
          <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide ${badgeColor}`}>
            {match.metalType}
          </span>
        </div>
      </div>
      <div className="pl-9">
        <div 
          className={shouldTruncate ? "group cursor-pointer" : ""}
          onClick={shouldTruncate ? () => setIsExpanded(!isExpanded) : undefined}
        >
          <div className={`text-sm text-slate-600 dark:text-slate-400 leading-relaxed ${shouldTruncate && !isExpanded ? 'line-clamp-2' : ''}`}>
            <span className="font-semibold text-slate-900 dark:text-slate-200 mr-1">Detail:</span>
            <HighlightedDetail text={match.matchDetail} />
          </div>
          
          {shouldTruncate && (
            <div className="flex items-center gap-1 mt-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 opacity-80 group-hover:opacity-100 transition-opacity select-none">
              {isExpanded ? (
                <>Show Less <ChevronUp className="w-3 h-3" /></>
              ) : (
                <>Read More <ChevronDown className="w-3 h-3" /></>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AnalysisResultCard: React.FC<AnalysisResultCardProps> = ({ result, htsCode }) => {
  // Sort matches logic: High Confidence > Medium > Low, then Alphabetical
  const sortedMatches = React.useMemo(() => {
    if (!result.matches) return [];
    return [...result.matches].sort((a, b) => {
      const confidenceScores: Record<string, number> = { 'High': 3, 'Medium': 2, 'Low': 1 };
      const scoreA = confidenceScores[a.confidence] || 0;
      const scoreB = confidenceScores[b.confidence] || 0;
      
      // Sort by confidence descending
      if (scoreA !== scoreB) {
        return scoreB - scoreA;
      }
      
      // If confidence matches, sort by derivative category name ascending
      return a.derivativeCategory.localeCompare(b.derivativeCategory);
    });
  }, [result.matches]);

  // Case 1: Code was not found in the context of the document at all (explicit negative)
  if (!result.found) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 animate-fade-in transition-colors">
        <div className="flex items-start gap-4">
          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-full shrink-0">
            <AlertCircle className="w-6 h-6 text-slate-500 dark:text-slate-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              HTS Code {htsCode} - Not a Derivative
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              This code does not appear to fall under any monitored derivative category in the provided document.
            </p>
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg text-sm text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
              <span className="font-semibold block mb-1">Analysis Reasoning:</span>
              <HighlightedDetail text={result.reasoning} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Case 2: Code was found/recognized, but no specific derivative matches were listed (Valid code, not a derivative)
  if (result.found && result.matches.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-indigo-200 dark:border-indigo-800 p-6 animate-fade-in transition-colors">
        <div className="flex items-start gap-4">
          <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-full shrink-0">
            <FileCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              HTS Code {htsCode} - Valid (No Derivative Match)
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              No specific derivative matches found, but the HTS code is valid.
            </p>
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg text-sm text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
              <span className="font-semibold block mb-1">Analysis Reasoning:</span>
              <HighlightedDetail text={result.reasoning} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Case 3: Derivative matches found
  
  // Determine overall header color based on the first match or if mixed
  const hasAluminum = result.matches.some(m => m.metalType === MetalType.ALUMINUM || m.metalType === MetalType.BOTH);
  const hasSteel = result.matches.some(m => m.metalType === MetalType.STEEL || m.metalType === MetalType.BOTH);
  
  let headerColor = "bg-slate-700 dark:bg-slate-800";
  if (hasAluminum && !hasSteel) headerColor = "bg-blue-600 dark:bg-blue-700";
  else if (!hasAluminum && hasSteel) headerColor = "bg-orange-600 dark:bg-orange-700";
  else if (hasAluminum && hasSteel) headerColor = "bg-purple-600 dark:bg-purple-700";

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden animate-fade-in transition-colors">
      <div className={`${headerColor} px-6 py-4 flex items-center justify-between transition-colors`}>
        <div className="flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-white" />
          <div>
            <h3 className="text-xl font-bold text-white">Derivative Match Found</h3>
            <p className="text-white/80 text-xs font-medium">
              {result.matches.length} {result.matches.length === 1 ? 'category' : 'categories'} identified
            </p>
          </div>
        </div>
        <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
           HTS: {htsCode}
        </span>
      </div>
      
      <div className="p-6 bg-slate-50/50 dark:bg-slate-950/50">
        
        <div className="mb-6">
           <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 px-1">Detailed Matches</h4>
           <div className="space-y-1">
             {sortedMatches.map((match, idx) => (
               <MatchItem key={idx} match={match} index={idx} />
             ))}
           </div>
        </div>
        
        <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-lg p-4">
          <div className="flex gap-3 items-start">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-200 text-sm">Summary Analysis</h4>
              <p className="text-slate-700 dark:text-slate-300 text-sm mt-1 leading-relaxed">
                <HighlightedDetail text={result.reasoning} />
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AnalysisResultCard;