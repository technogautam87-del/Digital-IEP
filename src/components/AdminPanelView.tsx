import React, { useState } from "react";
import { 
  Users, 
  Settings, 
  Database, 
  Upload, 
  Plus, 
  Trash2, 
  Check, 
  Save, 
  AlertCircle, 
  ArrowRight,
  Sliders,
  TrendingUp,
  FileCheck,
  ShieldCheck,
  Edit,
  X,
  FileSpreadsheet,
  Loader2
} from "lucide-react";
import * as XLSX from "xlsx";
import { Preferences, Checklists, EducatorNotes, StudentProfile, BehaviorItem } from "../types";
import { LanguageType, translationMap, DISABILITIES_LIST, CLASSES_LIST, calculateAge, getRoman } from "../language";

interface AdminPanelViewProps {
  lang: LanguageType;
  profile: StudentProfile;
  draftObjective: string;
  preferences: Preferences;
  onUpdatePreferences: (prefs: Preferences) => void;
  checklists: Checklists;
  onUpdateChecklists: (chk: Checklists) => void;
  notes: EducatorNotes;
  onUpdateNotes: (notes: EducatorNotes) => void;
  activeDomain: string;
  onChangeDomain: (dom: string) => void;
  onClose: () => void;
  showToastMsg: (msg: string, type?: "success" | "info") => void;
  googleSheetUrl: string;
  onUpdateGoogleSheetUrl: (url: string) => void;
  isSyncingSheet: boolean;
  onQueryGoogleSheet: (targetId?: string) => void;
}

