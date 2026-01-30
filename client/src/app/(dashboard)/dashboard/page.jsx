'use client';

import React, { useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import TeacherDashboard from '../../../components/TeacherDashboard';
import StudentDashboard from '../../../components/StudentDashboard';

export default function DashboardPage() {
    const { loading } = useAuth();
    const user = Cookies.get('userId');
    const role = Cookies.get('role');
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <>
            {role === 'teacher' ? (
                <TeacherDashboard />
            ) : (
                <StudentDashboard />
            )}
        </>
    );
}