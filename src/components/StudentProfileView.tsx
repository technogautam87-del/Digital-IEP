import React, { useState } from "react";
import { 
  User, 
  School, 
  GraduationCap, 
  FileCheck, 
  Calendar,
  Sliders,
  CheckCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  Printer,
  ChevronRight,
  AlertCircle,
  ThumbsUp,
  Award,
  BookOpen,
  Download,
  Loader2
} from "lucide-react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { StudentProfile, Checklists, EducatorNotes, DomainType, StudentRecord } from "../types";
import { 
  LanguageType, 
  CLASSES_LIST, 
  DISABILITIES_LIST, 
  translationMap, 
  getRoman, 
  calculateAge 
} from "../language";

// Premium background watermark overlay
const WatermarkOverlay = () => (
  <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-20 opacity-[0.035] print:opacity-[0.05] min-h-full">
    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-24 rotate-[-15deg] scale-[1.12] origin-center w-full h-full pt-16 pl-16 text-indigo-950 font-black">
      {Array.from({ length: 48 }).map((_, i) => (
        <div key={i} className="text-xs md:text-sm font-black tracking-widest uppercase font-sans whitespace-nowrap">
          Developed by C.S. GAUTAM
        </div>
      ))}
    </div>
  </div>
);

interface StudentProfileViewProps {
  lang: LanguageType;
  profile: StudentProfile;
  onUpdateProfile: (p: StudentProfile) => void;
  checklists: Checklists;
  onToggleChecklist: (domain: string, id: string) => void;
  notes: EducatorNotes;
  onUpdateNotes: (domain: string, text: string) => void;
  activeDomain: string;
  onChangeDomain: (domain: string) => void;
  draftObjective: string;
  onUpdateObjective: (objective: string) => void;
  showToastMsg: (msg: string, type?: "success" | "info") => void;
  notesSaveStatus?: "saved" | "pending" | "saving";
  objectiveSaveStatus?: "saved" | "pending" | "saving";
  studentsList: StudentRecord[];
  activeStudentId: string;
  onLoadStudent: (id: string, customList?: StudentRecord[]) => void;
  onCreateNewStudent: (id?: string, name?: string) => void;
  onBulkImportStudents: (records: StudentRecord[]) => void;
  onSaveStudent?: (id?: string) => void;
  googleSheetUrl: string;
  onQueryGoogleSheet: (targetId?: string) => void;
}

