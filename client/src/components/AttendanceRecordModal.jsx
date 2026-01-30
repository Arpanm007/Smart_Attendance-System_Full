import React, { useState, useMemo } from 'react';
import { X, CheckCircle2, XCircle, Search, Calendar, Users } from 'lucide-react';

const AttendanceModal = ({ isOpen, onClose, attendanceData }) => {
    const [activeTab, setActiveTab] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    const { dates, groupedData } = useMemo(() => {
        if (!attendanceData || attendanceData.length === 0) {
            return { dates: [], groupedData: {} };
        }

        const grouped = attendanceData.reduce((acc, record) => {
            const dateKey = new Date(record.date).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
            });

            if (!acc[dateKey]) {
                acc[dateKey] = { records: [], present: 0, total: 0 };
            }

            acc[dateKey].records.push(record);
            acc[dateKey].total++;
            if (record.status === 'Present') acc[dateKey].present++;

            return acc;
        }, {});

        const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));

        return {
            dates: sortedDates,
            groupedData: grouped
        };
    }, [attendanceData]);

    if (!isOpen) return null;

    const currentRecords = groupedData[dates[activeTab]]?.records.filter(r =>
        r.student?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl h-[85vh] flex overflow-hidden border border-slate-200">

                <div className="w-72 bg-slate-50 border-r border-slate-200 flex flex-col">
                    <div className="p-6 border-b border-slate-200 bg-white">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-indigo-600" /> History
                        </h2>
                    </div>
                    <div className="flex-1 overflow-y-auto p-3 space-y-2">
                        {dates.map((date, index) => (
                            <button
                                key={date}
                                onClick={() => { setActiveTab(index); setSearchTerm(''); }}
                                className={`w-full p-4 rounded-2xl text-left transition-all ${activeTab === index
                                    ? 'bg-white shadow-md border-l-4 border-indigo-600'
                                    : 'hover:bg-slate-200 text-slate-500'
                                    }`}
                            >
                                <p className={`text-sm font-bold ${activeTab === index ? 'text-indigo-600' : 'text-slate-700'}`}>
                                    {date}
                                </p>
                                <div className="flex gap-3 mt-1 text-[10px] uppercase font-bold tracking-wider">
                                    <span className="text-emerald-600">{groupedData[date].present} Present</span>
                                    <span className="text-slate-400">{groupedData[date].total - groupedData[date].present} Absent</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 flex flex-col bg-white">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search student name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                            />
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                        {currentRecords.length > 0 ? (
                            <table className="w-full border-separate border-spacing-y-2">
                                <thead>
                                    <tr className="text-slate-400 text-xs uppercase tracking-widest text-left">
                                        <th className="px-4 py-2 font-semibold">Student Name</th>
                                        <th className="px-4 py-2 font-semibold text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentRecords.map((record, idx) => (
                                        <tr key={idx} className="group hover:bg-slate-50 transition-colors">
                                            <td className="px-4 py-4 bg-white border-y border-l border-slate-100 rounded-l-2xl shadow-sm group-hover:shadow-md transition-all">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold ring-2 ring-white">
                                                        {record.student?.name?.charAt(0)}
                                                    </div>
                                                    <span className="font-semibold text-slate-700">{record.student?.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 bg-white border-y border-r border-slate-100 rounded-r-2xl shadow-sm group-hover:shadow-md transition-all text-right">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${record.status === 'Present' ? 'bg-emerald-50 text-emerald-600' :
                                                    record.status === 'Absent' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                                                    }`}>
                                                    {record.status === 'Present' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                                                    {record.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-3">
                                <Users className="w-12 h-12 opacity-20" />
                                <p className="text-sm italic">No students found matching your search.</p>
                            </div>
                        )}
                    </div>

                    <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-slate-400" />
                            <span className="text-sm font-medium text-slate-600">{currentRecords.length} Students in view</span>
                        </div>
                        <button onClick={onClose} className="px-8 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-indigo-600 shadow-lg transition-all active:scale-95">
                            Close History
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendanceModal;