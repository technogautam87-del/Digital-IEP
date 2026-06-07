import React, { useState, useEffect, useRef } from "react";
import { 
  Activity, 
  HelpCircle, 
  Printer, 
  Save, 
  Sparkles, 
  Sliders, 
  CheckSquare, 
  Square, 
  BookMarked, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Award,
  Maximize2
} from "lucide-react";
import { StudentRecord, StudentProfile } from "../types";
import { LanguageType } from "../language";

interface HearingImpairmentViewProps {
  lang: LanguageType;
  studentsList: StudentRecord[];
  activeStudentId: string;
  onLoadStudent: (id: string) => boolean;
  showToastMsg: (msg: string, type?: "success" | "info") => void;
}

// Developmental Checklist Items from NIDCD PDF 1
interface ChecklistItem {
  id: string;
  ageGroup: string;
  en: string;
  hi: string;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  // Birth to 3 Months
  { id: "b3m_1", ageGroup: "0-3m", en: "Reacts to loud sounds", hi: "तेज़ आवाज़ों पर प्रतिक्रिया देता है" },
  { id: "b3m_2", ageGroup: "0-3m", en: "Calms down or smiles when spoken to", hi: "बात करने पर शांत हो जाता है या मुस्कुराता है" },
  { id: "b3m_3", ageGroup: "0-3m", en: "Recognizes your voice and calms down if crying", hi: "आपकी आवाज़ पहचानता है और रोना बंद करता है" },
  { id: "b3m_4", ageGroup: "0-3m", en: "Starts or stops sucking in response to sound during feeding", hi: "दूध पीते समय आवाज़ सुनकर चूसना शुरू या बंद करता है" },
  { id: "b3m_5", ageGroup: "0-3m", en: "Coos and makes pleasure sounds", hi: "कूजन/किलकारी (coos) और खुशनुमा आवाज़ें निकालता है" },
  { id: "b3m_6", ageGroup: "0-3m", en: "Has a special way of crying for different needs", hi: "अलग-अलग ज़रूरतों के लिए विशेष प्रकार से रोता है" },
  { id: "b3m_7", ageGroup: "0-3m", en: "Smiles when he or she sees you", hi: "आपको देखकर मुस्कुराता है" },

  // 4 to 6 Months
  { id: "46m_1", ageGroup: "4-6m", en: "Follows sounds with his or her eyes", hi: "अपनी आँखों से आवाज़ का पीछा करता है/उधर देखता है" },
  { id: "46m_2", ageGroup: "4-6m", en: "Responds to changes in the tone of your voice", hi: "आपकी आवाज़ के लहज़े में बदलाव पर प्रतिक्रिया देता है" },
  { id: "46m_3", ageGroup: "4-6m", en: "Notices toys that make sounds", hi: "आवाज़ करने वाले खिलौनों पर ध्यान देता है" },
  { id: "46m_4", ageGroup: "4-6m", en: "Pays attention to music", hi: "संगीत पर ध्यान देता है" },
  { id: "46m_5", ageGroup: "4-6m", en: "Babbles in a speech-like way (sounds like p, b, m)", hi: "बोली जैसी बड़बड़ाहट करता है (विशेषकर 'प', 'ब', 'म' की आवाज़ें)" },
  { id: "46m_6", ageGroup: "4-6m", en: "Laughs out loud", hi: "खुलकर हंसता है" },
  { id: "46m_7", ageGroup: "4-6m", en: "Babbles when excited or unhappy", hi: "उत्साहित या दुखी होने पर बड़बड़ाता है" },
  { id: "46m_8", ageGroup: "4-6m", en: "Makes gurgling sounds when alone or playing with you", hi: "अकेले या आपके साथ खेलते समय गड़गड़ाहट (gurgling) की ध्वनि निकालता है" },

  // 7 Months to 1 Year
  { id: "71y_1", ageGroup: "7-12m", en: "Enjoys playing peek-a-boo and pat-a-cake", hi: "झाँकी-झाँकी (peek-a-boo) और ताली बजाने वाले खेल का आनंद लेता है" },
  { id: "71y_2", ageGroup: "7-12m", en: "Turns and looks in the direction of sounds", hi: "आवाज़ों की दिशा में मुड़कर देखता है" },
  { id: "71y_3", ageGroup: "7-12m", en: "Listens when spoken to", hi: "बात करने पर ध्यान से सुनता है" },
  { id: "71y_4", ageGroup: "7-12m", en: "Understands words for common items ('cup', 'shoe', 'juice')", hi: "आम चीज़ों के नाम समझता है (जैसे 'कप', 'जूता', या 'जूस')" },
  { id: "71y_5", ageGroup: "7-12m", en: "Responds to requests ('Come here')", hi: "सरल अनुरोधों पर प्रतिक्रिया देता है (जैसे 'यहाँ आओ')" },
  { id: "71y_6", ageGroup: "7-12m", en: "Babbles using long & short sound groups ('tata, upup, bibibi')", hi: "लंबी और छोटी आवाज़ों के समूहों में बड़बड़ाता है ('तता', 'उपुप', 'बिबिबि')" },
  { id: "71y_7", ageGroup: "7-12m", en: "Babbles to get and keep attention", hi: "ध्यान आकर्षित करने और बनाए रखने के लिए बड़बड़ाता है" },
  { id: "71y_8", ageGroup: "7-12m", en: "Communicates using gestures such as waving or holding up arms", hi: "हाथ हिलाकर या हाथ उठाकर इशारों से संवाद करता है" },
  { id: "71y_9", ageGroup: "7-12m", en: "Imitates different speech sounds", hi: "विभिन्न बोली ध्वनियों की नकल करने की कोशिश करता है" },
  { id: "71y_10", ageGroup: "7-12m", en: "Has one or two words ('Hi', 'dog', 'Dada', 'Mama') by birthday", hi: "पहले जन्मदिन तक एक या दो शब्द बोल लेता है ('बाय', 'कुत्ता', 'दादा', 'मम्मा')" },

