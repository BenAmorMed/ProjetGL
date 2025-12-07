import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Home, Users, Calendar, BookOpen, User, LogOut, Menu, X } from 'lucide-react';
import { cn } from './lib/utils';
import AuthService from './services/auth.service';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AvailabilityPage from './pages/AvailabilityPage';
import AdminExamsPage from './pages/AdminExamsPage';
import AdminRoomsPage from './pages/AdminRoomsPage';
import AdminAssignmentsPage from './pages/AdminAssignmentsPage';
import TeacherAssignmentsPage from './pages/TeacherAssignmentsPage';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = AuthService.getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Layout component
const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const location = useLocation();
  const isAuthPage = ['/login', '/register', '/'].includes(location.pathname);
  const user = AuthService.getCurrentUser();

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-center" />
        {children}
      </div>
    );
  }

  // Define all navigation items
  const allNavItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, roles: ['ADMIN', 'TEACHER'] },
    { name: 'Availability', href: '/availability', icon: Calendar, roles: ['TEACHER'] },
    { name: 'Exams', href: '/admin/exams', icon: BookOpen, roles: ['ADMIN'] },
    { name: 'Rooms', href: '/admin/rooms', icon: Users, roles: ['ADMIN'] },
    { name: 'Assignments', href: '/admin/assignments', icon: User, roles: ['ADMIN'] },
    { name: 'My Assignments', href: '/teacher/assignments', icon: User, roles: ['TEACHER'] },
  ];

  // Filter items based on user role
  const navItems = allNavItems.filter(item =>
    !item.roles || (user && item.roles.includes(user.role))
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 lg:hidden z-10"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out z-20",
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-primary-700">Exam Scheduler</h1>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  location.pathname === item.href
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => {
                AuthService.logout();
                window.location.href = '/login';
              }}
              className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:pl-64">
        {/* Top navigation */}
        <header className="sticky top-0 z-10 bg-white shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <button
              type="button"
              className="lg:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex-1 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                {navItems.find(item => item.href === location.pathname)?.name || 'Dashboard'}
              </h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary-700" />
                  </div>
                  <div className="ml-2 flex flex-col">
                    <span className="text-sm font-medium text-gray-700">{user?.username || 'User'}</span>
                    <span className="text-xs text-gray-500 capitalize">{user?.role?.toLowerCase() || 'Guest'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            <Toaster position="top-right" />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'TEACHER']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/availability"
            element={
              <ProtectedRoute allowedRoles={['TEACHER']}>
                <AvailabilityPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/exams"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminExamsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/rooms"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminRoomsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/assignments"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminAssignmentsPage />
              </ProtectedRoute>
            }
          />

          {/* Teacher Routes */}
          <Route
            path="/teacher/assignments"
            element={
              <ProtectedRoute allowedRoles={['TEACHER']}>
                <TeacherAssignmentsPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
