
import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { TrendingUp, Users, Calendar, Sparkles } from 'lucide-react';
import { StudentProfile } from '../types';
import { getAttendanceInsights } from '../services/geminiService';

const ATTENDANCE_DATA = [
  { name: 'Mon', attendance: 85 },
  { name: 'Tue', attendance: 90 },
  { name: 'Wed', attendance: 75 },
  { name: 'Thu', attendance: 95 },
  { name: 'Fri', attendance: 80 },
];

const PIE_DATA = [
  { name: 'Present', value: 85, color: '#6366f1' },
  { name: 'Absent', value: 10, color: '#f43f5e' },
  { name: 'OD', value: 5, color: '#10b981' },
];

export default function Dashboard({ profile }: { profile: StudentProfile }) {
  const [insights, setInsights] = useState<string>('Loading AI insights...');
  const currentAttendance = 85;

  useEffect(() => {
    const fetchInsights = async () => {
      const result = await getAttendanceInsights(currentAttendance);
      setInsights(result);
    };
    fetchInsights();
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="col-span-1 md:col-span-2 bg-indigo-600 rounded-2xl p-8 text-white flex flex-col justify-between shadow-lg shadow-indigo-200">
          <div>
            <h2 className="text-3xl font-bold mb-2">Welcome back, {profile.name}!</h2>
            <p className="text-indigo-100 opacity-90 max-w-md">Your enrollment is active for the current semester. You have maintained a healthy attendance record this week.</p>
          </div>
          <div className="mt-8 flex space-x-4">
            <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm">
              <p className="text-xs uppercase font-bold tracking-wider opacity-70">Current Code</p>
              <p className="text-xl font-mono font-bold">{profile.studentCode}</p>
            </div>
            <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm">
              <p className="text-xs uppercase font-bold tracking-wider opacity-70">Rank</p>
              <p className="text-xl font-bold">#12 in Class</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <TrendingUp size={24} />
            </div>
            <span className="text-emerald-500 font-bold text-sm">+2.4%</span>
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Overall Attendance</p>
            <h3 className="text-2xl font-bold text-slate-800">{currentAttendance}%</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Users size={24} />
            </div>
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Classroom Strength</p>
            <h3 className="text-2xl font-bold text-slate-800">58 Students</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">Weekly Performance</h3>
            <select className="bg-slate-50 border border-slate-200 text-sm p-2 rounded-lg outline-none">
              <option>Last 7 Days</option>
              <option>Last Month</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ATTENDANCE_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                />
                <Bar dataKey="attendance" radius={[4, 4, 0, 0]}>
                  {ATTENDANCE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 3 ? '#6366f1' : '#cbd5e1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insights Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center space-x-2 text-indigo-600 mb-4">
            <Sparkles size={20} />
            <h3 className="text-lg font-bold">EduAI Insights</h3>
          </div>
          <div className="bg-indigo-50/50 p-4 rounded-xl mb-6">
            <p className="text-sm text-slate-700 leading-relaxed italic">
              "{insights}"
            </p>
          </div>
          <div className="h-40 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={PIE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {PIE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            {PIE_DATA.map((item) => (
              <div key={item.name} className="text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase">{item.name}</p>
                <p className="text-sm font-bold" style={{ color: item.color }}>{item.value}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