  // 1 to 2 Years
  { id: "12y_1", ageGroup: "1-2y", en: "Knows a few parts of body and points matching on call", hi: "शरीर के कुछ अंगों को जानता है और पूछने पर उनकी ओर इशारा करता है" },
  { id: "12y_2", ageGroup: "1-2y", en: "Follows simple commands ('Roll ball') and questions ('Where shoe?')", hi: "सरल आदेशों का पालन करता है और साधारण प्रश्न समझता है" },
  { id: "12y_3", ageGroup: "1-2y", en: "Enjoys simple stories, songs, and rhymes", hi: "सरल कहानियों, गीतों और बाल कविताओं का आनंद लेता है" },
  { id: "12y_4", ageGroup: "1-2y", en: "Points to pictures in books when they are named", hi: "किताबों में नाम लिए जाने पर चित्रों की ओर उँगली उठाता है" },
  { id: "12y_5", ageGroup: "1-2y", en: "Acquires new words on a regular basis", hi: "नियमित रूप से नए शब्द सीखता है" },
  { id: "12y_6", ageGroup: "1-2y", en: "Uses some one or two-word questions ('Where kitty?')", hi: "एक या दो शब्दों वाले प्रश्न पूछता है (जैसे 'बिल्ली कहाँ?')" },
  { id: "12y_7", ageGroup: "1-2y", en: "Puts two words together ('More cookie')", hi: "दो शब्दों को जोड़कर बोलता है (जैसे 'और बिस्कुट')" },
  { id: "12y_8", ageGroup: "1-2y", en: "Uses many different consonant sounds at start of words", hi: "शब्दों की शुरुआत में कई अलग-अलग व्यंजनों की ध्वनियों का उपयोग करता है" },

  // 2 to 3 Years
  { id: "23y_1", ageGroup: "2-3y", en: "Has a word for almost everything", hi: "लगभग हर चीज़ को पुकारने के लिए उसके पास एक शब्द होता है" },
  { id: "23y_2", ageGroup: "2-3y", en: "Uses two or three-word phrases to talk and ask for things", hi: "चीज़ों को मांगने या उनके बारे में बताने के लिए 2-3 शब्दों के वाक्य बनाता है" },
  { id: "23y_3", ageGroup: "2-3y", en: "Uses k, g, f, t, d, and n sounds", hi: "अपनी बोली में 'क', 'ग', 'फ', 'त', 'द', 'न' ध्वनियों का उपयोग करता है" },
  { id: "23y_4", ageGroup: "2-3y", en: "Speaks in a way that is understood by family and friends", hi: "इस तरह बात करता है जो परिवार और दोस्तों को आसानी से समझ आए" },
  { id: "23y_5", ageGroup: "2-3y", en: "Names objects to ask for them or direct attention", hi: "चीज़ों का नाम लेता है ताकि उन्हें माँग सके या उन पर ध्यान खींच सके" },

  // 3 to 4 Years
  { id: "34y_1", ageGroup: "3-4y", en: "Hears you when you call from another room", hi: "दूसरे कमरे से बुलाने पर भी आपकी आवाज़ सुनता है" },
  { id: "34y_2", ageGroup: "3-4y", en: "Hears TV / radio at same volume as other family members", hi: "टीवी या रेडियो उसी आवाज़ पर सुनता है जिस पर बाकी परिवार सुनते हैं" },
  { id: "34y_3", ageGroup: "3-4y", en: "Answers simple 'Who?', 'What?', 'Where?' questions", hi: "सरल प्रश्नों के उत्तर देता है जैसे 'कौन?', 'क्या?', 'कहाँ?'" },
  { id: "34y_4", ageGroup: "3-4y", en: "Talks about activities at daycare or friends' homes", hi: "स्कूल या दोस्तों के घरों की गतिविधियों के बारे में घर पर बात करता है" },
  { id: "34y_5", ageGroup: "3-4y", en: "Uses sentences with four or more words", hi: "बातचीत में चार या अधिक शब्दों वाले वाक्यों का उपयोग करता है" },
  { id: "34y_6", ageGroup: "3-4y", en: "Speaks easily without repeating syllables or words frequently", hi: "अक्षरों या शब्दों को हकलाए या दोहराए बिना धाराप्रवाह बोलता है" },

  // 4 to 5 Years
  { id: "45y_1", ageGroup: "4-5y", en: "Pays attention to a short story and answers simple questions", hi: "छोटी कहानी पर ध्यान देता है और उसके संबंध में साधारण प्रश्नों के उत्तर देता है" },
  { id: "45y_2", ageGroup: "4-5y", en: "Hears and understands most of what is said at home & school", hi: "घर और स्कूल में कही जाने वाली लगभग सभी बातें सुनता और समझता है" },
  { id: "45y_3", ageGroup: "4-5y", en: "Uses sentences that give many details", hi: "अधिक विवरण और सूचना देने वाले सुसज्जित वाक्यों का उपयोग करता है" },
  { id: "45y_4", ageGroup: "4-5y", en: "Tells stories that stay on topic", hi: "कहानी सुनाते समय भटके बिना मुख्य विषय पर टिका रहता है" },
  { id: "45y_5", ageGroup: "4-5y", en: "Communicates easily with other children and adults", hi: "अन्य बच्चों और बड़ों या अजनबियों के साथ भी आसानी से बात कर लेता है" },
  { id: "45y_6", ageGroup: "4-5y", en: "Says most sounds correctly, except maybe l, s, r, v, z, ch, sh, th", hi: "कुछ कठिन ध्वनियों (ल, स, र, व, ज, च, श, थ) को छोड़कर सब सही उच्चारित करता है" },
  { id: "45y_7", ageGroup: "4-5y", en: "Recognizes or uses simple rhyming words", hi: "समान तुक वाले (rhyming) शब्दों को पहचानता या बोलता है" },
  { id: "45y_8", ageGroup: "4-5y", en: "Names some letters and numbers", hi: "अक्षरों और नंबरों/गिनती को पहचानकर उनके नाम बताता है" },
  { id: "45y_9", ageGroup: "4-5y", en: "Uses adult-like consistent grammar rules", hi: "वयस्कों जैसी व्याकरण के नियमों वाली स्पष्ट सुसंगत भाषा प्रयुक्त करता है" }
];

