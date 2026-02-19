
import React, { useState } from 'react';
import { Upload, FileCheck, Search, Clock, CheckCircle, XCircle, Sparkles, FileText, User } from 'lucide-react';
import { analyzeODDocument } from '../services/geminiService';

export default function ODPassModule() {
  const [isUploading, setIsUploading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [passes, setPasses] = useState([
    { 
      id: 'OD-1024', 
      title: 'National Tech Symposium', 
      date: '2023-11-12', 
      status: 'Approved',
      mentorName: 'Dr. Sarah Wilson',
      approvalDate: '2023-11-13'
    },
    { 
      id: 'OD-1025', 
      title: 'Inter-College Sports', 
      date: '2023-12-05', 
      status: 'Pending' 
    }
  ]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setAnalysis(null);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setSelectedFile(base64);
      
      // Call Gemini for analysis
      const result = await analyzeODDocument(base64);
      setAnalysis(result);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const submitODRequest = () => {
    const newPass = {
      id: `OD-${Math.floor(Math.random() * 9000) + 1000}`,
      title: analysis?.documentType || 'New Event Participation',
      date: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    setPasses([newPass, ...passes]);
    setSelectedFile(null);
    setAnalysis(null);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm h-fit">
          <h3 className="text-lg font-bold text-slate-800 mb-6">New OD Application</h3>
          
          <div className="relative group">
            <input 
              type="file" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
              onChange={handleFileUpload}
              accept="image/*"
              disabled={isUploading}
            />
            <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
              isUploading ? 'bg-slate-50 border-indigo-200' : 'border-slate-200 group-hover:border-indigo-400 group-hover:bg-indigo-50/30'
            }`}>
              {isUploading ? (
                <div className="animate-pulse space-y-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full mx-auto flex items-center justify-center">
                    <Sparkles className="text-indigo-600 animate-spin" />
                  </div>
                  <p className="text-indigo-600 font-bold">EduAI analyzing document...</p>
                  <p className="text-xs text-slate-400">Verifying Mentor & HOD signatures</p>
                </div>
              ) : selectedFile ? (
                <div className="space-y-4">
                  <img src={selectedFile} alt="Preview" className="h-40 mx-auto rounded-lg object-contain shadow-sm" />
                  <p className="text-slate-500 text-sm">Click to replace file</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-slate-50 rounded-full mx-auto flex items-center justify-center text-slate-400">
                    <Upload size={24} />
                  </div>
                  <p className="font-bold text-slate-600">Click to upload document</p>
                  <p className="text-xs text-slate-400">Upload Soft Copy (Letter with HOD sign & Certificate)</p>
                </div>
              )}
            </div>
          </div>

          {analysis && (
            <div className="mt-6 p-5 bg-indigo-50 rounded-2xl border border-indigo-100">
              <div className="flex items-center space-x-2 text-indigo-700 mb-3">
                <Sparkles size={18} />
                <span className="font-bold text-sm">AI Verification Result</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Document Type:</span>
                  <span className="font-bold text-slate-700">{analysis.documentType}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Signatures Found:</span>
                  <span className="font-bold text-indigo-600">{analysis.detectedSignatures?.join(', ') || 'None detected'}</span>
                </div>
                <div className="flex items-start space-x-2 text-xs text-slate-600 mt-2 bg-white/50 p-2 rounded-lg">
                  <FileText size={14} className="mt-0.5 flex-shrink-0" />
                  <p>{analysis.summary}</p>
                </div>
              </div>
              <button 
                onClick={submitODRequest}
                className="w-full mt-4 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100"
              >
                Submit Application
              </button>
            </div>
          )}
        </div>

        {/* History Section */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">Application History</h3>
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Search size={20} />
            </button>
          </div>

          <div className="space-y-4">
            {passes.map(pass => (
              <div key={pass.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl flex-shrink-0 ${
                      pass.status === 'Approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                    }`}>
                      {pass.status === 'Approved' ? <CheckCircle size={20} /> : <Clock size={20} />}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm leading-tight">{pass.title}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5 font-medium uppercase tracking-wider">{pass.id} • Applied {pass.date}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                    pass.status === 'Approved' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
                  }`}>
                    {pass.status}
                  </div>
                </div>

                {pass.status === 'Approved' && pass.mentorName && (
                  <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-emerald-700">
                      <div className="p-1 bg-emerald-100 rounded-md">
                        <User size={12} />
                      </div>
                      <span className="text-[11px] font-bold">Approved by {pass.mentorName}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">on {pass.approvalDate}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {passes.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <FileCheck size={48} className="mx-auto mb-4 opacity-20" />
              <p>No previous applications found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
