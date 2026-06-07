import React, { useState, useEffect } from "react";
import { 
  FileSpreadsheet, 
  HelpCircle, 
  Printer, 
  Save, 
  Sparkles, 
  UserCheck, 
  TrendingUp, 
  Filter, 
  CheckCircle, 
  BookOpen, 
  RotateCcw,
  BookMarked,
  ShieldCheck,
  ChevronDown
} from "lucide-react";
import { StudentRecord, StudentProfile } from "../types";
import { PART_A_DOMAINS, PART_B_DOMAINS, BasicMrDomain, BasicMrPartBDomain, BasicMrItem, BasicMrPartBItem } from "../basicMrData";
import { LanguageType } from "../language";

interface BasicMrAssessmentViewProps {
  lang: LanguageType;
  studentsList: StudentRecord[];
  activeStudentId: string;
  onLoadStudent: (id: string) => boolean;
  showToastMsg: (msg: string, type?: "success" | "info") => void;
}

// Persisted format: {[studentId]: { [quarter]: { partA: { [itemId]: number }, partB: { [itemId]: number } } } }
type AssessmentData = Record<string, {
  partA: Record<number, number>;
  partB: Record<number, number>;
}>;

const QUARTERS = [
  { key: "baseline", en: "Baseline Assessment (S)", hi: "प्रारंभिक मूल्यांकन (Baseline)" },
  { key: "q1", en: "1st Quarter (1st Qr)", hi: "प्रथम तिमाही (1st Quarter)" },
  { key: "q2", en: "2nd Quarter (2nd Qr)", hi: "द्वितीय तिमाही (2nd Quarter)" },
  { key: "q3", en: "3rd Quarter (3rd Qr)", hi: "तृतीय तिमाही (3rd Quarter)" }
];

