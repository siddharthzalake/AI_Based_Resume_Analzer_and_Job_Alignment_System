from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

_model = None


# Lazy Model Loader

def get_model():
    global _model
    if _model is None:
        _model = SentenceTransformer("all-MiniLM-L6-v2")
    return _model


# Semantic Similarity Function

def semantic_similarity(resume_text, job_description):

    if not resume_text or not job_description:
        return 0.0

    resume_text = resume_text.strip()
    job_description = job_description.strip()

    if len(resume_text) < 20 or len(job_description) < 20:
        return 0.0

    model = get_model()

    embeddings = model.encode(
        [resume_text, job_description],
        normalize_embeddings=True
    )

    similarity = cosine_similarity(
        [embeddings[0]],
        [embeddings[1]]
    )[0][0]

    return round(float(similarity) * 100, 2)