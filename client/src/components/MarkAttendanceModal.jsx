"use client";
import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { X, Users, CheckCircle, QrCode, ShieldCheck, Info } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

const MarkAttendanceModal = ({ isOpen, onClose, attendanceData, classId }) => {
    const [markedStudents, setMarkedStudents] = useState([]);

    let socketRef = useRef(null);


    useEffect(() => {
        if (!isOpen) return;

        setMarkedStudents(attendanceData.filter(record => record.status === "Present"));
        socketRef.current = io('http://localhost:5000');
        socketRef.current.emit('join', classId);
        socketRef.current.on('attendanceUpdate', (studentData) => {
            setMarkedStudents((prev) => [...prev, studentData]);
        });
    }, [isOpen, classId]);

    const handleOnClose = () => {
        setMarkedStudents([]);
        socketRef.current.disconnect();
        onClose();
    }



    if (!isOpen) return null;

    const unmarkedStudents = attendanceData?.filter(record =>
        (record.status === "Absent" || record.status === null) &&
        !markedStudents.some(live => live.student._id === record.student._id)
    ) || [];

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />

            <div className="relative w-full max-w-6xl h-[85vh] bg-white rounded-[2rem] shadow-2xl flex flex-col md:flex-row overflow-hidden border border-white/20">

                <div className="flex-1 bg-slate-50/50 border-r border-slate-100 flex flex-col">
                    <div className="p-6 border-b bg-white/50 backdrop-blur-sm flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-indigo-600" />
                            <h3 className="font-bold text-slate-800">Remaining</h3>
                        </div>
                        <span className="text-xs font-bold px-2 py-1 bg-slate-200 text-slate-600 rounded-lg">
                            {unmarkedStudents.length}
                        </span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {unmarkedStudents.map((student, idx) => (
                            <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200/60 shadow-sm text-sm text-slate-600 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold">
                                    {student.student.name?.charAt(0)}
                                </div>
                                {student.student.name}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex-[2] flex flex-col items-center justify-center p-8 text-center bg-white relative">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-600 to-transparent opacity-20" />

                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-400 hover:text-slate-600"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div className="mb-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-3">
                            <ShieldCheck className="w-3 h-3" /> Secure Session Active
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                            Scan for Attendance
                        </h2>
                        <p className="text-slate-500 mt-2 flex items-center justify-center gap-2">
                            Session ID: <span className="font-mono font-bold text-slate-700">{classId}</span>
                        </p>
                    </div>

                    <div className="relative p-6 bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(79,70,229,0.15)] border border-slate-100 mb-10 group">
                        <div className="absolute inset-0 bg-indigo-600/5 rounded-[2.5rem] scale-95 group-hover:scale-105 transition-transform duration-500" />
                        <div className="relative bg-white p-4 rounded-2xl">
                            <QRCodeCanvas
                                value={JSON.stringify({ classId, token: "dynamic-token-here" })}
                                size={220}
                                level={"H"}
                                includeMargin={false}
                                imageSettings={{
                                    src: "/logo.png",
                                    x: undefined, y: undefined, height: 40, width: 40, excavate: true,
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                        <button
                            onClick={handleOnClose}
                            className="px-10 py-4 bg-slate-900 hover:bg-indigo-600 text-white font-bold rounded-2xl shadow-xl transition-all duration-300 active:scale-95 flex items-center gap-3"
                        >
                            Complete & Close Session
                        </button>
                        <p className="text-slate-400 text-xs flex items-center gap-1">
                            <Info className="w-3 h-3" /> QR codes rotate every 30 seconds for security
                        </p>
                    </div>
                </div>

                <div className="flex-1 bg-indigo-50/30 border-l border-indigo-100 flex flex-col">
                    <div className="p-6 border-b bg-white/50 backdrop-blur-sm flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <h3 className="font-bold text-slate-800">Present</h3>
                        </div>
                        <span className="text-xs font-bold px-2 py-1 bg-green-500 text-white rounded-lg animate-pulse">
                            {markedStudents.length}
                        </span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {markedStudents.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-40 grayscale">
                                <QrCode className="w-12 h-12 mb-2" />
                                <p className="text-xs font-medium text-slate-500">Waiting for scans...</p>
                            </div>
                        ) : (
                            markedStudents.map((student, idx) => (
                                <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200/60 shadow-sm text-sm text-slate-600 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold">
                                        {student.student.name?.charAt(0)}
                                    </div>
                                    {student.student.name}
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default MarkAttendanceModal;