export default function StudentProfileView({
  lang,
  profile,
  onUpdateProfile,
  checklists,
  onToggleChecklist,
  notes,
  onUpdateNotes,
  activeDomain,
  onChangeDomain,
  draftObjective,
  onUpdateObjective,
  showToastMsg,
  notesSaveStatus = "saved",
  objectiveSaveStatus = "saved",
  studentsList,
  activeStudentId,
  onLoadStudent,
  onCreateNewStudent,
  onBulkImportStudents,
  onSaveStudent,
  googleSheetUrl,
  onQueryGoogleSheet
}: StudentProfileViewProps) {
  
  const t = translationMap[lang];

  // Load school logo from localStorage if present
  const schoolLogo = typeof window !== "undefined" ? localStorage.getItem("iep_school_logo") : null;

  // Local states for search and Google Sheet synchronization
  const [searchIdQuery, setSearchIdQuery] = useState("");

  // Local student registry search function
  const handleLocalSearch = () => {
    const query = searchIdQuery.trim();
    if (!query) {
      showToastMsg(lang === "en" ? "Please enter a Student ID (Roll No) to search" : "कृपया खोजने के लिए छात्र नंबर दर्ज करें", "info");
      return;
    }
    
    const found = studentsList.find(s => s.id === query);
    if (found) {
      onLoadStudent(query);
    } else {
      if (googleSheetUrl) {
        onQueryGoogleSheet(query);
      } else {
        showToastMsg(lang === "en" 
          ? `Student roll number '${query}' not found in active records.` 
          : `इस रोल नंबर '${query}' का रिकॉर्ड सक्रिय सूचि में नहीं मिला।`, 
          "info"
        );
      }
    }
  };

  // PDF report generation progress state
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isPrintPreviewActive, setIsPrintPreviewActive] = useState(false);
  const [currentWizardStep, setCurrentWizardStep] = useState<number>(1);

  // Local state for interactive targets checklist timeline (English and Hindi versions)
  type ReviewType = "Annual Review" | "Six-Month Review" | "Monthly Check-in" | "Weekly Progress";
  const [activeReviewTab, setActiveReviewTab] = useState<ReviewType>("Annual Review");

  const [reviewTargets, setReviewTargets] = useState({
    "Annual Review": {
      en: [
        { id: "ar1", text: "Complete primary baseline observation sets", completed: true },
        { id: "ar2", text: "Conduct parent-teacher advisory alignment meeting", completed: true },
        { id: "ar3", text: "Draft comprehensive measurable annual target objective", completed: false },
        { id: "ar4", text: "Coordinate multi-disciplinary specialist placement review", completed: false }
      ],
      hi: [
        { id: "ar1", text: "प्राथमिक आधारभूत अवलोकन सेट पूरा करें", completed: true },
        { id: "ar2", text: "अभिभावक-शिक्षक सलाहकार संरेखण बैठक आयोजित करें", completed: true },
        { id: "ar3", text: "व्यापक मापने योग्य वार्षिक लक्ष्य उद्देश्य का मसौदा तैयार करें", completed: false },
        { id: "ar4", text: "बहु-विषयक विशेषज्ञ प्लेसमेंट समीक्षा का समन्वय करें", completed: false }
      ]
    },
    "Six-Month Review": {
      en: [
        { id: "sr1", text: "Verify 1-on-1 visual prompt learning indicators", completed: true },
        { id: "sr2", text: "Collect physical motor coordination raw traces", completed: false },
        { id: "sr3", text: "Formulate intermediate accommodations reporting sheet", completed: false }
      ],
      hi: [
        { id: "sr1", text: "1-ऑन-1 दृश्य संकेत सीखने के संकेतकों को सत्यापित करें", completed: true },
        { id: "sr2", text: "शारीरिक मोटर समन्वय कच्चे निशान एकत्र करें", completed: false },
        { id: "sr3", text: "मध्यवर्ती आवास रिपोर्टिंग शीट तैयार करें", completed: false }
      ]
    },
    "Monthly Check-in": {
      en: [
        { id: "mr1", text: "Monitor task focus and redirection latency", completed: true },
        { id: "mr2", text: "Coordinate peer group cooperative play metrics", completed: false }
      ],
      hi: [
        { id: "mr1", text: "कार्य ध्यान और पुनर्निर्देशन विलंबता की निगरानी करें", completed: true },
        { id: "mr2", text: "सहकर्मी समूह सहकारी खेल मेट्रिक्स का समन्वय करें", completed: false }
      ]
    },
    "Weekly Progress": {
      en: [
        { id: "wr1", text: "Record daily attention limits", completed: true },
        { id: "wr2", text: "Conduct simple 1-step directions drill", completed: true }
      ],
      hi: [
        { id: "wr1", text: "दैनिक ध्यान सीमा रिकॉर्ड करें", completed: true },
        { id: "wr2", text: "सरल 1-चरणीय निर्देश ड्रिल आयोजित करें", completed: true }
      ]
    }
  });

  const handleToggleTarget = (tab: ReviewType, targetId: string) => {
    // We modify both lists to stay synchronous
    const currentTabTargets = reviewTargets[tab];
    const enUpdated = currentTabTargets.en.map(t => t.id === targetId ? { ...t, completed: !t.completed } : t);
    const hiUpdated = currentTabTargets.hi.map(t => t.id === targetId ? { ...t, completed: !t.completed } : t);

    setReviewTargets({
      ...reviewTargets,
      [tab]: {
        en: enUpdated,
        hi: hiUpdated
      }
    });
    
    showToastMsg(lang === "en" ? "Progress Milestones modified successfully" : "प्रगति मील का पत्थर संशोधित किया गया", "info");
  };

  // Generate real-time progress based on active milestones checked
  const currentTargets = reviewTargets[activeReviewTab][lang];
  const completedTargetsCount = currentTargets.filter(t => t.completed).length;
  const targetProgressPercent = currentTargets.length > 0 
    ? Math.round((completedTargetsCount / currentTargets.length) * 100)
    : 0;

  // Enforce required completion of every single domain (either dynamic or default)
  // Each domain is considered complete if at least 1 checkbox in it is selected.
  const activeDomainsList = Object.keys(checklists);
  const currentIndex = activeDomainsList.indexOf(activeDomain);
  
  const validateDomains = () => {
    const status: Record<string, boolean> = {};
    let allValid = true;

    activeDomainsList.forEach(domain => {
      const items = checklists[domain] || [];
      const hasChecked = items.some(item => item.checked === true);
      status[domain] = hasChecked;
      if (!hasChecked) {
        allValid = false;
      }
    });

    return { status, allValid };
  };

  const { status: domainValidations, allValid: allDomainsCompleted } = validateDomains();

  const handlePrint = () => {
    if (!allDomainsCompleted) {
      alert(lang === "en" ? "Warning: All active domains are mandatory. Select at least one item or 'None of the above' in every domain before generating report!" : "चेतावनी: सभी सक्रिय डोमेन अनिवार्य हैं। रिपोर्ट प्रिंट करने से पहले प्रत्येक डोमेन में कम से कम एक विकल्प या 'उपरोक्त में से कोई नहीं' का चयन करें!");
      return;
    }
    window.print();
  };

  const sanitizeColorFunctions = (cssText: string): string => {
    let result = "";
    let i = 0;
    while (i < cssText.length) {
      if (cssText.startsWith("oklch(", i) || cssText.startsWith("oklab(", i)) {
        i += 6;
        let depth = 1;
        while (i < cssText.length && depth > 0) {
          if (cssText[i] === "(") depth++;
          else if (cssText[i] === ")") depth--;
          i++;
        }
        result += "rgb(99, 102, 241)";
      } else {
        result += cssText[i];
        i++;
      }
    }
    return result;
  };

  const handleDownloadPdf = async () => {
    // Temporary storage for style states to restore after canvas generation
    const originalStylesList: { el: HTMLStyleElement; text: string }[] = [];
    const originalLinksList: { el: HTMLLinkElement; originalDisabled: boolean }[] = [];
    const tempStyleElements: HTMLStyleElement[] = [];
    const originalDisabledSheets: { sheet: CSSStyleSheet; originalDisabled: boolean }[] = [];
    let originalGetComputedStyle: typeof window.getComputedStyle | null = null;

    try {
      setIsGeneratingPdf(true);
      showToastMsg(lang === "en" ? "Assembling academic IEP certificate..." : "शैक्षणिक रिपोर्ट संकलित की जा रही है...", "info");

      // Temporarily override window.getComputedStyle to intercept oklch/oklab color computed values on the elements
      originalGetComputedStyle = window.getComputedStyle;
      window.getComputedStyle = (elt: Element, pseudoElt?: string | null): any => {
        const style = originalGetComputedStyle.call(window, elt, pseudoElt);
        return new Proxy(style, {
          get(target: any, prop: string | symbol) {
            if (prop === "getPropertyValue") {
              return (propertyName: string) => {
                const val = target.getPropertyValue(propertyName);
                if (typeof val === "string" && (val.includes("oklch") || val.includes("oklab"))) {
                  return "rgb(99, 102, 241)";
                }
                return val;
              };
            }
            const val = target[prop];
            if (typeof val === "string" && (val.includes("oklch") || val.includes("oklab"))) {
              return "rgb(99, 102, 241)";
            }
            if (typeof val === "function") {
              return val.bind(target);
            }
            return val;
          }
        });
      };

      // PRE-PROCESS AND SANITIZE ALL STYLES TO BYPASS HTML2CANVAS OKLCH/OKLAB PARSING CRASH
      // 1. Sanitize <style> tags containing oklch or oklab
      const styleElements = Array.from(document.querySelectorAll("style"));
      for (const styleEl of styleElements) {
        if (styleEl.textContent && (styleEl.textContent.includes("oklch") || styleEl.textContent.includes("oklab"))) {
          originalStylesList.push({ el: styleEl, text: styleEl.textContent });
          styleEl.textContent = sanitizeColorFunctions(styleEl.textContent);
        }
      }

      // 2. Sanitize same-origin <link rel="stylesheet"> tags by replacing oklch/oklab and converting to <style> tags
      const linkElements = Array.from(document.querySelectorAll("link[rel='stylesheet']")) as HTMLLinkElement[];
      for (const linkEl of linkElements) {
        try {
          if (linkEl.href && linkEl.href.startsWith(window.location.origin)) {
            originalLinksList.push({ el: linkEl, originalDisabled: linkEl.disabled });
            
            // Fetch original CSS
            const res = await fetch(linkEl.href);
            const cssText = await res.text();
            
            // Sanitize oklch and oklab
            const sanitizedCss = sanitizeColorFunctions(cssText);
            
            // Create matching style element
            const tempStyle = document.createElement("style");
            tempStyle.setAttribute("data-html2canvas-temp", "true");
            tempStyle.textContent = sanitizedCss;
            document.head.appendChild(tempStyle);
            tempStyleElements.push(tempStyle);

            // Disable original link
            linkEl.disabled = true;
          }
        } catch (e) {
          console.warn("Could not sanitize link stylesheet:", linkEl.href, e);
        }
      }

      // 3. Temporarily disable cross-origin stylesheets that cannot be sanitized to prevent html2canvas color crash
      for (let j = 0; j < document.styleSheets.length; j++) {
        const sheet = document.styleSheets[j];
        try {
          const rules = sheet.cssRules; // will throw if cross-origin / CORS restricted
          if (sheet.ownerNode && (sheet.ownerNode as Element).getAttribute("data-html2canvas-temp") === "true") {
            continue;
          }
        } catch (e) {
          originalDisabledSheets.push({ sheet, originalDisabled: sheet.disabled });
          sheet.disabled = true;
        }
      }

      // Give browser brief window to let UI paint and sync before capture
      await new Promise(resolve => setTimeout(resolve, 800));

      const element = document.getElementById("iep-pdf-report-template");
      if (!element) {
        throw new Error("PDF report element template not found in the DOM");
      }

      // Image audit ledger tracking function ("छवियों का विवरण लेखा-जोखा")
      const auditAndPreloadImageAssets = async (container: HTMLElement) => {
        const imgElements = Array.from(container.querySelectorAll("img"));
        console.log("%c--- 📋 STARTING IMAGE AUDIT LEDGER (छवि लेखा-जोखा प्रारंभ) ---", "color: #4f46e5; font-weight: bold; font-family: sans-serif; font-size: 11px;");
        
        const ledger: any[] = [];
        const promises = imgElements.map((img, index) => {
          const startTime = performance.now();
          const srcType = img.src.startsWith("data:") ? "BASE64_DATA_URI" : "EXTERNAL_URL_LINK";
          const friendlyName = img.alt || `Report Image [${index + 1}]`;
          
          return new Promise<void>((resolve) => {
            const currentImgRecord = {
              id: img.id || `img_${index + 1}`,
              name: friendlyName,
              src: img.src.substring(0, 80) + (img.src.length > 80 ? "..." : ""),
              sourceType: srcType,
              loadStatus: "PENDING",
              naturalWidth: 0,
              naturalHeight: 0,
              renderedWidth: img.clientWidth || img.width,
              renderedHeight: img.clientHeight || img.height,
              loadDurationMs: 0,
              isComplete: img.complete
            };

            const onLoaded = () => {
              const endTime = performance.now();
              currentImgRecord.loadStatus = "SUCCESS";
              currentImgRecord.naturalWidth = img.naturalWidth;
              currentImgRecord.naturalHeight = img.naturalHeight;
              currentImgRecord.loadDurationMs = Math.round(endTime - startTime);
              currentImgRecord.isComplete = true;
              
              console.log(
                `%c✔ Loaded Image: "${friendlyName}" [Type: ${srcType}] - ${currentImgRecord.naturalWidth}x${currentImgRecord.naturalHeight} px in ${currentImgRecord.loadDurationMs}ms`,
                "color: #10b981; font-weight: bold;"
              );
              ledger.push(currentImgRecord);
              resolve();
            };

            const onError = () => {
              const endTime = performance.now();
              currentImgRecord.loadStatus = "ERROR";
              currentImgRecord.loadDurationMs = Math.round(endTime - startTime);
              
              console.error(`❌ Failed to load Image: "${friendlyName}" [Type: ${srcType}]`);
              ledger.push(currentImgRecord);
              resolve();
            };

            if (img.complete && img.naturalWidth > 0) {
              onLoaded();
            } else {
              img.crossOrigin = "anonymous";
              img.addEventListener("load", onLoaded, { once: true });
              img.addEventListener("error", onError, { once: true });
              // Force reload
              const originalSrc = img.src;
              img.src = originalSrc;
            }
          });
        });

        await Promise.all(promises);
        console.log("%c--- 📊 FINAL IMAGE AUDIT LEDGER REPORT ---", "color: #312e81; font-weight: bold; font-size: 11px;");
        if (typeof console.table === "function" && ledger.length > 0) {
          console.table(ledger);
        } else {
          console.log(JSON.stringify(ledger, null, 2));
        }
        return ledger;
      };

      // Perform complete audit and wait for all images to resolve
      const imageLedger = await auditAndPreloadImageAssets(element);
      if (imageLedger.length > 0) {
        showToastMsg(
          lang === "en" 
            ? `Verified & logged ${imageLedger.length} print template image asset(s).` 
            : `${imageLedger.length} रिपोर्ट छवि(यों) का सत्यापन और लेखा-जोखा सहेज लिया गया है।`,
          "success"
        );
      }

      // Render the high fidelity template to canvas (high-DPI capture)
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      
      // Calculate layout matching standard A4 dimensions (210mm x 297mm)
      const pdfWidth = 210; // mm
      const pageHeight = 295; // mm (slightly less than 297 to avoid overflow pages)
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      let heightLeft = imgHeight;
      let position = 0;

      // Render first A4 page snippet
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
      heightLeft -= pageHeight;

      // Loop to render remaining A4 pages as needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save("Report.pdf");

      showToastMsg(lang === "en" ? "IEP PDF Report downloaded automatically!" : "आई.ई.पी. पीडीएफ रिपोर्ट स्वचालित रूप से डाउनलोड हो गई है!");
    } catch (err) {
      console.error("PDF compiling error:", err);
      alert("Failed to compile PDF automatically. Please try the printer option.");
    } finally {
      // Restore computed style getter
      if (originalGetComputedStyle) {
        window.getComputedStyle = originalGetComputedStyle;
      }

      // Restore CORS-blocked stylesheets
      for (const item of originalDisabledSheets) {
        item.sheet.disabled = item.originalDisabled;
      }

      // RESTORE ALL ORIGINAL STYLESHEETS AND REMOVE SANITIZED TEMP BLOCKS
      // 1. Restore style tags
      for (const item of originalStylesList) {
        item.el.textContent = item.text;
      }
      
      // 2. Restore link tags
      for (const item of originalLinksList) {
        item.el.disabled = item.originalDisabled;
      }
      
      // 3. Remove temp styles
      for (const tempStyle of tempStyleElements) {
        if (tempStyle.parentNode) {
          tempStyle.parentNode.removeChild(tempStyle);
        }
      }

      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-8 print:bg-white print:text-black relative">
      <style>{`
        @media print {
          /* Hide standard editing layouts and print preview controls */
          .print-hidden, .no-print, nav, footer, button, select, input, textarea, header, [role="tablist"] {
            display: none !important;
            visibility: hidden !important;
          }
          
          body, html {
            background: white !important;
            color: black !important;
            width: 210mm !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
          }

          /* Force browser colors */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Style target template perfectly to scale full A4 */
          #iep-pdf-report-template {
            position: absolute !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            top: 0 !important;
            width: 210mm !important;
            min-height: 297mm !important;
            border: none !important;
            box-shadow: none !important;
            padding: 10mm !important;
            margin: 0 !important;
            display: flex !important;
            flex-direction: column !important;
            visibility: visible !important;
          }

          #iep-pdf-report-template *, #iep-pdf-report-school-logo {
            visibility: visible !important;
            display: block !important;
          }
        }
      `}</style>
      
      {/* Decorative repeating backdrop watermark */}
      <WatermarkOverlay />

      {/* Loading micro overlay during automatic PDF compiling */}
      {isGeneratingPdf && (
        <div className="fixed inset-0 z-[100] bg-slate-950/40 backdrop-blur-sm flex flex-col items-center justify-center gap-4 text-white">
          <div className="bg-white p-8 rounded-2xl shadow-2xl border-2 border-slate-100 flex flex-col items-center gap-4 text-slate-800 text-center max-w-sm animate-pulse">
            <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
            <h3 className="font-extrabold text-indigo-950 text-sm uppercase tracking-wider">{lang === "en" ? "Generating Formal PDF..." : "आई.ई.पी. पीडीएफ तैयार हो रहा है..."}</h3>
            <p className="text-[11px] text-slate-405 font-medium leading-relaxed">{lang === "en" ? "Drafting credential seals, calculating domains checklists and attaching watermark signatures..." : "आधिकारिक सील संकलित की जा रही है और 'Developed by C.S. GAUTAM' का वाटरमार्क संलग्न किया जा रहा है..."}</p>
          </div>
        </div>
      )}

      {/* PRINT PREVIEW CONTROL BAR */}
      {isPrintPreviewActive && (
        <div className="no-print bg-gradient-to-r from-indigo-900 to-slate-900 border-2 border-indigo-950 text-white p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 sticky top-4 z-[40] shadow-xl">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsPrintPreviewActive(false)}
              className="bg-indigo-950/60 hover:bg-indigo-950 text-indigo-200 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-indigo-800/60 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{lang === "en" ? "Exit Preview" : "पूर्वावलोकन बंद करें"}</span>
            </button>
            <div className="text-left">
              <span className="p-1 px-2.5 rounded-full text-[9px] uppercase font-bold tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {lang === "en" ? "Print-Ready Layout Active" : "प्रिंट-तैयार लेआउट सक्रिय"}
              </span>
              <div className="text-[11px] text-slate-300 font-medium mt-1">
                {profile.studentName || (lang === "en" ? "Unnamed Student" : "अनाम छात्र")} • ID: {profile.studentId || activeStudentId}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => window.print()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 border-b-4 border-indigo-800 active:translate-y-[1px] active:border-b-2 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-indigo-100" />
              <span>{lang === "en" ? "Print Document (Ctrl+P)" : "दस्तावेज़ प्रिंट करें (Ctrl+P)"}</span>
            </button>

            <button 
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-700 text-white px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 border-b-4 border-emerald-800 active:translate-y-[1px] active:border-b-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-100" />
              <span>{lang === "en" ? "Download Formal PDF" : "आई.ई.पी. पीडीएफ डाउनलोड"}</span>
            </button>
          </div>
        </div>
      )}

      {/* STANDARD EDITING WORKSPACE WRAPPER */}
      <div className={isPrintPreviewActive ? "hidden" : "w-full flex flex-col gap-8 print-hidden"}>

      {/* HEADER SECTION WITH TITLE & PRINT / DOWNLOAD AUTOMATIC */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-indigo-100 p-6 rounded-2xl shadow-sm print:hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          {schoolLogo && (
            <img 
              src={schoolLogo} 
              alt="School Logo" 
              className="h-14 w-14 object-contain rounded-xl border-2 border-indigo-200 p-1 bg-white shadow-sm flex-shrink-0"
              referrerPolicy="no-referrer"
            />
          )}
          <div>
            <div className="flex items-center flex-wrap gap-2 mb-1.5">
              <h1 className="text-2xl font-bold text-indigo-950 tracking-wide font-sans flex items-center gap-2">
                {!schoolLogo && <BookOpen className="text-indigo-600 w-6 h-6" />}
                {lang === "en" ? "Individualized Education Program Tracker" : "विशेष छात्र आई.ई.पी. डैशबोर्ड"}
              </h1>
            <span className={`p-1 px-2.5 rounded-full text-[10px] uppercase font-bold tracking-widest border flex items-center gap-1.5 ${
              allDomainsCompleted 
                ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                : "bg-amber-100 text-amber-800 border-amber-300 animate-pulse"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${allDomainsCompleted ? "bg-emerald-500" : "bg-amber-500 animate-pulse"}`} />
              {allDomainsCompleted ? t.activeDraft : (lang === "en" ? "Incomplete Profile" : "अपूर्ण प्रोफाइल")}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium leading-normal max-w-2xl">
            {lang === "en" 
              ? "Comprehensive digital child profile for special schools. Manage milestones, daily activities, automatic age checks, and required domains diagnostics."
              : "विशेष स्कूलों के लिए व्यापक डिजिटल छात्र प्रोफ़ाइल। लक्ष्यों, दैनिक गतिविधियों, आयु और अनिवार्य डोमेन निदान का प्रबंधन करें।"}
          </p>
        </div>
      </div>

        <div className="flex flex-wrap items-center gap-2.5 self-stretch lg:self-auto justify-end">
          <button
            onClick={() => setIsPrintPreviewActive(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold px-5 py-3 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2 border-b-4 border-indigo-800 active:translate-y-[2px] active:border-b-2"
          >
            <Printer className="w-4 h-4 text-indigo-100" />
            <span>{lang === "en" ? "Print Preview" : "प्रिंट प्रीव्यू"}</span>
          </button>

          {/* Active Save Action represent "Save data to local registry and download updated CSV" */}
          {onSaveStudent && (
            <button
              onClick={() => onSaveStudent()}
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold px-5 py-3 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2 border-b-4 border-amber-800 active:translate-y-[2px] active:border-b-2"
            >
              <FileCheck className="w-4.5 h-4.5 text-amber-100" />
              <span>{lang === "en" ? "Save & VLookup Update" : "डेटा सुरक्षित करें (Save)"}</span>
            </button>
          )}
        </div>
      </div>

      {/* PROFESSIONAL MULTI-STEP IEP WIZARD BAR */}
      <div className="bg-white border-2 border-slate-200 p-4 md:p-5 rounded-2xl shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 print:hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 flex-1">
          <div className="bg-indigo-50 p-2.5 rounded-xl border border-indigo-150 text-indigo-700 flex-shrink-0">
            <Sliders className="w-5 h-5 animate-spin" style={{ animationDuration: '10s' }} />
          </div>
          <div className="text-left">
            <h3 className="text-xs font-black uppercase tracking-widest text-indigo-950 font-sans">
              {lang === "en" ? "Guided IEP Form Progress Wizard" : "आई.ई.पी. प्रपत्र प्रगति सहायक (चरण-दर-चरण)"}
            </h3>
            <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">
              {lang === "en" 
                ? "Follow the page-by-page progress from basic details to official final compilation." 
                : "व्यक्तिगत विवरण से लेकर अंतिम आधिकारिक संकलन तक क्रमवार आगे बढ़ें।"}
            </p>
          </div>
        </div>

        {/* Stepper circles */}
        <div className="flex items-center gap-1.5 md:gap-3 flex-wrap justify-start md:justify-end">
          {([
            { step: 1, labelEn: "Demographics", labelHi: "विवरण" },
            { step: 2, labelEn: "Target Cycle", labelHi: "काल चक्र" },
            { step: 3, labelEn: "Domains (22)", labelHi: "चेकलिस्ट" },
            { step: 4, labelEn: "Milestones", labelHi: "टाइमलाइन" },
            { step: 5, labelEn: "Submit IEP", labelHi: "सबमिट" }
          ]).map((item) => {
            const isCompleted = currentWizardStep > item.step;
            const isActive = currentWizardStep === item.step;
            return (
              <button
                key={item.step}
                onClick={() => setCurrentWizardStep(item.step)}
                className={`py-2 px-3 md:px-4 rounded-xl border-2 font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                  isActive 
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md scale-105" 
                    : isCompleted
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : "bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-105 hover:text-slate-700"
                }`}
              >
                <span className={`w-5 h-5 text-[10px] rounded-full flex items-center justify-center font-black ${
                  isActive 
                    ? "bg-white text-indigo-950" 
                    : isCompleted
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-205 text-slate-500"
                }`}>
                  {isCompleted ? "✔" : item.step}
                </span>
                <span className="hidden sm:inline font-sans font-heavy tracking-tight text-[10px] uppercase">
                  {lang === "en" ? item.labelEn : item.labelHi}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {currentWizardStep === 1 && (
        <>
          {/* LOCAL STUDENT SEARCH DIRECTORY HUB */}
      <div className="print:hidden w-full bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-indigo-100">
            <User className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xs uppercase tracking-wider text-indigo-950 font-extrabold font-sans">
              {lang === "en" ? "Student Search Registry (Student Roll Number)" : "प्रत्येक बच्चे का नंबर खोज एवं डेटा विवरणी"}
            </h2>
          </div>

          <p className="text-[11px] text-slate-500 font-semibold mb-4 leading-relaxed uppercase">
            {lang === "en" 
              ? "Search for child profiles using their unique assigned identification number or roll number to reload their complete diagnostic IEP records."
              : "प्रत्येक बच्चे के आवंटित नंबर/रोल नंबर से खोजें। सर्च करने पर उस बच्चे की चेकलिस्ट, स्पेशल शिक्षक टिप्पणियाँ और वार्षिक लक्ष्य पूरी तरह बदल जाएँगे।"}
          </p>

          {/* Live Search Form */}
          <div className="flex gap-2.5 mb-4">
            <input
              type="text"
              value={searchIdQuery}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleLocalSearch();
              }}
              onChange={(e) => setSearchIdQuery(e.target.value)}
              placeholder={lang === "en" ? "Enter Student Number (e.g., 1001, 1002)..." : "बच्चे का नंबर दर्ज करें (जैसे 1001, 1002)..."}
              className="flex-1 bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-850 focus:outline-none focus:border-indigo-500 placeholder-slate-400 font-sans"
            />
            <button
              onClick={handleLocalSearch}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5 border-b-2 border-indigo-800 cursor-pointer"
            >
              <span>{lang === "en" ? "Search" : "नंबर खोजें"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
          <div className="text-[11px] text-indigo-950 font-bold flex items-center gap-1.5">
            <span className="text-xs">👤</span>
            <span>
              {lang === "en" ? "Editing Profile ID" : "सक्रिय छात्र संपादन नंबर"}: <strong className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">{profile.studentId || activeStudentId}</strong>
            </span>
          </div>
          {/* Educational Block */}
          <div className="flex flex-col gap-2">
            <label className="text-slate-600 font-semibold tracking-wide uppercase text-[10px] flex items-center gap-1.5 text-indigo-950 font-bold">
              <span>🏠 Educational Block (ब्लॉक दर्ज करें)</span>
            </label>
            <input
              type="text"
              value={profile.block || ""}
              onChange={(e) => onUpdateProfile({ ...profile, block: e.target.value })}
              placeholder="e.g. Block Name"
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-2.5 px-3 text-slate-900 font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-xs"
            />
          </div>

          {/* Educational District */}
          <div className="flex flex-col gap-2">
            <label className="text-slate-600 font-semibold tracking-wide uppercase text-[10px] flex items-center gap-1.5 text-indigo-950 font-bold">
              <span>📍 Educational District (जिला दर्ज करें)</span>
            </label>
            <input
              type="text"
              value={profile.district || ""}
              onChange={(e) => onUpdateProfile({ ...profile, district: e.target.value })}
              placeholder="e.g. District Name"
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-2.5 px-3 text-slate-900 font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-xs"
            />
          </div>

        </div>
      </div>


      {/* BLOCK 1: Student Demographics & AUTOMATIC AGE CALCULATIONS */}
      <div className="bg-white border-2 border-slate-200 p-6 md:p-8 rounded-2xl shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-indigo-700" />
        
        <div className="flex items-center gap-2 mb-6">
          <User className="text-indigo-600 w-5 h-5" />
          <h2 className="text-sm uppercase tracking-wider text-indigo-950 font-extrabold font-sans">
            {lang === "en" ? "Student Demographics & Context" : "छात्र जनसांख्यिकी और प्रसंग विवरण"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-slate-800 text-xs">
          
          {/* School Name */}
          <div className="flex flex-col gap-2">
            <label className="text-slate-600 font-semibold tracking-wide uppercase text-[10px] flex items-center gap-1">
              <span>{t.schoolName}</span>
              <span className="text-[9px] text-slate-400 font-normal">({translationMap.hi.schoolName})</span>
            </label>
            <div className="relative">
              <School className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={profile.schoolName}
                onChange={(e) => onUpdateProfile({ ...profile, schoolName: e.target.value })}
                placeholder={t.schoolPlaceholder}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-2.5 pl-10 pr-3 text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-indigo-505 focus:bg-white transition-all text-xs"
              />
            </div>
          </div>

          {/* Student Name */}
          <div className="flex flex-col gap-2">
            <label className="text-slate-600 font-semibold tracking-wide uppercase text-[10px] flex items-center gap-1">
              <span>{t.studentName}</span>
              <span className="text-[9px] text-slate-400 font-normal">({translationMap.hi.studentName})</span>
            </label>
            <div className="relative">
              <GraduationCap className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={profile.studentName}
                onChange={(e) => onUpdateProfile({ ...profile, studentName: e.target.value })}
                placeholder={t.studentPlaceholder}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-2.5 pl-10 pr-3 text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-indigo-505 focus:bg-white transition-all text-xs"
              />
            </div>
          </div>

          {/* Date of Birth Selection */}
          <div className="flex flex-col gap-2">
            <label className="text-slate-600 font-semibold tracking-wide uppercase text-[10px] flex items-center gap-1">
              <span>{t.birthDate}</span>
              <span className="text-[9px] text-slate-400 font-normal">({translationMap.hi.birthDate})</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="date"
                value={profile.dateOfBirth}
                onChange={(e) => onUpdateProfile({ ...profile, dateOfBirth: e.target.value })}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-2.5 pl-10 pr-3 text-slate-900 font-medium focus:outline-none focus:border-indigo-505 focus:bg-white transition-all text-xs"
              />
            </div>
          </div>

          {/* AUTOMATIC AGE DISPLAY BADGE (Real-time calculation!) */}
          <div className="flex flex-col gap-2">
            <label className="text-slate-600 font-semibold tracking-wide uppercase text-[10px] flex items-center gap-1">
              <span>{t.age}</span>
              <span className="text-[9px] text-slate-400 font-normal">({translationMap.hi.age})</span>
            </label>
            <div className="bg-indigo-50 border-2 border-indigo-150 p-2.5 rounded-xl text-xs font-bold text-indigo-950 flex items-center gap-2 h-[41px]">
              <Clock className="w-4 h-4 text-indigo-600 animate-pulse" />
              <span>{calculateAge(profile.dateOfBirth, lang)}</span>
            </div>
          </div>

          {/* Class Grade Range Selection (Pre-Primary through 12th) */}
          <div className="flex flex-col gap-2">
            <label className="text-slate-600 font-semibold tracking-wide uppercase text-[10px]">
              {t.classGrade} ({translationMap.hi.classGrade})
            </label>
            <select
              value={profile.className}
              onChange={(e) => onUpdateProfile({ ...profile, className: e.target.value })}
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-2.5 px-3 text-slate-900 font-medium focus:outline-none focus:border-indigo-505 focus:bg-white transition-all text-xs h-[41px]"
            >
              {CLASSES_LIST.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls[lang]} (Grade {cls.id.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          {/* Disability Type (Full 21 categories aligned to RPwD Act 2016 India) */}
          <div className="flex flex-col gap-2">
            <label className="text-slate-600 font-semibold tracking-wide uppercase text-[10px]">
              {t.disabilityType} ({translationMap.hi.disabilityType})
            </label>
            <select
              value={profile.disabilityType}
              onChange={(e) => onUpdateProfile({ ...profile, disabilityType: e.target.value })}
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-2.5 px-3 text-slate-900 font-medium focus:outline-none focus:border-indigo-505 focus:bg-white transition-all text-xs h-[41px]"
            >
              {DISABILITIES_LIST.map((dis) => (
                <option key={dis.id} value={dis.id}>
                  {dis.id}. {dis[lang]}
                </option>
              ))}
            </select>
          </div>

          {/* General Teacher */}
          <div className="flex flex-col gap-2">
            <label className="text-slate-600 font-semibold tracking-wide uppercase text-[10px]">
              {t.generalTeacher} ({translationMap.hi.generalTeacher})
            </label>
            <input
              type="text"
              value={profile.generalTeacher}
              onChange={(e) => onUpdateProfile({ ...profile, generalTeacher: e.target.value })}
              placeholder={t.generalTeacherPlaceholder}
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-2.5 px-3 text-slate-950 font-medium focus:outline-none focus:border-indigo-505 focus:bg-white transition-all text-xs"
            />
          </div>

          {/* Special educator Details */}
          <div className="flex flex-col gap-2">
            <label className="text-slate-600 font-semibold tracking-wide uppercase text-[10px]">
              {t.specialTeacher} ({translationMap.hi.specialTeacher})
            </label>
            <input
              type="text"
              value={profile.specialTeacher}
              onChange={(e) => onUpdateProfile({ ...profile, specialTeacher: e.target.value })}
              placeholder={t.specialTeacherPlaceholder}
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-2.5 px-3 text-slate-955 font-medium focus:outline-none focus:border-indigo-505 focus:bg-white transition-all text-xs"
            />
          </div>

          {/* Student ID / unique Roll Number */}
          <div className="flex flex-col gap-2">
            <label className="text-slate-600 font-semibold tracking-wide uppercase text-[10px] flex items-center gap-1.5 text-indigo-950 font-bold">
              <span>👤 Student Roll ID (नंबर दर्ज करें)</span>
            </label>
            <input
              type="text"
              value={profile.studentId || ""}
              onChange={(e) => onUpdateProfile({ ...profile, studentId: e.target.value })}
              placeholder="e.g. 1001"
              className="w-full bg-indigo-50/50 border-2 border-indigo-200 rounded-xl py-2.5 px-3 text-slate-900 font-bold focus:outline-none focus:border-indigo-600 focus:bg-white transition-all text-xs"
            />
          </div>

          {/* Educational Block */}
          <div className="flex flex-col gap-2">
            <label className="text-slate-600 font-semibold tracking-wide uppercase text-[10px] flex items-center gap-1.5 text-indigo-950 font-bold">
              <span>🏠 Educational Block (ब्लॉक दर्ज करें)</span>
            </label>
            <input
              type="text"
              value={profile.block || ""}
              onChange={(e) => onUpdateProfile({ ...profile, block: e.target.value })}
              placeholder="e.g. Block Name"
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-2.5 px-3 text-slate-900 font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-xs"
            />
          </div>

          {/* Educational District */}
          <div className="flex flex-col gap-2">
            <label className="text-slate-600 font-semibold tracking-wide uppercase text-[10px] flex items-center gap-1.5 text-indigo-950 font-bold">
              <span>📍 Educational District (जिला दर्ज करें)</span>
            </label>
            <input
              type="text"
              value={profile.district || ""}
              onChange={(e) => onUpdateProfile({ ...profile, district: e.target.value })}
              placeholder="e.g. District Name"
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-2.5 px-3 text-slate-900 font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-xs"
            />
          </div>

        </div>
      </div>

      {/* Action Row for Step 1 -> Step 2 */}
      <div className="flex justify-end p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl print:hidden">
        <button
          onClick={() => setCurrentWizardStep(2)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black px-6 py-3.5 rounded-xl shadow border-b-4 border-indigo-800 active:translate-y-[1px] active:border-b-2 flex items-center gap-1.5 cursor-pointer transition-all"
        >
          <span>{lang === "en" ? "Continue to Target Cycle" : "काल चक्र चयन पर जाएँ"}</span>
          <ArrowRight className="w-4.5 h-4.5 text-white" />
        </button>
      </div>
    </>
  )}

  {currentWizardStep === 2 && (
    <>
      {/* SECTION 1: MANDATORY TARGET CYCLE SELECTOR */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden shadow-sm p-6 print:hidden">
        <div className="bg-gradient-to-r from-indigo-950 to-slate-900 text-white p-6 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="text-left">
            <span className="text-[10px] uppercase font-black tracking-widest text-indigo-300">
              STEP 1: INITIALIZE LEARNING TARGET PERIOD (शिक्षण परिणाम काल चक्र पहले चुनें)
            </span>
            <h2 className="text-sm font-bold mt-1 text-slate-100">
              {lang === "en" ? "Select Child Evaluation Target Interval Cycle" : "बच्चे के लिए मूल्यांकन/समीक्षा लक्ष्य चक्र चुनें"}
            </h2>
            <p className="text-[11px] text-slate-350 leading-relaxed max-w-xl mt-1.5 font-medium">
              {lang === "en"
                ? "Statutory IEP requirements mandate setting a milestone target evaluation span (6 Months, Monthly, or Weekly) prior to filling details."
                : "नियमों के अनुसार विवरण भरने से पहले मूल्यांकन अंतराल चक्र (६ महीने, मासिक, या साप्ताहिक) का चयन करना अनिवार्य है।"}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 md:self-center w-full md:w-auto">
            {([
              { id: "weekly", labelEn: "Weekly", labelHi: "साप्ताहिक" },
              { id: "monthly", labelEn: "Monthly", labelHi: "मासिक" },
              { id: "6monthly", labelEn: "6-Monthly", labelHi: "६-मासिक" }
            ] as const).map(({ id, labelEn, labelHi }) => {
              const isSelected = profile.learningOutcomeCycle === id;
              return (
                <button
                  key={id}
                  onClick={() => onUpdateProfile({ ...profile, learningOutcomeCycle: id })}
                  className={`flex-1 md:flex-initial py-2.5 px-4 rounded-xl border font-bold text-xs transition-all flex flex-col items-center justify-center cursor-pointer min-w-[100px] ${
                    isSelected
                      ? "bg-white text-indigo-950 border-white shadow-md scale-[1.03]"
                      : "bg-slate-800 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-755"
                  }`}
                >
                  <span className="text-[9px] uppercase tracking-wider text-indigo-600 block font-black">
                    {labelEn}
                  </span>
                  <span className="text-xs font-bold whitespace-nowrap mt-0.5">
                    {labelHi}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Row for Step 2 -> Step 3 */}
      <div className="flex justify-between items-center bg-slate-50 border-2 border-slate-200 p-4 rounded-2xl mt-4 print:hidden">
        <button
          onClick={() => setCurrentWizardStep(1)}
          className="bg-white hover:bg-slate-100 text-slate-700 text-xs font-extrabold px-5 py-3 rounded-xl border border-slate-250 flex items-center gap-1.5 cursor-pointer transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === "en" ? "Back to Profile Details" : "छात्र विवरण पर वापस"}</span>
        </button>
        <button
          onClick={() => setCurrentWizardStep(3)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black px-6 py-3.5 rounded-xl shadow border-b-4 border-indigo-800 active:translate-y-[1px] active:border-b-2 flex items-center gap-1.5 cursor-pointer transition-all"
        >
          <span>{lang === "en" ? "Proceed to 22 Evaluation Domains" : "२२ विकासात्मक खंडों पर जाएँ"}</span>
          <ArrowRight className="w-4.5 h-4.5 text-white" />
        </button>
      </div>
    </>
  )}

  {currentWizardStep === 3 && (
    <>
      {/* BLOCK 2: DOMAIN ANALYSIS (Checklists & Educator Notes) WITH ROMAN NUMERALS */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden shadow-sm print:border-slate-400">
        
        {/* Mobile Dropdown Navigator & Back/Next */}
        <div className="lg:hidden flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 bg-slate-50 border-b-2 border-slate-200 print:hidden">
          <div className="flex-1 min-w-0">
            <label className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest block font-sans mb-1">
              {lang === "en" ? "Active Evaluation Step" : "सक्रिय आई.ई.पी. चरण"}
            </label>
            <select
              value={activeDomain}
              onChange={(e) => onChangeDomain(e.target.value)}
              className="w-full bg-white border-2 border-slate-200 rounded-lg px-2 py-1.5 text-xs font-bold text-indigo-950"
            >
              {activeDomainsList.map((tab, idx) => {
                const hasSel = checklists[tab]?.some(item => item.checked === true);
                return (
                  <option key={tab} value={tab}>
                    Section {idx + 1}: {tab.replace(/^\d+\.\s*/, "")} {hasSel ? "✓" : "⚠️"}
                  </option>
                );
              })}
            </select>
          </div>
          
          <div className="flex gap-2 self-end sm:self-auto flex-shrink-0">
            <button
              onClick={() => {
                if (currentIndex > 0) {
                  onChangeDomain(activeDomainsList[currentIndex - 1]);
                } else {
                  setCurrentWizardStep(2);
                }
              }}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-extrabold border-2 border-slate-200 cursor-pointer"
            >
              ←
            </button>
            <button
              onClick={() => {
                if (currentIndex < activeDomainsList.length - 1) {
                  onChangeDomain(activeDomainsList[currentIndex + 1]);
                } else {
                  setCurrentWizardStep(4);
                }
              }}
              className="px-3.5 py-2 rounded-xl bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-sm cursor-pointer"
            >
              →
            </button>
          </div>
        </div>

        {/* Master Stepper Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 print:block">
          
          {/* Side Drawer Workspace Ledger for Desktop */}
          <div className="lg:col-span-3 bg-slate-50/70 border-r-2 border-slate-250 p-4 max-h-[600px] overflow-y-auto flex flex-col gap-1.5 print:hidden">
            <div className="text-[9px] text-slate-450 font-black uppercase tracking-wider mb-2 px-1 text-left">
              {lang === "en" ? "Diagnostic Ledger Sections" : "मूल्यांकन खंड प्रगति"}
            </div>
            {activeDomainsList.map((tab, idx) => {
              const isActive = tab === activeDomain;
              const isCompleted = checklists[tab]?.some(item => item.checked === true);
              const stepNum = idx + 1;
              
              return (
                <button
                  key={tab}
                  onClick={() => onChangeDomain(tab)}
                  className={`w-full text-left p-2.5 rounded-xl border-2 transition-all text-xs flex items-center justify-between gap-2.5 cursor-pointer ${
                    isActive 
                      ? "bg-indigo-600 text-white border-indigo-600 font-extrabold shadow" 
                      : "bg-white text-slate-700 border-slate-100 hover:text-indigo-600 hover:bg-slate-100/80"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-extrabold ${isActive ? "bg-indigo-700 text-white" : "bg-slate-200 text-slate-600"}`}>
                      {stepNum}
                    </span>
                    <span className="truncate font-sans font-semibold tracking-tight">
                      {tab.replace(/^\d+\.\s*/, "")}
                    </span>
                  </div>
                  <span className={`text-[10px] font-black ${isCompleted ? (isActive ? "text-indigo-200" : "text-emerald-600") : "text-amber-500 animate-pulse"}`}>
                    {isCompleted ? "✓" : "⚠️"}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Main content pane */}
          <div className="lg:col-span-9 p-6 md:p-8 flex flex-col justify-between">
            
            {/* Desktop step banner */}
            <div className="hidden lg:flex items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100 print:hidden">
              <div className="flex items-center gap-2 text-left">
                <span className="text-[10px] bg-indigo-100 text-indigo-700 font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {lang === "en" ? `Section ${currentIndex + 1} of 22` : `खंड ${currentIndex + 1} / 22`}
                </span>
                <span className="text-xs font-bold text-slate-405">
                  {activeDomain.replace(/^\d+\.\s*/, "")}
                </span>
              </div>
              
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    if (currentIndex > 0) {
                      onChangeDomain(activeDomainsList[currentIndex - 1]);
                    } else {
                      setCurrentWizardStep(2);
                    }
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold border border-slate-205 cursor-pointer transition-all"
                >
                  ← {currentIndex === 0 ? (lang === "en" ? "Back to Cycle" : "पीछे (चक्र चयन)") : (lang === "en" ? "Prev" : "पूर्व")}
                </button>
                <button
                  onClick={() => {
                    if (currentIndex < activeDomainsList.length - 1) {
                      onChangeDomain(activeDomainsList[currentIndex + 1]);
                    } else {
                      setCurrentWizardStep(4);
                    }
                  }}
                  className="px-3.5 py-2 rounded-xl bg-indigo-650 hover:bg-indigo-750 text-white text-xs font-extrabold shadow cursor-pointer transition-all border-b-2 border-indigo-850 active:translate-y-[1px]"
                >
                  {currentIndex === activeDomainsList.length - 1 ? (lang === "en" ? "To Timeline (Step 4)" : "आगे (चरण ४)") : (lang === "en" ? "Next Section" : "अगला खंड")} →
                </button>
              </div>
            </div>

            {/* Checklist Columns Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Column 1: Observable behavior checklist with ROMAN numerals */}
              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-slate-500 font-extrabold mb-1">{t.observableChecklist}</h3>
                  <p className="text-[10px] text-indigo-850 font-bold uppercase">{t.observableChecklistDesc}</p>
                </div>

                <div className="flex flex-col gap-3">
                  {(checklists[activeDomain] || []).map((item, index) => {
                    const roman = getRoman(index + 1);
                    return (
                      <label
                        key={item.id}
                        className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer text-left ${
                          item.checked 
                            ? "bg-indigo-50/50 border-indigo-400 text-slate-900 font-semibold" 
                            : "bg-white border-slate-100 hover:border-slate-250 text-slate-505"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={() => onToggleChecklist(activeDomain, item.id)}
                          className="mt-1 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer w-4.5 h-4.5 accent-indigo-600"
                        />
                        
                        {/* Roman Numeral indicator */}
                        <span className={`font-mono text-xs px-2 py-0.5 rounded-md font-extrabold flex-shrink-0 ${item.checked ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400"}`}>
                          {roman}
                        </span>
                        
                        <span className="text-xs leading-normal font-sans">
                          {item.isNoneOfTheAbove ? `${t.noneOfTheAbove}` : item.text}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Column 2: Subjective education notes */}
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <div className="text-left">
                    <h3 className="text-xs uppercase tracking-wider text-slate-505 font-extrabold mb-1">{t.subjectiveJournal}</h3>
                    <p className="text-[10px] text-indigo-850 font-bold uppercase">{t.subjectiveJournalDesc}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition-all duration-305 flex items-center gap-1 ${
                    notesSaveStatus === "pending" 
                      ? "bg-amber-50 text-amber-700 border border-amber-200 animate-pulse" 
                      : notesSaveStatus === "saving"
                        ? "bg-indigo-50 text-indigo-700 border border-indigo-200" 
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${
                      notesSaveStatus === "pending" 
                        ? "bg-amber-500 animate-ping" 
                        : notesSaveStatus === "saving" 
                          ? "bg-indigo-505 animate-spin" 
                          : "bg-emerald-500"
                    }`} />
                    {notesSaveStatus === "pending" 
                      ? (lang === "en" ? "Saving in 2s..." : "2 सेकंड में सहेजें...")
                      : notesSaveStatus === "saving" 
                        ? (lang === "en" ? "Saving..." : "सहेजा जा रहा है...") 
                        : (lang === "en" ? "Autosaved" : "स्वतः सहेजा गया")}
                  </span>
                </div>

                <textarea
                  value={notes[activeDomain] || ""}
                  onChange={(e) => onUpdateNotes(activeDomain, e.target.value)}
                  placeholder={`${lang === "en" ? "Write down notes on" : "टिप्पणियां दर्ज करें"} ${profile.studentName || "student"}...`}
                  rows={9}
                  className="w-full bg-slate-50 border-2 border-slate-205 rounded-xl p-4 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-sans leading-relaxed resize-y text-left"
                />
              </div>

            </div>

            {/* IEP FINAL VALIDATION & COMPLETE PRINT/SUBMIT ACTIONS PANEL */}
            {allDomainsCompleted ? (
              <div className="mt-8 border-2 border-emerald-500 rounded-xl bg-emerald-50/40 p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                <div className="flex items-start gap-4 text-left">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-inner">
                    ✓
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <h3 className="font-sans text-emerald-950 text-xs font-black uppercase tracking-wider">
                      {lang === "en" ? "Complete Compilation Approved!" : "आई.ई.पी. संकलन स्वीकृत!"}
                    </h3>
                    <p className="text-slate-650 text-[11px] font-medium leading-normal max-w-xl">
                      {lang === "en" 
                        ? "All 22 diagnostic sections are fully filled. Safe client database syncing and instant automatic PDF downloading are unlocked!"
                        : "सभी 22 शैक्षणिक खंड पूर्ण रूप से चिह्नित हैं। आधिकारिक पीडीएफ रिपोर्ट डाउनलोड करने और डेटा जमा करने के विकल्प अनलॉक हैं!"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
                  {onSaveStudent && (
                    <button
                      onClick={() => {
                        onSaveStudent();
                        showToastMsg(lang === "en" ? "Successfully saved student record to register!" : "छात्र का रिकॉर्ड रजिस्टर में सफलतापूर्वक जमा हो गया!", "success");
                      }}
                      className="flex-1 md:flex-initial bg-amber-600 hover:bg-amber-700 text-white text-xs font-black px-4 py-3 rounded-lg shadow transition-all cursor-pointer flex items-center justify-center gap-1.5 border-b-4 border-amber-800 active:translate-y-[1px] active:border-b-2"
                    >
                      <FileCheck className="w-4 h-4 text-amber-100" />
                      <span>{lang === "en" ? "Submit & Sync" : "आई.ई.पी. जमा करें (Submit)"}</span>
                    </button>
                  )}

                  <button
                    onClick={() => setIsPrintPreviewActive(true)}
                    className="flex-1 md:flex-initial bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black px-4 py-3 rounded-lg shadow transition-all cursor-pointer flex items-center justify-center gap-1.5 border-b-4 border-indigo-800 active:translate-y-[1px] active:border-b-2"
                  >
                    <Printer className="w-4 h-4 text-indigo-100" />
                    <span>{lang === "en" ? "On-Screen Print Preview" : "प्रिंट प्रीव्यू स्क्रीन"}</span>
                  </button>

                  <button
                    onClick={handleDownloadPdf}
                    disabled={isGeneratingPdf}
                    className="flex-1 md:flex-initial bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white text-xs font-black px-4 py-3 rounded-lg shadow transition-all cursor-pointer flex items-center justify-center gap-1.5 border-b-4 border-emerald-800 active:translate-y-[1px] active:border-b-2"
                  >
                    <Download className="w-4 h-4 text-emerald-100" />
                    <span>{lang === "en" ? "Print & Download PDF" : "प्रिंट व पीडीएफ डाउनलोड"}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-8 border-2 border-amber-250 rounded-xl bg-amber-50/40 p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <div className="flex flex-col gap-0.5 text-left">
                  <span className="font-sans text-amber-955 text-xs font-black uppercase tracking-wider">
                    {lang === "en" ? "IEP Forms Progress Pending" : "आई.ई.पी. खंड प्रगति लंबित है"}
                  </span>
                  <p className="text-slate-605 text-[11px] leading-relaxed font-semibold">
                    {lang === "en" 
                      ? "Make selections in all 22 required evaluation sections. The Submit and PDF Print/Download options are hidden and will securely appear here once completed."
                      : "कृपया सभी 22 विकासात्मक खंडों में विकल्प चिह्नित करें। विवरण पूर्ण हो जाने पर सबमिट और पीडीएफ डाउनलोड के बटन तुरंत यहाँ प्रकट हो जायेंगे।"}
                  </p>
                </div>
              </div>
            )}

          </div>
          
        </div>
      </div>
    </>
  )}

  {currentWizardStep === 4 && (
    <>
      {/* BLOCK 3: GOAL REVIEW TIMELINE PROGRESS */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden shadow-sm print:border-slate-400">
        
        {/* Timeline Header bar */}
        <div className="flex items-center justify-between border-b-2 border-slate-200 p-5 bg-slate-50/50 flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600 animate-spin" style={{ animationDuration: "12s" }} />
            <span className="text-xs uppercase tracking-wider text-slate-500 font-extrabold">{t.reviewCycle}</span>
          </div>

          <div className="flex overflow-x-auto gap-1 border-2 border-slate-200 rounded-xl p-1 bg-white print:hidden">
            {(["Annual Review", "Six-Month Review", "Monthly Check-in", "Weekly Progress"] as ReviewType[]).map((tab) => {
              const active = tab === activeReviewTab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveReviewTab(tab)}
                  className={`text-[10px] font-bold tracking-wide uppercase px-3.5 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    active 
                      ? "bg-indigo-600 text-white shadow" 
                      : "text-slate-500 hover:text-indigo-600"
                  }`}
                >
                  {tab === "Annual Review" ? t.annualReview : 
                   tab === "Six-Month Review" ? t.sixMonthReview : 
                   tab === "Monthly Check-in" ? t.monthlyCheckin : t.weeklyProgress}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Success percentage meter */}
            <div className="lg:col-span-1 flex flex-col gap-4 justify-between bg-slate-50 p-5 rounded-2xl border-2 border-slate-100">
              <div>
                <h3 className="text-xs uppercase tracking-wider text-slate-500 font-extrabold mb-2">{t.milestoneRate}</h3>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-5xl font-black italic text-indigo-600">{targetProgressPercent}%</span>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">{t.complete}</span>
                </div>
                
                {/* Visual bar */}
                <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden mb-6">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500" 
                    style={{ width: `${targetProgressPercent}%` }}
                  />
                </div>
              </div>

              {/* Text feedback based on complete milestones */}
              <div className="p-3.5 bg-white border border-slate-200 rounded-xl text-xs flex gap-3 h-full">
                <Award className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                <div className="flex flex-col gap-1 leading-relaxed text-slate-600 font-medium">
                  <span className="font-extrabold text-slate-900 font-sans">Active Milestones Check:</span>
                  {targetProgressPercent === 100 ? (
                    <span>{lang === "en" ? "Splendid work! Every statutory target requirement completed." : "उत्कृष्ट कार्य! प्रत्येक कानूनी लक्ष्य आवश्यकता पूरी हो गई है।"}</span>
                  ) : targetProgressPercent >= 50 ? (
                    <span>{lang === "en" ? "Progress is steady. Some educational guidelines are active." : "प्रगति स्थिर है। कुछ शैक्षणिक दिशानिर्देश सक्रिय हैं।"}</span>
                  ) : (
                    <span>{lang === "en" ? "Critical stage. Most statutory checklist items pending review." : "नाजुक चरण। अधिकांश वैधानिक चेकलिस्ट आइटम समीक्षा के लिए लंबित हैं।"}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Checklists for progress reviews */}
            <div className="lg:col-span-1 flex flex-col gap-4">
              <h3 className="text-xs uppercase tracking-wider text-slate-500 font-extrabold">
                {lang === "en" ? "Target Timeline Milestones" : "समीक्षा साइकिल कार्य लक्ष्य"}
              </h3>
              <div className="flex flex-col gap-2.5">
                {currentTargets.map((target) => (
                  <label
                    key={target.id}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                      target.completed 
                        ? "bg-indigo-50/20 border-indigo-200 text-indigo-950 font-semibold" 
                        : "bg-white border-slate-100 hover:border-slate-200 text-slate-400"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={target.completed}
                      onChange={() => handleToggleTarget(activeReviewTab, target.id)}
                      className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer w-4 h-4"
                    />
                    <span className="text-xs leading-normal font-sans select-none">
                      {target.text}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Active objective textbox */}
            <div className="lg:col-span-1 flex flex-col gap-4">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <h3 className="text-xs uppercase tracking-wider text-slate-500 font-extrabold">{t.activeIepPrompt}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-slate-100 text-slate-500 border border-slate-200 rounded px-2 py-0.5 font-bold uppercase">
                    ACTIVE GOAL
                  </span>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition-all duration-305 flex items-center gap-1 ${
                    objectiveSaveStatus === "pending" 
                      ? "bg-amber-50 text-amber-700 border border-amber-200 animate-pulse" 
                      : objectiveSaveStatus === "saving"
                        ? "bg-indigo-50 text-indigo-700 border border-indigo-200" 
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${
                      objectiveSaveStatus === "pending" 
                        ? "bg-amber-500 animate-ping" 
                        : objectiveSaveStatus === "saving" 
                          ? "bg-indigo-500 animate-spin" 
                          : "bg-emerald-500"
                    }`} />
                    {objectiveSaveStatus === "pending" 
                      ? (lang === "en" ? "Saving in 2s..." : "2 सेकंड में सहेजें...")
                      : objectiveSaveStatus === "saving" 
                        ? (lang === "en" ? "Saving..." : "सहेजा जा रहा है...") 
                        : (lang === "en" ? "Autosaved" : "स्वतः सहेजा गया")}
                  </span>
                </div>
              </div>

              <textarea
                value={draftObjective}
                onChange={(e) => onUpdateObjective(e.target.value)}
                placeholder={t.activeIepPlaceholder}
                rows={6}
                className="w-full h-full bg-slate-50 border-2 border-slate-200 rounded-xl p-4 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white leading-relaxed resize-y font-medium"
              />
            </div>

          </div>
        </div>

      </div>

      {/* Action Row for Step 4 -> Step 5 */}
      <div className="flex justify-between items-center bg-slate-50 border-2 border-slate-200 p-4 rounded-2xl mt-4 print:hidden">
        <button
          onClick={() => {
            setCurrentWizardStep(3);
            onChangeDomain(activeDomainsList[activeDomainsList.length - 1]);
          }}
          className="bg-white hover:bg-slate-100 text-slate-700 text-xs font-extrabold px-5 py-3 rounded-xl border border-slate-250 flex items-center gap-1.5 cursor-pointer transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === "en" ? "Back to Checklists" : "चेकलिस्ट पर वापस जाएँ"}</span>
        </button>
        <button
          onClick={() => setCurrentWizardStep(5)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black px-6 py-3.5 rounded-xl shadow border-b-4 border-indigo-800 active:translate-y-[1px] active:border-b-2 flex items-center gap-1.5 cursor-pointer transition-all"
        >
          <span>{lang === "en" ? "Save & Compile IEP Summary" : "सहेजें और आई.ई.पी. सारांश संकलित करें"}</span>
          <ArrowRight className="w-4.5 h-4.5 text-white" />
        </button>
      </div>
    </>
  )}

  {currentWizardStep === 5 && (
    <>
      {/* STEP 5: STUDENT DETAILS PROFILE REVIEW & PRINT COMPILATION CONSOLE */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden shadow-sm p-6 print:hidden flex flex-col gap-8 text-left">
        
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-6 rounded-xl flex items-center gap-4 text-left">
          <div className="bg-white/10 p-3 rounded-xl text-white flex-shrink-0">
            <Award className="w-6 h-6 text-yellow-300" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-black tracking-widest text-indigo-300">STEP 5: COMPILATION & DISPATCH (समीक्षा एवं अंतिम संकलन)</span>
            <h2 className="text-md font-bold mt-0.5 text-slate-100">
              {lang === "en" ? "Form Submission, Printer Layout & Formal PDF Dispatch" : "प्रप्रत्र समीक्षा, आधिकारिक प्रिंट लेआउट एवं पीडीएफ़ प्रचालन"}
            </h2>
          </div>
        </div>

        {/* Student Dossier Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase block select-none">Student Name</span>
            <span className="text-xs font-black text-slate-900 mt-1 block">{profile.studentName || "N/A"}</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase block select-none">Roll Number</span>
            <span className="text-xs font-black text-indigo-950 mt-1 block">{profile.studentId || "N/A"}</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase block select-none">Disability Category</span>
            <span className="text-xs font-bold text-slate-800 mt-1 block truncate">{profile.disabilityType || "N/A"}</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase block select-none">Class & Cycle</span>
            <span className="text-xs font-bold text-slate-800 mt-1 block uppercase">
              {profile.className ? `Class ${profile.className}` : "N/A"} ({profile.learningOutcomeCycle})
            </span>
          </div>
        </div>

        {/* Section Checks Grid */}
        <div className="border border-slate-200 rounded-xl p-5 text-left bg-indigo-50/20">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-4 pb-2 border-b border-indigo-100">
            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                {lang === "en" ? "Required Diagnostic Checklist Ledger Progress" : "२२ अनिवार्य विकासात्मक डोमेन प्रगति विश्लेषण"}
              </h3>
              <p className="text-[10px] text-slate-400 uppercase font-bold mt-0.5 select-none">
                {lang === "en" ? "Every domain MUST have at least 1 checkbox ticked to unlock full PDF export." : "पूर्ण पीडीएफ निर्यात करने से पहले प्रत्येक डोमेन का चिह्नित होना अनिवार्य है।"}
              </p>
            </div>
            
            <div className={`p-1.5 px-3 rounded-full text-[10px] uppercase font-black tracking-widest border self-start sm:self-center ${
              allDomainsCompleted 
                ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                : "bg-amber-100 text-amber-800 border-amber-300 animate-pulse"
            }`}>
              {allDomainsCompleted 
                ? (lang === "en" ? "✓ Approved (100%)" : "✓ संकलित (100%)") 
                : (lang === "en" ? "⚠️ Incomplete Progress" : "⚠️ अपूर्ण प्रगति")}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {activeDomainsList.map((tab, idx) => {
              const isDomainComplete = domainValidations[tab] === true;
              return (
                <button
                  key={tab}
                  onClick={() => {
                    onChangeDomain(tab);
                    setCurrentWizardStep(3);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-[64px] hover:shadow-sm ${
                    isDomainComplete 
                      ? "bg-emerald-50/50 border-emerald-200 text-emerald-950 font-semibold" 
                      : "bg-amber-50/55 border-amber-205 text-amber-950 hover:border-amber-400"
                  }`}
                >
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-extrabold select-none">
                    Sec {idx + 1}
                  </span>
                  <span className="text-[10px] font-sans font-extrabold tracking-tight truncate w-full mt-0.5 text-slate-900">
                    {tab.replace(/^\d+\.\s*/, "")}
                  </span>
                  <span className={`text-[9.5px] font-black uppercase mt-1 flex items-center gap-1 ${
                    isDomainComplete ? "text-emerald-600" : "text-amber-600 animate-pulse"
                  }`}>
                    <span className="text-[10px]">{isDomainComplete ? "✓" : "⚠️"}</span>
                    {isDomainComplete ? (lang === "en" ? "Complete" : "पूर्ण") : (lang === "en" ? "Pending" : "अपूर्ण")}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mega Submission Dispatch Console */}
        <div className="bg-slate-50 border border-slate-205 rounded-xl p-6 shadow-inner text-left">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-800 mb-2">
            {lang === "en" ? "IEP Compilation dispatch actions" : "आई.ई.पी. अंतिम संकलन प्रेषण सूची"}
          </h3>
          <p className="text-[11px] text-slate-500 mb-6 leading-relaxed uppercase">
            {lang === "en"
              ? "Submit Student evaluation details to save/update database history and automatically trigger print/download modules."
              : "छात्र के मूल्यांकन रिकॉर्ड को सहेजने के लिए सबमिट बटन दबाएं। सबमिट होने के बाद प्रणाली स्वचालित रूप से पीडीएफ डाउनलोड लॉन्च करेगी।"}
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                if (onSaveStudent) onSaveStudent();
                setIsPrintPreviewActive(true);
                showToastMsg(lang === "en" ? "Draft compiled beautifully! Initializing standard print view..." : "सफलतापूर्वक संकलित! मानक प्रिंटर सेटअप लोड किया जा रहा है...", "success");
                setTimeout(() => {
                  window.print();
                }, 600);
              }}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 border-b-4 border-indigo-800 active:translate-y-[1px] cursor-pointer"
            >
              <Printer className="w-4 h-4 text-indigo-100" />
              <span>{lang === "en" ? "Submit & Print Premium Hard Copy" : "आई.ई.पी. सबमिट एवं प्रिंट हार्ड कॉपी"}</span>
            </button>

            <button
              disabled={isGeneratingPdf}
              onClick={() => {
                if (onSaveStudent) onSaveStudent();
                setIsPrintPreviewActive(true);
                showToastMsg(lang === "en" ? "Synchronizing database records... PDF scheduled for automatic device download." : "डेटा सुरक्षित किया जा रहा है... आई.ई.पी. पीडीएफ आपके डिवाइस पर डाउनलोड होना शुरू हो रहा है।", "success");
                setTimeout(() => {
                  handleDownloadPdf();
                }, 600);
              }}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-700 text-white p-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 border-b-4 border-emerald-800 active:translate-y-[1px] cursor-pointer"
            >
              {isGeneratingPdf ? (
                <Loader2 className="w-4 h-4 animate-spin text-emerald-105" />
              ) : (
                <Download className="w-4 h-4 text-emerald-100" />
              )}
              <span>{lang === "en" ? "Submit & Auto-Download Official PDF" : "आई.ई.पी. सबमिट कर पीडीएफ डाउनलोड करें"}</span>
            </button>
          </div>
        </div>

      </div>

      {/* FOOTER FOOTNOTE CREDITS */}
      <div className="text-center text-[10px] tracking-widest text-slate-400 font-extrabold uppercase pt-6 pb-2 border-t-2 border-slate-200 font-sans print:text-slate-500 print:border-slate-300">
        {t.footerText}
      </div>
    </>
  )}

      </div>

      {/* HIGH RESOLUTION OFFICIAL TRANSCRIPT TEMPLATE - VISIBLE IN PRINT PREVIEW, HIDDEN NORMALLY */}
      <div className={isPrintPreviewActive 
        ? "my-8 flex justify-center bg-slate-100 p-4 md:p-12 rounded-2xl shadow-inner overflow-auto w-full border border-slate-200" 
        : "absolute left-[-9999px] top-[0px] pointer-events-none select-none bg-white"
      }>
        <div 
          id="iep-pdf-report-template" 
          className={`bg-white text-slate-900 duration-150 p-12 relative border-8 border-indigo-950 font-sans w-[800px] flex flex-col gap-8 min-h-[1120px] ${isPrintPreviewActive ? 'shadow-2xl rounded-xl mx-auto' : ''}`}
          style={{ 
            color: '#0f172a', 
            backgroundColor: '#ffffff',
            borderColor: '#1e1b4b',
            fontFamily: 'Inter, sans-serif'
          }}
        >
          {/* Diagonal background watermark */}
          <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0 opacity-[0.035] flex items-center justify-center">
            <div 
              className="grid grid-cols-2 gap-x-12 gap-y-24 rotate-[-25deg] scale-150 origin-center w-full h-full pt-16 pl-16 text-slate-900 font-black pr-16 pb-16"
              style={{ color: '#0f172a' }}
            >
              {Array.from({ length: 32 }).map((_, i) => (
                <div key={i} className="text-xs tracking-widest font-sans uppercase whitespace-nowrap">
                  Developed by C.S. GAUTAM
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 flex flex-col gap-6 w-full text-left font-sans">
            {/* Header Block */}
            <div 
              className="border-b-4 border-indigo-950 pb-5 text-center flex flex-col items-center gap-2"
              style={{ borderBottomColor: '#1e1b4b' }}
            >
              {schoolLogo && (
                <div className="flex justify-center mb-1">
                  <img 
                    id="iep-pdf-report-school-logo"
                    src={schoolLogo} 
                    alt="School Logo" 
                    className="h-16 w-16 object-contain rounded-xl border border-slate-200 p-1 bg-white" 
                    style={{ height: '64px', width: '64px', display: 'block', margin: '0 auto 4px auto' }}
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}
              <div 
                className="bg-indigo-900 text-indigo-50 font-extrabold px-3 py-1.5 text-[9px] tracking-widest rounded uppercase font-mono"
                style={{ backgroundColor: '#1e1b4b', color: '#f8fafc' }}
              >
                Bilingual Special Needs IEP Protocol • official documentation
              </div>
              <h1 
                className="text-2xl font-black tracking-tight text-indigo-955 uppercase mt-1 animate-none font-sans"
                style={{ color: '#1e1b4b' }}
              >
                {profile.schoolName || "Academic Institution Name"}
              </h1>
              <h2 
                className="text-xs font-black tracking-widest text-slate-500 uppercase font-sans"
                style={{ color: '#64748b' }}
              >
                INDIVIDUALIZED EDUCATION PROGRAM (IEP) EVALUATION TRANSCRIPT
              </h2>
              <p 
                className="text-[10px] text-indigo-650 font-bold uppercase tracking-wider font-sans"
                style={{ color: '#4f46e5' }}
              >
                Developed by C.S. GAUTAM
              </p>
            </div>

            {/* Profile Grid */}
            <div 
              className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-xs text-left font-sans"
              style={{ 
                backgroundColor: '#f8fafc', 
                borderColor: '#e2e8f0',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                padding: '24px'
              }}
            >
              <div style={{ paddingBottom: '4px' }}>
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block font-sans" style={{ color: '#94a3b8' }}>Student Name</span>
                <div className="font-extrabold text-indigo-950 text-sm mt-1 block font-sans" style={{ color: '#1e1b4b', minHeight: '18px' }}>{profile.studentName || "Not provided"}</div>
              </div>
              <div style={{ paddingBottom: '4px' }}>
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block font-sans" style={{ color: '#94a3b8' }}>Student Number / Roll ID</span>
                <div className="font-extrabold text-indigo-950 text-sm mt-1 block font-sans" style={{ color: '#1e1b4b', minHeight: '18px' }}>{profile.studentId || activeStudentId}</div>
              </div>

              {/* Subtle full-width bottom border divider */}
              <div style={{ borderBottom: '1px solid #cbd5e1', gridColumn: 'span 2 / span 2', opacity: 0.5 }} />

              <div style={{ paddingBottom: '4px' }}>
                <span className="text-slate-400 text-[10px] uppercase font-semibold tracking-wider block font-sans" style={{ color: '#94a3b8' }}>Class Grade Level</span>
                <div className="font-extrabold text-indigo-950 text-sm mt-1 block font-sans" style={{ color: '#1e1b4b', minHeight: '18px' }}>
                  {CLASSES_LIST.find(c => c.id === profile.className)?.[lang] || "Grade 2"}
                </div>
              </div>

              <div style={{ paddingBottom: '4px' }}>
                <span className="text-slate-400 text-[10px] uppercase font-semibold tracking-wider block font-sans" style={{ color: '#94a3b8' }}>Block & District Location</span>
                <div className="font-extrabold text-indigo-950 text-sm mt-1 block font-sans" style={{ color: '#1e1b4b', minHeight: '18px' }}>
                  {profile.block || "Not provided"} / {profile.district || "Not provided"}
                </div>
              </div>

              {/* Subtle full-width bottom border divider */}
              <div style={{ borderBottom: '1px solid #cbd5e1', gridColumn: 'span 2 / span 2', opacity: 0.5 }} />

              <div style={{ paddingBottom: '4px' }}>
                <span className="text-slate-400 text-[10px] uppercase font-semibold tracking-wider block font-sans" style={{ color: '#94a3b8' }}>Date of Birth</span>
                <div className="font-bold text-slate-800 text-sm mt-1 block font-sans" style={{ color: '#1e293b', minHeight: '18px' }}>{profile.dateOfBirth || "Not provided"}</div>
              </div>
              <div style={{ paddingBottom: '4px' }}>
                <span className="text-slate-400 text-[10px] uppercase font-semibold tracking-wider block font-sans" style={{ color: '#94a3b8' }}>Calculated Age</span>
                <div className="font-extrabold text-indigo-950 text-sm mt-1 block font-sans" style={{ color: '#1e1b4b', minHeight: '18px' }}>{calculateAge(profile.dateOfBirth, lang)}</div>
              </div>

              {/* Subtle full-width bottom border divider */}
              <div style={{ borderBottom: '1px solid #cbd5e1', gridColumn: 'span 2 / span 2', opacity: 0.5 }} />

              <div className="col-span-2" style={{ gridColumn: 'span 2 / span 2', paddingBottom: '4px' }}>
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block text-left font-sans" style={{ color: '#94a3b8' }}>Disability Classification (RPwD Act 2016 India)</span>
                <div className="font-extrabold text-indigo-900 mt-1 text-xs text-left block font-sans" style={{ color: '#312e81', minHeight: '16px' }}>
                  {DISABILITIES_LIST.find(d => d.id === profile.disabilityType)?.[lang] || "Autism"}
                </div>
              </div>

              {/* Subtle full-width bottom border divider */}
              <div style={{ borderBottom: '1px solid #cbd5e1', gridColumn: 'span 2 / span 2', opacity: 0.5 }} />

              <div className="col-span-2" style={{ gridColumn: 'span 2 / span 2', paddingBottom: '4px' }}>
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block mb-1.5 font-sans" style={{ color: '#94a3b8' }}>State Statutory Verification</span>
                <span 
                  className="bg-emerald-100 text-emerald-800 text-[9px] font-black tracking-widest uppercase px-2.5 py-1 rounded border border-emerald-300 inline-block font-sans"
                  style={{ backgroundColor: '#d1fae5', color: '#065f46', borderColor: '#6ee7b7', verticalAlign: 'middle' }}
                >
                  {profile.disabilityCertificate ? "✓ OFFICIAL DISABILITY CERTIFICATE ATTACHED" : "OFFICIAL CERTIFICATE PENDING REVIEW"}
                </span>
              </div>

              {/* Subtle full-width bottom border divider */}
              <div style={{ borderBottom: '1px solid #cbd5e1', gridColumn: 'span 2 / span 2', opacity: 0.5 }} />

              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold tracking-wider block font-sans" style={{ color: '#94a3b8' }}>Class Room Teacher</span>
                <div className="font-bold text-slate-800 text-xs mt-1 block font-sans" style={{ color: '#1e293b', minHeight: '16px' }}>{profile.generalTeacher || "Not specified"}</div>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold tracking-wider block font-sans" style={{ color: '#94a3b8' }}>Lead Special Educator</span>
                <div className="font-extrabold text-slate-800 text-xs mt-1 block font-sans" style={{ color: '#1e293b', minHeight: '16px' }}>{profile.specialTeacher || "Not specified"}</div>
              </div>
            </div>

            {/* IEP Objective */}
            <div 
              className="border border-slate-200 rounded-xl p-5 bg-white text-left font-sans"
              style={{ borderColor: '#e2e8f0', backgroundColor: '#ffffff' }}
            >
              <h3 
                className="text-indigo-950 text-xs font-black uppercase tracking-wider mb-2 border-b pb-1.5 flex justify-between font-sans"
                style={{ color: '#1e1b4b', borderBottomColor: '#cbd5e1' }}
              >
                <span>Active Objective Target Setting</span>
                <span className="text-[9px] font-mono font-bold text-indigo-600" style={{ color: '#4f46e5' }}>IEP INDIA PROTOCOL</span>
              </h3>
              <p 
                className="text-xs leading-relaxed italic text-slate-700 bg-slate-50 p-4 rounded-lg font-medium border border-slate-150 whitespace-normal text-left block font-sans"
                style={{ color: '#334155', backgroundColor: '#f8fafc', borderColor: '#cbd5e1' }}
              >
                {draftObjective || "No active goals specified."}
              </p>
            </div>

            {/* Active Checklist Summary */}
            <div className="flex flex-col gap-4 text-left font-sans">
              <h3 
                className="text-indigo-950 text-xs font-black uppercase tracking-tight border-b-2 border-indigo-900 pb-1 text-left font-sans"
                style={{ color: '#1e1b4b', borderBottomColor: '#312e81' }}
              >
                Instructional Diagnostics Checklist Breakdown
              </h3>
              {activeDomainsList.map((domainName) => {
                const behaviorsList = checklists[domainName] || [];
                const checkedItems = behaviorsList.filter(b => b.checked);
                const notationNotes = notes[domainName];

                return (
                  <div 
                    key={domainName} 
                    className="border border-slate-200 rounded-xl p-4 flex flex-col gap-3 bg-slate-50/40 text-left font-sans"
                    style={{ borderColor: '#e2e8f0', backgroundColor: 'rgba(248, 250, 252, 0.4)' }}
                  >
                    <div 
                      className="flex justify-between items-center border-b pb-1.5 font-bold font-sans"
                      style={{ borderBottomColor: '#e2e8f0' }}
                    >
                      <span className="text-xs font-black text-indigo-950 uppercase tracking-wide font-sans" style={{ color: '#1e1b4b' }}>
                        {domainName} Domain Index Checklist
                      </span>
                      <span className="text-[9px] font-bold text-indigo-650 uppercase font-sans" style={{ color: '#4f46e5' }}>
                        {checkedItems.length} demonstrated
                      </span>
                    </div>

                    <div className="flex flex-col gap-1.5 pl-1.5 text-left font-sans">
                      {checkedItems.length === 0 ? (
                        <div className="text-[11px] italic text-rose-700 font-semibold pl-1 font-sans" style={{ color: '#be123c' }}>
                          No behavior checklists checked (neutral baseline).
                        </div>
                      ) : (
                        checkedItems.map((item, idx) => {
                          const originalIndex = behaviorsList.findIndex(x => x.id === item.id);
                          const romanNum = getRoman(originalIndex !== -1 ? originalIndex + 1 : idx + 1);
                          return (
                            <div 
                              key={item.id} 
                              className="text-xs font-medium text-slate-800 flex items-start gap-2 font-sans"
                              style={{ color: '#1e293b' }}
                            >
                              <span 
                                className="bg-indigo-100 text-indigo-700 text-[10px] font-mono font-bold px-1.5 rounded flex-shrink-0"
                                style={{ backgroundColor: '#e0e7ff', color: '#4338ca' }}
                              >
                                {romanNum}
                              </span>
                              <span className="text-left font-sans">
                                {item.isNoneOfTheAbove ? "None of the above matches criteria." : item.text}
                              </span>
                            </div>
                          );
                        })
                      )}
                    </div>

                    <div 
                      className="flex flex-col gap-1.5 pt-2 border-t border-slate-200/80 text-left font-sans"
                      style={{ borderTopColor: 'rgba(226, 232, 240, 0.8)' }}
                    >
                      <span className="text-[9px] text-slate-400 uppercase font-black tracking-wider block text-left font-sans" style={{ color: '#94a3b8' }}>Clinical Educator Assessment Notes</span>
                      <p className="text-xs text-slate-600 leading-relaxed pl-1 whitespace-normal italic text-left font-sans" style={{ color: '#475569' }}>
                        {notationNotes || "No clinical journal entries recorded for this domain segment."}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Progress Review */}
            <div 
              className="border border-slate-200 rounded-xl p-4 bg-white flex justify-between items-center gap-6 mt-1.5 text-left font-sans"
              style={{ borderColor: '#e2e8f0', backgroundColor: '#ffffff' }}
            >
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-black tracking-wider block font-sans" style={{ color: '#94a3b8' }}>Milestone Target Evaluation Cycle</span>
                <h4 className="text-xs font-black text-indigo-950 mt-0.5 uppercase font-sans" style={{ color: '#1e1b4b' }}>
                  {activeReviewTab} tracker ({targetProgressPercent}% achieved)
                </h4>
              </div>
              <div className="text-xl font-bold font-serif text-indigo-600 pr-2 animate-none" style={{ color: '#2563eb' }}>
                {targetProgressPercent}%
              </div>
            </div>

            {/* Stamp Footer Layout */}
            <div 
              className="grid grid-cols-3 gap-6 pt-12 border-t border-dashed border-slate-300 text-[9px] font-bold uppercase text-slate-400 text-center mt-6 font-sans"
              style={{ borderTopColor: '#cbd5e1', color: '#94a3b8' }}
            >
              <div className="flex flex-col gap-10 font-sans">
                <div className="h-6 border-b border-slate-300 mx-2" style={{ borderBottomColor: '#cbd5e1' }} />
                <span className="font-sans">Class Teacher Sign</span>
              </div>
              <div className="flex flex-col items-center justify-end font-sans">
                <div 
                  className="w-12 h-12 rounded-full border border-dashed border-indigo-400 flex items-center justify-center p-0.5 rotate-6 bg-white shrink-0 -mb-2"
                  style={{ borderColor: '#818cf8', backgroundColor: '#ffffff' }}
                >
                  <span className="text-[6px] font-black leading-tight text-indigo-500 select-none uppercase font-sans" style={{ color: '#6366f1' }}>
                    IEP MATRIX SEAL
                  </span>
                </div>
                <span className="font-sans">IEP Admin Seal</span>
              </div>
              <div className="flex flex-col gap-10 font-sans">
                <div className="h-6 border-b border-slate-300 mx-2" style={{ borderBottomColor: '#cbd5e1' }} />
                <span className="font-sans">Special Educator Sign</span>
              </div>
            </div>

            {/* Developed credits footnote label */}
            <div 
              className="text-center text-[9px] text-slate-400 font-black tracking-widest uppercase pt-6 mt-4 border-t font-sans"
              style={{ borderTopColor: '#cbd5e1', color: '#94a3b8' }}
            >
              Developed by CS Gautam special teacher CBEO office Pahadi | IEP India Educational Matrix Framework • 2026
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
