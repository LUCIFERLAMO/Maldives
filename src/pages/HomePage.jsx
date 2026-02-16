import React, { useState, useEffect } from 'react';
import {
   ArrowRight,
   Briefcase,
   Search,
   Sparkles,
   Star,
   Calendar,
   CheckCircle2,
   Users,
   Palmtree,
   Utensils,
   Stethoscope,
   Ship,
   Building2,
   GraduationCap
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
            const response = await fetch('http://localhost:5000/api/jobs');
            const jobs = await response.json();

            setJobStats({
               totalJobs: jobs.length || 0,
               activeJobs: jobs.filter(j => j.status === 'Current Opening').length || 0
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

   const categories = [
      { name: 'Resort & Hospitality', icon: Palmtree, count: '120+', color: 'text-teal-600', bg: 'bg-teal-50' },
      { name: 'Culinary & Kitchen', icon: Utensils, count: '85+', color: 'text-orange-600', bg: 'bg-orange-50' },
      { name: 'Healthcare', icon: Stethoscope, count: '45+', color: 'text-blue-600', bg: 'bg-blue-50' },
      { name: 'Marine & Water Sports', icon: Ship, count: '30+', color: 'text-cyan-600', bg: 'bg-cyan-50' },
      { name: 'Corporate & Admin', icon: Building2, count: '60+', color: 'text-purple-600', bg: 'bg-purple-50' },
      { name: 'Education', icon: GraduationCap, count: '25+', color: 'text-pink-600', bg: 'bg-pink-50' },
   ];

   return (
      <div className="min-h-screen bg-slate-50/50 font-sans text-slate-900 overflow-x-hidden selection:bg-teal-100 selection:text-teal-900">

         {/* 1. HERO SECTION */}
         <section className="relative pt-8 pb-10 lg:pt-16 lg:pb-12 overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
               <div className="absolute top-0 right-[-10%] w-[600px] h-[600px] bg-teal-100/40 rounded-full blur-[100px] mix-blend-multiply"></div>
               <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-[100px] mix-blend-multiply"></div>
            </div>

            <div className="container mx-auto px-5 lg:px-6 relative z-10">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                  {/* Text Content */}
                  <div className="w-full text-center lg:text-left order-2 lg:order-1">

                     {/* Badge */}
                     <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-teal-100 mb-8 shadow-sm hover:shadow-md transition-all cursor-default mx-auto lg:mx-0 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <Sparkles className="w-3 h-3 text-teal-500 fill-teal-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-900">Premier Talent Gateway</span>
                     </div>

                     {/* Headline */}
                     <h1 className="text-5xl lg:text-[5.5rem] font-black text-slate-900 leading-[0.95] tracking-tighter mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                        Find Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-500">Dream Career</span> <br />
                        In Paradise.
                     </h1>

                     {/* Subheadline */}
                     <p className="text-slate-500 text-lg lg:text-xl max-w-lg mb-10 leading-relaxed font-medium mx-auto lg:mx-0 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                        Connect with the most prestigious luxury resorts and healthcare institutions across the Maldives.
                     </p>

                     {/* Actions */}
                     <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                        <Link
                           to="/jobs"
                           className="w-full sm:w-auto px-10 py-5 bg-[#0F172A] text-white rounded-2xl font-black uppercase text-xs tracking-[0.15em] shadow-xl shadow-slate-900/10 hover:shadow-2xl hover:shadow-slate-900/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 group"
                        >
                           Browse Jobs <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                           to="/register"
                           className="w-full sm:w-auto px-10 py-5 bg-white text-slate-900 border border-slate-200 rounded-2xl font-black uppercase text-xs tracking-[0.15em] hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-3"
                        >
                           Post a Job
                        </Link>
                     </div>

                     {/* Stats/Social Proof */}
                     <div className="mt-12 flex items-center gap-6 justify-center lg:justify-start animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
                        <div className="flex -space-x-4">
                           {[1, 2, 3, 4].map(i => (
                              <div key={i} className="w-12 h-12 rounded-full border-[3px] border-white bg-slate-200 overflow-hidden shadow-sm">
                                 <img src={`https://i.pravatar.cc/150?u=${i + 20}`} alt="user" className="w-full h-full object-cover" />
                              </div>
                           ))}
                        </div>
                        <div>
                           <p className="text-sm font-bold text-slate-900">Trusted by <span className="text-teal-600">500+</span> Companies</p>
                           <div className="flex gap-1 mt-1">
                              {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />)}
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Hero Image */}
                  <div className="relative hidden lg:block order-1 lg:order-2">
                     <div className="relative">
                        {/* Main Image Container */}
                        <div className="relative rounded-[3rem] overflow-hidden shadow-2xl shadow-teal-900/10 rotate-2 hover:rotate-0 transition-transform duration-700 ease-out-expo">
                           <img
                              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1576&auto=format"
                              alt="Professional"
                              className="w-full h-[650px] object-cover object-[center_25%]"
                           />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                        </div>

                        {/* Floating Glass Cards */}
                        <div className="absolute top-20 -left-12 bg-white/90 backdrop-blur-md p-5 pr-8 rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] border border-white/50 flex items-center gap-4 animate-bounce-slow z-20">
                           <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center">
                              <Briefcase className="w-7 h-7" />
                           </div>
                           <div>
                              <div className="text-xl font-black text-slate-900 tracking-tight">{jobStats.totalJobs > 0 ? jobStats.totalJobs : '250'}+</div>
                              <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-0.5">Active Jobs</div>
                           </div>
                        </div>

                        <div className="absolute bottom-40 -right-8 bg-white/90 backdrop-blur-md p-6 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] border border-white/50 animate-bounce-slow delay-700 z-20 max-w-[200px]">
                           <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden">
                                 <img src="https://i.pravatar.cc/150?u=33" alt="" className="w-full h-full object-cover" />
                              </div>
                              <div>
                                 <p className="text-xs font-bold text-slate-900">Sarah Jen</p>
                                 <p className="text-[10px] text-slate-500">Hired 2m ago</p>
                              </div>
                           </div>
                           <div className="text-xs font-medium text-slate-600 leading-snug">
                              "Found my dream role at St. Regis Maldives!"
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* 2. FEATURED CATEGORIES */}
         <section className="py-10 bg-white">
            <div className="container mx-auto px-5 lg:px-6">
               <div className="text-center max-w-2xl mx-auto mb-16">
                  <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-4 tracking-tight">Explore Categories</h2>
                  <p className="text-slate-500 text-lg">Browse opportunities by industry to find the perfect fit for your expertise.</p>
               </div>

               <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 lg:gap-6">
                  {categories.map((cat, idx) => (
                     <div key={idx} className="group p-6 rounded-[2rem] bg-slate-50 border border-slate-100 hover:bg-white hover:border-teal-100 hover:shadow-xl hover:shadow-teal-900/5 transition-all duration-300 cursor-pointer text-center">
                        <div className={`w-14 h-14 mx-auto rounded-2xl ${cat.bg} ${cat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                           <cat.icon className="w-7 h-7" />
                        </div>
                        <h3 className="font-bold text-slate-900 mb-1">{cat.name}</h3>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{cat.count} Jobs</p>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         {/* 3. SERVICES SECTION */}
         <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
            {/* Background Patterns */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

            <div className="container mx-auto px-5 lg:px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">
               {/* Image Side */}
               <div className="relative order-2 lg:order-1">
                  <div className="absolute inset-0 bg-teal-500 rounded-[2.5rem] rotate-3 opacity-20 scale-105 blur-2xl"></div>
                  <img
                     src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2664&auto=format&fit=crop"
                     alt="Team"
                     className="relative rounded-[2.5rem] shadow-2xl w-full h-[500px] object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  />
               </div>

               {/* Content Side */}
               <div className="order-1 lg:order-2 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-8 border border-white/10">
                     <Users className="w-4 h-4 text-teal-400" />
                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-100">For Employers</span>
                  </div>
                  <h2 className="text-4xl lg:text-6xl font-black text-white leading-[1] tracking-tighter mb-8">
                     Build Your <br />
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300">World-Class Team</span>
                  </h2>

                  <p className="text-slate-400 text-lg mb-12 leading-relaxed max-w-xl mx-auto lg:mx-0">
                     We provide a full-spectrum vetting and document handling service that ensures your recruitment process is professional, compliant, and efficient.
                  </p>

                  <div className="grid grid-cols-3 gap-6 lg:gap-12 mb-14 border-y border-white/10 py-10">
                     <div className="text-center lg:text-left">
                        <div className="text-3xl lg:text-5xl font-black text-white mb-2">
                           98%
                        </div>
                        <div className="text-[10px] text-teal-400 font-bold uppercase tracking-widest">Retention Rate</div>
                     </div>
                     <div className="text-center lg:text-left">
                        <div className="text-3xl lg:text-5xl font-black text-white mb-2">24h</div>
                        <div className="text-[10px] text-teal-400 font-bold uppercase tracking-widest">Placement Avg</div>
                     </div>
                     <div className="text-center lg:text-left">
                        <div className="text-3xl lg:text-5xl font-black text-white mb-2">5k+</div>
                        <div className="text-[10px] text-teal-400 font-bold uppercase tracking-widest">Candidates</div>
                     </div>
                  </div>

                  <button
                     className="w-full lg:w-auto px-10 py-5 bg-teal-500 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-teal-400 hover:-translate-y-1 transition-all shadow-xl shadow-teal-900/20"
                  >
                     Partner With Us
                  </button>
               </div>
            </div>
         </section>

         {/* 4. CTA SECTION */}
         <section className="py-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-5 lg:px-6 relative z-10 text-center">
               <h2 className="text-4xl lg:text-6xl font-black text-slate-900 leading-tight mb-8 tracking-tighter">
                  Ready to Start Your <br />
                  <span className="text-teal-600">Maldivian Journey?</span>
               </h2>
               <p className="text-xl text-slate-500 mb-12 max-w-2xl mx-auto">
                  Join thousands of professionals who have found their dream career in the world's most beautiful archipelago.
               </p>
               <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button onClick={handleGetStarted} className="px-12 py-6 bg-slate-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 min-w-[200px]">
                     Create Profile
                  </button>
                  <button onClick={() => navigate('/jobs')} className="px-12 py-6 bg-white text-slate-900 border-2 border-slate-100 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:border-teal-500 hover:text-teal-600 transition-all min-w-[200px]">
                     Browse Jobs
                  </button>
               </div>
            </div>
         </section>

      </div>
   );
};

export default HomePage;
