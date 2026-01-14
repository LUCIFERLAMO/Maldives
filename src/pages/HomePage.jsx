import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
   ArrowRight,
   Briefcase,
   Search,
   Sparkles,
   Star,
   Calendar,
   CheckCircle2,
   Users
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const HomePage = () => {
   const navigate = useNavigate();
   const [jobStats, setJobStats] = useState({
      totalJobs: 0,
      activeJobs: 0
   });

   useEffect(() => {
      async function fetchJobStats() {
         try {
            const { count: totalCount } = await supabase
               .from('jobs')
               .select('*', { count: 'exact', head: true });

            const { count: activeCount } = await supabase
               .from('jobs')
               .select('*', { count: 'exact', head: true })
               .eq('status', 'Current Opening');

            setJobStats({
               totalJobs: totalCount || 0,
               activeJobs: activeCount || 0
            });
         } catch (error) {
            console.error('Error fetching stats:', error);
         }
      }

      fetchJobStats();
   }, []);

   const handleGetStarted = () => {
      navigate('/register');
   };

   return (
      <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">

         {/* 1. HERO SECTION */}
         <section className="relative bg-white min-h-[600px] lg:min-h-[700px] flex items-center pt-10 pb-16 lg:pt-16 lg:pb-16 overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-[50%] h-full bg-slate-50/50 -z-10 rounded-bl-[100px] hidden lg:block"></div>
            {/* Mobile Background Decoration */}
            <div className="absolute top-0 right-0 w-full h-[60%] bg-slate-50/30 -z-10 rounded-bl-[50px] lg:hidden"></div>

            <div className="container mx-auto px-5 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
               <div className="max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 bg-white px-4 py-2 lg:px-5 lg:py-2.5 rounded-full border border-teal-100 mb-8 lg:mb-10 shadow-[0_2px_20px_-5px_rgba(20,184,166,0.15)] mx-auto lg:mx-0">
                     <Sparkles className="w-3 h-3 lg:w-4 lg:h-4 text-teal-500 fill-teal-500" />
                     <span className="text-[10px] lg:text-[11px] font-black uppercase tracking-[0.2em] text-teal-800">Premier Talent Gateway</span>
                  </div>

                  {/* Headline */}
                  <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight mb-6 lg:mb-8">
                     Find Your <span className="text-teal-600">Dream Job</span> <br className="hidden md:block" />
                     With Your Interests <br className="hidden md:block" />
                     And <span className="text-teal-600">Skills.</span>
                  </h1>

                  {/* Subheadline */}
                  <p className="text-slate-500 text-base md:text-lg lg:text-xl max-w-lg mb-8 lg:mb-12 leading-relaxed font-medium mx-auto lg:mx-0">
                     Connect with the most prestigious luxury resorts and healthcare institutions across the Maldives. Your island career starts here.
                  </p>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 lg:gap-8 justify-center lg:justify-start">
                     <Link
                        to="/jobs"
                        className="w-full sm:w-auto px-8 py-4 lg:px-10 lg:py-5 bg-teal-600 text-white rounded-2xl font-black uppercase text-[11px] lg:text-xs tracking-[0.2em] shadow-xl shadow-teal-600/20 hover:bg-teal-700 hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                     >
                        Browse Jobs <ArrowRight className="w-4 h-4" />
                     </Link>

                     {/* Social Proof */}
                     <div className="flex items-center gap-4 lg:gap-5">
                        <div className="flex -space-x-3 lg:-space-x-4">
                           {[1, 2, 3, 4].map(i => (
                              <div key={i} className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border-[3px] border-white bg-slate-200 overflow-hidden shadow-md">
                                 <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="user" className="w-full h-full object-cover" />
                              </div>
                           ))}
                        </div>
                        <div className="text-left">
                           <div className="text-sm lg:text-base font-black text-slate-900 leading-none">
                              {jobStats.totalJobs > 0 ? `${jobStats.totalJobs}+` : '20k+'}
                           </div>
                           <div className="text-[9px] lg:text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5 lg:mt-1">Active Talent</div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Hero Image Group */}
               <div className="relative hidden lg:block">
                  <div className="relative z-10 w-full max-w-[480px] ml-auto">
                     <div className="relative rounded-[3rem] overflow-visible">
                        {/* Main Image */}
                        <img
                           src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1576&auto=format&fit=crop"
                           alt="Professional"
                           className="rounded-[3rem] shadow-2xl w-full h-[550px] object-cover object-center"
                        />

                        {/* Floating Badge 1 */}
                        <div className="absolute top-24 -left-16 bg-white p-5 pr-10 rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-50 flex items-center gap-5 animate-bounce-slow">
                           <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center">
                              <Briefcase className="w-7 h-7" />
                           </div>
                           <div>
                              <div className="text-xl font-black text-slate-900 tracking-tight">250+ Jobs</div>
                              <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Posted Daily</div>
                           </div>
                        </div>

                        {/* Floating Badge 2 */}
                        <div className="absolute bottom-32 -right-8 bg-white p-5 rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-50 flex items-center gap-4">
                           <div className="flex items-center gap-2">
                              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xs">A</div>
                              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-xs -ml-4 border-2 border-white">B</div>
                              <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-xs -ml-4 border-2 border-white">C</div>
                           </div>
                           <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                              Top Talent <br /> Hired
                           </div>
                        </div>

                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* 2. SERVICES SECTION */}
         <section className="py-20 lg:py-32 bg-white">
            <div className="container mx-auto px-5 lg:px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

               {/* Image Side */}
               <div className="relative order-2 lg:order-1">
                  <div className="absolute inset-0 bg-teal-600 rounded-[2.5rem] lg:rounded-[3rem] rotate-3 opacity-10 scale-95"></div>
                  <img
                     src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2670&auto=format&fit=crop"
                     alt="Team"
                     className="relative rounded-[2.5rem] lg:rounded-[3rem] shadow-xl lg:shadow-2xl w-full h-[400px] lg:h-[600px] object-cover"
                  />
               </div>

               {/* Content Side */}
               <div className="order-1 lg:order-2 text-center lg:text-left">
                  <h2 className="text-4xl lg:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight mb-6 lg:mb-10">
                     Our Services Is To <br className="hidden md:block" />
                     Help You To <br className="hidden md:block" />
                     Get Hired By <br className="hidden md:block" />
                     <span className="text-teal-600">Great Company</span>
                  </h2>

                  <p className="text-slate-500 text-base lg:text-lg mb-10 lg:mb-12 leading-relaxed font-medium max-w-xl mx-auto lg:mx-0">
                     We don't just list jobs. We provide a full-spectrum vetting and document handling service that ensures your transition to the Maldives is professional, compliant, and exciting.
                  </p>

                  <div className="grid grid-cols-3 gap-6 lg:gap-12 mb-10 lg:mb-14 border-y lg:border-none border-slate-100 py-8 lg:py-0">
                     <div>
                        <div className="text-2xl lg:text-4xl font-black text-teal-600 mb-1 lg:mb-2">
                           {jobStats.totalJobs > 0 ? `${jobStats.totalJobs}+` : '86k+'}
                        </div>
                        <div className="text-[9px] lg:text-[10px] text-slate-400 font-bold uppercase tracking-widest">Total Jobs</div>
                     </div>
                     <div>
                        <div className="text-2xl lg:text-4xl font-black text-teal-600 mb-1 lg:mb-2">81k+</div>
                        <div className="text-[9px] lg:text-[10px] text-slate-400 font-bold uppercase tracking-widest">Talent Pool</div>
                     </div>
                     <div>
                        <div className="text-2xl lg:text-4xl font-black text-teal-600 mb-1 lg:mb-2">97%</div>
                        <div className="text-[9px] lg:text-[10px] text-slate-400 font-bold uppercase tracking-widest">Satisfaction</div>
                     </div>
                  </div>

                  <button
                     onClick={handleGetStarted}
                     className="w-full lg:w-auto px-10 py-4 lg:py-5 bg-[#0b1a33] text-white rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] hover:bg-black hover:scale-105 transition-all shadow-xl"
                  >
                     Get Started
                  </button>
               </div>
            </div>
         </section>

         {/* 3. ARTICLES SECTION */}
         <section className="py-20 lg:py-32 bg-[#f8fafc]">
            <div className="container mx-auto px-5 lg:px-6">

               <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-20">
                  <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                     Read Our Articles That Will Help <br className="hidden md:block" />
                     You To Secure A Great Job
                  </h2>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
                  {[
                     { title: "How to pass your resort interview with zero prior experience", date: "OCT 24, 2024", img: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800" },
                     { title: "The ultimate guide to work permits in the Maldives", date: "OCT 20, 2024", img: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?q=80&w=800" },
                     { title: "Top 10 skills luxury resorts are looking for right now", date: "OCT 15, 2024", img: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=800" }
                  ].map((article, i) => (
                     <Link to="/support" key={i} className="group bg-white rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                        <div className="h-56 lg:h-64 overflow-hidden relative">
                           <img
                              src={article.img}
                              alt="Layout"
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                           />
                           <div className="absolute top-5 left-5 lg:top-6 lg:left-6 px-3 py-1.5 lg:px-4 lg:py-2 bg-white/95 backdrop-blur-md rounded-xl shadow-lg">
                              <div className="flex items-center gap-2 text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-teal-700">
                                 <Calendar className="w-3 h-3" /> {article.date}
                              </div>
                           </div>
                        </div>
                        <div className="p-8 lg:p-10">
                           <h3 className="text-lg lg:text-xl font-black text-slate-900 leading-snug mb-6 lg:mb-8 group-hover:text-teal-600 transition-colors">
                              {article.title}
                           </h3>

                           <div className="flex items-center gap-2 text-[9px] lg:text-[10px] font-black text-teal-600 uppercase tracking-widest group/btn">
                              Read More <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                           </div>
                        </div>
                     </Link>
                  ))}
               </div>
            </div>
         </section>

         {/* 4. PARTNERS SECTION (Admin & Agent) */}
         <section className="py-20 bg-white border-t border-slate-50">
            <div className="container mx-auto px-5 lg:px-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                  {/* Agent Portal Card */}
                  <div className="group relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-10 lg:p-12 text-white shadow-2xl">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                     <div className="relative z-10">
                        <div className="w-12 h-12 bg-teal-500/20 rounded-2xl flex items-center justify-center mb-8 border border-teal-500/20">
                           <Users className="w-6 h-6 text-teal-400" />
                        </div>
                        <h3 className="text-2xl lg:text-3xl font-black mb-4 tracking-tight">Recruiting Agency?</h3>
                        <p className="text-slate-400 mb-8 leading-relaxed font-medium">
                           Manage your candidates, track applications, and connect with top resorts.
                        </p>
                        <Link
                           to="/login"
                           state={{ from: 'agent' }}
                           className="inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-teal-400 hover:text-white transition-colors group/link"
                        >
                           Access Agent Portal <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                        </Link>
                     </div>
                  </div>

                  {/* Admin Portal Card */}
                  <div className="group relative overflow-hidden rounded-[2.5rem] bg-slate-50 p-10 lg:p-12 text-slate-900 border border-slate-100">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-slate-200/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                     <div className="relative z-10">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm">
                           <CheckCircle2 className="w-6 h-6 text-slate-900" />
                        </div>
                        <h3 className="text-2xl lg:text-3xl font-black mb-4 tracking-tight">Platform Admin</h3>
                        <p className="text-slate-500 mb-8 leading-relaxed font-medium">
                           Monitor system health, manage users, and oversee the recruitment ecosystem.
                        </p>
                        <Link
                           to="/login"
                           state={{ from: 'admin' }}
                           className="inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-slate-900 hover:text-teal-600 transition-colors group/link"
                        >
                           Access Admin Portal <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                        </Link>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* 4. NEWSLETTER (Kept as matching style/theme) */}
         <section className="container mx-auto px-5 lg:px-6 -mb-20 lg:-mb-24 relative z-20">
            <div className="bg-[#0b1a33] rounded-[2.5rem] lg:rounded-[3rem] p-10 lg:p-24 text-white flex flex-col xl:flex-row items-center justify-between gap-10 lg:gap-16 shadow-2xl relative overflow-hidden text-center xl:text-left">
               {/* Effects */}
               <div className="absolute top-0 right-0 w-[300px] lg:w-[500px] h-[300px] lg:h-[500px] bg-teal-500/20 rounded-full blur-[80px] lg:blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

               <div className="max-w-xl relative">
                  <h3 className="text-2xl lg:text-4xl font-black tracking-tight mb-4 lg:mb-6">
                     Subscribe Our <span className="text-teal-400">Newsletter</span>
                  </h3>
                  <p className="text-slate-400 font-medium text-base lg:text-lg">
                     Get the latest job alerts and career advice directly in your inbox. No spam, just opportunities.
                  </p>
               </div>

               <div className="w-full max-w-lg relative">
                  <div className="flex flex-col sm:flex-row gap-3 bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-md focus-within:bg-white/10 transition-colors">
                     <input
                        type="email"
                        placeholder="Enter your email..."
                        className="bg-transparent flex-1 px-6 py-4 text-white placeholder-slate-400 outline-none font-medium text-center sm:text-left text-sm"
                     />
                     <button className="bg-teal-600 hover:bg-teal-500 px-8 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg w-full sm:w-auto">
                        Subscribe
                     </button>
                  </div>
               </div>
            </div>
         </section>

         {/* Spacer for footer */}
         <div className="h-32 lg:h-40 bg-slate-50"></div>

      </div>
   );
};

export default HomePage;
