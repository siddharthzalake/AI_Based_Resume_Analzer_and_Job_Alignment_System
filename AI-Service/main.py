from fastapi import FastAPI, File, UploadFile, Form
import pdfplumber
from docx import Document

from scoring.keywordMatch import keyword_match_score
from scoring.semanticSimilarity import semantic_similarity
from scoring.atsScore import ats_score
from llm.gemeni_service import get_gemini_feedback , get_gemini_feedback_resume_only
from utils.resume_sections import split_resume_sections

app = FastAPI()


# Extract text from file

def extract_text(file: UploadFile):

    if file.content_type == "application/pdf":
        text = ""
        with pdfplumber.open(file.file) as pdf:
            for page in pdf.pages:
                t = page.extract_text()
                if t:
                    text += t
        return text

    elif file.content_type in [
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ]:
        doc = Document(file.file)
        return "\n".join(p.text for p in doc.paragraphs)

    else:
        raise ValueError("Unsupported file type")



#  Resume + JD Analysis

@app.post("/analyze")
async def analyze_resume(
    resume: UploadFile = File(...),
    jobDescription: str = Form(...)
):

    try:

        resume_text = extract_text(resume)

        if not resume_text.strip():
            return {"success": False, "message": "No text extracted"}

        resume_text = resume_text[:5000]

        #  RULE SCORES 
        keyword_rule = keyword_match_score(
            resume_text,
            jobDescription
        )

        semantic_rule = semantic_similarity(
            resume_text,
            jobDescription
        )

        ats_rule = ats_score(resume_text)

        # LLM SCORES 
        llm_feedback = get_gemini_feedback(
            resume_text,
            jobDescription
        )

        keyword_llm = llm_feedback.get("keywordScoreLLM", 50)
        semantic_llm = llm_feedback.get("semanticScoreLLM", 50)
        ats_llm = llm_feedback.get("atsScoreLLM", 50)
        alignment_llm = llm_feedback.get("alignmentScoreLLM", 50)

        # HYBRID SCORES 
        keyword_final = round(
            0.2 * keyword_rule + 0.8 * keyword_llm,
            2
        )

        semantic_final = round(
            0.3 * semantic_rule + 0.7 * semantic_llm,
            2
        )

        ats_final = round(
            0.6 * ats_rule + 0.4 * ats_llm,
            2
        )

        #  FINAL ALIGNMENT 
        final_score = round(
            0.25 * keyword_final +
            0.35 * semantic_final +
            0.20 * ats_final +
            0.20 * alignment_llm,
            2
        )

        return {
            "success": True,
            "analysis": {

                "scores": {
                    "keywordMatch": keyword_final,
                    "semanticScore": semantic_final,
                    "atsScore": ats_final,
                    "alignmentScore": alignment_llm,
                    "overallScore": final_score
                },

                "missingSkills":
                    llm_feedback.get("missingSkillsLLM", []),

                "toneFeedback":
                    llm_feedback.get("toneFeedback", ""),

                "contentSuggestions":
                    llm_feedback.get("contentSuggestions", []),

                "atsSuggestions":
                    llm_feedback.get("atsSuggestions", [])
            }
        }

    except Exception as e:
        return {"success": False, "message": str(e)}
    
    
@app.post("/analyze-resume")
async def analyze_resume_only(
    resume: UploadFile = File(...)
):

    try:

        resume_text = extract_text(resume)

        if not resume_text.strip():
            return {"success": False, "message": "No text extracted"}

        resume_text = resume_text[:5000]

        ats_rule = ats_score(resume_text)

        llm_feedback = get_gemini_feedback_resume_only(
            resume_text
        )

        ats_llm = llm_feedback.get("atsScoreLLM", 50)
        alignment_llm = llm_feedback.get("alignmentScoreLLM", 50)

        ats_final = round(
            0.6 * ats_rule + 0.4 * ats_llm,
            2
        )

        final_score = round(
            0.6 * ats_final + 0.4 * alignment_llm,
            2
        )

        return {
            "success": True,
            "analysis": {

                "scores": {
                    "keywordMatch": None,
                    "semanticScore": None,
                    "atsScore": ats_final,
                    "alignmentScore": alignment_llm,
                    "overallScore": final_score
                },

                "missingSkills":
                    llm_feedback.get("missingSkillsLLM", []),

                "toneFeedback":
                    llm_feedback.get("toneFeedback", ""),

                "contentSuggestions":
                    llm_feedback.get("contentSuggestions", []),

                "atsSuggestions":
                    llm_feedback.get("atsSuggestions", [])
            }
        }

    except Exception as e:
        return {"success": False, "message": str(e)}
    
