import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import StatsCard from './StatsCard';
import { Users, UserCheck, Calendar, ClipboardList } from 'lucide-react';
import Cookies from 'js-cookie';
import AttendanceRecordModal from './AttendanceRecordModal';
import MarkAttendanceModal from './MarkAttendanceModal';
import { useRouter } from 'next/navigation';

const TeacherDashboard = () => {
    const router = useRouter();
    const [stats, setStats] = useState({
        totalStudents: 0,
        presentToday: 0,
        absentToday: 0
    });
    const [loading, setLoading] = useState(true);
    const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
    const [isMarkAttendanceModalOpen, setIsMarkAttendanceModalOpen] = useState(false);
    const [attendanceData, setAttendanceData] = useState([]);
    const [attendanceDataToday, setAttendanceDataToday] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                console.log("IDD: ", Cookies.get('userId'));
                const { data } = await api.post('/users/stats', { userId: Cookies.get('userId') });
                setStats(data);
                setAttendanceData(data.subjectDetails[0].perStudentAll);
                setAttendanceDataToday(data.subjectDetails[0].perStudentToday);
                console.log("Attendance Data: ", data.subjectDetails[0].perStudentAll);
            } catch (error) {
                console.error("Failed to fetch stats");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = loading ? [
        { title: 'Total Students', value: '...', icon: Users, color: 'bg-blue-500' },
        { title: 'Present Today', value: '...', icon: UserCheck, color: 'bg-green-500' },
        { title: 'Absent Today', value: '...', icon: UserCheck, color: 'bg-red-500' },
    ] : [
        { title: 'Total Students', value: stats.subjectDetails[0].totalStudents, icon: Users, color: 'bg-blue-500' },
        { title: 'Present Today', value: stats.subjectDetails[0].presentToday, icon: UserCheck, color: 'bg-green-500' },
        { title: 'Absent Today', value: stats.subjectDetails[0].absentToday, icon: UserCheck, color: 'bg-red-500' },
    ];

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">{getGreeting()}, Professor!</h1>
            <p className="text-gray-500">Here is your campus activity overview for today.</p>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {statCards.map((stat) => (
                    <StatsCard key={stat.title} {...stat} />
                ))}
            </div>

            <button
                onClick={() => setIsAttendanceModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-indigo-600 text-indigo-600 font-semibold rounded-lg shadow-sm hover:bg-indigo-600 hover:text-white active:scale-95 transition-all duration-200 ease-in-out group"
            >
                <ClipboardList className="w-5 h-5 text-indigo-600 group-hover:text-white transition-colors" />
                <span>View Full History</span>
            </button>


            <div className="relative mt-8 overflow-hidden bg-white border border-slate-200 rounded-2xl p-8 shadow-sm group">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-indigo-50 rounded-full blur-3xl group-hover:bg-indigo-100 transition-colors duration-500" />

                <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex flex-col md:flex-row items-center text-center md:text-left gap-5">
                        {/* Icon with a more sophisticated container */}
                        <div className="flex-shrink-0 p-4 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200 rotate-3 group-hover:rotate-0 transition-transform duration-300">
                            <Calendar className="h-8 w-8 text-white" />
                        </div>

                        <div>
                            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                                Start Attendance
                            </h3>
                            <p className="text-slate-500 font-medium mt-1 max-w-md">
                                Launch the <span className="text-indigo-600 font-bold">QR-based</span> system to track student presence in real-time.
                            </p>
                        </div>
                    </div>

                    {/* Improved Action Button */}
                    <button
                        onClick={() => {
                            //Open QR Modal;
                            setIsMarkAttendanceModalOpen(true);
                        }}
                        className="whitespace-nowrap px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:shadow-indigo-200 transition-all active:scale-95 flex items-center gap-2"
                    >
                        Mark Attendance Now
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </button>
                </div>
            </div>
            <AttendanceRecordModal
                isOpen={isAttendanceModalOpen}
                onClose={() => setIsAttendanceModalOpen(false)}
                attendanceData={attendanceData}
            />
            <MarkAttendanceModal
                isOpen={isMarkAttendanceModalOpen}
                onClose={() => setIsMarkAttendanceModalOpen(false)}
                attendanceData={attendanceDataToday}
                classId={stats.subjectDetails ? stats.subjectDetails[0].subjectId : ""}
            />
        </div>
    );
};

export default TeacherDashboard;
