import React from 'react';
import { Shield, Hammer } from 'lucide-react';

const ReferenceInfo: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-6 mt-8 animate-fade-in">
      {/* Aluminum Section */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
        <div className="bg-slate-50 dark:bg-slate-800 px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
          <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-md text-blue-700 dark:text-blue-400">
             <Shield className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white">LIST OF ALUMINUM HTS SUBJECT TO SECTION 232</h3>
        </div>
        <div className="p-6 text-sm text-slate-600 dark:text-slate-300 space-y-4 leading-relaxed">
          <p className="font-semibold text-slate-800 dark:text-slate-200">
            Effective August 18, 2025.<br/>
            See 90 FR 11251, 90 FR 14786, 90 FR 24199 and updates to Annex I of the Harmonized Tariff Schedule of the United States for the authoritative list.
          </p>
          
          <div className="space-y-2">
            <p className="font-bold text-slate-800 dark:text-slate-200">9903.85.02/9903.85.12(UK): Aluminum products as specified in subdivision (g)/(o), except derivative articles</p>
            <ul className="list-none pl-4 space-y-1">
              <li>(i) unwrought aluminum provided for in heading 7601;</li>
              <li>(ii) bars, rods and profiles provided for in heading 7604;</li>
              <li>(iii) wire provided for in heading 7605;</li>
              <li>(iv) plates, sheets and strip provided for in 7606;</li>
              <li>(v) foil provided for in heading 7607;</li>
              <li>(vi) tubes, pipes and tube or pipe fittings provided for in heading 7608 and 7609; and</li>
              <li>(vii) castings and forgings of aluminum provided for in subheading 7616.99.51.</li>
            </ul>
          </div>

          <div className="space-y-2 pt-2">
            <p className="font-bold text-slate-800 dark:text-slate-200">9903.85.04/9903.85.13(UK): Derivative aluminum products listed in subdivision (i)/(q) (existing aluminum derivative articles subject to Section 232)</p>
            <ul className="list-none pl-4 space-y-2">
              <li>(A) stranded wire, cables, plaited bands and the like, including slings and similar articles, of aluminum and with steel core, not electrically insulated; the foregoing fitted with fittings or made up into articles (described in subheading 7614.10.50);</li>
              <li>(B) stranded wire, cables, plaited bands and the like, including slings and similar articles, of aluminum and not with steel core, not electrically insulated; the foregoing comprising electrical conductors, not fitted with fittings or made up into articles (described in subheading 7614.90.20);</li>
              <li>(C) stranded wire, cables, plaited bands and the like, including slings and similar articles, of aluminum and not with steel core, not electrically insulated; the foregoing not comprising electrical conductors, not fitted with fittings or made up into articles (described in subheading 7614.90.40);</li>
              <li>(D) stranded wire, cables, plaited bands and the like, including slings and similar articles, of aluminum and not with steel core, not electrically insulated; the foregoing fitted with fittings or made up into articles (described in subheading 7614.90.50);</li>
              <li>(E) bumper stampings of aluminum, the foregoing comprising parts and accessories of the motor vehicles of heading 8701 to 8705 (described in subheading 8708.10.30); and</li>
              <li>(F) body stampings of aluminum, for tractors suitable for agricultural use (described in subheading 8708.29.21).</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Steel Section */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
        <div className="bg-slate-50 dark:bg-slate-800 px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
          <div className="p-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-md text-orange-700 dark:text-orange-400">
             <Hammer className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white">LIST OF STEEL HTS SUBJECT TO SECTION 232</h3>
        </div>
        <div className="p-6 text-sm text-slate-600 dark:text-slate-300 space-y-4 leading-relaxed">
          <p className="font-semibold text-slate-800 dark:text-slate-200">
             Effective August 18, 2025.<br/>
             See 90 FR 11249, 90 FR 24199, 90 FR 25208 and updates to Annex I of the Harmonized Tariff Schedule of the United States for the authoritative list.
          </p>

          <div className="space-y-2">
             <p className="font-bold text-slate-800 dark:text-slate-200">9903.81.87/9903.81.94 (UK): Iron or steel products listed in subdivision (j)/(q) (except derivative articles)</p>
             <ul className="list-none pl-4 space-y-1">
                <li>(i) flat-rolled products provided for in headings 7208, 7209, 7210, 7211, 7212, 7225 or 7226;</li>
                <li>(ii) bars and rods provided for in headings 7213, 7214, 7215, 7227, or 7228; angles, shapes and sections of 7216 (except subheadings 7216.61.00, 7216.69.00 or 7216.91.00); wire provided for in headings 7217 or 7229; sheet piling provided for in subheading 7301.10.00; rails provided for in subheading 7302.10; fish-plates and sole plates provided for in subheading 7302.40.00; and other products of iron or steel provided for in subheading 7302.90;</li>
                <li>(iii) tubes, pipes and hollow profiles provided for in heading 7304 or 7306; tubes and pipes provided for in heading 7305;</li>
                <li>(iv) ingots, other primary forms and semi-finished products provided for in headings 7206, 7207 or 7224; and</li>
                <li>(v) products of stainless steel provided for in headings 7218, 7219, 7220, 7221, 7222 or 7223.</li>
             </ul>
          </div>

          <div className="space-y-2 pt-2">
             <p className="font-bold text-slate-800 dark:text-slate-200">9903.81.88/9903.81.95 (UK): Iron or steel products, listed in subdivision (j)/(q)</p>
             <ul className="list-none pl-4 space-y-1">
                <li>(i) flat-rolled products provided for in headings 7208, 7209, 7210, 7211, 7212, 7225 or 7226;</li>
                <li>(ii) bars and rods provided for in headings 7213, 7214, 7215, 7227, or 7228; angles, shapes and sections of 7216 (except subheadings 7216.61.00, 7216.69.00 or 7216.91.00); wire provided for in headings 7217 or 7229; sheet piling provided for in subheading 7301.10.00; rails provided for in subheading 7302.10; fish-plates and sole plates provided for in subheading 7302.40.00; and other products of iron or steel provided for in subheading 7302.90;</li>
                <li>(iii) tubes, pipes and hollow profiles provided for in heading 7304 or 7306; tubes and pipes provided for in heading 7305;</li>
                <li>(iv) ingots, other primary forms and semi-finished products provided for in headings 7206, 7207 or 7224; and</li>
                <li>(v) products of stainless steel provided for in headings 7218, 7219, 7220, 7221, 7222 or 7223.</li>
             </ul>
          </div>

          <div className="space-y-2 pt-2">
             <p className="font-bold text-slate-800 dark:text-slate-200">9903.81.89/9903.81.96 (UK): Derivative iron or steel products listed in subdivision (l) /(s) (existing steel derivative articles subject to Section 232)</p>
             <ul className="list-none pl-4 space-y-2">
                <li>(A) nails, tacks (other than thumb tacks), drawing pins, corrugated nails, staples (other than those of heading 8305) and similar articles, of iron or steel, whether or not with heads of other material (excluding such articles with heads of copper), suitable for use in powder-actuated hand tools, threaded (described in subheading 7317.00.30)</li>
                <li>(B) nails, tacks (other than thumb tacks), drawing pins, corrugated nails, staples (other than those of heading 8305) and similar articles, of iron or steel, whether or not with heads of other material (excluding such articles with heads of copper), of one piece construction, whether or not made of round wire; the foregoing described in statistical reporting numbers 7317.00.5503, 7317.00.5505, 7317.00.5507, 7317.00.5560, 7317.00.5580 or 7317.00.6560 only and not in other statistical reporting numbers of subheadings 7317.00.55 and 7317.00.65</li>
                <li>(C) bumper stampings of steel, the foregoing comprising parts and accessories of the motor vehicles of headings 8701 to 8705 (described in subheading 8708.10.30); and</li>
                <li>(D) body stampings of steel, for tractors suitable for agricultural use (described in subheading 8708.29.21).</li>
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferenceInfo;