import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, Sparkles, ChevronRight } from 'lucide-react';

const SuggestedJobs = ({ skills }) => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSuggestedJobs = async () => {
            // Simplify skills array
            let skillArray = [];
            if (skills) {
                skillArray = Array.isArray(skills)
                    ? skills
                    : (typeof skills === 'string' && skills.length > 0 ? skills.split(',').map(s => s.trim()) : []);
            }
            skillArray = skillArray.filter(s => s);

            try {
                // Fetch all open jobs
                const response = await fetch('http://localhost:5000/api/jobs?status=OPEN');
                const allJobs = await response.json();

                let matches = [];

                if (skillArray.length > 0) {
                    const scoredJobs = allJobs.map(job => {
                        let score = 0;
                        const jobText = `${job.title} ${job.category} ${job.description} ${job.requirements && job.requirements.join(' ')}`.toLowerCase();
                        skillArray.forEach(skill => {
                            if (jobText.includes(skill.toLowerCase())) score += 1;
                        });
                        return { ...job, matchScore: score };
                    });

                    matches = scoredJobs.filter(j => j.matchScore > 0).sort((a, b) => b.matchScore - a.matchScore);
                }

                if (matches.length === 0) {
                    matches = allJobs.sort((a, b) => new Date(b.posted_date) - new Date(a.posted_date));
                }

                // Take top 4 for sidebar
                setJobs(matches.slice(0, 4));
            } catch (err) {
                console.error("Error fetching suggestions:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSuggestedJobs();
    }, [skills]);

    if (loading || jobs.length === 0) return null;

    return (
        <div className="bg-white rounded-2xl border-2 border-teal-500 shadow-sm p-5 w-full">
            <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-slate-900 text-lg">Recommendations</h3>
            </div>

            <div className="space-y-3">
                {jobs.map(job => (
                    <Link
                        to={`/job/${job.id}`}
                        key={job.id}
                        className="block bg-slate-50 hover:bg-teal-50 border border-slate-100 hover:border-teal-200 rounded-xl p-3 transition-colors group"
                    >
                        <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold text-slate-800 text-sm truncate pr-2 group-hover:text-teal-700">{job.title}</h4>
                            <span className="text-[9px] font-bold bg-white text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 whitespace-nowrap">
                                {job.type}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-2">
                            <span className="truncate max-w-[100px] font-medium">{job.company}</span>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                <span className="truncate max-w-[80px]">{job.location}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-1 text-[10px] font-bold text-teal-600 group-hover:text-teal-700">
                            Apply Now <ChevronRight className="w-3 h-3" />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default SuggestedJobs;