export default function AdminPanelView({ 
  lang,
  profile,
  draftObjective,
  preferences, 
  onUpdatePreferences, 
  checklists,
  onUpdateChecklists,
  notes,
  onUpdateNotes,
  activeDomain,
  onChangeDomain,
  onClose,
  showToastMsg,
  googleSheetUrl,
  onUpdateGoogleSheetUrl,
  isSyncingSheet,
  onQueryGoogleSheet
}: AdminPanelViewProps) {
  
  const t = translationMap[lang];

  // Excel (XLSX) Export Handler
  const handleExportToExcel = () => {
    try {
      const wb = XLSX.utils.book_new();

      // Resolve human-readable class name
      const classObj = CLASSES_LIST.find((c) => c.id === profile.className);
      const classNameFull = classObj
        ? (lang === "en" ? classObj.en : classObj.hi)
        : profile.className;

      // Resolve human-readable disability name
      const disObj = DISABILITIES_LIST.find((d) => d.id === profile.disabilityType);
      const disabilityNameFull = disObj
        ? (lang === "en" ? disObj.en : disObj.hi)
        : profile.disabilityType;

      // 1. Demographics Sheet
      const demographicsData = [
        [lang === "en" ? "IEP REPORT MATRIX - BOARD COMPLIANCE SHEET" : "आई.ई.पी. रिपोर्ट मैट्रिक्स - बोर्ड अनुपालन पत्रक"],
        [lang === "en" ? "Official Board Level Student Analytics & IEP Record" : "आधिकारिक बोर्ड स्तर छात्र विश्लेषण और आई.ई.पी. रिकॉर्ड"],
        [],
        [lang === "en" ? "METRIC / PARAMETER" : "मापदंड / पैरामीटर", lang === "en" ? "VALUE DETAILS" : "मान / विवरण"],
        [lang === "en" ? "School Name" : "स्कूल का नाम", profile.schoolName],
        [lang === "en" ? "Student Name" : "छात्र का नाम", profile.studentName],
        [lang === "en" ? "Class / Grade" : "कक्षा / श्रेणी", classNameFull],
        [lang === "en" ? "Date of Birth" : "जन्म तिथि", profile.dateOfBirth],
        [lang === "en" ? "Calculated Age" : "की गई आयु (गणना)", calculateAge(profile.dateOfBirth, lang)],
        [lang === "en" ? "Category of Disability" : "दिव्यांगता की श्रेणी", disabilityNameFull],
        [lang === "en" ? "Disability Certificate Verified?" : "दिव्यांगता प्रमाण पत्र सत्यापित?", profile.disabilityCertificate ? (lang === "en" ? "Yes" : "हाँ") : (lang === "en" ? "No" : "नहीं")],
        [lang === "en" ? "General Class Teacher" : "सामान्य वर्ग शिक्षक", profile.generalTeacher],
        [lang === "en" ? "Special Educator / Specialist" : "विशेष शिक्षक", profile.specialTeacher],
        [],
        [lang === "en" ? "ACTIVE STATEMENT OF SPECIAL ED GOAL / OBJECTIVE" : "विशेष शिक्षा लक्ष्य / उद्देश्य का सक्रिय विवरण"],
        [draftObjective]
      ];

      const wsDemographics = XLSX.utils.aoa_to_sheet(demographicsData);
      
      // Auto-set print-friendly styling or cell sizing
      wsDemographics["!cols"] = [
        { wch: 32 }, // Parameter Column
        { wch: 65 }  // Details Column
      ];
      
      XLSX.utils.book_append_sheet(wb, wsDemographics, lang === "en" ? "Profile" : "प्रोफ़ाइल");

      // 2. Checklists Sheet
      const checklistsData = [
        [
          lang === "en" ? "DOMAIN" : "डोमेन", 
          lang === "en" ? "SR. NO." : "क्रमांक", 
          lang === "en" ? "OBSERVABLE BEHAVIOR CRITERIA" : "अवलोकनीय व्यवहार मानदंड", 
          lang === "en" ? "STATUS" : "स्थिति", 
          lang === "en" ? "CRITERION TYPE" : "मानदंड प्रकार"
        ]
      ];

      Object.entries(checklists).forEach(([domain, items]) => {
        items.forEach((item, index) => {
          const status = item.checked 
            ? (lang === "en" ? "MET / DEMONSTRATED" : "पूर्ण / प्रदर्शित") 
            : (lang === "en" ? "ONGOING / REQUIRED" : "अपूर्ण / सुधार आवश्यक");
          const decisionType = item.isNoneOfTheAbove 
            ? (lang === "en" ? "Fallback Overwrite" : "फॉलबैक ओवरराइड")
            : (lang === "en" ? "Standard Criteria" : "मानक मापदंड");
          
          checklistsData.push([
            domain,
            getRoman(index + 1),
            item.text,
            status,
            decisionType
          ]);
        });
      });

      const wsChecklists = XLSX.utils.aoa_to_sheet(checklistsData);
      wsChecklists["!cols"] = [
        { wch: 22 }, // Domain
        { wch: 10 }, // Sr. No
        { wch: 75 }, // Criteria Text
        { wch: 25 }, // Status
        { wch: 22 }  // Criterion Type
      ];
      XLSX.utils.book_append_sheet(wb, wsChecklists, lang === "en" ? "Evaluation Checklist" : "मूल्यांकन चेकलिस्ट");

      // 3. Educator Observations Sheet
      const notesData = [
        [
          lang === "en" ? "DOMAIN / AREA" : "डोमेन / क्षेत्र", 
          lang === "en" ? "QUALITATIVE JOURNAL OBSERVATIONS & ASSESSMENT" : "गुणात्मक जर्नल टिप्पणियां और मूल्यांकन"
        ]
      ];

      Object.entries(notes).forEach(([domain, text]) => {
        notesData.push([
          domain,
          text || (lang === "en" ? "No observations documented yet." : "अभी तक कोई अवलोकन प्रलेखित नहीं किया गया है")
        ]);
      });

      const wsNotes = XLSX.utils.aoa_to_sheet(notesData);
      wsNotes["!cols"] = [
        { wch: 25 }, // Domain
        { wch: 85 }  // Notes Text
      ];
      XLSX.utils.book_append_sheet(wb, wsNotes, lang === "en" ? "Educator Notes" : "विशेष शिक्षक टिप्पणियां");

      // Save Workbook
      const studentCleanName = profile.studentName.replace(/\s+/g, "_") || "student";
      XLSX.writeFile(wb, `${studentCleanName}_IEP_Board_Spreadsheet_Report.xlsx`);
      
      showToastMsg(
        lang === "en" 
          ? `IEP Excel Sheet for '${profile.studentName}' generated successfully!` 
          : `'${profile.studentName}' की आई.ई.पी. स्प्रेडशीट सफलतापूर्वक डाउनलोड की गई!`, 
        "success"
      );
    } catch (error) {
      console.error("XLSX Export Error:", error);
      showToastMsg(
        lang === "en" ? "Error exporting to Excel spreadsheet" : "एक्सेल में एक्सपोर्ट करने में समस्या आई", 
        "info"
      );
    }
  };

  // Domain addition fields
  const [newDomainName, setNewDomainName] = useState("");
  
  // Item addition fields
  const [selectedAddDomain, setSelectedAddDomain] = useState(() => {
    return Object.keys(checklists)[0] || "";
  });
  const [newItemText, setNewItemText] = useState("");

  // Editing state variables helper
  const [editingDomainId, setEditingDomainId] = useState<string | null>(null);
  const [editingDomainText, setEditingDomainText] = useState("");

  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingItemDomain, setEditingItemDomain] = useState("");
  const [editingItemText, setEditingItemText] = useState("");

  // Show tutorial sync instructions
  const [showSyncInstructions, setShowSyncInstructions] = useState(false);

  // Seal logo preview
  const [logoPreview, setLogoPreview] = useState<string | null>(() => {
    return localStorage.getItem("iep_school_logo") || null;
  });

  // --- Dynamic admin handlers to update website ---
  
  // 1. Add Domain Core
  const handleCreateDomain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomainName.trim()) return;
    
    // Check if duplicate exist
    if (checklists[newDomainName]) {
      showToastMsg(lang === "en" ? "Domain already exists" : "डोमेन पहले से ही मौजूद है", "info");
      return;
    }

    const initialItems: BehaviorItem[] = [
      { id: "it_" + Math.random().toString(), text: "Demonstrates core behavioral performance", checked: false },
      { id: "none_" + newDomainName, text: "None of the above matches", checked: false, isNoneOfTheAbove: true }
    ];

    onUpdateChecklists({
      ...checklists,
      [newDomainName]: initialItems
    });

    onUpdateNotes({
      ...notes,
      [newDomainName]: `Qualitative observations ledger for ${newDomainName}.`
    });

    setSelectedAddDomain(newDomainName);
    onChangeDomain(newDomainName);
    setNewDomainName("");
    showToastMsg(lang === "en" ? `Domain '${newDomainName}' added successfully!` : `नया डोमेन '${newDomainName}' सफलतापूर्वक जोड़ा गया!`, "success");
  };

  // 2. Rename Domain Core
  const handleSaveDomainRename = (oldName: string) => {
    if (!editingDomainText.trim() || oldName === editingDomainText) {
      setEditingDomainId(null);
      return;
    }

    if (checklists[editingDomainText]) {
      showToastMsg(lang === "en" ? "A domain with this name already exists" : "इस नाम का डोमेन पहले से मौजूद है", "info");
      return;
    }

    const updatedChecklists = { ...checklists };
    updatedChecklists[editingDomainText] = updatedChecklists[oldName].map(item => {
      if (item.isNoneOfTheAbove) {
        return { ...item, id: "none_" + editingDomainText };
      }
      return item;
    });
    delete updatedChecklists[oldName];

    const updatedNotes = { ...notes };
    updatedNotes[editingDomainText] = updatedNotes[oldName] || "";
    delete updatedNotes[oldName];

    onUpdateChecklists(updatedChecklists);
    onUpdateNotes(updatedNotes);

    if (activeDomain === oldName) {
      onChangeDomain(editingDomainText);
    }
    if (selectedAddDomain === oldName) {
      setSelectedAddDomain(editingDomainText);
    }

    setEditingDomainId(null);
    showToastMsg(lang === "en" ? `Domain renamed to '${editingDomainText}'` : `डोमेन नाम बदलकर '${editingDomainText}' किया गया`, "success");
  };

  // 3. Delete Domain Core
  const handleDeleteDomain = (domainName: string) => {
    const list = Object.keys(checklists);
    if (list.length <= 1) {
      showToastMsg(lang === "en" ? "Warning: At least one domain must remain active in the system" : "चेतावनी: सिस्टम में कम से कम एक डोमेन सक्रिय रहना चाहिए", "info");
      return;
    }

    const agree = window.confirm(lang === "en" ? `Are you sure you want to delete '${domainName}' and all verified checks inside?` : `क्या आप निश्चित रूप से '${domainName}' और इससे जुड़े सभी मापदंडों को हटाना चाहते हैं?`);
    if (!agree) return;

    const updatedChecklists = { ...checklists };
    delete updatedChecklists[domainName];

    const updatedNotes = { ...notes };
    delete updatedNotes[domainName];

    onUpdateChecklists(updatedChecklists);
    onUpdateNotes(updatedNotes);

    const remaining = Object.keys(updatedChecklists);
    onChangeDomain(remaining[0]);
    if (selectedAddDomain === domainName) {
      setSelectedAddDomain(remaining[0]);
    }

    showToastMsg(lang === "en" ? `Domain '${domainName}' deleted successfully` : `डोमेन '${domainName}' सफलतापूर्वक हटा दिया गया`, "info");
  };

  // 4. Add Behavior Item under a Domain
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim() || !selectedAddDomain) return;

    const items = checklists[selectedAddDomain] || [];
    const noneItem = items.find(it => it.isNoneOfTheAbove);
    const regularItems = items.filter(it => !it.isNoneOfTheAbove);

    const newItem: BehaviorItem = {
      id: "it_" + Math.random().toString(),
      text: newItemText,
      checked: false
    };

    const updated: BehaviorItem[] = [...regularItems, newItem];
    if (noneItem) {
      updated.push(noneItem);
    } else {
      updated.push({
        id: "none_" + selectedAddDomain,
        text: "None of the above matches",
        checked: false,
        isNoneOfTheAbove: true
      });
    }

    onUpdateChecklists({
      ...checklists,
      [selectedAddDomain]: updated
    });

    setNewItemText("");
    showToastMsg(lang === "en" ? "New checklist criteria item added!" : "नया चेकलिस्ट मानदंड जोड़ा गया!", "success");
  };

  // 5. Save edited behavior item text
  const handleSaveItemEdit = (domain: string, itemId: string) => {
    if (!editingItemText.trim()) {
      setEditingItemId(null);
      return;
    }

    const updated = (checklists[domain] || []).map(item => {
      if (item.id === itemId) {
        return { ...item, text: editingItemText };
      }
      return item;
    });

    onUpdateChecklists({
      ...checklists,
      [domain]: updated
    });

    setEditingItemId(null);
    showToastMsg(lang === "en" ? "Behavior text updated!" : "व्यवहार का पाठ्य परिवर्तित कर दिया गया है!", "success");
  };

  // 6. Delete Behavior Item
  const handleDeleteItem = (domain: string, itemId: string) => {
    const items = checklists[domain] || [];
    const item = items.find(it => it.id === itemId);
    if (!item) return;

    if (item.isNoneOfTheAbove) {
      showToastMsg(lang === "en" ? "Error: Cannot delete the fallback 'None of the above' handler option" : "त्रुटि: फॉलबैक 'उपरोक्त में से कोई नहीं' का विकल्प नहीं हटाया जा सकता है", "info");
      return;
    }

    const agree = window.confirm(lang === "en" ? `Are you sure you want to delete this criterion?` : `क्या आप निश्चित रूप से इसे हटाना चाहते हैं?`);
    if (!agree) return;

    const updated = items.filter(it => it.id !== itemId);
    onUpdateChecklists({
      ...checklists,
      [domain]: updated
    });

    showToastMsg(lang === "en" ? "Item criterion deleted" : "विकल्प को हटा दिया गया है", "info");
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setLogoPreview(dataUrl);
        localStorage.setItem("iep_school_logo", dataUrl);
        showToastMsg(lang === "en" ? "School emblem synchronized successfully" : "स्कूल का लोगो और सील सिंक हो गया", "success");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    localStorage.removeItem("iep_school_logo");
    showToastMsg(lang === "en" ? "Emblem removed" : "लोगो हटा दिया गया है", "info");
  };

  // Student metrics aggregate summary (from current status)
  const allDomainsKeys = Object.keys(checklists);
  const totalBehaviorsCount = allDomainsKeys.reduce((acc, current) => {
    return acc + (checklists[current] || []).length;
  }, 0);

  return (
    <div className="w-full flex flex-col gap-8 pb-12 text-slate-800">
      
      {/* Title Header Card */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-2xl text-white shadow-md border-b-4 border-indigo-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <ShieldCheck className="w-6 h-6 text-white animate-bounce" />
            <h1 className="text-2xl font-black tracking-wide font-sans">{t.systemMgmt}</h1>
            <span className="p-1 px-2.5 bg-indigo-700 text-white font-extrabold text-[9px] uppercase tracking-widest rounded-full border border-indigo-500 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              {lang === "en" ? "Full Access Mode" : "पूर्ण अधिकार मोड"}
            </span>
          </div>
          <p className="text-xs text-indigo-100 font-medium leading-relaxed max-w-3xl">
            {t.systemMgmtDesc}
          </p>
        </div>
        
        <button
          onClick={onClose}
          className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold px-5 py-3 rounded-xl transition-all cursor-pointer shadow-md flex items-center gap-2 self-end border-b-4 border-rose-800 active:translate-y-[1px] font-sans"
        >
          <X className="w-4 h-4" />
          <span>{lang === "en" ? "Log Out & Exit" : "लॉग आउट और बाहर निकलें"}</span>
        </button>
      </div>

      {/* Main double column container Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: 100% Dynamic updates & managers */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* SEC 1: IEP Dynamic Domain Architecture & Operations manager */}
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-6 pb-3 border-b-2 border-slate-100">
              <Sliders className="w-5 h-5 text-indigo-600" />
              <div>
                <h2 className="text-sm font-extrabold text-indigo-950 uppercase">{t.domainArchitecture}</h2>
                <span className="text-[10px] text-slate-400 font-bold uppercase">{lang === "en" ? "Rename fields inside checks, delete segments, configure options" : "डोमेन नाम बदलें, विकल्प हटाएं और चेकलिस्ट अनुकूलित करें"}</span>
              </div>
            </div>

            {/* List and manage domains */}
            <div className="flex flex-col gap-4 mb-8">
              {allDomainsKeys.map((domainName) => {
                const behaviorsList = checklists[domainName] || [];
                const isEditing = editingDomainId === domainName;

                return (
                  <div key={domainName} className="bg-slate-50 border-2 border-slate-150 rounded-2xl p-4 transition-all hover:border-slate-300">
                    <div className="flex items-center justify-between flex-wrap gap-4 mb-3 pb-2 border-b border-slate-200/60">
                      {isEditing ? (
                        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                          <input
                            type="text"
                            value={editingDomainText}
                            onChange={(e) => setEditingDomainText(e.target.value)}
                            className="bg-white border-2 border-slate-300 rounded-lg p-1.5 px-3 text-xs text-slate-850 font-bold focus:outline-indigo-500 w-full"
                          />
                          <button
                            onClick={() => handleSaveDomainRename(domainName)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] uppercase font-bold p-2 px-3 rounded-lg"
                          >
                            {t.saveDomainBtn}
                          </button>
                          <button
                            onClick={() => setEditingDomainId(null)}
                            className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px] uppercase font-bold p-2 px-3 rounded-lg"
                          >
                            {t.cancelBtn}
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2.5">
                          <span className="text-xs font-black text-indigo-950 uppercase">{domainName}</span>
                          <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-200">
                            {behaviorsList.length} {lang === "en" ? "items" : "विकल्प"}
                          </span>
                        </div>
                      )}

                      {/* Domain rename or delete actions */}
                      {!isEditing && (
                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={() => {
                              setEditingDomainId(domainName);
                              setEditingDomainText(domainName);
                            }}
                            className="text-indigo-600 hover:text-indigo-800 text-[11px] font-bold p-1 px-2.5 rounded-lg hover:bg-indigo-50 border border-slate-200 bg-white shadow-sm flex items-center gap-1 cursor-pointer"
                          >
                            <Edit className="w-3 h-3" />
                            {t.updateDomainTitle}
                          </button>
                          
                          <button
                            onClick={() => handleDeleteDomain(domainName)}
                            className="text-rose-600 hover:text-rose-800 text-[11px] font-bold p-1 px-2.5 rounded-lg hover:bg-rose-50 border border-slate-250 bg-white shadow-sm flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            {t.deleteDomain}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Behaviors inside domain child table */}
                    <div className="flex flex-col gap-2.5 pl-2">
                      {behaviorsList.map((item, bIndex) => {
                        const isItemEditing = editingItemId === item.id;
                        return (
                          <div key={item.id} className="flex items-center justify-between gap-4 p-2 bg-white rounded-xl border border-slate-150 text-xs font-semibold">
                            <div className="flex items-center gap-2 flex-1">
                              <span className="w-8 font-mono font-bold text-[11px] text-indigo-600 text-center bg-slate-100 p-1 rounded">
                                {getRoman(bIndex + 1)}
                              </span>
                              
                              {isItemEditing ? (
                                <input
                                  type="text"
                                  value={editingItemText}
                                  onChange={(e) => setEditingItemText(e.target.value)}
                                  className="border-2 border-slate-300 rounded-lg p-1 px-2 text-xs focus:outline-indigo-500 w-full font-sans"
                                />
                              ) : (
                                <span className={`text-xs ${item.isNoneOfTheAbove ? "text-slate-400 italic" : "text-slate-700"}`}>
                                  {item.isNoneOfTheAbove ? `[Fallback Override] ${item.text}` : item.text}
                                </span>
                              )}
                            </div>

                            {/* Behavior Edit and Save Controls */}
                            <div className="flex items-center gap-2">
                              {isItemEditing ? (
                                <>
                                  <button
                                    onClick={() => handleSaveItemEdit(domainName, item.id)}
                                    className="text-emerald-700 hover:text-emerald-900 text-[10px] font-bold bg-emerald-50 p-1 px-2 border border-emerald-200 rounded cursor-pointer"
                                  >
                                    {t.saveItemBtn}
                                  </button>
                                  <button
                                    onClick={() => setEditingItemId(null)}
                                    className="text-slate-600 hover:text-slate-800 text-[10px] font-bold bg-slate-100 p-1 px-2 rounded cursor-pointer"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </>
                              ) : (
                                <>
                                  {!item.isNoneOfTheAbove && (
                                    <button
                                      onClick={() => {
                                        setEditingItemId(item.id);
                                        setEditingItemDomain(domainName);
                                        setEditingItemText(item.text);
                                      }}
                                      className="text-indigo-600 hover:text-indigo-800 p-1 hover:bg-indigo-50 rounded"
                                      title={t.updateItemText}
                                    >
                                      <Edit className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                  
                                  <button
                                    disabled={item.isNoneOfTheAbove}
                                    onClick={() => handleDeleteItem(domainName, item.id)}
                                    className={`p-1 rounded ${item.isNoneOfTheAbove ? "text-slate-200" : "text-rose-500 hover:text-rose-700 hover:bg-rose-50 cursor-pointer"}`}
                                    title={t.deleteItem}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CREATOR BLOCKS: Domain Adding Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t-2 border-slate-150">
              
              {/* Add Domain Core form */}
              <form onSubmit={handleCreateDomain} className="bg-indigo-50/50 border-2 border-indigo-100/80 p-5 rounded-2xl flex flex-col gap-3">
                <span className="text-xs font-extrabold text-indigo-950 uppercase">{t.addDomainLabel}</span>
                <input
                  type="text"
                  placeholder={t.domainTitlePlaceholder}
                  value={newDomainName}
                  onChange={(e) => setNewDomainName(e.target.value)}
                  className="bg-white border-2 border-slate-200 rounded-xl p-2.5 text-xs text-slate-850 placeholder-slate-400 focus:outline-indigo-500 font-semibold"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer shadow border-b-2 border-indigo-800 flex items-center justify-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  {t.addDomainBtn}
                </button>
              </form>

              {/* Add Behavior Item under dynamic domain form */}
              <form onSubmit={handleAddItem} className="bg-emerald-50/40 border-2 border-emerald-100/70 p-5 rounded-2xl flex flex-col gap-3">
                <span className="text-xs font-extrabold text-emerald-950 uppercase">{t.addNewItemLabel}</span>
                <div className="flex gap-2">
                  <select
                    value={selectedAddDomain}
                    onChange={(e) => setSelectedAddDomain(e.target.value)}
                    className="bg-white border-2 border-slate-200 rounded-xl p-2.5 text-xs text-slate-850 font-bold focus:outline-emerald-500"
                  >
                    {allDomainsKeys.map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                  
                  <input
                    type="text"
                    placeholder={t.itemTextPlaceholder}
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    className="bg-white border-2 border-slate-200 rounded-xl p-2.5 text-xs text-slate-850 placeholder-slate-400 focus:outline-emerald-500 font-semibold flex-1 min-w-0"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer shadow border-b-2 border-emerald-800 flex items-center justify-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  {t.addItemBtn}
                </button>
              </form>

            </div>

          </div>

          {/* SEC 2: Basic KPI Statistics */}
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <h2 className="text-sm font-extrabold text-indigo-950 uppercase">{t.metricsProgress}</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {[
                { label: t.totalStudents, val: 1248 },
                { label: t.iepsCompleted, val: 942 },
                { label: t.activeTeachers, val: 184 },
                { label: t.pendingReviews, val: 12, color: "text-rose-500" },
              ].map((kpi, index) => (
                <div key={index} className="bg-slate-50 border-2 border-slate-150 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
                  <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-black mb-1">{kpi.label}</span>
                  <span className={`text-2xl font-black ${kpi.color || "text-indigo-900"}`}>{kpi.val}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Sidebar Columns */}
        <div className="lg:col-span-1 flex flex-col gap-8">
          
          {/* SEC 3: Preferences Config */}
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
              <Settings className="w-4.5 h-4.5 text-indigo-600" />
              <h2 className="text-xs uppercase tracking-wider text-indigo-950 font-extrabold">{t.systemPreferences}</h2>
            </div>

            <div className="flex flex-col gap-5 text-xs">
              
              {/* Default report file type */}
              <div>
                <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wide mb-1.5">
                  {t.defaultExport}
                </label>
                <select
                  value={preferences.defaultReportFormat}
                  onChange={(e) => {
                    onUpdatePreferences({ ...preferences, defaultReportFormat: e.target.value });
                  }}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-3 text-xs text-slate-850 font-semibold focus:outline-indigo-500"
                >
                  <option value="Premium PDF Report">Premium PDF Report</option>
                  <option value="Plain Text Summary">Plain Text Summary</option>
                  <option value="Structured JSON">Structured JSON Schema</option>
                </select>
              </div>

              {/* Footnote text */}
              <div>
                <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wide mb-1.5">
                  {t.academicLogoText}
                </label>
                <input
                  type="text"
                  value={preferences.customFooterText}
                  onChange={(e) => {
                    onUpdatePreferences({ ...preferences, customFooterText: e.target.value });
                  }}
                  placeholder="Apex Academy Delhi"
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-3 text-xs text-slate-850 font-semibold focus:outline-indigo-500"
                />
              </div>

            </div>
          </div>

          {/* SEC 4: Emblem Seals Upload simulation */}
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Upload className="w-4.5 h-4.5 text-indigo-600" />
              <h2 className="text-xs uppercase tracking-wider text-indigo-950 font-extrabold">{t.emblemLabel}</h2>
            </div>
            
            <div className="border-2 border-dashed border-indigo-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-indigo-50/20">
              {logoPreview ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-indigo-300 p-1 bg-white shadow-md">
                    <img src={logoPreview} alt="Emblem" className="w-full h-full object-contain" />
                  </div>
                  <button
                    onClick={handleRemoveLogo}
                    className="text-xs text-rose-500 font-extrabold uppercase hover:underline cursor-pointer"
                  >
                    Delete logo
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer group">
                  <div className="w-12 h-12 bg-indigo-100 hover:bg-indigo-200 rounded-full flex items-center justify-center text-indigo-600 mx-auto mb-3 shadow transition-all">
                    <Upload className="w-5 h-5" />
                  </div>
                  <span className="block text-xs text-slate-600 font-bold mb-1">{t.emblemLabel}</span>
                  <span className="block text-[9px] text-slate-400 uppercase font-black tracking-wide">{t.emblemDesc}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* SEC 5: Cloud spreadsheet map synchronization */}
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600 animate-pulse" />
                <h2 className="text-xs uppercase tracking-wider text-indigo-950 font-extrabold font-sans">
                  {lang === "en" ? "Google Sheets VLOOKUP Integration" : "गूगल शीट और वी-लुकअप क्लाउड एकीकरण"}
                </h2>
              </div>
              
              <p className="text-[10px] text-slate-500 font-semibold mb-4 leading-relaxed uppercase">
                {lang === "en" 
                  ? "Link any online Google Sheet Roster. Searching numbers inside individual dashboard queries acts as a direct VLOOKUP pulling records from your cloud sheet!"
                  : "आप अपने गूगल शीट लिंक को यहाँ जोड़ सकते हैं। जब भी कोई उस नंबर से सर्च करेगा, यह डैशबोर्ड सीधे आपके गूगल शीट से रिकॉर्ड उठाकर डिटेल्स खोल देगा।"}
              </p>

              <div className="flex flex-col gap-2.5 mb-4">
                <input
                  type="text"
                  value={googleSheetUrl}
                  onChange={(e) => onUpdateGoogleSheetUrl(e.target.value)}
                  placeholder={lang === "en" ? "Paste Google Sheet url..." : "यहाँ कॉपी की हुई गूगल शीट का URL डालें..."}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-850 focus:outline-none focus:border-emerald-500 placeholder-slate-400 font-sans"
                />
                
                <div className="flex gap-2">
                  <button
                    onClick={() => onQueryGoogleSheet()}
                    disabled={isSyncingSheet}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-350 text-white text-xs font-extrabold py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 border-b-2 border-emerald-800 cursor-pointer"
                  >
                    {isSyncingSheet ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <span>🔄</span>
                    )}
                    <span>{isSyncingSheet ? (lang === "en" ? "Synchronizing..." : "सिंक हो रहा है...") : (lang === "en" ? "Fetch & Sync Sheet" : "शीट फ़ेच और सिंक करें")}</span>
                  </button>

                  <button
                    onClick={() => setShowSyncInstructions(!showSyncInstructions)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-2.5 rounded-xl transition-all border border-slate-200 cursor-pointer"
                    title="Spreadsheet Structure Guide"
                  >
                    <span>{showSyncInstructions ? (lang === "en" ? "Hide Guide" : "विवरण छिपाएं") : (lang === "en" ? "VLOOKUP Help" : "VLOOKUP कैसे बनाएं")}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl text-[10px] text-emerald-800 font-semibold flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                <span>{lang === "en" ? "Automated Sync Ready" : "स्वधारण गूगल शीट एकीकरण सक्रिय"}</span>
              </div>
              
              <a 
                href="https://docs.google.com/spreadsheets/d/1vA5WwZ4CqV8X79WwQ8D8XwS8XNCSN5T9/edit?usp=sharing" 
                target="_blank" 
                rel="noreferrer" 
                className="text-[9px] uppercase tracking-wider text-emerald-700 hover:underline flex items-center gap-1 font-extrabold"
              >
                🔗 {lang === "en" ? "Example Sheet Template" : "आई.ई.पी. शीट टेम्पलेट"}
              </a>
            </div>

            {/* EXPANDABLE GOOGLE SHEETS & VLOOKUP TUTORIAL GUIDE */}
            {showSyncInstructions && (
              <div className="bg-slate-50 border-2 border-indigo-150 p-4 rounded-xl shadow-inner text-slate-800 text-xs mt-3 animate-fadeIn duration-300">
                <div className="flex items-center justify-between pb-2 border-b border-indigo-200/50 mb-3">
                  <h3 className="font-extrabold text-indigo-950 uppercase tracking-widest text-[10px] flex items-center gap-1.5 font-sans">
                    <span>📋</span>
                    {lang === "en" ? "VLOOKUP CONFIGURATION SYSTEM" : "गूगल शीट वी-लुकअप सेटअप मार्गदर्शिका"}
                  </h3>
                </div>

                <div className="flex flex-col gap-4 text-[10.5px] leading-relaxed">
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1 underline">{lang === "en" ? "Step 1: Columns Layout" : "चरण 1: गूगल शीट की कॉलम संरचना"}</h4>
                    <p className="mb-2 text-[10px] text-slate-600">
                      {lang === "en" 
                        ? "Ensure column headers declared in Row 1 are precisely as follows (order must be preserved):"
                        : "पंक्ति 1 में सुनिश्चित करें कि निम्नलिखित कॉलम हेडर नाम लिखे हों:"}
                    </p>
                    <div className="bg-white p-2 rounded border border-slate-200 max-h-36 overflow-y-auto">
                      <table className="w-full text-left text-[10px] font-semibold text-slate-700">
                        <thead>
                          <tr className="border-b uppercase text-slate-400 text-[9px]">
                            <th>Col</th>
                            <th>Header (English)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b"><td>A</td><td className="font-mono text-indigo-600 font-bold">student_id</td></tr>
                          <tr className="border-b"><td>B</td><td className="font-mono text-indigo-600 font-bold">student_name</td></tr>
                          <tr className="border-b"><td>C</td><td className="font-mono text-indigo-600 font-bold">school_name</td></tr>
                          <tr className="border-b"><td>D</td><td className="font-mono text-indigo-600 font-bold">className</td></tr>
                          <tr className="border-b"><td>E</td><td className="font-mono text-indigo-600 font-bold">disabilityType</td></tr>
                          <tr className="border-b"><td>F</td><td className="font-mono text-indigo-600 font-bold">disabilityCertificate</td></tr>
                          <tr className="border-b"><td>G</td><td className="font-mono text-indigo-600 font-bold">dateOfBirth</td></tr>
                          <tr className="border-b"><td>H</td><td className="font-mono text-indigo-600 font-bold">generalTeacher</td></tr>
                          <tr className="border-b"><td>I</td><td className="font-mono text-indigo-600 font-bold">specialTeacher</td></tr>
                          <tr className="border-b"><td>J</td><td className="font-mono text-indigo-600 font-bold">draftObjective</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 mb-1 underline">{lang === "en" ? "Step 2: Excel VLOOKUP Formulas" : "चरण 2: एक्सेल वी-लुकअप फॉर्मूला"}</h4>
                    <pre className="bg-slate-900 text-emerald-400 p-2 ml-1 rounded border border-slate-800 text-[9.5px] font-mono leading-tight select-all max-w-full overflow-x-auto">
{`=VLOOKUP(A2, 'IEP Roster'!A:J, 2, FALSE)
=VLOOKUP(A2, 'IEP Roster'!A:J, 5, FALSE)`}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SEC 6: Board Reporting Spreadsheet (Export Excel) */}
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <FileSpreadsheet className="w-4.5 h-4.5 text-indigo-600 animate-pulse" />
              <h2 className="text-xs uppercase tracking-wider text-indigo-950 font-extrabold">
                {lang === "en" ? "Export to Excel" : "एक्सेल में एक्सपोर्ट करें"}
              </h2>
            </div>
            
            <p className="text-[10px] text-slate-500 font-semibold mb-4 leading-relaxed uppercase">
              {lang === "en" 
                ? "Download comprehensive student IEP data, checklists, and qualitative progress reports as a structured multi-sheet Excel workbook for official board auditing & compliance." 
                : "आधिकारिक बोर्ड ऑडिटिंग और अनुपालन के लिए छात्र के व्यापक आईईपी डेटा, चेकलिस्ट और प्रगति टिप्पणियों को मल्टी-शीट एक्सेल वर्कबुक पर डाउनलोड करें।"}
            </p>

            <button
              onClick={handleExportToExcel}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer shadow border-b-2 border-emerald-800 flex items-center justify-center gap-2 font-sans"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>{lang === "en" ? "Generate Board Report (.xlsx)" : "बोर्ड रिपोर्ट (.xlsx) जेनरेट करें"}</span>
            </button>
          </div>
          
        </div>

      </div>
    </div>
  );
}
