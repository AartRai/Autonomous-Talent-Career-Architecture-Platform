# Synapse AI Skill Matching — Starter Deliverable

## What this does
This standalone Python module compares student skills with the skills required by a job. It returns:
- a match percentage
- matched skills
- missing skills (skill gaps)
- counts used to calculate the score

This is a **rule-based baseline**, not a trained machine-learning model. It is useful as a working first milestone while the frontend/backend teams continue their work. A later milestone can add semantic embeddings and expose the function through the team's FastAPI backend.

## Run the demo
From this folder, run:

```bash
python -m ai.demo
```

No third-party Python packages are required.

## Run tests
```bash
python -m unittest discover -s tests -v
```

## Example
Student skills: `Python, SQL, Machine Learning, JavaScript`
Job requirements: `Python, SQL, NLP, ML`

The module normalizes `ML` to `Machine Learning`, matches Python, SQL and ML/Machine Learning, and reports NLP as a gap. The percentage is calculated as:

`matched required skills / total required skills * 100`

## Current limitations
- Skill aliases are manually defined and limited.
- The score treats every required skill equally.
- It does not yet use embeddings, a trained model, real job-market data, or the Synapse backend API.
- Do not describe this baseline as a trained AI model. Describe it as the first working skill-matching baseline, ready for future semantic matching and API integration.

## Planned next steps
1. Agree on API request/response formats with the backend team.
2. Add a FastAPI endpoint that calls `analyze_skill_match`.
3. Add semantic similarity using sentence embeddings and evaluate it against test examples.
4. Replace frontend mock data with backend API responses when the backend is available.
