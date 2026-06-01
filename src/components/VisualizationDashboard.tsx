import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
  PieChart,
  Pie,
  CartesianGrid
} from "recharts";
import { StudentRecord } from "../types";
import { LanguageType, DISABILITIES_LIST, translationMap } from "../language";
import { Activity, MapPin, Milestone, TrendingUp, Users } from "lucide-react";

interface VisualizationDashboardProps {
  lang: LanguageType;
  studentsList: StudentRecord[];
}

// Age calculator helper to get numerical age in years
function getAgeInYears(dob: string): number {
  if (!dob) return 0;
  const birthDate = new Date(dob);
  const today = new Date();
  if (isNaN(birthDate.getTime())) return 0;
  let years = today.getFullYear() - birthDate.getFullYear();
  const months = today.getMonth() - birthDate.getMonth();
  if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
    years--;
  }
  return years >= 0 ? years : 0;
}

// Gorgeous professional color palette for colorful charts
const CHART_COLORS = [
  "#3b82f6", // Blue
  "#10b981", // Emerald
  "#ec4899", // Pink
  "#f59e0b", // Amber
  "#8b5cf6", // Purple
  "#ef4444", // Red
  "#06b6d4", // Cyan
  "#f43f5e", // Rose
  "#14b8a6", // Teal
  "#ca8a04", // Dark Yellow
  "#6366f1", // Indigo
  "#a855f7"  // Violet
];

