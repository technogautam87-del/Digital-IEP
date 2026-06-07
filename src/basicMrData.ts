export interface BasicMrItem {
  id: number;
  en: string;
  hi: string;
  ageLevel?: string;
  material?: boolean;
  glossary?: boolean;
}

export interface BasicMrDomain {
  key: string;
  en: string;
  hi: string;
  items: BasicMrItem[];
}

export const PART_A_DOMAINS: BasicMrDomain[] = [
  {
    key: "motor",
    en: "Motor (M)",
    hi: "गत्यात्मक विकास (Motor)",
    items: [
      { id: 1, ageLevel: "0-5", material: true, en: "Retains two one inch cubes in one hand for 30 seconds", hi: "एक हाथ में 30 सेकंड के लिए दो 1-इंच के क्यूब्स रखता है" },
      { id: 2, ageLevel: "0-5", en: "Claps hands", hi: "ताली बजाता है" },
      { id: 3, ageLevel: "0-5", en: "Crawls a distance of 5 feet or more", hi: "5 फीट या उससे अधिक की दूरी तक रेंगता है" },
      { id: 4, ageLevel: "0-5", en: "When made to stand, stands without support for a minimum of two minutes", hi: "खड़े करने पर, बिना सहारे के न्यूनतम दो मिनट खड़ा रहता है" },
      { id: 5, ageLevel: "0-5", material: true, glossary: true, en: "Puts small objects into a container", hi: "एक कंटेनर में छोटी वस्तुएं डालता है" },
      { id: 6, ageLevel: "0-5", material: true, glossary: true, en: "Uses thumb and index finger to pick up objects", hi: "वस्तुओं को उठाने के लिए अंगूठे और तर्जनी का उपयोग करता है" },
      { id: 7, ageLevel: "0-5", en: "From sitting position is able to stand", hi: "बैठने की स्थिति से खड़ा होने में सक्षम है" },
      { id: 8, ageLevel: "0-5", en: "From standing position, bends knees to squatting position", hi: "खड़े होने की स्थिति से, घुटने मोड़कर उकडू बैठता है" },
      { id: 9, ageLevel: "0-5", material: true, en: "Throws ball in any direction", hi: "गेंद को किसी भी दिशा में फेंकता है" },
      { id: 10, ageLevel: "0-5", en: "Walks for minimum 5-10 steps", hi: "कम से कम 5-10 कदम चलता है" },
      { id: 11, ageLevel: "0-5", material: true, en: "Kicks ball in any direction", hi: "गेंद को किसी भी दिशा में लात मारता है" },
      { id: 12, ageLevel: "0-5", en: "Runs for minimum ten steps", hi: "न्यूनतम दस कदम दौड़ता है" },
      { id: 13, ageLevel: "0-5", glossary: true, en: "Climbs up chair", hi: "कुर्सी पर चढ़ता है" },
      { id: 14, ageLevel: "0-5", en: "Climbs upstairs using alternate feet", hi: "बारी-बारी से पैरों का उपयोग करके सीढ़ियाँ चढ़ता है" },
      { id: 15, ageLevel: "0-5", material: true, glossary: true, en: "Pours liquid from one glass to another without spilling", hi: "बिना गिराए एक गिलास से दूसरे गिलास में तरल डालता है" },
      { id: 16, ageLevel: "0-5", en: "Climbs down the stairs using alternate feet", hi: "बारी-बारी से पैरों का उपयोग करके सीढ़ियों से नीचे उतरता है" },
      { id: 17, ageLevel: "0-5", material: true, en: "Turns pages singly from a book", hi: "एक किताब से एक-एक करके पन्ने पलटता है" },
      { id: 18, ageLevel: "0-5", en: "Jumps off the ground with both feet", hi: "दोनों पैरों से जमीन से ऊपर कूदता है" },
      { id: 19, ageLevel: "0-5", glossary: true, en: "Opens the door", hi: "दरवाजा खोलता है" },
      { id: 20, ageLevel: "0-5", glossary: true, en: "Does simple physical exercises", hi: "सरल शारीरिक व्यायाम करता है" },
      { id: 21, ageLevel: "0-5", material: true, en: "Throws ball atleast five metres away before first bounce", hi: "गेंद को पहली बार उछलने से पहले कम से कम पांच मीटर दूर फेंकता है" },
      { id: 22, ageLevel: "0-5", material: true, glossary: true, en: "Catches ball", hi: "गेंद पकड़ता है" },
      { id: 23, ageLevel: "5-7", glossary: true, en: "Swings for at least 2-3 minutes", hi: "कम से कम 2-3 मिनट के लिए झूलता है" },
      { id: 24, ageLevel: "5-7", material: true, en: "Wipes blackboard clean using duster", hi: "डस्टर का उपयोग करके ब्लैकबोर्ड को साफ करता है" },
      { id: 25, ageLevel: "5-7", material: true, glossary: true, en: "Pushes a cycle tyre (male)/ plays 5 stones(female)", hi: "साइकिल के टायर को धक्का देता है (लड़का) / 5 पत्थरों से खेलता है (लड़की)" },
      { id: 26, ageLevel: "5-7", en: "Climbs at least eight to ten steps of a slide or ladder", hi: "एक स्लाइड या सीढ़ी के कम से कम आठ से दस कदम चढ़ता है" },
      { id: 27, ageLevel: "5-7", en: "Stands on one foot for minimum 30 seconds", hi: "कम से कम 30 सेकंड के लिए एक पैर पर खड़ा रहता है" },
      { id: 28, ageLevel: "5-7", en: "Jumps from a height of 2 feet", hi: "2 फीट की ऊंचाई से कूदता है" },
      { id: 29, ageLevel: "5-7", material: true, glossary: true, en: "Folds paper and inserts into an envelope", hi: "कागज को मोड़ता है और लिफाफे में डालता है" },
      { id: 30, ageLevel: "5-7", en: "Walks on straight line for atleast 5-10 steps", hi: "सीधी रेखा पर कम से कम 5-10 कदम चलता है" },
      { id: 31, ageLevel: "5-7", material: true, glossary: true, en: "Plays marbles(male)/hopscotch(female)", hi: "कंचे खेलता है (लड़का) / हॉप्सकॉच खेलता है (लड़की)" },
      { id: 32, ageLevel: "5-7", material: true, en: "Tears off a perforated sheet", hi: "छिद्रित शीट को फाड़ता है" },
      { id: 33, ageLevel: "5-7", material: true, glossary: true, en: "Throws ball into a basket", hi: "गेंद को टोकरी में फेंकता है" },
      { id: 34, ageLevel: "5-7", material: true, glossary: true, en: "Cuts along a straight line using scissors", hi: "कैंची का उपयोग करके सीधी रेखा में काटता है" },
      { id: 35, ageLevel: "5-7", en: "Hops on one foot for minimum 30 seconds", hi: "कम से कम 30 सेकंड के लिए एक पैर पर कूदता है" },
      { id: 36, ageLevel: "7-9", material: true, glossary: true, en: "Plays ring games", hi: "रिंग गेम खेलता है" },
      { id: 37, ageLevel: "7-9", material: true, glossary: true, en: "Threads a medium sized needle", hi: "मध्यम आकार की सुई में धागा पिरोता है" },
      { id: 38, ageLevel: "7-9", material: true, en: "Strikes and lights a match stick within two attempts", hi: "दो प्रयासों में माचिस की तीली जलाता है" },
      { id: 39, ageLevel: "9+", material: true, glossary: true, en: "Rides a bicycle", hi: "साइकिल चलाता है" },
      { id: 40, ageLevel: "9+", material: true, en: "Skips", hi: "रस्सी कूदता है" }
    ]
  },
  {
    key: "adl",
    en: "Activities of Daily Living (ADL)",
    hi: "दैनिक जीवन की गतिविधियाँ (ADL)",
    items: [
      { id: 1, ageLevel: "0-5", en: "Swallows liquid or semi-solid foods", hi: "तरल या अर्ध-ठोस भोजन निगलता है" },
      { id: 2, ageLevel: "0-5", material: true, en: "Drinks from cup or glass", hi: "कप या गिलास से पीता है" },
      { id: 3, ageLevel: "0-5", en: "Discriminates eatables from non-eatables", hi: "खाने योग्य और गैर-खाने योग्य वस्तुओं में अंतर करता है" },
      { id: 4, ageLevel: "0-5", en: "Chews solid foods", hi: "ठोस भोजन चबाता है" },
      { id: 5, ageLevel: "0-5", glossary: true, en: "Picks up food with fingers and puts in mouth", hi: "उंगलियों से भोजन उठाता है और मुंह में डालता है" },
      { id: 6, ageLevel: "5-7", material: true, en: "Peels banana/orange skin", hi: "केले/संतरे का छिलका उतारता है" },
      { id: 7, ageLevel: "5-7", material: true, en: "Sucks water/liquid through a straw", hi: "स्ट्रॉ के माध्यम से पानी/तरल चूसता है" },
      { id: 8, ageLevel: "5-7", material: true, glossary: true, en: "Mixes rice, dal and eats with hands/spoon", hi: "चावल, दाल मिलाकर हाथ/चम्मच से खाता है" },
      { id: 9, ageLevel: "0-5", glossary: true, en: "Indicates need to go to toilet", hi: "शौचालय जाने की आवश्यकता का संकेत देता है" },
      { id: 10, ageLevel: "0-5", en: "Reaches the toilet", hi: "शौचालय तक पहुँचता है" },
      { id: 11, ageLevel: "5-7", en: "Removes underwear/pant before sitting on toilet seat", hi: "शौचालय सीट पर बैठने से पहले अंतःवस्त्र/पैंट उतारता है" },
      { id: 12, ageLevel: "5-7", glossary: true, en: "Washes self after use of the toilet", hi: "शौचालय के उपयोग के बाद स्वयं को धोता है" },
      { id: 13, ageLevel: "5-7", glossary: true, en: "Flushes toilet after use", hi: "उपयोग के बाद शौचालय को फ्लश करता है" },
      { id: 14, ageLevel: "0-5", material: true, en: "Wipes hands with towel/cloth", hi: "तौलिए/कपड़े से हाथ पोंछता है" },
      { id: 15, ageLevel: "0-5", material: true, en: "Washes hands with soap and water", hi: "साबुन और पानी से हाथ धोता है" },
      { id: 16, ageLevel: "5-7", material: true, glossary: true, en: "Brushes teeth", hi: "दांत साफ करता है (ब्रश करना)" },
      { id: 17, ageLevel: "5-7", en: "Spits paste", hi: "पेस्ट थूकता है" },
      { id: 18, ageLevel: "5-7", glossary: true, en: "Cleans the tongue", hi: "जीभ साफ करता है" },
      { id: 19, ageLevel: "5-7", material: true, glossary: true, en: "Applies paste on the tooth brush", hi: "टूथब्रश पर पेस्ट लगाता है" },
      { id: 20, ageLevel: "0-5", material: true, en: "Pours water on self for bathing", hi: "स्नान के लिए स्वयं पर पानी डालता है" },
      { id: 21, ageLevel: "0-5", material: true, en: "Wipes face with towel/cloth", hi: "तौलिए/कपड़े से चेहरा पोंछता है" },
      { id: 22, ageLevel: "5-7", material: true, en: "Washes face with soap and water", hi: "साबुन और पानी से चेहरा धोता है" },
      { id: 23, ageLevel: "5-7", material: true, en: "Uses towel for drying body", hi: "शरीर सुखाने के लिए तौलिए का उपयोग करता है" },
      { id: 24, ageLevel: "5-7", material: true, en: "Removes soap from body with water", hi: "पानी से शरीर से साबुन हटाता है" },
      { id: 25, ageLevel: "5-7", en: "Applies soap on body", hi: "शरीर पर साबुन लगाता है" },
      { id: 26, ageLevel: "0-5", en: "Takes off clothes when unbuttoned", hi: "बटन खुले होने पर कपड़े उतारता है" },
      { id: 27, ageLevel: "0-5", en: "Puts on underpants or elastic knickers", hi: "अंतःवस्त्र या इलास्टिक वाली निक्कर पहनता है" },
      { id: 28, ageLevel: "0-5", en: "Unbuttons clothing", hi: "कपड़ों के बटन खोलता है" },
      { id: 29, ageLevel: "0-5", en: "Puts on shirt/frock (need not button)", hi: "शर्ट/फ्रॉक पहनता है (बटन लगाने की आवश्यकता नहीं)" },
      { id: 30, ageLevel: "5-7", en: "Puts slippers on correct feet", hi: "सही पैर में चप्पल पहनता है" },
      { id: 31, ageLevel: "5-7", en: "Buttons own clothing", hi: "अपने कपड़ों के बटन लगाता है" },
      { id: 32, ageLevel: "5-7", glossary: true, en: "Puts on pullover shirt/skirt and blouse", hi: "पुलओवर शर्ट/स्कर्ट और ब्लाउज पहनता है" },
      { id: 33, ageLevel: "5-7", glossary: true, en: "Laces shoes or buckles sandals", hi: "जूते के फीते बाँधता है या सैंडल के बकल लगाता है" },
      { id: 34, ageLevel: "7-9", material: true, glossary: true, en: "Ties knots", hi: "गांठ बाँधता है" },
      { id: 35, ageLevel: "5-7", material: true, en: "Applies powder on face/body", hi: "चेहरे/शरीर पर पाउडर लगाता है" },
      { id: 36, ageLevel: "7-9", material: true, glossary: true, en: "Oils Hair", hi: "बालों में तेल लगाता है" },
      { id: 37, ageLevel: "7-9", material: true, en: "Cuts nails with nailcutter/scissors", hi: "नेलकटर/कैंची से नाखून काटता है" },
      { id: 38, ageLevel: "7-9", material: true, en: "Puts on wrist watch", hi: "कलाई घड़ी पहनता है" },
      { id: 39, ageLevel: "9+", material: true, en: "Plaits hair (female)/Combs hair with parting (males)", hi: "चोटी गूँथती है (महिला) / माँग निकालकर बाल संवारता है (पुरुष)" },
      { id: 40, ageLevel: "9+", material: true, glossary: true, en: "Looks after menstrual hygiene(Female)/Shaves (male)", hi: "मासिक धर्म स्वच्छता का ध्यान रखती है (महिला) / शेव करता है (पुरुष)" }
    ]
  },
  {
    key: "language",
    en: "Language (L)",
    hi: "भाषा विकास (Language)",
    items: [
      { id: 1, ageLevel: "0-5", glossary: true, en: "Locates items/persons on command by looking at them", hi: "निर्देश मिलने पर वस्तुओं/व्यक्तियों को देखकर उनका पता लगाता है" },
      { id: 2, ageLevel: "0-5", glossary: true, en: "Responds to verbal or gestural commands", hi: "मौखिक या सांकेतिक निर्देशों का जवाब देता है" },
      { id: 3, ageLevel: "0-5", glossary: true, en: "Follows simple commands that call for action", hi: "शारीरिक क्रिया वाले सरल निर्देशों का पालन करता है" },
      { id: 4, ageLevel: "0-5", en: "Points to five body parts", hi: "शरीर के पांच अंगों की ओर इशारा करता है" },
      { id: 5, ageLevel: "0-5", glossary: true, en: "Points to familiar objects", hi: "परिचित वस्तुओं की ओर इशारा करता है" },
      { id: 6, ageLevel: "0-5", material: true, glossary: true, en: "Points to pictures in a book", hi: "किताब में चित्रों की ओर इशारा करता है" },
      { id: 7, ageLevel: "5-7", glossary: true, en: "Follows question forms, whose?", hi: "'किसका/किसकी?' वाले प्रश्नों को समझकर उत्तर देता है" },
      { id: 8, ageLevel: "5-7", glossary: true, en: "Follows post positions like in, on and under", hi: "'अंदर', 'ऊपर' और 'नीचे' जैसे स्थान-सूचक शब्दों का पालन करता है" },
      { id: 9, ageLevel: "5-7", glossary: true, en: "Carries out two sequential verbal or gestural commands", hi: "दो क्रमिक मौखिक या सांकेतिक निर्देशों का पालन करता है" },
      { id: 10, ageLevel: "5-7", glossary: true, en: "Follows question forms, which?", hi: "'कौन सा/कौन सी?' वाले प्रश्नों का उत्तर देता है" },
      { id: 11, ageLevel: "5-7", glossary: true, en: "Follows questions forms, why?", hi: "'क्यों?' वाले प्रश्नों का उत्तर देता है" },
      { id: 12, ageLevel: "5-7", glossary: true, en: "Follows adjectives like big-small, up-down", hi: "'बड़ा-छोटा', 'ऊपर-नीचे' जैसे विशेषणों को समझता है" },
      { id: 13, ageLevel: "7-9", glossary: true, en: "Follows the concept of whole-part", hi: "'पूर्ण और अंश' (पूरा-आधा) की अवधारणा का पालन करता है" },
      { id: 14, ageLevel: "7-9", glossary: true, en: "Follows three step directions", hi: "तीन चरणों वाले निर्देशों का पालन करता है" },
      { id: 15, ageLevel: "7-9", en: "Identifies first, middle and last in a group", hi: "एक समूह में पहले, मध्य और अंतिम की पहचान करता है" },
      { id: 16, ageLevel: "9+", en: "Follows left, right", hi: "बाएँ, दाएँ को समझता और पालन करता है" },
      { id: 17, ageLevel: "9+", material: true, glossary: true, en: "Follows sight words", hi: "दैनिक जीवन के सामान्य लिखित शब्दों (जैसे खतरा, धक्का) को समझता है" },
      { id: 18, ageLevel: "9+", material: true, glossary: true, en: "Arranges pictures after listening to a story", hi: "कहानी सुनने के बाद चित्रों को क्रम से लगाता है" },
      { id: 19, ageLevel: "9+", material: true, glossary: true, en: "Follows traffic signs/signals", hi: "यातायात संकेतों/सिग्नल का पालन करता है" },
      { id: 20, ageLevel: "9+", glossary: true, en: "Follows voting rights", hi: "मतदान प्रक्रिया और अधिकारों के महत्व को समझता है" },
      { id: 21, ageLevel: "0-5", en: "Imitates five vowel sounds", hi: "पांच स्वर ध्वनियों की नकल करता है" },
      { id: 22, ageLevel: "0-5", glossary: true, en: "Uses yes/no by nodding of head", hi: "सिर हिलाकर हाँ/ना व्यक्त करता है" },
      { id: 23, ageLevel: "0-5", glossary: true, en: "Indicates basic needs by pointing or gesturing", hi: "इशारे से अपनी मूलभूत आवश्यकताओं को व्यक्त करता है" },
      { id: 24, ageLevel: "0-5", en: "Speaks five single words meaningfully", hi: "सार्थक रूप से पांच एकल शब्द बोलता है" },
      { id: 25, ageLevel: "0-5", en: "When asked tells own name", hi: "पूछने पर अपना नाम बताता है" },
      { id: 26, ageLevel: "0-5", glossary: true, en: "Imitates sounds of animals and inanimate objects", hi: "जानवरों और निर्जीव वस्तुओं की आवाजों की नकल करता है" },
      { id: 27, ageLevel: "0-5", glossary: true, en: "Uses two word phrases", hi: "दो शब्दों के वाक्यांशों का उपयोग करता है" },
      { id: 28, ageLevel: "0-5", glossary: true, en: "Tells use of five familiar objects", hi: "पांच परिचित वस्तुओं का उपयोग बताता है" },
      { id: 29, ageLevel: "0-5", material: true, glossary: true, en: "Describes actions of people using words", hi: "चित्रों में लोगों की क्रियाओं का शब्दों में वर्णन करता है" },
      { id: 30, ageLevel: "0-5", glossary: true, en: "Uses words to indicate commands", hi: "निर्देश देने के लिए शब्दों का उपयोग करता है" },
      { id: 31, ageLevel: "0-5", glossary: true, en: "Identifies sex", hi: "लिंग (लड़का/लड़की) की पहचान करता है" },
      { id: 32, ageLevel: "5-7", material: true, en: "Names five common vehicles", hi: "पांच सामान्य वाहनों के नाम बताता है" },
      { id: 33, ageLevel: "5-7", material: true, en: "Names five common animals", hi: "पांच सामान्य जानवरों के नाम बताता है" },
      { id: 34, ageLevel: "5-7", material: true, en: "Names five common vegetables", hi: "पांच सामान्य सब्जियों के नाम बताता है" },
      { id: 35, ageLevel: "5-7", material: true, en: "Names five common fruits", hi: "पांच सामान्य फलों के नाम बताता है" },
      { id: 36, ageLevel: "5-7", en: "Recites rhymes of atleast 3-4 lines", hi: "कम से कम 3-4 पंक्तियों की कविता सुनाता है" },
      { id: 37, ageLevel: "5-7", en: "Uses adjectives like long-short, rough-smooth and clean-dirty", hi: "'लंबा-छोटा', 'खुरदरा-चिकना' और 'साफ-गंदा' जैसे विशेषणों का उपयोग करता है" },
      { id: 38, ageLevel: "7-9", glossary: true, en: "Uses complex sentences", hi: "जटिल वाक्यों (3 या अधिक विचारों वाले) का उपयोग करता है" },
      { id: 39, ageLevel: "7-9", glossary: true, en: "Narrates simple jokes", hi: "सरल चुटकुले सुनाता है" },
      { id: 40, ageLevel: "9+", glossary: true, en: "Carries on simple conversation", hi: "सरल विषयों पर बातचीत जारी रखता है" }
    ]
  },
  {
    key: "reading_writing",
    en: "Reading-Writing (RW)",
    hi: "पठन और लेखन विकास (Reading-Writing)",
    items: [
      { id: 1, ageLevel: "0-5", glossary: true, en: "Matches five similar objects", hi: "पांच समान वस्तुओं का मिलान करता है" },
      { id: 2, ageLevel: "0-5", material: true, en: "Matches five common objects to pictures in a book", hi: "पुस्तक में चित्रों के साथ पांच सामान्य वस्तुओं का मिलान करता है" },
      { id: 3, ageLevel: "0-5", material: true, en: "Matches five colours", hi: "पांच रंगों का मिलान करता है" },
      { id: 4, ageLevel: "0-5", glossary: true, en: "Recognises his/her name", hi: "एक सूची में से अपना नाम पहचानता है" },
      { id: 5, ageLevel: "0-5", glossary: true, en: "Reads his/her own name", hi: "अपना स्वयं का नाम पढ़ता है" },
      { id: 6, ageLevel: "0-5", material: true, glossary: true, en: "Sorts five similar pictures into same category", hi: "पांच समान चित्रों को एक ही श्रेणी में वर्गीकृत करता है" },
      { id: 7, ageLevel: "0-5", material: true, glossary: true, en: "Matches five three letter words", hi: "पांच तीन-अक्षर वाले शब्दों का मिलान करता है" },
      { id: 8, ageLevel: "5-7", material: true, en: "Identifies five colours", hi: "पांच रंगों की पहचान करता है" },
      { id: 9, ageLevel: "5-7", material: true, en: "Names five colours", hi: "पांच रंगों के नाम बताता है" },
      { id: 10, ageLevel: "5-7", material: true, glossary: true, en: "Reads five printed words", hi: "पांच छपे हुए शब्द पढ़ता है" },
      { id: 11, ageLevel: "7-9", glossary: true, en: "Reads names of parents", hi: "माता-पिता के नाम पढ़ता है" },
      { id: 12, ageLevel: "7-9", material: true, glossary: true, en: "Reads two word phrases", hi: "दो शब्दों के वाक्यांश पढ़ता है" },
      { id: 13, ageLevel: "7-9", glossary: true, en: "Reads own address", hi: "अपना पता पढ़ता है" },
      { id: 14, ageLevel: "7-9", glossary: true, en: "Reads names of family members/friends", hi: "परिवार के सदस्यों/मित्रों के नाम पढ़ता है" },
      { id: 15, ageLevel: "7-9", material: true, glossary: true, en: "Reads short sentences", hi: "छोटे वाक्य पढ़ता है" },
      { id: 16, ageLevel: "7-9", material: true, glossary: true, en: "Reads sign boards", hi: "पड़ोस के साइन बोर्ड पढ़ता है" },
      { id: 17, ageLevel: "9+", material: true, glossary: true, en: "Reads small paragraphs", hi: "छोटे पैराग्राफ पढ़ता है" },
      { id: 18, ageLevel: "9+", material: true, glossary: true, en: "Reads large print from magazines, newspapers, etc.", hi: "पत्रिकाओं, समाचार पत्रों आदि से बड़े अक्षरों वाला प्रिंट पढ़ता है" },
      { id: 19, ageLevel: "9+", material: true, glossary: true, en: "Reads medium sized handwritten paragraphs", hi: "हाथ से लिखे मध्यम आकार के पैराग्राफ पढ़ता है" },
      { id: 20, ageLevel: "9+", material: true, en: "Reads short news item from newspapers", hi: "समाचार पत्रों से लघु समाचार पढ़ता है" },
      { id: 21, ageLevel: "0-5", en: "Scribbles with chalk or pencil on a slate, floor or paper", hi: "स्लेट, फर्श या कागज पर चाक या पेंसिल से लकीरें खींचता है" },
      { id: 22, ageLevel: "0-5", en: "Traces along a three inch straight line", hi: "3-इंच की सीधी रेखा पर ट्रेसिंग करता है" },
      { id: 23, ageLevel: "0-5", material: true, en: "Traces along a circular object", hi: "एक गोल वस्तु के चारों ओर लकीर खींचता है" },
      { id: 24, ageLevel: "0-5", en: "Traces alphabets of own name", hi: "अपने नाम के अक्षरों की ट्रेसिंग करता है" },
      { id: 25, ageLevel: "0-5", en: "Copies alphabets of own name", hi: "अपने नाम के अक्षरों को देखकर लिखता है (नकल करता है)" },
      { id: 26, ageLevel: "0-5", en: "Copies a straight line", hi: "सीधी रेखा को देखकर बनाता है" },
      { id: 27, ageLevel: "0-5", en: "Copies a circle", hi: "गोले को देखकर गोला बनाता है" },
      { id: 28, ageLevel: "0-5", glossary: true, en: "Draws a line connecting three dots", hi: "तीन बिंदुओं को जोड़ने वाली रेखा खींचता है" },
      { id: 29, ageLevel: "0-5", glossary: true, en: "Writes own name", hi: "अपना नाम खुद लिखता है" },
      { id: 30, ageLevel: "5-7", en: "Copies a square", hi: "चौकोर आकृति को देखकर बनाता है" },
      { id: 31, ageLevel: "5-7", en: "Copies a triangle", hi: "त्रिकोणीय आकृति को देखकर बनाता है" },
      { id: 32, ageLevel: "5-7", en: "Copies own address", hi: "अपना पता देखकर लिखता है" },
      { id: 33, ageLevel: "5-7", en: "Writes own address", hi: "अपना पता बिना देखे लिखता है" },
      { id: 34, ageLevel: "7-9", glossary: true, en: "Copies five printed sentences", hi: "पांच छपे हुए वाक्यों को देखकर लिखता है" },
      { id: 35, ageLevel: "7-9", glossary: true, en: "Writes 5-6 words on dictation", hi: "इमला (श्रुतलेख) बोलने पर 5-6 शब्द लिखता है" },
      { id: 36, ageLevel: "7-9", glossary: true, en: "Writes five sentences on dictation", hi: "इमला पर पांच वाक्य लिखता है" },
      { id: 37, ageLevel: "9+", material: true, glossary: true, en: "Writes a letter", hi: "एक पत्र लिखता है (औपचारिक या अनौपचारिक)" },
      { id: 38, ageLevel: "9+", material: true, glossary: true, en: "Fills in an application", hi: "एक आवेदन फॉर्म भरता है (बस पास, रेलवे बुकिंग आदि)" },
      { id: 39, ageLevel: "9+", glossary: true, en: "Writes a composition of minimum 40 words on simple topics", hi: "सरल विषयों पर न्यूनतम 40 शब्दों का निबंध लिखता है" },
      { id: 40, ageLevel: "9+", glossary: true, en: "Writes a leave letter", hi: "छुट्टी के लिए प्रार्थना पत्र लिखता है" }
    ]
  },
  {
    key: "number_time",
    en: "Number-Time (NT)",
    hi: "संख्या और समय बोध (Number-Time)",
    items: [
      { id: 1, ageLevel: "0-5", en: "Rote counts 1-5", hi: "1 से 5 तक मौखिक गिनती बोलता है" },
      { id: 2, ageLevel: "0-5", material: true, glossary: true, en: "Separates one object from a group upon request", hi: "पूछने पर समूह से एक वस्तु अलग करता है" },
      { id: 3, ageLevel: "0-5", material: true, glossary: true, en: "Discriminates between less and more", hi: "'कम' और 'ज्यादा' के बीच अंतर करता है" },
      { id: 4, ageLevel: "0-5", glossary: true, en: "Matches identical number of concrete objects", hi: "समान संख्या वाली ठोस वस्तुओं का मिलान करता है" },
      { id: 5, ageLevel: "5-7", material: true, glossary: true, en: "Recognizes written numbers from 1-10", hi: "लिखे हुए नंबर्स 1 से 10 की पहचान करता है" },
      { id: 6, ageLevel: "5-7", en: "Writes numbers sequentially from 1-10", hi: "क्रम से लिखित नंबर्स 1 से 10 तक लिखता है" },
      { id: 7, ageLevel: "5-7", glossary: true, en: "Picks up specified number of objects upto five", hi: "माँगने पर पांच तक वांछित संख्या में वस्तुएं उठाता है" },
      { id: 8, ageLevel: "5-7", material: true, en: "Arranges number symbols sequentially from 1-5 in an order", hi: "नंबर्स के प्रतीकों को क्रम से 1-5 तक सलीके से सजाता है" },
      { id: 9, ageLevel: "5-7", material: true, glossary: true, en: "Follows directions to fill upto half glass", hi: "आधा गिलास भरने के निर्देश का पालन करता है" },
      { id: 10, ageLevel: "5-7", en: "Adds single digit numbers within 10", hi: "एक अंक वाले जोड़ हल करता है (योग मूल्य 10 तक)" },
      { id: 11, ageLevel: "5-7", en: "Subtracts single digit numbers within 10", hi: "एक अंक वाले घटाव हल करता है" },
      { id: 12, ageLevel: "5-7", en: "Writes numerals upto 100 on random dictation", hi: "इमला बोलने पर 100 तक कोई भी संख्या लिखता है" },
      { id: 13, ageLevel: "7-9", en: "Does two digit addition without carry over", hi: "बिना हासिल वाले दो अंकों के जोड़ हल करता है" },
      { id: 14, ageLevel: "7-9", en: "Does two digit subtraction without borrowing", hi: "बिना उधार वाले दो अंकों के घटाव हल करता है" },
      { id: 15, ageLevel: "7-9", en: "Does two digit addition with carryover", hi: "हासिल वाले दो अंकों के जोड़ हल करता है" },
      { id: 16, ageLevel: "7-9", en: "Does two digit subtraction with borrowing", hi: "उधार वाले दो अंकों के घटाव हल करता है" },
      { id: 17, ageLevel: "9+", material: true, glossary: true, en: "Names math symbols", hi: "गणितीय चिह्नों (जैसे +, -, x, =, /) के नाम बताता है" },
      { id: 18, ageLevel: "9+", material: true, glossary: true, en: "Measures liquid using measuring cups", hi: "माप कपों का उपयोग करके तरल पदार्थ मापता है (1/4, 1/2, 1 लीटर)" },
      { id: 19, ageLevel: "9+", material: true, glossary: true, en: "Weighs objects using weighing scale", hi: "तराजू/वेट स्केल का उपयोग करके वस्तुओं को तौलता है" },
      { id: 20, ageLevel: "9+", material: true, glossary: true, en: "Uses calculator for basic arithmetic operations", hi: "बुनियादी जोड़-घटाव के लिए कैलकुलेटर का उपयोग करता है" },
      { id: 21, ageLevel: "0-5", glossary: true, en: "Associates time/events to routine school activities", hi: "स्कूल की दैनिक गतिविधियों से समय/घटना को जोड़ता है" },
      { id: 22, ageLevel: "0-5", material: true, glossary: true, en: "Associates watch/clock with time", hi: "घड़ी को समय के सूचक के साथ जोड़ता है" },
      { id: 23, ageLevel: "0-5", glossary: true, en: "Follows 'now', 'later', 'hurry', 'wait'", hi: "'अभी', 'बाद में', 'जल्दी', 'रुको' जैसे समय सूचकों का पालन करता है" },
      { id: 24, ageLevel: "0-5", glossary: true, en: "Tells correctly if it is day or night", hi: "सहजता से बताता है कि अभी दिन है या रात" },
      { id: 25, ageLevel: "0-5", glossary: true, en: "Tells correctly if it is morning or evening", hi: "अनुकरण कर बताता है कि अभी सुबह है या शाम" },
      { id: 26, ageLevel: "0-5", glossary: true, en: "Follows yesterday, today and tomorrow", hi: "'बीता हुआ कल', 'आज' और 'आने वाला कल' को समझता है" },
      { id: 27, ageLevel: "5-7", material: true, en: "Tells hour and minute hands on the clock", hi: "घड़ी में घंटे और मिनट की सुइयों की पहचान करता है" },
      { id: 28, ageLevel: "5-7", en: "Names and identifies days of the week", hi: "सप्ताह के दिनों के नाम बताता और पहचानता है" },
      { id: 29, ageLevel: "5-7", glossary: true, en: "Counts by five's", hi: "पांच-पांच के अंतराल से गिनती (5, 10, 15...) बोलता है" },
      { id: 30, ageLevel: "7-9", material: true, glossary: true, en: "Tells time by hour", hi: "घंटे के अनुसार बिल्कुल सही समय बताता है (जैसे 3 बजे)" },
      { id: 31, ageLevel: "7-9", en: "Tells own age in years", hi: "वर्षों में अपनी सही आयु बताता है" },
      { id: 32, ageLevel: "7-9", en: "Names and identifies months of the year", hi: "वर्ष के महीनों के नाम बताता और पहचानता है" },
      { id: 33, ageLevel: "7-9", glossary: true, en: "Associates time with work routine", hi: "दैनिक कार्य दिनचर्या से समय को जोड़ता है" },
      { id: 34, ageLevel: "7-9", material: true, en: "Tells time by quarter hour", hi: "सवा/पौने/साढ़े (सवा तीन, साढ़े चार) का समय बताता है" },
      { id: 35, ageLevel: "7-9", glossary: true, en: "Tells date of birth", hi: "अपनी जन्म तिथि बताता है" },
      { id: 36, ageLevel: "9+", en: "Tells day, date, month and year", hi: "वर्तमान दिन, तारीख, महीना और वर्ष बताता है" },
      { id: 37, ageLevel: "9+", material: true, glossary: true, en: "Reads and uses a calendar", hi: "कैलेंडर को पढ़ना और उपयोग करना जानता है" },
      { id: 38, ageLevel: "9+", material: true, glossary: true, en: "Tells time to the minutes on the clock", hi: "सुइयों की स्थिति देखकर बिल्कुल सही मिनट तक समय बताता है" },
      { id: 39, ageLevel: "9+", glossary: true, en: "Reminds on prefixed time", hi: "पूर्व-निर्धारित समय आने पर याद दिलाता है" },
      { id: 40, ageLevel: "9+", material: true, glossary: true, en: "Sets watch to correct time", hi: "घड़ी को बताए गए सही समय पर सेट करता है" }
    ]
  },
  {
    key: "domestic_social",
    en: "Domestic-Social (DS)",
    hi: "घरेलू और सामाजिक कौशल (Domestic-Social)",
    items: [
      { id: 1, ageLevel: "0-5", en: "Keeps things at places when asked to", hi: "कहे जाने पर चीजों को उनकी निर्धारित जगह पर रखता है" },
      { id: 2, ageLevel: "0-5", en: "Collects waste and puts away in the waste paper basket", hi: "कचरा इकट्ठा कर कचरापात्र (डस्टबिन) में डालता है" },
      { id: 3, ageLevel: "0-5", material: true, en: "Dusts/wipes table, chairs etc.", hi: "मेज, कुर्सियों आदि को झाड़ता/पोंछता है" },
      { id: 4, ageLevel: "5-7", material: true, en: "Waters plants", hi: "पौधों में पानी डालता है" },
      { id: 5, ageLevel: "5-7", en: "Folds own clothing", hi: "अपने कपड़े स्वयं मोड़ता है" },
      { id: 6, ageLevel: "5-7", material: true, en: "Sweeps floor using a broom", hi: "झाड़ू का उपयोग करके फर्श बुहारता है" },
      { id: 7, ageLevel: "7-9", material: true, en: "Wets/mops floor", hi: "फर्श पर पोछा लगाता है (गीला करना)" },
      { id: 8, ageLevel: "7-9", material: true, glossary: true, en: "Serves eatables", hi: "खाने-पीने की चीजें परोसता है" },
      { id: 9, ageLevel: "7-9", material: true, glossary: true, en: "Washes utensils", hi: "बर्तन साफ करता है" },
      { id: 10, ageLevel: "7-9", material: true, glossary: true, en: "Washes clothes", hi: "अपने कपड़े खुद धोता है" },
      { id: 11, ageLevel: "7-9", material: true, glossary: true, en: "Cuts vegetables", hi: "सब्जियाँ छीलकर/काटता है" },
      { id: 12, ageLevel: "9+", material: true, en: "Lights a kerosene/gas stove", hi: "सुरक्षित रूप से गैस चूल्हा या स्टोव जलाता है" },
      { id: 13, ageLevel: "9+", material: true, glossary: true, en: "Prepares tea or coffee", hi: "चाय या कॉफी तैयार करता है" },
      { id: 14, ageLevel: "9+", material: true, glossary: true, en: "Prepares dough for chapati/puris", hi: "चपाती/पूरी के लिए आटा गूँथता है" },
      { id: 15, ageLevel: "9+", glossary: true, en: "Prepares simple breakfast items", hi: "नाश्ते की सरल चीजें (जैसे उपमा, ब्रेड बटर, इडली) तैयार करता है" },
      { id: 16, ageLevel: "9+", material: true, glossary: true, en: "Sews buttons", hi: "सुई-धागे से शर्ट आदि में बटन टाँकता है" },
      { id: 17, ageLevel: "9+", glossary: true, en: "Cooks rice or other food items", hi: "चावल या अन्य बुनियादी खाद्य पदार्थ पकाता है" },
      { id: 18, ageLevel: "9+", glossary: true, en: "Prepares a curry or sabji", hi: "सब्जी या करी तैयार करता है" },
      { id: 19, ageLevel: "9+", en: "Irons own cotton clothes", hi: "अपने सूती कपड़ों पर स्वयं इस्त्री करता है" },
      { id: 20, ageLevel: "9+", glossary: true, en: "Prepares a complete meal", hi: "पूरा भोजन तैयार करता है (दाल, चावल, सब्जी, चपाती)" },
      { id: 21, ageLevel: "0-5", en: "Responds with correct gesture when said ta-ta", hi: "टा-टा कहे जाने पर विदा सूचक इशारा करता है" },
      { id: 22, ageLevel: "0-5", en: "Responds to own name by turning his/her head", hi: "अपना नाम पुकारने पर मुड़कर देखता है" },
      { id: 23, ageLevel: "0-5", en: "Identifies teacher by her name", hi: "संबंधित शिक्षक की नाम से पहचान करता है" },
      { id: 24, ageLevel: "0-5", en: "Goes inside school yard and comes back", hi: "स्कूल या आहाते के मैदान के अंदर जाता और वापस लौट आता है" },
      { id: 25, ageLevel: "0-5", en: "Shares food/toys with other children", hi: "अन्य बच्चों के साथ भोजन/खिलौने साझा करता है" },
      { id: 26, ageLevel: "5-7", glossary: true, en: "Greets others", hi: "बड़ों/दूसरों का अभिवादन (नमस्ते, गुड मॉर्निंग) करता है" },
      { id: 27, ageLevel: "5-7", glossary: true, en: "Seeks permission to go out", hi: "बाहर जाने या पानी पीने के लिए शिक्षक से आज्ञा मांगता है" },
      { id: 28, ageLevel: "5-7", en: "Sings/dances with music", hi: "संगीत के साथ गाता/नाचता है" },
      { id: 29, ageLevel: "5-7", glossary: true, en: "Offers help to teachers in classroom/school chores", hi: "कक्षा के छोटे-मोटे कामों में शिक्षक की मदद करता है" },
      { id: 30, ageLevel: "5-7", glossary: true, en: "Knows duties of various occupations", hi: "विभिन्न व्यवसायों (डाकिया, पुलिस, डॉक्टर) के कार्यों को जानता है" },
      { id: 31, ageLevel: "5-7", en: "Waits for his turn with 4 to 5 other children", hi: "कक्षा/खेल में 4 से 5 बच्चों के साथ अपनी बारी का इंतजार करता है" },
      { id: 32, ageLevel: "5-7", glossary: true, en: "Plays with 4-5 children", hi: "किंडरगार्टन के सामूहिक खेल 4-5 बच्चों के साथ खेलता है" },
      { id: 33, ageLevel: "7-9", glossary: true, en: "Comes and goes to school unattended when the school is within the same neighbourhood", hi: "घर के पास विद्यालय होने पर बिना किसी के साथ अकेले स्कूल आता-जाता है" },
      { id: 34, ageLevel: "7-9", glossary: true, en: "Says 'please', and 'thank you'", hi: "'कृपया' और 'धन्यवाद' जैसे शिष्टाचार शब्दों का उपयोग करता है" },
      { id: 35, ageLevel: "7-9", glossary: true, en: "Introduces himself to others", hi: "दूसरों को अपना पूरा परिचय देता है (नाम, उम्र, स्कूल आदि)" },
      { id: 36, ageLevel: "7-9", material: true, glossary: true, en: "Plays with children for 20 minutes in cooperative play/activity", hi: "सहयोगात्मक खेल या गतिविधि में बच्चों के साथ 20 मिनट तक खेलता है" },
      { id: 37, ageLevel: "7-9", glossary: true, en: "Can cross road", hi: "सड़क पार करने के नियमों का ध्यान रखकर सुरक्षित रूप से सड़क पार करता है" },
      { id: 38, ageLevel: "7-9", glossary: true, en: "Goes to home from school or vice versa outside his neighbourhood", hi: "घर से अकेले स्कूल आता-जाता है (पड़ोस से बाहर 2-3 किमी की सीमा में)" },
      { id: 39, ageLevel: "9+", en: "Receives and gives message taken on phone or in person", hi: "फोन या व्यक्तिगत रूप से आए संदेश को सुनकर दूसरों तक पहुँचाता है" },
      { id: 40, ageLevel: "9+", glossary: true, en: "Travels in a bus on own", hi: "शहर में बस मार्ग समझकर अकेले बस से टिकट लेकर यात्रा कर लेता है" }
    ]
  },
  {
    key: "prevocational_money",
    en: "Prevocational-Money (PV)",
    hi: "पूर्व-व्यावसायिक व धन प्रबंधन (Prevocational-Money)",
    items: [
      { id: 1, ageLevel: "0-5", en: "Carries notice/messages from one classroom to another", hi: "एक कक्षा से दूसरी कक्षा में नोटिस/संदेश ले जाता है" },
      { id: 2, ageLevel: "0-5", material: true, en: "Brush paints", hi: "ब्रश से पेंटिंग करता है" },
      { id: 3, ageLevel: "5-7", material: true, en: "Uses a pencil sharpener", hi: "पेंसिल शार्पनर का उपयोग करता है" },
      { id: 4, ageLevel: "5-7", material: true, glossary: true, en: "Sticks using gum or glue", hi: "गोंद या फेविकोल का उपयोग करके आकृतियां चिपकाता है" },
      { id: 5, ageLevel: "7-9", material: true, glossary: true, en: "Cuts simple shapes", hi: "कैंची से सरल ज्यामितीय आकृतियां काटता है" },
      { id: 6, ageLevel: "7-9", en: "Rings school bell on time", hi: "समय पर स्कूल की घंटी बजाता है" },
      { id: 7, ageLevel: "7-9", material: true, glossary: true, en: "Clips using stapler", hi: "पांच कागजों को क्रम से लगाकार स्टेपलर लगाता है" },
      { id: 8, ageLevel: "7-9", material: true, glossary: true, en: "Makes holes using punching machine", hi: "पंचिंग मशीन का उपयोग करके कागजों में छेद करता है" },
      { id: 9, ageLevel: "7-9", glossary: true, en: "Stacks objects into groups", hi: "वस्तुओं को 5, 10 या 20 के समूहों में जमाता है" },
      { id: 10, ageLevel: "7-9", glossary: true, en: "Puts away things in appropriate places after use", hi: "उपयोग के बाद सामग्री को वापस अलमारी में सलीके से रखता है" },
      { id: 11, ageLevel: "7-9", material: true, glossary: true, en: "Assembles similar objects of three to four sizes", hi: "विभिन्न आकारों की नट-बोल्ट, मोमबत्ती आदि वस्तुओं को असेंबल करता है" },
      { id: 12, ageLevel: "7-9", material: true, en: "Nails and hangs a calendar", hi: "दीवार पर कील लगाकर कैलेंडर टाँगता है" },
      { id: 13, ageLevel: "7-9", material: true, en: "Uses a screw driver to insert or remove screws", hi: "स्क्रू ड्राइवर का उपयोग करके पेच कसता या खोलता है" },
      { id: 14, ageLevel: "9+", glossary: true, en: "Tells date of National festivals", hi: "राष्ट्रीय त्योहारों (स्वतंत्रता, गणतंत्र दिवस) की सही तारीख बताता है" },
      { id: 15, ageLevel: "9+", material: true, glossary: true, en: "Makes a garland of flowers using thread", hi: "सुई और धागे से फूलों की माला बनाता है" },
      { id: 16, ageLevel: "9+", material: true, glossary: true, en: "Applies medicine on a cut", hi: "चोट/कटे स्थान पर मलहम और पट्टी लगाता है" },
      { id: 17, ageLevel: "9+", material: true, glossary: true, en: "Does simple hemming work", hi: "सरल तुरपाई या सिलाई का काम करता है" },
      { id: 18, ageLevel: "9+", material: true, en: "Plants a sapling", hi: "पौधा रोपता है" },
      { id: 19, ageLevel: "9+", glossary: true, en: "Tells names of important people", hi: "महत्वपूर्ण व्यक्तियों के नाम बताता है (राष्ट्रपति, प्रधानमंत्री, मुख्यमंत्री)" },
      { id: 20, ageLevel: "9+", material: true, glossary: true, en: "Wraps a gift box", hi: "गिफ्ट रैपिंग पेपर और टेप से उपहार पैक करता है" },
      { id: 21, ageLevel: "0-5", glossary: true, en: "Sorts coins from other similar metal objects", hi: "सिक्कों को अन्य समान गोल धातु वाली चीजों से अलग करता है" },
      { id: 22, ageLevel: "0-5", en: "Aware that money can buy things", hi: "समझता है कि पैसे से सामान खरीदा जा सकता है" },
      { id: 23, ageLevel: "0-5", glossary: true, en: "Keeps money safely", hi: "पैसे को बटुए, पॉकेट या गुल्लक में संभालकर सुरक्षित रखता है" },
      { id: 24, ageLevel: "0-5", material: true, en: "Selects a rupee note from other paper objects", hi: "कागज के सामान्य टुकड़ों में से असली नोट का चयन करता है" },
      { id: 25, ageLevel: "5-7", material: true, glossary: true, en: "Sorts out mixed coins", hi: "मिश्रित सिक्कों को अलग-अलग (5, 10, 20 पैसे आदि) छाँटता है" },
      { id: 26, ageLevel: "5-7", material: true, glossary: true, en: "Identifies/names denomination of all coins", hi: "सभी सिक्कों के मूल्य/मूल्यवर्ग पहचानता और बोलकर बताता है" },
      { id: 27, ageLevel: "5-7", material: true, en: "Identifies/names currency notes upto 10", hi: "Rs. 10 तक के सभी करेंसी नोटों की पहचान करता है" },
      { id: 28, ageLevel: "5-7", glossary: true, en: "Rank orders coins", hi: "विभिन्न सिक्कों को उनके मूल्य के बढ़ते/घटते क्रम में लगाता है" },
      { id: 29, ageLevel: "7-9", glossary: true, en: "Adds collects coins to make a rupee", hi: "छोटे सिक्कों को जोड़कर एक रुपया पूरा बनाता है" },
      { id: 30, ageLevel: "7-9", glossary: true, en: "Makes purchases within 1 Re", hi: "1 रुपये की सीमा में दुकान से सामान खरीद लेता है" },
      { id: 31, ageLevel: "7-9", glossary: true, en: "Makes purchases within 1 Re. with correct change", hi: "1 रुपये के अंदर सही बच्चे पैसे वापस लेकर खरीदारी करता है" },
      { id: 32, ageLevel: "7-9", en: "Makes purchases upto Rs.2 with correct change", hi: "Rs. 2 तक सामान खरीदकर सही खुले पैसे वापस लेता है" },
      { id: 33, ageLevel: "7-9", glossary: true, en: "Knows transactional value for items below Rs.10", hi: "Rs. 10 से कम मूल्य की वस्तुओं की वास्तविक कीमत जानता है" },
      { id: 34, ageLevel: "9+", en: "Calculates change upto 10 rupees", hi: "Rs. 10 तक के लेन-देन में खुले पैसों की गणना करता है" },
      { id: 35, ageLevel: "9+", en: "Makes purchases upto Rs.5 with correct change", hi: "Rs. 5 तक की खरीदारी करता है और खुले पैसे वापस लेता है" },
      { id: 36, ageLevel: "9+", en: "Makes purchases upto Rs.10 with correct change", hi: "Rs. 10 तक की खरीदारी करता है और खुले पैसे वापस लेता है" },
      { id: 37, ageLevel: "9+", en: "Knows transactional value for items upto Rs.100", hi: "Rs. 100 तक मूल्यवर्ग की बुनियादी वस्तुओं की कीमत जानता है" },
      { id: 38, ageLevel: "9+", en: "Maintains account of money in a piggy bank", hi: "पिग्गी बैंक (गुल्लक) में रखे धन का हिसाब रखता है" },
      { id: 39, ageLevel: "9+", material: true, glossary: true, en: "Deposits money in a bank", hi: "बैंक में खुद जाकर जमा फॉर्म भरकर पैसे जमा करने की प्रक्रिया जानता है" },
      { id: 40, ageLevel: "9+", material: true, glossary: true, en: "Withdraws money from bank", hi: "बैंक से निकासी चेक या विड्रॉल स्लिप भरकर सुरक्षित पैसे निकाल लेता है" }
    ]
  }
];

