import React, { useState } from 'react';
import { Mail, MessageSquare, Phone, ChevronDown, ChevronUp, Send, HelpCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FAQS = [
    {
        question: "Is there a fee for candidates to apply?",
        answer: "No, MaldivesCareer Connect is 100% free for candidates. We strictly prohibit recruitment fees. Employers pay for our services to find talent like you."
    },
    {
        question: "How long does the work permit process take?",
        answer: "Typically, it takes 2-4 weeks after the job offer is signed. Your employer will handle the quota and visa application process. You just need to provide the required documents."
    },
    {
        question: "Can I update my documents after applying?",
        answer: "Yes, you can update your documents in your Profile -> Document Vault. However, for applications already 'Under Review', please contact support to ensure the recruiter sees the new version."
    },
    {
        question: "What documents do I need for a work visa?",
        answer: "You typically need a valid passport (min 6 months validity), Police Clearance Certificate (PCC), Medical Report (from an approved center), and Passport-sized photos."
    }
];//fhh

const SupportPage = () => {
    const navigate = useNavigate(); // this is 
    const [openFaq, setOpenFaq] = useState(0);
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate API call
        setTimeout(() => {
            setIsSubmitted(true);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20 font-sans">
            {/* Header */}
            <div className="bg-slate-900 text-white py-12 px-4 relative">
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-bold uppercase text-xs tracking-widest hover:-translate-x-1 duration-300"
                >
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <div className="container mx-auto max-w-4xl">

                    <div className="text-center">
                        <div className="w-12 h-12 bg-maldives-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-maldives-900/50">
                            <HelpCircle className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold mb-4">How can we help you?</h1>
                        <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto">
                            Find answers to common questions about international recruitment to the Maldives or get in touch with our support team.
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto max-w-5xl px-4 mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                            <div className="p-6 border-b border-slate-100">
                                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5 text-maldives-600" />
                                    Send us a message
                                </h2>
                                <p className="text-slate-500 text-sm mt-1">We typically reply within 24 hours.</p>
                            </div>    //iiloveyouuuuuuu

                            {isSubmitted ? (
                                <div className="p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-300">
                                        <CheckCircle className="w-10 h-10 text-green-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Message Sent!</h3>
                                    <p className="text-slate-600 max-w-md mb-8">
                                        Thank you for contacting us. A support ticket has been created (#89201). Please check your email for updates.
                                    </p>
                                    <button
                                        onClick={() => setIsSubmitted(false)}
                                        className="px-6 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200 transition-colors"
                                    >
                                        Send Another
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Your Name</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-maldives-500 transition-all text-sm"
                                                placeholder="John Doe"
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                                            <input
                                                type="email"
                                                required
                                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-maldives-500 transition-all text-sm"
                                                placeholder="john@example.com"
                                                value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Subject</label>
                                        <select
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-maldives-500 transition-all text-slate-600 text-sm"
                                            value={formData.subject}
                                            onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                        >
                                            <option value="">Select a topic...</option>
                                            <option value="app_status">Application Status</option>
                                            <option value="tech_issue">Technical Issue</option>
                                            <option value="visa_query">Visa/Permit Query</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Message</label>
                                        <textarea
                                            required
                                            rows={5}
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-maldives-500 transition-all resize-none text-sm"
                                            placeholder="Describe your issue or question in detail..."
                                            value={formData.message}
                                            onChange={e => setFormData({ ...formData, message: e.target.value })}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full py-3.5 bg-maldives-600 text-white font-bold rounded-xl shadow-lg hover:bg-maldives-700 transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-widest"
                                    >
                                        <Send className="w-4 h-4" /> Send Message
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Right Column: FAQ & Contact Info */}
                    <div className="space-y-6">

                        {/* Contact Info Card */}
                        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
                            <h3 className="font-bold text-slate-800 mb-4">Direct Contact</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="bg-white p-2 rounded-full text-maldives-600 shadow-sm">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-400 font-bold uppercase">Email Us</div>
                                        <div className="text-sm font-semibold text-slate-800">support@maldivescareer.com</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="bg-white p-2 rounded-full text-green-600 shadow-sm">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-400 font-bold uppercase">WhatsApp</div>
                                        <div className="text-sm font-semibold text-slate-800">+960 999-1234</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* FAQ Accordion */}
                        <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
                            <div className="p-6 border-b border-slate-100 bg-slate-50">
                                <h3 className="font-bold text-slate-800">Frequently Asked Questions</h3>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {FAQS.map((faq, idx) => (
                                    <div key={idx} className="bg-white">
                                        <button
                                            onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                            className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-slate-50 transition-colors"
                                        >
                                            <span className="font-semibold text-slate-700 text-sm pr-4">{faq.question}</span>
                                            {openFaq === idx ? (
                                                <ChevronUp className="w-4 h-4 text-maldives-600 flex-shrink-0" />
                                            ) : (
                                                <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                            )}
                                        </button>
                                        {openFaq === idx && (
                                            <div className="px-6 pb-4 text-sm text-slate-500 leading-relaxed bg-slate-50/50 animate-in slide-in-from-top-1 duration-200">
                                                {faq.answer}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupportPage;
