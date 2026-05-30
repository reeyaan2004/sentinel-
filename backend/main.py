from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from pydantic import BaseModel

load_dotenv()

print(os.getenv("GEMINI_API_KEY"))

app = FastAPI(title="Sentinel API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Chrome extensions need this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TestRequest(BaseModel):
    text: str

@app.post("/test")
async def test(req: TestRequest):
    return {
        "received_text": req.text,
        "length": len(req.text),
        "status": "backend is working"
    }

@app.get("/health")
async def health():
    return {"status": "ok", "service": "sentinel"}

class AnalyzeRequest(BaseModel):
    text: str

@app.post("/analyze")
async def analyze(req: AnalyzeRequest):
    text = req.text.lower()

    score = 0
    verdict = "SAFE"
    red_flags = []

    if "urgent" in text:
        score += 50
        red_flags.append("Urgency detected")

    if "verify" in text:
        score += 40
        red_flags.append("Verification request")

    if "click" in text:
        score += 30
        red_flags.append("Suspicious link prompt")

    if score >= 60:
        verdict = "DANGEROUS"
    elif score >= 30:
        verdict = "SUSPICIOUS"

    return {
        "scan_id": "local-test-123",
        "score": min(score, 100),
        "verdict": verdict,
        "vectors": {
            "urgency_manipulation": 9 if "urgent" in text else 1,
            "domain_spoofing": 3,
            "credential_harvesting": 7 if "verify" in text else 1,
            "impersonation": 3,
            "emotional_manipulation": 4,
            "url_anomalies": 5 if "click" in text else 1,
            "attack_patterns": 4,
            "linguistic_tells": 3,
        },
        "red_flags": red_flags,
        "summary": "Rule-based analysis of your message.",
        "eli5": "This message may be trying to trick you.",
        "action_plan": ["Do not click links", "Report as suspicious"] if verdict != "SAFE" else []
    }