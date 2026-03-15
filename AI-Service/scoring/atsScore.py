import re

def ats_score(resume_text):

    if not resume_text:
        return 0

    score = 0
    text = resume_text.lower()

   
    # Skills Section Detection
  
    skill_headers = [
        "skills",
        "technical skills",
        "core skills",
        "expertise"
    ]

    if any(h in text for h in skill_headers):
        score += 20

   
    # Experience / Projects Section
  
    exp_headers = [
        "experience",
        "work experience",
        "professional experience",
        "projects",
        "project experience"
    ]

    if any(h in text for h in exp_headers):
        score += 20


    # Bullet Points Detection
   
    bullet_pattern = r'(^|\n)\s*[-•*]'
    if re.search(bullet_pattern, resume_text):
        score += 20

    
    # Resume Length (Flexible)
    
    word_count = len(resume_text.split())

    if 250 <= word_count <= 1000:
        score += 20

    
    # Action Verbs Detection
    
    verbs = [
        "developed", "built", "designed", "implemented",
        "created", "led", "managed", "improved",
        "optimized", "analyzed", "coordinated",
        "delivered", "engineered"
    ]

    if any(v in text for v in verbs):
        score += 20

    return min(score, 100)