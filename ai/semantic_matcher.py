
"""Semantic skill matching for Synapse.

Uses pretrained sentence embeddings to compare skill meanings.
The first run downloads the model and requires internet access.
"""

from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity


def compare_skills(student_skills, required_skills):
    """Compare student skills with job requirements semantically."""

    if not required_skills:
        return {
            "match_percentage": 0,
            "matched_skills": [],
            "missing_skills": [],
        }

    model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

    student_embeddings = model.encode(student_skills)
    required_embeddings = model.encode(required_skills)

    similarities = cosine_similarity(
        required_embeddings, student_embeddings
    )

    matched_skills = []
    missing_skills = []

    for index, skill in enumerate(required_skills):
        best_score = (
            float(similarities[index].max())
            if len(student_skills) > 0
            else 0.0
        )

        if best_score >= 0.55:
            matched_skills.append({
                "skill": skill,
                "similarity": round(best_score, 3),
            })
        else:
            missing_skills.append(skill)

    percentage = round(
        len(matched_skills) / len(required_skills) * 100
    )

    return {
        "match_percentage": percentage,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
    }


if __name__ == "__main__":
    student = [
        "Python programming",
        "working with databases using SQL",
        "building machine learning models",
    ]

    job = [
        "Python",
        "SQL",
        "Machine Learning",
        "Natural Language Processing",
    ]

    print(compare_skills(student, job))
