
import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  RefreshCcw, 
  History as HistoryIcon, 
  Filter, 
  Search,
  Calendar as CalendarIcon,
  ChevronRight,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { AttendanceRecord } from '../types';

const CLASSROOM_LOC = {
  lat: 0,
  lng: 0,
  name: "Block A - Room 102"
};

const RANGE_LIMIT_METERS = 20;

const MOCK_HISTORY: AttendanceRecord[] = [
  { date: '2023-11-15', status: 'Present', subject: 'Data Structures & Algorithms', subjectCode: 'CS301', timestamp: '09:05 AM' },
  { date: '2023-11-14', status: 'Absent', subject: 'Operating Systems', subjectCode: 'CS302', timestamp: '-' },
  { date: '2023-11-13', status: 'OD', subject: 'Computer Networks', subjectCode: 'CS304', timestamp: '11:15 AM' },
  { date: '2023-11-12', status: 'Present', subject: 'Database Management Systems', subjectCode: 'CS305', timestamp: '02:00 PM' },
  { date: '2023-11-11', status: 'Present', subject: 'Software Engineering', subjectCode: 'CS303', timestamp: '10:30 AM' },
  { date: '2023-11-10', status: 'Absent', subject: 'Machine Learning', subjectCode: 'AI401', timestamp: '-' },
  { date: '2023-11-09', status: 'OD', subject: 'Cyber Security Seminar', subjectCode: 'SEC101', timestamp: '09:45 AM' },
];

