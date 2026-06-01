import { Checklists, EducatorNotes } from "./types";

// 22 Comprehensive clinical-educational sections of special education IEP in India
export const IEP_SECTIONS_22 = [
  "1. Student Profile & Background (छात्र विवरण व पृष्ठभूमि)",
  "2. Evaluation Cycle & Goals (चक्र निर्धारण व सामान्य लक्ष्य)",
  "3. Gross Motor Skills (स्थूल गत्यात्मक कौशल)",
  "4. Fine Motor Skills (सूक्ष्म गत्यात्मक कौशल)",
  "5. Eating & Drink Habits (भोजन एवं पेयजल आदतें)",
  "6. Toileting & Hygiene (शौचालय व शारीरिक स्वच्छता)",
  "7. Dressing & Grooming (वस्त्र पहनना व शारीरिक स्वच्छता)",
  "8. Receptive Language (ग्रहणशील भाषा - समझ)",
  "9. Expressive Language (अभिव्यंजक भाषा - बोलना)",
  "10. Social & Group Play (सामाजिक पारस्परिक क्रिया)",
  "11. Reading & Sight Recognition (पठन व पूर्व-पठन कौशल)",
  "12. Writing Abilities (लेखन व पूर्व-लेखन कौशल)",
  "13. Mathematics & Numbers (गणित व संख्यात्मक तर्क)",
  "14. Time Concepts (समय व क्रम की अवधारणा)",
  "15. Money Management (धन का उपयोग व समझ)",
  "16. Domestic Life & Chores (घरेलू व दैनिक गतिविधियां)",
  "17. Safety & Community Rules (सामुदायिक व सुरक्षा नियम)",
  "18. Recreation & Leisure (मनोरंजक गतिविधियां और खेल)",
  "19. Attention & Focus Speed (ध्यान व त्रुटि सुधार कौशल)",
  "20. Pre-Vocational Readiness (पूर्व-व्यावसायिक तत्परता कौशल)",
  "21. Environmental Support (कक्षीय अनुकूलन व अतिरिक्त सहायता)",
  "22. Future Academic Objectives (भविष्य के शिक्षण लक्ष्य व उद्देश्य)"
];

