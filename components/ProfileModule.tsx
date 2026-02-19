
import React from 'react';
import { Save, User, Mail, Phone, Hash, Shield, Users, School } from 'lucide-react';
import { StudentProfile } from '../types';

interface Props {
  profile: StudentProfile;
  setProfile: (p: StudentProfile) => void;
}

const DEPARTMENTS = [
  "Computer Science and Engineering (CSE)",
  "Electronics and Communication Engineering (ECE)",
  "Electrical and Electronics Engineering (EEE)",
  "Information Technology (IT)",
  "Mechanical Engineering",
  "Computer Science and Technology",
  "Artificial Intelligence and Data Science (AI & DS)",
  "Computer Science and Engineering (IoT & Cyber Security including Block Chain Technology)",
  "Mechanical and Mechatronics Engineering (Additive Manufacturing)",
  "Computer Science and Design",
  "Civil Engineering",
  "Bio-Medical Engineering",
  "Food Technology"
];

export default function ProfileModule({ profile, setProfile }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const InfoCard = ({ icon: Icon, label, value, name, editable = true, type = "text" }: any) => (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-start space-x-4">
      <div className="p-3 bg-slate-50 text-slate-400 rounded-xl">
        <Icon size={20} />
      </div>
      <div className="flex-1 overflow-hidden">
        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">{label}</p>
        {editable ? (
          type === "select" ? (
            <select
              name={name}
              value={value}
              onChange={handleChange}
              className="w-full text-slate-800 font-bold outline-none focus:text-indigo-600 bg-transparent appearance-none cursor-pointer"
            >
              {DEPARTMENTS.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          ) : (
            <input 
              type="text" 
              name={name}
              value={value}
              onChange={handleChange}
              className="w-full text-slate-800 font-bold outline-none focus:text-indigo-600 bg-transparent border-none p-0 focus:ring-0"
            />
          )
        ) : (
          <p className="text-slate-800 font-bold truncate">{value}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="relative h-48 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl overflow-hidden shadow-lg">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute top-20 -left-10 w-48 h-48 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="absolute -bottom-16 left-8 flex items-end space-x-6">
          <div className="relative group">
            <img 
              src={`https://ui-avatars.com/api/?name=${profile.name}&size=128&background=6366f1&color=fff`} 
              className="w-32 h-32 rounded-3xl border-4 border-white shadow-xl"
              alt="Avatar"
            />
            <div className="absolute inset-0 bg-black/20 rounded-3xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
              <Save size={24} className="text-white" />
            </div>
          </div>
          <div className="mb-20">
            <h2 className="text-3xl font-black text-white">{profile.name}</h2>
            <p className="text-indigo-100 font-medium">{profile.department}</p>
          </div>
        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard icon={User} label="Full Name" value={profile.name} name="name" />
        <InfoCard icon={Hash} label="Roll Number" value={profile.rollNo} name="rollNo" editable={false} />
        <InfoCard icon={Mail} label="Email ID" value={profile.email} name="email" />
        <InfoCard icon={Phone} label="Phone Number" value={profile.phone} name="phone" />
        <InfoCard icon={Users} label="Parent/Guardian Name" value={profile.parentName} name="parentName" />
        <InfoCard icon={Phone} label="Parent Contact" value={profile.parentPhone} name="parentPhone" />
        <InfoCard icon={School} label="Department" value={profile.department} name="department" type="select" />
        <InfoCard icon={Shield} label="Security Code" value={profile.studentCode} name="studentCode" editable={false} />
      </div>

      <div className="flex justify-end pt-4">
        <button className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center space-x-2">
          <Save size={20} />
          <span>Save Profile Changes</span>
        </button>
      </div>
    </div>
  );
}
