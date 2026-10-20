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
import AnalyticsPage from './pages/recruiter/AnalyticsPage.jsx'
import RecruiterProfilePage from './pages/recruiter/RecruiterProfilePage.jsx'
import FacultyLayout from './components/faculty/FacultyLayout.jsx'
import FacultyDashboardPage from './pages/faculty/FacultyDashboardPage.jsx'
import ResearchOpportunitiesPage from './pages/faculty/ResearchOpportunitiesPage.jsx'
import IndustrialTrainingFDPPage from './pages/faculty/IndustrialTrainingFDPPage.jsx'
import CollaborationRequestsPage from './pages/faculty/CollaborationRequestsPage.jsx'
import FacultyProfilePage from './pages/faculty/FacultyProfilePage.jsx'
import FacultyNotificationsPage from './pages/faculty/FacultyNotificationsPage.jsx'
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
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="company" element={<RecruiterProfilePage />} />
      </Route>

      {/* Faculty Workspace Routes */}
      <Route path="/faculty" element={<FacultyLayout />}>
        <Route index element={<FacultyDashboardPage />} />
        <Route path="opportunities" element={<ResearchOpportunitiesPage />} />
        <Route path="training" element={<IndustrialTrainingFDPPage />} />
        <Route path="collaborations" element={<CollaborationRequestsPage />} />
        <Route path="profile" element={<FacultyProfilePage />} />
        <Route path="notifications" element={<FacultyNotificationsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
