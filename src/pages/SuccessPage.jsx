import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';

const SuccessPage = () => {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
            </div>

            <h1 className="text-3xl font-bold text-slate-900 mb-4">Application Submitted!</h1>
            <p className="text-slate-600 max-w-md mb-8">
                Your documents have been securely uploaded to our cloud server. Our recruitment team will review your profile and contact you via WhatsApp if shortlisted.
            </p>

            <div className="space-y-4 w-full max-w-xs">
                <Link
                    to="/"
                    className="block w-full py-3 bg-maldives-600 text-white rounded-lg font-medium hover:bg-maldives-700 transition-colors"
                >
                    Browse More Jobs
                </Link>
                <Link
                    to="/"
                    className="flex items-center justify-center gap-2 w-full py-3 text-maldives-600 font-medium hover:bg-maldives-50 rounded-lg transition-colors"
                >
                    Return Home <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
};

export default SuccessPage;
