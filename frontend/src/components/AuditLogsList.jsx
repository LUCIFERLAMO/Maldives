import React, { useState, useEffect } from 'react';
import { Activity, Search, RefreshCw, Loader2, Calendar } from 'lucide-react';
import API_BASE_URL from '../api/config';
import { useAuth } from '../context/AuthContext';

export const AuditLogsList = () => {
    const { token } = useAuth();
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchLogs = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/audit-logs`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                setLogs(data);
            }
        } catch (error) {
            console.error('Failed to fetch audit logs:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [token]);

    const filteredLogs = logs.filter(log => 
        log.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.url?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.method?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getMethodColor = (method) => {
        switch(method?.toUpperCase()) {
            case 'GET': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'POST': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'PUT': 
            case 'PATCH': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'DELETE': return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <Activity className="w-6 h-6 text-teal-600" />
                        System Audit Logs
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Real-time tracking of administrative and system actions</p>
                </div>
                
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:min-w-[300px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search user, endpoint, or action..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                        />
                    </div>
                    <button
                        onClick={fetchLogs}
                        disabled={isLoading}
                        className="p-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-teal-600 transition-colors flex-shrink-0 bg-white"
                        title="Refresh Logs"
                    >
                        <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin text-teal-500' : ''}`} />
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-200/80">
                                <th className="py-4 px-6 text-[10px] font-black tracking-widest text-slate-500 uppercase">Timestamp</th>
                                <th className="py-4 px-6 text-[10px] font-black tracking-widest text-slate-500 uppercase">User / Identity</th>
                                <th className="py-4 px-6 text-[10px] font-black tracking-widest text-slate-500 uppercase">Action</th>
                                <th className="py-4 px-6 text-[10px] font-black tracking-widest text-slate-500 uppercase">Endpoint</th>
                                <th className="py-4 px-6 text-[10px] font-black tracking-widest text-slate-500 uppercase text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" className="py-20 text-center">
                                        <Loader2 className="w-8 h-8 text-teal-500 animate-spin mx-auto mb-3" />
                                        <p className="text-sm font-medium text-slate-400">Loading audit trail...</p>
                                    </td>
                                </tr>
                            ) : filteredLogs.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-20 text-center text-slate-500">
                                        <Activity className="w-12 h-12 stroke-1 text-slate-200 mx-auto mb-3" />
                                        <p className="font-medium text-slate-600">No logs found</p>
                                        <p className="text-sm text-slate-400 mt-1">Try adjusting your search terms</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredLogs.map((log) => (
                                    <tr key={log._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="py-3 px-6">
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <Calendar className="w-4 h-4 text-slate-400" />
                                                {new Date(log.timestamp).toLocaleString(undefined, {
                                                    month: 'short', day: 'numeric',
                                                    hour: '2-digit', minute: '2-digit', second: '2-digit'
                                                })}
                                            </div>
                                        </td>
                                        <td className="py-3 px-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-900">{log.user}</span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{log.role} • {log.ip}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-6">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-black tracking-widest uppercase border ${getMethodColor(log.method)}`}>
                                                {log.method}
                                            </span>
                                        </td>
                                        <td className="py-3 px-6">
                                            <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                                                {log.url}
                                            </span>
                                        </td>
                                        <td className="py-3 px-6 text-center">
                                            <span className={`inline-flex items-center justify-center min-w-[3rem] px-2 py-1 rounded-md text-xs font-bold ${
                                                log.statusCode >= 200 && log.statusCode < 300 
                                                    ? 'bg-emerald-50 text-emerald-700' 
                                                    : log.statusCode >= 400 
                                                        ? 'bg-red-50 text-red-700' 
                                                        : 'bg-slate-100 text-slate-600'
                                            }`}>
                                                {log.statusCode || '---'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
