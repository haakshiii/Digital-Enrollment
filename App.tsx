
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  MapPin, 
  FileText, 
  UserCircle, 
  Bell, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import AttendanceModule from './components/AttendanceModule';
import ODPassModule from './components/ODPassModule';
import ProfileModule from './components/ProfileModule';
import { ViewType, StudentProfile } from './types';

const INITIAL_PROFILE: StudentProfile = {
  name: "Aditya Kumar",
  rollNo: "2023CS1042",
  email: "aditya.k@edu.com",
  phone: "9876543210",
  parentName: "Rajesh Kumar",
  parentPhone: "9876543211",
  department: "Computer Science and Engineering (CSE)",
  studentCode: "STUD-778X"
};

export default function App() {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [profile, setProfile] = useState<StudentProfile>(INITIAL_PROFILE);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const NavItem = ({ id, icon: Icon, label }: { id: ViewType, icon: any, label: string }) => (
    <button
      onClick={() => {
        setActiveView(id);
        setIsSidebarOpen(false);
      }}
      className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-all ${
        activeView === id 
          ? 'bg-indigo-600 text-white shadow-md' 
          : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-600'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 z-30 transition-transform duration-300 lg:static lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6">
          <div className="flex items-center space-x-2 text-indigo-600 mb-8">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <div className="w-6 h-6 border-2 border-white rounded-sm flex items-center justify-center font-bold text-white text-xs">D</div>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">Digital Enrollment</span>
          </div>

          <nav className="space-y-2">
            <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
            <NavItem id="attendance" icon={MapPin} label="Attendance" />
            <NavItem id="od-pass" icon={FileText} label="OD Passes" />
            <NavItem id="profile" icon={UserCircle} label="Profile" />
          </nav>
        </div>

        <div className="absolute bottom-0 w-full p-6 border-t border-slate-100">
          <button className="flex items-center space-x-3 text-slate-500 hover:text-red-600 w-full transition-colors">
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        {/* Header */}
        <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200 p-4 z-10">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-md"
              >
                <Menu size={24} />
              </button>
              <h1 className="text-xl font-bold text-slate-800 capitalize">
                {activeView.replace('-', ' ')}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="hidden sm:flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">{profile.name}</p>
                  <p className="text-xs text-slate-500">{profile.rollNo}</p>
                </div>
                <img 
                  src={`https://ui-avatars.com/api/?name=${profile.name}&background=6366f1&color=fff`} 
                  alt="User" 
                  className="w-10 h-10 rounded-full ring-2 ring-indigo-50"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6 max-w-7xl mx-auto">
          {activeView === 'dashboard' && <Dashboard profile={profile} />}
          {activeView === 'attendance' && <AttendanceModule />}
          {activeView === 'od-pass' && <ODPassModule />}
          {activeView === 'profile' && <ProfileModule profile={profile} setProfile={setProfile} />}
        </div>
      </main>
    </div>
  );
}