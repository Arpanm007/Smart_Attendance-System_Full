'use client';

import React from 'react';
import Link from 'next/link';
import { QrCode, ShieldCheck, Zap, UserPlus } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 bg-white shadow-sm">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 bg-purple-600 rounded-lg flex items-center justify-center">
            <QrCode className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold text-gray-900">SmartAttend</span>
        </div>
        <div className="space-x-4">
          <Link href="/login" className="text-gray-600 hover:text-purple-600 font-medium">
            Login
          </Link>
          <Link
            href="/register"
            className="bg-purple-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-purple-700 transition-all"
          >
            Register
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
          Attendance tracking made <span className="text-purple-600">effortless.</span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600">
          A secure, QR-based system designed for modern classrooms.
          No more manual rolls—just scan, verify, and you're done.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/login"
            className="px-8 py-4 bg-purple-600 text-white rounded-xl font-bold text-lg hover:bg-purple-700 shadow-lg hover:shadow-purple-200 transition-all"
          >
            Login as Student/Teacher
          </Link>
          <Link
            href="/register"
            className="px-8 py-4 bg-white text-gray-900 border border-gray-200 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
          >
            <UserPlus size={20} />
            Student Registration
          </Link>
        </div>

        {/* Features */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-8">
          <FeatureCard
            icon={<QrCode className="text-purple-600" />}
            title="Instant QR Scan"
            description="Generate dynamic QR codes that students can scan in seconds to mark attendance."
          />
          <FeatureCard
            icon={<ShieldCheck className="text-purple-600" />}
            title="Fraud Prevention"
            description="Geo-fencing and device verification ensures only students in the room can check in."
          />
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-left">
      <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}