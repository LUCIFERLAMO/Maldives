import React, { useState, useMemo, useRef, useEffect, useLayoutEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
    Search,
    ArrowRight,
    MapPin,
    List,
    Sparkles,
    ChevronDown,
    Zap,
    Filter,
    DollarSign,
    Star,
    Clock,
    Briefcase,
    Share2
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import JobCard from '../components/JobCard';
import { MOCK_JOBS, INDUSTRIES } from '../constants';
import { JobStatus } from '../types';

const BrowseJobsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState('');
    const [viewType, setViewType] = useState('list');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [sortBy, setSortBy] = useState('recent');
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [expandedJobId, setExpandedJobId] = useState(null);

    // Supabase State
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const selectedIndustry = searchParams.get('category') || 'All';

    const clearCategory = () => {
        setSearchParams({});
    };

    const filteredJobs = useMemo(() => {
        return jobs.filter(job => {
            const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.company.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesIndustry = selectedIndustry === 'All' || job.industry === selectedIndustry;


            const matchesStatus = sortBy === 'closed'
                ? job.status === JobStatus.CLOSED
                : job.status === JobStatus.OPEN;

            return matchesSearch && matchesIndustry && matchesStatus;
        }).sort((a, b) => {
            return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
        });
    }, [searchTerm, selectedIndustry, sortBy]);

    const scrollContainerRef = useRef(null);

    useEffect(() => {
        const container = scrollContainerRef.current;

        const handleScroll = () => {
            if (container) {
                sessionStorage.setItem('browseJobsScroll', container.scrollTop.toString());
            }
        }

        return () => {
            if (container) {
                sessionStorage.setItem('browseJobsScroll', container.scrollTop.toString());
            }
        };
    }, []);

    useLayoutEffect(() => {
        const savedScroll = sessionStorage.getItem('browseJobsScroll');
        if (savedScroll && scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = parseInt(savedScroll, 10);
        }
    }, [filteredJobs]);

    // Fetch Jobs from Supabase
    useEffect(() => {
        async function fetchJobs() {
            try {
                const { data, error } = await supabase
                    .from('jobs')
                    .select('*')
                    .eq('status', 'Current Opening')
                    .order('posted_date', { ascending: false });

                if (error) throw error;

                // Map database fields to frontend structure if needed
                // Our DB columns match most frontend expectations, but let's ensure:
                const mappedJobs = (data || []).map(job => ({
                    ...job,
                    postedDate: job.posted_date, // Map snake_case to camelCase
                    salaryRange: job.salary_range
                }));

                setJobs(mappedJobs);
            } catch (error) {
                console.error('Error fetching jobs:', error);
                setJobs([]);
            } finally {
                setLoading(false);
            }
        }

        fetchJobs();
    }, []);


    const handleShare = async (e, job) => {
        e.preventDefault();
        e.stopPropagation();

        const url = `${window.location.origin}/job/${job.id}`;
        const shareData = {
            title: job.title,
            text: `Check out this ${job.title} at ${job.company}`,
            url: url,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
                return;
            } catch (error) {
                console.log('Share cancelled or failed:', error);
                if (error.name !== 'AbortError') {
                } else {
                    return;
                }
            }
        }

        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(url);
            } else {
                const textArea = document.createElement("textarea");
                textArea.value = url;
                textArea.style.position = "fixed";
                textArea.style.left = "-9999px";
                textArea.style.top = "0";
                document.body.appendChild(textArea);

                textArea.focus();
                textArea.select();

                const successful = document.execCommand('copy');
                document.body.removeChild(textArea);
                if (!successful) throw new Error('execCommand copy failed');
            }
            alert('Job link copied to clipboard!');
        } catch (err) {
            console.error('Copy failed:', err);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 md:bg-gradient-to-br md:from-slate-100 md:via-slate-50 md:to-slate-200 font-sans text-slate-900 pb-32">

            {/* 1. EDITORIAL HERO */}
            <div className="relative bg-white pt-28 pb-20 lg:pt-36 lg:pb-28 px-6 rounded-b-[3rem] lg:rounded-b-[4rem] shadow-sm z-20 overflow-hidden">
                {/* Background Image with Smooth Gradient Mask */}
                <div className="absolute inset-0 z-0 select-none">
                    <img
                        src="https://images.unsplash.com/photo-1540206395-688085723adb?q=80&w=2576&auto=format&fit=crop"
                        alt=""
                        className="w-full h-full object-cover opacity-80"
                        style={{ maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)', WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)' }}
                    />
                    <div className="absolute inset-0 bg-teal-900/10 mix-blend-overlay"></div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                            <p className="text-slate-600 font-bold">Finding best opportunities...</p>
                        </div>
                    </div>
                )}

                {/* Abstract Background Decoration - Softer */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-teal-200/40 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none z-0"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-200/40 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/4 pointer-events-none z-0"></div>

                <div className="container mx-auto max-w-5xl relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
                        <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-md border border-slate-200/60 px-4 py-1.5 rounded-full mb-6 shadow-sm ring-1 ring-white/50">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">Curated Vacancies</span>
                        </div>
                        <h1 className="text-4xl lg:text-7xl font-black mb-6 tracking-tighter text-slate-900 leading-[1] lg:leading-[0.95]">
                            Find Your <br className="hidden md:block" />
                            <span className="text-teal-600 inline-block transform hover:-rotate-1 transition-transform duration-300 origin-bottom-left cursor-default">Next Chapter</span>
                        </h1>
                        <p className="text-slate-600 text-base lg:text-xl font-medium max-w-xl mx-auto leading-relaxed mix-blend-multiply">
                            Exclusive opportunities at world-class Maldivian resorts. Hand-picked for the ambitious professional.
                        </p>
                    </div>

                    {/* SEARCH BAR - Premium Redesign */}
                    <div className="max-w-4xl mx-auto relative z-20">
                        <div className="bg-white rounded-2xl md:rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-slate-200/60 flex flex-col md:flex-row items-center md:p-2 overflow-hidden md:overflow-visible transition-shadow hover:shadow-[0_15px_35px_rgb(0,0,0,0.08)] duration-500">

                            <div className="w-full md:flex-1 flex items-center px-4 md:px-6 h-12 md:h-14 relative group border-b border-slate-100 md:border-none">
                                <Search className="w-4 h-4 md:w-5 md:h-5 text-slate-400 mr-3 md:mr-4 group-focus-within:text-teal-600 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Job title, keywords..."
                                    className="w-full bg-transparent border-none focus:ring-0 text-sm md:text-base font-medium text-slate-700 placeholder-slate-400 outline-none h-full truncate"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-8 bg-slate-200"></div>
                            </div>

                            <div className="w-full md:w-[35%] flex items-center px-4 md:px-6 h-12 md:h-14 relative cursor-pointer hover:bg-slate-50 transition-colors">
                                <MapPin className="w-4 h-4 md:w-5 md:h-5 text-slate-400 mr-3 md:mr-4" />
                                <div className="flex-1 min-w-0">
                                    <span className="block text-sm font-medium text-slate-700 truncate">Maldives, All Islands</span>
                                </div>
                                <ChevronDown className="w-4 h-4 text-slate-300 ml-2" />
                            </div>

                            <div className="w-full md:w-auto md:pl-2">
                                <button className="w-full md:w-auto h-12 md:h-12 bg-[#0B1A33] hover:bg-[#162a4d] text-white px-8 md:rounded-full font-medium text-sm transition-all shadow-none md:shadow-md flex items-center justify-center rounded-none md:rounded-full">
                                    Search
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* 2. STICKY FILTER NAVIGATION */}
            <div className="sticky top-0 z-30 bg-slate-50/95 backdrop-blur-sm border-b border-slate-200/50">
                <div className="container mx-auto max-w-7xl px-4 md:px-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between py-4 gap-4 md:gap-0">

                        <div className="relative">
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className={`flex items-center gap-3 px-6 py-3 rounded-xl border text-sm font-bold transition-all ${isFilterOpen || selectedIndustry !== 'All' ? 'bg-[#0B1A33] text-white border-[#0B1A33] shadow-lg' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:shadow-sm'}`}
                            >
                                <Filter className="w-4 h-4" />
                                <span>Category: <span className="text-teal-400">{selectedIndustry}</span></span>
                                <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isFilterOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)}></div>
                                    <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-20 animate-in fade-in zoom-in-95 duration-200">
                                        <div className="max-h-[300px] overflow-y-auto no-scrollbar space-y-1">
                                            <button
                                                onClick={() => {
                                                    setSearchParams({ ...Object.fromEntries(searchParams), category: 'All' });
                                                    setIsFilterOpen(false);
                                                }}
                                                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${selectedIndustry === 'All' ? 'bg-teal-50 text-teal-700' : 'text-slate-500 hover:bg-slate-50'}`}
                                            >
                                                All Categories
                                            </button>
                                            {INDUSTRIES.map((ind) => (
                                                <button
                                                    key={ind}
                                                    onClick={() => {
                                                        setSearchParams({ ...Object.fromEntries(searchParams), category: ind });
                                                        setIsFilterOpen(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${selectedIndustry === ind ? 'bg-teal-50 text-teal-700' : 'text-slate-500 hover:bg-slate-50'}`}
                                                >
                                                    {ind}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>


                    </div>
                </div>
            </div>

            <div className="container mx-auto max-w-7xl px-4 md:px-6 mt-12">

                {/* 3. FEATURED / PREMIUM CARDS (Editorial Style) */}
                <div className="mb-20">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600"><Star className="w-4 h-4 fill-current" /></div>
                        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Editor's Choice</h2>
                    </div>
                    <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory pb-8 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar">
                        {jobs.filter(j => j.status === 'Current Opening' && (selectedIndustry === 'All' || j.industry === selectedIndustry)).slice(0, 3).map((job, idx) => (
                            <Link to={`/job/${job.id}`} key={idx} className="flex-shrink-0 w-[70%] md:w-auto snap-center [scroll-snap-stop:always] group bg-white rounded-[2rem] p-1 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 cursor-pointer">
                                <div className="bg-slate-50 rounded-[1.8rem] p-4 md:p-8 h-full flex flex-col items-start relative overflow-hidden group-hover:bg-[#0B1A33] transition-colors duration-500">
                                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10"></div>

                                    <div className="flex items-start justify-between w-full mb-6 z-10">
                                        <span className="px-3 py-1 bg-white rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-sm border border-slate-100">Premium</span>
                                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-900 shadow-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                            <ArrowRight className="w-4 h-4 -rotate-45" />
                                        </div>
                                    </div>

                                    <div className="z-10 mt-auto">
                                        <h3 className="text-xl font-black text-slate-900 leading-tight mb-2 group-hover:text-white transition-colors w-[90%]">{job.title}</h3>
                                        <p className="text-sm font-bold text-slate-400 group-hover:text-slate-300 transition-colors uppercase tracking-wider mb-4">{job.company}</p>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[11px] font-bold text-teal-600 group-hover:text-teal-400 bg-teal-50 group-hover:bg-white/10 px-2 py-1 rounded">{job.location}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* 4. MAIN JOB LIST */}
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Sidebar (Desktop Only) */}
                    <div className="hidden lg:block w-64 flex-shrink-0 space-y-10">
                        <div>
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6">Categories</h3>
                            <div className="space-y-1">
                                {['Hospitality', 'Engineering', 'Food & Bev', 'Management', 'Marine', 'IT'].map(cat => (
                                    <div
                                        key={cat}
                                        onClick={() => setSearchParams({ ...Object.fromEntries(searchParams), category: cat })}
                                        className={`flex items-center justify-between group cursor-pointer py-2 transition-colors ${selectedIndustry === cat ? 'text-teal-600 font-bold' : 'text-slate-500 hover:text-teal-600'}`}
                                    >
                                        <span className="text-sm font-semibold">{cat}</span>
                                        <span className={`text-[10px] font-bold border shadow-sm px-2 py-0.5 rounded-md transition-colors ${selectedIndustry === cat ? 'bg-teal-50 text-teal-700 border-teal-100' : 'bg-white text-slate-400 border-slate-200 group-hover:bg-teal-50 group-hover:text-teal-600'}`}>
                                            {jobs.filter(j => (j.industry === cat) && (sortBy === 'closed' ? j.status === JobStatus.CLOSED : j.status === JobStatus.OPEN)).length}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>


                    </div>

                    {/* Job Feed */}
                    <div className="flex-1">
                        <div className="sticky top-[80px] z-20 bg-slate-100 md:bg-transparent pb-4 pt-2">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                                    {sortBy === 'closed' ? 'Closed Roles' : 'Recent Openings'}
                                </h3>
                                <div className="relative">
                                    <button
                                        onClick={() => setIsSortOpen(!isSortOpen)}
                                        className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 flex items-center gap-2 cursor-pointer hover:border-teal-500 transition-colors shadow-sm"
                                    >
                                        Sort by: {sortBy === 'closed' ? 'Closed' : 'Recent'} <ChevronDown className="w-3 h-3" />
                                    </button>

                                    {isSortOpen && (
                                        <>
                                            <div className="fixed inset-0 z-10" onClick={() => setIsSortOpen(false)}></div>
                                            <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-xl border border-slate-100 p-1 z-20 animate-in fade-in zoom-in-95 duration-200">
                                                <button
                                                    onClick={() => { setSortBy('recent'); setIsSortOpen(false); }}
                                                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-colors ${sortBy === 'recent' ? 'bg-teal-50 text-teal-700' : 'text-slate-500 hover:bg-slate-50'}`}
                                                >
                                                    Recent (Open)
                                                </button>
                                                <button
                                                    onClick={() => { setSortBy('closed'); setIsSortOpen(false); }}
                                                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-colors ${sortBy === 'closed' ? 'bg-red-50 text-red-700' : 'text-slate-500 hover:bg-slate-50'}`}
                                                >
                                                    Closed
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* SCROLLABLE CONTAINER */}
                        <div ref={scrollContainerRef} className="h-[calc(100vh-250px)] overflow-y-auto pr-2 pb-20 no-scrollbar md:custom-scrollbar">
                            <div className={`
                grid grid-cols-1 gap-4
                md:grid-cols-1 md:gap-6
                ${viewType === 'grid' ? 'md:grid-cols-2' : ''}
              `}>
                                {filteredJobs.length > 0 ? filteredJobs.map(job => (
                                    viewType === 'list' ? (
                                        job.status === JobStatus.CLOSED ? (
                                            <div
                                                key={job.id}
                                                onClick={() => setExpandedJobId(expandedJobId === job.id ? null : job.id)}
                                                className={`w-full group bg-white md:bg-white/80 md:backdrop-blur-sm rounded-3xl p-4 md:p-6 border-2 border-red-200 shadow-sm hover:shadow-md hover:border-red-300 transition-all duration-300 flex flex-col relative cursor-pointer ${expandedJobId === job.id ? 'bg-red-50/30' : 'bg-red-50/10'}`}
                                            >
                                                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                                                    {/* Share Button (Mobile Absolute, Desktop Inline) */}
                                                    <button
                                                        onClick={(e) => handleShare(e, job)}
                                                        className="md:hidden absolute top-6 right-6 p-2 rounded-full transition-all z-10 text-teal-600 bg-teal-50 opacity-100"
                                                        title="Share Job"
                                                    >
                                                        <Share2 className="w-5 h-5" />
                                                    </button>

                                                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-black border border-slate-100 transition-colors bg-teal-600 text-white md:bg-white md:text-slate-900 md:shadow-md md:group-hover:scale-110 md:group-hover:rotate-3 duration-300">
                                                        {job.company.charAt(0)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-lg font-bold mb-1 truncate transition-colors text-teal-600 md:text-slate-900 md:group-hover:text-teal-600">{job.title}</h3>
                                                        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-medium text-slate-500">
                                                            <span className="uppercase tracking-wider font-bold text-slate-400">{job.company}</span>
                                                            <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md"><MapPin className="w-3 h-3" /> {job.location}</span>
                                                            <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md"><Clock className="w-3 h-3" /> 2d ago</span>
                                                        </div>
                                                    </div>

                                                    {/* Actions Column */}
                                                    <div className="flex flex-col items-end gap-3 pl-4 border-l border-slate-100 min-w-[140px]">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-black text-slate-900">{job.salaryRange || job.salary_range}</span>
                                                        </div>
                                                        <span className="inline-flex items-center justify-center w-full px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-600">
                                                            {expandedJobId === job.id ? 'Close Details' : 'View Details'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Expanded Content */}
                                                <div className={`grid transition-all duration-300 ease-in-out ${expandedJobId === job.id ? 'grid-rows-[1fr] opacity-100 mt-6 pt-6 border-t border-red-100' : 'grid-rows-[0fr] opacity-0'}`}>
                                                    <div className="overflow-hidden">
                                                        <div className="grid md:grid-cols-2 gap-8">
                                                            <div>
                                                                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Description</h4>
                                                                <p className="text-sm text-slate-600 leading-relaxed">{job.description}</p>
                                                            </div>
                                                            <div>
                                                                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Requirements</h4>
                                                                <ul className="text-sm text-slate-600 space-y-2">
                                                                    {job.requirements.map((req, i) => (
                                                                        <li key={i} className="flex items-start gap-2">
                                                                            <span className="w-1.5 h-1.5 rounded-full bg-red-300 mt-1.5 shrink-0" />
                                                                            {req}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <Link key={job.id} to={`/job/${job.id}`} className="w-full group bg-white md:bg-white/80 md:backdrop-blur-sm rounded-3xl p-4 md:p-6 border border-slate-200 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-teal-500/30 hover:-translate-y-1 transition-all duration-300 flex flex-col md:flex-row items-start md:items-center gap-6 relative">
                                                {/* Share Button (Mobile Absolute, Desktop Inline) */}
                                                <button
                                                    onClick={(e) => handleShare(e, job)}
                                                    className="md:hidden absolute top-6 right-6 p-2 rounded-full transition-all z-10 text-teal-600 bg-teal-50 opacity-100"
                                                    title="Share Job"
                                                >
                                                    <Share2 className="w-5 h-5" />
                                                </button>

                                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-black border border-slate-100 transition-colors bg-teal-600 text-white md:bg-white md:text-slate-900 md:shadow-md md:group-hover:scale-110 md:group-hover:rotate-3 duration-300">
                                                    {job.company.charAt(0)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-lg font-bold mb-1 truncate transition-colors text-teal-600 md:text-slate-900 md:group-hover:text-teal-600">{job.title}</h3>
                                                    <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-medium text-slate-500">
                                                        <span className="uppercase tracking-wider font-bold text-slate-400">{job.company}</span>
                                                        <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md"><MapPin className="w-3 h-3" /> {job.location}</span>
                                                        <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md"><Clock className="w-3 h-3" /> 2d ago</span>
                                                    </div>
                                                </div>

                                                {/* Actions Column */}
                                                <div className="flex flex-col items-end gap-3 pl-4 border-l border-slate-100 min-w-[140px]">
                                                    <div className="flex items-center gap-2">
                                                        {/* Desktop Share Button Inline */}
                                                        <button
                                                            onClick={(e) => handleShare(e, job)}
                                                            className="hidden md:flex p-1.5 text-slate-300 hover:text-teal-600 hover:bg-teal-50 rounded-full transition-all"
                                                            title="Share Job"
                                                        >
                                                            <Share2 className="w-4 h-4" />
                                                        </button>
                                                        <span className="text-sm font-black text-slate-900">{job.salaryRange || job.salary_range}</span>
                                                    </div>
                                                    <span className="inline-flex items-center justify-center w-full px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all bg-[#0B1A33] text-white md:bg-white md:border md:border-slate-200 md:text-slate-600 md:group-hover:bg-[#0B1A33] md:group-hover:text-white md:group-hover:border-transparent md:shadow-sm">
                                                        Apply Now
                                                    </span>
                                                </div>
                                            </Link>
                                        )
                                    ) : (
                                        <Link key={job.id} to={job.status === JobStatus.CLOSED ? '#' : `/job/${job.id}`} className={`w-full group bg-white md:bg-white/80 md:backdrop-blur-sm rounded-[2.5rem] p-4 md:p-8 border shadow-sm hover:shadow-[0_20px_40px_-5px_rgba(0,0,0,0.06)] hover:-translate-y-2 transition-all duration-300 flex flex-col relative overflow-hidden ${job.status === JobStatus.CLOSED ? 'border-red-200 bg-red-50/10 hover:border-red-300' : 'border-slate-200 hover:border-teal-500/30'}`}>
                                            <div className="absolute -right-20 -top-20 w-40 h-40 bg-teal-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                                            <div className="flex items-start justify-between mb-6 relative z-10">
                                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-black transition-all bg-teal-600 text-white md:bg-white md:text-slate-900 md:shadow-md md:group-hover:scale-110 md:group-hover:-rotate-3 duration-300 border border-slate-50">
                                                    {job.company.charAt(0)}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={(e) => handleShare(e, job)}
                                                        className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-full transition-all"
                                                        title="Share Job"
                                                    >
                                                        <Share2 className="w-4 h-4" />
                                                    </button>
                                                    <span className="px-3 py-1 rounded-full border border-slate-100 bg-slate-50/50 text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:bg-white group-hover:shadow-sm transition-all">{job.type}</span>
                                                </div>
                                            </div>

                                            <div className="relative z-10">
                                                <h3 className="text-xl font-bold mb-2 leading-tight transition-colors text-teal-600 md:text-slate-900 md:group-hover:text-teal-600">{job.title}</h3>
                                                <p className="text-sm font-medium text-slate-400 mb-8">{job.company}</p>
                                            </div>

                                            <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between relative z-10">
                                                <span className="text-sm font-black text-slate-900 bg-slate-50 px-3 py-1.5 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all">{job.salaryRange || job.salary_range}</span>
                                                {job.status === JobStatus.CLOSED ? (
                                                    <div className="px-3 py-1.5 rounded-lg bg-red-100 text-red-600 text-[10px] font-black uppercase tracking-widest">
                                                        Closed
                                                    </div>
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full flex items-center justify-center transition-all bg-[#0B1A33] text-white md:bg-slate-50 md:text-slate-400 md:group-hover:bg-[#0B1A33] md:group-hover:text-white md:group-hover:shadow-lg md:group-hover:scale-110">
                                                        <ArrowRight className="w-4 h-4" />
                                                    </div>
                                                )}
                                            </div>
                                        </Link>
                                    )
                                )) : (
                                    <div className="col-span-full py-20 text-center bg-white rounded-[3rem] shadow-sm ring-1 ring-slate-100">
                                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Search className="w-8 h-8 text-slate-300" />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-2">No jobs found</h3>
                                        <p className="text-slate-500 max-w-xs mx-auto mb-8">We couldn't find any positions matching your search.</p>
                                        <button onClick={clearCategory} className="px-6 py-3 bg-[#0B1A33] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-black transition-all">
                                            Clear Filters
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrowseJobsPage;
