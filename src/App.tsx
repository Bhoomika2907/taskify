import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/loginpage';
import SignupPage from './pages/signuppage';
import Dashboard from './pages/Dashboard';
import MainLayout from './components/mainlayout';
import ProjectDetails from './pages/ProjectDetails'; // Ensure this file exists in src/pages/
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/signup" 
          element={!isAuthenticated ? <SignupPage /> : <Navigate to="/dashboard" />} 
        />

        {/* Private Routes (Wrapped in MainLayout) */}
        {isAuthenticated ? (
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            {/* 
               The path below matches the navigate(`/project/${project.id}`) 
               call in your ProjectCard component 
            */}
            <Route path="/project/:id" element={<ProjectDetails />} />
          </Route>
        ) : (
          // If not logged in, any attempt to access a route goes to login
          <Route path="*" element={<Navigate to="/login" />} />
        )}

        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;