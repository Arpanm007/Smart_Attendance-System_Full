'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, UserPlus, Eye, EyeOff, IdCard, Phone } from 'lucide-react';
import api from '../../api/axios';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        studentId: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            return setError("Passwords do not match");
        }

        setLoading(true);
        setError('');

        try {
            await api.post('/auth/register', {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                studentId: formData.studentId,
                password: formData.password,
                role: 'student'
            });

            router.push('/login?registered=true');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100">
                <div className="text-center">
                    <div className="flex justify-center">
                        <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                            <UserPlus className="text-white" size={28} />
                        </div>
                    </div>
                    <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Student Sign Up</h2>
                    <p className="mt-2 text-sm text-gray-500 font-medium">Create your account to track attendance</p>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-sm rounded" role="alert">
                        {error}
                    </div>
                )}

                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-3">
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input name="name" type="text" required placeholder="Full Name"
                                className="text-gray-600 pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm transition-all"
                                value={formData.name} onChange={handleChange} />
                        </div>

                        <div className="relative">
                            <IdCard className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input name="studentId" type="text" required placeholder="Student ID / Roll Number"
                                className="text-gray-600 pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm transition-all"
                                value={formData.studentId} onChange={handleChange} />
                        </div>

                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input name="email" type="email" required placeholder="Email Address"
                                className="text-gray-600 pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm transition-all"
                                value={formData.email} onChange={handleChange} />
                        </div>

                        <div className="relative">
                            <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input name="phone" type="tel" placeholder="Phone Number (10 digits)"
                                className="text-gray-600 pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm transition-all"
                                value={formData.phone} onChange={handleChange} />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input name="password" type={showPassword ? "text" : "password"} required placeholder="Password"
                                className="text-gray-600 pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm transition-all"
                                value={formData.password} onChange={handleChange} />
                            <button type="button" className="absolute right-3 top-3 text-gray-400" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input name="confirmPassword" type="password" required placeholder="Confirm Password"
                                className="text-gray-600 pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm transition-all"
                                value={formData.confirmPassword} onChange={handleChange} />
                        </div>
                    </div>

                    <button type="submit" disabled={loading}
                        className="w-full bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 active:scale-[0.98] transition-all disabled:opacity-50 shadow-md">
                        {loading ? 'Creating Account...' : 'Register as Student'}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600">
                    By registering, you agree to our Terms of Service.
                </p>

                <div className="border-t pt-4 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link href="/login" className="text-purple-600 font-bold hover:text-purple-700 transition-colors">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}