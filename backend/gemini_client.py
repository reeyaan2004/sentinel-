
import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.0-flash")

SYSTEM_PROMPT = """
You are a cybersecurity analyst.
Return ONLY valid JSON.

Return format:
{
  "score": number,
  "verdict": "SAFE" | "SUSPICIOUS" | "DANGEROUS",
  "vectors": {
    "urgency": 0-10,
    "spoofing": 0-10,
    "phishing": 0-10,
    "emotion": 0-10
  },
  "red_flags": [],
  "summary": "",
  "eli5": "",
  "action_plan": []
}
"""

def analyze_content(text: str):
    response = model.generate_content(
        SYSTEM_PROMPT + "\n\nTEXT:\n" + text
    )

    raw = response.text.strip()

    # safe parsing (VERY IMPORTANT)
    if "```" in raw:
        raw = raw.replace("```json", "").replace("```", "")

    return json.loads(raw)