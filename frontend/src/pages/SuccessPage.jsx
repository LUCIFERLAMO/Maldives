import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Home, Search } from 'lucide-react';

const SuccessPage = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-slate-100 animate-fade-in-up">
                {/* Animated Icon */}
                <div className="mb-6 flex justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75"></div>
                        <div className="relative bg-green-50 p-4 rounded-full">
                            <CheckCircle className="w-16 h-16 text-green-600 animate-[bounce_1s_ease-in-out_1]" />
                        </div>
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                    Application Submitted Successfully!
                </h1>

                <p className="text-slate-600 mb-8 text-lg">
                    Your profile and documents have been sent to the employer.
                </p>

                <div className="flex flex-col gap-3">
                    <Link
                        to="/jobs"
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    >
                        <Search className="w-5 h-5" />
                        Browse More Jobs
                    </Link>

                    <Link
                        to="/"
                        className="w-full bg-white hover:bg-slate-50 text-slate-600 font-medium py-3 px-6 rounded-lg border border-slate-200 transition-all duration-300 hover:border-slate-300 flex items-center justify-center gap-2"
                    >
                        <Home className="w-5 h-5" />
                        Return Home
                    </Link>
                </div>
            </div>

            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translate3d(0, 20px, 0);
                    }
                    to {
                        opacity: 1;
                        transform: translate3d(0, 0, 0);
                    }
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default SuccessPage;