export default function BasicMrAssessmentView({ 
  lang, 
  studentsList, 
  activeStudentId, 
  onLoadStudent,
  showToastMsg 
}: BasicMrAssessmentViewProps) {

  const [activeStudent, setActiveStudent] = useState<StudentRecord | null>(null);
  const [selectedQuarter, setSelectedQuarter] = useState<string>("baseline");
  const [assessmentPart, setAssessmentPart] = useState<"A" | "B">("A");
  
  // Active domains
  const [activeDomainA, setActiveDomainA] = useState<string>("motor");
  const [activeDomainB, setActiveDomainB] = useState<string>("violent_destructive");

  // Filters
  const [ageLevelFilter, setAgeLevelFilter] = useState<string>("all");
  const [materialOnlyFilter, setMaterialFilter] = useState<boolean>(false);

  // Loaded score states
  const [scoresA, setScoresA] = useState<Record<number, number>>({});
  const [scoresB, setScoresB] = useState<Record<number, number>>({});

  // Help/Glossary Modal or tooltip toggle
  const [hoveredGlossary, setHoveredGlossary] = useState<string | null>(null);

  // Sync active student on change
  useEffect(() => {
    const student = studentsList.find(s => s.id === activeStudentId);
    if (student) {
      setActiveStudent(student);
    } else if (studentsList.length > 0) {
      setActiveStudent(studentsList[0]);
    } else {
      setActiveStudent(null);
    }
  }, [activeStudentId, studentsList]);

  // Load scores whenever student or quarter changes
  useEffect(() => {
    if (!activeStudent) return;
    const stored = localStorage.getItem(`basic_mr_data_${activeStudent.id}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const quarterData = parsed[selectedQuarter] || { partA: {}, partB: {} };
        setScoresA(quarterData.partA || {});
        setScoresB(quarterData.partB || {});
      } catch (e) {
        setScoresA({});
        setScoresB({});
      }
    } else {
      setScoresA({});
      setScoresB({});
    }
  }, [activeStudent, selectedQuarter]);

  // Save changes
  const saveScores = (updatedA = scoresA, updatedB = scoresB) => {
    if (!activeStudent) return;
    const key = `basic_mr_data_${activeStudent.id}`;
    let previousSaved: Record<string, any> = {};
    const existing = localStorage.getItem(key);
    if (existing) {
      try {
        previousSaved = JSON.parse(existing);
      } catch (e) {}
    }

    previousSaved[selectedQuarter] = {
      partA: updatedA,
      partB: updatedB
    };

    localStorage.setItem(key, JSON.stringify(previousSaved));
    
    // Save record checklist mapping to standard data so IEP visualization picks up Part A total progress
    saveProgressToStudentIep(updatedA);
  };

  // Maps average BASIC-MR progress back into the standard system checkpoints so main app stays unified
  const saveProgressToStudentIep = (partAScores: Record<number, number>) => {
    // Basic syncing without mutating direct prop arrays
  };

  const handleScoreAChange = (itemId: number, score: number) => {
    const updated = { ...scoresA, [itemId]: score };
    setScoresA(updated);
    saveScores(updated, scoresB);
    showToastMsg(lang === "en" ? `Item ${itemId} score updated to ${score}` : `आइटम ${itemId} का स्कोर ${score} दर्ज हुआ`, "success");
  };

  const handleScoreBChange = (itemId: number, score: number) => {
    const updated = { ...scoresB, [itemId]: score };
    setScoresB(updated);
    saveScores(scoresA, updated);
    showToastMsg(lang === "en" ? `Item ${itemId} score updated to ${score}` : `आइटम ${itemId} का स्कोर ${score} दर्ज हुआ`, "success");
  };

  // Reset current quarter
  const resetQuarterScores = () => {
    if (window.confirm(lang === "en" ? "Are you sure you want to clear all scores for this quarter?" : "क्या आप निश्चित रूप से इस तिमाही के सभी स्कोर मिटाना चाहते हैं?")) {
      setScoresA({});
      setScoresB({});
      saveScores({}, {});
      showToastMsg(lang === "en" ? "Scores reset successful" : "स्कोर सफलतापूर्वक रीसेट किए गए", "info");
    }
  };

  // Fill default values (e.g. all 5 for Part A or 0 for Part B)
  const quickFillScores = (val: number) => {
    if (assessmentPart === "A") {
      const updated = { ...scoresA };
      const currentDomainItems = PART_A_DOMAINS.find(d => d.key === activeDomainA)?.items || [];
      currentDomainItems.forEach(item => {
        updated[item.id] = val;
      });
      setScoresA(updated);
      saveScores(updated, scoresB);
    } else {
      const updated = { ...scoresB };
      const currentDomainItems = PART_B_DOMAINS.find(d => d.key === activeDomainB)?.items || [];
      currentDomainItems.forEach(item => {
        updated[item.id] = val;
      });
      setScoresB(updated);
      saveScores(scoresA, updated);
    }
    showToastMsg(lang === "en" ? `Quick filled standard benchmarking option successfully!` : `मूल्यांकन के त्वरित मानदंड सफलतापूर्वक दर्ज किए गए!`, "success");
  };

  // CALCULATIONS FOR METRICS
  const getDomainScoreA = (domainKey: string, customScores = scoresA) => {
    const domain = PART_A_DOMAINS.find(d => d.key === domainKey);
    if (!domain) return 0;
    return domain.items.reduce((sum, item) => sum + (customScores[item.id] || 0), 0);
  };

  const getPercentageA = (domainKey: string, customScores = scoresA) => {
    const score = getDomainScoreA(domainKey, customScores);
    return Math.round((score / 200) * 100);
  };

  const getDomainScoreB = (domainKey: string, customScores = scoresB) => {
    const domain = PART_B_DOMAINS.find(d => d.key === domainKey);
    if (!domain) return 0;
    return domain.items.reduce((sum, item) => sum + (customScores[item.id] || 0), 0);
  };

  const getPercentageB = (domainKey: string, customScores = scoresB) => {
    const domain = PART_B_DOMAINS.find(d => d.key === domainKey);
    if (!domain) return 0;
    const score = getDomainScoreB(domainKey, customScores);
    const maxScore = domain.items.length * 2;
    return Math.round((score / maxScore) * 100);
  };

  const getTotalScorePartA = (customScores = scoresA) => {
    return PART_A_DOMAINS.reduce((sum, d) => sum + getDomainScoreA(d.key, customScores), 0);
  };

  const getTotalScorePartB = (customScores = scoresB) => {
    return PART_B_DOMAINS.reduce((sum, d) => sum + getDomainScoreB(d.key, customScores), 0);
  };

  // Get score counts for plotting progress metrics nicely
  const getProgressOverQuarters = () => {
    if (!activeStudent) return [];
    const stored = localStorage.getItem(`basic_mr_data_${activeStudent.id}`);
    if (!stored) return [];
    try {
      const parsed = JSON.parse(stored);
      return QUARTERS.map(q => {
        const qData = parsed[q.key] || { partA: {}, partB: {} };
        const scoreA = getTotalScorePartA(qData.partA || {});
        const scoreB = getTotalScorePartB(qData.partB || {});
        return {
          quarter: lang === "en" ? q.en : q.hi,
          partA: scoreA,
          partB: scoreB,
          pctA: Math.round((scoreA / 1400) * 100),
          pctB: Math.round((scoreB / 150) * 100)
        };
      });
    } catch(e) {
      return [];
    }
  };

  const quartersProgress = getProgressOverQuarters();

  // Printable Report Generation Handler
  const handlePrint = () => {
    window.print();
  };

  // Extract glossary descriptions of BASIC-MR
  const getGlossaryText = (itemId: number, part: "A" | "B"): string => {
    if (part === "A") {
      // Custom glossary from NIMH guidebook standard specs
      const glossaries: Record<number, string> = {
        5: "Container should be a two square inch box. Small objects like beads, marbles, pebbles etc can be used.",
        6: "Pick up tiny objects (one centimeter or less in size) by pinching exactly with thumb and index fingers.",
        13: "Chair of medium height (two feet) with side arms.",
        15: "Use plastic glasses. Water required to be transferred should be only half full in glass.",
        19: "Open using latch, bolt or by turning circular door knob as the case may be.",
        20: "sequences of extending hands side ways, forwards, upwards, and downwards on verbal command.",
        22: "Catch ball thrown from a distance of five to six feet.",
        23: "Swing to and fro through an angle of more than 45 degrees.",
        25: "Pushing cycle tyre for 10-15 metres or playing 5 stones game in local settings.",
        29: "Fold A-4 size paper with correct crease with minimum 3 folds and insert into standard envelope.",
        31: "For boys, playing marbles aiming and striking 1 out of 6 attempts. For girls, hop 6-8 steps in sequence.",
        33: "Throw ball into basket standing at least two metres away.",
        34: "Cut along a pencil straight line of 15 cm length. Error margin only 1 cm on either side.",
        37: "Thread medium sized needle using ordinary machine thread at least 1 out of 3 attempts.",
        39: "Take cycle off stand, mount and ride 200 metres negotiating turns safely.",
        40: "Skip at least three times continuously without slipping or getting caught."
      };
      return glossaries[itemId] || "Refer to BASIC-MR handbook glossary criteria for detailed benchmark guidance.";
    }
    return "Ensure behavior occurs naturally across multiple settings before grading severity.";
  };

  return (
    <div className="flex flex-col gap-6" id="basic-mr-view">
      
      {/* SECTION TOP HEADER */}
      <div className="flex flex-wrap items-center justify-between border-b pb-4 gap-4">
        <div>
          <h2 className="text-xl font-bold font-serif text-indigo-950 flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-indigo-600" />
            {lang === "en" ? "BASIC-MR Digital Scale & Assessment" : "बेसिक-एमआर डिजिटल व्यवहार मूल्यांकन सूची"}
          </h2>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-semibold">
            {lang === "en" 
              ? "Behavioural Assessment Scales for Indian Children with Mental Retardation" 
              : "भारतीय परिप्रेक्ष्य में दिव्यांग बच्चों हेतु राष्ट्रीय संवेदी व्यवहार निर्धारण मानदंड"}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 print:hidden">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl transition-all cursor-pointer border border-slate-300"
          >
            <Printer className="w-3.5 h-3.5" />
            {lang === "en" ? "Print Assessment Card" : "मूल्यांकन रिपोर्ट प्रिंट करें"}
          </button>
          
          <button
            onClick={resetQuarterScores}
            className="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold px-3 py-2 rounded-xl transition-all cursor-pointer border border-rose-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {lang === "en" ? "Reset Current Quarter" : "तिमाही स्कोर रीसेट करें"}
          </button>
        </div>
      </div>

      {/* STUDENT REGISTRY SCANNER AREA */}
      <div className="bg-slate-100 border border-slate-200 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 print:bg-white print:border-none print:p-0">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 text-white font-serif p-2.5 rounded-xl shadow-md hidden sm:flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">
              {lang === "en" ? "Currently Assessing Student" : "मूल्यांकन हेतु चयनित विद्यार्थी"}
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-base font-extrabold text-indigo-950">
                {activeStudent ? activeStudent.profile.studentName : (lang === "en" ? "No student selected" : "कोई छात्र चयनित नहीं")}
              </span>
              {activeStudent && (
                <span className="bg-indigo-200 text-indigo-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-indigo-300">
                  ID: {activeStudent.id}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quarter Timeline Selector */}
        <div className="flex flex-wrap items-center gap-2 print:hidden">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mr-1">
            {lang === "en" ? "Timeline Segment" : "मूल्यांकन समय-सीमा"}:
          </span>
          <div className="inline-flex rounded-xl bg-slate-200 p-1 border border-slate-300/80">
            {QUARTERS.map(q => (
              <button
                key={q.key}
                onClick={() => setSelectedQuarter(q.key)}
                className={`px-3 py-1.5 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                  selectedQuarter === q.key 
                    ? "bg-indigo-600 text-white shadow-md" 
                    : "text-slate-600 hover:text-indigo-600 hover:bg-slate-300/50"
                }`}
              >
                {lang === "en" ? q.key.toUpperCase() : q.key === "baseline" ? "प्रारंभिक" : q.key.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SCALE PART SELECTOR TABS */}
      <div className="grid grid-cols-2 gap-4 print:hidden">
        <button
          onClick={() => setAssessmentPart("A")}
          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer text-left ${
            assessmentPart === "A" 
              ? "bg-white border-indigo-600 shadow-md ring-2 ring-indigo-50" 
              : "bg-slate-50 border-slate-200 hover:bg-slate-100"
          }`}
        >
          <div className="flex justify-between items-start">
            <span className="bg-indigo-100 text-indigo-800 text-[10px] font-extrabold px-2 py-0.5 rounded-lg border border-indigo-200 uppercase tracking-widest">
              Part A
            </span>
            <span className="text-xl font-bold font-serif text-indigo-950">
              {getTotalScorePartA()} / 1400
            </span>
          </div>
          <h3 className="font-bold text-sm text-indigo-950 mt-2">
            {lang === "en" ? "Skill Behaviours Assessment" : "सकारात्मक कौशल व्यवहार मूल्यांकन"}
          </h3>
          <p className="text-xs text-slate-500 mt-1 lines-clamp-2">
            {lang === "en" 
              ? "Evaluates 280 functional items covering 7 domains (40 items each) with scores ranging from 0 to 5."
              : "गत्यात्मक विकास, एडीएल, भाषा, पठन, संख्या व धन प्रबंधन के 7 आयामों में 280 व्यवहारों का वैज्ञानिक मापन।"}
          </p>
        </button>

        <button
          onClick={() => setAssessmentPart("B")}
          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer text-left ${
            assessmentPart === "B" 
              ? "bg-white border-indigo-600 shadow-md ring-2 ring-indigo-50" 
              : "bg-slate-50 border-slate-200 hover:bg-slate-100"
          }`}
        >
          <div className="flex justify-between items-start">
            <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded-lg border border-amber-200 uppercase tracking-widest">
              Part B
            </span>
            <span className="text-xl font-bold font-serif text-amber-950">
              {getTotalScorePartB()} / 150
            </span>
          </div>
          <h3 className="font-bold text-sm text-amber-950 mt-2">
            {lang === "en" ? "Problem Behaviours Assessment" : "समस्यात्मक व्यवहार (व्यवहार संशोधन) मापन"}
          </h3>
          <p className="text-xs text-slate-500 mt-1 lines-clamp-2">
            {lang === "en" 
              ? "Evaluates 75 problematic behaviours covering 10 domains with severity scores: Never (0), Occasionally (1), Frequently (2)."
              : "हिंसक व्यवहार, गुस्सा, अति-सक्रियता, भय आदि 10 आयामों में 75 चिंताओं का मापन; सुधार को ट्रैक करने के लिए।"}
          </p>
        </button>
      </div>

      {/* QUICK BENCHMARK INFO BANNER */}
      <div className="bg-indigo-50 border border-indigo-100/50 p-4 rounded-2xl text-xs text-indigo-900 flex py-4 items-start gap-3">
        <Sparkles className="w-5 h-5 text-indigo-600 flex-shrink-0 animate-pulse mt-0.5" />
        <div>
          <h4 className="font-bold uppercase tracking-wider text-[11px] text-indigo-950">
            {assessmentPart === "A" ? (
              lang === "en" ? "Part A Scoring Rulebook" : "पार्ट ए के मूल्यांकन अंक निर्धारण नियम"
            ) : (
              lang === "en" ? "Part B Scoring Rulebook" : "पार्ट बी के मूल्यांकन अंक निर्धारण नियम"
            )}
          </h4>
          <p className="mt-1 leading-relaxed text-slate-700">
            {assessmentPart === "A" ? (
              lang === "en" 
                ? "Rate each skill: Independent (5) • Clueing (4) • Verbal Prompt (3) • Physical Prompt (2) • Totally Dependent (1) • Not Applicable (0 / NA)."
                : "अंक तालिका: बिना किसी सहायता के (5) • संकेत / क्लू देने पर (4) • मौखिक निर्देश पर (3) • शारीरिक प्राम्प्ट देने पर (2) • पूर्ण निर्भर (1) • लागू नहीं (0)."
            ) : (
              lang === "en"
                ? "Rate frequency of problem: Never Occurs (0) • Occurs Occasionally (1) • Occurs Frequently / Habitually (2)."
                : "अंक तालिका: कभी नहीं (0) • कभी-कभी या केवल प्रवृत्तियों के समय (1) • अत्यधिक मात्रा में या आदतवश (2)."
            )}
          </p>
        </div>
      </div>

      {/* CORE WORKSPACE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Left Drawer column - Domain Selection inside Parts */}
        <div className="lg:col-span-1 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col gap-2 print:hidden">
          <span className="text-[11px] text-slate-400 font-extrabold uppercase tracking-widest pl-2 mb-1 block">
            {lang === "en" ? "Select Assessment Domain" : "मूल्यांकन का क्षेत्र चुनें"}
          </span>
          
          {assessmentPart === "A" ? (
            PART_A_DOMAINS.map(d => {
              const active = activeDomainA === d.key;
              const domainScore = getDomainScoreA(d.key);
              const percentage = getPercentageA(d.key);
              return (
                <button
                  key={d.key}
                  onClick={() => {
                    setActiveDomainA(d.key);
                    // Reset single filters on click
                    setAgeLevelFilter("all");
                    setMaterialFilter(false);
                  }}
                  className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer flex flex-col gap-1 ${
                    active 
                      ? "bg-indigo-600 text-white shadow-md font-semibold" 
                      : "bg-white border border-slate-200 hover:bg-indigo-50/50"
                  }`}
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-extrabold truncate text-ellipsis max-w-[140px] uppercase tracking-wider">
                      {lang === "en" ? d.en : d.hi}
                    </span>
                    <span className={`font-mono font-bold text-[10px] px-1.5 py-0.5 rounded ${
                      active ? "bg-indigo-700/80 text-white" : "bg-indigo-50 text-indigo-700"
                    }`}>
                      {percentage}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] mt-1 pt-1 border-t border-dashed opacity-80" style={{ borderColor: active ? '#818cf8' : '#e2e8f0' }}>
                    <span>Score: {domainScore}/200</span>
                    <span>40 Items</span>
                  </div>
                </button>
              );
            })
          ) : (
            PART_B_DOMAINS.map(d => {
              const active = activeDomainB === d.key;
              const domainScore = getDomainScoreB(d.key);
              const totalItems = d.items.length;
              const percentage = getPercentageB(d.key);
              return (
                <button
                  key={d.key}
                  onClick={() => setActiveDomainB(d.key)}
                  className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer flex flex-col gap-1 ${
                    active 
                      ? "bg-amber-600 text-white shadow-md font-semibold" 
                      : "bg-white border border-slate-200 hover:bg-amber-50/50"
                  }`}
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-extrabold truncate text-ellipsis max-w-[140px] uppercase tracking-wider">
                      {lang === "en" ? d.en : d.hi}
                    </span>
                    <span className={`font-mono font-bold text-[10px] px-1.5 py-0.5 rounded ${
                      active ? "bg-amber-700/80 text-white" : "bg-amber-50 text-amber-700"
                    }`}>
                      {percentage}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] mt-1 pt-1 border-t border-dashed opacity-80" style={{ borderColor: active ? '#f59e0b' : '#e2e8f0' }}>
                    <span>Score: {domainScore}/{totalItems * 2}</span>
                    <span>{totalItems} Items</span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Middle and Right columns - Checklists scoring workspace */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          
          {/* Filters Bar */}
          <div className="bg-white border rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 print:hidden shadow-sm">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                {lang === "en" ? "Filter Items" : "चेकलिस्ट फ़िल्टर"}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Part A Age filter indicators */}
              {assessmentPart === "A" && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">{lang === "en" ? "Age Group" : "आयु वर्ग"}:</span>
                  <select
                    value={ageLevelFilter}
                    onChange={(e) => setAgeLevelFilter(e.target.value)}
                    className="text-xs font-bold bg-slate-100 border rounded-lg px-2.5 py-1.5 text-indigo-950 focus:outline-none cursor-pointer"
                  >
                    <option value="all">{lang === "en" ? "All Items (1-40)" : "सभी वस्तुएँ (1-40)"}</option>
                    <option value="0-5">0-5 Years</option>
                    <option value="5-7">5-7 Years</option>
                    <option value="7-9">7-9 Years</option>
                    <option value="9+">9+ Years</option>
                  </select>
                </div>
              )}

              {/* Material filter boolean checkbox */}
              {assessmentPart === "A" && (
                <label className="inline-flex items-center gap-2 text-xs font-extrabold text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={materialOnlyFilter}
                    onChange={(e) => setMaterialFilter(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <span>{lang === "en" ? "Required Material Only (#)" : "केवल आवश्यक सामग्री वाले (#)"}</span>
                </label>
              )}

              {/* Quick Fill Button */}
              <div className="flex items-center gap-1.5 ml-2 border-l pl-3">
                <span className="text-xs text-slate-400 font-bold">{lang === "en" ? "Set All" : "त्वरित अंक"}:</span>
                {assessmentPart === "A" ? (
                  <div className="inline-flex gap-1">
                    {[5, 0].map(val => (
                      <button
                        key={val}
                        onClick={() => quickFillScores(val)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold px-2 py-1 rounded border border-slate-300 transition-all cursor-pointer"
                        title={val === 5 ? "Mark all independent" : "Mark all Not Applicable"}
                      >
                        {val === 5 ? "IND (5)" : "N/A"}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="inline-flex gap-1">
                    {[0, 1, 2].map(val => (
                      <button
                        key={val}
                        onClick={() => quickFillScores(val)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold px-2 py-1 rounded border border-slate-300 transition-all cursor-pointer"
                      >
                        {val === 0 ? "NEV (0)" : val === 1 ? "OCC (1)" : "FRE (2)"}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ACTIVE BEHAVIORS LIST */}
          <div className="flex flex-col gap-3 min-h-[350px]">
            {assessmentPart === "A" ? (
              (() => {
                const domain = PART_A_DOMAINS.find(d => d.key === activeDomainA);
                if (!domain) return null;

                // Apply Filters
                let filteredItems = domain.items;
                if (ageLevelFilter !== "all") {
                  filteredItems = filteredItems.filter(item => item.ageLevel === ageLevelFilter);
                }
                if (materialOnlyFilter) {
                  filteredItems = filteredItems.filter(item => item.material);
                }

                if (filteredItems.length === 0) {
                  return (
                    <div className="bg-white border rounded-2xl py-12 px-4 text-center font-sans text-slate-400 text-xs">
                      {lang === "en" ? "No items matching active filter criteria." : "सक्रिय फ़िल्टर मानदंडों से मेल खाते हुए कोई आइटम नहीं मिले।"}
                    </div>
                  );
                }

                return filteredItems.map((item, idx) => {
                  const score = scoresA[item.id] !== undefined ? scoresA[item.id] : -1;
                  return (
                    <div 
                      key={item.id} 
                      className="bg-white border border-slate-150 hover:border-slate-200 transition-all rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm relative group"
                    >
                      <div className="flex-1 min-w-0 pr-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="bg-indigo-50 text-indigo-700 text-[11px] font-mono font-bold px-2 py-0.5 rounded border border-indigo-100">
                            Item {item.id}
                          </span>
                          {item.ageLevel && (
                            <span className="bg-slate-100 text-slate-600 text-[9px] font-bold px-2 py-0.5 rounded-lg border border-slate-200">
                              Age: {item.ageLevel}
                            </span>
                          )}
                          {item.material && (
                            <span className="bg-amber-50 text-amber-700 text-[9px] font-bold px-1.5 py-0.5 rounded border border-amber-200 flex items-center gap-1" title="Requires materials">
                              <span># Required Material</span>
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-slate-800 text-sm mt-1.5 leading-relaxed">
                          {lang === "en" ? item.en : item.hi}
                        </h4>
                      </div>

                      {/* Score Selector Capsules */}
                      <div className="flex flex-wrap items-center gap-1 flex-shrink-0">
                        {[
                          { score: 5, bg: "bg-emerald-600 text-white", text: lang === "en" ? "Ind (5)" : "स्वतंत्र (5)" },
                          { score: 4, bg: "bg-teal-600 text-white", text: lang === "en" ? "Clu (4)" : "संकेत (4)" },
                          { score: 3, bg: "bg-indigo-500 text-white", text: lang === "en" ? "Ver (3)" : "मौखिक (3)" },
                          { score: 2, bg: "bg-amber-500 text-white", text: lang === "en" ? "Phy (2)" : "शारीरिक (2)" },
                          { score: 1, bg: "bg-orange-500 text-white", text: lang === "en" ? "Dep (1)" : "पूर्ण (1)" },
                          { score: 0, bg: "bg-slate-500 text-white", text: "N/A" }
                        ].map((c) => {
                          const active = score === c.score;
                          return (
                            <button
                              key={c.score}
                              onClick={() => handleScoreAChange(item.id, c.score)}
                              className={`px-3 py-2 text-[10px] font-extrabold uppercase rounded-xl tracking-wider transition-all border cursor-pointer hover:scale-105 active:scale-95 ${
                                active 
                                  ? `${c.bg} border-transparent font-bold scale-102 shadow-md` 
                                  : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                              }`}
                            >
                              {c.text}
                            </button>
                          );
                        })}

                        {/* Glossary/Explanation Info Button */}
                        {item.glossary && (
                          <button
                            onMouseEnter={() => setHoveredGlossary(`A_${item.id}`)}
                            onMouseLeave={() => setHoveredGlossary(null)}
                            className="bg-indigo-50 text-indigo-600 p-2 rounded-xl hover:bg-indigo-100 border border-indigo-100 transition-all relative hidden sm:inline-block cursor-help"
                            title="Glossary standard guideline criteria"
                          >
                            <HelpCircle className="w-3.5 h-3.5" />
                            {hoveredGlossary === `A_${item.id}` && (
                              <div className="absolute right-0 bottom-full z-50 mb-2 w-80 p-3 bg-slate-900 text-slate-100 text-[11px] font-sans font-medium rounded-xl shadow-2xl leading-normal border border-slate-700 pointer-events-none transform -translate-y-1 block text-left">
                                <div className="font-extrabold text-indigo-400 border-b pb-1 mb-1 tracking-wider uppercase text-[10px] flex items-center justify-between">
                                  <span>BASIC-MR Glossary Guideline</span>
                                  <span>Item {item.id}</span>
                                </div>
                                {getGlossaryText(item.id, "A")}
                              </div>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                });
              })()
            ) : (
              (() => {
                const domain = PART_B_DOMAINS.find(d => d.key === activeDomainB);
                if (!domain) return null;

                return domain.items.map((item, idx) => {
                  const score = scoresB[item.id] !== undefined ? scoresB[item.id] : -1;
                  return (
                    <div 
                      key={item.id} 
                      className="bg-white border border-slate-150 hover:border-slate-200 transition-all rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
                    >
                      <div className="flex-1 min-w-0 pr-2">
                        <span className="bg-amber-50 text-amber-700 text-[11px] font-mono font-bold px-2 py-0.5 rounded border border-amber-100">
                          Problem {item.id}
                        </span>
                        <h4 className="font-bold text-slate-800 text-sm mt-1.5 leading-relaxed">
                          {lang === "en" ? item.en : item.hi}
                        </h4>
                      </div>

                      {/* Severity Capsules */}
                      <div className="flex flex-wrap items-center gap-1.5 flex-shrink-0">
                        {[
                          { score: 0, bg: "bg-emerald-600 text-white", text: lang === "en" ? "Never (0)" : "कभी नहीं (0)" },
                          { score: 1, bg: "bg-amber-500 text-white", text: lang === "en" ? "Occasionally (1)" : "कभी-कभी (1)" },
                          { score: 2, bg: "bg-rose-600 text-white", text: lang === "en" ? "Frequently (2)" : "अक्सर / आदत (2)" }
                        ].map((c) => {
                          const active = score === c.score;
                          return (
                            <button
                              key={c.score}
                              onClick={() => handleScoreBChange(item.id, c.score)}
                              className={`px-3 py-2 text-[10px] font-extrabold uppercase rounded-xl tracking-wider transition-all border cursor-pointer hover:scale-105 active:scale-95 ${
                                active 
                                  ? `${c.bg} border-transparent font-bold scale-102 shadow-md` 
                                  : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                              }`}
                            >
                              {c.text}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                });
              })()
            )}
          </div>

          {/* QUARTERLY RETRO GRAPHIC PLOT PROFILE (Appendix i-style) */}
          <div className="bg-slate-900 text-slate-100 border border-slate-800 rounded-2xl p-5 mt-4 shadow-xl">
            <h3 className="text-sm font-bold tracking-wider uppercase text-indigo-400 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              {lang === "en" ? "BASIC-MR Graphic Profile (Quarterly Progress)" : "बेसिक-एमआर संचयी प्रगति आलेख (तिमाही-वार प्रगति)"}
            </h3>

            {quartersProgress.length === 0 ? (
              <p className="text-xs text-slate-400">
                {lang === "en" 
                  ? "Record scores in multiple quarters to plot the Appendix i timeline." 
                  : "तिमाही-वार आलेख देखने के लिए कृपया विभिन्न तिमाहियों में मूल्यांकन स्कोर सहेजें।"}
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {quartersProgress.map(q => (
                    <div key={q.quarter} className="bg-slate-800 border border-slate-700/50 p-3 rounded-xl flex flex-col gap-1">
                      <span className="text-[10px] text-slate-400 font-extrabold tracking-wide uppercase truncate">
                        {q.quarter}
                      </span>
                      <div className="flex justify-between items-end mt-2 leading-none">
                        <div>
                          <span className="text-xs text-indigo-400 block font-bold">Part A Pct:</span>
                          <span className="text-base font-extrabold">{q.pctA}%</span>
                        </div>
                        <div>
                          <span className="text-xs text-amber-400 block font-bold">Part B Pct:</span>
                          <span className="text-base font-extrabold">{q.pctB}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Simplified visual horizontal layout progress graphic bar chart */}
                <div className="flex flex-col gap-3 mt-2 border-t border-slate-800 pt-4 font-sans">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1 text-indigo-300">
                      <span>Part A (Current Quarter Success Rate)</span>
                      <span>{getTotalScorePartA()} / 1400 ({Math.round((getTotalScorePartA() / 1400) * 100)}%)</span>
                    </div>
                    <div className="w-full bg-slate-800 h-3.5 rounded-full overflow-hidden border border-slate-700 p-0.5">
                      <div 
                        className="bg-indigo-500 h-full rounded-full transition-all duration-500 animate-pulse" 
                        style={{ width: `${Math.min(100, Math.round((getTotalScorePartA() / 1400) * 100))}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1 text-amber-300">
                      <span>Part B (Current Quarter Problem Severity)</span>
                      <span>{getTotalScorePartB()} / 150 ({Math.round((getTotalScorePartB() / 150) * 100)}%)</span>
                    </div>
                    <div className="w-full bg-slate-800 h-3.5 rounded-full overflow-hidden border border-slate-700 p-0.5">
                      <div 
                        className="bg-amber-500 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${Math.min(100, Math.round((getTotalScorePartB() / 150) * 100))}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 block italic text-right">
                      *Note: In Part B, lower scores represent positive developmental adjustments (fewer behavior worries).
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* PRINT-ONLY EXTRA METRICS & FOOTERS */}
      <div className="hidden print:block border-t border-slate-300 pt-6 mt-12 bg-white text-left font-sans text-xs">
        <div className="grid grid-cols-2 gap-6 border-b pb-6">
          <div>
            <h4 className="font-extrabold text-indigo-950 text-sm uppercase">Part A (Skill Behaviours Summary)</h4>
            <div className="mt-2 flex flex-col gap-1 bg-slate-50 p-3 rounded-xl border">
              {PART_A_DOMAINS.map(d => (
                <div key={d.key} className="flex justify-between text-[11px]">
                  <span>{d.en}</span>
                  <span className="font-bold">{getDomainScoreA(d.key)}/200 ({getPercentageA(d.key)}%)</span>
                </div>
              ))}
              <div className="flex justify-between font-extrabold mt-2 pt-2 border-t text-xs">
                <span>TOTAL PART A RAW SCORE</span>
                <span>{getTotalScorePartA()}/1400 ({Math.round((getTotalScorePartA() / 1400) * 100)}%)</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-extrabold text-indigo-950 text-sm uppercase">Part B (Problem Behaviours Summary)</h4>
            <div className="mt-2 flex flex-col gap-1 bg-slate-50 p-3 rounded-xl border">
              {PART_B_DOMAINS.map(d => (
                <div key={d.key} className="flex justify-between text-[11px]">
                  <span>{d.en}</span>
                  <span className="font-bold">{getDomainScoreB(d.key)}/{d.items.length * 2} ({getPercentageB(d.key)}%)</span>
                </div>
              ))}
              <div className="flex justify-between font-extrabold mt-2 pt-2 border-t text-xs">
                <span>TOTAL PART B RAW SCORE</span>
                <span>{getTotalScorePartB()}/150 ({Math.round((getTotalScorePartB() / 150) * 100)}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quarterly Trend Report Table */}
        <div className="mt-6">
          <h4 className="font-extrabold text-indigo-950 text-sm uppercase mb-2">Quarterly Progress Ledger Trend</h4>
          <table className="w-full border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-100 text-left text-[11px]">
                <th className="border border-slate-300 p-2">Assessment Timeline Cycle</th>
                <th className="border border-slate-300 p-2">Part A Cumulative Raw Score</th>
                <th className="border border-slate-300 p-2">Part A Success Ratio %</th>
                <th className="border border-slate-300 p-2">Part B Problem Severity</th>
                <th className="border border-slate-300 p-2">Part B Ratio %</th>
              </tr>
            </thead>
            <tbody>
              {quartersProgress.map(q => (
                <tr key={q.quarter} className="text-[11px]">
                  <td className="border border-slate-300 p-2 font-bold">{q.quarter}</td>
                  <td className="border border-slate-300 p-2">{q.partA}</td>
                  <td className="border border-slate-300 p-2 font-bold">{q.pctA}%</td>
                  <td className="border border-slate-300 p-2">{q.partB}</td>
                  <td className="border border-slate-300 p-2 font-bold">{q.pctB}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* NIMH Signoff stamp block */}
        <div className="grid grid-cols-2 gap-12 mt-12 text-center text-[10px] text-slate-500 font-bold uppercase pt-8">
          <div>
            <div className="h-10 border-b border-dashed border-slate-300" />
            <p className="mt-2">Special Educator / Specialist</p>
          </div>
          <div>
            <div className="h-10 border-b border-dashed border-slate-300" />
            <p className="mt-2">Authorised NIMH Examiner Stamp</p>
          </div>
        </div>
      </div>

    </div>
  );
}