export default function VisualizationDashboard({ lang, studentsList }: VisualizationDashboardProps) {
  const t = translationMap[lang];

  // Map students data to the 4 requested dimensions
  
  // 1. Disability category counts
  const disabilityMap: Record<string, number> = {};
  // 2. Age group counts
  const ageGroupCounts = {
    "0-5 Yrs": 0,
    "6-10 Yrs": 0,
    "11-15 Yrs": 0,
    "16+ Yrs": 0
  };
  // 3. Block counts
  const blockMap: Record<string, number> = {};
  // 4. District counts
  const districtMap: Record<string, number> = {};

  studentsList.forEach(student => {
    const p = student.profile;
    
    // Disability Category
    const disObj = DISABILITIES_LIST.find(d => d.id === p.disabilityType);
    const disLabel = disObj ? disObj[lang] : (p.disabilityType || "Unknown");
    disabilityMap[disLabel] = (disabilityMap[disLabel] || 0) + 1;

    // Calculated Age
    const years = getAgeInYears(p.dateOfBirth);
    if (years <= 5) ageGroupCounts["0-5 Yrs"]++;
    else if (years <= 10) ageGroupCounts["6-10 Yrs"]++;
    else if (years <= 15) ageGroupCounts["11-15 Yrs"]++;
    else ageGroupCounts["16+ Yrs"]++;

    // Block
    const blockLabel = p.block?.trim() || (lang === "en" ? "Not Specified" : "निर्दिष्ट नहीं");
    blockMap[blockLabel] = (blockMap[blockLabel] || 0) + 1;

    // District
    const distLabel = p.district?.trim() || (lang === "en" ? "Not Specified" : "निर्दिष्ट नहीं");
    districtMap[distLabel] = (districtMap[distLabel] || 0) + 1;
  });

  // Convert aggregates to Recharts format
  const disabilityData = Object.entries(disabilityMap).map(([name, value]) => ({
    name: name.length > 30 ? name.substring(0, 28) + "..." : name,
    value
  })).sort((a, b) => b.value - a.value);

  const ageData = Object.entries(ageGroupCounts).map(([name, value]) => ({
    name,
    value
  }));

  const blockData = Object.entries(blockMap).map(([name, value]) => ({
    name,
    value
  })).sort((a, b) => b.value - a.value);

  const districtData = Object.entries(districtMap).map(([name, value]) => ({
    name,
    value
  })).sort((a, b) => b.value - a.value);

  const totalRegisteredCount = studentsList.length;

  return (
    <div className="w-full flex flex-col gap-8 pb-12 text-slate-800">
      
      {/* Dynamic Header Badge */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-teal-500 via-indigo-500 to-purple-600 p-6 rounded-2xl text-white shadow-lg border-b-4 border-indigo-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Milestone className="w-6 h-6 text-white animate-spin" style={{ animationDuration: "15s" }} />
            <h1 className="text-xl font-black tracking-wide font-sans">
              {lang === "en" ? "Live Professional Visualization Dashboard" : "लाइव व्यावसायिक विज़ुअलाइज़ेशन डैशबोर्ड"}
            </h1>
            <span className="p-1 px-2.5 bg-indigo-700/80 text-white font-extrabold text-[9px] uppercase tracking-widest rounded-full border border-indigo-400 flex items-center gap-1">
              {lang === "en" ? "Live Connected" : "लाइव जुड़ा हुआ"}
            </span>
          </div>
          <p className="text-xs text-indigo-50 font-medium leading-relaxed max-w-3xl">
            {lang === "en"
              ? "Comprehensive analytics visualization mapping Children with Disabilities (Divyangjan) age groupings, RPwD categories, home blocks, and residential districts."
              : "दिव्यांग बच्चों की आयु समूह, दिव्यांगता श्रेणी (RPwD एक्ट), ब्लॉक स्तर और गृह जिलों के डेटा का समग्र ग्राफिक विज़ुअलाइज़ेशन विश्लेषण।"}
          </p>
        </div>
        
        {/* Metric Badge */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 px-5 border border-white/20 shadow-inner flex items-center gap-3">
          <Users className="w-5 h-5 text-emerald-300" />
          <div className="text-left">
            <span className="block text-[8px] uppercase tracking-wider text-indigo-200 font-extrabold">
              {lang === "en" ? "TOTAL ENROLLED KIDS" : "कुल पंजीकृत बच्चे"}
            </span>
            <span className="text-xl font-black block tracking-wider">{totalRegisteredCount}</span>
          </div>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <Milestone className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[9px] text-slate-400 uppercase font-bold tracking-wider">{lang === "en" ? "Active Disability Types" : "सक्रिय दिव्यांगता प्रकार"}</span>
            <span className="text-sm font-extrabold text-slate-800">{disabilityData.length}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[9px] text-slate-400 uppercase font-bold tracking-wider">{lang === "en" ? "Total Representation Blocks" : "कुल प्रतिनिधित्व ब्लॉक"}</span>
            <span className="text-sm font-extrabold text-slate-800">{blockData.filter(d => d.name !== "Not Specified" && d.name !== "निर्दिष्ट नहीं").length}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[9px] text-slate-400 uppercase font-bold tracking-wider">{lang === "en" ? "Total Coverage Districts" : "कुल कवरेज जिले"}</span>
            <span className="text-sm font-extrabold text-slate-800">{districtData.filter(d => d.name !== "Not Specified" && d.name !== "निर्दिष्ट नहीं").length}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="p-2.5 bg-pink-50 text-pink-600 rounded-xl">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[9px] text-slate-400 uppercase font-bold tracking-wider">{lang === "en" ? "Current Sync Status" : "वर्तमान सिंक स्थिति"}</span>
            <span className="text-xs font-black text-emerald-600 uppercase flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
              {lang === "en" ? "LIVE SYNCED" : "लाइव सिंक"}
            </span>
          </div>
        </div>
      </div>

      {totalRegisteredCount === 0 ? (
        /* Empty State */
        <div className="bg-slate-50 border-2 border-dashed border-indigo-200 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-indigo-600 animate-bounce" />
          </div>
          <h3 className="text-sm font-black text-indigo-950 uppercase mb-2">
            {lang === "en" ? "No Registered Student Records" : "कोई पंजीकृत छात्र रिकॉर्ड उपलब्ध नहीं है"}
          </h3>
          <p className="text-xs text-slate-500 font-medium max-w-xl leading-relaxed mb-6">
            {lang === "en"
              ? "The dashboard is empty because starter reports have been completely cleared. Please navigate back to the principal Dashboard to create, fill out demographic parameters (including Block & District), and click 'Save & Sync Student'."
              : "सभी डिफ़ॉल्ट डेटा हटा दिया गया है, इसलिए विज़ुअलाइज़ेशन अभी खाली है। कृपया मुख्य डैशबोर्ड पर जाएं, विद्यार्थी का डेटा (जिसमें ब्लॉक और जिला शामिल हैं) भरें और 'सहेजें और सिंक करें (Save & Sync Student)' बटन दबाएं।"}
          </p>
        </div>
      ) : (
        /* Dynamic Grid Charts */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Chart 1: Disability Distribution */}
          <div className="bg-white border-2 border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
            <div className="pb-4 mb-4 border-b border-slate-100">
              <span className="block text-[9px] uppercase tracking-widest font-black text-rose-500 mb-1">
                {lang === "en" ? "RPwD Categories Model" : "आरपीडब्ल्यूडी श्रेणियां वितरण"}
              </span>
              <h3 className="text-xs font-extrabold text-indigo-950 uppercase">
                {lang === "en" ? "Disability Categories Representation" : "दिव्यांगता श्रेणियों के आधार पर वितरण"}
              </h3>
            </div>

            <div className="h-[280px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={disabilityData} layout="vertical" margin={{ left: 10, right: 15, top: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.3} />
                  <XAxis type="number" stroke="#94a3b8" fontSize={10} fontWeight="bold" />
                  <YAxis dataKey="name" type="category" width={110} stroke="#4f46e5" fontSize={10} fontWeight="bold" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#1e1b4b", borderRadius: "12px", border: "0", color: "#fff" }}
                    itemStyle={{ color: "#38bdf8", fontWeight: "bold" }}
                    labelStyle={{ color: "#fff", fontWeight: "bold", fontSize: "10px" }}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[0, 8, 8, 0]} maxBarSize={30}>
                    {disabilityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Age Groupings */}
          <div className="bg-white border-2 border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
            <div className="pb-4 mb-4 border-b border-slate-100">
              <span className="block text-[9px] uppercase tracking-widest font-black text-amber-500 mb-1">
                {lang === "en" ? "Chronological Segments" : "आयु वर्गीकरण सेगमेंट"}
              </span>
              <h3 className="text-xs font-extrabold text-indigo-950 uppercase">
                {lang === "en" ? "Age Group Cumulative Metric" : "आयु वर्ग के आधार पर संख्या"}
              </h3>
            </div>

            <div className="h-[280px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ageData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {ageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[(index + 3) % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#1e1b4b", borderRadius: "12px", color: "#fff", border: "0" }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: "10px", fontWeight: "bold", textTransform: "uppercase" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Educational Block representation */}
          <div className="bg-white border-2 border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
            <div className="pb-4 mb-4 border-b border-slate-100">
              <span className="block text-[9px] uppercase tracking-widest font-black text-emerald-500 mb-1">
                {lang === "en" ? "Administrative Block level" : "प्रशासनिक ब्लॉक स्तर डेटा"}
              </span>
              <h3 className="text-xs font-extrabold text-indigo-950 uppercase">
                {lang === "en" ? "Educational Blocks Updation" : "ब्लॉक आधारित दिव्यांग छात्र संख्या"}
              </h3>
            </div>

            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={blockData} margin={{ left: 5, right: 5, top: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} fontWeight="bold" />
                  <YAxis stroke="#4f46e5" fontSize={10} fontWeight="bold" allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e1b4b", borderRadius: "12px", border: "0", color: "#fff" }}
                  />
                  <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} maxBarSize={45}>
                    {blockData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[(index + 5) % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 4: District Representation */}
          <div className="bg-white border-2 border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
            <div className="pb-4 mb-4 border-b border-slate-100">
              <span className="block text-[9px] uppercase tracking-widest font-black text-indigo-500 mb-1">
                {lang === "en" ? "Territorial District Level" : "क्षेत्रीय भौगोलिक जिला विश्लेषण"}
              </span>
              <h3 className="text-xs font-extrabold text-indigo-950 uppercase">
                {lang === "en" ? "Home Districts Live Coverage" : "घर जिला आधारित लाइव कवरेज"}
              </h3>
            </div>

            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={districtData} margin={{ left: 5, right: 5, top: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} fontWeight="bold" />
                  <YAxis stroke="#4f46e5" fontSize={10} fontWeight="bold" allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e1b4b", borderRadius: "12px", border: "0", color: "#fff" }}
                  />
                  <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]} maxBarSize={45}>
                    {districtData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[(index + 1) % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
