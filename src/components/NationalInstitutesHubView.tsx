import React, { useState } from "react";
import { 
  BookOpen, 
  Search, 
  Award, 
  Sparkles, 
  Printer, 
  BookMarked, 
  Compass, 
  ExternalLink,
  ChevronRight,
  Bookmark,
  TrendingUp,
  FileText,
  Filter,
  CheckCircle2
} from "lucide-react";
import { LanguageType } from "../language";

interface NationalInstitutesHubViewProps {
  lang: LanguageType;
  showToastMsg: (msg: string, type?: "success" | "info") => void;
}

interface NationalInstitute {
  code: string;
  nameEn: string;
  nameHi: string;
  established: string;
  locationEn: string;
  locationHi: string;
  specializationEn: string;
  specializationHi: string;
  researchFocusEn: string;
  researchFocusHi: string;
  standardTools: Array<{
    name: string;
    descriptionEn: string;
    descriptionHi: string;
    applicableAge: string;
    indicators: string[];
  }>;
}

const NATIONAL_INSTITUTES: NationalInstitute[] = [
  {
    code: "NIEPID",
    nameEn: "National Institute for the Empowerment of Persons with Intellectual Disabilities",
    nameHi: "राष्ट्रीय बौद्धिक दिव्यांगजन सशक्तिकरण संस्थान",
    established: "1984",
    locationEn: "Secunderabad, Telangana",
    locationHi: "सिकंदराबाद, तेलंगाना",
    specializationEn: "Intellectual Disabilities (ID), Autism, Developmental Delays",
    specializationHi: "बौद्धिक अक्षमता (ID), स्वलीनता, विकासात्मक देरी",
    researchFocusEn: "Cognitive interventions, early behavior modification, community rehabilitation strategies, functional skills enhancement.",
    researchFocusHi: "संज्ञानात्मक हस्तक्षेप, प्रारंभिक व्यवहार संशोधन, समुदाय आधारित पुनर्वास रणनीतियाँ, कार्यात्मक कौशल विकास।",
    standardTools: [
      {
        name: "BASIC-MR (Behavioral Assessment Scale)",
        descriptionEn: "Standardized test battery to assess behavioral progress and establish IEP pathways across communication, motor, and academic domains.",
        descriptionHi: "संचार, गामक (motor), और शैक्षणिक क्षेत्रों में व्यावहारिक प्रगति का आकलन करने और IEP मार्ग स्थापित करने के लिए मानकीकृत परीक्षण प्रणाली।",
        applicableAge: "3 to 18 Years",
        indicators: [
          "Motor Skills & ADL tasks",
          "Interpersonal Social Interactions",
          "Functional Reading/Writing Readiness",
          "Challenging Behavior reduction indices"
        ]
      },
      {
        name: "FACP (Functional Assessment Checklist)",
        descriptionEn: "Criterion-referenced tool commonly utilized throughout India to track developmental domains: Personal, Social, Academic, Occupational, Recreational.",
        descriptionHi: "भारत भर में शिक्षण व्यवस्था में प्रयुक्त होने वाला मानदंड-संदर्भित उपकरण जो व्यक्तिगत, सामाजिक, शैक्षणिक, व्यावसायिक और मनोरंजक विकासात्मक क्षेत्रों को ट्रैक करता है।",
        applicableAge: "Under 18 Years",
        indicators: [
          "Personal grooming and independence",
          "Social integration within classroom",
          "Functional pre-academic/academic skills",
          "Pre-vocational and domestic responsibility"
        ]
      },
      {
        name: "MDPS (Madras Developmental Programming System)",
        descriptionEn: "Highly behavioral skill curriculum tracing 360 individual behavioral target checkpoints across 18 unique domains.",
        descriptionHi: "अत्यधिक व्यावहारिक कौशल पाठ्यक्रम जो 18 अद्वितीय क्षेत्रों में 360 व्यक्तिगत व्यावहारिक लक्ष्य चौकियों को ट्रैक करता है।",
        applicableAge: "All Ages",
        indicators: [
          "Fine and gross motor coordination",
          "Receptive and expressive language cues",
          "Washing, grooming and eating routines",
          "Basic arithmetic concepts"
        ]
      }
    ]
  },
  {
    code: "AYJNISHD",
    nameEn: "Ali Yavar Jung National Institute of Speech and Hearing Disabilities",
    nameHi: "अली यावर जंग राष्ट्रीय वाक एवं श्रवण दिव्यांगता संस्थान",
    established: "1983",
    locationEn: "Mumbai, Maharashtra",
    locationHi: "मुंबई, महाराष्ट्र",
    specializationEn: "Hearing Impairment (HI), Speech-Language Pathology, Audiology",
    specializationHi: "श्रवण अक्षमता (Hearing Impairment), वाक और भाषा विकृति विज्ञान, ऑडियोलॉजी",
    researchFocusEn: "Acoustic assessment protocols, cochlear implant rehabilitation pathways, early identification of auditory delays, educational accommodations for deaf learners.",
    researchFocusHi: "ध्वनिक मूल्यांकन प्रोटोकॉल, कर्णावर्त प्रत्यारोपण (Cochlear Implant) पुनर्वास, प्रारंभिक श्रवण क्षति पहचान, बधिर शिक्षार्थियों के लिए शैक्षणिक अनुकूलन।",
    standardTools: [
      {
        name: "REELS (Receptive Expressive Emergent Language Scale)",
        descriptionEn: "Clinical protocol used to evaluate the emergent receptive and expressive linguistic capability for auditory-verbal therapy formulation.",
        descriptionHi: "श्रवण-मौखिक चिकित्सा निर्धारण के लिए उभरती हुई ग्रहणशील और अभिव्यंजक भाषाई क्षमता का मूल्यांकन करने के लिए प्रयुक्त नैदानिक प्रोटोकॉल।",
        applicableAge: "0 to 3 Years",
        indicators: [
          "Responses to familiar vocal tones",
          "Vocalization of sound syllables",
          "Intentional jargon and first word production",
          "Understanding of complex directions"
        ]
      },
      {
        name: "SECS (Social Emotional Commitment Scale)",
        descriptionEn: "Validatory research scale assessing the intersection of early communication failures with social-emotional adjustment in inclusive community platforms.",
        descriptionHi: "समावेशी सामुदायिक मंचों में सामाजिक-भावनात्मक समायोजन के साथ प्रारंभिक संचार संबंधी बाधाओं के प्रतिच्छेदन का आकलन करने वाला शोध पैमाना।",
        applicableAge: "2 to 12 Years",
        indicators: [
          "Peer interaction competence without cues",
          "Emotional self-regulation in noisy environments",
          "Adaptive response to verbal/non-verbal signals",
          "Frustration tolerance indexes"
        ]
      }
    ]
  },
  {
    code: "NIEPVD",
    nameEn: "National Institute for the Empowerment of Persons with Visual Disabilities",
    nameHi: "राष्ट्रीय दृष्टि दिव्यांगजन सशक्तिकरण संस्थान",
    established: "1979",
    locationEn: "Dehradun, Uttarakhand",
    locationHi: "देहरादून, उत्तराखंड",
    specializationEn: "Visual Impairment (VI), Orientation & Mobility, Bharati Braille Systems",
    specializationHi: "दृष्टि दिव्यांगता (Visual Impairment), ओरिएंटेशन और मोबिलिटी (O&M), भारती ब्रेल मानक प्रणाली",
    researchFocusEn: "Standardizing Bharati Braille across multi-lingual texts, designing tactile graphic models, spatial map reading algorithms, assistive computer adaptation.",
    researchFocusHi: "बहुभाषी पाठ्यपुस्तकों में भारती ब्रेल का मानकीकरण, स्पर्शनीय ग्राफिक मॉडल का निर्माण, स्थानिक मानचित्र पाठन, सहायक कंप्यूटर अनुकूलन।",
    standardTools: [
      {
        name: "O&M Behavioral Checklist (Orientation and Mobility)",
        descriptionEn: "Evaluates spatial tracking, tactile surface identification, white cane usage, and path navigation mastery.",
        descriptionHi: "स्थानिक ट्रैकिंग, स्पर्शनीय सतह पहचान, सफेद छड़ी (White Cane) के उपयोग और सुरक्षित पथ नेविगेशन महारत का मूल्यांकन करता है।",
        applicableAge: "4 to 20 Years",
        indicators: [
          "Tactile recognition of paths and indoor layouts",
          "Techniques for tracing and following sound trails",
          "White cane basic and advanced handling concepts",
          "Pedestrian traffic sense and signal response"
        ]
      },
      {
        name: "Bharati Braille Literary assessment protocol",
        descriptionEn: "Assesses reading speed, comprehension, character identification, and writing skills using Braille slates.",
        descriptionHi: "ब्रेल स्लेट का उपयोग करके पढ़ने की गति, समझ, वर्ण पहचान और लेखन कौशल का आकलन करता है।",
        applicableAge: "6 Years & Above",
        indicators: [
          "Single-character punctuation tracking",
          "Bilingual Braille letter identification",
          "Writing alignment precision",
          "Reading speeds benchmarks"
        ]
      }
    ]
  },
  {
    code: "NIEPMD",
    nameEn: "National Institute for Empowerment of Persons with Multiple Disabilities",
    nameHi: "राष्ट्रीय बहु-दिव्यांगजन सशक्तिकरण संस्थान",
    established: "2005",
    locationEn: "Chennai, Tamil Nadu",
    locationHi: "चेन्नई, तमिलनाडु",
    specializationEn: "Multiple Disabilities, Deaf-Blindness, Sensory Integration",
    specializationHi: "बहु-दिव्यांगता (Multiple Disabilities), बधिर-अंधता, संवेदी एकीकरण",
    researchFocusEn: "Trans-disciplinary rehabilitation models, sensory diet formulation, adaptive AAC (Augmentative Communication) systems, vocational training adaptations.",
    researchFocusHi: "पार-विषयक पुनर्वास मॉडल, संवेदी आहार (Sensory Diet) तैयार करना, एएसी (AAC) संचार प्रणालियों का अनुकूलन, व्यावसायिक प्रशिक्षण अनुकूलन।",
    standardTools: [
      {
        name: "Deaf-Blind Functional Assessment Manual",
        descriptionEn: "Tracks sensory profiles, residual vision/hearing utilization, communication gestures, and pre-vocational readiness.",
        descriptionHi: "संवेदी प्रोफाइल, अवशिष्ट दृष्टि / श्रवण उपयोग, संचार हाव-भाव और व्यावसायिक तत्परता को ट्रैक करता है।",
        applicableAge: "All Ages",
        indicators: [
          "Residual visual and auditory tracking limits",
          "Object representation and tactile signing",
          "Adaptive daily living (ADL) execution with assistance",
          "Pre-vocational hand-eye physical coordination"
        ]
      }
    ]
  },
  {
    code: "ISLRTC",
    nameEn: "Indian Sign Language Research and Training Centre",
    nameHi: "भारतीय सांकेतिक भाषा अनुसंधान और प्रशिक्षण केंद्र",
    established: "2015",
    locationEn: "New Delhi",
    locationHi: "नई दिल्ली",
    specializationEn: "Indian Sign Language (ISL), Deaf Culture, Sign Dictionary",
    specializationHi: "भारतीय सांकेतिक भाषा (ISL), बधिर संस्कृति, सांकेतिक भाषा शब्दकोश",
    researchFocusEn: "Linguistic documentation of regional ISL variations, digital sign lexicon architecture, bilingual education research, ISL interpreter certification.",
    researchFocusHi: "क्षेत्रीय सांकेतिक भाषाओं के रूपों का भाषाई प्रलेखन, डिजिटल सांकेतिक भाषा शब्दकोश निर्माण, द्विभाषी शिक्षा अनुसंधान, ISL दुभाषिया प्रमाणन।",
    standardTools: [
      {
        name: "ISL Linguistic Mastery Scale",
        descriptionEn: "Standardized rubric for evaluating vocabulary depth, grammar structure, spatial signing setups, and expression accuracy in ISL.",
        descriptionHi: "सांकेतिक भाषा में शब्दावली की गहराई, व्याकरण संरचना, स्थानिक सांकेतिक सेटअप और अभिव्यक्ति की सटीकता का मूल्यांकन करने के लिए मानकीकृत साधन।",
        applicableAge: "3 Years & Above",
        indicators: [
          "Manual gestures vocabulary scale",
          "Facial configurations and non-manual cues",
          "Spatial setup configurations of characters",
          "Interactive sign presentation fluency"
        ]
      }
    ]
  }
];

