from pydantic import BaseModel


class StatTrend(BaseModel):
    value: str
    label: str
    isPositive: bool | None


class RecruiterStat(BaseModel):
    id: str
    title: str
    value: str
    icon: str
    tone: str
    trend: StatTrend


class RecentCandidateItem(BaseModel):
    id: str
    name: str
    initials: str
    role: str
    experience: str
    skills: list[str]
    matchScore: int
    shortlisted: bool
    tone: str


class RecentJobItem(BaseModel):
    id: str
    title: str
    department: str
    employmentType: str
    applicationsCount: int
    newApplications: int
    status: str
    postedDate: str


class SkillDistributionItem(BaseModel):
    id: str
    skill: str
    candidateCount: int
    percentage: int
    tone: str
