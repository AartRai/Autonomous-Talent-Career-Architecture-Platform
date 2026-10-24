import unittest
from ai.skill_matcher import analyze_skill_match


class SkillMatcherTests(unittest.TestCase):
    def test_exact_overlap_and_missing_skills(self):
        result = analyze_skill_match(["Python", "SQL"], ["Python", "SQL", "NLP"])
        self.assertEqual(result["match_percentage"], 67)
        self.assertEqual(result["matched_skills"], ["Python", "SQL"])
        self.assertEqual(result["missing_skills"], ["NLP"])

    def test_aliases_match(self):
        result = analyze_skill_match(["ML", "Natural Language Processing"], ["Machine Learning", "NLP"])
        self.assertEqual(result["match_percentage"], 100)
        self.assertEqual(result["missing_skills"], [])

    def test_empty_requirements(self):
        result = analyze_skill_match(["Python"], [])
        self.assertEqual(result["match_percentage"], 0)
        self.assertEqual(result["required_count"], 0)


if __name__ == "__main__":
    unittest.main()
