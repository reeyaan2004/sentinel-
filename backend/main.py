from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(title="Sentinel API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Chrome extensions need this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from pydantic import BaseModel

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
        "score": score,
        "verdict": verdict,
        "red_flags": red_flags,
        "summary": "Temporary rule-based analysis",
        "eli5": "This message may be trying to trick you.",
        "action_plan": ["Do not click links"] if verdict == "DANGEROUS" else []
    }