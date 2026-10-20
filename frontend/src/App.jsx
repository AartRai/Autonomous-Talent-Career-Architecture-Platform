import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import FeaturesPage from './pages/FeaturesPage.jsx'
import RecruiterLayout from './components/recruiter/RecruiterLayout.jsx'
import RecruiterDashboardPage from './pages/recruiter/RecruiterDashboardPage.jsx'
import PostJobPage from './pages/recruiter/PostJobPage.jsx'
import TalentSearchPage from './pages/recruiter/TalentSearchPage.jsx'
import CandidateProfilesPage from './pages/recruiter/CandidateProfilesPage.jsx'
import ApplicationsPage from './pages/recruiter/ApplicationsPage.jsx'
import PlaceholderSection from './pages/recruiter/PlaceholderSection.jsx'
import StudentLayout from './components/student/StudentLayout.jsx'
import StudentDashboardPage from './pages/student/StudentDashboardPage.jsx'
import StudentProfilePage from './pages/student/StudentProfilePage.jsx'
import StudentSkillAnalysisPage from './pages/student/StudentSkillAnalysisPage.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/features" element={<FeaturesPage />} />

      <Route path="/student" element={<StudentLayout />}>
        <Route index element={<StudentDashboardPage />} />
        <Route path="profile" element={<StudentProfilePage />} />
        <Route path="skill-analysis" element={<StudentSkillAnalysisPage />} />
      </Route>

      {/* Recruiter Workspace Routes */}
      <Route path="/recruiter" element={<RecruiterLayout />}>
        <Route index element={<RecruiterDashboardPage />} />
        <Route path="post-job" element={<PostJobPage />} />
        <Route path="talent-search" element={<TalentSearchPage />} />
        <Route path="candidates" element={<CandidateProfilesPage />} />
        <Route path="applications" element={<ApplicationsPage />} />
        <Route path="analytics" element={<PlaceholderSection title="Analytics & Reports" />} />
        <Route path="company" element={<PlaceholderSection title="Profile / Company Details" />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