const AGE_GROUPS_LIST = [
  { key: "all", en: "All Ages", hi: "सभी आयु वर्ग" },
  { key: "0-3m", en: "Birth to 3M", hi: "जन्म से 3 महीने" },
  { key: "4-6m", en: "4 to 6 Months", hi: "4 से 6 महीने" },
  { key: "7-12m", en: "7 Months to 1 Year", hi: "7 महीने से 1 वर्ष" },
  { key: "1-2y", en: "1 to 2 Years", hi: "1 से 2 वर्ष" },
  { key: "2-3y", en: "2 to 3 Years", hi: "2 से 3 वर्ष" },
  { key: "3-4y", en: "3 to 4 Years", hi: "3 से 4 वर्ष" },
  { key: "4-5y", en: "4 to 5 Years", hi: "4 से 5 वर्ष" }
];

// Audiogram Standard Frequencies
const FREQUENCIES = [250, 500, 1000, 2000, 4000, 8000];

export default function HearingImpairmentView({
  lang,
  studentsList,
  activeStudentId,
  onLoadStudent,
  showToastMsg
}: HearingImpairmentViewProps) {

  const [activeStudent, setActiveStudent] = useState<StudentRecord | null>(null);
  const [selectedAgeFilter, setSelectedAgeFilter] = useState<string>("all");

  // Checklist values stored state: {[studentId]: { [itemId]: boolean }}
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  // Audiogram thresholds stored state: { rightEar: { [freq]: dB }, leftEar: { [freq]: dB } }
  // Defaulting to normal threshold 10dB
  const [audiogram, setAudiogram] = useState<{
    rightEar: Record<number, number>;
    leftEar: Record<number, number>;
  }>({
    rightEar: { 250: 10, 500: 10, 1000: 10, 2000: 10, 4000: 10, 8000: 10 },
    leftEar: { 250: 10, 500: 10, 1000: 10, 2000: 10, 4000: 10, 8000: 10 }
  });

  // Highlight points being plotted
  const [activeEarPlot, setActiveEarPlot] = useState<"right" | "left">("right");

  // Synchronization with active student change
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

  // Load persistence logic whenever active student switches
  useEffect(() => {
    if (!activeStudent) return;

    // Load Checklist checklist
    const storedCheck = localStorage.getItem(`hi_checklist_${activeStudent.id}`);
    if (storedCheck) {
      try { setCheckedItems(JSON.parse(storedCheck)); } catch (e) { setCheckedItems({}); }
    } else {
      setCheckedItems({});
    }

    // Load Audiogram dataset
    const storedAudio = localStorage.getItem(`hi_audiogram_${activeStudent.id}`);
    if (storedAudio) {
      try { setAudiogram(JSON.parse(storedAudio)); } catch (e) { resetAudiogram(); }
    } else {
      resetAudiogram();
    }
  }, [activeStudent]);

  // Reset audiogram back to clean defaults
  const resetAudiogram = () => {
    setAudiogram({
      rightEar: { 250: 10, 500: 10, 1000: 10, 2000: 10, 4000: 10, 8000: 10 },
      leftEar: { 250: 10, 500: 10, 1000: 10, 2000: 10, 4000: 10, 8000: 10 }
    });
  };

  const handleToggleChecklist = (itemId: string) => {
    const updated = { ...checkedItems, [itemId]: !checkedItems[itemId] };
    setCheckedItems(updated);
    if (activeStudent) {
      localStorage.setItem(`hi_checklist_${activeStudent.id}`, JSON.stringify(updated));
    }
  };

  const handleUpdateThreshold = (ear: "right" | "left", freq: number, dBLoss: number) => {
    const updated = {
      ...audiogram,
      [ear === "right" ? "rightEar" : "leftEar"]: {
        ...audiogram[ear === "right" ? "rightEar" : "leftEar"],
        [freq]: dBLoss
      }
    };
    setAudiogram(updated);
    if (activeStudent) {
      localStorage.setItem(`hi_audiogram_${activeStudent.id}`, JSON.stringify(updated));
    }
  };

  // Pure Tone Average values calculation (standard PTA is average of 500Hz, 1000Hz, 2000Hz values)
  const calcPTA = (ear: "right" | "left") => {
    const dataset = ear === "right" ? audiogram.rightEar : audiogram.leftEar;
    const scores = [dataset[500] || 0, dataset[1000] || 0, dataset[2000] || 0];
    const avg = scores.reduce((a, b) => a + b, 0) / 3;
    return Math.round(avg * 10) / 10;
  };

  // Maps PTA into clinical categories of hearing disabilities (Rehabilitation core guidelines Rajasthan syllabus)
  const getSeverityClassification = (pta: number) => {
    if (pta < 16) return { en: "Normal Hearing Sensitivity", hi: "सामान्य श्रवण स्तर", color: "text-emerald-600 bg-emerald-50 border-emerald-250" };
    if (pta >= 16 && pta <= 25) return { en: "Minimal / Borderline Loss", hi: "सीमांत श्रवण कमी", color: "text-teal-600 bg-teal-50 border-teal-200" };
    if (pta >= 26 && pta <= 40) return { en: "Mild Hearing Impairment", hi: "सौम्य श्रवण विकलांगता", color: "text-amber-600 bg-amber-50 border-amber-250" };
    if (pta >= 41 && pta <= 55) return { en: "Moderate Hearing Impairment", hi: "मध्यम श्रवण विकलांगता", color: "text-orange-600 bg-orange-50 border-orange-250" };
    if (pta >= 56 && pta <= 70) return { en: "Moderately Severe Impairment", hi: "मध्यम-गंभीर श्रवण विकलांगता", color: "text-pink-600 bg-pink-50 border-pink-250" };
    if (pta >= 71 && pta <= 90) return { en: "Severe Hearing Impairment", hi: "गंभीर श्रवण विकलांगता", color: "text-rose-600 bg-rose-50 border-rose-250" };
    return { en: "Profound Hearing Impairment (Deafness)", hi: "विशेष/अति गंभीर श्रवण बाधा (पूर्ण बधिरता)", color: "text-red-600 bg-red-50 border-red-200 animate-pulse font-sans" };
  };

  // Calculates percentage of checklist milestone passes in the active search window
  const activeChecklistItems = CHECKLIST_ITEMS.filter(it => selectedAgeFilter === "all" || it.ageGroup === selectedAgeFilter);
  const passedCount = activeChecklistItems.filter(it => checkedItems[it.id]).length;
  const checkPercentage = activeChecklistItems.length > 0 ? Math.round((passedCount / activeChecklistItems.length) * 100) : 0;

  // Render clinically formatted pure tone audiogram chart using pure SVG coordinate placement
  // X columns: 250, 500, 1000, 2000, 4000, 8000.
  // Y rows: -10 to 120 (with -10 at the TOP, increasing intensity DOWNWARDS!)
  const getAudiogramSVGPoints = (ear: "right" | "left") => {
    const dataset = ear === "right" ? audiogram.rightEar : audiogram.leftEar;
    const paddingLeft = 60;
    const paddingTop = 30;
    const width = 450;
    const height = 280;

    const points: { x: number; y: number; freq: number; db: number }[] = [];
    FREQUENCIES.forEach((f, index) => {
      const db = dataset[f] !== undefined ? dataset[f] : 10;
      
      // Calculate evenly spaced X columns
      const coordX = paddingLeft + (index * (width / (FREQUENCIES.length - 1)));
      
      // Calculate Y coordinate: Y range maps db value -10 to 120 directly onto SVG height
      const rawY = ((db - (-10)) / (120 - (-10))) * height;
      const coordY = paddingTop + rawY;

      points.push({ x: coordX, y: coordY, freq: f, db });
    });

    return points;
  };

  const getDBClippedY = (dbValue: number) => {
    const paddingTop = 30;
    const height = 280;
    const rawY = ((dbValue - (-10)) / (120 - (-10))) * height;
    return paddingTop + rawY;
  };

  // Calculate coordinates for speech banana shading (key vocal boundaries: 250Hz @40-50dB, 1KHz @30-40dB, 4KHz @25-30dB etc.)
  // Banana typically spans specific frequency lines of central speech sounds
  const rightPoints = getAudiogramSVGPoints("right");
  const leftPoints = getAudiogramSVGPoints("left");

  // Export & Print report handler
  const handlePrint = () => {
    window.print();
  };

  // Save targets to user session log file
  const handleSaveToLocalStorage = () => {
    if (!activeStudent) return;
    localStorage.setItem(`hi_checklist_${activeStudent.id}`, JSON.stringify(checkedItems));
    localStorage.setItem(`hi_audiogram_${activeStudent.id}`, JSON.stringify(audiogram));
    showToastMsg(
      lang === "en" 
        ? `Diagnostic reports persistent save successful for ${activeStudent.profile.studentName}!` 
        : `छात्र ${activeStudent.profile.studentName} के श्रवण रिपोर्ट और रेखांकन स्थानीय रूप से सेव किए गए।`,
      "success"
    );
  };

  // Interactive Click on Audiogram Grid Points to select threshold values directly on Graph!
  const svgRef = useRef<SVGSVGElement | null>(null);

  const handleSvgGridClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const svgRect = svgRef.current.getBoundingClientRect();
    const clickX = e.clientX - svgRect.left;
    const clickY = e.clientY - svgRect.top;

    // Map clickX onto the closest clinical frequency column
    const paddingLeft = 60;
    const width = 450;
    const colWidth = width / (FREQUENCIES.length - 1);
    
    let closestIndex = 0;
    let minDistance = 9999;
    FREQUENCIES.forEach((f, idx) => {
      const colX = paddingLeft + (idx * colWidth);
      const dist = Math.abs(clickX - colX);
      if (dist < minDistance) {
        minDistance = dist;
        closestIndex = idx;
      }
    });

    // Map clickY into 5dB steps between -10dB and 120dB
    const paddingTop = 30;
    const height = 280;
    const relativeY = clickY - paddingTop;
    const fraction = relativeY / height;
    const unroundedDb = -10 + fraction * (120 - (-10));
    
    // Nearest clinical 5dB increment
    const roundedDb = Math.round(unroundedDb / 5) * 5;
    const finalDb = Math.max(-10, Math.min(120, roundedDb));

    const targetFreq = FREQUENCIES[closestIndex];
    handleUpdateThreshold(activeEarPlot, targetFreq, finalDb);
    showToastMsg(
      lang === "en" 
        ? `Plotted ${activeEarPlot.toUpperCase()} EAR: ${targetFreq}Hz at ${finalDb}dB` 
        : `रेखांकित किया गया (${activeEarPlot === "right" ? "दायाँ कान" : "बायाँ कान"}): ${targetFreq}Hz पर ${finalDb}dB`,
      "success"
    );
  };

  return (
    <div id="hearing-impairment-workspace" className="max-w-7xl mx-auto space-y-6">
      
      {/* HEADER BAR */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-2 border-indigo-500/30 rounded-2xl p-6 shadow-xl text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-12 translate-y-[-12px]">
          <Activity className="w-96 h-96 text-indigo-450 animate-pulse" />
        </div>
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1 pl-0.5">
              <span className="p-1 px-2.5 bg-indigo-500/25 border border-indigo-500/40 text-indigo-300 font-extrabold text-[9px] uppercase tracking-widest rounded-full">
                {lang === "en" ? "M.Ed Special Education HI Module" : "एम.एड विशेष शिक्षा श्रवण विकलांगता अनुभाग"}
              </span>
              <span className="p-1 px-2.5 bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 font-extrabold text-[9px] uppercase tracking-widest rounded-full">
                {lang === "en" ? "Interactive Diagnostics" : "सक्रिय नैदानिक विश्लेषण"}
              </span>
            </div>
            
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mb-1 uppercase font-sans">
              {lang === "en" ? "Hearing Impairment (HI) Assessment & IEP Suite" : "श्रवण अक्षमता (Hearing Impairment) मूल्यांकन और IEP सुइट"}
            </h1>
            
            <p className="text-xs text-slate-300 font-bold leading-relaxed max-w-2xl uppercase">
              {lang === "en" 
                ? "Perform interactive early childhood milestone checklists to identify communication delays, map professional SVG Pure-Tone Audiograms, calculate PTAs, and auto-generate specialized curriculum accommodation goals!"
                : "शैशवावस्था के संप्रेषण मील के पत्थरों की नैदानिक जांच करें, नैदानिक शुद्ध-स्वर ऑडियोमीटर आरेख (Audiogram) बनाएं, तथा श्रवण विकलांगता हेतु विशेष IEP लक्ष्यों का स्वतः वैज्ञानिक सृजन करें।"}
            </p>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={handleSaveToLocalStorage}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase py-3 px-5 rounded-xl transition-all shadow border-b-2 border-indigo-800 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{lang === "en" ? "Save Diagnostic Log" : "रिकॉर्ड सेव करें"}</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-850 hover:bg-slate-800 border-2 border-slate-700/80 text-white text-xs font-black uppercase py-3 px-5 rounded-xl transition-all cursor-pointer shadow"
            >
              <Printer className="w-4 h-4" />
              <span>{lang === "en" ? "Print IEP Report" : "IEP प्रिंट करें"}</span>
            </button>
          </div>
        </div>

        {/* ACTIVE PATIENT INFOBAR */}
        {activeStudent && (
          <div className="mt-5 pt-4 border-t border-indigo-400/20 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-indigo-950/40 p-4 rounded-xl border border-indigo-500/20 text-slate-200">
            <div className="text-left">
              <span className="block text-[9px] font-black uppercase tracking-wider text-indigo-300">{lang === "en" ? "Diagnostic Case" : "प्रकरण का नाम"}</span>
              <span className="text-xs font-extrabold text-white uppercase">{activeStudent.profile.studentName}</span>
            </div>
            <div className="text-left">
              <span className="block text-[9px] font-black uppercase tracking-wider text-indigo-300">{lang === "en" ? "Case Reference ID" : "रजिस्ट्री क्रमांक / ID"}</span>
              <span className="text-xs font-mono font-bold text-white">{activeStudent.id}</span>
            </div>
            <div className="text-left">
              <span className="block text-[9px] font-black uppercase tracking-wider text-indigo-300">{lang === "en" ? "Educational Level" : "शैक्षणिक कक्षा"}</span>
              <span className="text-xs font-extrabold text-white uppercase">Grade {activeStudent.profile.className?.replace("c", "") || "N/A"}</span>
            </div>
            <div className="text-left">
              <span className="block text-[9px] font-black uppercase tracking-wider text-indigo-300">{lang === "en" ? "Assigned Clinician" : "विशेष शिक्षक (Specialist)"}</span>
              <span className="text-xs font-extrabold text-white uppercase">{activeStudent.profile.specialTeacher || "N/A"}</span>
            </div>
          </div>
        )}
      </div>

      {/* TWO COLUMN GRID : 1. CHECKLIST SCREENING  |  2. CLINICAL AUDIOGRAM */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* COL 1: DEVELOPMENTAL CHECKLIST (PDF 1) */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-sm flex flex-col justify-between overflow-hidden">
          <div>
            <div className="p-5 border-b border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h2 className="text-xs font-black uppercase tracking-widest text-slate-800 leading-tight">
                    {lang === "en" ? "Early Communication Developmental Checklist" : "प्रारंभिक संप्रेषण मील का पत्थर जांच सूची"}
                  </h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide mt-0.5">
                    {lang === "en" ? "CDC milestone evaluation sheet" : "NIDCD के नैदानिक मानदंडों पर आधारित"}
                  </p>
                </div>
              </div>

              {/* Age select Filter */}
              <select
                value={selectedAgeFilter}
                onChange={(e) => setSelectedAgeFilter(e.target.value)}
                className="bg-white border-2 border-slate-200 rounded-lg p-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500"
              >
                {AGE_GROUPS_LIST.map(gp => (
                  <option key={gp.key} value={gp.key}>
                    {lang === "en" ? gp.en : gp.hi}
                  </option>
                ))}
              </select>
            </div>

            {/* Checklist items dynamic view container */}
            <div className="p-5 max-h-[460px] overflow-y-auto space-y-2 divider-y divide-slate-100">
              {activeChecklistItems.map((item, index) => {
                const isChecked = !!checkedItems[item.id];
                return (
                  <div
                    key={item.id}
                    onClick={() => handleToggleChecklist(item.id)}
                    className={`flex items-start gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer ${
                      isChecked
                        ? "bg-indigo-50/45 border-indigo-200/80"
                        : "bg-white hover:bg-slate-50/50 border-slate-100"
                    }`}
                  >
                    <div className="mt-0.5 text-indigo-600">
                      {isChecked ? (
                        <CheckSquare className="w-4.5 h-4.5" />
                      ) : (
                        <Square className="w-4.5 h-4.5 text-slate-300" />
                      )}
                    </div>
                    
                    <div className="text-left flex-1">
                      <p className="text-xs font-bold text-slate-800 leading-normal">
                        {lang === "en" ? item.en : item.hi}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="p-0.5 px-1.5 bg-slate-100 text-slate-400 font-black text-[8px] uppercase tracking-widest rounded">
                          {item.id.replace("_", " ")}
                        </span>
                        <span className="text-[8.5px] text-indigo-500 font-bold uppercase">
                          {AGE_GROUPS_LIST.find(g => g.key === item.ageGroup)?.en}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Checklist progress tracker dashboard */}
          <div className="p-5 border-t border-slate-200/80 bg-slate-50 flex items-center justify-between">
            <div className="text-left">
              <span className="block text-[8.5px] font-black uppercase text-slate-400 tracking-wider">
                {lang === "en" ? "CDC Assessment Progress" : "विकास प्रगति स्थिति"}
              </span>
              <span className="text-sm font-black text-slate-805">
                {passedCount} / {activeChecklistItems.length} {lang === "en" ? "Milestones Achieved" : "लक्ष्य प्राप्त हुए"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-24 bg-slate-200/80 h-3 rounded-full overflow-hidden border">
                <div 
                  className="bg-indigo-600 h-full transition-all duration-500"
                  style={{ width: `${checkPercentage}%` }}
                />
              </div>
              <span className="text-xs font-black text-indigo-600 font-mono">
                {checkPercentage}%
              </span>
            </div>
          </div>
        </div>

        {/* COL 2: INTERACTIVE AUDIOGRAM PLOTTER & CLASSIFICATION (PDF 2) */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="p-5 border-b border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                <Volume2 className="w-5 h-5 animate-pulse" />
              </div>
              <div className="text-left">
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-800 leading-tight">
                  {lang === "en" ? "Pure-Tone Clinical Audiogram Plotter" : "शुद्ध-स्वर क्लीनिकल ऑडियोमीटर ग्राफ"}
                </h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide mt-0.5">
                  {lang === "en" ? "Plot thresholds directly on SVG canvas" : "दायाँ कान (लाल O) | बायाँ कान (नीला X)"}
                </p>
              </div>
            </div>

            {/* Plotting ear selector buttons */}
            <div className="flex gap-1.5 bg-slate-200/60 p-1 rounded-lg border">
              <button
                type="button"
                onClick={() => setActiveEarPlot("right")}
                className={`px-3 py-1 text-[10px] uppercase font-black tracking-wider rounded transition-all cursor-pointer ${
                  activeEarPlot === "right"
                    ? "bg-rose-500 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-200"
                }`}
              >
                🔴 {lang === "en" ? "Right Ear (O)" : "दायाँ (O)"}
              </button>
              <button
                type="button"
                onClick={() => setActiveEarPlot("left")}
                className={`px-3 py-1 text-[10px] uppercase font-black tracking-wider rounded transition-all cursor-pointer ${
                  activeEarPlot === "left"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-200"
                }`}
              >
                🔵 {lang === "en" ? "Left Ear (X)" : "बायाँ (X)"}
              </button>
            </div>
          </div>

          <div className="p-5 flex flex-col md:flex-row gap-5 items-center justify-center">
            
            {/* AUDIOGRAM SVG GRAPH BOARD */}
            <div className="border border-slate-300 rounded-xl p-2 bg-slate-50 shadow-inner relative flex-1">
              
              {/* Graphic Plotter overlay warning indicator */}
              <div className="absolute top-2 left-2 bg-indigo-950 text-white font-extrabold text-[8px] uppercase tracking-widest px-2 py-0.5 rounded shadow">
                {lang === "en" ? "Interactive Canvas" : "सक्रिय ग्रिड"}
              </div>

              <svg
                ref={svgRef}
                viewBox="0 0 540 330"
                className="w-full h-auto cursor-crosshair bg-white rounded shadow-sm select-none"
                onClick={handleSvgGridClick}
              >
                {/* Visual grid rendering */}
                {/* Horizontal gridlines every 10dB loss (-10 to 120) */}
                {Array.from({ length: 14 }).map((_, idx) => {
                  const dbMetric = -10 + idx * 10;
                  const yVal = getDBClippedY(dbMetric);
                  return (
                    <g key={`yGrid-${dbMetric}`}>
                      {/* Gridline */}
                      <line
                        x1="60"
                        y1={yVal}
                        x2="510"
                        y2={yVal}
                        stroke={dbMetric === 25 ? "#f59e0b" : "#e2e8f0"} // speech normal limit line highlight
                        strokeWidth={dbMetric === 0 || dbMetric === 60 ? "1.8" : "0.8"}
                        strokeDasharray={dbMetric === 25 ? "4" : undefined}
                      />
                      {/* Label DB */}
                      <text
                        x="50"
                        y={yVal + 3.5}
                        fontSize="9"
                        textAnchor="end"
                        fontWeight="black"
                        className="fill-slate-400 font-mono"
                      >
                        {dbMetric}
                      </text>
                    </g>
                  );
                })}

                {/* Vertical gridlines for clinical frequencies */}
                {FREQUENCIES.map((f, colIdx) => {
                  const colX = 60 + (colIdx * (450 / (FREQUENCIES.length - 1)));
                  return (
                    <g key={`xGrid-${f}`}>
                      <line
                        x1={colX}
                        y1="30"
                        x2={colX}
                        y2="310"
                        stroke="#e2e8f0"
                        strokeWidth="1.2"
                      />
                      {/* Frequency value text label */}
                      <text
                        x={colX}
                        y="18"
                        fontSize="10"
                        textAnchor="middle"
                        fontWeight="black"
                        className="fill-slate-600 font-mono"
                      >
                        {f}
                      </text>
                    </g>
                  );
                })}

                {/* speech banana shading area coordinates */}
                <path
                  d={`M ${60 + (1*(450/5))} ${getDBClippedY(30)} 
                     Q ${60 + (2*(450/5))} ${getDBClippedY(15)} ${60 + (3*(450/5))} ${getDBClippedY(25)}
                     L ${60 + (4*(450/5))} ${getDBClippedY(35)}
                     L ${60 + (4*(450/5))} ${getDBClippedY(55)}
                     Q ${60 + (2*(450/5))} ${getDBClippedY(65)} ${60 + (1*(450/5))} ${getDBClippedY(45)} Z`}
                  fill="#fef3c7"
                  fillOpacity="0.45"
                  stroke="#f59e0b"
                  strokeWidth="0.5"
                  strokeDasharray="2"
                />
                
                {/* Text for Speech Banana (normal voice frequencies) */}
                <text
                  x="280"
                  y={getDBClippedY(42)}
                  fontSize="7.5"
                  fontWeight="black"
                  textAnchor="middle"
                  className="fill-amber-700 uppercase tracking-widest font-sans"
                >
                  {lang === "en" ? "Speech Area (विशिष्ट भाषा स्तर)" : "भाषा स्तर"}
                </text>

                {/* Connecting Path Line Right Ear (Red) */}
                {rightPoints.length > 1 && (
                  <path
                    d={rightPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ")}
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="2.5"
                  />
                )}

                {/* Connecting Path Line Left Ear (Blue) */}
                {leftPoints.length > 1 && (
                  <path
                    d={leftPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ")}
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="2.5"
                    strokeDasharray="4 2"
                  />
                )}

                {/* Markers Right Ear - Red Circles */}
                {rightPoints.map((pt) => (
                  <g key={`ptR-${pt.freq}`}>
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="6"
                      fill="#ef4444"
                      className="hover:r-8 transition-all stroke-white stroke-2"
                    />
                    <text
                      x={pt.x + 9}
                      y={pt.y - 4}
                      fontSize="8.5"
                      fontWeight="black"
                      className="fill-rose-600 font-mono"
                    >
                      {pt.db}
                    </text>
                  </g>
                ))}

                {/* Markers Left Ear - Blue Crosses 'X' */}
                {leftPoints.map((pt) => (
                  <g key={`ptL-${pt.freq}`}>
                    <path
                      d={`M ${pt.x - 4.5} ${pt.y - 4.5} L ${pt.x + 4.5} ${pt.y + 4.5} M ${pt.x + 4.5} ${pt.y - 4.5} L ${pt.x - 4.5} ${pt.y + 4.5}`}
                      stroke="#2563eb"
                      strokeWidth="2.8"
                      fill="none"
                    />
                    <text
                      x={pt.x - 9}
                      y={pt.y + 11}
                      fontSize="8.5"
                      fontWeight="black"
                      className="fill-indigo-700 font-mono"
                    >
                      {pt.db}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            {/* QUICK CONTROLS INPUT LIST */}
            <div className="space-y-2 w-full md:w-48 text-left">
              <span className="block text-[8px] font-black uppercase tracking-wider text-slate-400 mb-2">
                {lang === "en" ? `Threshold levels for ${activeEarPlot.toUpperCase()} ear (dB)` : `थ्रेसहोल्ड मान (${activeEarPlot === "right" ? "दायाँ कान" : "बायाँ कान"})`}
              </span>
              
              {FREQUENCIES.map((f) => {
                const currentVal = activeEarPlot === "right" ? audiogram.rightEar[f] : audiogram.leftEar[f];
                return (
                  <div key={`input-${f}`} className="flex items-center justify-between gap-1 border-b border-slate-100 py-1">
                    <span className="text-[10px] font-black font-mono text-slate-500 w-12">{f} Hz</span>
                    <input
                      type="range"
                      min="-10"
                      max="120"
                      step="5"
                      value={currentVal !== undefined ? currentVal : 10}
                      onChange={(e) => handleUpdateThreshold(activeEarPlot, f, parseInt(e.target.value))}
                      className="h-1.5 w-24 bg-slate-200 accent-indigo-600 rounded-lg cursor-pointer"
                    />
                    <span className="text-[10px] font-black font-mono text-slate-800 w-8 text-right">{currentVal}</span>
                  </div>
                );
              })}

              <button
                type="button"
                onClick={resetAudiogram}
                className="w-full flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-750 text-[9px] font-black uppercase py-1.5 px-3 rounded-lg border transition-all mt-3 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{lang === "en" ? "Reset Audiogram" : "ग्राफ रीसेट करें"}</span>
              </button>
            </div>
          </div>

          {/* DIAGNOSTIC PTA CALCULATIONS RESULT CARD */}
          <div className="p-5 border-t border-slate-200 bg-slate-50 grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* RIGHT EAR RESULT Card */}
            {(() => {
              const rPTA = calcPTA("right");
              const rClass = getSeverityClassification(rPTA);
              return (
                <div className="bg-white border-2 border-slate-200 rounded-xl p-3.5 shadow-sm">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">🔴 {lang === "en" ? "Right Ear (दायाँ कान)" : "दायाँ कान"}</span>
                    <span className="text-xs font-black font-mono text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                      PTA: {rPTA} dB
                    </span>
                  </div>
                  <h3 className="text-xs font-black text-slate-800 mb-0.5 uppercase tracking-wide">
                    {lang === "en" ? rClass.en : rClass.hi}
                  </h3>
                  <p className="text-[9px] text-slate-500 font-bold uppercase">
                    {lang === "en" ? "Average sensitivity at 500Hz, 1KHz, 2KHz" : "500Hz, 1KHz, 2KHz के औसत डेसिबल क्षति"}
                  </p>
                </div>
              );
            })()}

            {/* LEFT EAR RESULT Card */}
            {(() => {
              const lPTA = calcPTA("left");
              const lClass = getSeverityClassification(lPTA);
              return (
                <div className="bg-white border-2 border-slate-200 rounded-xl p-3.5 shadow-sm">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">🔵 {lang === "en" ? "Left Ear (बायाँ कान)" : "बायाँ कान"}</span>
                    <span className="text-xs font-black font-mono text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                      PTA: {lPTA} dB
                    </span>
                  </div>
                  <h3 className="text-xs font-black text-slate-800 mb-0.5 uppercase tracking-wide">
                    {lang === "en" ? lClass.en : lClass.hi}
                  </h3>
                  <p className="text-[9px] text-slate-500 font-bold uppercase">
                    {lang === "en" ? "Average sensitivity at 500Hz, 1KHz, 2KHz" : "500Hz, 1KHz, 2KHz के औसत डेसिबल क्षति"}
                  </p>
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* THREE COLUMN GRID FOR IEP SPECIAL GOALS GENERATOR */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm text-left">
        <div className="flex items-center gap-2.5 mb-5 border-b border-slate-200/80 pb-4">
          <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
            <Sparkles className="w-5.5 h-5.5" />
          </div>
          <div>
            <h2 className="text-sm font-black uppercase tracking-widest text-indigo-955">
              {lang === "en" ? "AI-Powered IEP Adaptive Targets & Special Adaptations" : "विशेष शैक्षणिक लक्ष्य और संवर्धित अनुकूलन सूची (IEP Targets)"}
            </h2>
            <p className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wider">
              {lang === "en" ? "Based on Pure Tone Average (PTA) clinical calculations" : "दायाँ और बायाँ कान की न्यूनतम संवेदनशीलता (PTA) आरेख के विश्लेषणानुसार अनुकूलित"}
            </p>
          </div>
        </div>

        {/* Dynamic target formulation cards */}
        {(() => {
          const lPTA = calcPTA("left");
          const rPTA = calcPTA("right");
          const maxPta = Math.max(lPTA, rPTA);

          return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* TARGET 1: Auditory training strategies */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm space-y-3.5">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 bg-indigo-100 text-indigo-700 font-bold rounded-full flex items-center justify-center text-xs">1</span>
                  <h3 className="text-xs uppercase tracking-wider font-extrabold text-indigo-950">
                    {lang === "en" ? "Auditory Training Goals" : "श्रवण प्रशिक्षण पद्धतियाँ (Auditory)"}
                  </h3>
                </div>

                <div className="space-y-2.5 text-xs text-slate-650 font-bold">
                  {maxPta < 26 ? (
                    <p className="text-[11px] leading-relaxed">
                      ✅ {lang === "en" ? "Mild baseline. Practice localizing source sounds and identify soft environmental hums." : "सामन्य स्थिति। विभिन्न दिशाओं से आ रहे ध्वनियों को पहचानने का अभ्यास करवाएं।"}
                    </p>
                  ) : maxPta <= 55 ? (
                    <>
                      <p className="text-[11px] leading-relaxed">
                        🎯 {lang === "en" ? "Goal 1: Discriminate similar phonemes (e.g., 'bat' vs 'pat') with assistive listening devices." : "लक्ष्य १: श्रवण यंत्र की मदद से समान ध्वनियों (जैसे 'प' और 'ब') में स्पष्ट अंतर पहचानना।"}
                      </p>
                      <p className="text-[11px] leading-relaxed">
                        🎯 {lang === "en" ? "Goal 2: Match short spoken instructions to classroom visual cards in medium background noise." : "लक्ष्य २: मध्यम कोलाहल वाले वातावरण में छोटे मौखिक निर्देशों को सही चित्रों से मिलान करना।"}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-[11px] leading-relaxed">
                        🎯 {lang === "en" ? "Goal 1: React consistently to high-intensity warning sounds and alarm signals." : "लक्ष्य १: चेतावनी ध्वनियों और विशेष अलार्म संकेतों पर तुरंत प्रतिक्रिया देने हेतु प्रशिक्षित करना।"}
                      </p>
                      <p className="text-[11px] leading-relaxed">
                        🎯 {lang === "en" ? "Goal 2: Sound awareness training. Detect when sound starts or stops in visual play." : "लक्ष्य २: खेल-खेल में ध्वनि की शुरुआत और अंत (Sound Starts/Stops) को महसूस करना और सूचित करना।"}
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* TARGET 2: Communication adaptation guidelines (PDF 2 details list) */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm space-y-3.5">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 bg-indigo-100 text-indigo-700 font-bold rounded-full flex items-center justify-center text-xs">2</span>
                  <h3 className="text-xs uppercase tracking-wider font-extrabold text-indigo-950">
                    {lang === "en" ? "Speech Reading & Communication" : "संप्रेषण और वाणी विकास (Speech & Communication)"}
                  </h3>
                </div>

                <div className="space-y-2.5 text-xs text-slate-650 font-bold">
                  {maxPta <= 40 ? (
                    <>
                      <p className="text-[11px] leading-relaxed">
                        📌 {lang === "en" ? "Adaptation 1: Face-to-face clear articulation. Maintain eye levels when talking." : "अनुकूलन १: बात करते समय हमेशा आमने-सामने रहें और आँखों का संपर्क (Eye-level contact) बनाए रखें।"}
                      </p>
                      <p className="text-[11px] leading-relaxed">
                        📌 {lang === "en" ? "Adaptation 2: Provide visual lists of vocabulary matching daily routines." : "अनुकूलन २: दैनिक दिनचर्या की शब्दावली को चित्रों और चार्ट के साथ मिलाकर दृश्य रूप में प्रस्तुत करें।"}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-[11px] leading-relaxed">
                        📌 {lang === "en" ? "Adaptation 1: Employ Total Communication (Signed Language + Speech Reading)." : "अनुकूलन १: 'संपूर्ण संप्रेषण' प्रणाली का उपयोग करें (जैसे सांकेतिक भाषा, हाव-भाव और होठों का हिलना)।"}
                      </p>
                      <p className="text-[11px] leading-relaxed">
                        📌 {lang === "en" ? "Adaptation 2: Teach finger-spelling for abstract names and uncommon academic nouns." : "अनुकूलन २: अमूर्त संप्रत्यों और कठिन शैक्षणिक संज्ञाओं के लिए 'अंगुली हिज्जे' (Finger-Spelling) का उपयोग सिखाएं।"}
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* TARGET 3: Environmental modification & assistive device matchings */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm space-y-3.5">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 bg-indigo-100 text-indigo-700 font-bold rounded-full flex items-center justify-center text-xs">3</span>
                  <h3 className="text-xs uppercase tracking-wider font-extrabold text-indigo-950">
                    {lang === "en" ? "Classroom Adaptations & ALD" : "कक्षा कक्ष व्यवस्था व सहायक तकनीक"}
                  </h3>
                </div>

                <div className="space-y-2.5 text-xs text-slate-650 font-bold">
                  <p className="text-[11px] leading-relaxed">
                    ⚙️ <strong>{lang === "en" ? "ALD Match:" : "तकनीक मिलान:"}</strong>{" "}
                    {maxPta < 26 
                      ? (lang === "en" ? "Normal thresholds. Regular checklist monitoring recommended." : "सामान्य सीमा। नियमित छह-मासिक जांच की सलाह दी जाती है।")
                      : maxPta < 56 
                        ? (lang === "en" ? "Monaural or Binaural BTE Hearing Aid. Sound field amplification." : "दोनों कानों में उत्कृष्ट BTE श्रवण सहायक यंत्र (Hearing Aid) तथा क्लासरूम एम्प्लीफायर प्रयोग करें।")
                        : (lang === "en" ? "Group FM Receiver System setup matching teacher mic + auditory loop layout." : "ग्रुप एफएम रिसीवर सिस्टम (FM System) के साथ टीचर माइक्रोफोन और लूप सिस्टम की व्यवस्था सुनिश्चित करें।")}
                  </p>
                  <p className="text-[11px] leading-relaxed">
                    🪑 <strong>{lang === "en" ? "Seating Layout:" : "बैठक व्यवस्था:"}</strong>{" "}
                    {lang === "en" 
                      ? "Prefer semi-circular/U-shaped front row seating so the student can continuously see the teacher and peer communicators without glare." 
                      : "कक्षा में अर्धचंद्राकार (U-Shape) बैठक व्यवस्था का अनुकरण करें ताकि विद्यार्थी शिक्षक व अन्य सहयोगियों के हाव-भाव और संकेतों को सहजता से देख सके।"}
                  </p>
                </div>
              </div>

            </div>
          );
        })()}
      </div>

    </div>
  );
}
