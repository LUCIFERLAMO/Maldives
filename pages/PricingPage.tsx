import React from 'react';
import { Check, Star, Users, Globe, Briefcase, ArrowRight, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PricingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      
      {/* 1. HERO SECTION: Focus on Free Trial */}
      <div className="bg-slate-900 text-white py-20 px-4 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-maldives-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="container mx-auto text-center relative z-10 max-w-4xl">
          <span className="inline-block py-1 px-3 rounded-full bg-maldives-500/20 text-maldives-200 border border-maldives-500/30 text-xs font-bold uppercase tracking-wider mb-6">
            Recruiter Platform
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Hire Top Talent from <br/> <span className="text-maldives-400">South Asia & Beyond</span>
          </h1>
          <p className="text-slate-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Post your first <span className="text-white font-bold">5 jobs for FREE</span>. No credit card required. Experience the power of our niche ATS before you pay.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
             <Link 
               to={isAuthenticated ? "/recruiter" : "/login"}
               state={!isAuthenticated ? { from: 'recruiter' } : undefined}
               className="w-full sm:w-auto px-10 py-4 bg-maldives-600 hover:bg-maldives-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-maldives-500/25 flex items-center justify-center gap-2 text-lg"
             >
               <Briefcase className="w-5 h-5" /> Start Posting Free Jobs
             </Link>
          </div>
          
          <p className="mt-6 text-sm text-slate-500">
            Join 500+ Resorts & Companies already hiring.
          </p>
        </div>
      </div>

      {/* 2. VALUE PROP / HOW IT WORKS */}
      <div className="container mx-auto px-4 py-16">
         <div className="text-center mb-16">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">How the Free Trial Works</h2>
            <p className="text-slate-500">Simple, transparent, and fair. Just like OLX.</p>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
               <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                 <Briefcase className="w-8 h-8" />
               </div>
               <h3 className="font-bold text-lg text-slate-900 mb-2">1. Post Free Ads</h3>
               <p className="text-sm text-slate-500">Publish up to 5 job vacancies in any category (Hospitality, Medical, IT) absolutely free.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
               <div className="w-16 h-16 bg-maldives-50 text-maldives-600 rounded-full flex items-center justify-center mx-auto mb-6">
                 <Users className="w-8 h-8" />
               </div>
               <h3 className="font-bold text-lg text-slate-900 mb-2">2. Manage Candidates</h3>
               <p className="text-sm text-slate-500">Access our basic ATS to review applications, shortlist candidates, and schedule interviews.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
               <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
                 <Star className="w-8 h-8" />
               </div>
               <h3 className="font-bold text-lg text-slate-900 mb-2">3. Upgrade Later</h3>
               <p className="text-sm text-slate-500">Need more? Upgrade to Premium only when you need unlimited posts or advanced CV search.</p>
            </div>
         </div>
      </div>

      {/* 3. PREMIUM PLANS (Secondary Focus) */}
      <div className="bg-slate-100 py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Grow with Premium Solutions</h2>
            <p className="text-slate-500">Ready to scale? Unlock unlimited potential.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            {/* Unlimited Tier */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 flex flex-col relative overflow-hidden group hover:border-maldives-400 transition-colors">
              <div className="p-8 border-b border-slate-100 bg-white">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Unlimited Job Postings</h3>
                <div className="flex items-baseline gap-1 mb-2">
                   <span className="text-4xl font-bold text-slate-900">$1,590</span>
                   <span className="text-slate-500 text-sm">/ year</span>
                </div>
                <p className="text-slate-500 text-sm">For resorts hiring all year round.</p>
              </div>
              <div className="p-8 flex-grow bg-slate-50/50">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 text-sm text-slate-700">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span><span className="font-bold text-slate-900">Unlimited</span> Active Job Posts</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-700">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Priority Support</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-700">
                    <Star className="w-5 h-5 text-amber-500 flex-shrink-0" />
                    <span>Featured Listings (Top of Search)</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-700">
                    <Globe className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <span>Social Media Promotion (FB, Insta)</span>
                  </li>
                </ul>
              </div>
              <div className="p-8 pt-0 bg-slate-50/50">
                <button className="w-full py-3 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-lg hover:border-slate-800 hover:text-slate-900 transition-colors">
                  Contact Sales
                </button>
              </div>
            </div>

            {/* CV Access Tier */}
            <div className="bg-slate-900 rounded-xl shadow-xl text-white flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-maldives-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                RECOMMENDED
              </div>
              <div className="p-8 border-b border-slate-700">
                <h3 className="text-xl font-bold mb-2">Full Database Access</h3>
                <div className="flex items-baseline gap-1 mb-2">
                   <span className="text-4xl font-bold">$2,120</span>
                   <span className="text-slate-400 text-sm">/ year</span>
                </div>
                <p className="text-slate-400 text-sm">Proactive hiring power.</p>
              </div>
              <div className="p-8 flex-grow">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <Users className="w-5 h-5 text-maldives-400 flex-shrink-0" />
                    <span>Access <span className="font-bold text-white">45,000+ CV Database</span></span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <Check className="w-5 h-5 text-maldives-400 flex-shrink-0" />
                    <span>Unlimited Job Postings Included</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <Check className="w-5 h-5 text-maldives-400 flex-shrink-0" />
                    <span>Advanced Candidate Filters</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <Globe className="w-5 h-5 text-maldives-400 flex-shrink-0" />
                    <span>Dedicated Account Manager</span>
                  </li>
                </ul>
              </div>
              <div className="p-8 pt-0">
                <button className="w-full py-3 bg-maldives-600 text-white font-bold rounded-lg hover:bg-maldives-500 transition-colors shadow-lg shadow-maldives-900/50">
                  Get Full Access
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;