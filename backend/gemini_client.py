
import os
import json
from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

model = "gemini-2.0-flash"

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
    response = client.models.generate_content(
        model=model,
        contents=SYSTEM_PROMPT + "\n\nTEXT:\n" + text
    )

    raw = response.text.strip()

    if "```" in raw:
        raw = raw.replace("```json", "").replace("```", "")

    return json.loads(raw)