import React, { useState, useEffect } from "react";
import { 
  Bell, 
  Settings, 
  User, 
  LayoutDashboard, 
  Settings2, 
  Lock,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  X,
  Globe,
  Trash2,
  Plus,
  PieChart,
  Loader2,
  FileSpreadsheet,
  Volume2,
  Compass
} from "lucide-react";
import { StudentProfile, Checklists, EducatorNotes, DomainType, Preferences, StudentRecord } from "./types";
import PinLockOverlay from "./components/PinLockOverlay";
import StudentProfileView from "./components/StudentProfileView";
import AdminPanelView from "./components/AdminPanelView";
import VisualizationDashboard from "./components/VisualizationDashboard";
import BasicMrAssessmentView from "./components/BasicMrAssessmentView";
import HearingImpairmentView from "./components/HearingImpairmentView";
import NationalInstitutesHubView from "./components/NationalInstitutesHubView";
import { LanguageType, CLASSES_LIST, DISABILITIES_LIST, translationMap, getRoman } from "./language";
import { getDefaultChecklists, getDefaultNotes, IEP_SECTIONS_22 } from "./defaultData";
import { googleSignIn, logout, initAuth } from "./firebaseAuth";
import { User as FirebaseUser } from "firebase/auth";

export default function App() {
  
  // Active language state (Dual Language Support: Hindi / English)
  const [lang, setLang] = useState<LanguageType>(() => {
    const saved = localStorage.getItem("iep_lang");
    return (saved as LanguageType) || "en";
  });

  const t = translationMap[lang];

  // Navigation Tabs Routing
  const [activeTab, setActiveTab ] = useState<"Dashboard" | "Live Dashboard" | "BASIC-MR Tool" | "Hearing Impairment Tool" | "National Institutes Hub" | "Admin Panel">("Dashboard");
  const [unlocked, setUnlocked] = useState<boolean>(() => {
    return localStorage.getItem("iep_admin_unlocked") === "true";
  });
  const [showPinOverlay, setShowPinOverlay] = useState<boolean>(false);

  // Pop-up Toast Notifications
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" } | null>(null);

  const showToastMsg = (msg: string, type: "success" | "info" = "success") => {
    setToast({ message: msg, type: type });
    setTimeout(() => setToast(null), 3000);
  };

  // Active student selection tracking state
  const [activeStudentId, setActiveStudentId] = useState<string>("1001");

  // Demographics student state - INITIALIZED FULLY EMPTY ON BOOT/PAGE OPEN
  const [profile, setProfile] = useState<StudentProfile>({
    studentId: "",
    schoolName: "",
    studentName: "",
    className: "c1",
    disabilityType: "1",
    disabilityCertificate: false,
    generalTeacher: "",
    specialTeacher: "",
    dateOfBirth: "",
    block: "",
    district: "",
    learningOutcomeCycle: "6monthly"
  });

  // Dynamic Checklists State across domains - INITIALIZED ENTIRELY OFF/UNCHECKED
  const [checklists, setChecklists] = useState<Checklists>(() => getDefaultChecklists());

  // Educator qualitative journal state - INITIALIZED COMPLETELY BLANK
  const [notes, setNotes] = useState<EducatorNotes>(() => getDefaultNotes());

  // Active Focus Domain tab state
  const [activeDomain, setActiveDomain] = useState<string>("1. Student Profile & Background (छात्र विवरण व पृष्ठभूमि)");

  // IEP Target Objective statement - INITIALIZED COMPLETELY BLANK
  const [draftObjective, setDraftObjective] = useState<string>("");

  // Static preferences (with AI sidebar preference removed or disabled)
  const [preferences, setPreferences] = useState<Preferences>(() => {
    return {
      defaultReportFormat: "Premium PDF Report",
      customFooterText: "Apex Academy Delhi",
      showAiSidebar: false,
      showExperimental: false
    };
  });

  // --- MULTI STUDENT REGISTRY PERSISTENCE ENGINE ---
  const [studentsList, setStudentsList] = useState<StudentRecord[]>(() => {
    const saved = localStorage.getItem("iep_all_students");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return []; // Start with an absolutely clean registry, clearing the default list
  });

  // Load a student from index
  const loadStudent = (id: string, customList?: StudentRecord[]) => {
    const targetList = customList || studentsList;
    const found = targetList.find(s => s.id === id);
    if (found) {
      setActiveStudentId(id);
      // Temporarily set active student edits
      setProfile(found.profile);
      setChecklists(found.checklists);
      setNotes(found.notes);
      setDraftObjective(found.draftObjective);
      showToastMsg(lang === "en" 
        ? `Loaded Record: ${found.profile.studentName} (${id})` 
        : `सफलतापूर्वक लोड किया गया: ${found.profile.studentName} (${id})`, 
        "success"
      );
      return true;
    }
    return false;
  };

  // Helper to create a new profile registry slot
  const createNewStudent = (customId?: string, customName?: string) => {
    const nextId = customId || (Math.floor(1000 + Math.random() * 9000)).toString();
    const newRecord: StudentRecord = {
      id: nextId,
      profile: {
        studentId: nextId,
        schoolName: "Apex Academy Delhi",
        studentName: customName || (lang === "en" ? `New Student` : `नया छात्र`),
        className: "c1",
        disabilityType: "1",
        disabilityCertificate: false,
        generalTeacher: "Teacher Name",
        specialTeacher: "Educator Name",
        dateOfBirth: "2018-01-01"
      },
      checklists: getDefaultChecklists(),
      notes: getDefaultNotes(),
      draftObjective: `"By [Target Date], when presented with..."`,
      updatedAt: new Date().toISOString()
    };

    setStudentsList(prev => {
      if (prev.some(s => s.id === nextId)) {
        return prev;
      }
      return [...prev, newRecord];
    });
    setActiveStudentId(nextId);
    setProfile(newRecord.profile);
    setChecklists(newRecord.checklists);
    setNotes(newRecord.notes);
    setDraftObjective(newRecord.draftObjective);
    showToastMsg(lang === "en" 
      ? `Allocated student ID: ${nextId}` 
      : `सफलतापूर्वक एक नया छात्र नंबर ${nextId} दिया गया!`, 
      "success"
    );
  };

  // Google Workspace Cloud Integration & OAuth State
  const [googleSheetUrl, setGoogleSheetUrl] = useState(() => {
    return localStorage.getItem("iep_connected_sheet_url") || "";
  });
  const [isSyncingSheet, setIsSyncingSheet] = useState(false);
  const [gUser, setGUser] = useState<any>(null);
  const [gToken, setGToken] = useState<string | null>(null);
  const [driveSpreadsheets, setDriveSpreadsheets] = useState<any[]>([]);
  const [selectedDriveSpreadsheetId, setSelectedDriveSpreadsheetId] = useState<string>("");
  const [isLoadingSpreadsheets, setIsLoadingSpreadsheets] = useState(false);

  // Initialize Firebase Auth & register user state listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setGUser(user);
        setGToken(token);
      },
      () => {
        setGUser(null);
        setGToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fetch spreadsheets from user's Google Drive when logged in
  const fetchDriveSpreadsheets = async (tokenString: string) => {
    setIsLoadingSpreadsheets(true);
    try {
      const query = encodeURIComponent("mimeType='application/vnd.google-apps.spreadsheet'");
      const res = await fetch(`https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,webViewLink)`, {
        headers: { Authorization: `Bearer ${tokenString}` }
      });
      if (res.ok) {
        const data = await res.json();
        const filesList = data.files || [];
        setDriveSpreadsheets(filesList);
        
        // If there's an existing mapped URL or sheet ID, auto-select it under the hood
        if (googleSheetUrl && filesList.length > 0) {
          let foundId = "";
          if (googleSheetUrl.includes("docs.google.com/spreadsheets")) {
            const match = googleSheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
            if (match && match[1]) foundId = match[1];
          } else {
            foundId = googleSheetUrl.trim();
          }
          if (foundId && filesList.some((s: any) => s.id === foundId)) {
            setSelectedDriveSpreadsheetId(foundId);
          }
        }
      }
    } catch (e) {
      console.error("Error listing files from Drive:", e);
    } finally {
      setIsLoadingSpreadsheets(false);
    }
  };

  useEffect(() => {
    if (gToken) {
      fetchDriveSpreadsheets(gToken);
    } else {
      setDriveSpreadsheets([]);
      setSelectedDriveSpreadsheetId("");
    }
  }, [gToken]);

  // Handle auto-population and synchronization if spreadsheet selector is changed
  useEffect(() => {
    if (selectedDriveSpreadsheetId) {
      const selectedObj = driveSpreadsheets.find(s => s.id === selectedDriveSpreadsheetId);
      if (selectedObj) {
        const url = `https://docs.google.com/spreadsheets/d/${selectedDriveSpreadsheetId}/edit`;
        setGoogleSheetUrl(url);
        localStorage.setItem("iep_connected_sheet_url", url);
      }
    }
  }, [selectedDriveSpreadsheetId, driveSpreadsheets]);

  const handleGoogleLogin = async () => {
    try {
      const result = await googleSignIn();
      if (result) {
        setGUser(result.user);
        setGToken(result.accessToken);
        showToastMsg(
          lang === "en" 
            ? `Signed in safely as ${result.user.displayName || result.user.email}!` 
            : `गूगल खाते से सफलतापूर्वक लिंक किया गया: ${result.user.displayName || result.user.email}!`, 
          "success"
        );
      }
    } catch (err: any) {
      console.error("Google Sign-in/OAuth error:", err);
      showToastMsg(
        lang === "en" ? `OAuth Connection Failed: ${err.message}` : `संबंध स्थापित करने में त्रुटि: ${err.message}`, 
        "info"
      );
    }
  };

  const handleGoogleLogout = async () => {
    try {
      await logout();
      setGUser(null);
      setGToken(null);
      setDriveSpreadsheets([]);
      setSelectedDriveSpreadsheetId("");
      showToastMsg(
        lang === "en" ? "Google account unlinked successfully." : "गूगल खाते से सुरक्षित रूप से साइन-आउट कर लिया गया है।", 
        "info"
      );
    } catch (err: any) {
      console.error("Google logout error:", err);
    }
  };

  // Sync Google Sheet values function at root level
  const handleQueryGoogleSheet = async (targetId?: string) => {
    let spreadsheetId = "";

    if (selectedDriveSpreadsheetId) {
      spreadsheetId = selectedDriveSpreadsheetId;
    } else if (googleSheetUrl) {
      if (googleSheetUrl.includes("docs.google.com/spreadsheets")) {
        const match = googleSheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
        if (match && match[1]) {
          spreadsheetId = match[1];
        }
      } else {
        spreadsheetId = googleSheetUrl.trim();
      }
    }

    if (!spreadsheetId) {
      showToastMsg(
        lang === "en" ? "Please enter or select a Google Sheet spreadsheet first." : "कृपया पहले वैध गूगल शीट का URL या ID चुनें।", 
        "info"
      );
      return;
    }

    setIsSyncingSheet(true);
    try {
      let rows: string[][] = [];

      // If user is authenticated, query the Google Sheets REST API directly (no web publishing requirement!)
      if (gToken) {
        showToastMsg(
          lang === "en" ? "Querying secure Google Sheets API..." : "सुरक्षित गूगल शीट्स एपीआई से विवरण मंगाया जा रहा है...", 
          "info"
        );
        const metaRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`, {
          headers: { Authorization: `Bearer ${gToken}` }
        });
        if (!metaRes.ok) {
          const errText = await metaRes.text();
          throw new Error(`Cloud Sheets metadata read failed: ${errText}`);
        }
        const meta = await metaRes.json();
        const firstSheetName = meta.sheets?.[0]?.properties?.title || "Sheet1";

        showToastMsg(
          lang === "en" ? `Scanning range on sheet window [${firstSheetName}]...` : `विंडो [${firstSheetName}] से डेटा स्कैन किया जा रहा है...`, 
          "info"
        );
        const range = `${firstSheetName}!A1:L1000`;
        const valuesRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}`, {
          headers: { Authorization: `Bearer ${gToken}` }
        });
        if (!valuesRes.ok) {
          throw new Error(`Cloud Sheets values read failed: ${valuesRes.statusText}`);
        }
        const valuesData = await valuesRes.json();
        rows = valuesData.values || [];
      } else {
        // Fallback to public published CSV parser if they are not authenticated
        showToastMsg(
          lang === "en" ? "Reading public web published Google sheet CSV..." : "सार्वजनिक रूप से साझा वेब सीएसवी का मिलान किया जा रहा है...", 
          "info"
        );
        const sheetCsvUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/pub?output=csv`;
        const res = await fetch(sheetCsvUrl);
        if (!res.ok) {
          throw new Error(`HTTP status ${res.status}. For private files, please sign in with Google.`);
        }
        const text = await res.text();
        rows = text.split(/\r?\n/).map(line => {
          return line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(cell => cell.replace(/^"|"$/g, "").trim());
        });
      }

      if (rows.length < 2) {
        throw new Error("Connected sheet has no diagnostic records rows.");
      }

      const parsedRecords: StudentRecord[] = [];
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (!row || row.length < 2 || !row[0]) continue;

        const sId = row[0];
        const sName = row[1];
        const sSchool = row[2] || "Apex Academy Delhi";
        const sClass = row[3] || "c1";
        const sDisability = row[4] || "1";
        const sCert = row[5] === "TRUE" || row[5] === "Yes" || row[5] === "हाँ" || row[5] === "true" || row[5] === "1";
        const sDob = row[6] || "2018-01-01";
        const sGenTeacher = row[7] || "Mrs. Sharda Sharma";
        const sSpTeacher = row[8] || "Mr. Ramesh Malhotra";
        const sObjective = row[9] || `"By [Target Date], when presented with..."`;
        
        let parsedChecklists = checklists; 
        if (row[10]) {
          try {
            parsedChecklists = JSON.parse(row[10]);
          } catch(e) {}
        }

        let parsedNotes = notes;
        if (row[11]) {
          try {
            parsedNotes = JSON.parse(row[11]);
          } catch(e) {}
        }

        parsedRecords.push({
          id: sId,
          profile: {
            studentId: sId,
            schoolName: sSchool,
            studentName: sName,
            className: sClass,
            disabilityType: sDisability,
            disabilityCertificate: sCert,
            generalTeacher: sGenTeacher,
            specialTeacher: sSpTeacher,
            dateOfBirth: sDob
          },
          checklists: parsedChecklists,
          notes: parsedNotes,
          draftObjective: sObjective,
          updatedAt: new Date().toISOString()
        });
      }

      if (parsedRecords.length > 0) {
        setStudentsList(parsedRecords);
        localStorage.setItem("iep_all_students", JSON.stringify(parsedRecords));
        if (googleSheetUrl) {
          localStorage.setItem("iep_connected_sheet_url", googleSheetUrl);
        }
        
        const query = targetId;
        if (query) {
          const matched = parsedRecords.find(s => s.id === query);
          if (matched) {
            loadStudent(query, parsedRecords);
          } else {
            showToastMsg(
              lang === "en" 
                ? `Fetched ${parsedRecords.length} records. Roster search key ID '${query}' not found in file.` 
                : `शीट से ${parsedRecords.length} रिकॉर्ड मिले। परन्तु आवंटित नंबर '${query}' नहीं मिला।`, 
              "info"
            );
          }
        } else {
          showToastMsg(
            lang === "en"
              ? `Successfully synchronized ${parsedRecords.length} student records from Google Sheets Workspace!`
              : `गूगल शीट वर्कस्पेस से ${parsedRecords.length} छात्र रिकॉर्ड सफलतापूर्वक अपडेट किये गये!`,
            "success"
          );
        }
      } else {
        throw new Error("Scanned data had no valid rows matching template schema.");
      }
    } catch (e: any) {
      console.error(e);
      showToastMsg(
        lang === "en" 
          ? `Cloud sync failed: ${e.message}. If private, try re-logging to authenticate secure tokens.`
          : `क्लाउड सिंक विफल: ${e.message}। कृपया सुनिश्चित करें कि आप गूगल से साइन-इन हैं।`,
        "info"
      );
    } finally {
      setIsSyncingSheet(false);
    }
  };

  const handleWriteStudentToGoogleSheet = async (studentIdToSave?: string) => {
    if (!gToken) {
      showToastMsg(
        lang === "en" ? "Please sign in with Google Workspace credentials first." : "क्लाउड सेविंग के लिए कृपया पहले गूगल से साइन इन करें।", 
        "info"
      );
      return;
    }

    let spreadsheetId = "";
    if (selectedDriveSpreadsheetId) {
      spreadsheetId = selectedDriveSpreadsheetId;
    } else if (googleSheetUrl) {
      if (googleSheetUrl.includes("docs.google.com/spreadsheets")) {
        const match = googleSheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
        if (match && match[1]) {
          spreadsheetId = match[1];
        }
      } else {
        spreadsheetId = googleSheetUrl.trim();
      }
    }

    if (!spreadsheetId) {
      showToastMsg(
        lang === "en" ? "Please set a connected Google Spreadsheet link." : "कृपया पहले वैध गूगल शीट का सूत्र दर्ज करें।", 
        "info"
      );
      return;
    }

    const targetId = studentIdToSave || activeStudentId;
    const student = studentsList.find(s => s.id === targetId) || {
      id: targetId,
      profile,
      checklists,
      notes,
      draftObjective
    };

    // User prompt prior to data writing (MANDATORY per Workspace Integration skill docs)
    const confirmed = window.confirm(
      lang === "en"
        ? `Sync and overwrite '${student.profile.studentName || "New Student"}' (ID: ${targetId}) directly inside your connected Google Spreadsheet?\nRange values under this student ID in Row Columns A-L will be updated.`
        : `क्या आप सीधे अपनी गूगल शीट में '${student.profile.studentName || "नया छात्र"}' (ID: ${targetId}) का रिकॉर्ड सिंक और ओवरराइट करना चाहते हैं? इससे शीट में डेटा रो अपडेट हो जाएगी।`
    );
    if (!confirmed) return;

    setIsSyncingSheet(true);
    try {
      showToastMsg(lang === "en" ? "Updating cloud spreadsheet dataset..." : "क्लाउड डेटासेट अपडेट किया जा रहा है...", "info");

      // Fetch spreadsheet meta
      const metaRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`, {
        headers: { Authorization: `Bearer ${gToken}` }
      });
      if (!metaRes.ok) {
        throw new Error("Unable to establish access to the selected spreadsheet file. Verify permissions.");
      }
      const meta = await metaRes.json();
      const firstSheetName = meta.sheets?.[0]?.properties?.title || "Sheet1";

      // Read current values
      const valuesRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(firstSheetName)}!A1:L1000`, {
        headers: { Authorization: `Bearer ${gToken}` }
      });
      let rows: string[][] = [];
      if (valuesRes.ok) {
        const valuesData = await valuesRes.json();
        rows = valuesData.values || [];
      }

      // Format target student data values
      const p = student.profile;
      const newRow = [
        targetId,
        p.studentName || "",
        p.schoolName || "",
        p.className || "",
        p.disabilityType || "",
        p.disabilityCertificate ? "TRUE" : "FALSE",
        p.dateOfBirth || "",
        p.generalTeacher || "",
        p.specialTeacher || "",
        student.draftObjective || "",
        JSON.stringify(student.checklists || {}),
        JSON.stringify(student.notes || {})
      ];

      // Find matching row
      let matchedIndex = -1;
      for (let i = 1; i < rows.length; i++) {
        if (rows[i] && rows[i][0] === targetId) {
          matchedIndex = i;
          break;
        }
      }

      let updateUrl = "";
      let method = "PUT";
      let bodyValueRange: any = {};

      if (matchedIndex !== -1) {
        const rowIndex = matchedIndex + 1;
        const range = `${firstSheetName}!A${rowIndex}:L${rowIndex}`;
        updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`;
        bodyValueRange = {
          range,
          majorDimension: "ROWS",
          values: [newRow]
        };
      } else {
        const range = `${firstSheetName}!A1:L1`;
        updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED`;
        bodyValueRange = {
          values: [newRow]
        };
        method = "POST";
      }

      const writeRes = await fetch(updateUrl, {
        method,
        headers: {
          Authorization: `Bearer ${gToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(bodyValueRange)
      });

      if (!writeRes.ok) {
        const errText = await writeRes.text();
        throw new Error(errText);
      }

      showToastMsg(
        lang === "en"
          ? `Successfully exported and cloud-secured '${student.profile.studentName}' record inside Google Sheets!`
          : `गूगल शीट में '${student.profile.studentName}' का रिकॉर्ड सफलतापूर्वक सिंक कर दिया गया है!`,
        "success"
      );
    } catch (e: any) {
      console.error(e);
      showToastMsg(
        lang === "en" ? `Export failed: ${e.message}` : `क्लाउड सिंक विफल रहा: ${e.message}`, 
        "info"
      );
    } finally {
      setIsSyncingSheet(false);
    }
  };

  // Manual save handler for student records (with optional custom ID)
  const handleManualSaveStudent = (customId?: string, downloadCsv: boolean = false) => {
    const sId = customId || profile.studentId || activeStudentId;
    if (!sId || sId.trim() === "" || sId.trim() === "1001" && profile.studentName === "") {
      showToastMsg(
        lang === "en" ? "Error: Please enter both a Student ID and name before saving!" : "त्रुटि: सहेजने से पहले कृपया छात्र का नाम और रोल नंबर दर्ज करें!",
        "info"
      );
      return;
    }

    const cleanedId = sId.trim();
    const updatedProfile = { 
      ...profile, 
      studentId: cleanedId,
      schoolName: profile.schoolName || "",
      studentName: profile.studentName || ""
    };

    let updatedList: StudentRecord[] = [];
    setStudentsList(prev => {
      const matchIndex = prev.findIndex(s => s.id === cleanedId);
      const newRecord: StudentRecord = {
        id: cleanedId,
        profile: updatedProfile,
        checklists,
        notes,
        draftObjective,
        updatedAt: new Date().toISOString()
      };
      
      const newList = [...prev];
      if (matchIndex === -1) {
        newList.push(newRecord);
      } else {
        newList[matchIndex] = newRecord;
      }
      updatedList = newList;
      localStorage.setItem("iep_all_students", JSON.stringify(newList));
      return newList;
    });

    if (downloadCsv) {
      // Generate and push CSV update download immediately for VLOOKUP matches
      triggerCSVDownload(cleanedId, updatedProfile, updatedList);
    } else {
      showToastMsg(
        lang === "en" 
          ? "Student record saved and database synced successfully!" 
          : "छात्र का रिकॉर्ड सुरक्षित कर लिया गया है और डेटा सिंक हो गया है!",
        "success"
      );
    }
  };

  const triggerCSVDownload = (currentId: string, currentProfile: StudentProfile, list: StudentRecord[]) => {
    const csvHeaders = [
      "student_id",
      "student_name",
      "school_name",
      "className",
      "disabilityType",
      "disabilityCertificate",
      "dateOfBirth",
      "generalTeacher",
      "specialTeacher",
      "draftObjective",
      "block",
      "district"
    ];

    const targetList = list.length > 0 ? list : [{ id: currentId, profile: currentProfile, checklists, notes, draftObjective }];

    const csvRows = targetList.map(s => {
      const p = s.profile;
      return [
        p.studentId || s.id,
        `"${(p.studentName || "").replace(/"/g, '""')}"`,
        `"${(p.schoolName || "").replace(/"/g, '""')}"`,
        p.className || "",
        p.disabilityType || "",
        p.disabilityCertificate ? "TRUE" : "FALSE",
        p.dateOfBirth || "",
        `"${(p.generalTeacher || "").replace(/"/g, '""')}"`,
        `"${(p.specialTeacher || "").replace(/"/g, '""')}"`,
        `"${(s.draftObjective || "").replace(/"/g, '""')}"`,
        `"${(p.block || "").replace(/"/g, '""')}"`,
        `"${(p.district || "").replace(/"/g, '""')}"`
      ].join(",");
    });

    const csvContent = "\uFEFF" + [csvHeaders.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Student_Registry_VLookup_Data.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToastMsg(
      lang === "en" 
        ? "Form registry updated! CSV spreadsheet saved successfully." 
        : "फ़ॉर्म रजिस्ट्री अपडेट की गई! CSV स्प्रेडशीट सफलतापूर्वक सुरक्षित हुई।", 
      "success"
    );
  };

  useEffect(() => {
    localStorage.setItem("iep_lang", lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem("iep_preferences", JSON.stringify(preferences));
  }, [preferences]);

  // Handle single checklist behaviors (including "None of the above" requirements)
  const handleToggleChecklist = (domain: string, id: string) => {
    const domainItems = checklists[domain] || [];
    const isNoneItem = id.startsWith("none_");

    const updated = domainItems.map((item) => {
      if (item.id === id) {
        return { ...item, checked: !item.checked };
      }
      // If none of the above is checked, uncheck all other indicators
      if (isNoneItem) {
        return { ...item, checked: false };
      }
      return item;
    });

    // If a normal item is checked, uncheck the none of the above option automatically
    const cleaned = !isNoneItem 
      ? updated.map(item => item.isNoneOfTheAbove ? { ...item, checked: false } : item)
      : updated;

    setChecklists({
      ...checklists,
      [domain]: cleaned
    });

    if (isNoneItem && !domainItems.find(x => x.id === id)?.checked) {
      showToastMsg(t.toastNoneApplied, "info");
    } else {
      showToastMsg(t.toastModified, "info");
    }
  };

  const handleUpdateNotes = (domain: string, text: string) => {
    setNotes({
      ...notes,
      [domain]: text
    });
  };

  const handleLogoutAndGoToDashboard = () => {
    setUnlocked(false);
    localStorage.removeItem("iep_admin_unlocked");
    setActiveTab("Dashboard");
    showToastMsg(lang === "en" ? "Logged out from Admin Panel" : "एडमिन पैनल से लॉग आउट हो गए हैं", "info");
  };

  const handleNavigation = (tab: "Dashboard" | "Live Dashboard" | "BASIC-MR Tool" | "Hearing Impairment Tool" | "National Institutes Hub" | "Admin Panel") => {
    if (tab === "Admin Panel" && !unlocked) {
      setShowPinOverlay(true);
    } else {
      if ((tab === "Dashboard" || tab === "Live Dashboard" || tab === "BASIC-MR Tool" || tab === "Hearing Impairment Tool" || tab === "National Institutes Hub") && activeTab === "Admin Panel") {
        setUnlocked(false);
        localStorage.removeItem("iep_admin_unlocked");
        showToastMsg(lang === "en" ? "Logged out dynamically" : "स्वचालित रूप से लॉग आउट किया गया", "info");
      }
      setActiveTab(tab);
    }
  };

  // Toggle English versus Hindi language seamlessly
  const toggleLanguage = () => {
    setLang(prev => (prev === "en" ? "hi" : "en"));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans select-text relative">
      
      {/* Toast Notification */}
      {toast && (
        <div id="toast-wrapper" className="fixed bottom-6 right-6 z-50 p-4 bg-white border-2 border-indigo-500 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full animate-ping" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-800 select-none whitespace-normal max-w-xs leading-normal">
            {toast.message}
          </span>
          <button onClick={() => setToast(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* LIGHT HERO TOP NAVIGATION */}
      <nav id="header-nav" className="border-b border-indigo-100 bg-white py-4 px-6 flex flex-wrap items-center justify-between sticky top-0 z-40 print:hidden shadow-sm">
        
        {/* Left Branding Area */}
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 text-white font-bold p-2.5 rounded-lg shadow-md flex items-center justify-center">
            <span className="text-lg font-serif italic tracking-wider">V</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[17px] font-bold tracking-wider text-indigo-900 uppercase font-sans">
                {t.title}
              </span>
              <span className="bg-amber-100 text-amber-800 text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded border border-amber-200">
                LMS Pro
              </span>
            </div>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mt-0.5">
              {t.subtitle}
            </p>
          </div>
        </div>

        {/* Center Tab Links */}
        <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200/80 rounded-xl p-1.5 shadow-inner">
          <button
            id="tab-dashboard"
            onClick={() => handleNavigation("Dashboard")}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              activeTab === "Dashboard" 
                ? "bg-indigo-600 text-white shadow-md font-semibold" 
                : "text-slate-500 hover:text-indigo-600 hover:bg-slate-200/50"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            {t.dashboard}
          </button>

          <button
            id="tab-live-dashboard"
            onClick={() => handleNavigation("Live Dashboard")}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              activeTab === "Live Dashboard" 
                ? "bg-indigo-600 text-white shadow-md font-semibold" 
                : "text-slate-500 hover:text-indigo-600 hover:bg-slate-200/50"
            }`}
          >
            <PieChart className="w-4 h-4" />
            {lang === "en" ? "Live Dashboard" : "लाइव डैशबोर्ड"}
          </button>

          <button
            id="tab-basic-mr"
            onClick={() => handleNavigation("BASIC-MR Tool")}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              activeTab === "BASIC-MR Tool" 
                ? "bg-indigo-600 text-white shadow-md font-semibold" 
                : "text-slate-500 hover:text-indigo-600 hover:bg-slate-200/50"
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            {lang === "en" ? "BASIC-MR Tool" : "बेसिक-एमआर टूल"}
          </button>

          <button
            id="tab-hi-tool"
            onClick={() => handleNavigation("Hearing Impairment Tool")}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              activeTab === "Hearing Impairment Tool" 
                ? "bg-indigo-600 text-white shadow-md font-semibold" 
                : "text-slate-500 hover:text-indigo-600 hover:bg-slate-200/50"
            }`}
          >
            <Volume2 className="w-4 h-4" />
            {lang === "en" ? "Hearing Impairment Tool" : "श्रवण अक्षमता टूल (HI)"}
          </button>

          <button
            id="tab-national-institutes"
            onClick={() => handleNavigation("National Institutes Hub")}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              activeTab === "National Institutes Hub" 
                ? "bg-indigo-600 text-white shadow-md font-semibold" 
                : "text-slate-500 hover:text-indigo-600 hover:bg-slate-200/50"
            }`}
          >
            <Compass className="w-4 h-4" />
            {lang === "en" ? "National Institutes Hub" : "राष्ट्रीय संस्थान हब"}
          </button>
          
          <button
            id="tab-admin"
            onClick={() => handleNavigation("Admin Panel")}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer relative ${
              activeTab === "Admin Panel" 
                ? "bg-indigo-600 text-white shadow-md font-semibold" 
                : "text-slate-500 hover:text-indigo-600 hover:bg-slate-200/50"
            }`}
          >
            {unlocked ? (
              <Settings2 className="w-4 h-4" />
            ) : (
              <Lock className="w-3.5 h-3.5 text-indigo-400" />
            )}
            {t.adminPanel}
          </button>
        </div>

        {/* Right Action Utilities (Language Switch & Identity) */}
        <div className="flex items-center gap-4 mt-2 sm:mt-0">
          
          {/* Dual-languages switcher toggle */}
          <button 
            id="lang-toggle-btn"
            onClick={toggleLanguage}
            className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-extrabold px-3 py-2 rounded-xl border border-indigo-200/80 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="भाषा बदलें / Toggle Language"
          >
            <Globe className="w-3.5 h-3.5 text-indigo-600 animate-spin" style={{ animationDuration: "12s" }} />
            <span>{lang === "en" ? "हिन्दी" : "English"}</span>
          </button>

          {/* Quick Notification Area */}
          <button 
            id="notif-bell"
            onClick={() => showToastMsg(lang === "en" ? "Next scheduled review date: April 15, 2026." : "अगली निर्धारित समीक्षा तिथि: 15 अप्रैल, 2026.", "info")}
            className="text-slate-400 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200 p-2 rounded-xl transition-all relative cursor-pointer"
            title="Alerts"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white" />
          </button>

          <span className="hidden lg:inline-block text-[10px] uppercase font-mono tracking-widest text-slate-400 font-bold bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            {lang === "en" ? "Light LMS Theme" : "लाइट रंगीन थीम"}
          </span>

          {/* Avatar Area */}
          <div className="w-9 h-9 rounded-full border-2 border-indigo-200 bg-indigo-50 p-0.5 flex items-center justify-center shadow-sm">
            <User className="w-4 h-4 text-indigo-600" />
          </div>

        </div>

      </nav>

      {/* CORE WORKSPACE PAGE CONTAINER */}
      <main id="main-content" className="flex-1 max-w-[1700px] w-full mx-auto flex flex-col z-10 p-4 md:p-6 lg:p-8">
        
        <div className="flex-1 flex flex-col min-h-0 bg-white rounded-2xl border-2 border-slate-200 shadow-xl overflow-hidden">
          
          <div className="flex-1 p-5 md:p-8 overflow-y-auto">
            {activeTab === "Dashboard" ? (
              <StudentProfileView
                lang={lang}
                profile={profile}
                onUpdateProfile={setProfile}
                checklists={checklists}
                onToggleChecklist={handleToggleChecklist}
                notes={notes}
                onUpdateNotes={handleUpdateNotes}
                activeDomain={activeDomain}
                onChangeDomain={setActiveDomain}
                draftObjective={draftObjective}
                onUpdateObjective={setDraftObjective}
                showToastMsg={showToastMsg}
                notesSaveStatus="saved"
                objectiveSaveStatus="saved"
                studentsList={studentsList}
                activeStudentId={activeStudentId}
                onLoadStudent={loadStudent}
                onCreateNewStudent={createNewStudent}
                onBulkImportStudents={(records) => setStudentsList(records)}
                onSaveStudent={handleManualSaveStudent}
                googleSheetUrl={googleSheetUrl}
                onQueryGoogleSheet={handleQueryGoogleSheet}
              />
            ) : activeTab === "Live Dashboard" ? (
              <VisualizationDashboard
                lang={lang}
                studentsList={studentsList}
              />
            ) : activeTab === "BASIC-MR Tool" ? (
              <BasicMrAssessmentView
                lang={lang}
                studentsList={studentsList}
                activeStudentId={activeStudentId}
                onLoadStudent={loadStudent}
                showToastMsg={showToastMsg}
              />
            ) : activeTab === "Hearing Impairment Tool" ? (
              <HearingImpairmentView
                lang={lang}
                studentsList={studentsList}
                activeStudentId={activeStudentId}
                onLoadStudent={loadStudent}
                showToastMsg={showToastMsg}
              />
            ) : activeTab === "National Institutes Hub" ? (
              <NationalInstitutesHubView
                lang={lang}
                showToastMsg={showToastMsg}
              />
            ) : (
              <AdminPanelView
                lang={lang}
                profile={profile}
                draftObjective={draftObjective}
                preferences={preferences}
                onUpdatePreferences={setPreferences}
                checklists={checklists}
                onUpdateChecklists={setChecklists}
                notes={notes}
                onUpdateNotes={setNotes}
                activeDomain={activeDomain}
                onChangeDomain={setActiveDomain}
                onClose={handleLogoutAndGoToDashboard}
                showToastMsg={showToastMsg}
                googleSheetUrl={googleSheetUrl}
                onUpdateGoogleSheetUrl={setGoogleSheetUrl}
                isSyncingSheet={isSyncingSheet}
                onQueryGoogleSheet={handleQueryGoogleSheet}
                onDownloadCSV={() => handleManualSaveStudent(undefined, true)}
                gUser={gUser}
                gToken={gToken}
                driveSpreadsheets={driveSpreadsheets}
                selectedDriveSpreadsheetId={selectedDriveSpreadsheetId}
                onSelectDriveSpreadsheetId={setSelectedDriveSpreadsheetId}
                onGoogleLogin={handleGoogleLogin}
                onGoogleLogout={handleGoogleLogout}
                onWriteStudentToGoogleSheet={handleWriteStudentToGoogleSheet}
                isLoadingSpreadsheets={isLoadingSpreadsheets}
              />
            )}
          </div>

        </div>

      </main>

      {/* SECURED KEYPAD SYSTEM POPUP */}
      {showPinOverlay && (
        <PinLockOverlay
          correctPin="2026"
          onUnlock={() => {
            setUnlocked(true);
            localStorage.setItem("iep_admin_unlocked", "true");
            setShowPinOverlay(false);
            setActiveTab("Admin Panel");
            showToastMsg(t.toastUnlockSuccess);
          }}
          onClose={() => {
            setShowPinOverlay(false);
          }}
        />
      )}

    </div>
  );
}