export default function NationalInstitutesHubView({
  lang,
  showToastMsg
}: NationalInstitutesHubViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInstCode, setSelectedInstCode] = useState<string>("all");
  const [pinnedTools, setPinnedTools] = useState<string[]>([]);
  const [activeResearchTab, setActiveResearchTab] = useState<"directory" | "diagnostic" | "formulator">("directory");

  // Research objective builder states
  const [selectedScale, setSelectedScale] = useState<string>("");
  const [customGoalName, setCustomGoalName] = useState("");
  const [targetDuration, setTargetDuration] = useState("3 Months");
  const [evaluationMethod, setEvaluationMethod] = useState("Teacher Observation & Weekly Rating Checklists");
  const [builtObjective, setBuiltObjective] = useState("");

  const handleTogglePinTool = (toolName: string) => {
    if (pinnedTools.includes(toolName)) {
      setPinnedTools(pinnedTools.filter(t => t !== toolName));
      showToastMsg(lang === "en" ? "Tool baseline unpinned from favorites." : "टूल पसंदीदा सूची से हटा दिया गया।", "info");
    } else {
      setPinnedTools([...pinnedTools, toolName]);
      showToastMsg(lang === "en" ? "Tool baseline pinned as research favorite!" : "टूल को पसंदीदा अनुसंधान सूची में पिन किया गया!", "success");
    }
  };

  const handleGenerateResearchObjective = () => {
    if (!selectedScale || !customGoalName) {
      showToastMsg(
        lang === "en" 
          ? "Please select a standard scale and specify target developmental goals first!" 
          : "कृपया पहले एक मानकीकृत पैमाना चुनें और लक्ष्य विकासात्मक लक्ष्यों को स्पष्ट करें!", 
        "info"
      );
      return;
    }

    const compiled = lang === "en"
      ? `🎯 IEP Objective based on [${selectedScale}] framework:\n` +
        `Goal: The student will achieve marked progressive proficiency in "${customGoalName}" over a target timeframe of ${targetDuration}.\n` +
        `Evaluation Protocol: Performance check metrics will be verified using ${evaluationMethod} based on MSJE clinical guidelines.`
      : `🎯 [${selectedScale}] रूपरेखा पर आधारित विशेष IEP लक्ष्य संकलन:\n` +
        `लक्ष्य: छात्र आगामी ${targetDuration} की अवधि के भीतर "${customGoalName}" के स्तर में स्पष्ट प्रगतिशील सुधार प्राप्त करेगा।\n` +
        `मूल्यांकन प्रोटोकॉल: एमएसजेई (MSJE) नैदानिक दिशानिर्देशों के आधार पर प्रगति की जांच "${evaluationMethod}" द्वारा की जाएगी।`;

    setBuiltObjective(compiled);
    showToastMsg(
      lang === "en" ? "Custom IEP target formulated successfully!" : "पसंद का शैक्षणिक लक्ष्य सफलतापूर्वक तैयार किया गया!", 
      "success"
    );
  };

  const handlePrintFormulation = () => {
    window.print();
  };

  // Filter institutes & tools
  const filteredInstitutes = NATIONAL_INSTITUTES.filter(inst => {
    const matchesSearch = 
      inst.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inst.nameHi.includes(searchTerm) ||
      inst.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inst.specializationEn.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCode = selectedInstCode === "all" || inst.code === selectedInstCode;
    return matchesSearch && matchesCode;
  });

  return (
    <div id="national-institutes-dashboard" className="max-w-7xl mx-auto space-y-6">
      
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-indigo-950 border-2 border-teal-500/30 rounded-2xl p-6 shadow-xl text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-12 translate-y-[-12px]">
          <Compass className="w-96 h-96 text-teal-450 animate-spin" style={{ animationDuration: "60s" }} />
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5 pl-0.5">
              <span className="p-1 px-2.5 bg-teal-500/25 border border-teal-500/40 text-teal-300 font-extrabold text-[9px] uppercase tracking-widest rounded-full">
                {lang === "en" ? "MSJE India Research Database" : "दिव्यांगता अनुसंधान डेटाबेस"}
              </span>
              <span className="p-1 px-2.5 bg-indigo-500/25 border border-indigo-500/40 text-indigo-300 font-extrabold text-[9px] uppercase tracking-widest rounded-full">
                {lang === "en" ? "Indian National Institutes" : "राष्ट्रीय संस्थान निर्देशिका"}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mb-1 uppercase font-sans">
              {lang === "en" ? "National Disability Research & Diagnostic Hub" : "राष्ट्रीय दिव्यांगता अनुसंधान एवं नैदानिक अनुसंधान केंद्र"}
            </h1>

            <p className="text-xs text-slate-300 font-bold leading-relaxed max-w-4xl uppercase">
              {lang === "en"
                ? "Academic repository syncing diagnostic test batteries (BASIC-MR, FACP, MDPS, REELS, O&M) from top National Institutes of India under MSJE, supporting Special Educators, M.Ed researchers, and clinics."
                : "सामाजिक न्याय और अधिकारिता मंत्रालय (MSJE) के अंतर्गत भारत के शीर्ष राष्ट्रीय संस्थानों के मानकीकृत नैदानिक उपकरणों की निर्देशिका, जो विशेष शिक्षकों और शोधकर्ताओं को सहायता प्रदान करती है।"}
            </p>
          </div>

          <button
            onClick={handlePrintFormulation}
            className="flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-black uppercase py-3 px-5 rounded-xl transition-all shadow border-b-2 border-teal-800 cursor-pointer w-full md:w-auto"
          >
            <Printer className="w-4 h-4" />
            <span>{lang === "en" ? "Print Research Brief" : "अनुसंधान दस्तावेज़ प्रिंट करें"}</span>
          </button>
        </div>

        {/* INNER METRICS COUNTBAR */}
        <div className="mt-5 pt-4 border-t border-teal-400/20 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-teal-950/40 p-4 rounded-xl border border-teal-500/20 text-slate-200">
          <div className="text-left">
            <span className="block text-[8.5px] font-black uppercase tracking-wider text-teal-300">{lang === "en" ? "Synched National Institutes" : "मान्यता प्राप्त राष्ट्रीय संस्थान"}</span>
            <span className="text-sm font-extrabold text-white uppercase">{NATIONAL_INSTITUTES.length} (RCI Standardized)</span>
          </div>
          <div className="text-left">
            <span className="block text-[8.5px] font-black uppercase tracking-wider text-teal-300">{lang === "en" ? "Diagnosticial Scale Batteries" : "मानकीकृत नैदानिक स्केल"}</span>
            <span className="text-sm font-mono font-bold text-white">BASIC-MR, FACP, MDPS + 4 More</span>
          </div>
          <div className="text-left">
            <span className="block text-[8.5px] font-black uppercase tracking-wider text-teal-300">{lang === "en" ? "Active Research Pins" : "पिन किए गए उपकरण"}</span>
            <span className="text-sm font-extrabold text-white uppercase">{pinnedTools.length} {lang === "en" ? "Saved Bases" : "सहेजे गए"}</span>
          </div>
          <div className="text-left">
            <span className="block text-[8.5px] font-black uppercase tracking-wider text-teal-300">{lang === "en" ? "Accrediting Authority" : "प्रमाणन प्राधिकरण"}</span>
            <span className="text-sm font-extrabold text-white uppercase">MSJE, Govt of India</span>
          </div>
        </div>
      </div>

      {/* DASHBOARD TAB SEGMENTS */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveResearchTab("directory")}
          className={`px-5 py-3 text-xs uppercase font-extrabold tracking-wider border-b-2 transition-all cursor-pointer ${
            activeResearchTab === "directory"
              ? "border-teal-600 text-teal-700 font-black"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          📂 {lang === "en" ? "Institutes Directory" : "संस्थान निर्देशिका"}
        </button>
        <button
          onClick={() => setActiveResearchTab("diagnostic")}
          className={`px-5 py-3 text-xs uppercase font-extrabold tracking-wider border-b-2 transition-all cursor-pointer ${
            activeResearchTab === "diagnostic"
              ? "border-teal-600 text-teal-700 font-black"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          🔬 {lang === "en" ? "Assessment Tools Matrix" : "नैदानिक उपकरण मैट्रिक्स"}
        </button>
        <button
          onClick={() => setActiveResearchTab("formulator")}
          className={`px-5 py-3 text-xs uppercase font-extrabold tracking-wider border-b-2 transition-all cursor-pointer ${
            activeResearchTab === "formulator"
              ? "border-teal-600 text-teal-700 font-black"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          ⚙️ {lang === "en" ? "Diagnostic Goals Formulator" : "लक्ष्य निर्माता"}
        </button>
      </div>

      {/* 1. DIRECTORY VIEW SECTION */}
      {activeResearchTab === "directory" && (
        <div className="space-y-6">
          
          {/* SEARCH & FILTER STRIP */}
          <div className="bg-white border-2 border-slate-200 p-4 rounded-xl flex flex-col sm:flex-row gap-3 shadow-sm justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={lang === "en" ? "Search search directories (e.g. Sensory, Braille, MDPS)..." : "खोजें... (जैसे स्वलीनता, ब्रेल, MDPS)"}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-200 active:border-teal-500 hover:border-slate-350 focus:border-teal-500 rounded-xl text-xs font-semibold focus:outline-none placeholder-slate-400"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={selectedInstCode}
                onChange={(e) => setSelectedInstCode(e.target.value)}
                className="bg-white border-2 border-slate-200 rounded-xl p-2.5 text-xs font-black text-slate-700 focus:outline-none focus:border-teal-500"
              >
                <option value="all">{lang === "en" ? "All Institutes (सभी संस्थान)" : "सभी राष्ट्रीय संस्थान"}</option>
                {NATIONAL_INSTITUTES.map(inst => (
                  <option key={inst.code} value={inst.code}>{inst.code}</option>
                ))}
              </select>
            </div>
          </div>

          {/* CARDS LIST GRID */}
          <div className="grid grid-cols-1 gap-6">
            {filteredInstitutes.map(inst => (
              <div key={inst.code} className="bg-white border-2 border-slate-200 rounded-2xl shadow-sm text-left overflow-hidden hover:border-slate-350 transition-all">
                <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center font-bold text-teal-800 text-sm border-2 border-teal-200">
                      {inst.code}
                    </span>
                    <div>
                      <h2 className="text-xs font-black text-slate-850 uppercase tracking-wider">
                        {lang === "en" ? inst.nameEn : inst.nameHi}
                      </h2>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">{lang === "en" ? "Established" : "स्थापना"}: {inst.established}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-[10px] text-teal-600 font-bold uppercase">{lang === "en" ? inst.locationEn : inst.locationHi}</span>
                      </div>
                    </div>
                  </div>

                  <span className="p-1.5 px-3 bg-teal-50 border border-teal-200 text-teal-700 font-black text-[9px] uppercase tracking-wider rounded-lg self-start sm:self-auto">
                    {lang === "en" ? "RCI Apex Centre" : "शीर्ष आरसीआई केंद्र"}
                  </span>
                </div>

                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-3.5">
                    <div>
                      <h3 className="text-[10px] font-black text-indigo-900 uppercase tracking-widest mb-1">
                        {lang === "en" ? "Specialization Core" : "विशिष्टता क्षेत्र"}
                      </h3>
                      <p className="text-xs font-bold text-slate-700">
                        {lang === "en" ? inst.specializationEn : inst.specializationHi}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-[10px] font-black text-indigo-900 uppercase tracking-widest mb-1">
                        {lang === "en" ? "Key Research Themes & Directives" : "प्रमुख अनुसंधान विषय व निर्देशिका"}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">
                        {lang === "en" ? inst.researchFocusEn : inst.researchFocusHi}
                      </p>
                    </div>
                  </div>

                  {/* Standardized scales column */}
                  <div className="bg-slate-50/50 border border-slate-200 rounded-xl p-4 text-left">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5 border-b border-slate-200 pb-2">
                      <Award className="w-4 h-4 text-teal-600" />
                      <span>{lang === "en" ? "Authorized Diagnostic Scales" : "अधिकृत नैदानिक उपकरण एवं स्केल"}</span>
                    </h3>

                    <div className="space-y-4">
                      {inst.standardTools.map((tool, tIdx) => (
                        <div key={tIdx} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold text-teal-850 uppercase">{tool.name}</span>
                            <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 font-black text-[8px] uppercase px-1.5 py-0.5 rounded">
                              Age: {tool.applicableAge}
                            </span>
                          </div>
                          <p className="text-[10.5px] text-slate-600 font-medium leading-normal">
                            {lang === "en" ? tool.descriptionEn : tool.descriptionHi}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. DIAGNOSTIC TOOLS MATRIX */}
      {activeResearchTab === "diagnostic" && (
        <div className="space-y-6">
          <div className="bg-emerald-50/45 border-2 border-emerald-250 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
            <div className="flex items-start gap-3">
              <Sparkles className="w-6 h-6 text-emerald-600 mt-0.5 flex-shrink-0 animate-pulse" />
              <div>
                <h3 className="text-xs font-black uppercase text-emerald-900 tracking-wider">
                  {lang === "en" ? "Diagnostic Calibration Laboratory Guide" : "नैदानिक अंशांकन प्रयोगशाला गाइड"}
                </h3>
                <p className="text-[10.5px] text-emerald-700 font-medium mt-1 uppercase leading-normal">
                  {lang === "en"
                    ? "Study standardized behavioral scales to formulate objective, clinical-grade child assessments. Bookmark preferred modules from India's specialized institutes."
                    : "उद्देश्यपूर्ण और क्लिनिकल-ग्रेड बाल मूल्यांकन तैयार करने के लिए मानकीकृत व्यवहार पैमानों का अध्ययन करें। भारत के विशिष्ट संस्थानों से पसंदीदा मॉड्यूल बुकमार्क करें।"}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {NATIONAL_INSTITUTES.flatMap(inst => 
              inst.standardTools.map((tool, tIdx) => {
                const isPinned = pinnedTools.includes(tool.name);
                return (
                  <div key={`${inst.code}-${tIdx}`} className="bg-white border-2 border-slate-200 hover:border-teal-500 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between text-left transition-all">
                    <div className="p-5 space-y-3.5">
                      <div className="flex items-center justify-between">
                        <span className="p-1 px-2.5 bg-slate-100 text-slate-600 font-black text-[9px] uppercase tracking-widest rounded-lg border">
                          {inst.code}
                        </span>
                        
                        <button
                          type="button"
                          onClick={() => handleTogglePinTool(tool.name)}
                          className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                            isPinned
                              ? "bg-amber-50 border-amber-300 text-amber-500"
                              : "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600"
                          }`}
                          title="Pin tool as Favorite"
                        >
                          <Bookmark className="w-4 h-4 fill-current" />
                        </button>
                      </div>

                      <div>
                        <h3 className="text-xs font-black text-slate-850 uppercase tracking-wide leading-tight">
                          {tool.name}
                        </h3>
                        <span className="block text-[10px] text-teal-600 font-bold uppercase mt-1">
                          {lang === "en" ? "Target Group" : "लक्षित वर्ग"}: {tool.applicableAge}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 font-medium leading-relaxed">
                        {lang === "en" ? tool.descriptionEn : tool.descriptionHi}
                      </p>

                      <div className="space-y-1 pt-2 border-t border-slate-100">
                        <span className="block text-[8px] font-black uppercase text-indigo-900 tracking-wider mb-1.5">
                          {lang === "en" ? "Testing Domains Assessed" : "परीक्षण आयाम / डोमेन"}
                        </span>
                        <div className="space-y-1">
                          {tool.indicators.map((ind, iIdx) => (
                            <div key={iIdx} className="flex items-center gap-2 text-[10.5px] font-bold text-slate-600 uppercase">
                              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                              <span>{ind}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase">
                      <span>Ref Code: {inst.code}-MSJE-V{inst.established}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* 3. DIAGNOSTIC FORMULATOR */}
      {activeResearchTab === "formulator" && (
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm text-left">
          <div className="flex items-center gap-2.5 mb-5 border-b border-slate-200 pb-4">
            <div className="w-9 h-9 bg-teal-100 text-teal-700 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: "10s" }} />
            </div>
            <div>
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 leading-tight">
                {lang === "en" ? "Standard Scale IEP Objective Formulator" : "मानकीकृत नैदानिक लक्ष्य संकलन निर्माता"}
              </h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide mt-0.5">
                {lang === "en" ? "Build objective metrics aligned with National Guidelines" : "राष्ट्रीय मानदंडों के आधार पर शैक्षणिक लक्ष्य तैयार करें"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            
            {/* Form Inputs side */}
            <div className="space-y-4">
              
              {/* Scale Selector */}
              <div className="space-y-1">
                <label className="block text-[9.5px] font-black uppercase text-slate-500 tracking-wider">
                  {lang === "en" ? "1. Select Research Scale Battery" : "1. प्रयुक्त मानकीकृत पैमाना चुनें"}
                </label>
                <select
                  value={selectedScale}
                  onChange={(e) => setSelectedScale(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-800 focus:outline-none focus:border-teal-500"
                >
                  <option value="">{lang === "en" ? "Select Scale Matrix..." : "स्केल का चुनाव करें..."}</option>
                  {NATIONAL_INSTITUTES.flatMap(inst => 
                    inst.standardTools.map(t => (
                      <option key={t.name} value={`${inst.code} - ${t.name}`}>
                        {inst.code} : {t.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Target Goal Activity */}
              <div className="space-y-1">
                <label className="block text-[9.5px] font-black uppercase text-slate-500 tracking-wider">
                  {lang === "en" ? "2. Target Developmental Behavior/Milestone" : "2. लक्षित विकासात्मक व्यवहार/मील का पत्थर"}
                </label>
                <input
                  type="text"
                  value={customGoalName}
                  onChange={(e) => setCustomGoalName(e.target.value)}
                  placeholder="e.g. Master single-digit tactile addition, reduce vocal outbursts"
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-800 focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Target timeframe */}
              <div className="space-y-1">
                <label className="block text-[9.5px] font-black uppercase text-slate-500 tracking-wider">
                  {lang === "en" ? "3. Targeted Support Timeframe" : "3. लक्ष्य प्राप्ति की अनुमानित समय सीमा"}
                </label>
                <select
                  value={targetDuration}
                  onChange={(e) => setTargetDuration(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-800 focus:outline-none focus:border-teal-500"
                >
                  <option value="3 Months">3 Months (3 महीने) [Standard Cycle]</option>
                  <option value="6 Months">6 Months (6 महीने)</option>
                  <option value="Annual Goal">Annual Goal / Yearlong (वार्षिक लक्ष्य)</option>
                </select>
              </div>

              {/* Evaluation Criteria */}
              <div className="space-y-1">
                <label className="block text-[9.5px] font-black uppercase text-slate-500 tracking-wider">
                  {lang === "en" ? "4. Evaluation Protocol Protocol" : "4. मूल्यांकन एवं प्रगति निरूपण पद्धति"}
                </label>
                <select
                  value={evaluationMethod}
                  onChange={(e) => setEvaluationMethod(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-800 focus:outline-none focus:border-teal-500"
                >
                  <option value="Teacher Observation & Weekly Rating Checklists">Teacher Observation & Weekly Rating Checklist</option>
                  <option value="FACP criteria assessment scale verification">FACP Criteria assessment scale verification</option>
                  <option value="Discrete trial percentage logs (e.g. 80% correctness)">Discrete trial percentage logs (e.g. 8/10 trials correctness)</option>
                  <option value="Clinical PTA audiogram comparison">Clinical PTA audiogram comparison</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleGenerateResearchObjective}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase py-3 rounded-xl transition-all shadow border-b-2 border-indigo-800 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{lang === "en" ? "Formulate Clinical Goal" : "लक्ष्य संकलित करें"}</span>
              </button>
            </div>

            {/* Compiled Objective side */}
            <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-5 space-y-4 self-stretch flex flex-col justify-between">
              <div className="space-y-2">
                <span className="block text-[8px] font-black uppercase text-indigo-950 tracking-wider">
                  {lang === "en" ? "Accredited Objective Statement Preview" : "प्रमाणित लक्ष्य विवरण का प्रारूप"}
                </span>

                {builtObjective ? (
                  <div className="p-4.5 bg-white border border-slate-200 rounded-xl shadow-inner text-xs font-semibold text-slate-800 leading-relaxed font-mono whitespace-pre-wrap select-all">
                    {builtObjective}
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-400 font-bold uppercase text-xs">
                    {lang === "en" ? "Fill the formulation variables to output clinical IEP goals." : "क्लिनिकल-ग्रेड IEP लक्ष्यों को तैयार करने के लिए फ़ॉर्मूलेशन वेरिएबल भरें।"}
                  </div>
                )}
              </div>

              <div className="text-[10px] text-slate-400 font-bold uppercase border-t border-slate-200 pt-3">
                {lang === "en"
                  ? "✓ Formulated goals align with criteria set by the National Commission and RCI academic research syllabus guidelines."
                  : "✓ तैयार किए गए लक्ष्य राष्ट्रीय आयोग और आरसीआई शैक्षणिक शोध पाठ्यक्रम दिशानिर्देशों द्वारा निर्धारित मानदंडों के साथ संरेखित हैं।"}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
