"""Run a demo using sample Synapse student and job skills."""
import json
from ai.skill_matcher import analyze_skill_match

student_skills = ["Python", "SQL", "Machine Learning", "JavaScript"]
required_job_skills = ["Python", "SQL", "NLP", "ML"]

result = analyze_skill_match(student_skills, required_job_skills)

print("SYNAPSE — AI SKILL MATCHING DEMO")
print("=" * 36)
print("Student skills:", ", ".join(student_skills))
print("Job requirements:", ", ".join(required_job_skills))
print("\nAnalysis result:")
print(json.dumps(result, indent=2))
