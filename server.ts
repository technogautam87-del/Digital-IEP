import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded Gemini Client
let aiClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY is not defined in user secrets (Settings > Secrets)");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// API Route for IEP Insights Generation
app.post("/api/generate-insights", async (req, res) => {
  try {
    const { context, studentName, disabilityType, domain } = req.body;
    
    if (!context || context.trim() === "") {
       res.json({
        challenges: [
          "Needs further baseline notes to extract structured challenges.",
          "Difficulty initiating tasks independently."
        ],
        strategies: [
          "Provide task boarding and visual countdown boards for transitions.",
          "Use direct verbal cues paired with pictorial instructions representatively."
        ],
        objective: `"By [Target Date], when presented with structured school day transitions, ${studentName || "the student"} will utilize a visual timeline to independently initiate the next activity in 4 out of 5 observed challenges."`
      });
      return;
    }

    const ai = getGemini();
    const prompt = `Student Name: ${studentName || "The student"}\nDisability Type: ${disabilityType || "Not Specified"}\nDomain of Focus: ${domain || "Cognitive"}\nRaw Educator Input/Context: ${context}\n\nPlease analyze this student's context and generate:\n1. 2-3 specific, actionable Identified Challenges.\n2. 2-3 realistic research-backed Suggested Strategies.\n3. A professional, draft IEP Objective that starts with "By [Target Date], when presented with..." and describes measurable progress metrics.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert Special Education teacher and IEP coordinator. Analyze the student context and provide highly professional, positive, specific, and actionable student analysis items in JSON.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            challenges: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "A list of 2-3 student performance or focus challenges."
            },
            strategies: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "A list of 2-3 instructional or accommodation strategies."
            },
            objective: {
              type: Type.STRING,
              description: "A highly specific, draft measurable IEP goal/objective."
            }
          },
          required: ["challenges", "strategies", "objective"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Received empty response from Gemini API");
    }

    const parsedData = JSON.parse(text.trim());
    res.json(parsedData);
  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    // Return a structured error output that falls back gracefully on the client
    res.status(500).json({ 
      error: error.message || "Failed to generate insights with AI stream.",
      challenges: [
        "Difficulty completing task milestones consistently under distraction.",
        "Demonstrates receptive challenges in fast-paced instructions."
      ],
      strategies: [
        "Provide direct 1-on-1 visual cue card prompts.",
        "Break complex tasks down to atomic multi-step boards."
      ],
      objective: `"By [Target Date], when presented with active group instructions, ${req.body.studentName || "the student"} will check in with the educator to verify step completion in 4 out of 5 daily trials."`
    });
  }
});

// Setup Vite Dev server or static files hosting
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server loaded on http://0.0.0.0:${PORT}`);
  });
}

startServer();
