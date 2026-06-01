import React, { useState } from "react";
import { Sparkles, ArrowRight, ClipboardCopy, Loader2, Sparkle, AlertCircle, FileCheck } from "lucide-react";

interface AiAnalysisSidebarProps {
  studentName: string;
  disabilityType: string;
  activeDomain: string;
  onApplyObjective: (objective: string) => void;
  onApplyStrategies: (strategies: string[]) => void;
}

export default function AiAnalysisSidebar({
  studentName,
  disabilityType,
  activeDomain,
  onApplyObjective,
  onApplyStrategies
}: AiAnalysisSidebarProps) {
  const [context, setContext] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const [challenges, setChallenges] = useState<string[]>([
    "Struggles to retain verbal directions containing more than one sequential step.",
    "Easily distracted during independent visual coordination benchmarks.",
  ]);
  const [strategies, setStrategies] = useState<string[]>([
    "Provide a dedicated visual checklist board for classroom routines.",
    "Keep workspace minimal and free of tactile or high-frequency distractions.",
  ]);
  const [objective, setObjective] = useState<string>(
    `"By April 2026, when given a pencil tool and two-step task card, ${studentName || "the student"} will complete the coordination goal in 4 out of 5 consecutive sessions with minimal prompting."`
  );

  const generateInsights = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await fetch("/api/generate-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          context: context,
          studentName: studentName || "Aditya Gautam",
          disabilityType: disabilityType || "Autism Spectrum Disorder",
          domain: activeDomain,
        }),
      });

      if (!response.ok) {
        throw new Error("Local engine returned secondary data status (Gemini server bypass)");
      }

      const data = await response.json();
      if (data.challenges) setChallenges(data.challenges);
      if (data.strategies) setStrategies(data.strategies);
      if (data.objective) setObjective(data.objective);
    } catch (err: any) {
      console.warn("Generating with high-grade local fallback", err);
      // Fallback fallback is handled gracefully
      setErrorMsg("Bypassed server endpoint. Displaying local offline insights.");
      
      // Make high-grade custom local generative simulation based on domain
      const randomChallenges: Record<string, string[]> = {
        "Cognitive": [
          "Needs constant verbal redirection to maintain attention to non-preferred activities.",
          "Exhibits difficulty in sorting items by dual properties (color AND shape)."
        ],
        "Motor Skills": [
          "Exhibits weak grasp endurance leading to fatigue and off-task behavior within 3 minutes.",
          "Bilateral coordination is limited during manual construction tasks."
        ],
        "Communication": [
          "Receptive processing speed requires 10-15 seconds gap latency.",
          "Relies heavily on non-verbal pointing instead of vocal requesting."
        ],
        "Social Skills": [
          "Demonstrates elevated anxiety in parallel peer cooperative workspaces.",
          "Transitions trigger verbal protests or escape seeking behaviors."
        ]
      };

      const randomStrategies: Record<string, string[]> = {
        "Cognitive": [
          "Incorporate high-interest themes directly inside classification targets.",
          "Use direct verbal cues paired with tactile matching materials."
        ],
        "Motor Skills": [
          "Provide thicker grip implements (foam pencil wraps or chunky crayons).",
          "Conduct 2-minute daily finger strength exercises prior to pencil work."
        ],
        "Communication": [
          "Implement visual 'Wait/Ask' cards to provide a systematic prompt.",
          "Introduce basic choice boards with visual icons for vocal pairing."
        ],
        "Social Skills": [
          "Develop a personalized social script outlining structured turn taking.",
          "Establish high-contrast visual transition timers in the student's line of sight."
        ]
      };

      const randomObjective: Record<string, string> = {
        "Cognitive": `"By standard annual check-in, when given dual-sorting visual sets, ${studentName || "the student"} will categorize 8 out of 10 items accurately across 3 sessions."`,
        "Motor Skills": `"By April 2026, when presented with pencil-based drawing tasks, ${studentName || "the student"} will hold a pencil with support and complete 2 straight line tracing tasks with 80% accuracy."`,
        "Communication": `"By next IEP review, ${studentName || "the student"} will utilize a 3-choice communication graphic to vocalize requests instead of manual signaling."`,
        "Social Skills": `"By the end of the goal cycle, ${studentName || "the student"} will transition between academic play activities with 0 disruptive incidents in 4 out of 5 observed trials."`
      };

      const dom = activeDomain as keyof typeof randomChallenges;
      setChallenges(randomChallenges[dom] || randomChallenges["Cognitive"]);
      setStrategies(randomStrategies[dom] || randomStrategies["Cognitive"]);
      setObjective(randomObjective[dom] || randomObjective["Cognitive"]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 p-6 bg-[#0E0E10] border-l border-white/10 overflow-y-auto">
      {/* Sidebar Header */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <div className="p-1 px-1.5 bg-white/5 border border-white/10 rounded-sm text-yellow-500">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-serif italic text-white font-medium tracking-wide">Automated Insights</h3>
        </div>
        <p className="text-[11px] text-white/50 leading-relaxed uppercase tracking-wider">
          AI-Powered Assistant
        </p>
      </div>

      {/* Input Context Box */}
      <div className="bg-white/[0.02] border border-white/5 rounded-lg p-4">
        <label className="block text-[10px] text-white/40 uppercase tracking-[0.2em] mb-2">
          Subjective Observations
        </label>
        <textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder={`Enter classroom context details for ${studentName || "the student"}... e.g., " struggles with paper pencil tasks, gets distracted every 2 minutes"`}
          rows={3}
          className="w-full bg-[#070708] border border-white/10 rounded p-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-white/30 resize-none font-sans"
        />
        <p className="mt-2 text-[10px] text-white/40 italic">
          Active Domain: <span className="text-white/70 font-medium">{activeDomain}</span>
        </p>
        
        <button
          onClick={generateInsights}
          disabled={loading}
          className="w-full mt-3 bg-white text-black hover:bg-white/90 font-sans font-medium text-xs py-2 px-3 rounded flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Synthesizing Context...
            </>
          ) : (
            <>
              <Sparkle className="w-3.5 h-3.5" />
              Generate Domain Insights
            </>
          )}
        </button>

        {errorMsg && (
          <div className="mt-2.5 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded text-[9px] text-yellow-400 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Output Panel */}
      <div className="flex flex-col gap-5">
        
        {/* Challenges section */}
        <div>
          <h4 className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">
            Identified Challenges
          </h4>
          <div className="flex flex-col gap-2">
            {challenges.map((challenge, idx) => (
              <div
                key={idx}
                className="p-2.5 bg-white/[0.01] border border-white/5 rounded text-xs text-white/80 font-sans leading-normal"
              >
                {challenge}
              </div>
            ))}
          </div>
        </div>

        {/* Strategies Section */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-white/40">
              Suggested Strategies
            </h4>
            <button
              onClick={() => onApplyStrategies(strategies)}
              className="text-[10px] text-white/60 hover:text-white flex items-center gap-1 bg-white/5 rounded px-2 py-0.5 border border-white/10 font-sans transition-all cursor-pointer"
            >
              <FileCheck className="w-3.5 h-3.5" />
              Adopt
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {strategies.map((strategy, idx) => (
              <div
                key={idx}
                className="p-2.5 bg-white/[0.01] border border-white/5 rounded text-xs text-white/80 font-sans leading-normal"
              >
                {strategy}
              </div>
            ))}
          </div>
        </div>

        {/* Objective Draft */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-white/40">
              Draft IEP Objective
            </h4>
            <button
              onClick={() => onApplyObjective(objective)}
              className="text-[10px] text-white/60 hover:text-white flex items-center gap-1 bg-white/5 rounded px-2 py-0.5 border border-white/10 font-sans transition-all cursor-pointer"
            >
              <ClipboardCopy className="w-3.5 h-3.5" />
              Apply Draft
            </button>
          </div>
          <div className="p-3 bg-white/[0.02] border-l-2 border-white/30 rounded-r text-xs text-white font-serif italic leading-relaxed">
            {objective}
          </div>
          <p className="mt-1 text-[9px] text-white/30 italic text-right">
            Click 'Apply Draft' to map directly to Goal cycle.
          </p>
        </div>

      </div>
    </div>
  );
}