export default function AttendanceModule() {
  const [activeTab, setActiveTab] = useState<'check-in' | 'history'>('check-in');
  const [location, setLocation] = useState<GeolocationPosition | null>(null);
  const [isWithinRange, setIsWithinRange] = useState<boolean | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);

  // History Filters
  const [statusFilter, setStatusFilter] = useState<'All' | 'Present' | 'Absent' | 'OD'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHistory = useMemo(() => {
    return MOCK_HISTORY.filter(record => {
      const matchesStatus = statusFilter === 'All' || record.status === statusFilter;
      const lowerSearch = searchQuery.toLowerCase();
      const matchesSearch = 
        record.subject.toLowerCase().includes(lowerSearch) || 
        record.subjectCode.toLowerCase().includes(lowerSearch) ||
        record.date.includes(searchQuery);
      return matchesStatus && matchesSearch;
    });
  }, [statusFilter, searchQuery]);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; 
  };

  const checkLocation = () => {
    setIsChecking(true);
    setError(null);
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setIsChecking(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation(position);
        const targetLat = CLASSROOM_LOC.lat === 0 ? position.coords.latitude : CLASSROOM_LOC.lat;
        const targetLng = CLASSROOM_LOC.lng === 0 ? position.coords.longitude : CLASSROOM_LOC.lng;
        const dist = calculateDistance(position.coords.latitude, position.coords.longitude, targetLat, targetLng);
        setDistance(dist);
        setIsWithinRange(dist <= RANGE_LIMIT_METERS);
        setIsChecking(false);
      },
      (err) => {
        setError("Location permission denied or unavailable.");
        setIsChecking(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleCheckIn = () => {
    if (isWithinRange) setCheckedIn(true);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Tabs */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit mx-auto sm:mx-0">
        <button 
          onClick={() => setActiveTab('check-in')}
          className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'check-in' 
              ? 'bg-white text-indigo-600 shadow-sm' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <MapPin size={18} />
          <span>Daily Check-In</span>
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'history' 
              ? 'bg-white text-indigo-600 shadow-sm' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <HistoryIcon size={18} />
          <span>Attendance Log</span>
        </button>
      </div>

      {activeTab === 'check-in' ? (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center">
            <div className="inline-flex p-4 bg-indigo-50 text-indigo-600 rounded-full mb-6">
              <MapPin size={48} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Classroom Presence Check</h2>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">
              You must be within {RANGE_LIMIT_METERS}m of {CLASSROOM_LOC.name} to register your attendance.
            </p>

            {!location && !isChecking && !error && (
              <button 
                onClick={checkLocation}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center space-x-2"
              >
                <MapPin size={20} />
                <span>Verify My Location</span>
              </button>
            )}

            {isChecking && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <RefreshCcw size={40} className="animate-spin text-indigo-400" />
                </div>
                <p className="text-slate-400 font-medium">Getting GPS coordinates...</p>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center space-x-3 text-left">
                <AlertCircle size={24} />
                <div className="flex-1">
                  <p className="font-bold">Error Detected</p>
                  <p className="text-sm">{error}</p>
                </div>
                <button onClick={checkLocation} className="text-xs underline font-bold px-3 py-1 bg-white rounded-lg border border-red-100 shadow-sm hover:bg-red-50 transition-colors">Retry</button>
              </div>
            )}

            {location && !isChecking && !checkedIn && (
              <div className="space-y-6">
                <div className={`p-6 rounded-2xl flex flex-col items-center justify-center space-y-2 border-2 ${
                  isWithinRange ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-700'
                }`}>
                  {isWithinRange ? <CheckCircle size={32} /> : <XCircle size={32} />}
                  <p className="text-lg font-bold">
                    {isWithinRange ? 'Within Classroom Range' : 'Out of Range'}
                  </p>
                  <p className="text-sm opacity-80">
                    Distance: {distance?.toFixed(1)}m from center
                  </p>
                </div>

                <button 
                  onClick={handleCheckIn}
                  disabled={!isWithinRange}
                  className={`w-full py-4 rounded-2xl font-bold transition-all ${
                    isWithinRange 
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100' 
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Check-In Now
                </button>
                <button onClick={checkLocation} className="text-slate-400 text-sm hover:underline font-medium">Re-verify Location</button>
              </div>
            )}

            {checkedIn && (
              <div className="p-8 bg-emerald-500 text-white rounded-3xl animate-in zoom-in duration-300">
                <CheckCircle size={64} className="mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-1">Checked In Successfully!</h3>
                <p className="opacity-90">Your attendance for {new Date().toLocaleDateString()} has been recorded.</p>
              </div>
            )}
          </div>

          <div className="bg-slate-100 p-6 rounded-3xl border border-slate-200">
            <h4 className="font-bold text-slate-700 mb-4 flex items-center">
              <AlertCircle size={18} className="mr-2" />
              Proximity Rules
            </h4>
            <ul className="text-sm text-slate-500 space-y-2 list-disc list-inside">
              <li>Attendance is only possible during scheduled lecture hours.</li>
              <li>Ensure High Accuracy GPS is enabled on your device.</li>
              <li>Proxies are strictly monitored via hardware ID validation.</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* History Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500" size={18} />
              <input 
                type="text" 
                placeholder="Search subject, course ID, or date..." 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="relative flex items-center">
              <Filter className="absolute left-3 text-slate-400" size={18} />
              <select 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-100 appearance-none transition-all cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
              >
                <option value="All">All Statuses</option>
                <option value="Present">Present Only</option>
                <option value="Absent">Absent Only</option>
                <option value="OD">OD Only</option>
              </select>
            </div>

            <div className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-50 text-indigo-700 rounded-xl border border-indigo-100">
              <CalendarIcon size={18} />
              <span className="text-sm font-bold truncate">Semester Overview: Fall 2023</span>
            </div>
          </div>

          {/* History Table/List */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Course Information</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredHistory.map((record, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-700">{record.date}</span>
                          <span className="text-xs text-slate-400">{record.timestamp}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-slate-800 leading-tight">{record.subject}</span>
                          <div className="flex items-center space-x-1 mt-1">
                            <BookOpen size={10} className="text-indigo-400" />
                            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-wider bg-indigo-50 px-1.5 py-0.5 rounded">
                              {record.subjectCode}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                          record.status === 'Present' ? 'bg-emerald-100 text-emerald-600' :
                          record.status === 'Absent' ? 'bg-rose-100 text-rose-600' :
                          'bg-amber-100 text-amber-600'
                        }`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="inline-flex items-center space-x-1 text-slate-300 hover:text-indigo-600 group-hover:translate-x-1 transition-all opacity-0 group-hover:opacity-100">
                          <span className="text-xs font-bold uppercase">View</span>
                          <ChevronRight size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredHistory.length === 0 && (
              <div className="p-16 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200">
                  <Search size={40} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">No matches for your search</h3>
                <p className="text-slate-400 text-sm max-w-xs mx-auto">Try checking your spelling or using the Course ID filter instead.</p>
                <button 
                  onClick={() => {setSearchQuery(''); setStatusFilter('All');}}
                  className="mt-6 text-indigo-600 font-bold text-sm hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}

            <div className="bg-slate-50 p-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 text-xs font-medium text-slate-500">
              <p>Showing {filteredHistory.length} academic entries</p>
              <div className="flex items-center space-x-2">
                <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:text-indigo-600 transition-all disabled:opacity-50" disabled>Previous</button>
                <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:text-indigo-600 transition-all">Next</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
