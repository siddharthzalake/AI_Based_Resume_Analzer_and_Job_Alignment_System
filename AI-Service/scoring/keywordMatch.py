import re
from sklearn.feature_extraction.text import TfidfVectorizer
from nltk.stem import WordNetLemmatizer

lemmatizer = WordNetLemmatizer()


# Preprocess Text

def preprocess(text):
    if not text:
        return ""

    text = text.lower()

    # Remove punctuation and numbers
    text = re.sub(r'[^a-z\s]', ' ', text)

    words = text.split()

    # Lemmatize words
    words = [lemmatizer.lemmatize(w) for w in words if len(w) > 2]

    return " ".join(words)



# Extract Keywords from Text

def extract_keywords(text, top_n=30):
    text = preprocess(text)

    if not text.strip():
        return set()

    vectorizer = TfidfVectorizer(
        stop_words="english",
        max_features=top_n,
        ngram_range=(1, 2)  
    )

    tfidf = vectorizer.fit_transform([text])

    keywords = vectorizer.get_feature_names_out()

    return set(keywords)



# Keyword Match Score

def keyword_match_score(resume_text, job_description):

    jd_keywords = extract_keywords(job_description, 30)
    resume_keywords = extract_keywords(resume_text, 50)

    if not jd_keywords:
        return 0

    matched = jd_keywords.intersection(resume_keywords)

    score = len(matched) / len(jd_keywords)

    return round(score * 100, 2)