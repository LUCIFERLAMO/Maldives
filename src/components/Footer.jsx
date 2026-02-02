
import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#0f172a] border-t border-slate-800 pt-16 pb-8">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center gap-2 font-black text-xl text-white tracking-tighter">
                            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center text-white text-sm shadow-lg shadow-teal-500/20">
                                <Briefcase className="w-4 h-4" />
                            </div>
                            <span>GlobalAKjobs</span>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                            Connecting talent with opportunity across the Maldives. The premier job portal for seekers and employers.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center hover:bg-teal-500/10 hover:text-teal-400 transition-all">
                                <Facebook className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center hover:bg-teal-500/10 hover:text-teal-400 transition-all">
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center hover:bg-teal-500/10 hover:text-teal-400 transition-all">
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center hover:bg-teal-500/10 hover:text-teal-400 transition-all">
                                <Linkedin className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Platform & Support Links */}
                    <div>
                        <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6">Platform</h3>
                        <ul className="space-y-4">
                            <li><Link to="/" className="text-sm text-slate-400 hover:text-teal-400 font-medium transition-colors">Home</Link></li>
                            <li><Link to="/jobs" className="text-sm text-slate-400 hover:text-teal-400 font-medium transition-colors">Browse Jobs</Link></li>
                            <li><Link to="/login" className="text-sm text-slate-400 hover:text-teal-400 font-medium transition-colors">Candidate Login</Link></li>
                            <li><Link to="/login/agent" className="text-sm text-slate-400 hover:text-teal-400 font-medium transition-colors">Agent Portal</Link></li>
                            <li><Link to="/support" className="text-sm text-slate-400 hover:text-teal-400 font-medium transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/support" className="text-sm text-slate-400 hover:text-teal-400 font-medium transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-teal-500 shrink-0" />
                                <span className="text-sm text-slate-400">Male', Maldives</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-teal-500 shrink-0" />
                                <a href="mailto:support@globalakjobs.com" className="text-sm text-slate-400 hover:text-teal-400 transition-colors">support@globalakjobs.com</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-teal-500 shrink-0" />
                                <a href="tel:+9609991234" className="text-sm text-slate-400 hover:text-teal-400 transition-colors">+960 999-1234</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-slate-500 font-medium">
                        &copy; {currentYear} GlobalAKjobs. All rights reserved.
                    </p>
                    <p className="text-xs text-slate-500 font-medium">
                        Made with <span className="text-teal-500">♥</span> in Maldives
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
