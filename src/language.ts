// Translation and localization definitions for the Bilingual Digital IEP system.

export type LanguageType = "en" | "hi";

export interface DisabilityItem {
  id: string;
  en: string;
  hi: string;
}

export interface ClassItem {
  id: string;
  en: string;
  hi: string;
}

// Complete list of 21 disabilities recognized under RPwD Act 2016 India
export const DISABILITIES_LIST: DisabilityItem[] = [
  { id: "1", en: "Autism Spectrum Disorder", hi: "ऑटिज़्म स्पेक्ट्रम डिसऑर्डर (स्वलीनता)" },
  { id: "2", en: "Blindness", hi: "अंधता (पूर्ण दृष्टिहीनता)" },
  { id: "3", en: "Low-Vision", hi: "कम दृष्टि (आंशिक दृष्टिबाधित)" },
  { id: "4", en: "Hearing Impairment (Deaf and Hard of Hearing)", hi: "श्रवणबाधित (बधिर और ऊंचा सुनने वाले)" },
  { id: "5", en: "Locomotor Disability", hi: "चलन दिव्यांगता (अस्थि-बाधित)" },
  { id: "6", en: "Dwarfism", hi: "बौनापन" },
  { id: "7", en: "Intellectual Disability", hi: "बौद्धिक दिव्यांगता" },
  { id: "8", en: "Mental Illness", hi: "मानसिक बीमारी" },
  { id: "9", en: "Cerebral Palsy", hi: "प्रमस्तिष्क घात (सेरेब्रल पाल्सी)" },
  { id: "10", en: "Muscular Dystrophy", hi: "पेशीय दुष्पोषण (मस्कुलर डिस्ट्रॉफी)" },
  { id: "11", en: "Chronic Neurological Conditions", hi: "क्रोनिक न्यूरोलॉजिकल स्थितियां" },
  { id: "12", en: "Specific Learning Disabilities (Dyslexia etc.)", hi: "विशिष्ट शिक्षण दिव्यांगता (जैसे डिस्लेक्सिया)" },
  { id: "13", en: "Multiple Sclerosis", hi: "मल्टीपल स्केलेरोसिस" },
  { id: "14", en: "Speech and Language Disability", hi: "भाषण और भाषा दिव्यांगता" },
  { id: "15", en: "Thalassemia", hi: "थैलेसीमिया" },
  { id: "16", en: "Hemophilia", hi: "हीमोफिलिया" },
  { id: "17", en: "Sickle Cell Disease", hi: "सिकल सेल रोग" },
  { id: "18", en: "Multiple Disabilities including deafblindness", hi: "बहरा-अंधापन सहित बहु-दिव्यांगता" },
  { id: "19", en: "Acid Attack Victim", hi: "तेजाब हमले के पीड़ित" },
  { id: "20", en: "Parkinson's Disease", hi: "पार्किसंस रोग" },
  { id: "21", en: "Leprosy Cured Person", hi: "कुष्ठ रोग मुक्त व्यक्ति" }
];

// Complete class range from pre-primary to 12th grade
export const CLASSES_LIST: ClassItem[] = [
  { id: "pre", en: "Pre-Primary (Nursery/KG)", hi: "प्री-प्राइमरी (नर्सरी / केजी)" },
  { id: "c1", en: "Class 1 (Grade 1)", hi: "कक्षा 1 (प्रथम)" },
  { id: "c2", en: "Class 2 (Grade 2)", hi: "कक्षा 2 (द्वितीय)" },
  { id: "c3", en: "Class 3 (Grade 3)", hi: "कक्षा 3 (तृतीय)" },
  { id: "c4", en: "Class 4 (Grade 4)", hi: "कक्षा 4 (चतुर्थ)" },
  { id: "c5", en: "Class 5 (Grade 5)", hi: "कक्षा 5 (पंचम)" },
  { id: "c6", en: "Class 6 (Grade 6)", hi: "कक्षा 6 (षष्ठ)" },
  { id: "c7", en: "Class 7 (Grade 7)", hi: "कक्षा 7 (सप्तम)" },
  { id: "c8", en: "Class 8 (Grade 8)", hi: "कक्षा 8 (अष्टम)" },
  { id: "c9", en: "Class 9 (Grade 9)", hi: "कक्षा 9 (नवम)" },
  { id: "c10", en: "Class 10 (Grade 10)", hi: "कक्षा 10 (दशम)" },
  { id: "c11", en: "Class 11 (Grade 11)", hi: "कक्षा 11 (एकादश)" },
  { id: "c12", en: "Class 12 (Grade 12)", hi: "कक्षा 12 (द्वादश)" }
];

