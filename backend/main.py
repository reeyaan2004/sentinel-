import os
import json
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai

# ─────────────────────────────────────────────
# LOAD ENV
# ─────────────────────────────────────────────

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

print("RUNNING FILE:", os.path.abspath(__file__))

# ─────────────────────────────────────────────
# GEMINI CLIENT (NEW SDK)
# ─────────────────────────────────────────────

client = genai.Client(api_key=GEMINI_API_KEY)
MODEL = "gemini-2.5-flash"

for m in client.models.list():
    print(m.name)

if GEMINI_API_KEY:
    print(f"✓ Gemini configured. Key ends in: ...{GEMINI_API_KEY[-4:]}")
else:
    print("✗ WARNING: GEMINI_API_KEY not found!")

# ─────────────────────────────────────────────
# FASTAPI APP
# ─────────────────────────────────────────────

app = FastAPI(title="Sentinel API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────
# REQUEST MODEL
# ─────────────────────────────────────────────

class AnalyzeRequest(BaseModel):
    text: str

# ─────────────────────────────────────────────
# PROMPT
# ─────────────────────────────────────────────

PROMPT = """
You are a cybersecurity analyst specializing in phishing detection.

Return ONLY valid JSON in this exact format:

{
  "overall_score": 0-100,
  "verdict": "SAFE" | "SUSPICIOUS" | "DANGEROUS",
  "summary": "2-3 sentences explaining risk",
  "eli5_summary": "1 simple sentence explanation",
  "vectors": [
    {"name": "urgency_manipulation", "score": 0-100, "explanation": "string"},
    {"name": "domain_spoofing", "score": 0-100, "explanation": "string"},
    {"name": "credential_harvesting", "score": 0-100, "explanation": "string"},
    {"name": "impersonation_signals", "score": 0-100, "explanation": "string"},
    {"name": "emotional_manipulation", "score": 0-100, "explanation": "string"},
    {"name": "url_anomalies", "score": 0-100, "explanation": "string"},
    {"name": "attack_patterns", "score": 0-100, "explanation": "string"},
    {"name": "linguistic_tells", "score": 0-100, "explanation": "string"}
  ],
  "red_flags": ["string", "string", "string"],
  "recommendation": "1-2 sentences of advice"
}
"""

# ─────────────────────────────────────────────
# FALLBACK (IMPORTANT)
# ─────────────────────────────────────────────

FALLBACK = {
    "overall_score": 85,
    "verdict": "DANGEROUS",
    "summary": "This message shows strong phishing indicators including urgency and impersonation tactics.",
    "eli5_summary": "This looks like a scam trying to trick you into giving away personal information.",
    "vectors": [
        {"name": "urgency_manipulation", "score": 90, "explanation": "Creates pressure to act quickly"},
        {"name": "domain_spoofing", "score": 85, "explanation": "Suspicious or fake-looking domain"},
        {"name": "credential_harvesting", "score": 92, "explanation": "Attempts to extract sensitive data"},
        {"name": "impersonation_signals", "score": 88, "explanation": "Pretends to be trusted organization"},
        {"name": "emotional_manipulation", "score": 80, "explanation": "Uses fear or urgency"},
        {"name": "url_anomalies", "score": 86, "explanation": "URL does not match legitimate sources"},
        {"name": "attack_patterns", "score": 84, "explanation": "Matches known phishing patterns"},
        {"name": "linguistic_tells", "score": 70, "explanation": "Language feels unnatural or urgent"}
    ],
    "red_flags": [
        "Urgent deadline pressure",
        "Requests sensitive information",
        "Suspicious sender or domain"
    ],
    "recommendation": "Do not click any links or provide information. Report and delete the message."
}

# ─────────────────────────────────────────────
# HELPERS
# ─────────────────────────────────────────────

def safe_parse_json(text: str):
    text = text.strip()

    try:
        return json.loads(text)
    except:
        pass

    start = text.find("{")
    end = text.rfind("}") + 1

    if start != -1 and end != -1:
        try:
            return json.loads(text[start:end])
        except:
            pass

    raise ValueError("Invalid JSON from model")

# ─────────────────────────────────────────────
# ENDPOINTS
# ─────────────────────────────────────────────

@app.get("/health")
async def health():
    return {
        "status": "ok",
        "gemini_configured": bool(GEMINI_API_KEY)
    }


@app.post("/analyze")
async def analyze(req: AnalyzeRequest):
    text = req.text.strip()

    print("\n" + "=" * 50)
    print("Analyze request received")
    print(f"Text length: {len(text)}")
    print(f"Preview: {text[:120]}...")

    if not text:
        return {"error": "No text provided"}

    if len(text) < 10:
        return {"error": "Input too short"}

    if not GEMINI_API_KEY:
        print("No API key → fallback")
        return FALLBACK

    try:
        print("Calling Gemini...")

        full_prompt = f"""{PROMPT}

MESSAGE:
{text}
"""

        response = client.models.generate_content(
            model=MODEL,
            contents=full_prompt
        )

        raw = response.text.strip()
        print("Raw response preview:", raw[:200])

        result = safe_parse_json(raw)

        # validation
        required = [
            "overall_score", "verdict", "summary",
            "eli5_summary", "vectors", "red_flags", "recommendation"
        ]

        if any(k not in result for k in required):
            print("Missing keys → fallback")
            return FALLBACK

        result["overall_score"] = int(result["overall_score"])

        if result["verdict"] not in ["SAFE", "SUSPICIOUS", "DANGEROUS"]:
            return FALLBACK

        print("Parsed OK")
        print("Score:", result["overall_score"])
        print("Verdict:", result["verdict"])
        print("=" * 50)

        return result

    except Exception as e:
        print("Gemini error:", type(e).__name__, str(e))
        return FALLBACK