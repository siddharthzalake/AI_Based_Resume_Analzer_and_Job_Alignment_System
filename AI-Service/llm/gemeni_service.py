import os
import json
import re
from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)

# Extract JSON safely

def extract_json(text):

    if not text:
        return None

    text = re.sub(r"```json|```", "", text).strip()

    match = re.search(r"\{.*\}", text, re.DOTALL)

    if match:
        try:
            return json.loads(match.group())
        except:
            return None

    return None



# Clamp score between 0–100

def clamp(x):
    try:
        x = float(x)
        return max(0, min(100, x))
    except:
        return 50


# Default response

def default_response():
    return {
        "keywordScoreLLM": 50,
        "semanticScoreLLM": 50,
        "atsScoreLLM": 50,
        "alignmentScoreLLM": 50,
        "missingSkillsLLM": [],
        "toneFeedback": "",
        "contentSuggestions": [],
        "atsSuggestions": []
    }



# Gemini Call

def call_gemini(prompt):

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        return response.text

    except Exception as e:
        print("Gemini API Error:", e)
        return None

#  Resume + JD Analysis

def get_gemini_feedback(resume_text, job_description):

    prompt = f"""
You are an expert ATS and hiring system.

Evaluate the resume against the job description.

Return ONLY valid JSON in this format:

{{
"keywordScoreLLM": number (0-100),
"semanticScoreLLM": number (0-100),
"atsScoreLLM": number (0-100),
"alignmentScoreLLM": number (0-100),

"missingSkillsLLM": ["skill1","skill2"],
"toneFeedback": "short paragraph",
"contentSuggestions": ["suggestion1","suggestion2"],
"atsSuggestions": ["suggestion1","suggestion2"]
}}

Scoring Guidelines:

keywordScoreLLM → how well resume skills match JD skills  
semanticScoreLLM → overall role relevance in meaning  
atsScoreLLM → resume quality for ATS (structure, clarity, action verbs)  
alignmentScoreLLM → overall suitability  

Resume:
{resume_text}

Job Description:
{job_description}
"""

    text = call_gemini(prompt)

    data = extract_json(text)

    if not data:
        return default_response()

    # Clamp numeric fields
    for key in [
        "keywordScoreLLM",
        "semanticScoreLLM",
        "atsScoreLLM",
        "alignmentScoreLLM"
    ]:
        data[key] = clamp(data.get(key, 50))

    return data


#  Resume Only Analysis

def get_gemini_feedback_resume_only(resume_text):

    prompt = f"""
You are an expert ATS evaluator.

Evaluate this resume.

Return ONLY valid JSON in this format:

{{
"atsScoreLLM": number (0-100),
"alignmentScoreLLM": number (0-100),

"missingSkillsLLM": ["skill1","skill2"],
"toneFeedback": "short paragraph",
"contentSuggestions": ["suggestion1","suggestion2"],
"atsSuggestions": ["suggestion1","suggestion2"]
}}

Resume:
{resume_text}
"""

    text = call_gemini(prompt)

    data = extract_json(text)

    if not data:
        return default_response()

    data["atsScoreLLM"] = clamp(data.get("atsScoreLLM", 50))
    data["alignmentScoreLLM"] = clamp(
        data.get("alignmentScoreLLM", 50)
    )

    return data