export interface BasicMrPartBItem {
  id: number;
  en: string;
  hi: string;
}

export interface BasicMrPartBDomain {
  key: string;
  en: string;
  hi: string;
  items: BasicMrPartBItem[];
}

export const PART_B_DOMAINS: BasicMrPartBDomain[] = [
  {
    key: "violent_destructive",
    en: "Violent & Destructive Behaviours",
    hi: "हिंसक और विनाशकारी व्यवहार",
    items: [
      { id: 1, en: "Kicks others", hi: "दूसरों को लात मारना" },
      { id: 2, en: "Pushes others", hi: "दूसरों को धक्के देना" },
      { id: 3, en: "Pinches others", hi: "दूसरों को चिकोटी काटना" },
      { id: 4, en: "Pulls hair, ear, body parts of others", hi: "दूसरों के बाल, कान या शरीर के अंग खींचना" },
      { id: 5, en: "Slaps others", hi: "दूसरों को थप्पड़ मारना" },
      { id: 6, en: "Hits others", hi: "दूसरों को मारना/चोट पहुँचाना" },
      { id: 7, en: "Spits on others", hi: "दूसरों पर थूकना" },
      { id: 8, en: "Bangs objects", hi: "वस्तुओं को जोर से पटकना" },
      { id: 9, en: "Slams doors", hi: "दरवाजे जोर-जोर से बंद करना" },
      { id: 10, en: "Bites others", hi: "दूसरों को काटना" },
      { id: 11, en: "Attacks or pokes others with weapon (blade, stick, pencil)", hi: "दूसरों पर नुकीली वस्तु (ब्लेड, पेंसिल, लकड़ी) से हमला करना" },
      { id: 12, en: "Throws objects at others", hi: "दूसरों पर चीजें फेंकना" },
      { id: 13, en: "Tears/pulls threads from own or others clothing", hi: "अपने या दूसरों के कपड़ों से धागे खींचना या फाड़ना" },
      { id: 14, en: "Tears up own or others books, papers, magazines", hi: "अपनी या दूसरों की किताबें, कागज या पत्रिकाएं फाड़ना" },
      { id: 15, en: "Breaks objects/glass/toys", hi: "वस्तुओं, कांच या खिलौनों को तोड़ना" },
      { id: 16, en: "Damages furniture", hi: "फर्नीचर को नुकसान पहुँचाना" }
    ]
  },
  {
    key: "temper_tantrums",
    en: "Temper Tantrums",
    hi: "गुस्सा होना (टैंट्रम्स)",
    items: [
      { id: 17, en: "Cries excessively", hi: "अत्यधिक रोना" },
      { id: 18, en: "Screams", hi: "अत्यधिक चीखना-चिल्लाना" },
      { id: 19, en: "Stamps feet", hi: "पैर पटकना" },
      { id: 20, en: "Rolls on floor", hi: "जमीन पर लोटना-पोटना" }
    ]
  },
  {
    key: "misbehaves_others",
    en: "Misbehaves with Others",
    hi: "दूसरों के साथ दुर्व्यवहार",
    items: [
      { id: 21, en: "Pulls objects from others", hi: "दूसरों से वस्तुएं झपटना/छीनना" },
      { id: 22, en: "Interrupts in between when others are talking", hi: "दूसरों की बातचीत के बीच में बाधा डालना या टोकना" },
      { id: 23, en: "Makes loud noise when others are working or reading", hi: "पढ़ाते या काम करते समय अत्यधिक तेज आवाज करना" },
      { id: 24, en: "Makes face to tease others", hi: "दूसरों को चिढ़ाने के लिए अजीब मुंह बनाना" },
      { id: 25, en: "Uses abusive/vulgar language", hi: "गाली या अभद्र भाषा का उपयोग करना" },
      { id: 26, en: "Takes others possession without their permission openly", hi: "बिना अनुमति के दूसरों का सामान खुले तौर पर ले लेना" },
      { id: 27, en: "Tells others what to do and wants his/her way (bossy)", hi: "दूसरों पर अपनी मर्जी थोपना या अधिकार जताना (बॉसी रवैया)" }
    ]
  },
  {
    key: "self_injurious",
    en: "Self Injurious Behaviours",
    hi: "स्वयं को चोट पहुँचाना",
    items: [
      { id: 28, en: "Bangs head", hi: "दीवार या जमीन पर सिर पटकना" },
      { id: 29, en: "Bites self", hi: "स्वयं को काटना" },
      { id: 30, en: "Cuts or mutilates self", hi: "स्वयं की त्वचा काटना या खुद को घायल करना" },
      { id: 31, en: "Pulls own hair", hi: "अपने बाल खुद नोचना/खींचना" },
      { id: 32, en: "Scratches self", hi: "स्वयं को नोचना या खरोंचना" },
      { id: 33, en: "Hits self", hi: "स्वयं को थप्पड़ या मुक्का मारना" },
      { id: 34, en: "Puts objects into eyes/nose/ear", hi: "आँखों, नाक या कान में अवांछित चीजें डालना" },
      { id: 35, en: "Eats inedible things", hi: "न खाने योग्य चीजें (मिट्टी, चॉक आदि) खाना" },
      { id: 36, en: "Peels skin/wounds", hi: "घाव/त्वचा की परत नोचना" },
      { id: 37, en: "Bites nails", hi: "नाखून काटना/चबाना" }
    ]
  },
  {
    key: "repetitive",
    en: "Repetitive Behaviours",
    hi: "बार-बार दोहराए जाने वाले व्यवहार",
    items: [
      { id: 38, en: "Rocks body", hi: "शरीर को बार-बार झुलाना (रॉकिंग करना)" },
      { id: 39, en: "Nods head", hi: "सिर को बार-बार हाँ/ना की मुद्रा में हिलाना" },
      { id: 40, en: "Sucks thumb", hi: "अंगूठा चूसना" },
      { id: 41, en: "Makes peculiar sounds", hi: "अजीबोगरीब आवाजें निकालना" },
      { id: 42, en: "Bites ends of pen/pencil", hi: "पेंसिल या पेन के अंतिम कोनों को चबाना" },
      { id: 43, en: "Shakes parts of the body repeatedly", hi: "हाथ, पैर या शरीर के किसी हिस्से को बार-बार झटकना" },
      { id: 44, en: "Grinds teeth", hi: "दांत पीसना (किड़किड़ाना)" },
      { id: 45, en: "Swings round and round", hi: "गुल-गोल चक्कर काटना या घूमना" }
    ]
  },
  {
    key: "odd_behaviours",
    en: "Odd Behaviours",
    hi: "अजीबोगरीब व्यवहार",
    items: [
      { id: 46, en: "Laughs to self", hi: "अकारण अपने आप मुस्कुराना या हँसना" },
      { id: 47, en: "Laughs inappropriately", hi: "गलत समय या स्थान पर अनायास हँसना" },
      { id: 48, en: "Talks to self", hi: "अपने आप से बड़बड़ाना या बात करना" },
      { id: 49, en: "Hoards unwanted objects (sticks, thread, pieces of old clothes)", hi: "कबाड़ या अनुपयोगी चीजें (धागे, कीलें, लकड़ी) इकट्ठी करना" },
      { id: 50, en: "Picks nose", hi: "नाक में बार-बार उंगली डालना" },
      { id: 51, en: "Plays with unwanted objects like slippers, strings, dirt excessively", hi: "कीचड़, चप्पल या गंदी चीजों से जरूरत से ज्यादा खेलना" },
      { id: 52, en: "Kisses, hugs, and licks people unnecessarily", hi: "अनायास दूसरों को चूमना, गले लगाना या चाटना" },
      { id: 53, en: "Smells objects", hi: "सभी चीजों या बर्तनों को बार-बार सूँघना" }
    ]
  },
  {
    key: "hyperactivity",
    en: "Hyperactivity",
    hi: "अति-सक्रियता",
    items: [
      { id: 54, en: "Does not sit at one place for required time", hi: "एक स्थान पर निर्धारित समय तक बैठकर न ठहरना" },
      { id: 55, en: "Does not pay attention to what is told", hi: "बताई गई बातों पर ध्यान न देना" },
      { id: 56, en: "Does not continue with the task at hand for required time", hi: "दी गई गतिविधि को पूरा किए बिना बीच में छोड़ देना" }
    ]
  },
  {
    key: "rebellious",
    en: "Rebellious Behaviours",
    hi: "विद्रोही व्यवहार",
    items: [
      { id: 57, en: "Refuses to obey commands", hi: "दिए गए निर्देशों का पालन करने से साफ मना करना" },
      { id: 58, en: "Does opposite of what is requested", hi: "दिए गए निर्देश के बिल्कुल विपरीत काम करना" },
      { id: 59, en: "Takes very long time intentionally to complete a task", hi: "काम पूरा करने के लिए जानबूझकर अत्यधिक समय लगाना" },
      { id: 60, en: "Wanders outside school", hi: "स्कूल/कक्षा के बाहर बिना काम इधर-उधर घूमना" },
      { id: 61, en: "Runs away from school", hi: "स्कूल से चुपके से भाग जाना" },
      { id: 62, en: "Argues without purpose", hi: "बिना किसी सार्थक उद्देश्य के बहस करना" }
    ]
  },
  {
    key: "antisocial",
    en: "Antisocial Behaviours",
    hi: "असामाजिक व्यवहार",
    items: [
      { id: 63, en: "Lies or twists the truth to his own advantage or blames others", hi: "झूठ बोलना या अपने फायदे के लिए बात घुमाना" },
      { id: 64, en: "Cheats in games or no sense of fair play", hi: "खेलों में चोरी या बेईमानी करना" },
      { id: 65, en: "Steals", hi: "दूसरों की चीजें बिना बताए चुराना" },
      { id: 66, en: "Makes obscene gestures", hi: "अश्लील या अभद्र इशारे करना" },
      { id: 67, en: "Exposes body parts inappropriately", hi: "गलत तरीके से शरीर के किसी हिस्से को अनावृत करना" },
      { id: 68, en: "Makes sexual advances towards members of opposite sex", hi: "विपरीत लिंग के बच्चों/व्यक्तियों के साथ अनुचित व्यवहार का प्रयास" },
      { id: 69, en: "Touches own private parts in public", hi: "सामूहिक जगह पर अपने निजी अंगों को छूना" },
      { id: 70, en: "Touches others private parts in public", hi: "सामूहिक जगह पर दूसरों के निजी अंगों को छूना" },
      { id: 71, en: "Gambles", hi: "शर्तें लगाना या सट्टेबाजी के खेल खेलना" }
    ]
  },
  {
    key: "fears",
    en: "Fears",
    hi: "डर और भय",
    items: [
      { id: 72, en: "Fear of objects", hi: "किसी विशेष सामान्य वस्तु (जैसे गुब्बारे, पेन) से अत्यधिक डरना" },
      { id: 73, en: "Fear of animals", hi: "साधारण जानवरों (कुत्ता, बिल्ली) से अत्यधिक डरना" },
      { id: 74, en: "Fear of places", hi: "बंद कमरों, अंधेरी जगहों या ऊंचाई से डरना" },
      { id: 75, en: "Fear of persons", hi: "अजनबी या विशिष्ट व्यक्तियों को देखकर अत्यधिक डरना/चीखना" }
    ]
  }
];
