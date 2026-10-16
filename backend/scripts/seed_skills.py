"""Seed the skills table with a curated vocabulary (~200 terms). Idempotent.

Run: python -m scripts.seed_skills
"""
import asyncio

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import async_session_factory
from app.models.skill import Skill, SkillSource

SKILL_DISPLAY_NAMES = [
    # Languages
    "Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "C", "Go", "Rust",
    "Kotlin", "Swift", "PHP", "Ruby", "SQL", "R", "MATLAB", "Scala", "Dart",
    "Perl", "Bash", "PowerShell", "Shell Scripting", "HTML", "CSS", "SAS",
    # Web & frameworks
    "React", "Angular", "Vue.js", "Next.js", "Django", "Flask", "FastAPI",
    "Node.js", "Express.js", "Spring Boot", "Ruby on Rails", "Laravel",
    "ASP.NET", "GraphQL", "REST API", "WebSockets", "Tailwind CSS", "Bootstrap",
    "Redux", "Sass", "Jest", "Cypress", "Selenium", "Flutter", "React Native",
    ".NET", "Electron", "WordPress", "Shopify", "Microservices",
    # Data & ML
    "Machine Learning", "Deep Learning", "Natural Language Processing",
    "Computer Vision", "Data Science", "Data Analysis", "Data Engineering",
    "Data Visualization", "Statistics", "Predictive Modeling",
    "Large Language Models", "PyTorch", "TensorFlow", "Keras", "scikit-learn",
    "Pandas", "NumPy", "SciPy", "Spark", "Hadoop", "Hive", "Kafka", "Airflow",
    "dbt", "Snowflake", "BigQuery", "Redshift", "Power BI", "Tableau", "Excel",
    "ETL", "Data Warehousing", "A/B Testing", "Recommendation Systems",
    "Time Series Analysis",
    # Cloud & DevOps
    "AWS", "Azure", "Google Cloud Platform", "Docker", "Kubernetes",
    "Terraform", "Ansible", "Jenkins", "Git", "GitHub", "GitLab", "CI/CD",
    "Linux", "Unix", "Nginx", "Apache", "Serverless", "Lambda", "EC2", "S3",
    "CloudFormation", "Helm", "Prometheus", "Grafana", "ELK Stack", "DevOps",
    "Site Reliability Engineering", "Networking", "DNS", "Load Balancing",
    # Databases
    "PostgreSQL", "MySQL", "SQLite", "MongoDB", "Redis", "Elasticsearch",
    "Cassandra", "DynamoDB", "Oracle Database", "SQL Server", "Neo4j",
    "Database Design", "Database Administration", "Query Optimization",
    "Data Modeling",
    # Security
    "Cybersecurity", "Penetration Testing", "Network Security",
    "Information Security", "OWASP", "Encryption", "Authentication", "OAuth",
    "Security Auditing", "Threat Modeling",
    # Business & professional
    "Project Management", "Agile", "Scrum", "Kanban", "Jira", "Confluence",
    "Product Management", "Business Analysis", "Strategic Planning",
    "Stakeholder Management", "Communication", "Leadership", "Teamwork",
    "Problem Solving", "Critical Thinking", "Time Management",
    "Presentation Skills", "Negotiation", "Customer Relationship Management",
    "Sales", "Marketing", "Digital Marketing", "SEO", "Content Marketing",
    "Social Media Marketing", "Market Research", "Financial Analysis",
    "Accounting", "Supply Chain Management", "Operations Management",
    # Design
    "UI Design", "UX Design", "Figma", "Adobe Photoshop", "Adobe Illustrator",
    "Sketch", "Prototyping", "Wireframing", "User Research", "Design Systems",
    # Additional
    "Mobile Development", "iOS Development", "Android Development",
    "Game Development", "Unity", "Unreal Engine", "Blockchain", "Solidity",
    "Web3", "Quantum Computing", "Arduino", "Embedded Systems", "Robotics",
    "Computer Networking", "Technical Writing",
]


async def seed(session: AsyncSession) -> int:
    existing = set(await session.scalars(select(Skill.name)))
    created = 0
    for display_name in SKILL_DISPLAY_NAMES:
        name = display_name.strip().lower()
        if not name or name in existing:
            continue
        session.add(Skill(name=name, display_name=display_name.strip(), source=SkillSource.seed))
        existing.add(name)
        created += 1
    await session.commit()
    return created


async def main() -> None:
    async with async_session_factory() as session:
        created = await seed(session)
    total = len(SKILL_DISPLAY_NAMES)
    print(f"Seeded {created} new skills ({total - created} already present, {total} total).")


if __name__ == "__main__":
    asyncio.run(main())
