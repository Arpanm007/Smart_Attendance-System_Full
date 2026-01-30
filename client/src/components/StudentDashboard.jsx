"use client";
import React, { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import {
    QrCode, X, CheckCircle2, Clock, MapPin,
    BookOpen, User, ShieldCheck, Bell,
    Calendar, ArrowUpRight, Hash, Search, AlertCircle
} from 'lucide-react';
import Cookies from 'js-cookie';
import { Html5Qrcode } from 'html5-qrcode';

const StudentDashboard = () => {
    const [attendance, setAttendance] = useState([]);
    const [user, setUser] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const [scannedData, setScannedData] = useState(null);
    const [scanDetails, setScanDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const qrReaderRef = useRef(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const userId = Cookies.get('userId');
                const [userRes, attendanceRes] = await Promise.all([
                    api.post('/auth/user/info', { userId }),
                    api.get('/attendance/my')
                ]);
                setUser(userRes.data);
                setAttendance(attendanceRes.data);
            } catch (err) {
                console.error("Fetch Error:", err);
            }
        };
        fetchDashboardData();
    }, []);

    const startScanner = async () => {
        setIsScanning(true);
        setScannedData(null);
        setScanDetails(null);
        setTimeout(async () => {
            try {
                const html5QrCode = new Html5Qrcode("camera-container");
                qrReaderRef.current = html5QrCode;
                await html5QrCode.start(
                    { facingMode: "environment" },
                    { fps: 24, qrbox: undefined },
                    (text) => {
                        handleScanSuccess(text);
                        if (navigator.vibrate) navigator.vibrate(50);
                    },
                    () => { }
                );
            } catch (err) {
                console.error(err);
                setIsScanning(false);
            }
        }, 100);
    };

    const handleScanSuccess = (text) => {
        const textData = JSON.parse(text);
        setScannedData(textData);
        setScanDetails({
            subject: textData.classId,
            room: "Lecture Hall 3",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            lecturer: "Dr. Aris"
        });
    };

    const handleAttendanceSubmit = async () => {
        try {
            const userId = Cookies.get('userId');
            const attendanceData = {
                studentId: userId,
                date: new Date().toISOString(),
                classId: scanDetails.subject,
                status: 'Present'
            };
            const res = await api.post('/attendance/join', attendanceData);
            console.log(res.data);
            setIsLoading(false);
            stopScanner();
        } catch (err) {
            console.error(err);
            setIsLoading(false);
        }
    };


    const stopScanner = async () => {
        if (qrReaderRef.current) {
            try {
                await qrReaderRef.current.stop();
                qrReaderRef.current = null;
            } catch (e) { }
        }
        setIsScanning(false);
    };

    const getStatusTheme = (status) => {
        const s = status?.toLowerCase();
        if (s === 'present') return 'bg-emerald-50 text-emerald-600 border-emerald-100';
        if (s === 'late') return 'bg-amber-50 text-amber-600 border-amber-100';
        if (s === 'absent') return 'bg-rose-50 text-rose-600 border-rose-100';
        return 'bg-slate-50 text-slate-500 border-slate-100';
    };

    const filteredLogs = attendance.filter(log =>
        log.subject?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased">

            <div className="max-w-[1440px] mx-auto p-4 md:p-8 lg:p-12">

                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="bg-indigo-600 text-white text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-[0.15em]">Student</span>
                            <span className="text-slate-400 text-xs font-bold">{new Date().toDateString()}</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">
                            Hello, {user?.name?.split(' ')[0] || 'User'}
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:bg-slate-50 transition-all shadow-sm">
                            <Bell size={22} />
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    <aside className="lg:col-span-4 space-y-6">
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200/60 relative overflow-hidden">
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-indigo-100">
                                    <User size={28} />
                                </div>
                                <h3 className="text-xl font-black text-slate-800">{user?.name}</h3>
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1 mb-6">{user?.course || 'General Sciences'}</p>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs font-bold text-slate-600">
                                        <Hash size={16} className="text-indigo-500" /> {user?.studentId || '2024-XXXX'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                            <div className="relative z-10">
                                <p className="text-[10px] font-black uppercase opacity-50 mb-1 tracking-widest">Monthly Attendance</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-black group-hover:text-indigo-400 transition-colors">94</span>
                                    <span className="text-xl font-bold opacity-40">%</span>
                                </div>
                            </div>
                            <div className="absolute -bottom-6 -right-6 opacity-10 group-hover:scale-110 transition-transform">
                                <ShieldCheck size={140} />
                            </div>
                        </div>
                    </aside>

                    <main className="lg:col-span-8">
                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200/60 flex flex-col h-[700px]">
                            <div className="p-8 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Attendance Logs</h2>
                                <div className="relative group">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search subjects..."
                                        className="pl-12 pr-6 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all w-full sm:w-72"
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 pt-4 custom-scrollbar">
                                <div className="space-y-4">
                                    {filteredLogs.length > 0 ? (
                                        filteredLogs.map((log, i) => (
                                            <div key={i} className="flex flex-col md:flex-row md:items-center gap-4 p-5 bg-white border border-slate-100 hover:border-indigo-100 hover:shadow-md hover:shadow-slate-100 rounded-3xl transition-all group">
                                                <div className="flex items-center gap-4 flex-1">
                                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 group-hover:text-indigo-600 transition-colors">
                                                        <Calendar size={22} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                                            <p className="font-black text-slate-800 truncate">{log.subject?.name || 'Academic Class'}</p>
                                                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border tracking-wider ${getStatusTheme(log.status)}`}>
                                                                {log.status || 'Present'}
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                                                            <span className="flex items-center gap-1.5"><Clock size={12} className="text-slate-300" /> {new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                            <span className="flex items-center gap-1.5"><MapPin size={12} className="text-slate-300" /> {log.room || 'Room 101'}</span>
                                                            <span className="text-indigo-500/60 font-black">{new Date(log.date).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <ArrowUpRight size={20} className="text-slate-200 group-hover:text-indigo-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all hidden md:block" />
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full py-20 opacity-20">
                                            <AlertCircle size={64} className="mb-4" />
                                            <p className="font-black uppercase tracking-[0.2em] text-sm text-center">No Records Found</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            <div className="fixed bottom-8 right-8 md:bottom-12 md:right-12 z-[100]">
                <button
                    onClick={startScanner}
                    className="w-16 h-16 md:w-20 md:h-20 bg-slate-900 text-white rounded-[2.2rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] flex items-center justify-center hover:bg-indigo-600 hover:-translate-y-2 active:scale-90 transition-all duration-300 group"
                >
                    <QrCode size={32} className="group-hover:rotate-12 transition-transform" />
                    <span className="sr-only">Scan QR</span>
                </button>
            </div>

            {isScanning && (
                <div className="fixed inset-0 z-[99999] bg-black">
                    <div id="camera-container" className="absolute inset-0 bg-black h-full w-full" />

                    <div className="relative z-[100] h-full flex flex-col justify-between p-6 pointer-events-none overflow-hidden">

                        <div className="flex justify-between items-center pointer-events-auto">
                            <button
                                onClick={stopScanner}
                                className="w-14 h-14 bg-black/40 backdrop-blur-2xl rounded-2xl flex items-center justify-center text-white border border-white/10 active:scale-95 transition-all"
                            >
                                <X size={28} />
                            </button>
                            <div className="bg-white/10 backdrop-blur-2xl px-6 py-3 rounded-2xl border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.25em] flex items-center gap-3">
                                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" /> Live Scanner
                            </div>
                        </div>

                        {!scannedData && (
                            <div className="self-center relative flex flex-col items-center">
                                <div className="w-64 h-64 md:w-80 md:h-80 relative rounded-[3.5rem] overflow-hidden border border-white/10">
                                    <div className="absolute inset-x-0 h-1 bg-indigo-500 shadow-[0_0_25px_rgba(99,102,241,1)] animate-scan" />
                                    <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-indigo-500 rounded-tl-3xl" />
                                    <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-indigo-500 rounded-tr-3xl" />
                                    <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-indigo-500 rounded-bl-3xl" />
                                    <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-indigo-500 rounded-br-3xl" />
                                </div>
                                <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] mt-10 animate-pulse">Scanning...</p>
                            </div>
                        )}

                        <div className="pointer-events-auto w-full max-w-lg mx-auto transform transition-all">
                            {scannedData && (
                                <div className="bg-white rounded-[3.5rem] p-8 md:p-10 shadow-2xl animate-slide-up">
                                    <div className="flex items-center gap-5 mb-8">
                                        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100 shadow-inner">
                                            <ShieldCheck size={36} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Access Verified</h3>
                                            <p className="text-slate-400 text-[10px] font-black uppercase mt-1.5 tracking-widest">Confirmation Required</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Subject</p>
                                            <p className="font-bold text-slate-800 text-sm leading-snug">{scanDetails?.subject}</p>
                                        </div>
                                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Venue</p>
                                            <p className="font-bold text-slate-800 text-sm">{scanDetails?.room}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => { setScannedData(null); setScanDetails(null); }}
                                            className="flex-1 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.1em] text-slate-400 bg-slate-50 hover:bg-slate-100 transition-colors"
                                        >
                                            Retake
                                        </button>
                                        <button
                                            disabled={isLoading}
                                            onClick={() => { handleAttendanceSubmit(scannedData); stopScanner(); }}
                                            className="flex-[2] bg-slate-900 text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-slate-200 hover:bg-indigo-600 transition-all active:scale-95 disabled:opacity-50"
                                        >
                                            {isLoading ? 'Verifying...' : 'Log Entry'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <style jsx global>{`
                #camera-container { position: absolute !important; inset: 0; z-index: 10 !important; background: black; }
                #camera-container video { width: 100% !important; height: 100% !important; object-fit: cover !important; }
                #camera-container__dashboard, #camera-container__status_span, #camera-container img { display: none !important; }
                
                @keyframes scan { 0% { top: 10%; opacity: 0; } 50% { opacity: 1; } 100% { top: 90%; opacity: 0; } }
                .animate-scan { position: absolute; animation: scan 2.5s linear infinite; }
                
                @keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                .animate-slide-up { animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
                
                .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
            `}</style>
        </div>
    );
};

export default StudentDashboard;