export const translationMap = {
  en: {
    title: "VANTAGE IEP",
    subtitle: "Special Ed Portal",
    dashboard: "Dashboard",
    adminPanel: "Admin Panel",
    unlockAdmin: "Admin Settings",
    toastModified: "Observable behavior checklist modified",
    toastUnlockSuccess: "Terminal access authorized. System configuration unlocked!",
    toastSaveSuccess: "Configuration details updated and synchronized successfully!",
    schoolName: "School Name",
    schoolPlaceholder: "Enter school name...",
    studentName: "Student Name",
    studentPlaceholder: "Enter student name...",
    classGrade: "Class / Grade",
    disabilityType: "Category of Disability",
    generalTeacher: "General Class Teacher",
    generalTeacherPlaceholder: "Enter general teacher...",
    specialTeacher: "Special Educator / Specialist",
    specialTeacherPlaceholder: "Enter special educator...",
    disabilityCert: "Disability Certificate Verified?",
    disabilityCertDesc: "Is official disability documentation verified and attached securely?",
    observableChecklist: "Observable Behaviors Checklist",
    observableChecklistDesc: "Observe, audit, and check items demonstrated in active classroom play",
    subjectiveJournal: "Subjective Education Journal Notes",
    subjectiveJournalDesc: "Inscribe qualitative notes, accomplishments, and customized feedback",
    reviewCycle: "Goal Review Cycle & Timeline",
    annualReview: "Annual Review",
    sixMonthReview: "6-Month Review",
    monthlyCheckin: "Monthly Check-in",
    weeklyProgress: "Weekly Progress",
    milestoneRate: "Milestone Success Rate",
    complete: "Completed",
    incomplete: "Incomplete / Required",
    activeIepPrompt: "Active IEP Objective Target Setting",
    activeIepPlaceholder: "Type customizable and concrete objectives for the student...",
    footerText: "Developed by CS Gautam special teacher CBEO office Pahadi | IEP India Protocol",
    noneOfTheAbove: "None of the above matches",
    requiredDomainValidationMsg: "⚠️ Mandatory: At least one checklist checkbox (or 'None of the above') must be selected in each domain to validate the IEP profile.",
    allValidatedMsg: "✓ Verification Successful: All active domains possess valid selections!",
    birthDate: "Date of Birth",
    age: "Calculated Age",
    notProvided: "Not provided",
    returnDashboard: "Return to Dashboard",
    systemMgmt: "System Administration",
    systemMgmtDesc: "Fully update website configurations, edit/add/delete domains, subdomains, and checklists.",
    metricsProgress: "System Metrics & Domain Coverage",
    totalStudents: "Total Enrolled Students",
    iepsCompleted: "IEPs Completed",
    activeTeachers: "Active Special Educators",
    pendingReviews: "Pending Special Reviews",
    coreDomainProgress: "Average Domain Core Success Rates",
    disabilityDemographic: "Disability Demographic Distribution (India RPwD Matrix)",
    domainArchitecture: "Configure Active Domains & Checkboxes",
    addDomainLabel: "Add New Custom Domain",
    domainTitlePlaceholder: "e.g., Sensory Integration",
    domainDescPlaceholder: "Explain benchmark criteria...",
    addDomainBtn: "Add Domain Core",
    addNewItemLabel: "Add Item inside Category",
    itemTextPlaceholder: "Type specific behavior function to track...",
    addItemBtn: "Add Item",
    deleteDomain: "Delete Domain",
    deleteItem: "Delete Item",
    updateDomainTitle: "Edit Title",
    updateItemText: "Edit Item",
    saveDomainBtn: "Save Title",
    saveItemBtn: "Save Item",
    cancelBtn: "Cancel",
    adminLockTitle: "Security Unlock Verification",
    adminLockDesc: "Enter the security PIN to edit active domains and checklists",
    pinPlaceholder: "PIN: 2026",
    clear: "Clear",
    cancel: "Cancel",
    generateReport: "Generate Report (Print)",
    activeDraft: "Active IEP Draft",
    systemPreferences: "Administrative Credentials",
    defaultExport: "Report Framework Template",
    academicLogoText: "Institution Stamp / Footnote Label",
    emblemLabel: "Academic Institution Seal",
    emblemDesc: "Upload verified logo for school reports",
    sheetsSyncLabel: "Spreadsheet Synchronization Registry",
    sheetsSyncDesc: "Securely map IEP profiles back into active cloud spreadsheet rosters.",
    sheetsPlaceholder: "Google Sheet URL Link...",
    sheetsBtn: "Update Sync Link",
    sheetsConnected: "Roster Active: Authenticated via cloud protocols",
    toastNoneApplied: "Automatic check-off applied. All other items in this domain set to neutral.",
    toastItemDeselectedNone: "Removed 'None' override dynamically.",
    yes: "Yes",
    no: "No",
  },
  hi: {
    title: "वांटेज आई.ई.पी.",
    subtitle: "विशेष शिक्षा पोर्टल",
    dashboard: "डैशबोर्ड",
    adminPanel: "एडमिन पैनल",
    unlockAdmin: "एडमिन सेटिंग्स",
    toastModified: "अवलोकनीय व्यवहार चेकलिस्ट संशोधित किया गया",
    toastUnlockSuccess: "टर्मिनल एक्सेस स्वीकृत। सिस्टम कॉन्फ़िगरेशन अनलॉक!",
    toastSaveSuccess: "कॉन्फ़िगरेशन विवरण सफलतापूर्वक अपडेट और सिंक हो गया है!",
    schoolName: "स्कूल का नाम",
    schoolPlaceholder: "स्कूल का नाम भरें...",
    studentName: "विद्यार्थी का नाम",
    studentPlaceholder: "विद्यार्थी का नाम भरें...",
    classGrade: "कक्षा / श्रेणी",
    disabilityType: "दिव्यांगता का प्रकार (RPwD श्रेणी)",
    generalTeacher: "सामान्य कक्षा शिक्षक (टीचर)",
    generalTeacherPlaceholder: "सामान्य शिक्षक का नाम...",
    specialTeacher: "विशेष शिक्षक (स्पेशल एजुकेटर)",
    specialTeacherPlaceholder: "विशेष शिक्षक का नाम...",
    disabilityCert: "दिव्यांगता प्रमाण पत्र सत्यापित?",
    disabilityCertDesc: "क्या आधिकारिक दिव्यांगता से जुड़े दस्तावेज सत्यापित और संलग्न हैं?",
    observableChecklist: "अवलोकनीय व्यवहार चेकलिस्ट",
    observableChecklistDesc: "कक्षा में प्रदर्शित होने वाले व्यवहारों का अवलोकन करें और चिह्नित करें",
    subjectiveJournal: "अनुभवात्मक विशेष शिक्षा जर्नल नोट्स",
    subjectiveJournalDesc: "गुणात्मक प्रगति नोट्स, उपलब्धियां और अनुकूलित टिप्पणियां दर्ज करें",
    reviewCycle: "लक्ष्य समीक्षा चक्र और समय-सीमा",
    annualReview: "वार्षिक समीक्षा",
    sixMonthReview: "६-महीने की समीक्षा",
    monthlyCheckin: "मासिक चेक-इन",
    weeklyProgress: "साप्ताहिक प्रगति",
    milestoneRate: "मील का पत्थर सफलता दर",
    complete: "पूरा हो गया",
    incomplete: "अपूर्ण / आवश्यक",
    activeIepPrompt: "सक्रिय विशिष्ट शिक्षा लक्ष्य (IEP Objective)",
    activeIepPlaceholder: "विद्यार्थी के लिए विशिष्ट और मापने योग्य लक्ष्य टाइप करें...",
    footerText: "Developed by CS Gautam special teacher CBEO office Pahadi | आई.ई.पी. भारत प्रोटोकॉल",
    noneOfTheAbove: "उपरोक्त में से कोई भी विकल्प लागू नहीं है",
    requiredDomainValidationMsg: "⚠️ अनिवार्य: सत्यापन पूरा करने के लिए प्रत्येक डोमेन में कम से कम एक विकल्प (या 'उपरोक्त में से कोई नहीं') का चयन करना आवश्यक है।",
    allValidatedMsg: "✓ सत्यापन सफल: सभी सक्रिय डोमेन में वैध चयन मौजूद हैं!",
    birthDate: "जन्म तिथि",
    age: "गणना की गई आयु",
    notProvided: "दर्ज नहीं है",
    returnDashboard: "डैशबोर्ड पर लौटें",
    systemMgmt: "सिस्टम प्रबंधन (एडमिनिस्ट्रेशन)",
    systemMgmtDesc: "वेबसाइट को पूरी तरह से अपडेट करें; डोमेन, सबडोमेन और व्यवहार चेकलिस्ट को जोड़ें, संपादित करें या हटाएं।",
    metricsProgress: "सिस्टम मेट्रिक्स और डोमेन कवरेज",
    totalStudents: "कुल नामांकित छात्र",
    iepsCompleted: "सफलतापूर्वक पूर्ण IEPs",
    activeTeachers: "सक्रिय विशेष शिक्षक",
    pendingReviews: "लंबित विशेष समीक्षाएं",
    coreDomainProgress: "औसत डोमेन मुख्य सफलता दर",
    disabilityDemographic: "अनुपात दिव्यांगता जनसांख्यिकी वितरण (भारत RPwD मैट्रिक्स)",
    domainArchitecture: "सक्रिय डोमेन एवं व्यवहार सूची का प्रबंधन",
    addDomainLabel: "नया डोमेन जोड़ें",
    domainTitlePlaceholder: "उदा. संवेदी एकीकरण (Sensory)",
    domainDescPlaceholder: "मूल्यांकन मानदंड का विवरण दें...",
    addDomainBtn: "डोमेन जोड़ें",
    addNewItemLabel: "श्रेणी के अंदर व्यवहार विकल्प जोड़ें",
    itemTextPlaceholder: "ट्रैक करने के लिए विशिष्ट व्यवहार विकल्प टाइप करें...",
    addItemBtn: "विकल्प जोड़ें",
    deleteDomain: "डोमेन हटाएं",
    deleteItem: "विकल्प हटाएं",
    updateDomainTitle: "शीर्षक बदलें",
    updateItemText: "विकल्प बदलें",
    saveDomainBtn: "शीर्षक सुरक्षित करें",
    saveItemBtn: "सुरक्षित करें",
    cancelBtn: "रद्द करें",
    adminLockTitle: "प्रशासनिक सुरक्षा सत्यापन",
    adminLockDesc: "सक्रिय डोमेन और व्यवहार सूचियों को संपादित करने के लिए सुरक्षा पिन दर्ज करें",
    pinPlaceholder: "पिन: 2026",
    clear: "साफ करें",
    cancel: "रद्द करें",
    generateReport: "रिपोर्ट प्रिंट करें (Generate Report)",
    activeDraft: "सक्रिय आई.ई.पी. ड्राफ्ट",
    systemPreferences: "प्रशासनिक साख (Credentials)",
    defaultExport: "रिपोर्ट फ्रेमवर्क टेम्पलेट",
    academicLogoText: "शैक्षणिक संस्थान का नाम / पाद लेख लेबल",
    emblemLabel: "शैक्षणिक संस्थान की सील (Emblem)",
    emblemDesc: "स्कूल की रिपोर्ट के लिए सत्यापित लोगो अपलोड करें",
    sheetsSyncLabel: "स्प्रेडशीट सिंक्रोनाइजेशन रजिस्ट्री",
    sheetsSyncDesc: "आई.ई.पी. प्रोफाइल को सीधे सक्रिय क्लाउड स्प्रेडशीट रोस्टर में मैप करें।",
    sheetsPlaceholder: "गूगल शीट का यू.आर.एल. लिंक...",
    sheetsBtn: "सिंक लिंक अपडेट करें",
    sheetsConnected: "सक्रिय रोस्टर: क्लाउड प्रोटोकॉल के माध्यम से प्रमाणित किया गया",
    toastNoneApplied: "स्वचालित रूप से 'कोई नहीं' विकल्प लागू किया गया। इस डोमेन के सभी अन्य विकल्प निष्प्रभावी कर दिए गए हैं।",
    toastItemDeselectedNone: "स्वचालित रूप से 'कोई नहीं' ओवरराइड हटा दिया गया।",
    yes: "हाँ",
    no: "नही",
  }
};

// Auto compute exact child age in Hindi/English
export function calculateAge(dob: string, lang: LanguageType): string {
  if (!dob) return lang === "en" ? "Enter birthdate" : "जन्म तिथि दर्ज करें";
  const birthDate = new Date(dob);
  const today = new Date();
  if (isNaN(birthDate.getTime())) return lang === "en" ? "Invalid Date" : "अमान्य तिथि";
  
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    // Add days of previous month
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  if (years < 0) {
    return lang === "en" ? "Not born yet" : "अभी जन्म नहीं हुआ";
  }

  if (years === 0) {
    if (months === 0) {
      return lang === "en" ? `${days} days` : `${days} दिन`;
    }
    return lang === "en" 
      ? `${months} months, ${days} days` 
      : `${months} माह, ${days} दिन`;
  }

  return lang === "en"
    ? `${years} years, ${months} months`
    : `${years} वर्ष, ${months} माह`;
}

// Map numbers 1..25 to standard Roman Numerals
export function getRoman(num: number): string {
  const roman = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX", "XXI", "XXII", "XXIII", "XXIV", "XXV"];
  return roman[num] || num.toString();
}
