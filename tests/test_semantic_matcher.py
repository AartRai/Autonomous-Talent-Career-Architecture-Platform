
import unittest

from ai.semantic_matcher import compare_skills


class SemanticMatcherTests(unittest.TestCase):

    
    def test_related_skill_phrases(self):
        student_skills = [
            "natural language processing",
            "Python programming",
        ]

        job_requirements = [
            "NLP",
            "Python",
        ]

        result = compare_skills(student_skills, job_requirements)

        matched_names = [
            item["skill"] for item in result["matched_skills"]
        ]

        self.assertIn("NLP", matched_names)
        self.assertIn("Python", matched_names)
        self.assertEqual(result["missing_skills"], [])
        self.assertEqual(result["match_percentage"], 100)


    def test_empty_requirements(self):
        result = compare_skills(["Python"], [])

        self.assertEqual(result["match_percentage"], 0)
        self.assertEqual(result["matched_skills"], [])
        self.assertEqual(result["missing_skills"], [])


if __name__ == "__main__":
    unittest.main()