export const getDefaultChecklists = (): Checklists => {
  const checklists: Checklists = {};

  const sectionBehaviors: Record<number, string[]> = {
    1: [
      "Follows general school attendance rules/timings regularly. (नियमित विद्यालय उपस्थिति व समय-पालन नियमों का अनुसरण करता है।)",
      "Responds to own name with visual alignment or vocal sound. (अपना नाम पुकारे जाने पर नज़रें मिलाता है या प्रतिउत्तर देता है।)",
      "Shares home address or parent details when requested. (पूछे जाने पर अपने निवास या माता-पिता का विवरण साझा करता है।)",
      "Handles own school bags, notebooks, and tiffin boxes nicely. (अपने स्कूल बैग, सुरक्षा सामग्री व टिफिन बॉक्स का प्रबंधन कर सकता है।)"
    ],
    2: [
      "Learning Outcome Goal selected for 6-months (६-मासिक समीक्षा). (६-मासिक लक्ष्य चयनित किया गया है।)",
      "Learning Outcome Goal selected for Monthly Cycle (मासिक समीक्षा). (मासिक लक्ष्य चयनित किया गया है।)",
      "Learning Outcome Goal selected for Weekly Progress (साप्ताहिक समीक्षा). (साप्ताहिक लक्ष्य चयनित किया गया है।)",
      "Student displays active enthusiasm for daily class routines. (छात्र दैनिक कक्षा गतिविधियों के प्रति सक्रिय उत्साह प्रदर्शित करता है।)"
    ],
    3: [
      "Balances on one foot for 5+ seconds without any support. (बिना किसी सहारे के कम से कम 5 सेकंड एक पैर पर संतुलन बनाए रखता है।)",
      "Climbs stairs independently with alternating feet patterns. (बिना किसी सहारे के सीढ़ियों पर बारी-बारी से पैर रखकर चढ़ता है।)",
      "Catches a large foam ball cleanly from a 3-meter distance. (3 मीटर की दूरी से फेके गए बड़े फोम बॉल को आसानी से पकड़ता है।)",
      "Walks steadily along straight lines marked on the classroom floor. (फर्श पर खींची गई सीधी रेखाओं पर संतुलन के साथ चलता है।)"
    ],
    4: [
      "Utilizes a steady pinch thumb-grasp to hold pencil or crayon. (पेंसिल या क्रेयॉन पकड़ने के लिए स्थिर चुटकी पकड़ का उपयोग करता है।)",
      "Cuts along straight or curved lines using supervised safety scissors. (पर्यवेक्षित तरीके से सुरक्षित कैंची से सीधी या वक्र रेखाओं को काटता है।)",
      "Threads 5+ medium wooden beads into a string autonomously. (बिना किसी मदद के धागे में 5 या अधिक मोतियों को पिरोता है।)",
      "Folds color sheets or papers symmetrically during craft classes. (शिल्प वर्ग के दौरान रंगीन कागजों को सुंदर व सममित ढंग से मोड़ता है।)"
    ],
    5: [
      "Eats tiffin using hands or spoon without major spilling. (बिना ज्यादा गिराए भोजन को हाथ या चम्मच से स्वतः खाता है।)",
      "Screws and unscrews drink bottle caps independently. (पानी की बोतल के ढक्कन को स्वयं खोलता और सुरक्षित रूप से बंद करता है।)",
      "Signals clear vocal indicators when feeling hungry. (भूख लगने पर स्पष्ट रूप से संकेत देता है या बोलकर व्यक्त करता है।)",
      "Wipes mouth cleanly using tissue paper or napkins after meals. (भोजन के बाद नैपकिन या टिशू पेपर से अपना मुंह स्वयं साफ करता है।)"
    ],
    6: [
      "Signals toilet needs verbally or with standardized gestures. (शौचालय जाने के लिए इशारे, संकेत या शब्दों का उपयोग करता है।)",
      "Washes and dries hands after using the toilet with minimal prompts. (शौचालय के उपयोग के बाद स्वयं न्यूनतम सहायता से हाथ धोता है।)",
      "Conducts standard bathroom flushing and cleaning routines. (शौचालय का उपयोग करने के बाद पानी फ्लश करने की आदत रखता है।)",
      "Keeps undergarments dry throughout the school hours. (विद्यालय समय के दौरान कपड़ों व स्वच्छता को पूरी तरह नियंत्रित रखता है।)"
    ],
    7: [
      "Fastens Velcro straps on shoes or large buttons of shirt. (जूतों के वेल्क्रो स्ट्रैप को चिपकाता है या शर्ट के बड़े बटन बंद करता है।)",
      "Puts on or pulls off school sweaters/aprons independently. (बिना किसी मदद के स्कूल स्वेटर, कोट या एप्रन पहनता और उतारता है।)",
      "Assures face and hands are clean using towels. (तौलिए और पानी की सहायता से अपने चेहरे व हाथ को साफ रखता है।)",
      "Attempts to brush hair or align collars before class assembly. (कक्षा सभा से पहले बालों को संवारने या कॉलर को ठीक करने का प्रयास करता है।)"
    ],
    8: [
      "Points cleanly to named classroom poster items on command. (निर्देश मिलने पर कक्षा के पोस्टरों में वांछित वस्तु की ओर इशारा करता है।)",
      "Obeys successive double-step verbal instructions properly. (दिए गए लगातार दो-चरण वाले मौखिक निर्देशों का सही पालन करता है।)",
      "Identifies primary colors (Red, Blue, Green, Yellow) correctly. (प्राथमिक रंगों - लाल, नीला, हरा, पीला आदि की सही पहचान करता है।)",
      "Points to body parts nicely when named by educators. (शिक्षकों द्वारा नाम लेने पर अपने शरीर के अंगों की ओर सही संकेत करता है।)"
    ],
    9: [
      "Vocalizes basic school needs using short 3-4 word sentences. (3-4 शब्दों के छोटे वाक्यों में अपनी कक्षा की जरूरतों को बताता है।)",
      "Greets special educators and class peers with simple words. (विशेष शिक्षकों और सहपाठियों का सरल शब्दों में खुशी से स्वागत करता है।)",
      "Verbally identifies common school subjects or personal toys. (सामान्य स्कूली चीजों, वस्तुओं या अपने निजी खिलौनों को बोलकर बताता है।)",
      "Repeats short phrases or rhythmic rhymes during music periods. (संगीत कक्षा के सत्र में तुकबंदी या छोटे वाक्यों को दोहराता है।)"
    ],
    10: [
      "Cooperates during collective board games or puzzle activities. (सामूहिक बोर्ड गेम खेलने या बड़ी पहेली सुलझाने में सहयोग करता है।)",
      "Waits for turn patiently during group playground slides/swings. (झूलों या खेल गतिविधियों में अपनी बारी आने का शांति से इंतजार करता है।)",
      "Respects physical boundaries of nearby peers during circles. (समूह घेरे की गतिविधियों के दौरान सहपाठियों की व्यक्तिगत सीमाओं का ध्यान रखता है।)",
      "Initiates visual greeting and smiles when a peer interacts. (सहपाठियों द्वारा बातचीत का प्रयास करने पर हाथ मिलाता है और मुस्कुराता है।)"
    ],
    11: [
      "Follows printed worksheets from left to right with fingers. (वर्कशीट पर छपे चित्रों या पंक्तियों को अंगुली से बाएं-से-दाएं ट्रैक करता है।)",
      "Recognizes standard letters (A-Z) or Hindi Swar in books. (पुस्तकों में लिखे सामान्य वर्णों या स्वर-व्यंजन को आसानी से पहचानता है।)",
      "Matches identical shape-symbols or color cards on board. (बोर्ड पर लगे समान आकार के प्रतीकों या रंगीन कार्डों का मिलान करता है।)",
      "Translates daily functional signs (Toilet, Stop, Exit) accurately. (विद्यालय में लगे आवश्यक सुरक्षा चिह्नों (शौचालय, निकास) को समझता है।)"
    ],
    12: [
      "Manipulates pencil to trace standing/sleeping dotted lines. (खड़ी या आड़ी बिंदु रेखाओं को पेंसिल से ऊपर ट्रेस करने का अभ्यास करता है।)",
      "Transcribes alphanumeric values from Blackboards correctly. (ब्लैकबोर्ड पर लिखे अक्षरों या नंबरों को देखकर अपनी कॉपी में उतारता है।)",
      "Scribbles freely or draws basic circular boundaries beautifully. (रंगीन पेन से आकृतियां उकेरता है या स्वतंत्र रूप से घेरे बनाता है।)",
      "Writes own name or initial identifiers clearly on worksheets. (वर्कशीट पर अपना नाम या अपना पहला शुरुआती अक्षर साफ-साफ लिखता है।)"
    ],
    13: [
      "Counts tangible physical items 1 to 10 consecutively. (सामने रखी ठोस वस्तुओं को छूकर क्रम के साथ 1 से 10 तक गिनता है।)",
      "Differentiates between sizes (Big vs. Small) or heights. (आकार या लंबाई के भेद (बड़ा बनाम छोटा) को आसानी से अलग करता है।)",
      "Recognizes printed numbers 1 to 5 with full understanding. (गतिविधि कार्डों पर छपे हुए नंबरों 1 से 5 को त्रुटिहीन पहचानता है।)",
      "Identifies basic mathematical shapes (Circle, Square, Triangle). (बुनियादी गणितीय आकृतियों जैसे वृत्त, वर्ग, त्रिकोण को पहचानता है।)"
    ],
    14: [
      "Identifies daily cycle segments (Morning, Afternoon, Night). (दिन के विभिन्न चक्रों (सुबह, दोपहर, संध्या, रात) के अंतर को पहचानता है।)",
      "Associates school bells with changes in class subject periods. (स्कूल की घंटी की ध्वनि को पीरियड या विषय के बदलने से जोड़ता है।)",
      "Identifies days of the weeks correctly using classroom charts. (लगे हुए साप्ताहिक चार्ट को देखकर वर्तमान दिन का चयन करता है।)",
      "Understands terms of sequence like (First, Next, Last) well. (दैनिक कार्यों की क्रमता जैसे (पहले, फिर, अंत में) को समझता है।)"
    ],
    15: [
      "Identifies common national currency notes (₹10, ₹10, ₹100). (प्रचलित भारतीय नोटों और सिक्कों (जैसे ₹10, ₹20, ₹100) की पहचान करता है।)",
      "Demonstrates mock buy-sell exchange concepts in clean setups. (कक्षा की काल्पनिक दुकान में पैसे देकर खिलौना खरीदने की प्रक्रिया समझता है।)",
      "Differentiates money items from standard play tokens or papers. (असली पैसों को खेलने वाले साधारण कागज या प्लास्टिक टोकन से अलग पहचानता है।)",
      "Understands price tags or value numbers written on item boxes. (छोटी वस्तुओं पर और रैपर पर लिखे मूल्य मूल्य को समझने का प्रयास करता है।)"
    ],
    16: [
      "Wipes or clears desk areas after finishing color activities. (चित्रकारी या अभ्यास समाप्त होने के बाद अपनी डेस्क को साफ करता है।)",
      "Arranges personal lunchbox or water bottles back into the bag. (अपनी खाने की छुट्टी समाप्त होने पर टिफिन बॉक्स बैग में सलीके से रखता है।)",
      "Sorts clean sorting-blocks or toys back into containers. (खेलने के बाद खिलौनों और प्लास्टिक आकारों को उनके बक्से में वापस डालता है।)",
      "Sweeps or throws wrapper waste into dustbins on own impulse. (डस्टबिन के महत्व को जानता है और कचरा स्वतः कचरापात्र में डालता है।)"
    ],
    17: [
      "Identifies domestic safety hazards like fire, hot water, plugs. (आग, उबलते पानी, बिजली सॉकेट जैसे संभावित खतरों को समझता व दूरी रखता है।)",
      "Follows general safety commands like 'Stop' and 'Come here'. (कहे जाने पर 'रुको' या 'यहाँ आओ' जैसे सुरक्षा निर्देशों का पालन करता है।)",
      "Walks carefully on wet or slippery bathroom floors with alert step. (गीले या फिसलन वाले फर्श पर सावधानी से कदम रखकर चलता है।)",
      "Recognizes local school educators and familiar campus guards. (अपने विद्यालय के शिक्षकों और जाने-माने सुरक्षा कर्मियों को पहचानता है।)"
    ],
    18: [
      "Participates in classroom music, hand clapping & rhythm songs. (संगीत कक्षा के दौरान सामूहिक तालियों व आनंद गतिविधियों में भाग लेता है।)",
      "Builds beautiful playdough figures or mud structures in sand. (मिट्टी की कलाकृतियां गढ़ता है या रेत के टीले पर खिलौने बनाता है।)",
      "Shares common indoor toys with classroom peers comfortably. (बिना किसी आक्रामकता या चिड़चिड़ेपन के खिलौने दूसरों के साथ साझा करता है।)",
      "Enjoys outdoor swings, slides, and group race running games. (बाहरी झूले और बगीचों के सामूहिक दौड़ने-पटकने वाले खेलों का आनंद लेता है।)"
    ],
    19: [
      "Maintains focus on desktop matching worksheets for 5+ mins. (दैनिक वर्कशीट लेखन पर एक निश्चित समय (5+ मिनट) लगातार ध्यान केंद्रित रखता है।)",
      "Self-corrects basic mistakes on mild teacher verbal prompt. (सज्जनता से टोकने या याद दिलाने पर अपनी प्रारंभिक लेखन गलती को खुद ठीक करता है।)",
      "Shifts focus smoothly between Blackboard and notebook copies. (सामने लगे श्यामपट्ट (ब्लैकबोर्ड) और अपनी उत्तर पुस्तिका के बीच नजरें केंद्रित करता है।)",
      "Follows silent gestures of the special teacher during lessons. (पढ़ाते समय विशेष शिक्षक द्वारा किए जाने वाले शांत संकेतों को समझता है।)"
    ],
    20: [
      "Separates class tools nicely based on properties (Paper/Wood). (अध्ययन सामग्री को उनके निर्माण पदार्थ जैसे (कागज, लकड़ी) में विभाजित करता है।)",
      "Complies with multi-step craft work instructions properly. (शिल्प वर्क के समय कई चरण वाले निर्देशों को ध्यान से पूरा करता है।)",
      "Keeps physical workspace items sorted and in pristine alignments. (अपनी पढ़ने वाली मेज पर कॉपी, रबर, पेंसिल को बहुत व्यवस्थित ढंग से रखता है।)",
      "Completes simple cleaning tasks inside classroom corners. (कक्षा के विशेष कोनों या अलमारी की सजावट की जिम्मेदारी स्वेच्छा से निभाता है।)"
    ],
    21: [
      "Adopts customized desks/seats perfectly without restlessness. (विशेष बैठक व्यवस्था या अनुकूलित मेज-कुर्सी का बिना असुविधा के उपयोग करता है।)",
      "Responds positively to schedule visual cards or timetable prints. (दीवार पर टंगे चित्रमय समय-सारणी संदेशपत्रकों के आधार पर स्वयं क्रियाशील होता है।)",
      "Conveys needs through visual assist boards or physical cards. (बोलने में कठिनाई होने पर सहायतार्थक चित्र कार्डों (PECS) को दिखाकर जरूरत बताता है।)",
      "Displays steady comfort in normal sound or lighting setups. (कक्षा की सामान्य रोशनी और बच्चों के शोर के बीच सहज संतुलित रहता है।)"
    ],
    22: [
      "Expresses long-term hopes or academic desires verbally or signs. (आगे की पढ़ाई या जीवन के लिए अपनी आकांक्षाओं को संकेतों या शब्दों में प्रकट करता है।)",
      "Selects preferred learning categories from pictorial guides. (चित्रों को देखकर अपने सबसे पसंदीदा विषय (जैसे खेल, चित्रकला) का चयन करता है।)",
      "Demonstrates high learning readiness for new advanced skill levels. (नए उन्नत स्तर के कौशल या पाठ को सीखने के लिए तीव्र उत्सुकता दिखाता है।)",
      "Participates in cultural events, local festivals or sports days. (विद्यालय के वार्षिकोत्सव, खेल कूद या त्योहार उत्सवों में उत्साह से भाग लेता है।)"
    ]
  };

  IEP_SECTIONS_22.forEach((domainName, idx) => {
    const listNumber = idx + 1;
    const texts = sectionBehaviors[listNumber] || [
      `Demonstrates steady operational progress in section ${listNumber} benchmarks. (खंड ${listNumber} के मानदंडों में निरंतर प्रगति दर्शाता है।)`,
      `Adapts to recommended class environment conditions successfully. (अनुशंसित सुरक्षा वातावरण स्थितियों के अनुकूल खुद को ढालता है।)`
    ];

    checklists[domainName] = texts.map((text, textIdx) => ({
      id: `sec${listNumber}_item_${textIdx + 1}`,
      text,
      checked: false
    }));

    // Add "None of the above" override item as standard
    checklists[domainName].push({
      id: `none_${domainName}`,
      text: "None of the above matches",
      checked: true,
      isNoneOfTheAbove: true
    });
  });

  return checklists;
};

export const getDefaultNotes = (): EducatorNotes => {
  const notes: EducatorNotes = {};
  IEP_SECTIONS_22.forEach((domainName) => {
    notes[domainName] = "";
  });
  return notes;
};
